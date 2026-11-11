import { useState, useEffect } from 'react';
import { API, today, fmt, statusBadge, statusLabel } from '../utils';

export default function Dashboard() {
  const [patients, setPatients] = useState([]);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const [p, v] = await Promise.all([API.patients(), API.visits()]);
    setPatients(p);
    setVisits(v);
    setLoading(false);
  }

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

  const todayStr = today();
  const todayVisits = visits.filter(v => new Date(v.startedAt).toDateString() === todayStr);
  const active = visits.filter(v => v.status !== 'discharged');
  const dischargedToday = visits.filter(v => v.status === 'discharged' && new Date(v.startedAt).toDateString() === todayStr);

  const deptMap = {};
  active.filter(v => v.status === 'department').forEach(v => {
    deptMap[v.currentDept] = (deptMap[v.currentDept] || 0) + 1;
  });
  const stages = ['triage', 'consultation', 'pharmacy'];
  stages.forEach(s => {
    const count = active.filter(v => v.status === s).length;
    if (count) deptMap[statusLabel(s)] = count;
  });

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

      <div className="stat-row" id="dash-stats">
        <div className="stat"><div className="n">{patients.length}</div><div className="l">Total Patients</div></div>
        <div className="stat"><div className="n">{active.length}</div><div className="l">Active Now</div></div>
        <div className="stat"><div className="n">{todayVisits.length}</div><div className="l">Today's Visits</div></div>
        <div className="stat"><div className="n">{dischargedToday.length}</div><div className="l">Discharged Today</div></div>
      </div>

      <div className="card">
        <h2>Today's Visits</h2>
        <div id="dash-visits">
          {todayVisits.length
            ? todayVisits.map(v => (
                <div key={v.vid} className="patient-row" onClick={() => { window.location.href = `/visit?vid=${v.vid}&back=dashboard`; }}>
                  <div className="info">
                    <span className="name">KMC-{v.pid} — {v.patientName}</span>
                    <span className="sub">Age {v.patientAge} · V-{v.vid} · {fmt(v.startedAt)}</span>
                  </div>
                  <span className={`badge ${statusBadge(v.status)}`}>{statusLabel(v.status)}</span>
                </div>
              ))
            : <p style={{ color: '#aaa', fontSize: '13px' }}>No visits today yet.</p>}
        </div>
      </div>

      <div className="card">
        <h2>Queue by Department</h2>
        <div id="dash-depts">
          {!Object.keys(deptMap).length
            ? <p style={{ color: '#aaa', fontSize: '13px' }}>No active patients in departments.</p>
            : Object.entries(deptMap).map(([d, n]) => (
                <div key={d} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '13px', minWidth: '140px', color: '#555' }}>{d}</span>
                  <div style={{ flex: 1, background: '#eef4f8', borderRadius: '4px', height: '12px' }}>
                    <div style={{ width: `${Math.min(n * 40, 100)}%`, background: '#1e88e5', height: '12px', borderRadius: '4px' }}></div>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#1e88e5', minWidth: '20px' }}>{n}</span>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
