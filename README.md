# {devspace} — developer portfolio

A fast, accessible portfolio site in **plain HTML, CSS, and JavaScript** (no frameworks, no build step). It brings all my projects together in one place for admissions reviewers, mentors, and hackathon judges.

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

[MIT](LICENSE) © 2026 Dagmawi Melaku
