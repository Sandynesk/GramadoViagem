// ── Database Module (Supabase Tables) ───────────────────────────────────────
import { supabase } from './config.js';

// ── FAVORITOS / SELEÇÕES ────────────────────────────────────────────────────

/**
 * Salvar as seleções do usuário (quais itens marcou como "Vou!" e quais têm Prime)
 * Faz upsert: se já existe registro para esse user_id, atualiza.
 */
async function saveSelections(userId, selections) {
  // selections = { [placeId]: { selected: bool, prime: bool } }
  const { data, error } = await supabase
    .from('favoritos')
    .upsert({
      user_id: userId,
      selections: selections,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id'
    });

  if (error) throw error;
  return data;
}

/**
 * Carregar as seleções salvas do usuário
 */
async function loadSelections(userId) {
  const { data, error } = await supabase
    .from('favoritos')
    .select('selections')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
  return data?.selections || null;
}

// ── PERFIL ──────────────────────────────────────────────────────────────────

/**
 * Salvar/atualizar o perfil do usuário
 */
async function saveProfile(userId, profileData) {
  const { data, error } = await supabase
    .from('perfil')
    .upsert({
      user_id: userId,
      display_name: profileData.displayName || '',
      preferences: profileData.preferences || {},
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id'
    });

  if (error) throw error;
  return data;
}

/**
 * Carregar o perfil do usuário
 */
async function loadProfile(userId) {
  const { data, error } = await supabase
    .from('perfil')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}

export { saveSelections, loadSelections, saveProfile, loadProfile };
