# 🧠 SmritiCare (SIH26003)
### AI-Powered Cognitive Care & Memory Assistance Platform
> *"Helping memories stay connected."*

---

## 📌 Problem Statement Overview
- **Problem Statement ID:** SIH26003
- **Theme:** Smart Healthcare / MedTech / Digital Assistive Technology
- **Target Audience:** Elderly individuals experiencing early-to-moderate dementia, cognitive decline, or memory loss in the **North Eastern Region (NER) of India**, along with their family caregivers and community healthcare workers.

---

## 🌟 Key Innovations & Presentation Highlights
1. **Elderly-First Ergonomic UI:** Large readable fonts, high-contrast palette, 48px+ touch targets, simple non-overwhelming layouts, and zero technical jargon.
2. **Culturally Familiar Memory Stimulation:** Cognitive games incorporate North Eastern heritage, local fruits (Mango), wildlife (One-Horned Rhino of Kaziranga), flora (Orchids & Lotus), folk traditions (Bihu Dhol, Joha Rice, Assam Tea, Traditional Bamboo Homes).
3. **Rule-Based Adaptive AI Difficulty Engine:** Dynamically analyzes user response times, accuracy, and error rates to adjust game difficulty (Easy, Medium, Hard).
4. **Multilingual Inclusivity:** Dynamic translation engine supporting **8 languages** (English, Hindi, Bengali, Assamese, Manipuri, Khasi, Mizo, Nagamese).
5. **Voice Assistant with Web Speech API:** Speech recognition and speech synthesis allowing hands-free voice interactions ("When is my medicine?", "Start my brain game", "Remind me to drink water").
6. **Triple-Role Ecosystem:**
   - **Elderly Patient Portal (`patient.html`):** Simple, calming, routine checklist, hydration logger, mood check-in, cultural memory viewer.
   - **Caregiver Portal (`caregiver.html`):** 7-day responsive cognitive activity charts, missed dose alerts, streak tracking, patient switching.
   - **Healthcare Worker Portal (`healthcare.html`):** Multi-patient triage table, risk filters (Attention Needed vs Stable), search, and tele-care escalation.
7. **Offline-First PWA Architecture:** Works without active internet connectivity in remote hilly terrain, buffering telemetry in `LocalStorage` with an interactive "Sync Now" simulator.
8. **Built-in Accessibility Drawer (♿):** Large text scaling, High-Contrast Black/Yellow mode, and reduced motion toggles.

---

## 🚀 How to Run the Project

### Option 1: VS Code Live Server (Recommended)
1. Open the project folder `project SIH` in **Visual Studio Code**.
2. Right-click on `index.html` and select **"Open with Live Server"**.
3. The platform will open automatically at `http://127.0.0.1:5500/index.html`.

### Option 2: Python Local Server
Run in PowerShell / Terminal:
```bash
# Python 3
python -m http.server 8000
```
Open your browser at `http://localhost:8000/index.html`.

### Option 3: Direct Browser Launch
Double-click `index.html` in your file explorer to open it in Google Chrome, Microsoft Edge, or Mozilla Firefox.

---

## 📂 Project Architecture

```text
SIH26003/
│
├── index.html            # Landing page (Hero, NER challenge, solution, workflow, data security)
├── login.html            # Quick role switcher & simulated authentication portal
├── patient.html          # Elderly Patient Dashboard (Voice, routine, hydration, mood, memories)
├── games.html            # Cognitive Activities Hub (5 cognitive games + AI difficulty insight)
├── memory-game.html      # Fully interactive Memory Match game with NER cultural cards & timer
├── reminders.html        # Smart Reminders & Routine management (CRUD + Speech audio readout)
├── caregiver.html        # Caregiver Intelligence Dashboard (7-day Canvas chart, alerts, logs)
├── healthcare.html       # Healthcare Worker Portal (Multi-patient triage table & filters)
├── manifest.json         # PWA Manifest for standalone app installation
├── service-worker.js     # Service worker caching for offline resilience
├── README.md             # Project documentation & presentation guide
│
├── css/
│   └── style.css         # Design system (Variables, High-Contrast, A11y scaling, responsive grid)
│
├── js/
│   ├── main.js           # Core state, LocalStorage manager, i18n dictionary, A11y, offline sync
│   ├── patient.js        # Patient UI, mood check-in, hydration, speech recognition & synthesis
│   ├── games.js          # Cognitive game catalog, AI adaptive difficulty calculation engine
│   ├── memory-game.js    # Interactive Memory card engine, move/match tracker, scoring algorithm
│   ├── reminders.js      # Reminders filter, add modal, status toggle, voice reminder playback
│   └── dashboard.js      # Caregiver & Healthcare analytics, Canvas chart, patient switching
│
└── assets/
    └── icons/
        ├── icon-192.svg  # App icon for PWA
        └── icon-512.svg  # High-res App icon for PWA
```

---

## 🔑 Demo Login Credentials (SIH Presentation)

| Role | Name / Email | Preset Portal |
| :--- | :--- | :--- |
| **Patient** | `ananya.das@smriticare.ner` (Mrs. Ananya Das, Age 72, Assam) | `patient.html` |
| **Caregiver** | `priya.das@familycare.in` (Priya Das - Family Caregiver) | `caregiver.html` |
| **Healthcare Worker**| `dr.barua@gmch.assam.gov.in` (Community Health Officer) | `healthcare.html` |
| **State Admin** | `admin@smriticare.gov.in` (NER Health Directorate) | `healthcare.html` |

*(All portals can be accessed directly from `login.html` via one-click demo buttons).*

---

## 🕹️ 3–5 Minute SIH Presentation Walkthrough

1. **Step 1: Landing Page (`index.html`)**
   - Introduce the product name **SmritiCare** and highlight the North Eastern Region healthcare challenge.
   - Toggle the language dropdown to **Assamese / Hindi / Bengali** to demonstrate regional inclusivity.
   - Open the **♿ Accessibility Drawer** and demonstrate **High Contrast Mode** and **Larger Text**.
2. **Step 2: Role Selection & Patient Portal (`patient.html`)**
   - Show Mrs. Das's personalized morning dashboard with large buttons.
   - Click the **"Drink Water"** button to log hydration and hear speech synthesis audio.
   - Tap an emotion (e.g. **😊 Happy**) in "How are you feeling today?" to log daily mood.
   - Tap the microphone in the **Voice Assistant** or click `"Start my brain game"`.
3. **Step 3: Interactive Cognitive Gaming (`memory-game.html`)**
   - Play the **Memory Match** game: flip culturally familiar cards (🦏 Rhino, 🍵 Assam Tea, 🥁 Bihu Dhol).
   - Show how the timer, moves, matches, and accuracy compute live.
   - On completion, showcase the **"Well Done!" Win Modal** with the **SmritiCare AI Adaptive Difficulty Recommendation**.
4. **Step 4: Reminders Hub (`reminders.html`)**
   - Show category filtering (💊 Medicine, 💧 Hydration, 🚶 Activity).
   - Click **"🔊 Speak"** to hear the browser read aloud the medicine schedule.
   - Add a custom reminder or mark an existing one complete.
5. **Step 5: Caregiver Analytics (`caregiver.html`)**
   - Switch between patients (Mrs. Das, Mr. Sharma, Mrs. Devi).
   - Highlight the **7-Day Cognitive Activity Chart** and **Domain Progress Bars** (Memory, Attention, Recognition, Routine).
   - Observe the game session just played in the live **Activity Log table** (synced via `LocalStorage`).
   - Review urgent alerts (e.g., missed blood pressure medicine).
6. **Step 6: Healthcare Worker Triage (`healthcare.html`)**
   - Demonstrate the multi-patient triage table with filter tabs (**All**, **Attention Needed**, **Stable**).
   - Open a patient profile drawer to assess domain breakdown and initiate tele-care escalation.
   - Demonstrate the **Offline Indicator** and click **"Sync Demo"** to show resilience for remote hill clinics.

---

## 🧪 Simulated vs. Real Prototype Features

| Feature | Prototype Status | Production Architecture |
| :--- | :--- | :--- |
| **Cognitive Games Engine** | ✅ **Real Functional Implementation** | Expanded catalog with EEG headset / eye-tracking support |
| **Scoring & Accuracy Logic** | ✅ **Real Functional Algorithm** | Longitudinal baseline neural drift detection |
| **Adaptive Difficulty** | ✅ **Real Rule-Based Algorithm** | Reinforcement Learning / Bayesian Knowledge Tracing |
| **Voice Assistant** | ✅ **Real Web Speech API + SpeechSynthesis** | Fine-tuned Indic-Whisper voice AI model |
| **Multilingual Engine** | ✅ **Real 8-Language Dictionary** | Real-time Neural Machine Translation (Bhashini AI API) |
| **Data Persistence** | ✅ **Real LocalStorage Simulation** | HIPAA/ABDM-compliant FHIR Cloud Database |
| **Offline Mode** | ✅ **Real PWA Service Worker + Sync Queue** | Background Sync API + P2P mesh for remote villages |

---

## 🔮 Future Roadmap & Production Scaling
- **Ayushman Bharat Digital Mission (ABDM) Integration:** Linking patient cognitive records with ABHA health IDs.
- **Computer Vision & Eye-Tracking:** WebCam-based gaze tracking to measure micro-hesitations during cognitive games.
- **Bhashini AI Integration:** Government of India's National Language Translation Mission for automatic voice localization across 22+ official Indian languages.
- **Caregiver Tele-Consultation:** Integrated WebRTC video consultations with certified geriatric specialists.

---

### © 2026 SmritiCare • Smart India Hackathon Prototype (SIH26003)
*Designed with empathy for inclusive digital healthcare in North Eastern India.*
