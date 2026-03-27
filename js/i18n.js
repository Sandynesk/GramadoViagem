// ── Internationalization (PT / EN) ──────────────────────────────────────────

const translations = {
  pt: {
    // Header
    'header.badge': 'Serra Gaúcha · Roteiro Premium',
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
    'widget.dias.inserir': 'Inserir Data',
    'widget.dias.editar': 'Editar Data',
    'widget.dias.selecionar': 'Selecione a data da viagem',

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

    // Nav
    'nav.planner': '🗺 Planner',
    'nav.cronograma': '🗓 Cronograma',

    // Schedule — config
    'schedule.config.destination': 'Destino',
    'schedule.config.startDate': 'Data de início',
    'schedule.config.days': 'Dias',
    'schedule.config.generate': '✦ Gerar Cronograma',

    // Schedule — views
    'schedule.view.overview': '📅 Visão Geral',
    'schedule.view.dayByDay': '🗓 Dia a Dia',

    // Schedule — modals
    'schedule.event.add': 'Adicionar Evento',
    'schedule.event.edit': 'Editar Evento',
    'schedule.event.save': 'Salvar Evento',
    'schedule.event.title': 'Título (*)',
    'schedule.event.cat': 'Categoria (*)',
    'schedule.event.startTime': 'Horário Início',
    'schedule.event.endTime': 'Horário Fim',
    'schedule.event.location': 'Localização',
    'schedule.event.notes': 'Observações',
    'schedule.event.cancel': 'Cancelar',
    'schedule.event.delete': 'Excluir',
    'schedule.event.noTime': 'A definir',

    // Schedule — misc
    'schedule.empty': 'Nenhum evento. Clique em + para adicionar.',
    'schedule.conflict': '⚠ Conflito de horário',
    'schedule.setup.title': 'Configure sua viagem',
    'schedule.setup.sub': 'Preencha os dados acima e clique em "Gerar Cronograma" para criar seu roteiro.',
    'schedule.clear.btn': '🧨 Limpar Cronograma',
    'schedule.clear.title': 'Limpar Cronograma?',
    'schedule.clear.confirm': 'Tem certeza que deseja apagar todo o cronograma? Esta ação não pode ser desfeita.',
    'schedule.clear.no': 'Cancelar',
    'schedule.clear.yes': 'Sim, Apagar',
    'schedule.event.deleteConfirm': 'Tem certeza que deseja excluir este evento?',

    // Schedule — import
    'schedule.import.btn': '📋 Importar do Planner',
    'schedule.import.title': 'Importar itens do Planner',
    'schedule.import.desc': 'Escolha em qual dia cada item selecionado no Planner deve aparecer.',
    'schedule.import.confirm': '✦ Importar',
    'schedule.import.empty': 'Nenhum item selecionado no Planner. Vá ao Planner e marque "Vou!" nos itens desejados.',
    'schedule.import.skip': 'Não importar',
    'schedule.import.noConfig': 'Configure o cronograma primeiro (defina o número de dias e clique em Gerar).',
    'schedule.import.loading': 'Carregando...',

    // Schedule — prompt
    'schedule.prompt.title': 'Importar do Planner?',
    'schedule.prompt.desc': 'Notamos que você tem novos itens marcados como "Vou!" no Planner. Deseja organizá-los em seu cronograma agora?',
    'schedule.prompt.no': 'Não, obrigado',
    'schedule.prompt.yes': 'Sim, importar',

    // Profile
    'profile.title': 'Editar Perfil',
    'profile.section.account': 'Informações da Conta',
    'profile.name': 'Nome',
    'profile.email': 'E-mail',
    'profile.date': 'Data da Viagem',
    'profile.section.security': 'Segurança (Opcional)',
    'profile.newPassword': 'Nova Senha',
    'profile.save': 'Salvar Alterações',
    'profile.avatar.pref': 'Preferencial: Quadrada, máx. 1MB',
    'profile.error.title': 'Ops! Foto muito grande',
    'profile.error.desc': 'Para garantir o melhor carregamento do site, por favor escolha uma imagem de até 1MB.',
    'profile.error.close': 'Entendi',
  },

  en: {
    // Header
    'header.badge': 'Serra Gaúcha · Premium Planner',
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
    'widget.dias.inserir': 'Add Date',
    'widget.dias.editar': 'Edit Date',
    'widget.dias.selecionar': 'Select trip date',

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

    // Nav
    'nav.planner': '🗺 Planner',
    'nav.cronograma': '🗓 Schedule',

    // Schedule — config
    'schedule.config.destination': 'Destination',
    'schedule.config.startDate': 'Start date',
    'schedule.config.days': 'Days',
    'schedule.config.generate': '✦ Generate Schedule',

    // Schedule — views
    'schedule.view.overview': '📅 Overview',
    'schedule.view.dayByDay': '🗓 Day by Day',

    // Schedule — modals
    'schedule.event.add': 'Add Event',
    'schedule.event.edit': 'Edit Event',
    'schedule.event.save': 'Save Event',
    'schedule.event.title': 'Title (*)',
    'schedule.event.cat': 'Category (*)',
    'schedule.event.startTime': 'Start Time',
    'schedule.event.endTime': 'End Time',
    'schedule.event.location': 'Location',
    'schedule.event.notes': 'Notes',
    'schedule.event.cancel': 'Cancel',
    'schedule.event.delete': 'Delete',
    'schedule.event.noTime': 'To be determined',

    // Schedule — misc
    'schedule.empty': 'No events. Click + to add one.',
    'schedule.conflict': '⚠ Time conflict',
    'schedule.setup.title': 'Configure your trip',
    'schedule.setup.sub': 'Fill in the details above and click "Generate Schedule" to build your itinerary.',
    'schedule.clear.btn': '🧨 Clear Schedule',
    'schedule.clear.title': 'Clear Schedule?',
    'schedule.clear.confirm': 'Are you sure you want to clear the entire schedule? This action cannot be undone.',
    'schedule.clear.no': 'Cancel',
    'schedule.clear.yes': 'Yes, Clear',
    'schedule.event.deleteConfirm': 'Are you sure you want to delete this event?',

    // Schedule — import
    'schedule.import.btn': '📋 Import from Planner',
    'schedule.import.title': 'Import items from Planner',
    'schedule.import.desc': 'Choose which day each item selected in the Planner should appear on.',
    'schedule.import.confirm': '✦ Import',
    'schedule.import.empty': 'No items selected in the Planner. Go to the Planner and check "I\'m in!" on the desired items.',
    'schedule.import.skip': 'Skip',
    'schedule.import.noConfig': 'Configure the schedule first (set the number of days and click Generate).',
    'schedule.import.loading': 'Loading...',

    // Schedule — prompt
    'schedule.prompt.title': 'Import from Planner?',
    'schedule.prompt.desc': 'We noticed you have new items marked as "I\'m in!" in the Planner. Do you want to organize them in your schedule now?',
    'schedule.prompt.no': 'No, thanks',
    'schedule.prompt.yes': 'Yes, import',

    // Profile
    'profile.title': 'Edit Profile',
    'profile.section.account': 'Account Information',
    'profile.name': 'Name',
    'profile.email': 'Email',
    'profile.date': 'Trip Date',
    'profile.section.security': 'Security (Optional)',
    'profile.newPassword': 'New Password',
    'profile.save': 'Save Changes',
    'profile.avatar.pref': 'Preferred: Square, max 1MB',
    'profile.error.title': 'Oops! Photo too large',
    'profile.error.desc': 'To ensure the best performance, please choose an image up to 1MB.',
    'profile.error.close': 'Got it',
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
