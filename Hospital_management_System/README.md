# Kiboswa Medical Center — Hospital Management System

A lightweight, local-first HMS built with Go (stdlib only) and vanilla JS.  
No database, no dependencies — data is stored in a single `data.json` file.

---

## Project Structure

```
Hospital_management_System/
├── main.go                     # Go HTTP server + REST API
├── go.mod
├── data.json                   # Auto-created on first run
└── web/
    ├── static/
    │   ├── css/style.css       # Shared stylesheet
    │   └── js/app.js           # Shared API client & utilities
    └── templates/
        ├── index.html          # Landing / home page
        ├── intake.html         # Patient intake & registration
        ├── queue.html          # Active patient queue
        ├── records.html        # Patient records & history
        ├── visit.html          # Visit detail (triage → consultation → dept → pharmacy → discharge)
        └── dashboard.html      # Daily summary & stats
```

---

## Running the Server

```bash
cd Hospital_management_System
go run main.go
```

Then open **http://localhost:8080** in your browser.

---

## REST API

| Method | Endpoint            | Description                  |
|--------|---------------------|------------------------------|
| GET    | /api/patients       | List all patients             |
| POST   | /api/patients       | Register a new patient        |
| GET    | /api/visits         | List all visits               |
| POST   | /api/visits         | Create a new visit            |
| GET    | /api/visits/{id}    | Get a single visit            |
| PUT    | /api/visits/{id}    | Update a visit (stage change) |

---

## Patient Flow

```
Intake → Triage → Consultation → Pharmacy → Discharged
                              ↘ Department(s) → Consultation / Pharmacy / Discharged
```

- **Intake**: identifies returning patients (all 3 fields must match for exact match;
  2-of-3 match triggers a confirmation prompt before registering as new).
- **Triage**: records vitals; any blank field uses the clinical default.
- **Consultation**: diagnosis notes, drug prescriptions, disposition routing.
- **Department**: findings logged; patient forwarded to pharmacy, another dept, or discharged.
- **Pharmacy**: prescriptions reviewed, resources dispensed, patient discharged.

---

## Data Persistence

All data lives in `data.json` in the project root.  
The file is created automatically on first run.  
Back it up regularly — it is the entire database.
