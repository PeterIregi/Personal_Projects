import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { API, statusBadge, statusLabel, fmt, norm } from '../utils';

function PatientRow({ p, visits }) {
  const pv = (visits || []).filter(v => v.pid === p.pid);
  const active = pv.find(v => v.status !== 'discharged');
  return (
    <div className="patient-row" onClick={() => { window.location.href = `/records?pid=${p.pid}`; }}>
      <div className="info">
        <span className="name">KMC-{p.pid} — {p.name}</span>
        <span className="sub">Age {p.age} · {p.phone} · {pv.length} visit(s)</span>
      </div>
      {active
        ? <span className="badge badge-orange">Active</span>
        : <span className="badge badge-gray">{pv.length ? 'Past visits' : 'New'}</span>}
    </div>
  );
}

function VisitRow({ v, backParam }) {
  return (
    <div className="patient-row" onClick={() => {
      window.location.href = `/visit?vid=${v.vid}&back=${backParam || 'queue'}`;
    }}>
      <div className="info">
        <span className="name">KMC-{v.pid} — {v.patientName}</span>
        <span className="sub">Age {v.patientAge} · V-{v.vid} · {fmt(v.startedAt)}</span>
      </div>
      <span className={`badge ${statusBadge(v.status)}`}>{statusLabel(v.status)}</span>
    </div>
  );
}

export default function Records() {
  const [searchParams] = useSearchParams();
  const [patients, setPatients] = useState([]);
  const [visits, setVisits] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    const [p, v] = await Promise.all([API.patients(), API.visits()]);
    setPatients(p);
    setVisits(v);
    setLoading(false);
  }

  const pidParam = searchParams.get('pid');
  const pid = pidParam ? parseInt(pidParam) : null;

  if (loading) {
    return (
      <div className="app">
        <header className="site-header">
          <h1>Kiboswa Medical Center</h1>
          <span className="hdr-right">{new Date().toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </header>
        <nav className="site-nav">
          <a href="/intake">Intake</a>
          <a href="/queue">Queue</a>
          <a href="/records">Records</a>
          <a href="/dashboard">Dashboard</a>
        </nav>
        <div className="card"><span className="spinner"></span> Loading...</div>
      </div>
    );
  }

  if (pid) {
    const p = patients.find(x => x.pid === pid);
    if (!p) {
      return (
        <div className="app">
          <header className="site-header">
            <h1>Kiboswa Medical Center</h1>
            <span className="hdr-right">{new Date().toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </header>
          <nav className="site-nav">
            <a href="/intake">Intake</a>
            <a href="/queue">Queue</a>
            <a href="/records">Records</a>
            <a href="/dashboard">Dashboard</a>
          </nav>
          <div className="card">Patient not found.</div>
        </div>
      );
    }

    const pv = visits.filter(v => v.pid === pid);

    return (
      <div className="app">
        <header className="site-header">
          <h1>Kiboswa Medical Center</h1>
          <span className="hdr-right">{new Date().toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </header>
        <nav className="site-nav">
          <a href="/intake">Intake</a>
          <a href="/queue">Queue</a>
          <a href="/records">Records</a>
          <a href="/dashboard">Dashboard</a>
        </nav>
        <a href="/records" className="btn btn-gray" style={{ marginBottom: '12px', display: 'inline-block' }}>← All Records</a>
        <div className="card">
          <h2>Patient Record — KMC-{p.pid}</h2>
          <div className="form-row three">
            <div className="field"><label>Name</label><input value={p.name} readOnly style={{ background: '#f9f9f9' }} /></div>
            <div className="field"><label>Age</label><input value={p.age} readOnly style={{ background: '#f9f9f9' }} /></div>
            <div className="field"><label>Phone</label><input value={p.phone} readOnly style={{ background: '#f9f9f9' }} /></div>
          </div>
          <p style={{ fontSize: '12px', color: '#888' }}>Registered: {fmt(p.registeredAt)}</p>
          <h3 style={{ marginTop: '16px' }}>Visit History ({pv.length})</h3>
          {pv.length ? (
            pv.map(v => (
              <div key={v.vid} className="patient-row" onClick={() => {
                window.location.href = `/visit?vid=${v.vid}&back=records&backpid=${p.pid}`;
              }}>
                <div className="info">
                  <span className="name">V-{v.vid} · {fmt(v.startedAt)}</span>
                  <span className="sub">{statusLabel(v.status)}{v.disposition ? ' · ' + v.disposition : ''}</span>
                </div>
                <span className={`badge ${statusBadge(v.status)}`}>{statusLabel(v.status)}</span>
              </div>
            ))
          ) : (
            <p style={{ color: '#aaa', fontSize: '13px' }}>No visits yet.</p>
          )}
        </div>
      </div>
    );
  }

  const q = search.toLowerCase();
  const filtered = patients.filter(p =>
    !q || p.name.toLowerCase().includes(q) || String(p.pid).includes(q)
  );

  return (
    <div className="app">
      <header className="site-header">
        <h1>Kiboswa Medical Center</h1>
        <span className="hdr-right">{new Date().toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
      </header>
      <nav className="site-nav">
        <a href="/intake">Intake</a>
        <a href="/queue">Queue</a>
        <a href="/records">Records</a>
        <a href="/dashboard">Dashboard</a>
      </nav>
      <div className="card">
        <h2>All Patient Records</h2>
        <div className="search-bar">
          <input id="rec-search" placeholder="Search by name or patient ID..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div id="rec-list">
          {!filtered.length ? (
            <p style={{ color: '#aaa', fontSize: '13px' }}>No patients found.</p>
          ) : (
            filtered.map(p => <PatientRow key={p.pid} p={p} visits={visits} />)
          )}
        </div>
      </div>
    </div>
  );
}
