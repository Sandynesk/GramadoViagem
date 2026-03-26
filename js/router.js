// ── Route Protection ────────────────────────────────────────────────────────
import { getSession } from './auth.js';

// Páginas que NÃO precisam de autenticação
const PUBLIC_PAGES = ['login.html', 'index.html', '/'];

/**
 * Verifica se a página atual é pública
 */
function isPublicPage() {
  const path = window.location.pathname;
  if (path === '/' || path.endsWith('/')) return true; // root is public (index.html)
  return PUBLIC_PAGES.some(page => path.endsWith(page));
}

/**
 * Protege a rota atual — redireciona para login se não autenticado
 * Deve ser chamada no início de páginas protegidas (ex: planner.html)
 */
async function protectRoute() {
  if (isPublicPage()) return true;

  const session = await getSession();

  if (!session) {
    // Salvar a página de destino para redirecionar após login
    sessionStorage.setItem('gramado-redirect', window.location.href);
    window.location.replace('login.html');
    return false;
  }

  return true;
}

/**
 * Redireciona para planner se o usuário já está autenticado
 * Deve ser chamada na página de login e na index.html
 */
async function redirectIfAuthenticated() {
  const session = await getSession();

  if (session) {
    const redirect = sessionStorage.getItem('gramado-redirect') || 'planner.html';
    sessionStorage.removeItem('gramado-redirect');
    window.location.replace(redirect);
    return true;
  }

  return false;
}

export { protectRoute, redirectIfAuthenticated, isPublicPage };
