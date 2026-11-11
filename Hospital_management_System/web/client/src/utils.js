export const DEFAULTS = { temp: '37.0', bp: '120/80', pulse: '72', spo2: '98', rr: '16', weight: '' };

export const DEPTS = [
  'Radiology','Laboratory','Cardiology','Orthopaedics',
  'ENT','Gynaecology','Ophthalmology','Neurology','Dental'
];

export function now() { return new Date().toISOString(); }

export function fmt(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-KE', { day: '2-digit', month: 'short', year: 'numeric' })
       + ' ' + d.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' });
}

export function today() { return new Date().toDateString(); }

export function norm(s) { return String(s).trim().toLowerCase(); }

export function statusBadge(s) {
  return { triage: 'badge-orange', consultation: 'badge-blue', department: 'badge-purple',
           pharmacy: 'badge-teal', discharged: 'badge-green' }[s] || 'badge-gray';
}

export function statusLabel(s) {
  return { triage: 'Triage', consultation: 'Consultation', department: 'In Department',
           pharmacy: 'Pharmacy', discharged: 'Discharged' }[s] || s;
}

export { API } from './api';
