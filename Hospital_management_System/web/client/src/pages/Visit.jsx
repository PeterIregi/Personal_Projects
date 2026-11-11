import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { API, DEFAULTS, DEPTS, now, fmt, statusBadge, statusLabel } from '../utils';

export default function Visit() {
  const [searchParams] = useSearchParams();
  const [visit, setVisit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deptNextChoice, setDeptNextChoice] = useState('pharmacy');

  const VID = parseInt(searchParams.get('vid'));
  const BACK = searchParams.get('back') || 'queue';
  const BACK_PID = searchParams.get('backpid') || '';

  useEffect(() => {
    loadVisit();
  }, []);

  async function loadVisit() {
    const v = await API.visit(VID);
    setVisit(v);
    setLoading(false);
  }

  function backURL() {
    const map = { intake: '/intake', queue: '/queue', dashboard: '/dashboard' };
    if (BACK === 'records') return BACK_PID ? `/records?pid=${BACK_PID}` : '/records';
    return map[BACK] || '/queue';
  }

  if (loading || !visit) {
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

  const stages = {
    triage: renderTriage,
    consultation: renderConsultation,
    department: renderDepartment,
    pharmacy: renderPharmacy,
    discharged: renderDischarged,
  };

  const StageRenderer = stages[visit.status] || stages.triage;

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
      <a href={backURL()} className="btn btn-gray" style={{ marginBottom: '12px', display: 'inline-block' }}>← Back</a>
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div>
            <h2 style={{ border: 0, padding: 0, margin: 0 }}>V-{visit.vid} — {visit.patientName}</h2>
            <p style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>KMC-{visit.pid} · Age {visit.patientAge} · {visit.patientPhone}</p>
          </div>
          <span className={`badge ${statusBadge(visit.status)}`}>{statusLabel(visit.status)}</span>
        </div>
        <div className="timeline">
          {(visit.timeline || []).map((t, i) => (
            <div key={i} className="tl-item">
              <strong style={{ fontSize: '12px' }}>{t.event}</strong><br />
              <span className="tl-time">{fmt(t.time)}</span>
            </div>
          ))}
        </div>
      </div>
      <StageRenderer />
    </div>
  );

  /* ── Triage ───────────────────────────────────────────────── */
  function renderTriage() {
    return (
      <div className="card">
        <h2>Triage — Record Vitals</h2>
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '14px' }}>Leave any field blank to use the clinical default shown.</p>
        <div className="form-row three">
          <div className="field">
            <label>Temperature (°C) <span style={{ color: '#aaa' }}>{`[${DEFAULTS.temp}]`}</span></label>
            <input id="v-temp" placeholder={DEFAULTS.temp} />
          </div>
          <div className="field">
            <label>Blood Pressure <span style={{ color: '#aaa' }}>{`[${DEFAULTS.bp}]`}</span></label>
            <input id="v-bp" placeholder={DEFAULTS.bp} />
          </div>
          <div className="field">
            <label>Pulse (bpm) <span style={{ color: '#aaa' }}>{`[${DEFAULTS.pulse}]`}</span></label>
            <input id="v-pulse" placeholder={DEFAULTS.pulse} />
          </div>
        </div>
        <div className="form-row three">
          <div className="field">
            <label>SpO₂ (%) <span style={{ color: '#aaa' }}>{`[${DEFAULTS.spo2}]`}</span></label>
            <input id="v-spo2" placeholder={DEFAULTS.spo2} />
          </div>
          <div className="field">
            <label>Resp. Rate <span style={{ color: '#aaa' }}>{`[${DEFAULTS.rr}]`}</span></label>
            <input id="v-rr" placeholder={DEFAULTS.rr} />
          </div>
          <div className="field">
            <label>Weight (kg)</label>
            <input id="v-weight" placeholder="optional" />
          </div>
        </div>
        <div className="field" style={{ marginBottom: '12px' }}>
          <label>Chief Complaint / Notes</label>
          <textarea id="v-notes" rows={2} placeholder="Brief description of presenting complaint..." />
        </div>
        <div className="section-actions">
          <button className="btn btn-primary" onClick={() => submitTriage(false)}>Save Vitals & Send to Consultation</button>
          <button className="btn btn-gray" onClick={() => submitTriage(true)}>Skip Vitals & Send to Consultation</button>
        </div>
      </div>
    );
  }

  async function submitTriage(skip) {
    const g = (id) => document.getElementById(id);
    const nextVisit = { ...visit };
    nextVisit.vitals = {
      temp: (!skip && g('v-temp').value.trim()) || DEFAULTS.temp,
      bp: (!skip && g('v-bp').value.trim()) || DEFAULTS.bp,
      pulse: (!skip && g('v-pulse').value.trim()) || DEFAULTS.pulse,
      spo2: (!skip && g('v-spo2').value.trim()) || DEFAULTS.spo2,
      rr: (!skip && g('v-rr').value.trim()) || DEFAULTS.rr,
      weight: (!skip && g('v-weight').value.trim()) || 'N/A',
      recordedAt: now(),
    };
    const notes = !skip ? g('v-notes').value.trim() : '';
    if (notes) nextVisit.notes = [...(visit.notes || []), { text: notes, time: now(), by: 'Triage' }];
    nextVisit.status = 'consultation';
    nextVisit.timeline = [...(visit.timeline || []), { event: `Vitals recorded${skip ? ' (defaults used)' : ''} — sent to Consultation`, time: now() }];
    const updated = await API.updateVisit(nextVisit);
    setVisit(updated);
    setDeptNextChoice('pharmacy');
  }

  /* ── Consultation ─────────────────────────────────────────── */
  function renderConsultation() {
    const vt = visit.vitals;
    const drugsHTML = (visit.drugs || []).map((d, i) => drugRow(d, i));

    return (
      <div className="card">
        <h2>Consultation</h2>
        <div className="vitals-grid">
          <div className="vital-card"><div className="val">{vt.temp}°C</div><div className="lbl">Temperature</div></div>
          <div className="vital-card"><div className="val">{vt.bp}</div><div className="lbl">Blood Pressure</div></div>
          <div className="vital-card"><div className="val">{vt.pulse} bpm</div><div className="lbl">Pulse</div></div>
          <div className="vital-card"><div className="val">{vt.spo2}%</div><div className="lbl">SpO₂</div></div>
          <div className="vital-card"><div className="val">{vt.rr}</div><div className="lbl">Resp. Rate</div></div>
          <div className="vital-card"><div className="val">{vt.weight === 'N/A' ? '—' : vt.weight + ' kg'}</div><div className="lbl">Weight</div></div>
        </div>
        <div className="field" style={{ marginBottom: '12px' }}>
          <label>Consultation Notes / Diagnosis</label>
          <textarea id="c-notes" rows={3} defaultValue={visit.consultationNotes || ''} placeholder="Enter findings, diagnosis, treatment plan..." />
        </div>
        <h3>Prescribe Medications</h3>
        <div id="drug-list">{drugsHTML}</div>
        <button className="btn btn-gray" style={{ marginBottom: '14px', fontSize: '12px' }} onClick={addDrug}>+ Add Medication</button>
        <h3>Disposition</h3>
        <div className="form-row" style={{ marginBottom: 0 }}>
          <div className="field">
            <label>Select action</label>
            <select id="c-disp" defaultValue="">
              <option value="">— choose —</option>
              <option value="pharmacy">Send to Pharmacy</option>
              {DEPTS.map(d => <option key={d} value={`dept:${d}`}>Refer to {d}</option>)}
              <option value="discharge">Discharge (no meds/referral)</option>
            </select>
          </div>
        </div>
        <div className="section-actions" style={{ marginTop: '12px' }}>
          <button className="btn btn-primary" onClick={submitConsultation}>Confirm & Proceed</button>
        </div>
      </div>
    );
  }

  function drugRow(d, i) {
    return (
      <div key={i} className="drug-row">
        <input value={d.drug} placeholder="Drug name" onChange={e => { const next = { ...visit }; next.drugs = [...(visit.drugs || [])]; next.drugs[i] = { ...next.drugs[i], drug: e.target.value }; setVisit(next); }} />
        <input value={d.dose} placeholder="Dose & freq." style={{ maxWidth: '160px' }} onChange={e => { const next = { ...visit }; next.drugs = [...(visit.drugs || [])]; next.drugs[i] = { ...next.drugs[i], dose: e.target.value }; setVisit(next); }} />
        <button className="btn btn-danger btn-sm" onClick={() => removeDrug(i)}>✕</button>
      </div>
    );
  }

  function addDrug() {
    const next = { ...visit };
    next.drugs = [...(visit.drugs || []), { drug: '', dose: '', addedAt: now() }];
    setVisit(next);
  }

  function removeDrug(i) {
    const next = { ...visit };
    next.drugs = [...(visit.drugs || [])];
    next.drugs.splice(i, 1);
    setVisit(next);
  }

  async function submitConsultation() {
    const notes = document.getElementById('c-notes').value.trim();
    const disp = document.getElementById('c-disp').value;
    if (!disp) { alert('Please select a disposition.'); return; }

    const next = { ...visit };
    next.consultationNotes = notes;
    if (notes) next.notes = [...(visit.notes || []), { text: notes, time: now(), by: 'Doctor' }];

    if (disp === 'pharmacy') {
      next.status = 'pharmacy'; next.disposition = 'Sent to Pharmacy';
      next.timeline = [...(visit.timeline || []), { event: 'Consultation complete — sent to Pharmacy', time: now() }];
    } else if (disp.startsWith('dept:')) {
      const dept = disp.replace('dept:', '');
      next.status = 'department'; next.disposition = `Referred to ${dept}`;
      next.currentDept = dept; next.departments = [...(visit.departments || []), { dept, at: now() }];
      next.timeline = [...(visit.timeline || []), { event: `Referred to ${dept}`, time: now() }];
    } else if (disp === 'discharge') {
      next.status = 'discharged'; next.disposition = 'Discharged after consultation';
      next.dischargedAt = now();
      next.timeline = [...(visit.timeline || []), { event: 'Patient discharged after consultation', time: now() }];
    }

    const updated = await API.updateVisit(next);
    setVisit(updated);
  }

  /* ── Department ───────────────────────────────────────────── */
  function renderDepartment() {
    return (
      <div className="card">
        <h2>{visit.currentDept || 'Department'}</h2>
        <div className="msg msg-info">Patient referred to <strong>{visit.currentDept}</strong> for further investigation.</div>
        <div className="field" style={{ marginBottom: '12px' }}>
          <label>Department Findings / Report</label>
          <textarea id="dept-notes" rows={3} placeholder="Enter department report, test results..." />
        </div>
        <h3 style={{ marginBottom: '8px' }}>After Review — Next Step</h3>
        <div className="dept-grid">
          <div className={`dept-btn ${deptNextChoice === 'pharmacy' ? 'selected' : ''}`} id="dn-pharmacy" onClick={() => selDept('pharmacy')}>Send to Pharmacy</div>
          <div className={`dept-btn ${deptNextChoice === 'consult' ? 'selected' : ''}`} id="dn-consult" onClick={() => selDept('consult')}>Back to Consultation</div>
          <div className={`dept-btn ${deptNextChoice === 'discharge' ? 'selected' : ''}`} id="dn-discharge" onClick={() => selDept('discharge')}>Discharge</div>
          {DEPTS.filter(d => d !== visit.currentDept).map(d => (
            <div key={d} className={`dept-btn ${deptNextChoice === `dept:${d}` ? 'selected' : ''}`} id={`dn-${d.replace(/\s/g, '')}`} onClick={() => selDept(`dept:${d}`)}>{d}</div>
          ))}
        </div>
        <div className="section-actions">
          <button className="btn btn-primary" onClick={submitDepartment}>Confirm & Proceed</button>
        </div>
      </div>
    );
  }

  function selDept(val) {
    setDeptNextChoice(val);
  }

  async function submitDepartment() {
    const notes = document.getElementById('dept-notes').value.trim();
    const next = { ...visit };
    if (notes) next.notes = [...(visit.notes || []), { text: `[${visit.currentDept}] ${notes}`, time: now(), by: visit.currentDept }];

    const choice = deptNextChoice || 'pharmacy';
    if (choice === 'pharmacy') {
      next.status = 'pharmacy'; next.disposition = `Sent to Pharmacy after ${visit.currentDept}`;
      next.timeline = [...(visit.timeline || []), { event: `${visit.currentDept} report done — sent to Pharmacy`, time: now() }];
    } else if (choice === 'consult') {
      next.status = 'consultation'; next.disposition = 'Returned to Consultation';
      next.timeline = [...(visit.timeline || []), { event: `${visit.currentDept} report done — returned to Consultation`, time: now() }];
    } else if (choice === 'discharge') {
      next.status = 'discharged'; next.disposition = `Discharged after ${visit.currentDept}`;
      next.dischargedAt = now();
      next.timeline = [...(visit.timeline || []), { event: `Discharged after ${visit.currentDept}`, time: now() }];
    } else if (choice.startsWith('dept:')) {
      const dept = choice.replace('dept:', '');
      next.currentDept = dept; next.departments = [...(visit.departments || []), { dept, at: now() }];
      next.timeline = [...(visit.timeline || []), { event: `Referred to ${dept}`, time: now() }];
    }

    const updated = await API.updateVisit(next);
    setVisit(updated);
    setDeptNextChoice('pharmacy');
  }

  /* ── Pharmacy ─────────────────────────────────────────────── */
  function renderPharmacy() {
    const drugs = (visit.drugs || []).filter(d => d.drug);
    const dispensedHTML = (visit.dispensed || []).map((d, i) => dispensedRow(d, i));

    return (
      <div className="card">
        <h2>Pharmacy</h2>
        {drugs.length
          ? (
            <>
              <h3>Prescribed Medications</h3>
              <ul className="note-list">{drugs.map(d => <li key={d.drug + d.dose}><strong>{d.drug}</strong> — {d.dose || 'no dose specified'}</li>)}</ul>
            </>
          )
          : <div className="msg msg-warn">No medications prescribed.</div>}
        <div className="field" style={{ margin: '14px 0 0' }}>
          <label>Pharmacist Notes / Substitutions</label>
          <textarea id="ph-notes" rows={2} placeholder="Dispensing notes, substitutions..." />
        </div>
        <h3 style={{ marginTop: '14px' }}>Resources Dispensed</h3>
        <div id="dispensed-list">{dispensedHTML}</div>
        <button className="btn btn-gray" style={{ marginBottom: '14px', fontSize: '12px' }} onClick={addDispensed}>+ Add dispensed item</button>
        <div className="section-actions">
          <button className="btn btn-success" onClick={dischargePatient}>Dispense & Discharge Patient</button>
        </div>
      </div>
    );
  }

  function dispensedRow(d, i) {
    return (
      <div key={i} className="drug-row">
        <input value={d.item} placeholder="Item / drug dispensed" onChange={e => { const next = { ...visit }; next.dispensed = [...(visit.dispensed || [])]; next.dispensed[i] = { ...next.dispensed[i], item: e.target.value }; setVisit(next); }} />
        <input value={d.qty} placeholder="Qty / units" style={{ maxWidth: '130px' }} onChange={e => { const next = { ...visit }; next.dispensed = [...(visit.dispensed || [])]; next.dispensed[i] = { ...next.dispensed[i], qty: e.target.value }; setVisit(next); }} />
        <button className="btn btn-danger btn-sm" onClick={() => removeDispensed(i)}>✕</button>
      </div>
    );
  }

  function addDispensed() {
    const next = { ...visit };
    if (!next.dispensed) next.dispensed = [];
    next.dispensed = [...next.dispensed, { item: '', qty: '', at: now() }];
    setVisit(next);
  }

  function removeDispensed(i) {
    const next = { ...visit };
    next.dispensed = [...(visit.dispensed || [])];
    next.dispensed.splice(i, 1);
    setVisit(next);
  }

  async function dischargePatient() {
    const notes = document.getElementById('ph-notes').value.trim();
    const next = { ...visit };
    if (notes) next.notes = [...(visit.notes || []), { text: `[Pharmacy] ${notes}`, time: now(), by: 'Pharmacy' }];
    next.status = 'discharged'; next.dischargedAt = now();
    if (!next.disposition) next.disposition = 'Discharged via Pharmacy';
    next.timeline = [...(visit.timeline || []), { event: 'Medications dispensed — patient discharged', time: now() }];
    const updated = await API.updateVisit(next);
    setVisit(updated);
  }

  /* ── Discharged ───────────────────────────────────────────── */
  function renderDischarged() {
    const drugs = (visit.drugs || []).filter(d => d.drug);
    const dispensed = (visit.dispensed || []);

    return (
      <div className="card">
        <h2>Visit Complete — Discharged</h2>
        <div className="msg msg-success">
          Patient discharged on {fmt(visit.dischargedAt)}. Disposition: <strong>{visit.disposition}</strong>
        </div>
        <h3 style={{ marginTop: '14px' }}>Vitals Summary</h3>
        <div className="vitals-grid">
          <div className="vital-card"><div className="val">{visit.vitals.temp || '—'}°C</div><div className="lbl">Temperature</div></div>
          <div className="vital-card"><div className="val">{visit.vitals.bp || '—'}</div><div className="lbl">Blood Pressure</div></div>
          <div className="vital-card"><div className="val">{visit.vitals.pulse || '—'}</div><div className="lbl">Pulse</div></div>
          <div className="vital-card"><div className="val">{visit.vitals.spo2 || '—'}%</div><div className="lbl">SpO₂</div></div>
          <div className="vital-card"><div className="val">{visit.vitals.rr || '—'}</div><div className="lbl">Resp. Rate</div></div>
          <div className="vital-card"><div className="val">{visit.vitals.weight === 'N/A' ? '—' : (visit.vitals.weight || '—') + ' kg'}</div><div className="lbl">Weight</div></div>
        </div>
        {visit.consultationNotes
          ? (
            <>
              <h3 style={{ marginTop: '14px' }}>Consultation Notes</h3>
              <p style={{ fontSize: '13px', color: '#444' }}>{visit.consultationNotes}</p>
            </>
          )
          : null}
        {drugs.length
          ? (
            <>
              <h3 style={{ marginTop: '14px' }}>Prescribed</h3>
              <ul className="note-list">{drugs.map(d => <li key={d.drug}>{d.drug} — {d.dose}</li>)}</ul>
            </>
          )
          : null}
        {dispensed.length
          ? (
            <>
              <h3 style={{ marginTop: '14px' }}>Dispensed Resources</h3>
              <ul className="note-list">{dispensed.map(d => <li key={d.item}>{d.item} · {d.qty}</li>)}</ul>
            </>
          )
          : null}
        {(visit.departments || []).length
          ? (
            <>
              <h3 style={{ marginTop: '14px' }}>Departments Visited</h3>
              <ul className="note-list">{visit.departments.map(d => <li key={d.dept}>{d.dept} — {fmt(d.at)}</li>)}</ul>
            </>
          )
          : null}
        {(visit.notes || []).length
          ? (
            <>
              <h3 style={{ marginTop: '14px' }}>All Clinical Notes</h3>
              <ul className="note-list">
                {visit.notes.map((n, i) => (
                  <li key={i}>
                    <span style={{ color: '#888', fontSize: '11px' }}>{`[${n.by}] ${fmt(n.time)}`}</span><br />
                    {n.text}
                  </li>
                ))}
              </ul>
            </>
          )
          : null}
      </div>
    );
  }
}
