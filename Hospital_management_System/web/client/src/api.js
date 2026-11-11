export const API = {
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
