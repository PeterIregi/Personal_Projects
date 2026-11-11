import { useState, useEffect } from 'react';

export default function Index() {
  const [date, setDate] = useState('');

  useEffect(() => {
    const d = new Date();
    setDate(d.toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
  }, []);

  return (
    <div className="app">
      <header className="site-header">
        <h1>Kiboswa Medical Center</h1>
        <span className="hdr-right">{date}</span>
      </header>

      <nav className="site-nav">
        <a href="/intake">Intake</a>
        <a href="/queue">Queue</a>
        <a href="/records">Records</a>
        <a href="/dashboard">Dashboard</a>
      </nav>

      <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
        <h2 style={{ border: 0, color: '#1e88e5' }}>Welcome to Kiboswa HMS</h2>
        <p style={{ color: '#666', margin: '12px 0 24px' }}>Select a section from the navigation above to get started.</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/intake"    className="btn btn-primary">Patient Intake</a>
          <a href="/queue"     className="btn btn-warn">Active Queue</a>
          <a href="/records"   className="btn btn-gray">Records</a>
          <a href="/dashboard" className="btn btn-success">Dashboard</a>
        </div>
      </div>
    </div>
  );
}
