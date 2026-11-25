import { AREAS, CORE, DIMS, QUESTIONS, CARDS, EXAMPLE_PROFILE, PROFILE_FIELDS } from "./questions.js";
import { LESSONS } from "./lessons.js";

/* ======================= helpers ======================= */
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage blocked: keep in memory */ } },
};
const K = { attempts: "csmqa.attempts", profile: "csmqa.profile", settings: "csmqa.settings", learn: "csmqa.learn" };

/* ======================= state ======================= */
let attempts = store.get(K.attempts, []);
let profile = store.get(K.profile, null);
let settings = Object.assign({ autoRead: true, lang: "en-US" }, store.get(K.settings, {}));
let aiOn = false, aiModel = null, hasLocal = false;
let mode = "learn", phase = "intro";
let lessons = LESSONS; // replaced by local/lessons.json when the server has one
let learned = store.get(K.learn, {}); // lessonId -> { read, right, total }
let learn = { area: null, i: 0, picked: {} };
let practice = null; // { area } when practising one area outside a mock
let cur = null, answer = "", lastFb = null, errMsg = "";
let mock = null, hot = null, report = null, tick = null;
let deck = [], card = { pos: 0, shown: false };
const seen = new Set();

const projectName = () => (profile && profile.project && profile.project.trim()) || "your project";
const fill = (s) => String(s).replaceAll("{p}", projectName());

/* ======================= speech in (Web Speech API) ======================= */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let rec = null, listening = false, listenStart = 0, listenSecs = 0, wantListen = false;
function makeRec() {
  if (!SR) return null;
  const r = new SR();
  r.continuous = true; r.interimResults = true; r.lang = settings.lang;
  r.onstart = () => { listening = true; listenStart = Date.now(); paintMic(); };
  r.onresult = (e) => {
    let interim = "";
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const res = e.results[i];
      if (res.isFinal) {
        const ta = $("#answer"); if (!ta) continue;
        const t = res[0].transcript.trim();
        ta.value = ta.value ? ta.value.replace(/\s*$/, " ") + t : t;
        answer = ta.value;
      } else interim += res[0].transcript;
    }
    const p = $("#partial"); if (p) p.textContent = interim;
  };
  r.onerror = (e) => {
    if (e.error === "not-allowed" || e.error === "service-not-allowed") { errMsg = "Microphone access was blocked. Allow it in the browser's address bar, or type your answer."; wantListen = false; }
    else if (e.error === "no-speech") { /* keep going */ }
    else if (e.error !== "aborted") errMsg = `Speech recognition stopped (${e.error}). Press the mic again or type.`;
    showErr();
  };
  r.onend = () => {
    if (listening) listenSecs += (Date.now() - listenStart) / 1000;
    listening = false;
    if (wantListen) { try { r.start(); return; } catch { wantListen = false; } } // Chrome stops after silence; restart while the user wants to talk
    const p = $("#partial"); if (p) p.textContent = "";
    paintMic();
  };
  return r;
}
function micClick() {
  errMsg = ""; showErr();
  if (!SR) { $("#answer")?.focus(); return; }
  if (!rec) rec = makeRec();
  if (wantListen) { wantListen = false; rec.stop(); return; }
  speechSynthesis?.cancel();
  rec.lang = settings.lang;
  wantListen = true;
  try { rec.start(); } catch { /* already started */ }
  paintMic();
}
function stopListening() { if (rec && wantListen) { wantListen = false; rec.stop(); } }
function paintMic() {
  const b = $("#mic"); if (!b) return;
  const on = wantListen || listening;
  b.classList.toggle("on", on);
  b.querySelector(".lab").textContent = !SR ? "Type your answer" : on ? "Stop" : "Answer by voice";
}
function showErr() { const e = $("#err"); if (e) { e.hidden = !errMsg; e.textContent = errMsg; } }

/* ======================= speech out ======================= */
function speak(text) {
  if (!settings.autoRead || !("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = settings.lang.startsWith("de") ? "en-GB" : settings.lang; // questions are in English
  u.rate = 1;
  speechSynthesis.speak(u);
}

/* ======================= scoring ======================= */
function record(at) { attempts.push(at); attempts = attempts.slice(-600); store.set(K.attempts, attempts); renderSide(); }
function cellScore(area, dim) {
  const vals = attempts.filter((a) => a.area === area && typeof a[dim] === "number").map((a) => a[dim]);
  if (!vals.length) return null;
  const last = vals.slice(-4);
  return last.reduce((s, v) => s + v, 0) / (last.length * 2);
}
function weakest() {
  let best = null;
  for (const ar of [...CORE, "DC"]) for (const d of ["t", "a", "r"]) {
    const s = cellScore(ar, d); const v = s === null ? -1 : s;
    if (!best || v < best.v) best = { area: ar, dim: d, v };
  }
  return best;
}
const cls = (p) => (p === null ? "" : p >= 0.75 ? "g" : p >= 0.45 ? "w" : "b");

/* ======================= picking ======================= */
function pickFor(area, dim) {
  let pool = QUESTIONS.filter((q) => q.area === area && (!dim || q.dim === dim));
  if (!pool.length) pool = QUESTIONS.filter((q) => q.area === area);
  const fresh = pool.filter((q) => !seen.has(q.id));
  const list = fresh.length ? fresh : pool;
  return list[Math.floor(Math.random() * list.length)];
}
function nextMockQuestion() {
  const covered = new Set(mock.items.map((i) => i.q.area));
  const missing = CORE.filter((a) => !covered.has(a));
  if (missing.length) {
    const area = missing[Math.floor(Math.random() * missing.length)];
    const ds = ["t", "a", "r"].map((d) => ({ d, s: cellScore(area, d) ?? -1 })).sort((x, y) => x.s - y.s);
    const dim = Math.random() < 0.7 ? ds[0].d : ["t", "a", "r", "h"][Math.floor(Math.random() * 4)];
    return pickFor(area, dim);
  }
  const w = weakest();
  return pickFor(w.area, Math.random() < 0.3 ? "h" : w.dim);
}
function pickHot() {
  const pool = QUESTIONS.filter((q) => q.dim === "h" && !seen.has(q.id));
  const list = pool.length ? pool : QUESTIONS.filter((q) => q.dim === "h");
  return list[Math.floor(Math.random() * list.length)];
}

/* ======================= server ======================= */
async function api(path, body) {
  const r = await fetch(path, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || `Request failed (${r.status})`);
  return data;
}
async function grade(item, text) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const wpm = listenSecs > 5 ? Math.round(words / (listenSecs / 60)) : null;
  if (!aiOn) return { self: true, words, wpm };
  try {
    const q = item.q;
    const r = await api("/api/grade", {
      question: { area: AREAS[q.area].name, dim: DIMS[q.dim], q: fill(q.q), keys: q.keys.map(fill) },
      asked: item.followUp || fill(q.q), answer: text, profile,
    });
    const n = (v) => (v === 0 || v === 1 || v === 2 ? v : null);
    return { t: n(r.theory), a: n(r.application), r: n(r.reflection), covered: (r.covered || []).slice(0, 8), missed: (r.missed || []).slice(0, 8),
      feedback: String(r.feedback || ""), better: String(r.better || ""), followup: String(r.followup || ""), words, wpm };
  } catch (e) { return { error: e.message, words, wpm }; }
}

/* ======================= routing ======================= */
function setMode(m) {
  stopTick(); stopListening(); if ("speechSynthesis" in window) speechSynthesis.cancel();
  mode = m; phase = "intro"; cur = null; lastFb = null; answer = ""; mock = null; hot = null; practice = null;
  if (m === "learn") learn = { area: null, i: 0, picked: {} };
  if (location.hash !== "#" + m) history.replaceState(null, "", "#" + m);
  if (m === "cards") startCards();
  renderAll();
}
function renderAll() {
  document.querySelectorAll(".tab").forEach((t) => (t.dataset.mode === mode ? t.setAttribute("aria-current", "page") : t.removeAttribute("aria-current")));
  renderStatus(); renderMain(); renderSide();
}
function renderStatus() {
  const s = $("#status");
  const parts = [
    `<span class="pill">${aiOn ? `AI grading on · ${esc(aiModel)}` : "AI grading off · self-grading"}</span>`,
    `<span class="pill">${SR ? "Voice input ready" : "Voice input not supported here: use Chrome or Edge, or type"}</span>`,
    `<span class="pill">Project: ${esc(projectName())}</span>`,
  ];
  s.innerHTML = parts.join("");
}

/* ======================= main views ======================= */
function renderMain() {
  const m = $("#main");
  if (mode === "learn") { m.innerHTML = learn.area ? lessonView() : learnHome(); bindLearn(); return; }
  if (mode === "profile") { m.innerHTML = profileView(); bindProfile(); return; }
  if (mode === "wall") { m.innerHTML = wallIntro(); bindWallIntro(); return; }
  if (mode === "cards") { m.innerHTML = cardsView(); bindCards(); return; }
  if (!profile && phase === "intro") { m.innerHTML = welcomeView(); bindWelcome(); return; }
  if (phase === "intro") { m.innerHTML = introView(); bindIntro(); return; }
  if (phase === "report") { m.innerHTML = reportView(); bindReport(); return; }
  m.innerHTML = askView(); bindAsk();
}

function welcomeView() {
  return `<section class="card intro">
    <h2>First, tell it about your project</h2>
    <p>The examiner asks about <b>your</b> project: your stakeholders, your pitch, your negotiation. Fill in a short profile so the questions and feedback fit. It stays in this browser.</p>
    <div class="row" style="margin-top:14px">
      <button class="btn primary" id="toProfile">Describe my project</button>
      <button class="btn" id="useExample">Try with an example project</button>
      <button class="btn" id="skipProfile">Skip for now</button>
    </div>
  </section>`;
}
function bindWelcome() {
  $("#toProfile").onclick = () => setMode("profile");
  $("#useExample").onclick = () => { profile = { ...EXAMPLE_PROFILE }; store.set(K.profile, profile); renderAll(); };
  $("#skipProfile").onclick = () => { profile = {}; store.set(K.profile, profile); renderAll(); };
}

function introView() {
  const settingsRow = `<div class="row small" style="margin-top:10px">
      <label class="row"><input type="checkbox" id="autoread" ${settings.autoRead ? "checked" : ""}> Read questions aloud</label>
      <label class="row">Speech language <select id="lang" style="width:auto">
        ${[["en-US", "English (US)"], ["en-GB", "English (UK)"], ["de-DE", "German accent → English text"]].map(([v, l]) => `<option value="${v}" ${settings.lang === v ? "selected" : ""}>${l}</option>`).join("")}
      </select></label></div>`;
  if (mode === "hot") return `<section class="card intro">
    <h2>Hot seat</h2>
    <p>Tough, pushy questions like the ones an examiner asks when they find a weak spot. You get <b>60 seconds</b> per answer. Stay calm: answer first, then explain.</p>
    ${settingsRow}
    <div class="row" style="margin-top:14px"><button class="btn primary" id="go">Start hot seat</button></div>
  </section>`;
  return `<section class="card intro">
    <h2>15-minute mock Q&amp;A</h2>
    <p>The examiner first asks one question in each of the six knowledge areas, then returns to wherever you're weakest, and follows up when something is missing.</p>
    <div class="areas">${CORE.map((a) => `<span class="plate"><b>${AREAS[a].no}</b>${esc(AREAS[a].name)}</span>`).join("")}</div>
    <ol>
      <li>Listen to the question (or read it).</li>
      <li>Press <b>Answer by voice</b>, speak, press <b>Stop</b>. Fix the text if the browser misheard you.</li>
      <li>Press <b>Grade</b>. ${aiOn ? "Claude scores theory, application and reflection, lists what you missed and writes a stronger answer." : "Tick the key points you covered (for AI feedback add an API key or install Claude Code, see the README)."}</li>
      <li>After 15 minutes you get a report per area.</li>
    </ol>
    ${settingsRow}
    <div class="row" style="margin-top:14px"><button class="btn primary" id="go">Start mock Q&amp;A</button></div>
  </section>`;
}
function bindIntro() {
  $("#autoread").onchange = (e) => { settings.autoRead = e.target.checked; store.set(K.settings, settings); };
  $("#lang").onchange = (e) => { settings.lang = e.target.value; store.set(K.settings, settings); };
  $("#go").onclick = () => {
    if (mode === "mock") { mock = { endsAt: Date.now() + 15 * 60 * 1000, items: [] }; askNew(nextMockQuestion()); }
    else { hot = {}; askNew(pickHot()); }
  };
}

function askNew(q, followUp) {
  seen.add(q.id);
  cur = { q, followUp: followUp || "" };
  phase = "ask"; answer = ""; lastFb = null; listenSecs = 0; errMsg = "";
  if (mode === "hot") hot.endsAt = Date.now() + 60 * 1000;
  renderMain(); startTick();
  speak(followUp || fill(q.q));
}
function timerText() {
  let ms;
  if (mode === "mock" && mock) ms = mock.endsAt - Date.now();
  else if (mode === "hot" && hot && hot.endsAt && phase === "ask") ms = hot.endsAt - Date.now();
  else return "";
  const s = Math.ceil(Math.max(0, ms) / 1000);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}
function startTick() {
  stopTick();
  tick = setInterval(() => {
    const el = $("#timer"); if (el) {
      el.textContent = timerText();
      el.classList.toggle("low", (mode === "mock" && mock && mock.endsAt - Date.now() < 120000) || (mode === "hot" && hot && hot.endsAt - Date.now() < 10000));
    }
    if (mode === "hot" && hot && phase === "ask" && Date.now() >= hot.endsAt) stopListening();
    if (mode === "mock" && mock && Date.now() >= mock.endsAt) $("#finish")?.classList.add("primary");
  }, 500);
}
function stopTick() { if (tick) clearInterval(tick); tick = null; }

function askView() {
  const q = cur.q, a = AREAS[q.area];
  return `<section class="card">
    <div class="qhead">
      <div class="row"><span class="plate"><b>${a.no}</b>${esc(a.name)}</span><span class="dimchip">${esc(DIMS[q.dim])}</span></div>
      <span class="timer" id="timer">${timerText()}</span>
    </div>
    ${cur.followUp ? `<div class="followtag">Follow-up</div>` : ""}
    <p class="question">${esc(cur.followUp || fill(q.q))}</p>
    <div class="row" style="margin-top:14px">
      <button class="mic" id="mic" ${phase !== "ask" ? "disabled" : ""}><span class="dot"></span><span class="lab">Answer by voice</span></button>
      ${"speechSynthesis" in window ? `<button class="btn" id="replay">Read question again</button>` : ""}
      <button class="btn" id="hint">Show a hint</button>
    </div>
    <div class="tip" id="tipbox" hidden>${esc(fill(q.tip))}</div>
    <div class="notice" id="err" hidden></div>
    <div class="partial" id="partial"></div>
    <label for="answer" class="meta">Your answer (fix it before grading if the browser misheard something)</label>
    <textarea id="answer" placeholder="Speak with the mic, or type here." ${phase !== "ask" ? "readonly" : ""}>${esc(answer)}</textarea>
    <div class="row" style="margin-top:12px">
      ${phase === "ask" ? `<button class="btn dark" id="grade">Grade my answer</button><button class="btn" id="skip">Skip</button>` : ""}
      ${phase === "grading" ? `<span class="meta">Grading…</span>` : ""}
      ${mode === "mock" ? `<button class="btn" id="finish">Finish and see report</button>` : ""}
    </div>
  </section>
  ${lastFb ? feedbackView(lastFb) : ""}`;
}
function scoreBox(label, v) {
  if (v === null || v === undefined) return `<div class="score na"><div class="lab">${label}</div><div class="val">not asked</div></div>`;
  return `<div class="score s${v}"><div class="lab">${label}</div><div class="val">${v}/2</div></div>`;
}
function feedbackView(fb) {
  if (fb.error) return `<section class="card fb"><div class="notice">${esc(fb.error)}</div>
    <div class="row" style="margin-top:10px"><button class="btn dark" id="regrade">Grade again</button><button class="btn" id="selfgrade">Grade myself</button></div></section>`;
  if (fb.self) return `<section class="card fb"><h2 class="h-small">Grade yourself</h2>
    <p class="meta">Tick every point your answer actually covered.</p>
    <div class="checks">${cur.q.keys.map((k, i) => `<label><input type="checkbox" id="k${i}"> <span>${esc(fill(k))}</span></label>`).join("")}</div>
    <h3>How a strong answer is built</h3><p class="better">${esc(fill(cur.q.tip))}</p>
    <div class="row" style="margin-top:12px"><button class="btn dark" id="saveself">Save and continue</button></div></section>`;
  const pace = fb.wpm ? `<span class="pill">${fb.wpm} words/min${fb.wpm > 170 ? " · slow down" : fb.wpm < 100 ? " · a bit slow" : " · good pace"}</span>` : "";
  const canFollow = fb.followup && mode === "mock" && !cur.followUp;
  return `<section class="card fb">
    <div class="row" style="justify-content:space-between"><h2 class="h-small">Feedback</h2><div class="row">${pace}<span class="pill">${fb.words} words</span></div></div>
    <div class="scores">${scoreBox("Theory", fb.t)}${scoreBox("Application", fb.a)}${scoreBox("Reflection", fb.r)}</div>
    <p>${esc(fb.feedback)}</p>
    ${fb.covered.length ? `<h3>You covered</h3><ul>${fb.covered.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
    ${fb.missed.length ? `<h3>You missed</h3><ul>${fb.missed.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
    ${fb.better ? `<h3>A stronger answer</h3><p class="better">${esc(fb.better)}</p>` : ""}
    <div class="row" style="margin-top:14px">
      ${canFollow ? `<button class="btn primary" id="follow">Answer the follow-up</button>` : ""}
      <button class="btn ${canFollow ? "" : "primary"}" id="next">Next question</button>
      <button class="btn" id="retry">Try this one again</button>
      ${lessons.some((l) => l.area === cur.q.area) ? `<button class="btn" id="learnit">Learn ${esc(AREAS[cur.q.area].name.toLowerCase())}</button>` : ""}
    </div>
    ${canFollow ? `<p class="meta" style="margin-top:8px">The examiner would ask: “${esc(fb.followup)}”</p>` : ""}
  </section>`;
}
function bindAsk() {
  $("#mic")?.addEventListener("click", micClick);
  $("#replay")?.addEventListener("click", () => { const keep = settings.autoRead; settings.autoRead = true; speak(cur.followUp || fill(cur.q.q)); settings.autoRead = keep; });
  $("#hint")?.addEventListener("click", () => { const t = $("#tipbox"); t.hidden = !t.hidden; });
  const ta = $("#answer"); ta?.addEventListener("input", () => (answer = ta.value));
  $("#grade")?.addEventListener("click", doGrade);
  $("#skip")?.addEventListener("click", goNext);
  $("#finish")?.addEventListener("click", finishMock);
  $("#regrade")?.addEventListener("click", doGrade);
  $("#selfgrade")?.addEventListener("click", () => { lastFb = { self: true, words: lastFb.words, wpm: lastFb.wpm }; renderMain(); });
  $("#saveself")?.addEventListener("click", saveSelf);
  $("#follow")?.addEventListener("click", () => askNew(cur.q, lastFb.followup));
  $("#next")?.addEventListener("click", goNext);
  $("#retry")?.addEventListener("click", () => askNew(cur.q, cur.followUp));
  $("#learnit")?.addEventListener("click", () => openArea(cur.q.area));
  paintMic(); showErr();
}
async function doGrade() {
  stopListening();
  answer = ($("#answer")?.value || answer).trim();
  if (!answer) { errMsg = "Say or type an answer first."; showErr(); return; }
  phase = "grading"; renderMain();
  const fb = await grade(cur, answer);
  lastFb = fb; phase = fb.error ? "ask" : "feedback";
  if (!fb.self && !fb.error) {
    record({ qid: cur.q.id, area: cur.q.area, dim: cur.q.dim, mode, t: fb.t, a: fb.a, r: fb.r, at: Date.now(), wpm: fb.wpm, q: (cur.followUp || fill(cur.q.q)).slice(0, 200) });
    if (mock) mock.items.push({ q: cur.q, text: cur.followUp || fill(cur.q.q), t: fb.t, a: fb.a, r: fb.r, missed: fb.missed });
  }
  renderMain();
  if (!fb.self && !fb.error && fb.feedback) speak(fb.feedback);
}
function saveSelf() {
  const n = cur.q.keys.length; let hit = 0;
  cur.q.keys.forEach((_, i) => { if ($("#k" + i)?.checked) hit++; });
  const ratio = hit / n; const s = ratio >= 0.75 ? 2 : ratio >= 0.34 ? 1 : 0;
  const at = { qid: cur.q.id, area: cur.q.area, dim: cur.q.dim, mode, t: null, a: null, r: null, at: Date.now(), wpm: lastFb?.wpm || null, q: (cur.followUp || fill(cur.q.q)).slice(0, 200), self: true };
  at[cur.q.dim === "h" ? "a" : cur.q.dim] = s;
  record(at);
  if (mock) mock.items.push({ q: cur.q, text: cur.followUp || fill(cur.q.q), t: at.t, a: at.a, r: at.r, missed: cur.q.keys.filter((_, i) => !$("#k" + i)?.checked).map(fill) });
  goNext();
}
function goNext() {
  if (mode === "mock" && !mock) { const a = practice?.area || cur.q.area; return askNew(pickFor(a, weakestDim(a))); }
  if (mode === "mock") { if (mock && Date.now() >= mock.endsAt) return finishMock(); return askNew(nextMockQuestion()); }
  askNew(pickHot());
}

/* ======================= report ======================= */
async function finishMock() {
  stopListening(); stopTick(); phase = "report";
  report = { loading: aiOn && mock && mock.items.length > 0 };
  renderMain();
  if (!report.loading) return;
  try {
    const r = await api("/api/report", { items: mock.items.map((i) => ({ area: AREAS[i.q.area].name, text: i.text, t: i.t, a: i.a, r: i.r, missed: i.missed })) });
    report = { verdict: r.verdict, strongest: r.strongest, weakest: r.weakest, next: r.next || [] };
  } catch { report = { error: true }; }
  renderMain();
}
function reportView() {
  const items = mock ? mock.items : [];
  const rows = [...CORE, "DC"].map((ar) => {
    const its = items.filter((i) => i.q.area === ar);
    if (!its.length && ar === "DC") return "";
    const avg = (d) => { const v = its.map((i) => i[d]).filter((x) => typeof x === "number"); return v.length ? (v.reduce((s, x) => s + x, 0) / v.length).toFixed(1) : "–"; };
    return `<tr><td>${esc(AREAS[ar].name)}${its.length ? "" : ` <span class="pill">not asked</span>`}</td><td class="n">${its.length}</td><td class="n">${avg("t")}</td><td class="n">${avg("a")}</td><td class="n">${avg("r")}</td></tr>`;
  }).join("");
  const missing = CORE.filter((a) => !items.some((i) => i.q.area === a));
  return `<section class="card report">
    <h2 style="font-size:24px">Mock Q&amp;A report</h2>
    <p class="meta">${items.length} answers graded${missing.length ? ` · not covered: ${esc(missing.map((a) => AREAS[a].name).join(", "))}` : " · all six areas covered"}</p>
    <div class="tablewrap"><table><thead><tr><th>Area</th><th>Answers</th><th>Theory</th><th>Application</th><th>Reflection</th></tr></thead><tbody>${rows}</tbody></table></div>
    ${report?.loading ? `<p class="meta" style="margin-top:12px">Writing your coaching notes…</p>` : ""}
    ${report?.verdict ? `<h3 style="margin-top:16px">Verdict</h3><p>${esc(report.verdict)}</p><p><b>Strongest:</b> ${esc(report.strongest)} · <b>Weakest:</b> ${esc(report.weakest)}</p><h3>Practise next</h3><ul>${report.next.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
    ${report?.error ? `<div class="notice">Coaching notes couldn't load. The scores above are saved.</div>` : ""}
    <div class="row" style="margin-top:14px"><button class="btn primary" id="again">New mock Q&amp;A</button><button class="btn" id="towall">Open the locker wall</button></div>
  </section>`;
}
function bindReport() {
  $("#again").onclick = () => { mock = { endsAt: Date.now() + 15 * 60 * 1000, items: [] }; askNew(nextMockQuestion()); };
  $("#towall").onclick = () => setMode("wall");
}

/* ======================= theory cards ======================= */
function startCards() {
  deck = CARDS.map((c, i) => ({ i, s: cellScore(c.area, "t") ?? -1, r: Math.random() })).sort((x, y) => x.s - y.s || x.r - y.r).map((x) => x.i);
  card = { pos: 0, shown: false };
}
function cardsView() {
  if (!deck.length) startCards();
  const c = CARDS[deck[card.pos % deck.length]];
  return `<section class="card">
    <div class="qhead"><span class="plate"><b>${AREAS[c.area].no}</b>${esc(AREAS[c.area].name)}</span><span class="meta">${(card.pos % deck.length) + 1} / ${deck.length}</span></div>
    <div class="flash">
      <div class="term">${esc(c.term)}</div>
      <p class="muted">Say out loud: what it is, who it's from, and where you used it in ${esc(projectName())}. Then flip.</p>
      ${card.shown ? `<div class="back"><p class="meta">${esc(c.who)}</p><p><b>${esc(c.def)}</b></p><p class="muted">Now: one concrete example from ${esc(projectName())}.</p></div>` : ""}
    </div>
    <div class="row" style="margin-top:10px">
      ${card.shown ? `<button class="btn" data-mark="0">Missed it</button><button class="btn" data-mark="1">Partly</button><button class="btn primary" data-mark="2">Got it</button>` : `<button class="btn dark" id="flip">Flip card</button><button class="btn" id="skipcard">Skip</button>`}
    </div>
  </section>`;
}
function bindCards() {
  $("#flip")?.addEventListener("click", () => { card.shown = true; renderMain(); });
  $("#skipcard")?.addEventListener("click", () => { card.pos++; card.shown = false; renderMain(); });
  document.querySelectorAll("[data-mark]").forEach((b) => b.addEventListener("click", () => {
    const c = CARDS[deck[card.pos % deck.length]];
    record({ qid: "card:" + c.term, area: c.area, dim: "t", mode: "cards", t: Number(b.dataset.mark), a: null, r: null, at: Date.now(), q: c.term });
    card.pos++; card.shown = false; renderMain();
  }));
}


/* ======================= learn ======================= */
const LEARN_AREAS = [...CORE, "DC"];
const areaLessons = (a) => lessons.filter((l) => l.area === a);
function areaProgress(a) {
  const ls = areaLessons(a);
  const read = ls.filter((l) => learned[l.id]?.read).length;
  let right = 0, total = 0;
  ls.forEach((l) => { if (learned[l.id]?.total) { right += learned[l.id].right; total += learned[l.id].total; } });
  return { n: ls.length, read, right, total };
}
function nextUnread() {
  for (const a of LEARN_AREAS) { const i = areaLessons(a).findIndex((l) => !learned[l.id]?.read); if (i >= 0) return { a, i }; }
  return null;
}
function openArea(a, i = 0) {
  stopTick(); stopListening();
  mode = "learn"; phase = "intro"; practice = null; mock = null; hot = null;
  if (location.hash !== "#learn") history.replaceState(null, "", "#learn");
  // Shuffle the answer order each time a lesson opens, so the right answer's position can't be learned.
  const l = areaLessons(a)[i];
  const order = (l?.checks || []).map((c) => c.options.map((_, k) => k).sort(() => Math.random() - 0.5));
  learn = { area: a, i, picked: {}, order };
  renderAll(); window.scrollTo({ top: 0, behavior: "smooth" });
}
function learnHome() {
  const nu = nextUnread();
  const total = lessons.length, done = lessons.filter((l) => learned[l.id]?.read).length;
  const cards = LEARN_AREAS.map((a) => {
    const p = areaProgress(a); if (!p.n) return "";
    const pct = p.total ? Math.round((p.right / p.total) * 100) : null;
    const state = p.read === p.n ? "done" : p.read ? "started" : "";
    return `<div class="lesson-area ${state}">
      <div class="row" style="justify-content:space-between"><span class="plate"><b>${AREAS[a].no}</b>${esc(AREAS[a].name)}</span>${a === "DC" ? `<span class="meta">module goal</span>` : ""}</div>
      <div class="bar" aria-hidden="true"><i style="width:${Math.round((p.read / p.n) * 100)}%"></i></div>
      <p class="meta">${p.read}/${p.n} lessons read${pct === null ? "" : ` · checks ${pct}% right`}</p>
      <div class="row">
        <button class="btn ${state === "done" ? "" : "dark"}" data-open="${a}">${state === "done" ? "Review" : state ? "Continue" : "Start"}</button>
        ${p.read ? `<button class="btn" data-test="${a}">Test me on this</button>` : ""}
      </div>
    </div>`;
  }).join("");
  return `<section class="card intro">
    <h2>Learn first, then test</h2>
    <p>Each area has a few short lessons: what the idea means in plain words, ${lessons.some((l) => l.karina) ? "what Karina said in class, " : ""}how it applies to ${esc(projectName())}, and one line to remember. Each lesson ends with 2–3 quick checks. When an area is done, test yourself on it out loud.</p>
    <p class="tip"><b>How the Q&amp;A is graded:</b> a high grade needs both: apply each concept to ${esc(projectName())} with concrete facts, <i>and</i> know the theory and the key names behind it. Then say what you'd do differently (reflection).</p>
    <p class="meta">${done}/${total} lessons read. <span class="tag class">From class</span> was covered in the lectures, <span class="tag extra">Extra</span> fills a gap the lectures didn't cover.</p>
    ${nu ? `<div class="next">Next up: <b>${esc(areaLessons(nu.a)[nu.i].title)}</b> <button class="btn primary" style="margin-left:8px" id="nextLesson">${done ? "Continue learning" : "Start learning"}</button></div>` : `<div class="next">All lessons read. Run a <b>mock Q&amp;A</b> to put it together.</div>`}
  </section>
  <div class="lesson-grid">${cards}</div>`;
}
function lessonView() {
  const ls = areaLessons(learn.area), l = ls[learn.i]; if (!l) { learn.area = null; return learnHome(); }
  const last = learn.i === ls.length - 1;
  const checks = (l.checks || []).map((c, ci) => {
    const pick = learn.picked[ci];
    const opts = (learn.order?.[ci] || c.options.map((_, k) => k)).map((oi) => {
      const o = c.options[oi];
      const st = pick === undefined ? "" : oi === c.answer ? "right" : oi === pick ? "wrong" : "dim";
      return `<button class="opt ${st}" data-c="${ci}" data-o="${oi}" ${pick !== undefined ? "disabled" : ""}>${esc(fill(o))}</button>`;
    }).join("");
    return `<div class="check"><p class="cq">${ci + 1}. ${esc(fill(c.q))}</p><div class="opts">${opts}</div>
      ${pick !== undefined ? `<p class="why ${pick === c.answer ? "ok" : "no"}"><b>${pick === c.answer ? "Right." : "Not quite."}</b> ${esc(fill(c.why))}</p>` : ""}</div>`;
  }).join("");
  const nChecks = (l.checks || []).length;
  return `<section class="card lesson">
    <div class="qhead">
      <div class="row"><span class="plate"><b>${AREAS[l.area].no}</b>${esc(AREAS[l.area].name)}</span><span class="tag ${l.source === "class" ? "class" : "extra"}">${l.source === "class" ? `From class${l.when ? " · " + esc(l.when) : ""}` : "Extra"}</span></div>
      <span class="meta">Lesson ${learn.i + 1} / ${ls.length}</span>
    </div>
    <h2 class="ltitle">${esc(l.title)}</h2>
    ${l.who ? `<p class="meta">${esc(l.who)}</p>` : ""}
    <p class="plain">${esc(fill(l.plain))}</p>
    ${l.points?.length ? `<ul class="points">${l.points.map((x) => `<li>${esc(fill(x))}</li>`).join("")}</ul>` : ""}
    ${l.karina ? `<blockquote class="karina"><span class="meta">In class</span>${esc(l.karina)}</blockquote>` : ""}
    ${l.example ? `<div class="example"><span class="meta">Your example: ${esc(projectName())}</span><p>${esc(fill(l.example))}</p></div>` : ""}
    ${l.apply ? `<div class="example"><span class="meta">Apply it to ${esc(projectName())}</span><p>${esc(fill(l.apply))}</p></div>` : ""}
    ${l.remember ? `<p class="remember"><b>Remember:</b> ${esc(fill(l.remember))}</p>` : ""}
  </section>
  ${nChecks ? `<section class="card"><h2 class="h-small">Quick check</h2>${checks}</section>` : ""}
  <div class="row lesson-nav">
    <button class="btn" id="toAreas">All areas</button>
    ${learn.i > 0 ? `<button class="btn" id="prevLesson">Previous</button>` : ""}
    ${last ? `<button class="btn primary" id="areaTest">Done: test me on ${esc(AREAS[l.area].name.toLowerCase())}</button><button class="btn" id="nextArea">Next area</button>`
           : `<button class="btn primary" id="nextLessonBtn">Next lesson</button>`}
  </div>`;
}
function markRead() {
  const l = areaLessons(learn.area)[learn.i]; if (!l) return;
  const nAns = Object.keys(learn.picked).length;
  const right = Object.entries(learn.picked).filter(([ci, o]) => l.checks[ci].answer === o).length;
  const prev = learned[l.id] || {};
  learned[l.id] = { read: true, right: nAns ? right : prev.right || 0, total: nAns ? nAns : prev.total || 0 };
  store.set(K.learn, learned);
}
function bindLearn() {
  document.querySelectorAll("[data-open]").forEach((b) => b.addEventListener("click", () => {
    const a = b.dataset.open; const i = areaLessons(a).findIndex((l) => !learned[l.id]?.read); openArea(a, i < 0 ? 0 : i);
  }));
  document.querySelectorAll("[data-test]").forEach((b) => b.addEventListener("click", () => drill(b.dataset.test, weakestDim(b.dataset.test))));
  $("#nextLesson")?.addEventListener("click", () => { const n = nextUnread(); if (n) openArea(n.a, n.i); });
  document.querySelectorAll(".opt").forEach((b) => b.addEventListener("click", () => {
    learn.picked[Number(b.dataset.c)] = Number(b.dataset.o);
    const l = areaLessons(learn.area)[learn.i];
    if (Object.keys(learn.picked).length === (l.checks || []).length) markRead();
    const y = window.scrollY; renderMain(); renderSide(); window.scrollTo(0, y);
  }));
  $("#toAreas")?.addEventListener("click", () => { markRead(); learn = { area: null, i: 0, picked: {} }; renderAll(); });
  $("#prevLesson")?.addEventListener("click", () => openArea(learn.area, learn.i - 1));
  $("#nextLessonBtn")?.addEventListener("click", () => { markRead(); openArea(learn.area, learn.i + 1); });
  $("#areaTest")?.addEventListener("click", () => { markRead(); drill(learn.area, weakestDim(learn.area)); });
  $("#nextArea")?.addEventListener("click", () => {
    markRead();
    const k = LEARN_AREAS.indexOf(learn.area);
    const nxt = LEARN_AREAS.slice(k + 1).find((a) => areaLessons(a).length);
    if (nxt) openArea(nxt); else { learn = { area: null, i: 0, picked: {} }; renderAll(); }
  });
}

/* ======================= profile ======================= */
function profileView() {
  const p = profile || {};
  return `<section class="card">
    <h2 style="font-size:24px">My project</h2>
    <p class="muted">The examiner uses this to ask about your project and to judge whether your answers apply the theory to it. Short notes are enough. Everything stays in this browser${aiOn ? " and is only sent to Claude together with an answer you grade" : ""}.</p>
    <form class="form" id="pform">
      ${PROFILE_FIELDS.map(([k, label, hint]) => k === "project"
        ? `<label for="f-${k}">${label}<span>${esc(hint)}</span><input type="text" id="f-${k}" value="${esc(p[k] || "")}"></label>`
        : `<label for="f-${k}">${label}<span>${esc(hint)}</span><textarea id="f-${k}">${esc(p[k] || "")}</textarea></label>`).join("")}
      <div class="row"><button class="btn primary" type="submit">Save profile</button>${hasLocal ? `<button class="btn" type="button" id="local">Load my profile file</button>` : ""}<button class="btn" type="button" id="example">Load example project</button><span class="meta" id="saved"></span></div>
    </form>
  </section>
  <section class="card">
    <h2 class="h-small">Progress</h2>
    <p class="meta">${attempts.length} answers saved in this browser.</p>
    <div class="row"><button class="btn" id="reset">Reset progress</button><span class="meta" id="resetmsg"></span></div>
  </section>`;
}
function bindProfile() {
  $("#pform").onsubmit = (e) => {
    e.preventDefault();
    const p = {}; PROFILE_FIELDS.forEach(([k]) => (p[k] = $("#f-" + k).value.trim()));
    profile = p; store.set(K.profile, profile); $("#saved").textContent = "Saved."; renderStatus();
  };
  $("#example").onclick = () => { profile = { ...EXAMPLE_PROFILE }; store.set(K.profile, profile); renderAll(); };
  if ($("#local")) $("#local").onclick = () => loadLocalProfile().then(renderAll);
  let armed = false;
  $("#reset").onclick = () => {
    if (!armed) { armed = true; $("#reset").textContent = "Click again to delete all saved answers"; return; }
    attempts = []; store.set(K.attempts, attempts); $("#resetmsg").textContent = "Progress cleared."; $("#reset").textContent = "Reset progress"; armed = false; renderSide();
  };
}

/* ======================= locker wall ======================= */
function wallIntro() {
  const w = weakest();
  return `<section class="card intro">
    <h2>Your locker wall</h2>
    <p>Each door is one knowledge area × one dimension. Green means solid, amber patchy, red means you'd lose points there. Grey doors haven't been tested yet.</p>
    <p>Examiners steer the Q&amp;A toward gaps, so practise the red and grey doors first. Click any door to get a question for exactly that spot.</p>
    ${w ? `<div class="next">Next to practise: <b>${esc(AREAS[w.area].name)} · ${esc(DIMS[w.dim])}</b> <button class="btn primary" style="margin-left:8px" id="drill">Practise it</button></div>` : ""}
  </section>`;
}
function bindWallIntro() { $("#drill")?.addEventListener("click", () => { const w = weakest(); drill(w.area, w.dim); }); }
function renderSide() {
  const wc = $("#wallCard");
  const rows = [...CORE, "DC"].map((ar) => {
    const doors = ["t", "a", "r"].map((d, i) => {
      const p = cellScore(ar, d);
      return `<button class="door ${cls(p)}" data-area="${ar}" data-dim="${d}" aria-label="${esc(AREAS[ar].name)}, ${DIMS[d]}: ${p === null ? "not tested" : Math.round(p * 100) + "%"}"><span class="num">${AREAS[ar].no}${"TAR"[i]}</span><span class="handle"></span><span class="pct">${p === null ? "–" : Math.round(p * 100) + "%"}</span></button>`;
    }).join("");
    return `<div class="arealab">${esc(AREAS[ar].name)}${ar === "DC" ? `<span>module goal, not one of the six</span>` : ""}</div>${doors}`;
  }).join("");
  wc.innerHTML = `<h2>Locker wall</h2>
    <p class="meta">${attempts.length ? `${attempts.length} answers saved.` : "No answers yet. Start a mock Q&A or a theory card and the doors fill in."}</p>
    <div class="wallgrid"><div></div><div class="wallhead">Theory</div><div class="wallhead">Application</div><div class="wallhead">Reflection</div>${rows}</div>
    <div class="legend"><span><i style="background:var(--good)"></i>solid</span><span><i style="background:var(--warn)"></i>patchy</span><span><i style="background:var(--bad)"></i>gap</span><span><i style="background:var(--door-edge)"></i>not tested</span></div>`;
  wc.querySelectorAll(".door").forEach((b) => b.addEventListener("click", () => drill(b.dataset.area, b.dataset.dim)));
  const recent = attempts.slice(-12).reverse();
  $("#log").innerHTML = recent.length ? recent.map((a) => {
    const sc = ["t", "a", "r"].map((d) => (typeof a[d] === "number" ? a[d] : "·")).join(" ");
    return `<li><span class="plate" style="padding:2px 6px">${AREAS[a.area]?.no || "–"}</span><span class="q" title="${esc(a.q)}">${esc(a.q)}</span><span class="pill">${sc}</span></li>`;
  }).join("") : `<li><span></span><span class="muted">Graded answers show up here with theory · application · reflection scores.</span><span></span></li>`;
}
function weakestDim(area) {
  return ["t", "a", "r"].map((d) => ({ d, s: cellScore(area, d) ?? -1, r: Math.random() })).sort((x, y) => x.s - y.s || x.r - y.r)[0].d;
}
function drill(area, dim) {
  stopTick(); mode = "mock"; mock = null; practice = { area };
  history.replaceState(null, "", "#mock");
  document.querySelectorAll(".tab").forEach((t) => (t.dataset.mode === "mock" ? t.setAttribute("aria-current", "page") : t.removeAttribute("aria-current")));
  askNew(pickFor(area, dim));
}

/* ======================= boot ======================= */
const MODES = ["learn", "mock", "hot", "cards", "wall", "profile"];
document.querySelectorAll(".tab").forEach((t) => t.addEventListener("click", () => setMode(t.dataset.mode)));
window.addEventListener("hashchange", () => { const h = location.hash.slice(1); if (MODES.includes(h) && h !== mode) setMode(h); });
const h0 = location.hash.slice(1);
if (MODES.includes(h0)) { mode = h0; if (mode === "cards") startCards(); }
renderAll();
async function loadLocalProfile() {
  const r = await fetch("/api/local-profile");
  if (!r.ok) return false;
  profile = await r.json(); store.set(K.profile, profile); return true;
}
fetch("/api/status").then((r) => r.json()).then(async (s) => {
  aiOn = !!s.ai; aiModel = s.model; hasLocal = !!s.localProfile;
  // A profile file on this machine fills an empty browser profile (or replaces the example) automatically.
  const empty = !profile || !Object.values(profile).some((v) => v && String(v).trim()) || profile.project === EXAMPLE_PROFILE.project;
  if (hasLocal && empty) await loadLocalProfile().catch(() => {});
  if (s.localLessons) { const r = await fetch("/api/local-lessons").catch(() => null); if (r?.ok) lessons = await r.json(); }
  renderAll();
}).catch(() => renderAll());
