// ── Schedule Module ──────────────────────────────────────────────────────────
import { t, getLang, applyTranslations } from './i18n.js';
import { getUser } from './auth.js';
import { protectRoute } from './router.js';
import { loadSelections } from './db.js';
import { places } from './data.js';

// ── CATEGORY MAP: planner → schedule ───────────────────────────────────────────
const CATEGORY_MAP = {
  passeio: 'atrativo',
  gastro:  'restaurante',
  evento:  'outro',
};

// ── CATEGORIES ───────────────────────────────────────────────────────────────
export const CATEGORIES = {
  restaurante: { label: 'Restaurante',        icon: '🍽',  color: '#C4922A' },
  atrativo:    { label: 'Atrativo turístico', icon: '🏔',  color: '#3D6B3D' },
  transporte:  { label: 'Transporte',         icon: '🚗',  color: '#5C8ACA' },
  hospedagem:  { label: 'Hospedagem',         icon: '🏨',  color: '#8A5C42' },
  compras:     { label: 'Compras',            icon: '🛍',  color: '#8A5CC2' },
  outro:       { label: 'Outro',              icon: '📌',  color: '#6B6B6B' },
};

// ── STATE ────────────────────────────────────────────────────────────────────
let scheduleData = {
  config: { destination: '', startDate: '', days: 3 },
  events: {}
};

let currentUser = null;
let currentView = 'overview';   // 'overview' | 'day'
let currentDayIndex = 0;        // for day-by-day view
let editingEvent = null;        // { dayKey, id } or null
let dragData = null;            // { eventId, fromDayKey } during DnD

// ── PERSISTENCE ──────────────────────────────────────────────────────────────
const STORAGE_KEY = 'gramado-schedule';

function loadSchedule() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) scheduleData = JSON.parse(raw);
  } catch { /* ignore */ }
}

function saveSchedule() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scheduleData));
}

// ── EVENT CRUD ───────────────────────────────────────────────────────────────
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function addEvent(dayKey, event) {
  if (!scheduleData.events[dayKey]) scheduleData.events[dayKey] = [];
  event.id = generateId();
  scheduleData.events[dayKey].push(event);
  scheduleData.events[dayKey].sort(sortByTime);
  saveSchedule();
}

function editEvent(dayKey, id, updates) {
  const events = scheduleData.events[dayKey] || [];
  const idx = events.findIndex(e => e.id === id);
  if (idx !== -1) {
    events[idx] = { ...events[idx], ...updates };
    events.sort(sortByTime);
    saveSchedule();
  }
}

function deleteEvent(dayKey, id) {
  if (!scheduleData.events[dayKey]) return;
  scheduleData.events[dayKey] = scheduleData.events[dayKey].filter(e => e.id !== id);
  saveSchedule();
}

// ── EVENT SORTING ─────────────────────────────────────────────────────────────
function sortByTime(a, b) {
  const timeA = a.startTime || '24:00';
  const timeB = b.startTime || '24:00';
  if (timeA < timeB) return -1;
  if (timeA > timeB) return 1;
  return 0;
}

// ── CONFLICT DETECTION ───────────────────────────────────────────────────────
function timeToMinutes(timeStr) {
  if (!timeStr) return -1;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

function detectConflicts(dayKey) {
  const events = scheduleData.events[dayKey] || [];
  const conflictIds = new Set();
  for (let i = 0; i < events.length; i++) {
    for (let j = i + 1; j < events.length; j++) {
      const a = events[i], b = events[j];
      if (!a.startTime || !a.endTime || !b.startTime || !b.endTime) continue;
      const aStart = timeToMinutes(a.startTime);
      const aEnd   = timeToMinutes(a.endTime);
      const bStart = timeToMinutes(b.startTime);
      const bEnd   = timeToMinutes(b.endTime);
      if (aStart < bEnd && aEnd > bStart) {
        conflictIds.add(a.id);
        conflictIds.add(b.id);
      }
    }
  }
  return conflictIds;
}

// ── DATE HELPERS ─────────────────────────────────────────────────────────────
function getDayLabel(dayIndex) {
  const { startDate, destination } = scheduleData.config;
  const dayNum = dayIndex + 1;
  if (!startDate) return `Dia ${dayNum}`;
  const date = new Date(startDate + 'T00:00:00');
  date.setDate(date.getDate() + dayIndex);
  const lang = getLang() === 'pt' ? 'pt-BR' : 'en-US';
  const formatted = date.toLocaleDateString(lang, { weekday: 'short', day: '2-digit', month: 'short' });
  return `Dia ${dayNum} · ${formatted}`;
}

function getDayKey(dayIndex) {
  return `day-${dayIndex + 1}`;
}

// ── RENDER ───────────────────────────────────────────────────────────────────
function buildTimeline() {
  const container = document.getElementById('timeline-container');
  if (!container) return;

  const { days } = scheduleData.config;
  container.innerHTML = '';

  if (currentView === 'overview') {
    for (let i = 0; i < days; i++) {
      container.appendChild(renderDayColumn(i));
    }
  } else {
    // Day-by-day: only current day
    container.appendChild(renderDayColumn(currentDayIndex));
  }

  updateDayNavigation();
}

function renderDayColumn(dayIndex) {
  const dayKey = getDayKey(dayIndex);
  const events = scheduleData.events[dayKey] || [];
  const conflicts = detectConflicts(dayKey);

  const col = document.createElement('div');
  col.className = 'day-column';
  col.dataset.dayKey = dayKey;

  // Day header
  col.innerHTML = `
    <div class="day-header">
      <div class="day-header-label">${getDayLabel(dayIndex)}</div>
      <span class="day-event-count">${events.length} evento${events.length !== 1 ? 's' : ''}</span>
    </div>
    <div class="day-events" id="events-${dayKey}"></div>
    <button class="day-add-btn" data-day="${dayKey}" title="Adicionar evento">
      <span>＋ Adicionar evento</span>
    </button>
  `;

  const eventsContainer = col.querySelector(`#events-${dayKey}`);

  if (events.length === 0) {
    eventsContainer.innerHTML = `<div class="day-empty">${t('schedule.empty')}</div>`;
  } else {
    events.forEach(event => {
      eventsContainer.appendChild(renderEventBlock(event, dayKey, conflicts));
    });
  }

  // Bind add button
  col.querySelector('.day-add-btn').addEventListener('click', () => openAddModal(dayKey));

  // Drag-and-drop: accept drops from other day columns
  eventsContainer.addEventListener('dragover', e => {
    if (dragData && dragData.fromDayKey !== dayKey) {
      e.preventDefault();
      eventsContainer.classList.add('drag-over');
    }
  });
  eventsContainer.addEventListener('dragleave', e => {
    if (!eventsContainer.contains(e.relatedTarget)) {
      eventsContainer.classList.remove('drag-over');
    }
  });
  eventsContainer.addEventListener('drop', e => {
    e.preventDefault();
    eventsContainer.classList.remove('drag-over');
    if (!dragData || dragData.fromDayKey === dayKey) return;
    moveEvent(dragData.fromDayKey, dragData.eventId, dayKey);
    dragData = null;
    buildTimeline();
  });

  return col;
}

function renderEventBlock(event, dayKey, conflicts) {
  const cat = CATEGORIES[event.category] || CATEGORIES.outro;
  const isConflict = conflicts.has(event.id);

  const block = document.createElement('div');
  block.className = `event-block event-${event.category}${isConflict ? ' event-conflict' : ''}`;
  block.dataset.id = event.id;
  block.dataset.dayKey = dayKey;

  const timeLabel = event.startTime
    ? `${event.startTime}${event.endTime ? ' – ' + event.endTime : ''}`
    : '';

  block.innerHTML = `
    <div class="event-icon-wrap" style="background: ${cat.color}15; color: ${cat.color}">
      ${cat.icon}
    </div>
    <div class="event-content">
      <div class="event-time-row">
        ${timeLabel 
          ? `<span class="event-time">🕒 ${timeLabel}</span>` 
          : `<span class="event-time event-time-empty">${t('schedule.event.noTime') || 'A definir'}</span>`
        }
        ${isConflict ? '<span class="conflict-indicator" title="Conflito de horário">⚠ Conflito</span>' : ''}
      </div>
      <div class="event-title">${event.title}</div>
      ${event.location ? `<div class="event-location">📍 ${event.location}</div>` : ''}
    </div>
  `;

  // Apply border dynamically
  block.style.borderLeft = `3px solid ${cat.color}`;

  block.addEventListener('click', () => openDetailModal(event, dayKey));


  // Drag-and-drop: make the block draggable
  block.draggable = true;
  block.addEventListener('dragstart', e => {
    dragData = { eventId: event.id, fromDayKey: dayKey };
    block.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    // Store an identifier so the browser knows what type of data is being dragged
    e.dataTransfer.setData('text/plain', event.id);
  });
  block.addEventListener('dragend', () => {
    block.classList.remove('dragging');
    // Clean up any leftover drag-over highlights
    document.querySelectorAll('.day-events.drag-over').forEach(el => el.classList.remove('drag-over'));
    dragData = null;
  });

  return block;
}

// ── DAY NAVIGATION ───────────────────────────────────────────────────────────
function updateDayNavigation() {
  const nav = document.getElementById('day-nav');
  if (!nav) return;
  const days = scheduleData.config.days || 1;

  if (currentView === 'day') {
    nav.style.display = 'flex';
    nav.querySelector('#day-nav-label').textContent = getDayLabel(currentDayIndex);
    nav.querySelector('#day-nav-prev').disabled = currentDayIndex <= 0;
    nav.querySelector('#day-nav-next').disabled = currentDayIndex >= days - 1;
  } else {
    nav.style.display = 'none';
  }
}

// ── MODALS ───────────────────────────────────────────────────────────────────
function openAddModal(dayKey) {
  editingEvent = null;
  const modal = document.getElementById('event-modal');
  const form = document.getElementById('event-form');
  const modalTitle = document.getElementById('modal-title');

  modalTitle.textContent = t('schedule.event.add');
  form.reset();
  form.dataset.dayKey = dayKey;
  document.getElementById('modal-delete-btn').style.display = 'none';

  // Build category options
  buildCategorySelect();

  modal.classList.add('active');
  document.getElementById('event-title-input').focus();
}

function openEditModal(event, dayKey) {
  editingEvent = { dayKey, id: event.id };
  const modal = document.getElementById('event-modal');
  const form = document.getElementById('event-form');
  const modalTitle = document.getElementById('modal-title');

  modalTitle.textContent = t('schedule.event.edit');
  form.dataset.dayKey = dayKey;

  buildCategorySelect();

  // Populate fields
  document.getElementById('event-title-input').value = event.title || '';
  document.getElementById('event-category-select').value = event.category || 'outro';
  document.getElementById('event-start-input').value = event.startTime || '';
  document.getElementById('event-end-input').value = event.endTime || '';
  document.getElementById('event-location-input').value = event.location || '';
  document.getElementById('event-notes-input').value = event.notes || '';

  document.getElementById('modal-delete-btn').style.display = 'flex';

  // Close detail modal first
  closeDetailModal();
  modal.classList.add('active');
  document.getElementById('event-title-input').focus();
}

function closeModal() {
  document.getElementById('event-modal').classList.remove('active');
  editingEvent = null;
}

function openDetailModal(event, dayKey) {
  const cat = CATEGORIES[event.category] || CATEGORIES.outro;
  const modal = document.getElementById('detail-modal');

  const timeLabel = [event.startTime, event.endTime].filter(Boolean).join(' – ');

  modal.querySelector('#detail-icon').textContent = cat.icon;
  modal.querySelector('#detail-icon').style.background = cat.color + '22';
  modal.querySelector('#detail-category').textContent = cat.label;
  modal.querySelector('#detail-category').style.color = cat.color;
  modal.querySelector('#detail-title').textContent = event.title;
  modal.querySelector('#detail-time').textContent = timeLabel || '—';
  modal.querySelector('#detail-location').textContent = event.location || '—';
  modal.querySelector('#detail-notes').textContent = event.notes || '—';

  modal.querySelector('#detail-edit-btn').onclick = () => openEditModal(event, dayKey);

  modal.querySelector('#detail-delete-btn').onclick = () => {
    if (confirm(t('schedule.event.deleteConfirm'))) {
      deleteEvent(dayKey, event.id);
      closeDetailModal();
      buildTimeline();
    }
  };

  modal.classList.add('active');
}


function closeDetailModal() {
  document.getElementById('detail-modal').classList.remove('active');
}

function buildCategorySelect() {
  const sel = document.getElementById('event-category-select');
  sel.innerHTML = '';
  Object.entries(CATEGORIES).forEach(([key, cat]) => {
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = `${cat.icon} ${cat.label}`;
    sel.appendChild(opt);
  });
}

// ── CONFIG ───────────────────────────────────────────────────────────────────
async function applyConfig() {
  const dest   = document.getElementById('config-destination')?.value.trim() || '';
  const date   = document.getElementById('config-date')?.value || '';
  const daysRaw = parseInt(document.getElementById('config-days')?.value) || 0;
  const days   = Math.max(1, Math.min(daysRaw, 30));

  scheduleData.config = { destination: dest, startDate: date, days };

  // Ensure event keys exist
  for (let i = 0; i < days; i++) {
    const key = getDayKey(i);
    if (!scheduleData.events[key]) scheduleData.events[key] = [];
  }

  saveSchedule();
  buildTimeline();

  // Update page sub-heading
  const sub = document.getElementById('schedule-subtitle');
  if (sub && dest) sub.textContent = dest;

  // Check if we should prompt to import new items
  await checkImportPrompt();
}

// ── CLEAR SCHEDULE ───────────────────────────────────────────────────────────
function openClearModal() {
  document.getElementById('clear-modal').classList.add('active');
}

function closeClearModal() {
  document.getElementById('clear-modal').classList.remove('active');
}

function executeClearSchedule() {
  scheduleData = { config: { destination: '', startDate: '', days: 3 }, events: {} };
  saveSchedule();
  populateConfigUI();
  const sub = document.getElementById('schedule-subtitle');
  if (sub) sub.textContent = 'Sua Viagem';
  buildTimeline();
  closeClearModal();
}

// ── VIEW TOGGLE ──────────────────────────────────────────────────────────────

function switchView(view) {
  currentView = view;
  const overviewBtn = document.getElementById('view-overview');
  const dayBtn      = document.getElementById('view-day');
  const container   = document.getElementById('timeline-container');

  if (view === 'overview') {
    overviewBtn?.classList.add('active');
    dayBtn?.classList.remove('active');
    container.classList.remove('single-day');
  } else {
    dayBtn?.classList.add('active');
    overviewBtn?.classList.remove('active');
    container.classList.add('single-day');
    currentDayIndex = 0;
  }

  buildTimeline();
}

// ── FORM SUBMIT ──────────────────────────────────────────────────────────────
function handleFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const dayKey = form.dataset.dayKey;

  const event = {
    title:     document.getElementById('event-title-input').value.trim(),
    category:  document.getElementById('event-category-select').value,
    startTime: document.getElementById('event-start-input').value,
    endTime:   document.getElementById('event-end-input').value,
    location:  document.getElementById('event-location-input').value.trim(),
    notes:     document.getElementById('event-notes-input').value.trim(),
  };

  if (!event.title) {
    document.getElementById('event-title-input').focus();
    return;
  }

  if (editingEvent) {
    editEvent(editingEvent.dayKey, editingEvent.id, event);
  } else {
    addEvent(dayKey, event);
  }

  closeModal();
  buildTimeline();
}

// ── INIT ─────────────────────────────────────────────────────────────────────
export async function initSchedule() {
  const allowed = await protectRoute();
  if (!allowed) return;

  currentUser = await getUser();
  updateUserUI();

  loadSchedule();
  populateConfigUI();

  // If config already set, build timeline immediately
  if (scheduleData.config.days > 0) buildTimeline();

  // Config form
  document.getElementById('config-form')?.addEventListener('submit', e => {
    e.preventDefault();
    applyConfig();
  });

  // View toggle
  document.getElementById('view-overview')?.addEventListener('click', () => switchView('overview'));
  document.getElementById('view-day')?.addEventListener('click', () => switchView('day'));

  // Clear schedule
  document.getElementById('btn-clear-schedule')?.addEventListener('click', openClearModal);
  document.getElementById('clear-close-btn')?.addEventListener('click', closeClearModal);
  document.getElementById('clear-no-btn')?.addEventListener('click', closeClearModal);
  document.getElementById('clear-yes-btn')?.addEventListener('click', executeClearSchedule);
  document.getElementById('clear-modal')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) closeClearModal();
  });

  // Day navigation
  document.getElementById('day-nav-prev')?.addEventListener('click', () => {
    if (currentDayIndex > 0) { currentDayIndex--; buildTimeline(); }
  });
  document.getElementById('day-nav-next')?.addEventListener('click', () => {
    if (currentDayIndex < scheduleData.config.days - 1) { currentDayIndex++; buildTimeline(); }
  });

  // Event modal form
  document.getElementById('event-form')?.addEventListener('submit', handleFormSubmit);

  // Modal close buttons
  document.getElementById('modal-close-btn')?.addEventListener('click', closeModal);
  document.getElementById('detail-modal-close')?.addEventListener('click', closeDetailModal);
  document.getElementById('modal-cancel-btn')?.addEventListener('click', closeModal);

  // Delete button
  document.getElementById('modal-delete-btn')?.addEventListener('click', () => {
    if (editingEvent) {
      deleteEvent(editingEvent.dayKey, editingEvent.id);
      closeModal();
      buildTimeline();
    }
  });

  // Close on overlay click
  document.getElementById('event-modal')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
  });
  document.getElementById('detail-modal')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) closeDetailModal();
  });

  // Import modal
  document.getElementById('import-confirm-btn')?.addEventListener('click', confirmImport);
  document.getElementById('import-close-btn')?.addEventListener('click', closeImportModal);
  document.getElementById('import-cancel-btn')?.addEventListener('click', closeImportModal);
  document.getElementById('import-modal')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) closeImportModal();
  });

  // Import prompt
  document.getElementById('prompt-close-btn')?.addEventListener('click', closePromptModal);
  document.getElementById('prompt-no-btn')?.addEventListener('click', closePromptModal);
  document.getElementById('prompt-yes-btn')?.addEventListener('click', () => {
    closePromptModal();
    openImportModal();
  });
  document.getElementById('prompt-modal')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) closePromptModal();
  });


  // Lang toggle
  const langBtn = document.getElementById('lang-toggle');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      import('./i18n.js').then(({ toggleLanguage }) => {
        toggleLanguage();
        applyTranslations();
        buildTimeline();
        updateLangBtn();
      });
    });
  }

  // Logout
  document.getElementById('logout-btn')?.addEventListener('click', async () => {
    const { signOut } = await import('./auth.js');
    await signOut();
    window.location.replace('login.html');
  });

  applyTranslations();
  updateLangBtn();

  // Keyboard ESC to close modals
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { 
      closeModal(); 
      closeDetailModal(); 
      closeImportModal(); 
      closePromptModal(); 
      closeClearModal();
    }
  });
}

function populateConfigUI() {
  const { destination, startDate, days } = scheduleData.config;
  const destEl = document.getElementById('config-destination');
  const dateEl = document.getElementById('config-date');
  const daysEl = document.getElementById('config-days');
  if (destEl && destination) destEl.value = destination;
  if (dateEl && startDate) dateEl.value = startDate;
  if (daysEl && days) daysEl.value = days;
}

function updateUserUI() {
  const userArea = document.getElementById('user-area');
  if (!userArea || !currentUser) return;
  const email = currentUser.email;
  const name = currentUser.user_metadata?.display_name || email;
  userArea.querySelector('.user-name').innerHTML = `<a href="perfil.html" style="color:inherit; text-decoration:none;" title="Meu Perfil">${name}</a>`;

  const headerAvatar = document.getElementById('header-avatar');
  if (headerAvatar) {
    loadProfile(currentUser.id).then(profile => {
      if (profile && profile.preferences && profile.preferences.avatar) {
        headerAvatar.style.backgroundImage = `url(${profile.preferences.avatar})`;
        headerAvatar.textContent = '';
      } else {
        headerAvatar.textContent = (name || email).substring(0, 2).toUpperCase();
        headerAvatar.style.backgroundImage = 'none';
      }
    }).catch(() => {
      headerAvatar.textContent = (name || email).substring(0, 2).toUpperCase();
    });
  }

  userArea.style.display = 'flex';
}

function updateLangBtn() {
  const btn = document.getElementById('lang-toggle');
  if (btn) btn.textContent = t('lang.toggle');
}

// ── IMPORT FROM PLANNER ──────────────────────────────────────────────────────────
async function openImportModal() {
  const modal = document.getElementById('import-modal');
  const listEl = document.getElementById('import-list');
  const msgEl  = document.getElementById('import-msg');

  // Silently skip if config isn't set yet (shouldn’t happen since we call after applyConfig)
  if (!scheduleData.config.days || scheduleData.config.days < 1) return;

  // Show modal with loading state
  listEl.innerHTML = `<div class="import-loading">${t('schedule.import.loading')}</div>`;
  msgEl.style.display = 'none';
  modal.classList.add('active');


  let selections = null;
  try {
    if (currentUser) {
      selections = await loadSelections(currentUser.id);
    }
  } catch (err) {
    console.warn('Erro ao carregar seleções:', err);
  }

  listEl.innerHTML = ''; // clear loading

  // Get all existing event titles to prevent duplicates in the list
  const existingTitles = new Set();
  Object.values(scheduleData.events).forEach(dayEvents => {
    dayEvents.forEach(e => existingTitles.add(e.title));
  });

  // Build list of selected places
  const selectedPlaces = places.filter(p => selections?.[p.id]?.selected && !existingTitles.has(p.name));

  if (selectedPlaces.length === 0) {
    msgEl.textContent = t('schedule.import.empty');
    msgEl.style.display = 'block';
    return;
  }

  const days = scheduleData.config.days;

  // Render each selected place as a row with a day selector
  selectedPlaces.forEach((place, idx) => {
    const cat = CATEGORIES[CATEGORY_MAP[place.category] || 'outro'];
    // Auto-assign: distribute round-robin across days
    const defaultDay = (idx % days) + 1;

    const row = document.createElement('div');
    row.className = 'import-row';
    row.dataset.id = place.id;

    // Day <select>
    let dayOptions = '';
    for (let d = 1; d <= days; d++) {
      dayOptions += `<option value="${d}" ${d === defaultDay ? 'selected' : ''}>Dia ${d}</option>`;
    }
    // Add "not import" option
    dayOptions = `<option value="0">${t('schedule.import.skip')}</option>` + dayOptions;

    row.innerHTML = `
      <div class="import-row-left">
        <span class="import-icon" style="background:${cat.color}22">${cat.icon}</span>
        <div class="import-info">
          <div class="import-name">${place.name}</div>
          <div class="import-meta">${place.city} &middot; ${cat.label}</div>
        </div>
      </div>
      <select class="import-day-select" data-place-id="${place.id}">
        ${dayOptions}
      </select>
    `;
    listEl.appendChild(row);
  });
}

function confirmImport() {
  const selects = document.querySelectorAll('.import-day-select');
  let imported = 0;

  selects.forEach(sel => {
    const dayNum = parseInt(sel.value);
    if (dayNum < 1) return; // skip

    const placeId = sel.dataset.placeId;
    const place   = places.find(p => p.id === placeId);
    if (!place) return;

    const dayKey  = `day-${dayNum}`;
    const cat     = CATEGORY_MAP[place.category] || 'outro';

    addEvent(dayKey, {
      title:     place.name,
      category:  cat,
      startTime: '',
      endTime:   '',
      location:  place.city,
      notes:     place.desc,
    });
    imported++;
  });

  closeImportModal();
  if (imported > 0) buildTimeline();
}

function closeImportModal() {
  document.getElementById('import-modal').classList.remove('active');
}

// ── IMPORT PROMPT ────────────────────────────────────────────────────────────
async function checkImportPrompt() {
  if (!scheduleData.config.days || scheduleData.config.days < 1) return;

  let selections = null;
  try {
    if (currentUser) {
      selections = await loadSelections(currentUser.id);
    }
  } catch (err) { }

  // Get all existing event names to prevent duplicates
  const existingTitles = new Set();
  Object.values(scheduleData.events).forEach(dayEvents => {
    dayEvents.forEach(e => existingTitles.add(e.title));
  });

  const hasNewItems = places.some(p => selections?.[p.id]?.selected && !existingTitles.has(p.name));

  if (hasNewItems) {
    document.getElementById('prompt-modal').classList.add('active');
  }
}

function closePromptModal() {
  document.getElementById('prompt-modal').classList.remove('active');
}

// ── MOVE EVENT (drag-and-drop) ────────────────────────────────────────────────────
function moveEvent(fromDayKey, eventId, toDayKey) {
  const fromList = scheduleData.events[fromDayKey] || [];
  const idx = fromList.findIndex(e => e.id === eventId);
  if (idx === -1) return;
  const [event] = fromList.splice(idx, 1);
  if (!scheduleData.events[toDayKey]) scheduleData.events[toDayKey] = [];
  scheduleData.events[toDayKey].push(event);
  scheduleData.events[toDayKey].sort(sortByTime);
  saveSchedule();
}
