/**
 * SmritiAI - Reminders & Daily Routine Manager
 * Category filtering, reminder CRUD, status toggling,
 * LocalStorage persistence & Speech audio assistance.
 */

document.addEventListener('DOMContentLoaded', () => {
  initRemindersApp();
});

function initRemindersApp() {
  let reminders = getStoredReminders();
  let currentFilter = 'all';

  const listContainer = document.getElementById('reminders-list-container');
  const filterBtns = document.querySelectorAll('.reminder-filter-btn');
  const addModal = document.getElementById('add-reminder-modal');
  const btnOpenAdd = document.getElementById('btn-open-add-reminder');
  const btnCloseAdd = document.getElementById('btn-close-add-reminder');
  const formAdd = document.getElementById('form-add-reminder');

  function getStoredReminders() {
    try {
      const stored = localStorage.getItem(SMRITI_STORAGE_KEYS.REMINDERS);
      return stored ? JSON.parse(stored) : DEFAULT_REMINDERS;
    } catch (e) {
      return DEFAULT_REMINDERS;
    }
  }

  function saveReminders() {
    localStorage.setItem(SMRITI_STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
    render();
  }

  function getCategoryIcon(cat) {
    switch (cat) {
      case 'medicine': return '💊';
      case 'hydration': return '💧';
      case 'activity': return '🚶';
      case 'appointment': return '📅';
      default: return '🔔';
    }
  }

  function render() {
    if (!listContainer) return;
    listContainer.innerHTML = '';

    const filtered = reminders.filter(r => {
      if (currentFilter === 'all') return true;
      return r.category === currentFilter;
    });

    if (filtered.length === 0) {
      listContainer.innerHTML = `
        <div style="text-align:center; padding:3rem; background:var(--bg-surface); border-radius:16px; border:1px dashed var(--border-color);">
          <div style="font-size:3rem; margin-bottom:0.5rem;">🎉</div>
          <h3>No Reminders in this Category</h3>
          <p class="text-muted">You are all caught up for now!</p>
        </div>
      `;
      return;
    }

    filtered.forEach(item => {
      const card = document.createElement('div');
      card.className = `card ${item.completed ? 'card-completed' : ''}`;
      card.style.cssText = `display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; margin-bottom:1rem; ${item.completed ? 'opacity:0.75; background:var(--success-light); border-color:#b7e4c7;' : ''}`;

      const icon = getCategoryIcon(item.category);

      card.innerHTML = `
        <div style="display:flex; align-items:center; gap:1.2rem;">
          <div style="font-size:2.4rem; background:var(--primary-subtle); width:64px; height:64px; border-radius:50%; display:flex; align-items:center; justify-content:center;">
            ${icon}
          </div>
          <div>
            <div style="font-size:1.2rem; font-weight:700; color:var(--text-primary); text-decoration:${item.completed ? 'line-through' : 'none'};">
              ${item.title}
            </div>
            <div style="display:flex; align-items:center; gap:0.8rem; margin-top:0.3rem;">
              <span style="font-weight:700; color:var(--primary);">⏰ ${item.time}</span>
              <span class="status-badge ${item.completed ? 'active-status' : 'attention-status'}">
                ${item.completed ? '✓ Completed' : 'Upcoming'}
              </span>
            </div>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:0.6rem;">
          <button class="btn btn-sm btn-outline btn-speak-reminder" title="Read Aloud" style="padding:0.4rem 0.8rem;">
            🔊 Speak
          </button>
          <button class="btn btn-sm ${item.completed ? 'btn-outline' : 'btn-primary'} btn-toggle-reminder">
            ${item.completed ? 'Undo' : '✓ Mark Complete'}
          </button>
          <button class="btn btn-sm btn-outline btn-delete-reminder" title="Delete Reminder" style="color:var(--danger); border-color:var(--danger); padding:0.4rem 0.8rem;">
            🗑️
          </button>
        </div>
      `;

      // Event listeners
      const btnToggle = card.querySelector('.btn-toggle-reminder');
      btnToggle.addEventListener('click', () => {
        item.completed = !item.completed;
        saveReminders();
        if (item.completed) {
          speakText(`Reminder completed: ${item.title}`);
        }
      });

      const btnSpeak = card.querySelector('.btn-speak-reminder');
      btnSpeak.addEventListener('click', () => {
        speakText(`Reminder for ${item.time}. ${item.title}.`);
      });

      const btnDelete = card.querySelector('.btn-delete-reminder');
      btnDelete.addEventListener('click', () => {
        if (confirm(`Remove reminder "${item.title}"?`)) {
          reminders = reminders.filter(r => r.id !== item.id);
          saveReminders();
        }
      });

      listContainer.appendChild(card);
    });
  }

  // Filter Buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter');
      render();
    });
  });

  // Modal Controls
  if (btnOpenAdd) {
    btnOpenAdd.addEventListener('click', () => {
      if (addModal) addModal.classList.add('open');
    });
  }

  if (btnCloseAdd) {
    btnCloseAdd.addEventListener('click', () => {
      if (addModal) addModal.classList.remove('open');
    });
  }

  if (addModal) {
    addModal.addEventListener('click', (e) => {
      if (e.target === addModal) addModal.classList.remove('open');
    });
  }

  // Form Submit
  if (formAdd) {
    formAdd.addEventListener('submit', (e) => {
      e.preventDefault();
      const titleInput = document.getElementById('input-reminder-title');
      const timeInput = document.getElementById('input-reminder-time');
      const catInput = document.getElementById('input-reminder-category');

      if (!titleInput.value || !timeInput.value) return;

      const newReminder = {
        id: 'r_' + Date.now(),
        title: titleInput.value.trim(),
        time: timeInput.value,
        category: catInput.value,
        completed: false
      };

      reminders.unshift(newReminder);
      saveReminders();

      // Clear & close
      titleInput.value = '';
      timeInput.value = '';
      if (addModal) addModal.classList.remove('open');

      speakText(`New reminder scheduled: ${newReminder.title} at ${newReminder.time}`);
    });
  }

  render();
}
