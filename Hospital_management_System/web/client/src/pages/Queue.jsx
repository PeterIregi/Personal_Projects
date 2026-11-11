import { useState, useEffect } from 'react';
import { API, statusBadge, statusLabel, fmt } from '../utils';

const ORDER = ['triage', 'consultation', 'department', 'pharmacy'];

export default function Queue() {
  const [visits, setVisits] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQueue();
  }, []);

  async function loadQueue() {
    setLoading(true);
    const all = await API.visits();
    setVisits(all.filter(v => v.status !== 'discharged'));
    setLoading(false);
  }

  function renderQueue() {
    let list = filter === 'all' ? visits : visits.filter(v => v.status === filter);
    list = [...list].sort((a, b) => ORDER.indexOf(a.status) - ORDER.indexOf(b.status));

    if (!list.length) {
      return <p style={{ color: '#aaa', fontSize: '13px' }}>No active patients in queue.</p>;
    }

    return list.map(v => (
      <div key={v.vid} className="patient-row" onClick={() => {
        window.location.href = `/visit?vid=${v.vid}&back=queue`;
      }}>
        <div className="info">
          <span className="name">KMC-{v.pid} — {v.patientName}</span>
          <span className="sub">Age {v.patientAge} · V-{v.vid} · {fmt(v.startedAt)}</span>
        </div>
        <span className={`badge ${statusBadge(v.status)}`}>{statusLabel(v.status)}</span>
      </div>
    ));
  }

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
        <h2>Active Queue</h2>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
          <button className={`btn btn-gray btn-sm ${filter === 'all' ? 'btn-primary' : ''}`} onClick={() => setFilter('all')}>All</button>
          <button className={`btn btn-gray btn-sm ${filter === 'triage' ? 'btn-primary' : ''}`} onClick={() => setFilter('triage')}>Triage</button>
          <button className={`btn btn-gray btn-sm ${filter === 'consultation' ? 'btn-primary' : ''}`} onClick={() => setFilter('consultation')}>Consultation</button>
          <button className={`btn btn-gray btn-sm ${filter === 'department' ? 'btn-primary' : ''}`} onClick={() => setFilter('department')}>Department</button>
          <button className={`btn btn-gray btn-sm ${filter === 'pharmacy' ? 'btn-primary' : ''}`} onClick={() => setFilter('pharmacy')}>Pharmacy</button>
          <button className="btn btn-gray btn-sm" onClick={loadQueue} style={{ marginLeft: 'auto' }}>↻ Refresh</button>
        </div>

        <div id="queue-list">
          {loading ? (
            <>
              <span className="spinner"></span> Loading...
            </>
          ) : renderQueue()}
        </div>
      </div>
    </div>
  );
}
