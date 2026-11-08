import { profile, skills, focusAreas, projects, competitions } from './data.js';
import { PROGRAMS, assemble, createCpu } from './cpu.js';
import { SAMPLE_LOG, parse, detect } from './logscan.js';

const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const STATUS = { complete: 'Complete', submitted: 'Submitted', 'in-progress': 'In progress', planned: 'Planned' };

// ---------- theme ----------
const stored = (() => { try { return localStorage.getItem('devspace-theme'); } catch { return null; } })();
document.documentElement.dataset.theme = stored || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
$('#theme').addEventListener('click', () => {
  const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = t; try { localStorage.setItem('devspace-theme', t); } catch {}
});

// ---------- hero ----------
$('#name').textContent = profile.name;
$('#headline').textContent = profile.headline;
$('#intro').textContent = profile.intro;
document.title = `${profile.name} · Portfolio`;
const langs = new Set(skills.map((s) => s.name));
$('#heroStats').innerHTML = [[projects.filter((p) => p.kind === 'personal').length, 'personal projects'], [projects.filter((p) => p.kind === 'hackathon').length, 'hackathon builds'], [langs.size, 'languages & tools'], [competitions.length, 'competitions']]
  .map(([n, l]) => `<div><b>${n}</b><span>${l}</span></div>`).join('');
$('#links').innerHTML = profile.links.map((l) => `<a class="btn" href="${esc(l.url)}" rel="noopener" target="_blank">${esc(l.label)} ↗</a>`).join('') + (profile.email ? `<a class="btn ghost" href="mailto:${esc(profile.email)}">Email</a>` : '');
$('#focusList').innerHTML = focusAreas.map((f) => `<li>${esc(f)}</li>`).join('');
$('#footer').innerHTML = `© ${new Date().getFullYear()} ${esc(profile.name)} · Built with plain HTML, CSS, and JavaScript (no frameworks) · <a href="#top">Back to top</a>`;

// ---------- projects ----------
let filter = 'all', query = '';
function renderProjects() {
  const q = query.trim().toLowerCase();
  const list = projects.filter((p) => (filter === 'all' || p.kind === filter) && (!q || [p.name, p.summary, p.event, ...p.tags].join(' ').toLowerCase().includes(q)));
  $('#projectGrid').innerHTML = list.map((p) => `
    <article class="card project" data-kind="${p.kind}">
      <div class="meta"><span class="badge ${p.kind}">${p.kind === 'hackathon' ? esc(p.event) : 'Personal project'}</span><span class="status s-${p.status}">${STATUS[p.status]}</span></div>
      <h3>${esc(p.name)}</h3><p>${esc(p.summary)}</p>
      <ul class="tags">${p.tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
      <div class="actions"><button class="link" data-open="${esc(p.name)}">Read more →</button>${p.demo ? `<a class="link" href="#demos">Try demo</a>` : ''}${p.repo ? `<a class="link" href="${esc(p.repo)}" target="_blank" rel="noopener">Code ↗</a>` : ''}</div>
    </article>`).join('');
  $('#emptyProjects').hidden = list.length > 0;
}
document.querySelectorAll('.filters button').forEach((b) => b.addEventListener('click', () => {
  filter = b.dataset.filter;
  document.querySelectorAll('.filters button').forEach((x) => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', String(x === b)); });
  renderProjects();
}));
$('#search').addEventListener('input', (e) => { query = e.target.value; renderProjects(); });
$('#projectGrid').addEventListener('click', (e) => {
  const name = e.target.closest('[data-open]')?.dataset.open; if (!name) return;
  const p = projects.find((x) => x.name === name);
  $('#dlgBody').innerHTML = `<p class="kicker">${p.kind === 'hackathon' ? esc(p.event) : 'Personal project'} · ${p.year} · ${STATUS[p.status]}</p><h2 id="dlgTitle">${esc(p.name)}</h2><p>${esc(p.summary)}</p>
    ${p.problem ? `<h3>Problem</h3><p>${esc(p.problem)}</p>` : ''}${p.built?.length ? `<h3>What I built</h3><ul>${p.built.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>` : ''}
    ${p.learned ? `<h3>What I learned</h3><p>${esc(p.learned)}</p>` : ''}<ul class="tags">${p.tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
    ${p.repo ? `<p><a class="btn" href="${esc(p.repo)}" target="_blank" rel="noopener">View code ↗</a></p>` : ''}`;
  $('#projectDialog').showModal();
});
$('#projectDialog').addEventListener('click', (e) => { if (e.target === e.currentTarget) e.currentTarget.close(); });
renderProjects();

// ---------- skills ----------
$('#skillList').innerHTML = skills.map((s) => `<div class="skill"><div class="skill-top"><b>${esc(s.name)}</b><span class="dots" aria-label="${s.level} of 5">${'●'.repeat(s.level)}${'○'.repeat(5 - s.level)}</span></div>
  <div class="skill-projects">${s.projects.map((n) => `<button class="mini" data-open-skill="${esc(n)}">${esc(n)}</button>`).join('')}</div></div>`).join('');
$('#skillList').addEventListener('click', (e) => {
  const n = e.target.closest('[data-open-skill]')?.dataset.openSkill; if (!n) return;
  $('#search').value = n; query = n; filter = 'all'; document.querySelector('.filters button[data-filter=all]').click(); $('#projects').scrollIntoView({ behavior: 'smooth' });
});

// ---------- competitions ----------
$('#compList').innerHTML = competitions.map((c) => `<li><span class="when">${esc(c.date)}</span><div>${c.url ? `<a href="${esc(c.url)}" target="_blank" rel="noopener"><b>${esc(c.event)}</b> ↗</a>` : `<b>${esc(c.event)}</b>`}<span class="muted"> · ${esc(c.project)}</span>${c.result ? `<span class="award">🏆 ${esc(c.result)}</span>` : ''}</div></li>`).join('');

// ---------- GitHub ----------
// Shows every public repo. When a repo has no description on GitHub, the project's summary from data.js is used,
// and if GitHub can't be reached the list is built from data.js so the section is never empty.
const byRepo = new Map(projects.filter((p) => p.repo).map((p) => [p.repo.split('/').pop().toLowerCase(), p]));
const repoCard = (name, url, desc, meta) => `<a class="card repo" href="${esc(url)}" target="_blank" rel="noopener"><b>${esc(name)}</b><p>${esc(desc)}</p><span class="muted">${esc(meta)}</span></a>`;
function fallbackRepos(note) {
  const cards = [...byRepo.entries()].map(([name, p]) => repoCard(name, p.repo, p.summary, p.tags.join(' · '))).join('');
  $('#repoList').innerHTML = cards + (note ? `<p class="muted repo-note">${note}</p>` : '');
}
async function loadRepos() {
  const box = $('#repoList');
  if (!profile.githubUser) { box.innerHTML = `<p class="muted">Add your GitHub username in <code>js/data.js</code> to show your public repositories here.</p>`; return; }
  box.innerHTML = '<p class="muted">Loading repositories…</p>';
  try {
    const r = await fetch(`https://api.github.com/users/${encodeURIComponent(profile.githubUser)}/repos?sort=updated&per_page=100`, { headers: { Accept: 'application/vnd.github+json' } });
    if (!r.ok) throw new Error(r.status === 403 ? 'rate limit' : `HTTP ${r.status}`);
    const repos = (await r.json()).filter((x) => !x.fork);
    if (!repos.length) return fallbackRepos('');
    box.innerHTML = repos.map((x) => {
      const p = byRepo.get(x.name.toLowerCase());
      const desc = x.description || p?.summary || 'No description yet.';
      const meta = [x.language, `updated ${new Date(x.updated_at).toLocaleDateString()}`].filter(Boolean).join(' · ');
      return repoCard(x.name, x.html_url, desc, meta);
    }).join('');
  } catch {
    fallbackRepos(`Showing saved project list. <a href="https://github.com/${esc(profile.githubUser)}?tab=repositories" target="_blank" rel="noopener">See everything on GitHub ↗</a>`);
  }
}
loadRepos();

// ---------- CPU demo ----------
let cpu, program;
const sel = $('#cpuProgram');
sel.innerHTML = Object.keys(PROGRAMS).map((k) => `<option>${k}</option>`).join('');
function cpuReset() {
  $('#cpuErr').textContent = '';
  try { program = assemble($('#cpuSrc').value); cpu = createCpu(program); }
  catch (e) { $('#cpuErr').textContent = e.message; cpu = null; }
  cpuRender([]);
}
function cpuRender(changed) {
  if (!cpu) { $('#cpuRegs').innerHTML = ''; $('#cpuFlags').innerHTML = ''; $('#cpuNext').textContent = ''; $('#cpuOut').textContent = ''; return; }
  const s = cpu.state;
  $('#cpuRegs').innerHTML = s.r.map((v, i) => `<div class="${changed.includes(i) ? 'ch' : ''}"><small>R${i}</small>${v}</div>`).join('');
  $('#cpuFlags').innerHTML = ['z', 'n', 'c', 'v'].map((f) => `<span class="${s[f] ? 'on' : ''}" title="${{ z: 'zero', n: 'negative', c: 'carry/borrow', v: 'signed overflow' }[f]}">${f.toUpperCase()}</span>`).join('') + `<span class="muted">PC ${s.pc} · ${s.steps} steps</span>`;
  const next = program?.[s.pc];
  $('#cpuNext').textContent = s.halted ? '■ halted' : next ? `next → ${next.op} ${next.args.join(', ')}  (line ${next.line})` : '';
  $('#cpuOut').textContent = `output: ${s.out.join(' ') || '—'}`;
}
function cpuStep() {
  if (!cpu) return;
  try { const t = cpu.step(); cpuRender(t ? cpu.state.r.map((v, i) => (v !== t.before[i] ? i : -1)).filter((i) => i >= 0) : []); }
  catch (e) { $('#cpuErr').textContent = e.message; }
}
sel.addEventListener('change', () => { $('#cpuSrc').value = PROGRAMS[sel.value]; cpuReset(); });
$('#cpuStep').addEventListener('click', cpuStep);
$('#cpuRun').addEventListener('click', () => { if (!cpu) return; try { while (!cpu.state.halted) cpu.step(); } catch (e) { $('#cpuErr').textContent = e.message; } cpuRender([]); });
$('#cpuReset').addEventListener('click', cpuReset);
$('#cpuSrc').addEventListener('change', cpuReset);
$('#cpuSrc').value = PROGRAMS.fibonacci; cpuReset();

// ---------- Log scan demo ----------
function scan() {
  const ev = parse($('#logText').value);
  const alerts = detect(ev);
  $('#logCount').textContent = `${ev.length} login event${ev.length === 1 ? '' : 's'} parsed`;
  $('#logAlerts').innerHTML = alerts.length ? alerts.map((a) => `<li class="sev-${a.sev}"><b>${a.sev.toUpperCase()}</b> ${esc(a.title)}<br><small>${esc(a.why)}</small></li>`).join('') : `<li class="ok">No attacks detected${ev.length ? '' : '. No sshd login lines were recognized'}.</li>`;
}
$('#logSample').addEventListener('click', () => { $('#logText').value = SAMPLE_LOG; scan(); });
$('#logScan').addEventListener('click', scan);
$('#logText').value = SAMPLE_LOG; scan();
