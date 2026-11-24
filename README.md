# CSM Q&A Drill

Practise the oral-exam Q&A for **Communication & Stakeholder Management** on your own laptop. You answer out loud, and every answer is judged the way the exam is: **theory** (do you know the concept?), **application** (did you apply it to your own project?) and **reflection** (what worked, what didn't, what would you change?).

It covers all six knowledge areas: stakeholder management, storytelling, pitching, visual presentations, public speaking and negotiating. Difficult conversations are included as a bonus.

## What's inside

- **Mock Q&A (15 min):** one question per knowledge area first, then the examiner goes back to your weakest spots and asks follow-ups. You get a report per area at the end.
- **Hot seat:** tough, pushy questions with 60 seconds per answer.
- **Theory cards:** 29 models and authors (Freeman, Mendelow, RACI, SOSTAC, Minto, Getting to Yes, BATNA/ZOPA, Voss, NVC, SBI, Edmondson, Hofstede, the Culture Map …). Say what each one is and where you used it.
- **Locker wall:** a gap map of 6 areas × theory / application / reflection. Click any door to practise exactly that spot.
- **My project:** a short profile of your project, so the questions and feedback are about *your* stakeholders, *your* pitch and *your* negotiation. There's an example project if you want to try it first.

About 65 questions, each with the key points an excellent answer covers and a hint for how to structure it.

## Run it

You need [Node.js](https://nodejs.org) 20.12 or newer.

```bash
git clone https://github.com/benjaminkapell/csm-qa-drill.git
cd csm-qa-drill
npm install
npm start
```

Open **http://localhost:4317** in **Chrome or Edge** (voice input uses the browser's built-in speech recognition; other browsers can type).

### Optional: AI grading with Claude

Without AI, you grade yourself with a checklist of key points. With AI on, Claude scores theory, application and reflection, lists what you missed, writes a stronger answer from your project facts, and asks follow-up questions like an examiner.

```bash
cp .env.example .env
# open .env and paste your key after ANTHROPIC_API_KEY=
npm start
```

**No API key but you use Claude Code?** Then you don't need a key: if the `claude` command is installed and logged in, the server grades through it automatically (on your own Claude plan, model `opus`, low effort). It runs with no tools, no access to your files and no saved session. Set `CLAUDE_CLI_MODEL=sonnet` in `.env` to use a lighter model, or `CLAUDE_CLI=off` to turn this off. An API key always wins if both are there.

Get a key at [console.anthropic.com](https://console.anthropic.com/). Grading one answer costs roughly 2–3 US cents with the default model (`claude-opus-5-5`, low effort). You can change the model or effort in `.env`.

The server uses Anthropic's server-side refusal fallback (`fallbacks: "default"`), so if a request is ever declined by a safety classifier it is retried on a fallback model automatically.

## Privacy

- The server only listens on `127.0.0.1`, so nobody else on your network can reach it.
- Your project profile and progress are stored in your browser's `localStorage`. "Reset progress" on the *My project* tab clears your answers.
- With AI grading on, the question, your answer and your project profile are sent to Anthropic (through the API or Claude Code) when you press *Grade*. Nothing else leaves your machine.
- Voice input uses the browser's speech recognition. In Chrome, that audio is processed by Google's speech service.
- Never commit your `.env` file. It's already in `.gitignore`.

## Customising

All questions and theory cards live in [`public/questions.js`](public/questions.js). Each question has an area, a dimension (`t` theory, `a` application, `r` reflection, `h` hot seat), the question text (`{p}` becomes your project name), the key points and a hint. Add your own and refresh the page.

## License

MIT
