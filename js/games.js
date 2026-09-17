/**
 * SmritiAI - Cognitive Games Catalog & AI Adaptive Engine
 * Fully Interactive Games: Pattern Recognition, Object Recognition,
 * Daily Routine Recall, and Attention Challenge.
 *
 * NOTE: Memory Match game is in memory-game.html / js/memory-game.js and is untouched.
 */

document.addEventListener('DOMContentLoaded', () => {
  renderAiAdaptiveRecommendation();
  initMiniGameLaunchers();
});

// ==========================================
// 1. AI Adaptive Difficulty Recommendation
// ==========================================
function calculateAdaptiveLevel() {
  const historyStr = localStorage.getItem(SMRITI_STORAGE_KEYS.GAME_HISTORY);
  let history = [];
  try {
    history = historyStr ? JSON.parse(historyStr) : [];
  } catch (e) {
    history = [];
  }

  if (history.length === 0) {
    return {
      level: 'Easy',
      avgScore: 75,
      accuracy: '80%',
      responseTime: 'Normal',
      trend: 'Starting Journey',
      rationale: 'Initial calibration session recommended for Mrs. Das.'
    };
  }

  const scores = history.map(h => h.score || 70);
  const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const latestAccuracy = history[0].accuracy ? `${history[0].accuracy}%` : '84%';
  const latestTime = history[0].timeSec || 45;

  let level = 'Medium';
  let rationale = '';

  if (avg > 80) {
    level = 'Hard';
    rationale = `High consistency (${avg}% avg score). SmritiAI AI dynamically stepped up cognitive stimulation.`;
  } else if (avg >= 55) {
    level = 'Medium';
    rationale = `Steady cognitive baseline (${avg}% avg score). Balanced stimulation recommended to maintain engagement.`;
  } else {
    level = 'Easy';
    rationale = `Gentle pacing recommended (${avg}% avg score) to prevent cognitive fatigue.`;
  }

  return {
    level,
    avgScore: avg,
    accuracy: latestAccuracy,
    responseTime: latestTime < 45 ? 'Fast & Alert' : 'Good Pace',
    trend: avg >= 75 ? 'Improving 📈' : 'Stable 📊',
    rationale
  };
}

function renderAiAdaptiveRecommendation() {
  const container = document.getElementById('ai-adaptive-container');
  if (!container) return;

  const data = calculateAdaptiveLevel();

  container.innerHTML = `
    <div class="ai-adaptive-box">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:1rem;">
        <div>
          <span class="ai-badge">🤖 SmritiAI AI Engine</span>
          <h3 style="margin-bottom:0.5rem;">AI-Assisted Adaptive Difficulty</h3>
          <p style="margin-bottom:0.75rem; font-size:0.95rem;">${data.rationale}</p>
        </div>
        <div style="text-align:right;">
          <div style="font-size:0.85rem; font-weight:700; color:var(--text-muted);">RECOMMENDED LEVEL</div>
          <div style="font-size:1.6rem; font-weight:800; color:var(--primary);">⭐ ${data.level}</div>
        </div>
      </div>
      <div style="display:flex; gap:1.5rem; flex-wrap:wrap; margin-top:1rem; padding-top:1rem; border-top:1px dashed #86efac; font-size:0.92rem;">
        <div><strong>Accuracy:</strong> ${data.accuracy}</div>
        <div><strong>Response Time:</strong> ${data.responseTime}</div>
        <div><strong>Cognitive Trend:</strong> ${data.trend}</div>
        <div><strong>Average Score:</strong> ${data.avgScore}%</div>
      </div>
    </div>
  `;
}

// ==========================================
// 2. Global Modal & Result Helpers
// ==========================================
let activeGameTimer = null;

function openGameModal(html) {
  const modalBackdrop = document.getElementById('game-modal-backdrop');
  const modalContent = document.getElementById('game-modal-content');
  if (!modalBackdrop || !modalContent) return;

  clearInterval(activeGameTimer);
  modalContent.innerHTML = html;
  modalBackdrop.classList.add('open');
}

function closeGameModal() {
  const modalBackdrop = document.getElementById('game-modal-backdrop');
  if (modalBackdrop) modalBackdrop.classList.remove('open');
  clearInterval(activeGameTimer);
  renderAiAdaptiveRecommendation();
}

function saveGameResult(gameName, score, correctCount, totalQuestions, elapsedSec = 30) {
  const accuracy = Math.round((correctCount / totalQuestions) * 100);
  try {
    const historyStr = localStorage.getItem(SMRITI_STORAGE_KEYS.GAME_HISTORY);
    const history = historyStr ? JSON.parse(historyStr) : [];
    history.unshift({
      date: 'Today',
      game: gameName,
      score: score,
      timeSec: elapsedSec,
      moves: totalQuestions,
      accuracy: accuracy,
      difficulty: score >= 80 ? 'Hard' : (score >= 50 ? 'Medium' : 'Easy')
    });
    localStorage.setItem(SMRITI_STORAGE_KEYS.GAME_HISTORY, JSON.stringify(history));

    const currentSync = parseInt(localStorage.getItem(SMRITI_STORAGE_KEYS.PENDING_SYNC) || '0', 10);
    localStorage.setItem(SMRITI_STORAGE_KEYS.PENDING_SYNC, (currentSync + 1).toString());
  } catch (e) {
    console.error(e);
  }
}

function renderResultsScreen(gameName, correctCount, totalQuestions, onPlayAgain) {
  clearInterval(activeGameTimer);
  const accuracy = Math.round((correctCount / totalQuestions) * 100);
  const score = accuracy;

  saveGameResult(gameName, score, correctCount, totalQuestions);

  let recLevel = 'Medium';
  let recNote = 'Steady focus! Maintaining medium difficulty supports cognitive recall.';
  if (score >= 80) {
    recLevel = 'Hard';
    recNote = 'Excellent cognitive stamina! SmritiAI AI recommends stepping up to Hard level.';
  } else if (score < 50) {
    recLevel = 'Easy';
    recNote = 'Good practice session! SmritiAI AI suggests a gentle pace to build confidence.';
  }

  speakText(`Well done Mrs. Das! You answered ${correctCount} out of ${totalQuestions} correctly. Your score is ${score} percent.`);

  const html = `
    <div style="text-align:center; padding:1rem 0;">
      <div style="font-size:4rem; margin-bottom:0.5rem; animation:modal-pop 0.3s ease;">🎉</div>
      <h2 style="color:var(--primary); margin-bottom:0.3rem;">Activity Complete!</h2>
      <p class="text-muted" style="margin-bottom:1.5rem; font-size:1.05rem;">
        Great mental workout in <strong>${gameName}</strong>!
      </p>

      <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:1rem; margin-bottom:1.5rem;">
        <div style="background:var(--primary-subtle); padding:1rem; border-radius:14px;">
          <div style="font-size:0.85rem; color:var(--primary-dark); font-weight:700;">YOUR SCORE</div>
          <div style="font-size:2.2rem; font-weight:800; color:var(--primary);">${score}%</div>
        </div>

        <div style="background:var(--info-light); padding:1rem; border-radius:14px;">
          <div style="font-size:0.85rem; color:var(--info); font-weight:700;">CORRECT ANSWERS</div>
          <div style="font-size:2.2rem; font-weight:800; color:var(--info);">${correctCount} / ${totalQuestions}</div>
        </div>
      </div>

      <div style="background:linear-gradient(135deg, #f0fdf4 0%, #e6f7f6 100%); border:2px solid #86efac; border-radius:14px; padding:1rem; margin-bottom:1.5rem; text-align:left;">
        <div style="font-size:0.82rem; font-weight:800; color:var(--primary);">🤖 SmritiAI AI ADAPTIVE INSIGHT:</div>
        <div style="font-size:0.95rem; color:var(--text-primary); margin-top:0.3rem;">
          Recommended Level: <strong>⭐ ${recLevel}</strong> • ${recNote}
        </div>
        <div style="font-size:0.75rem; color:var(--text-muted); margin-top:0.25rem;">(AI-assisted adaptive difficulty)</div>
      </div>

      <div style="display:flex; gap:1rem;">
        <button id="btn-result-play-again" class="btn btn-primary btn-lg" style="flex:1;">
          🔄 Play Again
        </button>
        <button id="btn-result-back" class="btn btn-outline btn-lg" style="flex:1;">
          ← Back to Activities
        </button>
      </div>
    </div>
  `;

  const modalContent = document.getElementById('game-modal-content');
  if (modalContent) modalContent.innerHTML = html;

  const btnAgain = document.getElementById('btn-result-play-again');
  const btnBack = document.getElementById('btn-result-back');

  if (btnAgain) btnAgain.addEventListener('click', onPlayAgain);
  if (btnBack) btnBack.addEventListener('click', closeGameModal);
}

// ==========================================
// 3. GAME 1: Pattern Recognition Engine
// ==========================================
const PATTERN_QUESTIONS = [
  {
    sequence: ['🌸', '🍵', '🌸'],
    question: 'Which traditional North Eastern symbol comes next in this sequence?',
    choices: ['🌸 Flower', '🍵 Assam Tea', '🥭 Mango'],
    correctIndex: 1
  },
  {
    sequence: ['🥭', '🍚', '🥭'],
    question: 'Which local staple food completes this pattern?',
    choices: ['🍚 Joha Rice', '🥭 Mango', '🦏 Rhino'],
    correctIndex: 0
  },
  {
    sequence: ['🏠', '🌿', '🏠'],
    question: 'What comes next in the garden path pattern?',
    choices: ['☀️ Morning Sun', '🏠 Traditional Home', '🌿 Tea Leaves'],
    correctIndex: 2
  },
  {
    sequence: ['🍵', '🌸', '🍵'],
    question: 'Which floral bloom comes next in sequence?',
    choices: ['🌸 Lotus Flower', '🍚 Joha Rice', '🍵 Assam Tea'],
    correctIndex: 0
  },
  {
    sequence: ['🌿', '🏠', '🌿'],
    question: 'Which traditional shelter completes the sequence?',
    choices: ['🏠 Bamboo Home', '🦏 One-Horned Rhino', '🥭 Mango'],
    correctIndex: 0
  }
];

function startPatternGame() {
  let currentIndex = 0;
  let correctCount = 0;
  let timerSeconds = 30;

  function renderQuestion() {
    clearInterval(activeGameTimer);
    timerSeconds = 30;
    const q = PATTERN_QUESTIONS[currentIndex];

    const html = `
      <div>
        <!-- Quiz Header -->
        <div class="game-quiz-header">
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <span style="font-size:1.5rem;">🧩</span>
            <strong style="font-size:1.15rem;">Pattern Recognition</strong>
          </div>
          <div style="display:flex; align-items:center; gap:0.75rem;">
            <span class="game-progress-badge">Question ${currentIndex + 1} of ${PATTERN_QUESTIONS.length}</span>
            <span id="game-quiz-timer" class="game-timer-pill">⏱️ ${timerSeconds}s</span>
          </div>
        </div>

        <p style="font-size:1.05rem; font-weight:600; text-align:center; margin-bottom:1rem;">
          ${q.question}
        </p>

        <!-- Sequence Display -->
        <div style="display:flex; justify-content:center; align-items:center; gap:0.75rem; font-size:2.4rem; margin:1.5rem 0; background:var(--bg-subtle); padding:1.2rem; border-radius:16px; flex-wrap:wrap;">
          <span>${q.sequence[0]}</span> <span>➔</span>
          <span>${q.sequence[1]}</span> <span>➔</span>
          <span>${q.sequence[2]}</span> <span>➔</span>
          <span style="border:2px dashed var(--primary); padding:2px 14px; border-radius:12px; background:#fff;">❓</span>
        </div>

        <!-- Feedback Banner -->
        <div id="game-feedback" class="game-feedback-banner"></div>

        <!-- Choice Buttons (All neutral and unselected initially) -->
        <div id="game-choices-container" style="display:flex; flex-direction:column; gap:0.8rem; margin-top:1.2rem;">
          ${q.choices.map((choice, idx) => `
            <button class="game-choice-btn" data-index="${idx}">
              ${choice}
            </button>
          `).join('')}
        </div>

        <!-- Action Button -->
        <div id="game-action-row" style="margin-top:1.5rem; text-align:center; display:none;">
          <button id="btn-next-question" class="btn btn-primary btn-lg" style="width:100%;">
            Next Question ➔
          </button>
        </div>
      </div>
    `;

    openGameModal(html);
    speakText(`Question ${currentIndex + 1}. Look at the pattern and choose what comes next.`);

    // Countdown Timer
    const timerEl = document.getElementById('game-quiz-timer');
    activeGameTimer = setInterval(() => {
      timerSeconds--;
      if (timerEl) timerEl.textContent = `⏱️ ${timerSeconds}s`;
      if (timerSeconds <= 0) {
        clearInterval(activeGameTimer);
        handleTimeUp(q.correctIndex, q.choices[q.correctIndex]);
      }
    }, 1000);

    // Bind Choice Clicks
    const choiceBtns = document.querySelectorAll('.game-choice-btn');
    choiceBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const selectedIdx = parseInt(btn.getAttribute('data-index'), 10);
        handleChoice(selectedIdx, q.correctIndex, choiceBtns, q.choices[q.correctIndex]);
      });
    });
  }

  function handleChoice(selectedIdx, correctIdx, choiceBtns, correctText) {
    clearInterval(activeGameTimer);
    choiceBtns.forEach(b => b.disabled = true);

    const feedbackEl = document.getElementById('game-feedback');
    const actionRow = document.getElementById('game-action-row');

    if (selectedIdx === correctIdx) {
      correctCount++;
      choiceBtns[selectedIdx].classList.add('correct-choice');
      if (feedbackEl) {
        feedbackEl.className = 'game-feedback-banner success';
        feedbackEl.innerHTML = '✓ Correct! Excellent pattern observation. 🎉';
      }
      speakText('Correct! Wonderful pattern recognition.');
    } else {
      choiceBtns[selectedIdx].classList.add('incorrect-choice');
      choiceBtns[correctIdx].classList.add('correct-choice');
      if (feedbackEl) {
        feedbackEl.className = 'game-feedback-banner error';
        feedbackEl.innerHTML = `✕ Not quite. The correct answer was <strong>${correctText}</strong>.`;
      }
      speakText(`Not quite. The correct answer was ${correctText}.`);
    }

    if (actionRow) {
      actionRow.style.display = 'block';
      const btnNext = document.getElementById('btn-next-question');
      if (btnNext) {
        btnNext.addEventListener('click', () => {
          currentIndex++;
          if (currentIndex < PATTERN_QUESTIONS.length) {
            renderQuestion();
          } else {
            renderResultsScreen('Pattern Recognition', correctCount, PATTERN_QUESTIONS.length, startPatternGame);
          }
        });
      }
    }
  }

  function handleTimeUp(correctIdx, correctText) {
    const choiceBtns = document.querySelectorAll('.game-choice-btn');
    choiceBtns.forEach(b => b.disabled = true);
    if (choiceBtns[correctIdx]) choiceBtns[correctIdx].classList.add('correct-choice');

    const feedbackEl = document.getElementById('game-feedback');
    const actionRow = document.getElementById('game-action-row');

    if (feedbackEl) {
      feedbackEl.className = 'game-feedback-banner error';
      feedbackEl.innerHTML = `⏱️ Time's up! The correct answer was <strong>${correctText}</strong>.`;
    }
    speakText("Time is up. Let's move to the next question.");

    if (actionRow) {
      actionRow.style.display = 'block';
      const btnNext = document.getElementById('btn-next-question');
      if (btnNext) {
        btnNext.addEventListener('click', () => {
          currentIndex++;
          if (currentIndex < PATTERN_QUESTIONS.length) {
            renderQuestion();
          } else {
            renderResultsScreen('Pattern Recognition', correctCount, PATTERN_QUESTIONS.length, startPatternGame);
          }
        });
      }
    }
  }

  renderQuestion();
}

// ==========================================
// 4. GAME 2: Object Recognition Engine
// ==========================================
const OBJECT_QUESTIONS = [
  {
    icon: '🦏',
    question: 'What is this iconic animal famous in Kaziranga National Park, Assam?',
    choices: ['One-Horned Rhino', 'Bengal Tiger', 'Asian Elephant', 'Wild Buffalo'],
    correctIndex: 0
  },
  {
    icon: '🍵',
    question: 'What is this world-famous fragrant beverage harvested across Assam?',
    choices: ['Assam Fresh Tea', 'Coffee Beans', 'Coconut Water', 'Herbal Milk'],
    correctIndex: 0
  },
  {
    icon: '🪔',
    question: 'What is this traditional sacred lamp lit during festivals and prayers?',
    choices: ['Ceramic Pot', 'Festival Diya / Lamp', 'Flower Vase', 'Teacup'],
    correctIndex: 1
  },
  {
    icon: '🥭',
    question: 'What is this sweet, juicy tropical summer fruit?',
    choices: ['Crisp Apple', 'Fresh Orange', 'Sweet Mango', 'Ripe Guava'],
    correctIndex: 2
  },
  {
    icon: '🥁',
    question: 'What traditional wooden drum is beaten with joy during Bihu folk celebrations?',
    choices: ['Bamboo Flute', 'Harmonium', 'Singing Bowl', 'Bihu Dhol'],
    correctIndex: 3
  },
  {
    icon: '🏠',
    question: 'What is this traditional North Eastern home built on raised bamboo stilts?',
    choices: ['Bamboo Chang Ghar', 'Stone Castle', 'Canvas Tent', 'Brick High-Rise'],
    correctIndex: 0
  }
];

function startObjectGame() {
  let currentIndex = 0;
  let correctCount = 0;
  let timerSeconds = 30;

  function renderQuestion() {
    clearInterval(activeGameTimer);
    timerSeconds = 30;
    const q = OBJECT_QUESTIONS[currentIndex];

    const html = `
      <div>
        <!-- Quiz Header -->
        <div class="game-quiz-header">
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <span style="font-size:1.5rem;">🦏</span>
            <strong style="font-size:1.15rem;">Object Recognition</strong>
          </div>
          <div style="display:flex; align-items:center; gap:0.75rem;">
            <span class="game-progress-badge">Question ${currentIndex + 1} of ${OBJECT_QUESTIONS.length}</span>
            <span id="game-quiz-timer" class="game-timer-pill">⏱️ ${timerSeconds}s</span>
          </div>
        </div>

        <div style="text-align:center; font-size:4.5rem; margin:1rem 0 0.5rem; line-height:1;">
          ${q.icon}
        </div>

        <p style="font-size:1.1rem; font-weight:600; text-align:center; margin-bottom:1.2rem;">
          ${q.question}
        </p>

        <!-- Feedback Banner -->
        <div id="game-feedback" class="game-feedback-banner"></div>

        <!-- Choice Buttons (Grid 2x2, all neutral initially) -->
        <div id="game-choices-container" style="display:grid; grid-template-columns:1fr 1fr; gap:0.8rem;">
          ${q.choices.map((choice, idx) => `
            <button class="game-choice-btn" data-index="${idx}">
              ${choice}
            </button>
          `).join('')}
        </div>

        <!-- Action Button -->
        <div id="game-action-row" style="margin-top:1.5rem; text-align:center; display:none;">
          <button id="btn-next-question" class="btn btn-primary btn-lg" style="width:100%;">
            Next Question ➔
          </button>
        </div>
      </div>
    `;

    openGameModal(html);
    speakText(`Look at the object shown on the screen. What is this?`);

    const timerEl = document.getElementById('game-quiz-timer');
    activeGameTimer = setInterval(() => {
      timerSeconds--;
      if (timerEl) timerEl.textContent = `⏱️ ${timerSeconds}s`;
      if (timerSeconds <= 0) {
        clearInterval(activeGameTimer);
        handleTimeUp(q.correctIndex, q.choices[q.correctIndex]);
      }
    }, 1000);

    const choiceBtns = document.querySelectorAll('.game-choice-btn');
    choiceBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const selectedIdx = parseInt(btn.getAttribute('data-index'), 10);
        handleChoice(selectedIdx, q.correctIndex, choiceBtns, q.choices[q.correctIndex]);
      });
    });
  }

  function handleChoice(selectedIdx, correctIdx, choiceBtns, correctText) {
    clearInterval(activeGameTimer);
    choiceBtns.forEach(b => b.disabled = true);

    const feedbackEl = document.getElementById('game-feedback');
    const actionRow = document.getElementById('game-action-row');

    if (selectedIdx === correctIdx) {
      correctCount++;
      choiceBtns[selectedIdx].classList.add('correct-choice');
      if (feedbackEl) {
        feedbackEl.className = 'game-feedback-banner success';
        feedbackEl.innerHTML = '✓ Correct! Well recognized. 🎉';
      }
      speakText(`Correct! That is ${correctText}.`);
    } else {
      choiceBtns[selectedIdx].classList.add('incorrect-choice');
      choiceBtns[correctIdx].classList.add('correct-choice');
      if (feedbackEl) {
        feedbackEl.className = 'game-feedback-banner error';
        feedbackEl.innerHTML = `✕ Not quite. The correct answer was <strong>${correctText}</strong>.`;
      }
      speakText(`That was ${correctText}.`);
    }

    if (actionRow) {
      actionRow.style.display = 'block';
      const btnNext = document.getElementById('btn-next-question');
      if (btnNext) {
        btnNext.addEventListener('click', () => {
          currentIndex++;
          if (currentIndex < OBJECT_QUESTIONS.length) {
            renderQuestion();
          } else {
            renderResultsScreen('Object Recognition', correctCount, OBJECT_QUESTIONS.length, startObjectGame);
          }
        });
      }
    }
  }

  function handleTimeUp(correctIdx, correctText) {
    const choiceBtns = document.querySelectorAll('.game-choice-btn');
    choiceBtns.forEach(b => b.disabled = true);
    if (choiceBtns[correctIdx]) choiceBtns[correctIdx].classList.add('correct-choice');

    const feedbackEl = document.getElementById('game-feedback');
    const actionRow = document.getElementById('game-action-row');

    if (feedbackEl) {
      feedbackEl.className = 'game-feedback-banner error';
      feedbackEl.innerHTML = `⏱️ Time's up! The correct answer was <strong>${correctText}</strong>.`;
    }

    if (actionRow) {
      actionRow.style.display = 'block';
      const btnNext = document.getElementById('btn-next-question');
      if (btnNext) {
        btnNext.addEventListener('click', () => {
          currentIndex++;
          if (currentIndex < OBJECT_QUESTIONS.length) {
            renderQuestion();
          } else {
            renderResultsScreen('Object Recognition', correctCount, OBJECT_QUESTIONS.length, startObjectGame);
          }
        });
      }
    }
  }

  renderQuestion();
}

// ==========================================
// 5. GAME 3: Daily Routine Recall Engine
// ==========================================
const ROUTINE_QUESTIONS = [
  {
    question: 'What activity is scheduled at 10:00 AM?',
    choices: ['Blood Pressure Medicine', 'Evening Garden Walk', 'Nutritious Lunch'],
    correctIndex: 0
  },
  {
    question: 'What activity happens at 11:30 AM right after morning medicine?',
    choices: ['Brain Activity', 'Healthy Breakfast', 'Night Dinner'],
    correctIndex: 0
  },
  {
    question: 'What refreshing outdoor activity is scheduled at 05:00 PM?',
    choices: ['Evening Garden Walk', 'Blood Pressure Medicine', 'Breakfast'],
    correctIndex: 0
  },
  {
    question: 'What is the very first routine of the day at 08:00 AM?',
    choices: ['Healthy Breakfast & Tea', 'Nutritious Lunch', 'Brain Activity'],
    correctIndex: 0
  },
  {
    question: 'What meal is scheduled for 01:00 PM in the afternoon?',
    choices: ['Nutritious Lunch', 'Morning Medicine', 'Evening Walk'],
    correctIndex: 0
  }
];

function startRoutineGame() {
  let currentIndex = 0;
  let correctCount = 0;
  let memorizationTime = 4;

  // Step 1: Memorization Phase
  function showMemorizePhase() {
    const html = `
      <div style="text-align:center;">
        <div style="font-size:3rem; margin-bottom:0.5rem;">📅</div>
        <h2>Remember Today's Routine</h2>
        <p class="text-muted" style="margin-bottom:1.2rem;">
          Take a look at the schedule below. It will hide in <strong id="memo-countdown" style="color:var(--accent);">4</strong> seconds!
        </p>

        <div style="background:var(--bg-subtle); padding:1.2rem; border-radius:16px; text-align:left; max-width:440px; margin:0 auto 1.5rem; border:2px solid var(--primary-light);">
          <div style="padding:0.4rem 0; font-weight:700; color:var(--primary);">⏰ 08:00 AM — Healthy Breakfast & Tea</div>
          <div style="padding:0.4rem 0; font-weight:700; color:var(--accent);">💊 10:00 AM — Blood Pressure Medicine</div>
          <div style="padding:0.4rem 0; font-weight:700; color:var(--info);">🧠 11:30 AM — Brain Activity</div>
          <div style="padding:0.4rem 0; font-weight:700; color:var(--success);">🍲 01:00 PM — Nutritious Lunch</div>
          <div style="padding:0.4rem 0; font-weight:700; color:var(--primary-dark);">🚶 05:00 PM — Evening Garden Walk</div>
        </div>

        <button id="btn-start-recall-now" class="btn btn-primary btn-lg" style="width:100%; max-width:440px;">
          I'm Ready! Start Questions ➔
        </button>
      </div>
    `;

    openGameModal(html);
    speakText("Remember today's routine: Breakfast at 8, Medicine at 10, Brain game at 11:30, Lunch at 1, and Walk at 5.");

    memorizationTime = 4;
    const countEl = document.getElementById('memo-countdown');
    activeGameTimer = setInterval(() => {
      memorizationTime--;
      if (countEl) countEl.textContent = memorizationTime.toString();
      if (memorizationTime <= 0) {
        clearInterval(activeGameTimer);
        renderRecallQuestion();
      }
    }, 1000);

    const btnReady = document.getElementById('btn-start-recall-now');
    if (btnReady) {
      btnReady.addEventListener('click', () => {
        clearInterval(activeGameTimer);
        renderRecallQuestion();
      });
    }
  }

  // Step 2: Recall Question Phase
  function renderRecallQuestion() {
    clearInterval(activeGameTimer);
    let timerSeconds = 30;
    const q = ROUTINE_QUESTIONS[currentIndex];

    // Shuffle choices so correct answer isn't always top
    const indexedChoices = q.choices.map((c, i) => ({ text: c, isCorrect: i === q.correctIndex }));
    for (let i = indexedChoices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indexedChoices[i], indexedChoices[j]] = [indexedChoices[j], indexedChoices[i]];
    }

    const html = `
      <div>
        <div class="game-quiz-header">
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <span style="font-size:1.5rem;">📅</span>
            <strong style="font-size:1.15rem;">Routine Recall</strong>
          </div>
          <div style="display:flex; align-items:center; gap:0.75rem;">
            <span class="game-progress-badge">Question ${currentIndex + 1} of ${ROUTINE_QUESTIONS.length}</span>
            <span id="game-quiz-timer" class="game-timer-pill">⏱️ ${timerSeconds}s</span>
          </div>
        </div>

        <p style="font-size:1.2rem; font-weight:700; text-align:center; margin:1.2rem 0;">
          ${q.question}
        </p>

        <div id="game-feedback" class="game-feedback-banner"></div>

        <div id="game-choices-container" style="display:flex; flex-direction:column; gap:0.8rem;">
          ${indexedChoices.map((choice, idx) => `
            <button class="game-choice-btn" data-correct="${choice.isCorrect}">
              ${choice.text}
            </button>
          `).join('')}
        </div>

        <div id="game-action-row" style="margin-top:1.5rem; text-align:center; display:none;">
          <button id="btn-next-question" class="btn btn-primary btn-lg" style="width:100%;">
            Next Question ➔
          </button>
        </div>
      </div>
    `;

    openGameModal(html);
    speakText(q.question);

    const timerEl = document.getElementById('game-quiz-timer');
    activeGameTimer = setInterval(() => {
      timerSeconds--;
      if (timerEl) timerEl.textContent = `⏱️ ${timerSeconds}s`;
      if (timerSeconds <= 0) {
        clearInterval(activeGameTimer);
        handleChoice(null);
      }
    }, 1000);

    const choiceBtns = document.querySelectorAll('.game-choice-btn');
    choiceBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        handleChoice(btn);
      });
    });

    function handleChoice(clickedBtn) {
      clearInterval(activeGameTimer);
      choiceBtns.forEach(b => b.disabled = true);

      const feedbackEl = document.getElementById('game-feedback');
      const actionRow = document.getElementById('game-action-row');

      if (clickedBtn && clickedBtn.getAttribute('data-correct') === 'true') {
        correctCount++;
        clickedBtn.classList.add('correct-choice');
        if (feedbackEl) {
          feedbackEl.className = 'game-feedback-banner success';
          feedbackEl.innerHTML = '✓ Correct! Wonderful memory recall. 🎉';
        }
        speakText("Correct! Great memory recall.");
      } else {
        if (clickedBtn) clickedBtn.classList.add('incorrect-choice');
        choiceBtns.forEach(b => {
          if (b.getAttribute('data-correct') === 'true') b.classList.add('correct-choice');
        });
        if (feedbackEl) {
          feedbackEl.className = 'game-feedback-banner error';
          feedbackEl.innerHTML = '✕ Not quite. Look at the highlighted correct activity.';
        }
        speakText("Not quite. Review the highlighted correct routine.");
      }

      if (actionRow) {
        actionRow.style.display = 'block';
        const btnNext = document.getElementById('btn-next-question');
        if (btnNext) {
          btnNext.addEventListener('click', () => {
            currentIndex++;
            if (currentIndex < ROUTINE_QUESTIONS.length) {
              renderRecallQuestion();
            } else {
              renderResultsScreen('Daily Routine Recall', correctCount, ROUTINE_QUESTIONS.length, startRoutineGame);
            }
          });
        }
      }
    }
  }

  showMemorizePhase();
}

// ==========================================
// 6. GAME 4: Attention Challenge Engine
// ==========================================
const ATTENTION_ROUNDS = [
  {
    normalIcon: '🥭',
    oddIcon: '🍎',
    prompt: 'Tap the fruit that is DIFFERENT from the rest:'
  },
  {
    normalIcon: '🌸',
    oddIcon: '🌻',
    prompt: 'Spot the different flower in the garden:'
  },
  {
    normalIcon: '🦏',
    oddIcon: '🐘',
    prompt: 'Find the different animal among the rhinos:'
  },
  {
    normalIcon: '🍵',
    oddIcon: '🥛',
    prompt: 'Tap the drink that is different from tea:'
  },
  {
    normalIcon: '🥁',
    oddIcon: '🪔',
    prompt: 'Find the different festival item:'
  }
];

function startAttentionGame() {
  let currentIndex = 0;
  let correctCount = 0;
  let timerSeconds = 30;

  function renderChallenge() {
    clearInterval(activeGameTimer);
    timerSeconds = 30;
    const r = ATTENTION_ROUNDS[currentIndex];
    const totalCells = 12; // 3x4 grid

    // Randomize odd index
    const oddIndex = Math.floor(Math.random() * totalCells);

    const html = `
      <div>
        <div class="game-quiz-header">
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <span style="font-size:1.5rem;">👁️</span>
            <strong style="font-size:1.15rem;">Attention Challenge</strong>
          </div>
          <div style="display:flex; align-items:center; gap:0.75rem;">
            <span class="game-progress-badge">Round ${currentIndex + 1} of ${ATTENTION_ROUNDS.length}</span>
            <span id="game-quiz-timer" class="game-timer-pill">⏱️ ${timerSeconds}s</span>
          </div>
        </div>

        <p style="font-size:1.1rem; font-weight:600; text-align:center; margin-bottom:0.5rem;">
          ${r.prompt}
        </p>

        <div id="game-feedback" class="game-feedback-banner"></div>

        <!-- 12-cell Grid (3 rows x 4 cols) -->
        <div id="attention-grid-container" class="attention-grid">
          ${Array.from({ length: totalCells }).map((_, idx) => `
            <div class="attention-cell" data-index="${idx}">
              ${idx === oddIndex ? r.oddIcon : r.normalIcon}
            </div>
          `).join('')}
        </div>

        <div id="game-action-row" style="margin-top:1.5rem; text-align:center; display:none;">
          <button id="btn-next-question" class="btn btn-primary btn-lg" style="width:100%;">
            Next Challenge ➔
          </button>
        </div>
      </div>
    `;

    openGameModal(html);
    speakText(r.prompt);

    const timerEl = document.getElementById('game-quiz-timer');
    activeGameTimer = setInterval(() => {
      timerSeconds--;
      if (timerEl) timerEl.textContent = `⏱️ ${timerSeconds}s`;
      if (timerSeconds <= 0) {
        clearInterval(activeGameTimer);
        handleCellClick(-1, oddIndex);
      }
    }, 1000);

    const cells = document.querySelectorAll('.attention-cell');
    cells.forEach(cell => {
      cell.addEventListener('click', () => {
        const clickedIdx = parseInt(cell.getAttribute('data-index'), 10);
        handleCellClick(clickedIdx, oddIndex);
      });
    });

    function handleCellClick(clickedIdx, correctIdx) {
      clearInterval(activeGameTimer);
      cells.forEach(c => c.classList.add('locked'));

      const feedbackEl = document.getElementById('game-feedback');
      const actionRow = document.getElementById('game-action-row');

      if (clickedIdx === correctIdx) {
        correctCount++;
        cells[clickedIdx].classList.add('cell-correct');
        if (feedbackEl) {
          feedbackEl.className = 'game-feedback-banner success';
          feedbackEl.innerHTML = '✓ You found it! Sharp visual attention. 🎉';
        }
        speakText("You found the different item! Excellent attention.");
      } else {
        if (clickedIdx >= 0) cells[clickedIdx].classList.add('cell-wrong');
        cells[correctIdx].classList.add('cell-correct');
        if (feedbackEl) {
          feedbackEl.className = 'game-feedback-banner error';
          feedbackEl.innerHTML = '✕ That was matching. The different item is highlighted in green.';
        }
        speakText("The different item is highlighted in green.");
      }

      if (actionRow) {
        actionRow.style.display = 'block';
        const btnNext = document.getElementById('btn-next-question');
        if (btnNext) {
          btnNext.addEventListener('click', () => {
            currentIndex++;
            if (currentIndex < ATTENTION_ROUNDS.length) {
              renderChallenge();
            } else {
              renderResultsScreen('Attention Challenge', correctCount, ATTENTION_ROUNDS.length, startAttentionGame);
            }
          });
        }
      }
    }
  }

  renderChallenge();
}

// ==========================================
// 7. Mini-Games Event Launcher Binding
// ==========================================
function initMiniGameLaunchers() {
  const modalClose = document.getElementById('game-modal-close');
  const modalBackdrop = document.getElementById('game-modal-backdrop');

  if (modalClose) modalClose.addEventListener('click', closeGameModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeGameModal();
    });
  }

  // 1. Pattern Recognition Trigger
  const btnPattern = document.getElementById('btn-game-pattern');
  if (btnPattern) {
    btnPattern.addEventListener('click', () => {
      startPatternGame();
    });
  }

  // 2. Object Recognition Trigger
  const btnObject = document.getElementById('btn-game-object');
  if (btnObject) {
    btnObject.addEventListener('click', () => {
      startObjectGame();
    });
  }

  // 3. Daily Routine Recall Trigger
  const btnRoutine = document.getElementById('btn-game-routine');
  if (btnRoutine) {
    btnRoutine.addEventListener('click', () => {
      startRoutineGame();
    });
  }

  // 4. Attention Challenge Trigger
  const btnAttention = document.getElementById('btn-game-attention');
  if (btnAttention) {
    btnAttention.addEventListener('click', () => {
      startAttentionGame();
    });
  }
}
