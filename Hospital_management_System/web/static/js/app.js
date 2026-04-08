const DB_KEY = "patients";

function getPatients(){
  return JSON.parse(localStorage.getItem(DB_KEY) || "[]");
}

function savePatients(p){
  localStorage.setItem(DB_KEY, JSON.stringify(p));
}

function registerPatient(){
  const name = document.getElementById("name").value;
  const age = document.getElementById("age").value;
  const phone = document.getElementById("phone").value;

  let patients = getPatients();
  patients.push({id: Date.now(), name, age, phone});
  savePatients(patients);

  alert("Patient Registered");
}

function renderQueue(){
  const el = document.getElementById("queue");
  const patients = getPatients();
  el.innerHTML = patients.map(p => `<div>${p.name}</div>`).join("");
}

function renderRecords(){
  const el = document.getElementById("records");
  const q = document.getElementById("search").value.toLowerCase();
  const patients = getPatients().filter(p => p.name.toLowerCase().includes(q));
  el.innerHTML = patients.map(p => `<div>${p.name}</div>`).join("");
}

function renderDashboard(){
  const el = document.getElementById("stats");
  const patients = getPatients();
  el.innerHTML = `Total Patients: ${patients.length}`;
}
