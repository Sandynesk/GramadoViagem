// ── Main Application ────────────────────────────────────────────────────────
import { places } from './data.js';
import { t, getLang, toggleLanguage, applyTranslations } from './i18n.js';
import { getUser, signOut, onAuthStateChange } from './auth.js';
import { saveSelections, loadSelections, saveProfile, loadProfile } from './db.js';
import { protectRoute } from './router.js';

// ── STATE ───────────────────────────────────────────────────────────────────
const state = {}; // id → { selected: bool, prime: bool }
places.forEach(p => { state[p.id] = { selected: false, prime: false }; });

let currentUser = null;
let saveTimeout = null;
let userTripDate = null;

// ── INIT ────────────────────────────────────────────────────────────────────
async function init() {
  // Proteger rota
  const allowed = await protectRoute();
  if (!allowed) return;

  // Obter usuário
  currentUser = await getUser();
  updateUserUI();

  // Load profile to get date
  if (currentUser) {
    try {
      const profile = await loadProfile(currentUser.id);
      if (profile && profile.preferences && profile.preferences.tripDate) {
        // use local coordinates so YYYY-MM-DD string parses correctly to that day in local time or add T00:00:00
        userTripDate = new Date(profile.preferences.tripDate + 'T00:00:00');
      }
    } catch(err) { console.warn('Erro ao carregar perfil', err); }
  }

  // Carregar seleções do banco
  if (currentUser) {
    try {
      const saved = await loadSelections(currentUser.id);
      if (saved) {
        Object.keys(saved).forEach(id => {
          if (state[id]) {
            state[id].selected = saved[id].selected || false;
            state[id].prime = saved[id].prime || false;
          }
        });
      }
    } catch (err) {
      console.warn('Erro ao carregar seleções:', err);
    }
  }

  // Construir UI
  buildCards();
  buildTable();
  setupSearch();
  setupViewToggle();
  setupFilters();
  setupLangToggle();
  setupLogout();
  recalc();
  applyTranslations();

  // Configurar date picker
  setupDateEdit();

  // Countdown
  countdown();
  setInterval(countdown, 60000);

  // Escutar mudanças de auth
  onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_OUT') {
      window.location.replace('login.html');
    }
  });
}

// ── USER UI ─────────────────────────────────────────────────────────────────
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

function setupLogout() {
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        await signOut();
        window.location.replace('login.html');
      } catch (err) {
        console.error('Erro ao sair:', err);
      }
    });
  }
}

// ── LANG TOGGLE ─────────────────────────────────────────────────────────────
function setupLangToggle() {
  const btn = document.getElementById('lang-toggle');
  if (btn) {
    btn.textContent = t('lang.toggle');
    btn.addEventListener('click', () => {
      toggleLanguage();
      // Rebuild cards/table to apply translations
      rebuildUI();
    });
  }
}

// ── BUILD CARDS ─────────────────────────────────────────────────────────────
function buildCard(place) {
  const card = document.createElement('div');
  card.className = `card${place.birthday ? ' birthday' : ''}${state[place.id].selected ? ' selected' : ''}`;
  card.dataset.id = place.id;
  card.dataset.category = place.category;

  const isFree = place.price === 0;
  const catLabel = place.category === 'gastro' ? t('card.gastro')
    : place.category === 'evento' ? t('card.evento')
    : t('card.passeio');

  const primeChecked = state[place.id].prime ? 'checked' : '';
  const selChecked = state[place.id].selected ? 'checked' : '';

  const primeHTML = place.primeable ? `
    <label class="custom-check prime-check" for="prime-${place.id}">
      <input type="checkbox" id="prime-${place.id}" data-type="prime" data-id="${place.id}" ${primeChecked}>
      <span class="checkmark"></span>
      <span class="check-label">${t('card.primeGourmet')}</span>
    </label>
    <div class="prime-note${state[place.id].prime ? ' visible' : ''}" id="prime-note-${place.id}">${t('card.primeNote')}</div>
  ` : place.price > 0 ? `<span class="no-prime-badge">${t('card.semPrime')}</span>` : '';

  const displayPrice = state[place.id].prime && place.primeable
    ? place.price / 2
    : place.price;

  card.innerHTML = `
    <div class="card-banner ${place.category === 'gastro' ? 'gastro' : ''}"></div>
    <div class="card-body">
      <div class="card-header">
        <div class="card-icon ${place.category}">${place.icon}</div>
        <span class="card-tag ${place.category}">${catLabel}</span>
      </div>
      ${place.birthday ? `<div class="birthday-badge">${t('card.birthday')}</div>` : ''}
      <div class="card-name">${place.name}</div>
      <div style="font-size:11px;color:var(--dourado);letter-spacing:1px;font-weight:500">📍 ${place.city}</div>
      <div class="card-desc">${place.desc}</div>
    </div>
    <div class="card-footer">
      <div class="price-area">
        <div class="price-label">${t('card.porPessoa')}</div>
        <div class="price-value${state[place.id].prime && place.primeable ? ' discounted' : ''}" id="price-${place.id}">
          ${isFree ? t('card.gratuito') : `R$ ${displayPrice.toFixed(2).replace('.', ',')}`}
        </div>
        <div class="price-original" id="orig-${place.id}" style="${state[place.id].prime && place.primeable ? '' : 'display:none'}">
          ${state[place.id].prime && place.primeable ? `R$ ${place.price.toFixed(2).replace('.', ',')} por pessoa` : ''}
        </div>
      </div>
      <div class="check-group">
        <label class="custom-check" for="sel-${place.id}">
          <input type="checkbox" id="sel-${place.id}" data-type="select" data-id="${place.id}" ${selChecked}>
          <span class="checkmark"></span>
          <span class="check-label">${t('card.vou')}</span>
        </label>
        ${primeHTML}
      </div>
    </div>
  `;
  return card;
}

function buildCards() {
  const passeioGrid = document.getElementById('grid-passeios');
  const gastroGrid = document.getElementById('grid-gastro');
  const eventoGrid = document.getElementById('grid-evento');

  passeioGrid.innerHTML = '';
  gastroGrid.innerHTML = '';
  eventoGrid.innerHTML = '';

  places.forEach(p => {
    const card = buildCard(p);
    if (p.category === 'passeio') passeioGrid.appendChild(card);
    else if (p.category === 'gastro') gastroGrid.appendChild(card);
    else if (p.category === 'evento') eventoGrid.appendChild(card);
  });

  setupListeners();
}

// ── BUILD TABLE ─────────────────────────────────────────────────────────────
function buildTable() {
  const tbody = document.getElementById('table-body');
  tbody.innerHTML = '';

  places.forEach(p => {
    const tr = document.createElement('tr');
    tr.dataset.id = p.id;
    tr.dataset.category = p.category;
    if (state[p.id].selected) tr.classList.add('selected');

    const isFree = p.price === 0;
    const catLabel = p.category === 'gastro' ? 'Gastro'
      : p.category === 'evento' ? 'Evento'
      : 'Passeio';

    const displayPrice = state[p.id].prime && p.primeable
      ? p.price / 2
      : p.price;

    tr.innerHTML = `
      <td>
        <div class="exp-name-cell">
          <div class="exp-icon-small">${p.icon}</div>
          <div>
            <div style="font-weight:600">${p.name}</div>
            <div style="font-size:11px; opacity:0.6">${p.desc.substring(0, 40)}...</div>
          </div>
        </div>
      </td>
      <td>${p.city}</td>
      <td class="hide-mobile"><span class="exp-category-tag ${p.category}">${catLabel}</span></td>
      <td>
        <div id="table-price-${p.id}" style="font-weight:600${state[p.id].prime && p.primeable ? ';color:var(--dourado)' : ''}">
          ${isFree ? t('card.gratuito') : `R$ ${displayPrice.toFixed(2).replace('.', ',')}`}
        </div>
      </td>
      <td>
        <div class="exp-actions">
           <label class="custom-check" title="${t('card.vou')}">
             <input type="checkbox" data-type="select" data-id="${p.id}" ${state[p.id].selected ? 'checked' : ''}>
             <span class="checkmark"></span>
           </label>
           ${p.primeable ? `
             <label class="custom-check prime-check" title="${t('card.primeGourmet')}">
               <input type="checkbox" data-type="prime" data-id="${p.id}" ${state[p.id].prime ? 'checked' : ''}>
               <span class="checkmark"></span>
             </label>
           ` : ''}
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  setupListeners();
}

// ── EVENT LISTENERS ─────────────────────────────────────────────────────────
function setupListeners() {
  document.querySelectorAll('input[data-type="select"]').forEach(cb => {
    cb.removeEventListener('change', handleSelect);
    cb.addEventListener('change', handleSelect);
  });

  document.querySelectorAll('input[data-type="prime"]').forEach(cb => {
    cb.removeEventListener('change', handlePrime);
    cb.addEventListener('change', handlePrime);
  });
}

function handleSelect(e) {
  const id = e.target.dataset.id;
  const checked = e.target.checked;
  state[id].selected = checked;

  // Sync all inputs with same ID
  document.querySelectorAll(`input[data-id="${id}"][data-type="select"]`).forEach(input => input.checked = checked);

  const card = document.querySelector(`.card[data-id="${id}"]`);
  if (card) card.classList.toggle('selected', checked);

  const row = document.querySelector(`tr[data-id="${id}"]`);
  if (row) row.classList.toggle('selected', checked);

  if (!checked) {
    state[id].prime = false;
    document.querySelectorAll(`input[data-id="${id}"][data-type="prime"]`).forEach(input => input.checked = false);
    updatePriceDisplay(id);
  }
  recalc();
  debounceSave();
}

function handlePrime(e) {
  const id = e.target.dataset.id;
  const checked = e.target.checked;
  state[id].prime = checked;

  document.querySelectorAll(`input[data-id="${id}"][data-type="prime"]`).forEach(input => input.checked = checked);

  if (checked) {
    state[id].selected = true;
    document.querySelectorAll(`input[data-id="${id}"][data-type="select"]`).forEach(input => input.checked = true);
    const card = document.querySelector(`.card[data-id="${id}"]`);
    if (card) card.classList.add('selected');
    const row = document.querySelector(`tr[data-id="${id}"]`);
    if (row) row.classList.add('selected');
  }
  updatePriceDisplay(id);
  recalc();
  debounceSave();
}

// ── DEBOUNCE SAVE ───────────────────────────────────────────────────────────
function debounceSave() {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(async () => {
    if (!currentUser) return;
    try {
      await saveSelections(currentUser.id, state);
    } catch (err) {
      console.warn('Erro ao salvar seleções:', err);
    }
  }, 800);
}

// ── PRICE DISPLAY ───────────────────────────────────────────────────────────
function updatePriceDisplay(id) {
  const place = places.find(p => p.id === id);
  const priceEl = document.getElementById(`price-${id}`);
  const tablePriceEl = document.getElementById(`table-price-${id}`);
  const origEl = document.getElementById(`orig-${id}`);
  const noteEl = document.getElementById(`prime-note-${id}`);

  if (place.price === 0) return;

  let finalPriceText = `R$ ${place.price.toFixed(2).replace('.', ',')}`;
  let discounted = false;

  if (state[id].prime && place.primeable) {
    const half = place.price / 2;
    finalPriceText = `R$ ${half.toFixed(2).replace('.', ',')}`;
    discounted = true;

    if (origEl) {
      origEl.textContent = `R$ ${place.price.toFixed(2).replace('.', ',')} por pessoa`;
      origEl.style.display = 'block';
    }
    if (noteEl) noteEl.classList.add('visible');
  } else {
    if (origEl) origEl.style.display = 'none';
    if (noteEl) noteEl.classList.remove('visible');
  }

  if (priceEl) {
    priceEl.textContent = finalPriceText;
    priceEl.classList.toggle('discounted', discounted);
  }
  if (tablePriceEl) {
    tablePriceEl.textContent = finalPriceText;
    tablePriceEl.style.color = discounted ? 'var(--dourado)' : '';
  }
}

// ── RECALC ──────────────────────────────────────────────────────────────────
function recalc() {
  let total = 0, economia = 0, itens = 0, primeCount = 0;

  places.forEach(p => {
    if (!state[p.id].selected) return;
    itens++;
    const base = p.price;
    if (state[p.id].prime && p.primeable && base > 0) {
      const saving = base / 2;
      total += saving;
      economia += saving;
      primeCount++;
    } else {
      total += base;
    }
  });

  const lang = getLang();
  const itemWord = primeCount === 1 ? t('item') : t('itens');

  animateValue('w-total', `R$ ${total.toFixed(2).replace('.', ',')}`);
  animateValue('w-economia', `R$ ${economia.toFixed(2).replace('.', ',')}`);
  animateValue('s-total', `R$ ${total.toFixed(2).replace('.', ',')}`);
  animateValue('s-economia', `R$ ${economia.toFixed(2).replace('.', ',')}`);
  animateValue('s-itens', String(itens));
  animateValue('s-prime-count', `${primeCount} ${itemWord}`);
}

function animateValue(id, newVal) {
  const el = document.getElementById(id);
  if (!el || el.textContent === newVal) return;
  el.textContent = newVal;
  el.classList.remove('pulse');
  void el.offsetWidth;
  el.classList.add('pulse');
}

// ── COUNTDOWN E DATE EDIT ───────────────────────────────────────────────────────────────
function countdown() {
  const el = document.getElementById('w-dias');
  const labelEl = document.getElementById('w-data-label');

  if (!userTripDate) {
    el.textContent = t('widget.dias.inserir');
    labelEl.textContent = t('widget.dias.selecionar');
    return;
  }

  const now = new Date();
  const diff = userTripDate - now;

  if (diff <= 0) {
    el.textContent = t('countdown.hoje');
    labelEl.textContent = t('countdown.agora');
    return;
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  el.textContent = `${days} ${t('dias')}`;
  labelEl.textContent = userTripDate.toLocaleDateString(getLang() === 'pt' ? 'pt-BR' : 'en-US', {
    day: '2-digit', month: 'long', year: 'numeric'
  });
}

function setupDateEdit() {
  const btn = document.getElementById('edit-date-btn');
  const input = document.getElementById('trip-date-input');
  if(!btn || !input) return;

  btn.addEventListener('click', () => {
    input.showPicker(); // native HTML5 date picker
  });

  const diasVal = document.getElementById('w-dias');
  if (diasVal) {
    diasVal.style.cursor = 'pointer';
    diasVal.addEventListener('click', () => {
      input.showPicker();
    });
  }

  input.addEventListener('change', async (e) => {
    if(!e.target.value) return;
    userTripDate = new Date(e.target.value + 'T00:00:00');
    countdown();

    if(currentUser) {
      try {
        const profile = await loadProfile(currentUser.id) || { preferences: {} };
        profile.preferences = profile.preferences || {};
        profile.preferences.tripDate = e.target.value;
        await saveProfile(currentUser.id, profile);
      } catch(err) {
        console.warn('Erro ao salvar data da viagem:', err);
      }
    }
  });
}

// ── SEARCH ──────────────────────────────────────────────────────────────────
function setupSearch() {
  document.getElementById('search-input').addEventListener('input', updateSearch);
}

function updateSearch() {
  const query = document.getElementById('search-input').value.toLowerCase();

  document.querySelectorAll('.card').forEach(card => {
    const id = card.dataset.id;
    const place = places.find(p => p.id === id);
    const matches = place.name.toLowerCase().includes(query) ||
      place.desc.toLowerCase().includes(query) ||
      place.city.toLowerCase().includes(query);
    card.style.display = matches ? '' : 'none';
  });

  document.querySelectorAll('#table-body tr').forEach(row => {
    const id = row.dataset.id;
    const place = places.find(p => p.id === id);
    const matches = place.name.toLowerCase().includes(query) ||
      place.desc.toLowerCase().includes(query) ||
      place.city.toLowerCase().includes(query);
    row.style.display = matches ? '' : 'none';
  });
}

// ── VIEW TOGGLE ─────────────────────────────────────────────────────────────
function setupViewToggle() {
  document.getElementById('view-cards').addEventListener('click', () => switchView('cards'));
  document.getElementById('view-table').addEventListener('click', () => switchView('table'));
}

function switchView(view) {
  const cardsBtn = document.getElementById('view-cards');
  const tableBtn = document.getElementById('view-table');
  const tableContainer = document.getElementById('table-view-container');
  const sections = ['sec-passeios', 'grid-passeios', 'sec-gastro', 'grid-gastro', 'sec-evento', 'grid-evento'];

  if (view === 'table') {
    cardsBtn.classList.remove('active');
    tableBtn.classList.add('active');
    tableContainer.style.display = 'block';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
    document.querySelectorAll('.filter-btn').forEach(b => {
      b.classList.remove('active');
      if (b.dataset.filter === 'todos') b.classList.add('active');
    });
  } else {
    tableBtn.classList.remove('active');
    cardsBtn.classList.add('active');
    tableContainer.style.display = 'none';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = '';
    });
  }
}

// ── FILTERS ─────────────────────────────────────────────────────────────────
function setupFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      document.querySelectorAll('.card').forEach(card => {
        if (filter === 'todos') {
          card.classList.remove('hidden');
        } else if (filter === 'prime') {
          const place = places.find(p => p.id === card.dataset.id);
          card.classList.toggle('hidden', !(place && place.primeable));
        } else {
          card.classList.toggle('hidden', card.dataset.category !== filter);
        }
      });

      const grids = [
        { title: 'sec-passeios', grid: 'grid-passeios', cat: 'passeio' },
        { title: 'sec-gastro', grid: 'grid-gastro', cat: 'gastro' },
        { title: 'sec-evento', grid: 'grid-evento', cat: 'evento' }
      ];

      grids.forEach(g => {
        const titleEl = document.getElementById(g.title);
        const gridEl = document.getElementById(g.grid);
        const show = filter === 'todos' || filter === 'prime' || filter === g.cat;
        if (titleEl) titleEl.style.display = show ? '' : 'none';
        if (gridEl) gridEl.style.display = show ? '' : 'none';
      });
    });
  });
}

// ── REBUILD UI ──────────────────────────────────────────────────────────────
function rebuildUI() {
  buildCards();
  buildTable();
  recalc();
  countdown();
  applyTranslations();
}

// ── START ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);
