// ── Places Data ─────────────────────────────────────────────────────────────
// Todas as experiências de Gramado & Canela

const places = [
  // ── PASSEIOS ────────────────────────────────────────────────────────────────
  {
    id: 'aquamotion', category: 'passeio', icon: '🏊',
    name: 'Aquamotion', city: 'Gramado',
    desc: 'O valor é dinâmico e varia de acordo com a temporada e perfil. Compras antecipadas garantem entre 5% e 10% de desconto.',
    price: 150, primeable: true, birthday: false
  },
  {
    id: 'caracol', category: 'passeio', icon: '💧',
    name: 'Cascata do Caracol', city: 'Canela',
    desc: 'Três formas de visita: Parque tradicional (R$114,90), Bondinhos Aéreos (R$120,00) ou Tour Pé da Cascata (R$148-R$248). O valor base é do Parque.',
    price: 114.90, primeable: false, birthday: false
  },
  {
    id: 'alpenpark', category: 'passeio', icon: '🎢',
    name: 'Alpen Park', city: 'Canela',
    desc: 'Entrada gratuita (apenas estacionamento R$30). O passaporte adulto antecipado para brincar à vontade custa a partir de R$138,90 (na bilheteria R$260).',
    price: 138.90, primeable: true, birthday: false
  },
  {
    id: 'olivas', category: 'passeio', icon: '🫒',
    name: 'Olivas de Gramado', city: 'Gramado',
    desc: 'Ingressos chegam a R$259 na alta temporada, ou R$119 a R$139 em períodos de menor movimento. Paisagem deslumbrante.',
    price: 119, primeable: true, birthday: false
  },
  {
    id: 'lago-negro', category: 'passeio', icon: '🚣',
    name: 'Lago Negro', city: 'Gramado',
    desc: 'A entrada no parque é gratuita. O aluguel de pedalinho formato Cisne custa R$50 (para 2) e a Caravela R$60.',
    price: 25, primeable: false, birthday: false
  },
  {
    id: 'fonte-amor', category: 'passeio', icon: '🔒',
    name: 'Fonte do Amor Eterno', city: 'Gramado',
    desc: 'A visita e fotos são gratuitas. O único custo opcional é a compra de um cadeado personalizado nas lojas do entorno.',
    price: 0, primeable: false, birthday: false
  },
  {
    id: 'recordar-fotos', category: 'passeio', icon: '📸',
    name: 'Recordar Fotos', city: 'Gramado / Canela',
    desc: 'Fotos de época. Pacotes antecipados a partir de R$19,90. Arquivos digitais por R$25 cada, impressões R$45.',
    price: 25, primeable: false, birthday: false
  },
  {
    id: 'snowland', category: 'passeio', icon: '❄️',
    name: 'Snowland', city: 'Gramado',
    desc: 'Passaporte adulto varia de R$199,90 (Promo), R$219,90 (Média), R$259,90 (Alta) até R$319,90 (Super Alta Temporada).',
    price: 199.90, primeable: false, birthday: false
  },
  {
    id: 'reino-chocolate', category: 'passeio', icon: '🍫',
    name: 'Reino do Chocolate', city: 'Gramado',
    desc: 'Espaço temático da Caracol Chocolates. Consulta de valores exatos da entrada pode ser verificada no local.',
    price: 0, primeable: false, birthday: false
  },

  // ── GASTRONOMIA ─────────────────────────────────────────────────────────────
  {
    id: 'chalezinho', category: 'gastro', icon: '🎂',
    name: 'Chalezinho', city: 'Gramado',
    desc: 'Rodízio Tradicional sai por até R$406. Rodízio Premium até R$457. Considere R$18 de couvert artístico com pianista.',
    price: 382, primeable: true, birthday: true
  },
  {
    id: 'cara-de-mau', category: 'gastro', icon: '⚓',
    name: 'Porto Cara de Mau', city: 'Gramado',
    desc: 'Rodízio temático adulto antecipado de R$239,90 a R$299,90. Crianças de 5 a 10 anos pagam R$99,90.',
    price: 239.90, primeable: true, birthday: false
  },
  {
    id: 'hector', category: 'gastro', icon: '🚂',
    name: 'Hector Ferrovia Secreta', city: 'Gramado',
    desc: 'O bilhete de 1ª classe inclui viagem nos vagões e serviço de bordo (sequência de hambúrgueres).',
    price: 199.90, primeable: true, birthday: false
  },
  {
    id: 'johnny-rockets', category: 'gastro', icon: '🍔',
    name: 'Johnny Rockets', city: 'Gramado',
    desc: 'Combos completos (hambúrguer, batata, bebida) em média de R$59,90 a R$68,50. Prato de costelinha varia de R$82 a R$109.',
    price: 59.90, primeable: true, birthday: false
  },
  {
    id: 'pappardelle', category: 'gastro', icon: '🍝',
    name: 'Pappardelle', city: 'Canela',
    desc: 'Massas artesanais. Costuma ter um ticket médio acessível e ótimo custo-benefício na cidade.',
    price: 160, primeable: true, birthday: false
  },
  {
    id: 'tango', category: 'gastro', icon: '🥩',
    name: 'Tango Restaurante', city: 'Canela',
    desc: 'Carnes nobres argentinas. Costuma ter um ticket médio acessível em relação aos cortes oferecidos.',
    price: 200, primeable: true, birthday: false
  },
  {
    id: 'restaurante-1835', category: 'gastro', icon: '🍷',
    name: '1835 Restaurante', city: 'Canela',
    desc: 'Pratos elaborados como o "Carreteiro 1835" saem por R$95, e "Pot Pie de Costelão" por R$139.',
    price: 95, primeable: true, birthday: false
  },

  // ── LANCHES (sem Prime) ─────────────────────────────────────────────────────
  {
    id: 'nanica', category: 'gastro', icon: '🍌',
    name: 'Nanica', city: 'Gramado',
    desc: 'Fatia individual da tradicional Banoffee custa R$24,50, e a de Monoffee custa R$27,50.',
    price: 24.50, primeable: false, birthday: false
  },
  {
    id: 'royal-trudel', category: 'gastro', icon: '🧇',
    name: 'Royal Trudel', city: 'Gramado',
    desc: 'Massa tradicional simples R$13,90. Recheios doces de R$22,90 a R$28,50. Salgados até R$24,90.',
    price: 13.90, primeable: false, birthday: false
  },
  {
    id: 'pao-linguica', category: 'gastro', icon: '🌭',
    name: 'Pão com Linguiça', city: 'Canela',
    desc: 'Apenas R$7,00 a unidade, assado na hora nos fornos da Casa do Colono.',
    price: 7, primeable: false, birthday: false
  },
  {
    id: 'cuca-batata', category: 'gastro', icon: '🍠',
    name: 'Cuca e Batata Belga', city: 'Gramado',
    desc: 'Vendida na Casa do Colono. Valores muito acessíveis. Obs: Local costuma aceitar apenas dinheiro ou Pix.',
    price: 15, primeable: false, birthday: false
  },

  // ── EVENTOS ─────────────────────────────────────────────────────────────────
  {
    id: 'natal-luz', category: 'evento', icon: '🎄',
    name: 'Natal Luz', city: 'Gramado',
    desc: 'O maior evento de Natal do Brasil. Shows, desfiles e apresentações emocionantes que transformam a cidade.',
    price: 250, primeable: true, birthday: false
  },
  {
    id: 'pascoa-gramado', category: 'evento', icon: '🐰',
    name: 'Páscoa em Gramado', city: 'Gramado',
    desc: 'Celebração com desfiles, chocolate artesanal e decoração temática por toda a cidade.',
    price: 0, primeable: false, birthday: false
  },
  {
    id: 'festival-cinema', category: 'evento', icon: '🎬',
    name: 'Festival de Cinema', city: 'Gramado',
    desc: 'O mais tradicional festival de cinema do Brasil. Tapete vermelho e premiação do Kikito de Ouro.',
    price: 300, primeable: false, birthday: false
  }
];

export { places };
