// ── Internationalization (PT / EN) ──────────────────────────────────────────

const translations = {
  pt: {
    // Header
    'header.badge': 'Serra Gaúcha · Roteiro Premium · Para Eu e minha amada',
    'header.title': 'Gramado & <em>Canela</em>',
    'header.subtitle': 'Nosso planejamento · com Prime Gourmet',

    // Home
    'home.badge': 'O seu roteiro perfeito',
    'home.title': 'Viva a Magia da <em>Serra Gaúcha</em>',
    'home.subtitle': 'Planeje dias inesquecíveis, descubra o melhor da gastronomia e controle seus gastos com inteligência.',
    'home.cta': 'Monte seu Roteiro',
    'home.features.title': 'Por que planejar conosco?',
    'home.feat1.title': 'Controle Financeiro',
    'home.feat1.desc': 'Saiba exatamente quanto sua viagem vai custar antes mesmo de arrumar as malas.',
    'home.feat2.title': 'Economia Prime',
    'home.feat2.desc': 'Calcule a economia exata usando o Prime Gourmet e descubra se vale a pena.',
    'home.feat3.title': 'Roteiro Otimizado',
    'home.feat3.desc': 'Marque o que deseja fazer e veja tudo organizado em uma interface simples.',
    'home.finalCta.title': 'Pronto para a viagem dos sonhos?',
    'home.finalCta.desc': 'Crie sua conta gratuitamente e comece a planejar seus dias em Gramado e Canela.',
    'home.footer': 'Feito com ❤️ para memórias inesquecíveis.',

    // Widgets
    'widget.total.label': 'Total Estimado',
    'widget.total.sub': 'itens selecionados',
    'widget.economia.label': 'Economia Prime Gourmet',
    'widget.economia.sub': 'você economiza com o benefício',
    'widget.dias.label': 'Dias para a Viagem',
    'widget.dias.sub': 'data a confirmar',

    // Search & View
    'search.placeholder': 'Buscar experiências (ex: Natal Luz, Fondue...)',
    'view.cards': 'Vista em Cards',
    'view.table': 'Vista em Tabela',

    // Filters
    'filter.label': 'Filtrar',
    'filter.todos': 'Todos',
    'filter.passeios': '🌲 Passeios',
    'filter.gastro': '🍽 Gastronomia',
    'filter.eventos': '🎪 Eventos',
    'filter.prime': '⭐ Prime Gourmet',

    // Sections
    'section.passeios': 'Passeios & Atrações',
    'section.gastro': 'Gastronomia',
    'section.eventos': 'Eventos Especiais',
    'section.table': 'Lista de Experiências Disponíveis',

    // Table headers
    'table.experiencia': 'Experiência',
    'table.cidade': 'Cidade',
    'table.categoria': 'Categoria',
    'table.preco': 'Preço',
    'table.acoes': 'Ações',

    // Summary
    'summary.title': '✦ Resumo da Viagem',
    'summary.total': 'Gastos totais (após descontos)',
    'summary.economia': 'Economia gerada',
    'summary.itens': 'Itens selecionados',
    'summary.prime': 'Custo com Prime ativo em',

    // Card
    'card.passeio': 'Passeio',
    'card.gastro': 'Gastronomia',
    'card.evento': 'Evento',
    'card.porPessoa': 'Por pessoa',
    'card.gratuito': 'Gratuito',
    'card.vou': 'Vou!',
    'card.primeGourmet': '⭐ Prime Gourmet',
    'card.semPrime': 'sem Prime',
    'card.primeNote': '2 por 1 ativo!',
    'card.birthday': '🎁 Jantar de Aniversário',

    // Auth
    'auth.login': 'Entrar',
    'auth.signup': 'Criar Conta',
    'auth.logout': 'Sair',
    'auth.email': 'E-mail',
    'auth.password': 'Senha',
    'auth.name': 'Seu nome',
    'auth.welcome': 'Bem-vindo ao Gramado Planner',
    'auth.welcomeSub': 'Faça login para salvar seu planejamento',
    'auth.noAccount': 'Não tem conta?',
    'auth.hasAccount': 'Já tem conta?',
    'auth.createHere': 'Crie aqui',
    'auth.loginHere': 'Entre aqui',
    'auth.error.email': 'Preencha o e-mail',
    'auth.error.password': 'Preencha a senha (mín. 6 caracteres)',
    'auth.error.generic': 'Erro ao autenticar. Tente novamente.',
    'auth.success.signup': 'Conta criada! Verifique seu e-mail para confirmar.',

    // Misc
    'lang.toggle': '🇺🇸 EN',
    'countdown.hoje': 'Hoje! 🎉',
    'countdown.agora': 'É agora!',
    'dias': 'dias',
    'item': 'item',
    'itens': 'itens',
  },

  en: {
    // Header
    'header.badge': 'Serra Gaúcha · Premium Planner · For me and my beloved',
    'header.title': 'Gramado & <em>Canela</em>',
    'header.subtitle': 'Our trip planner · with Prime Gourmet',

    // Home
    'home.badge': 'Your perfect itinerary',
    'home.title': 'Experience the Magic of <em>Serra Gaúcha</em>',
    'home.subtitle': 'Plan unforgettable days, discover the best gastronomy, and manage your expenses smartly.',
    'home.cta': 'Plan Your Trip',
    'home.features.title': 'Why plan with us?',
    'home.feat1.title': 'Financial Control',
    'home.feat1.desc': 'Know exactly how much your trip will cost before you even pack your bags.',
    'home.feat2.title': 'Prime Savings',
    'home.feat2.desc': 'Calculate the exact savings using Prime Gourmet and see if it pays off.',
    'home.feat3.title': 'Optimized Itinerary',
    'home.feat3.desc': 'Mark what you want to do and see everything organized in a simple interface.',
    'home.finalCta.title': 'Ready for your dream trip?',
    'home.finalCta.desc': 'Create your account for free and start planning your days in Gramado and Canela.',
    'home.footer': 'Made with ❤️ for unforgettable memories.',

    // Widgets
    'widget.total.label': 'Estimated Total',
    'widget.total.sub': 'selected items',
    'widget.economia.label': 'Prime Gourmet Savings',
    'widget.economia.sub': 'you save with the benefit',
    'widget.dias.label': 'Days Until Trip',
    'widget.dias.sub': 'date to be confirmed',

    // Search & View
    'search.placeholder': 'Search experiences (e.g.: Natal Luz, Fondue...)',
    'view.cards': 'Card View',
    'view.table': 'Table View',

    // Filters
    'filter.label': 'Filter',
    'filter.todos': 'All',
    'filter.passeios': '🌲 Tours',
    'filter.gastro': '🍽 Gastronomy',
    'filter.eventos': '🎪 Events',
    'filter.prime': '⭐ Prime Gourmet',

    // Sections
    'section.passeios': 'Tours & Attractions',
    'section.gastro': 'Gastronomy',
    'section.eventos': 'Special Events',
    'section.table': 'Available Experiences List',

    // Table headers
    'table.experiencia': 'Experience',
    'table.cidade': 'City',
    'table.categoria': 'Category',
    'table.preco': 'Price',
    'table.acoes': 'Actions',

    // Summary
    'summary.title': '✦ Trip Summary',
    'summary.total': 'Total expenses (after discounts)',
    'summary.economia': 'Savings generated',
    'summary.itens': 'Selected items',
    'summary.prime': 'Cost with Prime active on',

    // Card
    'card.passeio': 'Tour',
    'card.gastro': 'Gastronomy',
    'card.evento': 'Event',
    'card.porPessoa': 'Per person',
    'card.gratuito': 'Free',
    'card.vou': "I'm in!",
    'card.primeGourmet': '⭐ Prime Gourmet',
    'card.semPrime': 'no Prime',
    'card.primeNote': '2 for 1 active!',
    'card.birthday': '🎁 Birthday Dinner',

    // Auth
    'auth.login': 'Log In',
    'auth.signup': 'Sign Up',
    'auth.logout': 'Log Out',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.name': 'Your name',
    'auth.welcome': 'Welcome to Gramado Planner',
    'auth.welcomeSub': 'Log in to save your trip plan',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    'auth.createHere': 'Sign up here',
    'auth.loginHere': 'Log in here',
    'auth.error.email': 'Please enter your email',
    'auth.error.password': 'Please enter your password (min. 6 characters)',
    'auth.error.generic': 'Authentication error. Try again.',
    'auth.success.signup': 'Account created! Check your email to confirm.',

    // Misc
    'lang.toggle': '🇧🇷 PT',
    'countdown.hoje': 'Today! 🎉',
    'countdown.agora': "It's now!",
    'dias': 'days',
    'item': 'item',
    'itens': 'items',
  }
};

let currentLang = localStorage.getItem('gramado-lang') || 'pt';

/**
 * Retorna a tradução de uma chave para o idioma atual
 */
function t(key) {
  return translations[currentLang]?.[key] || translations['pt']?.[key] || key;
}

/**
 * Retorna o idioma atual
 */
function getLang() {
  return currentLang;
}

/**
 * Aplica todas as traduções nos elementos com [data-i18n]
 */
function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translation = t(key);

    // Se a tradução contém HTML (como <em>), usar innerHTML
    if (translation.includes('<')) {
      el.innerHTML = translation;
    } else {
      el.textContent = translation;
    }
  });

  // Atualizar placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = t(key);
  });

  // Atualizar títulos
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    el.title = t(key);
  });
}

/**
 * Define o idioma e aplica as traduções
 */
function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('gramado-lang', lang);
  applyTranslations();

  // Atualizar o botão de toggle
  const toggleBtn = document.getElementById('lang-toggle');
  if (toggleBtn) {
    toggleBtn.textContent = t('lang.toggle');
  }
}

/**
 * Alterna entre PT e EN
 */
function toggleLanguage() {
  setLanguage(currentLang === 'pt' ? 'en' : 'pt');
}

export { t, getLang, setLanguage, toggleLanguage, applyTranslations, currentLang };
