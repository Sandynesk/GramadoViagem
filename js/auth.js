// ── Authentication Module (Supabase Auth) ───────────────────────────────────
import { supabase } from './config.js';

/**
 * Criar nova conta
 */
async function signUp(email, password, name) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: name || '' }
    }
  });

  if (error) throw error;
  return data;
}

/**
 * Login com email e senha
 */
async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  return data;
}

/**
 * Logout
 */
async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Obter o usuário autenticado atual
 */
async function getUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) return null;
  return user;
}

/**
 * Obter a sessão atual
 */
async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) return null;
  return session;
}

/**
 * Listener de mudança de estado de autenticação
 */
function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
}

export { signUp, signIn, signOut, getUser, getSession, onAuthStateChange };
