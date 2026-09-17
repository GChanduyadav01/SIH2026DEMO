/**
 * SmritiAI - Patient Dashboard JavaScript
 * Elderly-first UX, Hydration, Routine timeline, Voice Assistant,
 * Mood Check-in & Culturally Familiar Memories.
 */

document.addEventListener('DOMContentLoaded', () => {
  initGreetingAndDate();
  initHydrationWidget();
  initRoutineTimeline();
  initMoodTracker();
  initVoiceAssistant();
  initSocialAndMemoryModals();
});

// ==========================================
// 1. Dynamic Greeting & Date
// ==========================================
function initGreetingAndDate() {
  const greetingEl = document.getElementById('patient-greeting-text');
  const dateEl = document.getElementById('patient-date-text');
  
  const now = new Date();
  const hours = now.getHours();
  let timeGreeting = "Good Morning";
  if (hours >= 12 && hours < 17) timeGreeting = "Good Afternoon";
  else if (hours >= 17) timeGreeting = "Good Evening";

  if (greetingEl) {
    greetingEl.innerHTML = `${timeGreeting}, Mrs. Das 👋`;
  }

  if (dateEl) {
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    dateEl.textContent = now.toLocaleDateString('en-IN', options);
  }
}

// ==========================================
// 2. Hydration Counter
// ==========================================
function initHydrationWidget() {
  const maxGlasses = 6;
  let currentGlasses = parseInt(localStorage.getItem(SMRITI_STORAGE_KEYS.HYDRATION) || '4', 10);
  const container = document.getElementById('hydration-glasses-container');
  const progressText = document.getElementById('hydration-progress-text');
  const addBtn = document.getElementById('btn-add-water');

  function renderGlasses() {
    if (!container) return;
    container.innerHTML = '';
    for (let i = 1; i <= maxGlasses; i++) {
      const glass = document.createElement('span');
      glass.className = `glass-item ${i <= currentGlasses ? 'filled' : ''}`;
      glass.textContent = '🥛';
      glass.title = `Glass ${i}`;
      glass.addEventListener('click', () => {
        currentGlasses = i;
        saveAndRender();
      });
      container.appendChild(glass);
    }
    if (progressText) {
      progressText.textContent = `${currentGlasses} / ${maxGlasses} glasses`;
    }
  }

  function saveAndRender() {
    localStorage.setItem(SMRITI_STORAGE_KEYS.HYDRATION, currentGlasses.toString());
    renderGlasses();
  }

  if (addBtn) {
    addBtn.addEventListener('click', () => {
      if (currentGlasses < maxGlasses) {
        currentGlasses++;
        saveAndRender();
        speakText("Great job! One more glass of water logged. Stay hydrated.");
      } else {
        speakText("Wonderful! You have reached your hydration goal for today.");
      }
    });
  }

  renderGlasses();
}

// ==========================================
// 3. Daily Routine Timeline
// ==========================================
function initRoutineTimeline() {
  const routineItems = document.querySelectorAll('.routine-item');
  routineItems.forEach(item => {
    const checkBtn = item.querySelector('.routine-check-btn');
    if (checkBtn) {
      checkBtn.addEventListener('click', () => {
        item.classList.toggle('done');
        const isDone = item.classList.contains('done');
        checkBtn.textContent = isDone ? '✓ Completed' : 'Mark Done';
        checkBtn.className = `btn btn-sm ${isDone ? 'btn-primary' : 'btn-outline'} routine-check-btn`;
        
        if (isDone) {
          const taskName = item.querySelector('.routine-title').textContent;
          speakText(`Activity marked complete: ${taskName}`);
        }
      });
    }
  });
}

// ==========================================
// 4. Emotional Wellbeing & Mood Tracker
// ==========================================
function initMoodTracker() {
  const moodBtns = document.querySelectorAll('.mood-btn');
  const moodFeedback = document.getElementById('mood-feedback-msg');
  const savedMood = localStorage.getItem(SMRITI_STORAGE_KEYS.TODAY_MOOD);

  if (savedMood) {
    moodBtns.forEach(btn => {
      if (btn.getAttribute('data-mood') === savedMood) {
        btn.classList.add('active');
      }
    });
  }

  moodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      moodBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const selectedMood = btn.getAttribute('data-mood');
      localStorage.setItem(SMRITI_STORAGE_KEYS.TODAY_MOOD, selectedMood);

      // Also update patient list for caregiver
      try {
        const patients = JSON.parse(localStorage.getItem(SMRITI_STORAGE_KEYS.PATIENTS_LIST) || '[]');
        if (patients.length > 0) {
          patients[0].todayMood = selectedMood;
          localStorage.setItem(SMRITI_STORAGE_KEYS.PATIENTS_LIST, JSON.stringify(patients));
        }
      } catch (e) {
        console.error(e);
      }

      if (moodFeedback) {
        moodFeedback.style.display = 'block';
        moodFeedback.textContent = "Thank you for sharing. You're doing very well today! 🌟";
      }

      speakText("Thank you for sharing your feelings. Have a gentle and peaceful day.");
    });
  });
}

// ==========================================
// 5. Voice Assistant (Web Speech API + Fallback)
// ==========================================
function initVoiceAssistant() {
  const micBtn = document.getElementById('voice-mic-trigger');
  const responseBox = document.getElementById('voice-response-text');
  const promptChips = document.querySelectorAll('.prompt-chip');

  let recognition = null;
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-IN';
    recognition.interimResults = false;

    recognition.onstart = () => {
      if (micBtn) micBtn.classList.add('listening');
      if (responseBox) responseBox.textContent = "Listening... Speak now.";
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      handleVoiceCommand(transcript);
    };

    recognition.onerror = () => {
      if (micBtn) micBtn.classList.remove('listening');
      if (responseBox) responseBox.textContent = "Could not hear clearly. Tap a quick command below!";
    };

    recognition.onend = () => {
      if (micBtn) micBtn.classList.remove('listening');
    };
  }

  if (micBtn) {
    micBtn.addEventListener('click', () => {
      if (recognition) {
        try {
          recognition.start();
        } catch (e) {
          recognition.stop();
        }
      } else {
        // Fallback for browsers without speech recognition
        if (responseBox) responseBox.textContent = "Microphone listening simulated. Select a voice prompt below:";
        speakText("Hello Mrs. Das, how can I assist you with your memory or routine today?");
      }
    });
  }

  // Handle clickable quick chips
  promptChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const command = chip.getAttribute('data-command') || chip.textContent;
      handleVoiceCommand(command);
    });
  });

  function handleVoiceCommand(command) {
    const lower = command.toLowerCase();
    let reply = "";

    if (lower.includes('game') || lower.includes('brain') || lower.includes('play')) {
      reply = "Starting your brain activity. Opening Memory Match game.";
      speakText(reply);
      if (responseBox) responseBox.textContent = `🤖 Assistant: "${reply}"`;
      setTimeout(() => {
        window.location.href = 'memory-game.html';
      }, 1500);
    } else if (lower.includes('medicine') || lower.includes('pill') || lower.includes('dose')) {
      reply = "Your next medicine is Blood Pressure Medicine (Amlodipine) at 2:00 PM.";
      speakText(reply);
      if (responseBox) responseBox.textContent = `🤖 Assistant: "${reply}"`;
    } else if (lower.includes('water') || lower.includes('drink') || lower.includes('hydration')) {
      reply = "You have had 4 glasses of water today. Logging another glass now!";
      const btnWater = document.getElementById('btn-add-water');
      if (btnWater) btnWater.click();
      speakText(reply);
      if (responseBox) responseBox.textContent = `🤖 Assistant: "${reply}"`;
    } else if (lower.includes('routine') || lower.includes('schedule') || lower.includes('today')) {
      reply = "Today's schedule: Breakfast at 8 AM, Brain Game at 11:30 AM, Lunch at 1 PM, and Evening Walk at 5 PM.";
      speakText(reply);
      if (responseBox) responseBox.textContent = `🤖 Assistant: "${reply}"`;
    } else {
      reply = `I heard: "${command}". I am here to help with your reminders, games, and routine!`;
      speakText(reply);
      if (responseBox) responseBox.textContent = `🤖 Assistant: "${reply}"`;
    }
  }
}

// ==========================================
// 6. Social Engagement & Family Memories Modals
// ==========================================
function initSocialAndMemoryModals() {
  const modalBackdrop = document.getElementById('generic-modal-backdrop');
  const modalContent = document.getElementById('generic-modal-content');
  const modalClose = document.getElementById('generic-modal-close');

  function openModal(html) {
    if (!modalBackdrop || !modalContent) return;
    modalContent.innerHTML = html;
    modalBackdrop.classList.add('open');
  }

  function closeModal() {
    if (modalBackdrop) modalBackdrop.classList.remove('open');
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  // Social Quick Buttons
  const btnCall = document.getElementById('btn-social-call');
  const btnMusic = document.getElementById('btn-social-music');
  const btnMemories = document.getElementById('btn-social-memories');

  if (btnCall) {
    btnCall.addEventListener('click', () => {
      openModal(`
        <div style="text-align:center; padding: 1rem 0;">
          <div style="font-size:3.5rem; margin-bottom:1rem;">📞</div>
          <h2>Calling Family</h2>
          <p style="font-size:1.2rem; font-weight:600; color:var(--primary);">Priya Das (Daughter)</p>
          <p class="text-muted">Guwahati, Assam • +91 98765 43210</p>
          <div style="display:flex; justify-content:center; gap:1rem; margin-top:2rem;">
            <button class="btn btn-accent btn-lg" onclick="document.getElementById('generic-modal-backdrop').classList.remove('open')">End Call</button>
            <button class="btn btn-primary btn-lg" onclick="alert('Connected with Priya! Enjoy your conversation.')">Answer</button>
          </div>
        </div>
      `);
      speakText("Calling your daughter Priya Das now.");
    });
  }

  if (btnMusic) {
    btnMusic.addEventListener('click', () => {
      openModal(`
        <div style="text-align:center; padding: 1rem 0;">
          <div style="font-size:3.5rem; margin-bottom:1rem;">🎵</div>
          <h2>Regional Music & Melodies</h2>
          <p>Calming traditional melodies from the North East to soothe memory.</p>
          <div style="background:var(--bg-subtle); padding:1rem; border-radius:12px; margin:1.5rem 0; text-align:left;">
            <div style="font-weight:700; color:var(--primary);">▶ Playing: Bihu Folk Flute & Rabindra Sangeet</div>
            <div style="font-size:0.85rem; color:var(--text-muted); margin-top:0.3rem;">Relaxing tempo • 432Hz calming acoustics</div>
          </div>
          <button class="btn btn-primary btn-lg" onclick="document.getElementById('generic-modal-backdrop').classList.remove('open')">Close Player</button>
        </div>
      `);
      speakText("Playing soothing regional melodies for you.");
    });
  }

  if (btnMemories) {
    btnMemories.addEventListener('click', () => {
      openModal(`
        <div>
          <h2 style="margin-bottom:1rem;">🌸 My Cherished Memories</h2>
          <div style="display:grid; gap:1rem;">
            <div class="card" style="border-left:5px solid var(--primary);">
              <div style="font-size:1.5rem; margin-bottom:0.3rem;">🎉 Rongali Bihu 2025</div>
              <p style="margin:0; font-size:0.95rem;">Making fresh Pitha sweets with family in Tezpur under the morning sun.</p>
            </div>
            <div class="card" style="border-left:5px solid var(--secondary);">
              <div style="font-size:1.5rem; margin-bottom:0.3rem;">🍵 Kaziranga Tea Estate Stroll</div>
              <p style="margin:0; font-size:0.95rem;">Walking through the fragrant tea gardens with Rajesh and watching the birds.</p>
            </div>
            <div class="card" style="border-left:5px solid var(--accent);">
              <div style="font-size:1.5rem; margin-bottom:0.3rem;">🌺 Spring Orchids of Shillong</div>
              <p style="margin:0; font-size:0.95rem;">Family picnic by Umiam lake with homemade fish curry and steamed rice.</p>
            </div>
          </div>
          <button class="btn btn-outline btn-lg" style="width:100%; margin-top:1.5rem;" onclick="document.getElementById('generic-modal-backdrop').classList.remove('open')">Back to Home</button>
        </div>
      `);
      speakText("Viewing your family memories and festival photo albums.");
    });
  }
}
