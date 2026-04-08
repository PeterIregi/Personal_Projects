package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"sync"
	"time"
)

// ── Data models ──────────────────────────────────────────────────────────────

type Patient struct {
	PID          int    `json:"pid"`
	Name         string `json:"name"`
	Age          int    `json:"age"`
	Phone        string `json:"phone"`
	RegisteredAt string `json:"registeredAt"`
}

type Vital struct {
	Temp       string `json:"temp"`
	BP         string `json:"bp"`
	Pulse      string `json:"pulse"`
	SpO2       string `json:"spo2"`
	RR         string `json:"rr"`
	Weight     string `json:"weight"`
	RecordedAt string `json:"recordedAt"`
}

type Note struct {
	Text string `json:"text"`
	Time string `json:"time"`
	By   string `json:"by"`
}

type Drug struct {
	Drug    string `json:"drug"`
	Dose    string `json:"dose"`
	AddedAt string `json:"addedAt"`
}

type Dispensed struct {
	Item string `json:"item"`
	Qty  string `json:"qty"`
	At   string `json:"at"`
}

type Department struct {
	Dept string `json:"dept"`
	At   string `json:"at"`
}

type TimelineEvent struct {
	Event string `json:"event"`
	Time  string `json:"time"`
}

type Visit struct {
	VID               int             `json:"vid"`
	PID               int             `json:"pid"`
	PatientName       string          `json:"patientName"`
	PatientAge        int             `json:"patientAge"`
	PatientPhone      string          `json:"patientPhone"`
	Status            string          `json:"status"`
	StartedAt         string          `json:"startedAt"`
	DischargedAt      string          `json:"dischargedAt,omitempty"`
	Timeline          []TimelineEvent `json:"timeline"`
	Vitals            Vital           `json:"vitals"`
	Notes             []Note          `json:"notes"`
	Drugs             []Drug          `json:"drugs"`
	Dispensed         []Dispensed     `json:"dispensed"`
	Departments       []Department    `json:"departments"`
	CurrentDept       string          `json:"currentDept,omitempty"`
	ConsultationNotes string          `json:"consultationNotes"`
	Disposition       string          `json:"disposition"`
}

// ── In-memory store with file persistence ────────────────────────────────────

type Store struct {
	mu       sync.RWMutex
	Patients []Patient `json:"patients"`
	Visits   []Visit   `json:"visits"`
	dataFile string
}

func newStore(dataFile string) *Store {
	s := &Store{dataFile: dataFile}
	if err := s.load(); err != nil {
		log.Printf("Starting fresh store: %v", err)
		s.Patients = []Patient{}
		s.Visits = []Visit{}
	}
	return s
}

func (s *Store) load() error {
	data, err := os.ReadFile(s.dataFile)
	if err != nil {
		return err
	}
	return json.Unmarshal(data, s)
}

func (s *Store) save() {
	data, err := json.MarshalIndent(s, "", "  ")
	if err != nil {
		log.Printf("Error marshalling store: %v", err)
		return
	}
	if err := os.WriteFile(s.dataFile, data, 0644); err != nil {
		log.Printf("Error saving store: %v", err)
	}
}

func (s *Store) nextPID() int {
	max := 1000
	for _, p := range s.Patients {
		if p.PID > max {
			max = p.PID
		}
	}
	return max + 1
}

func (s *Store) nextVID() int {
	max := 5000
	for _, v := range s.Visits {
		if v.VID > max {
			max = v.VID
		}
	}
	return max + 1
}

// ── Helpers ──────────────────────────────────────────────────────────────────

var store *Store

func now() string {
	return time.Now().UTC().Format(time.RFC3339)
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(v)
}

func readJSON(r *http.Request, v any) error {
	return json.NewDecoder(r.Body).Decode(v)
}

func errJSON(w http.ResponseWriter, status int, msg string) {
	writeJSON(w, status, map[string]string{"error": msg})
}

// ── Patient handlers ──────────────────────────────────────────────────────────

func handlePatients(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		store.mu.RLock()
		defer store.mu.RUnlock()
		writeJSON(w, http.StatusOK, store.Patients)

	case http.MethodPost:
		var p Patient
		if err := readJSON(r, &p); err != nil {
			errJSON(w, http.StatusBadRequest, "invalid body")
			return
		}
		store.mu.Lock()
		defer store.mu.Unlock()
		p.PID = store.nextPID()
		p.RegisteredAt = now()
		store.Patients = append(store.Patients, p)
		store.save()
		writeJSON(w, http.StatusCreated, p)

	default:
		errJSON(w, http.StatusMethodNotAllowed, "method not allowed")
	}
}

// ── Visit handlers ────────────────────────────────────────────────────────────

func handleVisits(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		store.mu.RLock()
		defer store.mu.RUnlock()
		writeJSON(w, http.StatusOK, store.Visits)

	case http.MethodPost:
		var v Visit
		if err := readJSON(r, &v); err != nil {
			errJSON(w, http.StatusBadRequest, "invalid body")
			return
		}
		store.mu.Lock()
		defer store.mu.Unlock()
		v.VID = store.nextVID()
		v.StartedAt = now()
		if v.Timeline == nil {
			v.Timeline = []TimelineEvent{}
		}
		if v.Notes == nil {
			v.Notes = []Note{}
		}
		if v.Drugs == nil {
			v.Drugs = []Drug{}
		}
		if v.Dispensed == nil {
			v.Dispensed = []Dispensed{}
		}
		if v.Departments == nil {
			v.Departments = []Department{}
		}
		store.Visits = append(store.Visits, v)
		store.save()
		writeJSON(w, http.StatusCreated, v)

	default:
		errJSON(w, http.StatusMethodNotAllowed, "method not allowed")
	}
}

func handleVisitByID(w http.ResponseWriter, r *http.Request) {
	idStr := filepath.Base(r.URL.Path)
	id, err := strconv.Atoi(idStr)
	if err != nil {
		errJSON(w, http.StatusBadRequest, "invalid visit id")
		return
	}

	switch r.Method {
	case http.MethodGet:
		store.mu.RLock()
		defer store.mu.RUnlock()
		for _, v := range store.Visits {
			if v.VID == id {
				writeJSON(w, http.StatusOK, v)
				return
			}
		}
		errJSON(w, http.StatusNotFound, "visit not found")

	case http.MethodPut:
		var updated Visit
		if err := readJSON(r, &updated); err != nil {
			errJSON(w, http.StatusBadRequest, "invalid body")
			return
		}
		store.mu.Lock()
		defer store.mu.Unlock()
		for i, v := range store.Visits {
			if v.VID == id {
				updated.VID = id
				store.Visits[i] = updated
				store.save()
				writeJSON(w, http.StatusOK, updated)
				return
			}
		}
		errJSON(w, http.StatusNotFound, "visit not found")

	default:
		errJSON(w, http.StatusMethodNotAllowed, "method not allowed")
	}
}

// ── Router ────────────────────────────────────────────────────────────────────

func main() {
	dataFile := "data.json"
	store = newStore(dataFile)

	mux := http.NewServeMux()

	// Static files
	fs := http.FileServer(http.Dir("web/static"))
	mux.Handle("/static/", http.StripPrefix("/static/", fs))

	// Pages
	pages := map[string]string{
		"/":            "web/templates/index.html",
		"/intake":      "web/templates/intake.html",
		"/queue":       "web/templates/queue.html",
		"/records":     "web/templates/records.html",
		"/visit":       "web/templates/visit.html",
		"/dashboard":   "web/templates/dashboard.html",
	}
	for route, file := range pages {
		f := file
		mux.HandleFunc(route, func(w http.ResponseWriter, r *http.Request) {
			if r.URL.Path != r.URL.Path[:len(route)] && route != "/" {
				http.NotFound(w, r)
				return
			}
			http.ServeFile(w, r, f)
		})
	}

	// API
	mux.HandleFunc("/api/patients", handlePatients)
	mux.HandleFunc("/api/visits", handleVisits)
	mux.HandleFunc("/api/visits/", handleVisitByID)

	addr := ":8080"
	log.Printf("Kiboswa HMS running at http://localhost%s", addr)
	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Fatal(err)
	}
}
