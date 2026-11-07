// In-browser version of Sentinel's core rules: brute force, password spraying, and success-after-failures.
export const SAMPLE_LOG = `Nov  6 14:05:00 web01 sshd[2101]: Failed password for bob from 198.51.100.23 port 51000 ssh2
Nov  6 14:05:15 web01 sshd[2102]: Failed password for bob from 198.51.100.23 port 51001 ssh2
Nov  6 14:05:30 web01 sshd[2103]: Failed password for bob from 198.51.100.23 port 51002 ssh2
Nov  6 14:05:45 web01 sshd[2104]: Failed password for bob from 198.51.100.23 port 51003 ssh2
Nov  6 14:06:00 web01 sshd[2105]: Failed password for bob from 198.51.100.23 port 51004 ssh2
Nov  6 14:06:15 web01 sshd[2106]: Failed password for bob from 198.51.100.23 port 51005 ssh2
Nov  6 16:00:00 web01 sshd[2200]: Failed password for alice from 203.0.113.77 port 40000 ssh2
Nov  6 16:00:40 web01 sshd[2201]: Failed password for carol from 203.0.113.77 port 40001 ssh2
Nov  6 16:01:20 web01 sshd[2202]: Failed password for invalid user admin from 203.0.113.77 port 40002 ssh2
Nov  6 16:02:00 web01 sshd[2203]: Failed password for eve from 203.0.113.77 port 40003 ssh2
Nov  7 02:10:00 web01 sshd[2300]: Failed password for dana from 192.0.2.44 port 52000 ssh2
Nov  7 02:10:20 web01 sshd[2301]: Failed password for dana from 192.0.2.44 port 52001 ssh2
Nov  7 02:10:40 web01 sshd[2302]: Failed password for dana from 192.0.2.44 port 52002 ssh2
Nov  7 02:13:00 web01 sshd[2303]: Accepted password for dana from 192.0.2.44 port 52003 ssh2
Nov  7 09:12:00 web01 sshd[2400]: Accepted publickey for alice from 10.0.0.11 port 52100 ssh2`;

const MONTHS = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
const LINE = /^([A-Z][a-z]{2})\s+(\d{1,2})\s(\d\d):(\d\d):(\d\d)\s\S+\ssshd\[\d+\]:\s(Failed|Accepted) \S+ for (invalid user )?(\S+) from (\S+) port/;

export function parse(text, year = 2026) {
  const out = [];
  for (const line of text.split('\n')) {
    const m = LINE.exec(line.trim());
    if (!m || !(m[1] in MONTHS)) continue;
    out.push({ t: new Date(year, MONTHS[m[1]], +m[2], +m[3], +m[4], +m[5]).getTime(), ok: m[6] === 'Accepted', user: m[8], ip: m[9] });
  }
  return out.sort((a, b) => a.t - b.t);
}

export function detect(events, { bruteN = 5, bruteMin = 5, sprayUsers = 4, sprayMin = 10, compromiseN = 3, compromiseMin = 10 } = {}) {
  const alerts = []; const MIN = 60000;
  const fails = (ip, user, until, win) => events.filter((e) => !e.ok && e.ip === ip && (!user || e.user === user) && e.t <= until && until - e.t <= win * MIN);
  const seen = new Set();
  for (const e of events) {
    if (!e.ok) {
      const f = fails(e.ip, e.user, e.t, bruteMin);
      const k = `bf|${e.ip}|${e.user}`;
      if (f.length >= bruteN && !seen.has(k)) { seen.add(k); alerts.push({ sev: 'medium', title: `Brute force on "${e.user}" from ${e.ip}`, why: `${f.length} failures within ${bruteMin} min` }); }
      const users = new Set(fails(e.ip, null, e.t, sprayMin).map((x) => x.user));
      const ks = `sp|${e.ip}`;
      if (users.size >= sprayUsers && !seen.has(ks)) { seen.add(ks); alerts.push({ sev: 'high', title: `Password spraying from ${e.ip}`, why: `${users.size} different accounts tried: ${[...users].join(', ')}` }); }
    } else {
      const f = fails(e.ip, e.user, e.t, compromiseMin);
      if (f.length >= compromiseN) alerts.push({ sev: 'critical', title: `Possible compromise of "${e.user}"`, why: `successful login from ${e.ip} right after ${f.length} failures` });
    }
  }
  return alerts;
}
