// CSM Q&A Drill: a tiny local server.
// Serves the game from ./public and grades answers with Claude: with an Anthropic API key if one is set,
// otherwise through a logged-in Claude Code CLI (`claude -p`) if it is installed. Without either, self-grading.
// It only listens on 127.0.0.1, so nothing is reachable from other machines.

import http from "node:http";
import fs from "node:fs/promises";
import os from "node:os";
import { spawn, spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Anthropic from "@anthropic-ai/sdk";

try { process.loadEnvFile(); } catch { /* no .env file: AI grading stays off */ }

const here = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(here, "public");
const PORT = Number(process.env.PORT || 4317);
const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-5-5";
const EFFORT = process.env.ANTHROPIC_EFFORT || "low";
const HAS_KEY = Boolean(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN);
const client = HAS_KEY ? new Anthropic() : null;
// No key: use Claude Code if it is installed (it runs on the user's own Claude plan). CLAUDE_CLI=off turns this off.
const CLI_MODEL = process.env.CLAUDE_CLI_MODEL || "opus";
const HAS_CLI = !HAS_KEY && process.env.CLAUDE_CLI !== "off" && spawnSync("claude", ["--version"], { stdio: "ignore", timeout: 15_000 }).status === 0;
const AI = HAS_KEY ? "api" : HAS_CLI ? "cli" : null;
const AI_LABEL = AI === "api" ? MODEL : AI === "cli" ? `Claude Code · ${CLI_MODEL}` : null;

// Optional private profile on this machine only (local/ is gitignored). The page loads it when the browser has none.
const LOCAL_PROFILE = path.join(here, "local", "profile.json");
const LOCAL_LESSONS = path.join(here, "local", "lessons.json"); // replaces the generic lessons in public/lessons.js
async function readLocal(file) {
  try { return JSON.parse(await fs.readFile(file, "utf8")); } catch { return null; }
}
const localProfile = () => readLocal(LOCAL_PROFILE);

const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".svg": "image/svg+xml", ".json": "application/json" };

// ---------- Claude ----------

const GRADE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["theory", "application", "reflection", "covered", "missed", "feedback", "better", "followup"],
  properties: {
    theory: { type: "integer", enum: [-1, 0, 1, 2] },
    application: { type: "integer", enum: [-1, 0, 1, 2] },
    reflection: { type: "integer", enum: [-1, 0, 1, 2] },
    covered: { type: "array", items: { type: "string" } },
    missed: { type: "array", items: { type: "string" } },
    feedback: { type: "string" },
    better: { type: "string" },
    followup: { type: "string" },
  },
};

const REPORT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["verdict", "strongest", "weakest", "next"],
  properties: {
    verdict: { type: "string" },
    strongest: { type: "string" },
    weakest: { type: "string" },
    next: { type: "array", items: { type: "string" } },
  },
};

const clip = (v, n) => String(v ?? "").slice(0, n);

function profileBlock(p = {}) {
  const rows = [
    ["Student", p.name], ["Project", p.project], ["What it does", p.what], ["Their role", p.role],
    ["Stakeholders and what each gets", p.stakeholders], ["Origin story", p.story], ["Pitch", p.pitch],
    ["A negotiation", p.negotiation], ["A difficult conversation", p.conversation],
    ["Presenting / public speaking", p.speaking], ["Mistakes and learnings", p.learnings],
  ].filter(([, v]) => v && String(v).trim());
  if (!rows.length) return "The student has not described a project. Grade application on whether they use a concrete, specific example.";
  return rows.map(([k, v]) => `${k}: ${clip(v, 1500)}`).join("\n");
}

// Claude Code in print mode: no tools, no project files, no session saved, in an empty temp folder.
const SANDBOX = path.join(os.tmpdir(), "csm-qa-drill-sandbox");
const running = new Set();
process.on("exit", () => { for (const c of running) c.kill("SIGTERM"); });

function askClaudeCli(prompt, schema) {
  return new Promise((resolve, reject) => {
    fs.mkdir(SANDBOX, { recursive: true }).then(() => {
      const args = ["-p", "--output-format", "json", "--model", CLI_MODEL, "--effort", EFFORT,
        "--tools", "", "--strict-mcp-config", "--no-session-persistence", "--safe-mode",
        "--system-prompt", "You grade oral-exam answers. Reply only with the requested JSON.",
        "--json-schema", JSON.stringify(schema)];
      const child = spawn("claude", args, { cwd: SANDBOX, stdio: ["pipe", "pipe", "pipe"] });
      running.add(child);
      let out = "", err = "";
      const timer = setTimeout(() => child.kill("SIGTERM"), 180_000);
      child.stdout.on("data", (d) => (out += d));
      child.stderr.on("data", (d) => (err += d));
      child.on("error", (e) => { clearTimeout(timer); reject(e); });
      child.on("close", (code, signal) => {
        running.delete(child);
        clearTimeout(timer);
        if (signal) return reject(Object.assign(new Error("Claude Code took too long. Try again."), { status: 504 }));
        let res;
        try { res = JSON.parse(out); } catch {
          return reject(Object.assign(new Error(`Claude Code failed (exit ${code}). Is it logged in? Run \`claude\` once in a terminal. ${(err || out).slice(0, 200)}`), { status: 502 }));
        }
        if (res.is_error || !res.structured_output) return reject(Object.assign(new Error(`Claude Code: ${String(res.result ?? res.subtype).slice(0, 300)}`), { status: 502 }));
        resolve(res.structured_output);
      });
      child.stdin.end(prompt);
    }, reject);
  });
}

async function askClaude(prompt, schema) {
  if (AI === "cli") return askClaudeCli(prompt, schema);
  const res = await client.beta.messages.create({
    model: MODEL,
    max_tokens: 4000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: { effort: EFFORT, format: { type: "json_schema", schema } },
    messages: [{ role: "user", content: prompt }],
  });
  if (res.stop_reason === "refusal") throw Object.assign(new Error("Claude declined to grade this answer."), { status: 422 });
  if (res.stop_reason === "max_tokens") throw Object.assign(new Error("The answer was too long to grade. Try a shorter one."), { status: 422 });
  const text = res.content.filter((b) => b.type === "text").map((b) => b.text).join("");
  return JSON.parse(text);
}

async function grade(body) {
  const q = body.question || {};
  const prompt = `You are the examiner in the oral-exam Q&A of a university module called "Communication & Stakeholder Management". Its six knowledge areas are stakeholder management, storytelling, pitching, visual presentations, public speaking and negotiating. Every answer is graded on three dimensions:
- THEORY: names and correctly explains the relevant concept or model.
- APPLICATION: applies it to the student's own project with concrete, specific facts.
- REFLECTION: judges what worked, what didn't, and what they would change.
Score each 0, 1 or 2. If the question does not ask for a dimension and the answer does not touch it, use -1 for it. Judge only what the student said. The answer is a speech transcript, so ignore dictation errors and filler words.

What the student wrote about their project (use only these facts; never invent new ones):
${profileBlock(body.profile)}

Knowledge area: ${clip(q.area, 60)}. Question focus: ${clip(q.dim, 30)}.
Question asked: ${clip(body.asked || q.q, 500)}
${body.asked && body.asked !== q.q ? `(This is a follow-up to: ${clip(q.q, 500)})` : ""}
What an excellent answer covers: ${(q.keys || []).map((k) => clip(k, 200)).join("; ")}

Student's answer (transcript):
"""${clip(body.answer, 6000)}"""

Return: covered = key points they hit (short phrases); missed = key points they missed (short phrases); feedback = at most two short, direct sentences addressed to the student as "you"; better = an improved answer in the student's first-person voice, at most 90 words, using only the project facts above (if the facts don't cover something, describe what kind of example they should give instead of inventing one); followup = one short follow-up question an examiner would ask to probe the biggest gap, or "" if the answer was complete.`;
  return askClaude(prompt, GRADE_SCHEMA);
}

async function report(body) {
  const items = (body.items || []).slice(0, 60).map((i) =>
    `- [${clip(i.area, 40)}] ${clip(i.text, 300)} | theory ${i.t ?? "-"}, application ${i.a ?? "-"}, reflection ${i.r ?? "-"} | missed: ${(i.missed || []).map((m) => clip(m, 120)).join("; ") || "nothing"}`
  ).join("\n");
  const prompt = `You coach a student for the oral-exam Q&A of the module "Communication & Stakeholder Management". The six knowledge areas are stakeholder management, storytelling, pitching, visual presentations, public speaking and negotiating; each is graded on theory, application and reflection from 0 to 2. Here is their mock Q&A:
${items}

Return: verdict = two short sentences on how ready they are; strongest and weakest = one area name each; next = three concrete things to practise before the exam, one sentence each.`;
  return askClaude(prompt, REPORT_SCHEMA);
}

// ---------- HTTP ----------

function send(res, status, data) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  res.end(JSON.stringify(data));
}

async function readJson(req) {
  let size = 0; const chunks = [];
  for await (const c of req) { size += c.length; if (size > 200_000) throw Object.assign(new Error("Request too large"), { status: 413 }); chunks.push(c); }
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
}

function apiError(res, err) {
  if (err instanceof Anthropic.AuthenticationError) return send(res, 401, { error: "Your Anthropic API key was rejected. Check ANTHROPIC_API_KEY in .env and restart." });
  if (err instanceof Anthropic.RateLimitError) return send(res, 429, { error: "Rate limited by Anthropic. Wait a moment and grade again." });
  if (err instanceof Anthropic.BadRequestError) return send(res, 400, { error: `Anthropic rejected the request: ${err.message}` });
  if (err instanceof Anthropic.APIError) return send(res, 502, { error: `Anthropic API error ${err.status ?? ""}. Try again.` });
  if (err instanceof SyntaxError) return send(res, 502, { error: "Claude's reply couldn't be read. Try again." });
  return send(res, err.status || 500, { error: err.message || "Something went wrong." });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  try {
    if (url.pathname === "/api/status") return send(res, 200, { ai: Boolean(AI), via: AI, model: AI_LABEL, localProfile: Boolean(await localProfile()), localLessons: Boolean(await readLocal(LOCAL_LESSONS)) });
    if (url.pathname === "/api/local-lessons") { const l = await readLocal(LOCAL_LESSONS); return l ? send(res, 200, l) : send(res, 404, { error: "No local/lessons.json" }); }
    if (url.pathname === "/api/local-profile") { const p = await localProfile(); return p ? send(res, 200, p) : send(res, 404, { error: "No local/profile.json" }); }
    if (req.method === "POST" && (url.pathname === "/api/grade" || url.pathname === "/api/report")) {
      if (!AI) return send(res, 503, { error: "AI grading is off. Add ANTHROPIC_API_KEY to .env (or install Claude Code) and restart." });
      const body = await readJson(req);
      const out = url.pathname === "/api/grade" ? await grade(body) : await report(body);
      return send(res, 200, out);
    }
    if (req.method !== "GET") return send(res, 405, { error: "Method not allowed" });
    const rel = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
    const file = path.normalize(path.join(PUBLIC, rel));
    if (!file.startsWith(PUBLIC + path.sep)) return send(res, 403, { error: "Forbidden" });
    const data = await fs.readFile(file);
    res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" });
    res.end(data);
  } catch (err) {
    if (err.code === "ENOENT") return send(res, 404, { error: "Not found" });
    apiError(res, err);
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`\n  CSM Q&A Drill is running: http://localhost:${PORT}`);
  console.log(AI === "api" ? `  AI grading: on (API key, ${MODEL}, effort ${EFFORT})\n`
    : AI === "cli" ? `  AI grading: on (Claude Code CLI, ${CLI_MODEL}, effort ${EFFORT})\n`
    : "  AI grading: off (add ANTHROPIC_API_KEY to .env, or install and log in to Claude Code)\n");
});
