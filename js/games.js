/**
 * SmritiCare - Cognitive Games Catalog & AI Adaptive Engine
 * Calculates recommended difficulty based on performance history.
 */

document.addEventListener('DOMContentLoaded', () => {
  renderAiAdaptiveRecommendation();
  initMiniGameLaunchers();
});

// ==========================================
// 1. AI Adaptive Difficulty Algorithm
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
    rationale = `High consistency (${avg}% avg score). SmritiCare AI dynamically stepped up cognitive stimulation.`;
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
          <span class="ai-badge">🤖 SmritiCare AI Engine</span>
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
// 2. Mini-Games Interactive Dialog Handlers
// ==========================================
function initMiniGameLaunchers() {
  const modalBackdrop = document.getElementById('game-modal-backdrop');
  const modalContent = document.getElementById('game-modal-content');
  const modalClose = document.getElementById('game-modal-close');

  function openModal(html) {
    if (!modalBackdrop || !modalContent) return;
    modalContent.innerHTML = html;
    modalBackdrop.classList.add('open');
  }

  function closeModal() {
    if (modalBackdrop) modalBackdrop.classList.remove('open');
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  // Bind individual game cards
  const btnPattern = document.getElementById('btn-game-pattern');
  const btnObject = document.getElementById('btn-game-object');
  const btnRoutineRecall = document.getElementById('btn-game-routine');
  const btnAttention = document.getElementById('btn-game-attention');

  if (btnPattern) {
    btnPattern.addEventListener('click', () => {
      openModal(`
        <div style="text-align:center;">
          <div style="font-size:3rem; margin-bottom:0.5rem;">🧩</div>
          <h2>Pattern Recognition</h2>
          <p>Which traditional North Eastern symbol comes next in this sequence?</p>
          <div style="display:flex; justify-content:center; align-items:center; gap:1rem; font-size:2.5rem; margin:1.5rem 0; background:var(--bg-subtle); padding:1rem; border-radius:16px;">
            <span>🌸</span> <span>➔</span> <span>🍵</span> <span>➔</span> <span>🌸</span> <span>➔</span> <span style="border:2px dashed var(--primary); padding:4px 14px; border-radius:10px;">❓</span>
          </div>
          <div style="display:flex; justify-content:center; gap:1rem; margin-top:1.5rem;">
            <button class="btn btn-outline btn-lg" onclick="alert('Try again! Look at the sequence pattern.');">🌸 Flower</button>
            <button class="btn btn-primary btn-lg" onclick="handleMiniGameWin('Pattern Recognition', 85);">🍵 Assam Tea</button>
            <button class="btn btn-outline btn-lg" onclick="alert('Not quite. Tea follows flower!');">🥭 Mango</button>
          </div>
        </div>
      `);
      speakText("Find the missing symbol in the pattern: Flower, Tea, Flower, and what comes next?");
    });
  }

  if (btnObject) {
    btnObject.addEventListener('click', () => {
      openModal(`
        <div style="text-align:center;">
          <div style="font-size:4rem; margin-bottom:0.5rem;">🦏</div>
          <h2>Object Recognition</h2>
          <p>What is this iconic animal famous in Kaziranga National Park, Assam?</p>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-top:1.5rem;">
            <button class="btn btn-outline btn-lg" onclick="alert('Hint: It has a distinct single horn!');">Bengal Tiger</button>
            <button class="btn btn-primary btn-lg" onclick="handleMiniGameWin('Object Recognition', 92);">One-Horned Rhino</button>
            <button class="btn btn-outline btn-lg" onclick="alert('Try again! It is a rhino.');">Asian Elephant</button>
            <button class="btn btn-outline btn-lg" onclick="alert('Hint: Kaziranga rhino sanctuary.');">Wild Buffalo</button>
          </div>
        </div>
      `);
      speakText("What animal is shown on the screen?");
    });
  }

  if (btnRoutineRecall) {
    btnRoutineRecall.addEventListener('click', () => {
      openModal(`
        <div style="text-align:center;">
          <div style="font-size:3rem; margin-bottom:0.5rem;">📅</div>
          <h2>Daily Routine Recall</h2>
          <p>What activity do you normally enjoy first in the morning?</p>
          <div style="display:flex; flex-direction:column; gap:0.8rem; margin-top:1.5rem;">
            <button class="btn btn-primary btn-lg" onclick="handleMiniGameWin('Routine Recall', 88);">1. Healthy Morning Breakfast & Tea</button>
            <button class="btn btn-outline btn-lg" onclick="alert('Night dinner is in the evening!');">2. Night Dinner</button>
            <button class="btn btn-outline btn-lg" onclick="alert('Evening walk is at 5 PM.');">3. Sunset Garden Walk</button>
          </div>
        </div>
      `);
      speakText("What activity do you do first in the morning?");
    });
  }

  if (btnAttention) {
    btnAttention.addEventListener('click', () => {
      openModal(`
        <div style="text-align:center;">
          <div style="font-size:3rem; margin-bottom:0.5rem;">👁️</div>
          <h2>Attention Challenge</h2>
          <p>Tap the item that is <strong>DIFFERENT</strong> from the others:</p>
          <div style="display:flex; justify-content:center; gap:1.2rem; font-size:3.2rem; margin:1.5rem 0;">
            <span style="cursor:pointer;" onclick="alert('This is a mango. Find the different fruit!');">🥭</span>
            <span style="cursor:pointer;" onclick="alert('This is a mango.');">🥭</span>
            <span style="cursor:pointer; background:var(--primary-subtle); padding:6px; border-radius:12px;" onclick="handleMiniGameWin('Attention Challenge', 90);">🍎</span>
            <span style="cursor:pointer;" onclick="alert('This is a mango.');">🥭</span>
          </div>
        </div>
      `);
      speakText("Tap the fruit that is different from all the rest.");
    });
  }
}

// Handler for mini-games success
window.handleMiniGameWin = function(gameName, score) {
  const modalBackdrop = document.getElementById('game-modal-backdrop');
  if (modalBackdrop) modalBackdrop.classList.remove('open');

  // Save to game history
  try {
    const historyStr = localStorage.getItem(SMRITI_STORAGE_KEYS.GAME_HISTORY);
    const history = historyStr ? JSON.parse(historyStr) : [];
    history.unshift({
      date: 'Just now',
      game: gameName,
      score: score,
      timeSec: 25,
      moves: 1,
      accuracy: 100,
      difficulty: 'Medium'
    });
    localStorage.setItem(SMRITI_STORAGE_KEYS.GAME_HISTORY, JSON.stringify(history));

    // Increment pending sync
    const currentSync = parseInt(localStorage.getItem(SMRITI_STORAGE_KEYS.PENDING_SYNC) || '0', 10);
    localStorage.setItem(SMRITI_STORAGE_KEYS.PENDING_SYNC, (currentSync + 1).toString());
  } catch (e) {
    console.error(e);
  }

  speakText(`Excellent! You scored ${score} points in ${gameName}. Well done!`);
  alert(`🎉 Excellent Work!\n\nActivity: ${gameName}\nScore: ${score}%\n\nResult recorded to your Caregiver cognitive log.`);
  renderAiAdaptiveRecommendation();
};
