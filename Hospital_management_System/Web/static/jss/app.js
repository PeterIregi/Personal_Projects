/* ── Shared utilities ─────────────────────────────────────── */

const DEFAULTS = { temp: '37.0', bp: '120/80', pulse: '72', spo2: '98', rr: '16', weight: '' };

const DEPTS = [
  'Radiology','Laboratory','Cardiology','Orthopaedics',
  'ENT','Gynaecology','Ophthalmology','Neurology','Dental'
];

function now() { return new Date().toISOString(); }

function fmt(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-KE', { day: '2-digit', month: 'short', year: 'numeric' })
       + ' ' + d.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' });
}

function today() { return new Date().toDateString(); }

function norm(s) { return String(s).trim().toLowerCase(); }

function statusBadge(s) {
  return { triage: 'badge-orange', consultation: 'badge-blue', department: 'badge-purple',
           pharmacy: 'badge-teal', discharged: 'badge-green' }[s] || 'badge-gray';
}

function statusLabel(s) {
  return { triage: 'Triage', consultation: 'Consultation', department: 'In Department',
           pharmacy: 'Pharmacy', discharged: 'Discharged' }[s] || s;
}

function msg(el, text, type) {
  if (!el) return;
  el.innerHTML = text ? `<div class="msg msg-${type}">${text}</div>` : '';
}

function setHeader() {
  const el = document.getElementById('hdr-date');
  if (el) el.textContent = new Date().toLocaleDateString('en-KE',
    { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function setActiveNav() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.site-nav a').forEach(a => {
    const href = a.getAttribute('href').replace(/\/$/, '') || '/';
    a.classList.toggle('active', href === path);
  });
}

/* ── API client ───────────────────────────────────────────── */

const API = {
  async get(url) {
    const r = await fetch(url);
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  },
  async post(url, body) {
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  },
  async put(url, body) {
    const r = await fetch(url, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  },
  patients: () => API.get('/api/patients'),
  visits:   () => API.get('/api/visits'),
  visit:    (id) => API.get(`/api/visits/${id}`),
  createPatient: (p) => API.post('/api/patients', p),
  createVisit:   (v) => API.post('/api/visits', v),
  updateVisit:   (v) => API.put(`/api/visits/${v.vid}`, v),
};

/* ── Patient row HTML helper ──────────────────────────────── */

function patientRowHTML(p, visits) {
  const pv = (visits || []).filter(v => v.pid === p.pid);
  const active = pv.find(v => v.status !== 'discharged');
  return `<div class="patient-row" onclick="location.href='/records?pid=${p.pid}'">
    <div class="info">
      <span class="name">KMC-${p.pid} — ${p.name}</span>
      <span class="sub">Age ${p.age} · ${p.phone} · ${pv.length} visit(s)</span>
    </div>
    ${active
      ? `<span class="badge badge-orange">Active</span>`
      : `<span class="badge badge-gray">${pv.length ? 'Past visits' : 'New'}</span>`}
  </div>`;
}

function visitRowHTML(v, backParam) {
  return `<div class="patient-row" onclick="location.href='/visit?vid=${v.vid}&back=${backParam||'queue'}'">
    <div class="info">
      <span class="name">KMC-${v.pid} — ${v.patientName}</span>
      <span class="sub">Age ${v.patientAge} · V-${v.vid} · ${fmt(v.startedAt)}</span>
    </div>
    <span class="badge ${statusBadge(v.status)}">${statusLabel(v.status)}</span>
  </div>`;
}

/* ── Init on every page ───────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  setHeader();
  setActiveNav();
});
