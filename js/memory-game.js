/**
 * SmritiCare - Interactive Memory Match Game (SIH26003)
 * Culturally familiar North Eastern symbols, timer, move counter,
 * dynamic scoring, accuracy calculation, LocalStorage sync & AI difficulty recommendation.
 */

const NER_CULTURAL_ITEMS = [
  { id: 'rhino', icon: '🦏', label: 'One-Horned Rhino' },
  { id: 'tea', icon: '🍵', label: 'Assam Tea' },
  { id: 'dhol', icon: '🥁', label: 'Bihu Dhol' },
  { id: 'mango', icon: '🥭', label: 'Juicy Mango' },
  { id: 'flower', icon: '🌸', label: 'Lotus Flower' },
  { id: 'home', icon: '🏠', label: 'Traditional Home' },
  { id: 'rice', icon: '🍚', label: 'Joha Rice' },
  { id: 'sun', icon: '☀️', label: 'Morning Sun' }
];

class MemoryGame {
  constructor() {
    this.gridElement = document.getElementById('memory-grid');
    this.timerElement = document.getElementById('game-timer');
    this.movesElement = document.getElementById('game-moves');
    this.matchesElement = document.getElementById('game-matches');
    this.difficultySelect = document.getElementById('game-difficulty-select');
    this.restartBtn = document.getElementById('btn-restart-game');

    this.cards = [];
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.totalPairs = 6;
    this.moves = 0;
    this.timer = 0;
    this.timerInterval = null;
    this.isLocked = false;
    this.isGameStarted = false;

    this.init();
  }

  init() {
    if (this.difficultySelect) {
      this.difficultySelect.addEventListener('change', (e) => {
        this.setDifficulty(e.target.value);
      });
    }

    if (this.restartBtn) {
      this.restartBtn.addEventListener('click', () => {
        this.resetGame();
      });
    }

    this.setDifficulty('medium');
  }

  setDifficulty(level) {
    if (level === 'easy') {
      this.totalPairs = 3; // 6 cards (3x2)
    } else if (level === 'hard') {
      this.totalPairs = 8; // 16 cards (4x4)
    } else {
      this.totalPairs = 6; // 12 cards (4x3)
    }
    this.resetGame();
  }

  resetGame() {
    clearInterval(this.timerInterval);
    this.timer = 0;
    this.moves = 0;
    this.matchedPairs = 0;
    this.flippedCards = [];
    this.isLocked = false;
    this.isGameStarted = false;

    this.updateStats();
    this.buildGrid();
  }

  startTimer() {
    this.isGameStarted = true;
    this.timerInterval = setInterval(() => {
      this.timer++;
      this.updateStats();
    }, 1000);
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  updateStats() {
    if (this.timerElement) this.timerElement.textContent = this.formatTime(this.timer);
    if (this.movesElement) this.movesElement.textContent = this.moves.toString();
    if (this.matchesElement) this.matchesElement.textContent = `${this.matchedPairs} / ${this.totalPairs}`;
  }

  buildGrid() {
    if (!this.gridElement) return;
    this.gridElement.innerHTML = '';

    // Pick subset of cultural items
    const selectedItems = NER_CULTURAL_ITEMS.slice(0, this.totalPairs);
    const deck = [...selectedItems, ...selectedItems];

    // Shuffle deck (Fisher-Yates)
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    // Set grid columns dynamically
    if (this.totalPairs === 3) {
      this.gridElement.style.gridTemplateColumns = 'repeat(3, 1fr)';
    } else {
      this.gridElement.style.gridTemplateColumns = 'repeat(4, 1fr)';
    }

    deck.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'memory-card';
      card.setAttribute('data-id', item.id);
      card.setAttribute('data-index', index.toString());
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `Card ${index + 1}`);

      card.innerHTML = `
        <div class="card-face card-back">
          <span>🧠</span>
        </div>
        <div class="card-face card-front">
          <span class="card-icon">${item.icon}</span>
          <span class="card-label">${item.label}</span>
        </div>
      `;

      card.addEventListener('click', () => this.handleCardClick(card, item));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handleCardClick(card, item);
        }
      });

      this.gridElement.appendChild(card);
    });
  }

  handleCardClick(card, item) {
    if (this.isLocked || card.classList.contains('flipped') || card.classList.contains('matched')) {
      return;
    }

    if (!this.isGameStarted) {
      this.startTimer();
    }

    card.classList.add('flipped');
    this.flippedCards.push({ card, item });

    if (this.flippedCards.length === 2) {
      this.moves++;
      this.updateStats();
      this.checkMatch();
    }
  }

  checkMatch() {
    const [first, second] = this.flippedCards;
    this.isLocked = true;

    if (first.item.id === second.item.id) {
      // Match found
      setTimeout(() => {
        first.card.classList.add('matched');
        second.card.classList.add('matched');
        this.matchedPairs++;
        this.updateStats();
        this.flippedCards = [];
        this.isLocked = false;

        speakText(`Matched! ${first.item.label}.`);

        if (this.matchedPairs === this.totalPairs) {
          this.handleGameWin();
        }
      }, 500);
    } else {
      // Mismatch
      setTimeout(() => {
        first.card.classList.remove('flipped');
        second.card.classList.remove('flipped');
        this.flippedCards = [];
        this.isLocked = false;
      }, 1000);
    }
  }

  handleGameWin() {
    clearInterval(this.timerInterval);

    // Calculate accuracy and score
    const accuracy = Math.min(100, Math.round((this.totalPairs / Math.max(this.moves, this.totalPairs)) * 100));
    const timeBonus = Math.max(0, 100 - this.timer);
    const finalScore = Math.max(50, Math.min(100, Math.round(accuracy * 0.7 + (timeBonus * 0.3))));

    // Determine AI recommendation for next level
    let nextLevel = 'Medium';
    let aiNote = '';
    if (finalScore >= 85) {
      nextLevel = 'Hard';
      aiNote = 'Outstanding focus! SmritiCare AI recommends stepping up to Hard level for more memory strength.';
    } else if (finalScore >= 60) {
      nextLevel = 'Medium';
      aiNote = 'Great steady pace! Continuing with Medium level will maintain cognitive plasticity.';
    } else {
      nextLevel = 'Easy';
      aiNote = 'Good effort! SmritiCare AI suggests a gentle Easy level for your next round to build confidence.';
    }

    // Save to LocalStorage
    try {
      const historyStr = localStorage.getItem(SMRITI_STORAGE_KEYS.GAME_HISTORY);
      const history = historyStr ? JSON.parse(historyStr) : [];
      const currentLevelName = this.difficultySelect ? this.difficultySelect.options[this.difficultySelect.selectedIndex].text : 'Medium';
      
      history.unshift({
        date: 'Today',
        game: `Memory Match (${currentLevelName})`,
        score: finalScore,
        timeSec: this.timer,
        moves: this.moves,
        accuracy: accuracy,
        difficulty: currentLevelName
      });
      localStorage.setItem(SMRITI_STORAGE_KEYS.GAME_HISTORY, JSON.stringify(history));

      // Increment pending sync
      const currentSync = parseInt(localStorage.getItem(SMRITI_STORAGE_KEYS.PENDING_SYNC) || '0', 10);
      localStorage.setItem(SMRITI_STORAGE_KEYS.PENDING_SYNC, (currentSync + 1).toString());
    } catch (e) {
      console.error(e);
    }

    speakText(`Well done Mrs. Das! You completed the memory match in ${this.timer} seconds with a score of ${finalScore} points.`);

    // Show Win Modal
    this.showWinModal({
      score: finalScore,
      time: `${this.timer} sec`,
      moves: this.moves,
      accuracy: `${accuracy}%`,
      nextLevel,
      aiNote
    });
  }

  showWinModal(stats) {
    const modal = document.getElementById('win-modal-backdrop');
    const scoreVal = document.getElementById('win-score-val');
    const timeVal = document.getElementById('win-time-val');
    const movesVal = document.getElementById('win-moves-val');
    const accuracyVal = document.getElementById('win-accuracy-val');
    const aiNoteVal = document.getElementById('win-ai-note');

    if (scoreVal) scoreVal.textContent = stats.score.toString();
    if (timeVal) timeVal.textContent = stats.time;
    if (movesVal) movesVal.textContent = stats.moves.toString();
    if (accuracyVal) accuracyVal.textContent = stats.accuracy;
    if (aiNoteVal) aiNoteVal.textContent = stats.aiNote;

    if (modal) modal.classList.add('open');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const game = new MemoryGame();

  const btnPlayAgain = document.getElementById('btn-win-play-again');
  const btnBackGames = document.getElementById('btn-win-back-games');
  const modal = document.getElementById('win-modal-backdrop');

  if (btnPlayAgain) {
    btnPlayAgain.addEventListener('click', () => {
      if (modal) modal.classList.remove('open');
      game.resetGame();
    });
  }

  if (btnBackGames) {
    btnBackGames.addEventListener('click', () => {
      window.location.href = 'games.html';
    });
  }
});
