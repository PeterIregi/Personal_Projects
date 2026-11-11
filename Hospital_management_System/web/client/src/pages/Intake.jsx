import { useState, useEffect } from 'react';
import { API, norm, fmt } from '../utils';

export default function Intake() {
  const [patients, setPatients] = useState([]);
  const [msgText, setMsgText] = useState('');
  const [msgType, setMsgType] = useState('');
  const [found, setFound] = useState(null);
  const [fuzzy, setFuzzy] = useState([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    loadPatients();
  }, []);

  async function loadPatients() {
    const p = await API.patients();
    setPatients(p);
  }

  function setMsg(text, type) {
    setMsgText(text);
    setMsgType(type);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name || !age || !phone) {
      setMsg('Please fill in all three fields.', 'error');
      return;
    }

    const all = await API.patients();
    setPatients(all);

    const exact = all.find(p =>
      norm(p.name) === norm(name) &&
      String(p.age) === String(age) &&
      norm(p.phone) === norm(phone)
    );

    if (exact) {
      setMsg('Patient found — all details match.', 'success');
      setFound(exact);
      setFuzzy([]);
      return;
    }

    const fuzzyMatches = all.filter(p => {
      const mn = norm(p.name) === norm(name);
      const ma = String(p.age) === String(age);
      const mp = norm(p.phone) === norm(phone);
      return [mn, ma, mp].filter(Boolean).length === 2;
    });

    if (fuzzyMatches.length > 0) {
      setMsg('', '');
      setFuzzy(fuzzyMatches);
      setFound(null);
      return;
    }

    setMsg('No existing patient found. Registering as new.', 'info');
    const np = await API.createPatient({ name, age: parseInt(age), phone });
    setPatients([...all, np]);
    setFound(np);
    setFuzzy([]);
  }

  function fuzzyCard(p, m) {
    const rows = [
      { label: 'Full Name', existing: p.name, entered: name, match: m.mn },
      { label: 'Age', existing: p.age, entered: age, match: m.ma },
      { label: 'Phone', existing: p.phone, entered: phone, match: m.mp },
    ];

    return (
      <div key={p.pid} className="confirm-box">
        <h3>Possible match found — KMC-{p.pid}</h3>
        <p style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
          One detail doesn't match. Please confirm whether this is the same patient.
        </p>
        <table className="compare-table">
          <thead>
            <tr><th>Field</th><th>On file</th><th>Entered now</th></tr>
          </thead>
          <tbody>
            {rows.map(f => (
              <tr key={f.label}>
                <td className="field-label">{f.label}</td>
                <td className={f.match ? 'match-val' : 'mismatch-val'}>{f.existing}</td>
                <td className={f.match ? 'match-val' : 'mismatch-val'}>{f.entered}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="btn btn-success" onClick={() => confirmExisting(p.pid)}>
            Yes, this is the same patient
          </button>
          <button className="btn btn-gray" onClick={(e) => {
            e.currentTarget.closest('.confirm-box').style.opacity = '.4';
          }}>
            Not this patient
          </button>
        </div>
      </div>
    );
  }

  function confirmExisting(pid) {
    const p = patients.find(x => x.pid === pid);
    setMsg(`Patient confirmed — KMC-${p.pid}.`, 'success');
    setFound(p);
    setFuzzy([]);
  }

  async function registerNew() {
    const np = await API.createPatient({ name, age: parseInt(age), phone });
    setPatients([...patients, np]);
    setMsg(`New patient registered. ID: <strong>KMC-${np.pid}</strong>`, 'info');
    setFound(np);
    setFuzzy([]);
  }

  async function startVisit(pid) {
    const all = await API.patients();
    const p = all.find(x => x.pid === pid);
    const v = await API.createVisit({
      pid, patientName: p.name, patientAge: p.age, patientPhone: p.phone,
      status: 'triage',
      timeline: [{ event: 'Patient registered/identified and sent to triage', time: new Date().toISOString() }],
      vitals: {}, notes: [], drugs: [], dispensed: [], departments: [],
      consultationNotes: '', disposition: '',
    });
    setFound(null);
    setMsg(`Visit V-${v.vid} created. Patient is now in Triage.`, 'success');
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
        <h2>Patient Intake</h2>
        <div id="intake-msg" dangerouslySetInnerHTML={{ __html: msgText ? `<div class="msg msg-${msgType}">${msgText}</div>` : '' }}></div>
        <form onSubmit={handleSubmit}>
          <div className="form-row three">
            <div className="field">
              <label>Full Name</label>
              <input id="i-name" placeholder="e.g. Jane Doe" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="field">
              <label>Age</label>
              <input id="i-age" type="number" placeholder="e.g. 34" min="0" value={age} onChange={e => setAge(e.target.value)} />
            </div>
            <div className="field">
              <label>Phone Number</label>
              <input id="i-phone" placeholder="e.g. 0712345678" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
          </div>
          <div className="section-actions">
            <button className="btn btn-primary" type="submit">Find / Register Patient</button>
          </div>
        </form>
      </div>

      <div id="intake-found">
        {fuzzy.length > 0 ? (
          <>
            {fuzzy.map(p => {
              const mn = norm(p.name) === norm(name);
              const ma = String(p.age) === String(age);
              const mp = norm(p.phone) === norm(phone);
              return fuzzyCard(p, { mn, ma, mp });
            })}
            <div className="card">
              <h3 style={{ marginBottom: '8px' }}>Not the same person?</h3>
              <p style={{ fontSize: '13px', color: '#555', marginBottom: '12px' }}>
                If this is a different patient, register them as new.
              </p>
              <button className="btn btn-primary" onClick={registerNew}>
                Register as New Patient
              </button>
            </div>
          </>
        ) : null}
        {found && fuzzy.length === 0 ? (
          <ShowFound patient={found} startVisit={startVisit} />
        ) : null}
      </div>
    </div>
  );
}

function ShowFound({ patient, startVisit }) {
  const [active, setActive] = useState(null);

  useEffect(() => {
    API.visits().then(visits => {
      setActive(visits.find(v => v.pid === patient.pid && v.status !== 'discharged'));
    });
  }, [patient]);

  if (active) {
    return (
      <div className="card">
        <div className="msg msg-warn" style={{ marginTop: '10px' }}>
          Active visit V-{active.vid} already exists.
          <a href={`/visit?vid=${active.vid}&back=intake`} className="btn btn-primary btn-sm" style={{ marginLeft: '10px' }}>Open Visit</a>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Patient — KMC-{patient.pid}</h2>
      <div className="form-row three">
        <div className="field"><label>Name</label><input value={patient.name} readOnly style={{ background: '#f9f9f9' }} /></div>
        <div className="field"><label>Age</label><input value={patient.age} readOnly style={{ background: '#f9f9f9' }} /></div>
        <div className="field"><label>Phone</label><input value={patient.phone} readOnly style={{ background: '#f9f9f9' }} /></div>
      </div>
      <p style={{ fontSize: '12px', color: '#888' }}>Registered: {fmt(patient.registeredAt)}</p>
      <div className="section-actions">
        <button className="btn btn-success" onClick={() => startVisit(patient.pid)}>Send to Triage</button>
      </div>
    </div>
  );
}
