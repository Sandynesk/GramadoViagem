import { protectRoute } from './router.js';
import { getUser, signOut } from './auth.js';
import { loadProfile, saveProfile } from './db.js';
import { t, applyTranslations } from './i18n.js';
import { supabase } from './config.js';

let currentUser = null;
let currentAvatarBase64 = null;

async function init() {
  const allowed = await protectRoute();
  if (!allowed) return;

  currentUser = await getUser();
  if (!currentUser) return;

  applyTranslations();
  setupLogout();
  await loadUserData();

  document.getElementById('profile-form').addEventListener('submit', handleSave);
  document.getElementById('prof-avatar').addEventListener('change', handleAvatarUpload);

  // Modal events
  document.getElementById('alert-close-btn').addEventListener('click', closeAlert);
  document.getElementById('alert-close-x').addEventListener('click', closeAlert);
}

function closeAlert() {
  document.getElementById('alert-modal').classList.remove('active');
}

function showAlert(titleKey, descKey) {
  const modal = document.getElementById('alert-modal');
  modal.classList.add('active');
  applyTranslations(); // ensures text updated
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

async function loadUserData() {
  const nameInput = document.getElementById('prof-name');
  const emailInput = document.getElementById('prof-email');
  const dateInput = document.getElementById('prof-date');
  const initialsEl = document.getElementById('avatar-text');
  const avatarCircle = document.getElementById('avatar-circle');
  const displayNameEl = document.getElementById('display-name');
  const displayEmailEl = document.getElementById('display-email');

  // Load from auth
  const email = currentUser.email;
  let name = currentUser.user_metadata?.display_name || '';

  // Load from DB profile (preferences)
  let tripDate = '';
  try {
    const profile = await loadProfile(currentUser.id);
    if (profile) {
      if (!name && profile.display_name) name = profile.display_name;
      if (profile.preferences && profile.preferences.tripDate) {
        tripDate = profile.preferences.tripDate;
      }
      if (profile.preferences && profile.preferences.avatar) {
        currentAvatarBase64 = profile.preferences.avatar;
      }
    }
  } catch (err) {
    console.warn('Erro ao carregar perfil:', err);
  }

  nameInput.value = name;
  emailInput.value = email;
  dateInput.value = tripDate;

  displayNameEl.textContent = name || email.split('@')[0];
  displayEmailEl.textContent = email;

  // Header update (consistent with other pages)
  const headerName = document.querySelector('#user-area .user-name');
  if (headerName) headerName.innerHTML = `<a href="perfil.html" style="color:inherit; text-decoration:none;" title="Meu Perfil">${name || email}</a>`;

  const headerAvatar = document.getElementById('header-avatar');

  // Set avatar initials or image
  if (currentAvatarBase64) {
    const bg = `url(${currentAvatarBase64})`;
    avatarCircle.style.backgroundImage = bg;
    initialsEl.style.display = 'none';
    if (headerAvatar) {
      headerAvatar.style.backgroundImage = bg;
      headerAvatar.textContent = '';
    }
  } else {
    const initials = (name || email).substring(0, 2).toUpperCase();
    initialsEl.textContent = initials;
    initialsEl.style.display = 'block';
    avatarCircle.style.backgroundImage = 'none';
    if (headerAvatar) {
      headerAvatar.textContent = initials;
      headerAvatar.style.backgroundImage = 'none';
    }
  }
}

function handleAvatarUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  // Max 1MB image validation as requested
  if (file.size > 1 * 1024 * 1024) {
    showAlert('profile.error.title', 'profile.error.desc');
    e.target.value = ''; // Reset input
    return;
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    currentAvatarBase64 = event.target.result;
    const avatarCircle = document.getElementById('avatar-circle');
    const initialsEl = document.getElementById('avatar-text');
    
    avatarCircle.style.backgroundImage = `url(${currentAvatarBase64})`;
    initialsEl.style.display = 'none';
  };
  reader.readAsDataURL(file);
}

function showMessage(msg, type) {
  const msgEl = document.getElementById('profile-msg');
  msgEl.textContent = msg;
  msgEl.className = 'profile-message ' + type;
  setTimeout(() => {
    msgEl.className = 'profile-message';
  }, 5000);
}

async function handleSave(e) {
  e.preventDefault();
  
  const submitBtn = document.getElementById('prof-save-btn');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Salvando...';

  const newName = document.getElementById('prof-name').value.trim();
  const newDate = document.getElementById('prof-date').value;
  const newPassword = document.getElementById('prof-password').value;

  try {
    // 1. Update Auth Metadata (and password if provided)
    const updateData = { data: { display_name: newName } };
    if (newPassword && newPassword.length >= 6) {
      updateData.password = newPassword;
    }
    
    const { error: authError } = await supabase.auth.updateUser(updateData);
    if (authError) throw authError;

    // 2. Update DB Profile
    const profileData = await loadProfile(currentUser.id) || { preferences: {} };
    profileData.display_name = newName;
    profileData.preferences = profileData.preferences || {};
    profileData.preferences.tripDate = newDate;
    if (currentAvatarBase64) {
      profileData.preferences.avatar = currentAvatarBase64;
    }
    
    await saveProfile(currentUser.id, profileData);

    // Update UI
    const finalName = newName || currentUser.email.split('@')[0];
    document.getElementById('display-name').textContent = finalName;
    
    // Header update
    const headerName = document.querySelector('#user-area .user-name');
    if (headerName) headerName.innerHTML = `<a href="perfil.html" style="color:inherit; text-decoration:none;" title="Meu Perfil">${newName || currentUser.email}</a>`;

    const initialsEl = document.getElementById('avatar-text');
    const headerAvatar = document.getElementById('header-avatar');

    if (!currentAvatarBase64) {
      const initials = (newName || currentUser.email).substring(0, 2).toUpperCase();
      initialsEl.textContent = initials;
      if (headerAvatar) headerAvatar.textContent = initials;
    } else {
      if (headerAvatar) {
        headerAvatar.style.backgroundImage = `url(${currentAvatarBase64})`;
        headerAvatar.textContent = '';
      }
    }
    
    if (newPassword) document.getElementById('prof-password').value = '';

    showMessage('Perfil atualizado com sucesso!', 'success');

  } catch (err) {
    console.error('Erro ao salvar perfil:', err);
    showMessage('Erro ao salvar: ' + err.message, 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
}

document.addEventListener('DOMContentLoaded', init);
