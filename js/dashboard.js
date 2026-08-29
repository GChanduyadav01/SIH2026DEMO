/**
 * SmritiCare - Caregiver & Healthcare Worker Dashboards JavaScript
 * Patient Switching, Dynamic Metric Calculation, Responsive Canvas Activity Chart,
 * Alert Center & Multi-Patient Triage Management.
 */

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('caregiver-dashboard-root')) {
    initCaregiverDashboard();
  }
  if (document.getElementById('healthcare-dashboard-root')) {
    initHealthcareDashboard();
  }
});

// ==========================================================================
// 1. Caregiver Dashboard Engine
// ==========================================================================
function initCaregiverDashboard() {
  const patients = getPatients();
  let selectedPatient = patients[0];

  const patientSelect = document.getElementById('caregiver-patient-select');
  const profileName = document.getElementById('cg-patient-name');
  const profileAgeLoc = document.getElementById('cg-patient-age-loc');
  const profileLastActive = document.getElementById('cg-patient-last-active');
  const profileMood = document.getElementById('cg-patient-mood');
  
  // Metric value elements
  const valOverall = document.getElementById('metric-overall-score');
  const valGamesCount = document.getElementById('metric-games-count');
  const valAvgScore = document.getElementById('metric-avg-score');
  const valStreak = document.getElementById('metric-streak');

  // Progress bars
  const barMemory = document.getElementById('bar-memory');
  const barAttention = document.getElementById('bar-attention');
  const barRecognition = document.getElementById('bar-recognition');
  const barRoutine = document.getElementById('bar-routine');

  const textMemory = document.getElementById('text-memory');
  const textAttention = document.getElementById('text-attention');
  const textRecognition = document.getElementById('text-recognition');
  const textRoutine = document.getElementById('text-routine');

  // Activity Table
  const tableBody = document.getElementById('cg-activity-table-body');

  function renderPatient() {
    if (!selectedPatient) return;

    if (profileName) profileName.textContent = selectedPatient.name;
    if (profileAgeLoc) profileAgeLoc.textContent = `Age: ${selectedPatient.age} • ${selectedPatient.location}`;
    if (profileLastActive) profileLastActive.textContent = `Last Active: ${selectedPatient.lastActive}`;
    if (profileMood) profileMood.textContent = `Today's Mood: ${selectedPatient.todayMood || '😊 Happy'}`;

    if (valOverall) valOverall.textContent = `${selectedPatient.cognitiveScore}%`;
    if (valGamesCount) valGamesCount.textContent = selectedPatient.gamesCompleted.toString();
    if (valAvgScore) valAvgScore.textContent = `${selectedPatient.cognitiveScore}%`;
    if (valStreak) valStreak.textContent = `${selectedPatient.streak} Days 🔥`;

    // Update Bars
    const s = selectedPatient.scores;
    if (barMemory) barMemory.style.width = `${s.memory}%`;
    if (barAttention) barAttention.style.width = `${s.attention}%`;
    if (barRecognition) barRecognition.style.width = `${s.recognition}%`;
    if (barRoutine) barRoutine.style.width = `${s.routine}%`;

    if (textMemory) textMemory.textContent = `${s.memory}%`;
    if (textAttention) textAttention.textContent = `${s.attention}%`;
    if (textRecognition) textRecognition.textContent = `${s.recognition}%`;
    if (textRoutine) textRoutine.textContent = `${s.routine}%`;

    // Render Canvas Chart
    drawActivityChart(selectedPatient.weeklyActivity);

    // Render Activity Table
    renderRecentActivityTable();
  }

  function renderRecentActivityTable() {
    if (!tableBody) return;
    tableBody.innerHTML = '';

    // If Mrs. Das, load dynamic LocalStorage history
    let history = DEFAULT_GAME_HISTORY;
    if (selectedPatient.id === 'p1') {
      try {
        const stored = localStorage.getItem(SMRITI_STORAGE_KEYS.GAME_HISTORY);
        if (stored) history = JSON.parse(stored);
      } catch (e) {
        history = DEFAULT_GAME_HISTORY;
      }
    }

    history.slice(0, 5).forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td style="font-weight:600;">${item.date}</td>
        <td><strong>${item.game}</strong></td>
        <td><span class="status-badge ${item.score >= 80 ? 'active-status' : 'attention-status'}">${item.score}%</span></td>
        <td>${item.timeSec ? item.timeSec + 's' : '42s'}</td>
        <td>${item.accuracy ? item.accuracy + '%' : '85%'}</td>
        <td><span style="font-size:0.85rem; background:var(--bg-subtle); padding:2px 8px; border-radius:6px;">${item.difficulty || 'Medium'}</span></td>
      `;
      tableBody.appendChild(row);
    });
  }

  // Populate Selector
  if (patientSelect) {
    patientSelect.innerHTML = '';
    patients.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = `${p.name} (${p.location.split(',')[0]})`;
      patientSelect.appendChild(opt);
    });

    patientSelect.addEventListener('change', (e) => {
      selectedPatient = patients.find(p => p.id === e.target.value) || patients[0];
      renderPatient();
    });
  }

  // Dismiss alert buttons
  document.querySelectorAll('.btn-dismiss-alert').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const alertItem = e.target.closest('.alert-item');
      if (alertItem) {
        alertItem.style.opacity = '0';
        setTimeout(() => alertItem.remove(), 250);
      }
    });
  });

  renderPatient();
}

// Canvas-Based Responsive Line/Bar Chart
function drawActivityChart(dataPoints = [72, 76, 81, 78, 83, 79, 84]) {
  const canvas = document.getElementById('cognitive-activity-chart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = 240 * dpr;
  ctx.scale(dpr, dpr);

  const width = rect.width;
  const height = 240;
  const padding = { top: 30, right: 30, bottom: 40, left: 45 };

  ctx.clearRect(0, 0, width, height);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  // Grid Lines
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  ctx.font = '12px system-ui';
  ctx.fillStyle = '#94a3b8';

  for (let i = 0; i <= 4; i++) {
    const yVal = 40 + i * 15; // 40 to 100
    const y = padding.top + chartH - (i / 4) * chartH;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
    ctx.fillText(`${yVal}%`, 10, y + 4);
  }

  // Calculate coordinates
  const stepX = chartW / (dataPoints.length - 1);
  const coords = dataPoints.map((val, idx) => {
    const norm = (val - 40) / 60; // 40-100 scale
    const x = padding.left + idx * stepX;
    const y = padding.top + chartH - (norm * chartH);
    return { x, y, val, day: days[idx] };
  });

  // Fill gradient area under curve
  const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
  gradient.addColorStop(0, 'rgba(13, 115, 119, 0.35)');
  gradient.addColorStop(1, 'rgba(13, 115, 119, 0.02)');

  ctx.beginPath();
  ctx.moveTo(coords[0].x, height - padding.bottom);
  coords.forEach(pt => ctx.lineTo(pt.x, pt.y));
  ctx.lineTo(coords[coords.length - 1].x, height - padding.bottom);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  // Draw Line
  ctx.beginPath();
  ctx.strokeStyle = '#0d7377';
  ctx.lineWidth = 3.5;
  ctx.lineJoin = 'round';
  coords.forEach((pt, i) => {
    if (i === 0) ctx.moveTo(pt.x, pt.y);
    else ctx.lineTo(pt.x, pt.y);
  });
  ctx.stroke();

  // Draw Points & Labels
  coords.forEach(pt => {
    // Circle
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#0d7377';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Value on top
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 12px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(`${pt.val}%`, pt.x, pt.y - 12);

    // Day label at bottom
    ctx.fillStyle = '#64748b';
    ctx.font = '12px system-ui';
    ctx.fillText(pt.day, pt.x, height - 12);
  });
}

// ==========================================================================
// 2. Healthcare Worker Dashboard Engine
// ==========================================================================
function initHealthcareDashboard() {
  const patients = getPatients();
  let currentFilter = 'all';
  let searchTerm = '';

  const tableBody = document.getElementById('hc-patients-table-body');
  const filterTabs = document.querySelectorAll('.hc-filter-tab');
  const searchInput = document.getElementById('hc-patient-search');

  // Stats Counters
  const countTotal = document.getElementById('hc-stat-total');
  const countAttention = document.getElementById('hc-stat-attention');
  const countAvg = document.getElementById('hc-stat-avg');

  if (countTotal) countTotal.textContent = patients.length.toString();
  if (countAttention) countAttention.textContent = patients.filter(p => p.status === 'Attention').length.toString();
  if (countAvg) {
    const avgScore = Math.round(patients.reduce((a, b) => a + b.cognitiveScore, 0) / patients.length);
    countAvg.textContent = `${avgScore}%`;
  }

  function renderTable() {
    if (!tableBody) return;
    tableBody.innerHTML = '';

    const filtered = patients.filter(p => {
      const matchesFilter = currentFilter === 'all' || p.status.toLowerCase() === currentFilter.toLowerCase();
      const matchesSearch = p.name.toLowerCase().includes(searchTerm) || p.location.toLowerCase().includes(searchTerm);
      return matchesFilter && matchesSearch;
    });

    if (filtered.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center; padding:2.5rem;" class="text-muted">
            No matching patient records found in North East region triage database.
          </td>
        </tr>
      `;
      return;
    }

    filtered.forEach(p => {
      const row = document.createElement('tr');
      const isAttention = p.status === 'Attention';

      row.innerHTML = `
        <td style="font-weight:700; color:var(--text-primary);">
          ${p.name}
          <div style="font-size:0.82rem; font-weight:500; color:var(--text-muted);">${p.location}</div>
        </td>
        <td>${p.age} yrs</td>
        <td>
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <strong>${p.cognitiveScore}%</strong>
            <div class="progress-track" style="width:70px; height:8px;">
              <div class="progress-fill ${p.cognitiveScore > 75 ? 'teal' : 'orange'}" style="width:${p.cognitiveScore}%;"></div>
            </div>
          </div>
        </td>
        <td>${p.gamesCompleted} sessions</td>
        <td>${p.lastActive}</td>
        <td>
          <span class="status-badge ${isAttention ? 'attention-status' : 'active-status'}">
            ${isAttention ? '⚠️ Attention Needed' : '✓ Stable / Normal'}
          </span>
        </td>
        <td>
          <button class="btn btn-sm btn-outline btn-hc-view-profile" data-id="${p.id}" style="padding:0.35rem 0.8rem;">
            View Profile ➔
          </button>
        </td>
      `;

      // Profile modal click
      const btnView = row.querySelector('.btn-hc-view-profile');
      btnView.addEventListener('click', () => {
        showPatientDetailModal(p);
      });

      tableBody.appendChild(row);
    });
  }

  // Filter Tabs
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.getAttribute('data-filter');
      renderTable();
    });
  });

  // Search Input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.toLowerCase().trim();
      renderTable();
    });
  }

  renderTable();
}

function showPatientDetailModal(patient) {
  const modal = document.getElementById('hc-patient-modal');
  const modalContent = document.getElementById('hc-patient-modal-content');
  if (!modal || !modalContent) return;

  const s = patient.scores;
  modalContent.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.5rem;">
      <div>
        <span class="status-badge ${patient.status === 'Attention' ? 'attention-status' : 'active-status'}">
          Status: ${patient.status}
        </span>
        <h2 style="margin:0.5rem 0 0.2rem;">${patient.name}</h2>
        <p class="text-muted" style="margin:0;">Age: ${patient.age} • ${patient.location}</p>
      </div>
      <div style="text-align:right;">
        <div style="font-size:0.85rem; color:var(--text-muted); font-weight:600;">OVERALL COGNITIVE SCORE</div>
        <div style="font-size:2.2rem; font-weight:800; color:var(--primary);">${patient.cognitiveScore}%</div>
      </div>
    </div>

    <h4 style="margin-bottom:0.75rem;">Domain-Specific Cognitive Breakdown</h4>
    <div style="background:var(--bg-subtle); padding:1.2rem; border-radius:14px; margin-bottom:1.5rem;">
      <div class="progress-bar-wrapper">
        <div class="progress-label-row"><span>Memory Retentiveness</span><strong>${s.memory}%</strong></div>
        <div class="progress-track"><div class="progress-fill teal" style="width:${s.memory}%;"></div></div>
      </div>
      <div class="progress-bar-wrapper">
        <div class="progress-label-row"><span>Attention & Vigilance</span><strong>${s.attention}%</strong></div>
        <div class="progress-track"><div class="progress-fill blue" style="width:${s.attention}%;"></div></div>
      </div>
      <div class="progress-bar-wrapper">
        <div class="progress-label-row"><span>Object & Cultural Recognition</span><strong>${s.recognition}%</strong></div>
        <div class="progress-track"><div class="progress-fill green" style="width:${s.recognition}%;"></div></div>
      </div>
      <div class="progress-bar-wrapper" style="margin-bottom:0;">
        <div class="progress-label-row"><span>Routine Recall</span><strong>${s.routine}%</strong></div>
        <div class="progress-track"><div class="progress-fill orange" style="width:${s.routine}%;"></div></div>
      </div>
    </div>

    <div style="display:flex; gap:1rem; margin-top:1.5rem;">
      <button class="btn btn-primary btn-lg" style="flex:1;" onclick="alert('Caregiver tele-consultation initiated for ${patient.name}.');">
        📞 Initiate Tele-Care
      </button>
      <button class="btn btn-outline btn-lg" onclick="document.getElementById('hc-patient-modal').classList.remove('open');">
        Close
      </button>
    </div>
  `;

  modal.classList.add('open');
}

function getPatients() {
  try {
    const stored = localStorage.getItem(SMRITI_STORAGE_KEYS.PATIENTS_LIST);
    return stored ? JSON.parse(stored) : DEFAULT_PATIENTS;
  } catch (e) {
    return DEFAULT_PATIENTS;
  }
}
