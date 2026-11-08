# {devspace} — developer portfolio

**Live site:** https://dagmawi1-lang.github.io/devspace/

## My role & contributions

**Solo developer · AI-assisted**

- Planned the portfolio structure and wrote the project write-ups
- Ported CoreSim's CPU and Sentinel's detection rules to JavaScript for the live demos

A fast, accessible portfolio site in **plain HTML, CSS, and JavaScript** (no frameworks, no build step). It brings all my projects together in one place for admissions reviewers, mentors, and hackathon judges.

## All projects

| Project | Type | Status | Description |
|---|---|---|---|
| [Sentinel](https://github.com/dagmawi1-lang/sentinel) | Personal | ✅ Complete | Personal security monitoring platform: parses SSH/auth logs, detects brute force, password spraying, and likely account compromise, tracks incidents in SQLite, and has a review dashboard. |
| [CoreSim](https://github.com/dagmawi1-lang/coresim) | Personal | ✅ Complete | CPU instruction simulator for a 16-bit CPU I designed (CS16): two-pass assembler, flags, stack, CALL/RET, interactive stepper, and an HTML trace viewer. |
| [NetWatch](https://github.com/dagmawi1-lang/netwatch) | Personal | ✅ Complete | Network monitoring and simulation: topology-aware outage root-cause analysis, flapping, latency and traffic anomalies, port scans, and rogue devices. |
| [SecureDB](https://github.com/dagmawi1-lang/securedb) | Personal | ✅ Complete | School-records database with role-based and row-level access, SQL-injection-safe queries, and a tamper-evident hash-chained audit log written by triggers. |
| [SysGuard](https://github.com/dagmawi1-lang/sysguard) | Personal | ✅ Complete | Bash collector reading /proc plus a Python analyzer that spots crypto-miners in /tmp, fork bombs, memory leaks, CPU hogs, and new open ports. |
| [MemorySafe](https://github.com/dagmawi1-lang/memorysafe) | Personal | ✅ Complete | Rust demonstrator of ownership, borrowing, safe data structures, RAII, errors, and fearless concurrency, with compile-fail tests proving bugs don't compile. |
| [DataMind](https://github.com/dagmawi1-lang/datamind) | Personal | ✅ Complete | Automated data analysis: cleans messy CSV/Excel data with a change log, finds robust patterns, draws charts, and writes a plain-language report. |
| [WasteLens](https://github.com/dagmawi1-lang/wastelens) | Arbiter Hacks V1 | 🛠️ In progress | Waste-sorting assistant: classifies a photo, explains preparation and disposal, lets people correct it, and includes a consent-based dataset and training pipeline. |
| [OutbreakIQ](https://github.com/dagmawi1-lang/outbreakiq) | DSH Hacks | 🛠️ In progress | Explores CDC NNDSS disease-reporting data and flags statistical anomalies as review signals, with clear limits. |
| [BridgeUp](https://github.com/dagmawi1-lang/bridgeup) | CSC Winter Sparkathon | 🛠️ In progress | Community support matching with explainable scores, consent-gated private messaging, live updates, and moderation with an audit log. |
| [ProofPath](https://github.com/dagmawi1-lang/proofpath) | STEM2Connect AI Hackathon | 🛠️ In progress | Student research workspace: evidence checklists, a claim map showing supporting vs challenging sources, APA/MLA citations, and an optional AI coach. |
| [FixForward](https://github.com/dagmawi1-lang/fixforward) | STEMergent Hacks | 🛠️ In progress | Community maintenance board with duplicate detection, explainable priority, status history, and action-brief export. |
| [ClearTask](https://github.com/dagmawi1-lang/cleartask) | Global AI Builder's Challenge | 🛠️ In progress | Task planner that breaks assignments into steps with time estimates and optional AI planning. |
| [DevSpace](https://github.com/dagmawi1-lang/devspace) | Personal | ✅ Complete | This portfolio: a framework-free site with live in-browser demos of CoreSim and Sentinel, project write-ups, and a live list of my GitHub repos. |
| CivicEco | Personal | 🛠️ In progress | Environmental intelligence platform: report local environmental issues on a map, verify evidence with community confirmations, spot hotspots and early warnings, and coordinate response plans. |
| SchoolSync | Personal | 🛠️ In progress | Student productivity platform: dashboard, announcements, study resources, college planning, scholarships, and clubs in one place. |
| PhishProof | IceHacks | 🗓️ Planned | Phishing-awareness training that teaches people to spot the warning signs in realistic, safe practice messages. |
| AccessLens | NorCal Hacks 27 | 🗓️ Planned | Privacy-first accessibility review companion that helps makers find and fix accessibility problems. |
| Pathways | Bridge The Gap Hacks | 🗓️ Planned | Helps students discover opportunities such as programs, scholarships, and competitions, and plan the steps to reach them. |
| KindQuest | Checkpoint 1: Games for Good | 🗓️ Planned | Interactive game about teamwork and inclusion. |

## Competitions (10)

| Competition | Project | When |
|---|---|---|
| [DSH Hacks V2 (AI × Healthcare)](https://dsh-hacks-v2.devpost.com/) | OutbreakIQ | Nov 2026 |
| [STEMergent Hacks](https://stemergent-hacks.devpost.com/) | FixForward | Nov 2026 |
| [IceHacks](https://icehacks.devpost.com/) | PhishProof | Nov 2026 |
| [NorCal Hacks 27](https://norcal-hacks-27.devpost.com/) | AccessLens | Nov 2026 |
| [Bridge The Gap (SQ Hacks)](https://sq-hacks.devpost.com/) | Pathways | Nov 2026 |
| [STEM2Connect AI Hackathon](https://stem2connect-online-hackathon.devpost.com/) | ProofPath | Nov 2026 |
| [Global AI Builder's Challenge](https://global-ai-builders-challenge.devpost.com/) | ClearTask | Nov 2026 |
| [CSC Winter Sparkathon](https://csc-winter-sparkathon.devpost.com/) | BridgeUp | Oct–Nov 2026 |
| [Arbiter Hacks V1](https://arbiter-hacks-v1.devpost.com/) | WasteLens | Oct–Dec 2026 |
| [Checkpoint 1: Games for Good](https://checkpoint-1.devpost.com/) | KindQuest | Jan 2027 |

## Features
- **Project showcase:** 7 personal projects plus hackathon builds, with filters (All / Personal / Hackathon), search by language or topic, and a detail dialog for each (problem → what I built → what I learned).
- **Live interactive demos:**
  - **CoreSim CPU:** a JavaScript port of my CS16 CPU. Edit the assembly, step through it, and watch registers and flags change.
  - **Sentinel log scanner:** paste SSH `auth.log` lines to detect brute force, password spraying, and likely compromise in the browser.
- **Skills:** each language links to the projects that use it.
- **Competitions timeline:** shows only results actually received (add awards in `js/data.js`).
- **GitHub integration:** lists your latest public repos via the GitHub REST API, and handles rate limits and offline use.
- Light/dark theme (follows the system and remembers your choice), skip link, keyboard-friendly dialog, `prefers-reduced-motion`, and responsive down to phones.

## Personalize (5 minutes)
Edit **`js/data.js`**:
1. `profile.name`, `headline`, `intro`
2. `profile.githubUser`: your GitHub username (turns on the live repo list)
3. `profile.links`: GitHub, Devpost, LinkedIn
4. each project's `repo` URL once it's on GitHub
5. `competitions[].result` after judging (only real results)

## Run locally
Modules need a web server (not `file://`):
```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

## Deploy free on GitHub Pages
1. Create a repo named `<your-username>.github.io` and push these files to it.
2. In the repo, go to Settings → Pages → Source: *Deploy from a branch* → `main` / root.
3. Your site will be live at `https://<your-username>.github.io`.

## Files
`index.html` · `css/styles.css` · `js/data.js` (content) · `js/app.js` (rendering) · `js/cpu.js` (CS16 port) · `js/logscan.js` (Sentinel rules port)

## License

**Permission required.** © 2026 Dagmawi Melaku. You need my written permission before using, copying, or modifying this code, and any approved use must credit me with a link to this repository. Viewing, forking on GitHub, and running it to judge or review a submission are allowed without asking. To ask, [open an issue](../../issues/new). See [LICENSE](LICENSE) for the full terms.
