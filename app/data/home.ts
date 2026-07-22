/**
 * Todo o texto da home mora aqui. Editar copy não deveria exigir abrir
 * um componente Vue — troque as strings deste arquivo e pronto.
 */

export const heroRotatingWords = [
  'com alma',
  'sob medida',
  'que acolhem',
  'que duram',
] as const

export const audience = [
  {
    index: '01',
    title: 'Residencial',
    description:
      'Apartamentos e casas projetados a partir da rotina de quem vive ali. '
      + 'Layout, marcenaria, iluminação e acabamentos pensados juntos, não em etapas soltas.',
    tags: ['Planta e layout', 'Marcenaria', 'Iluminação'],
    wa: 'Olá, Carolina! Tenho um projeto residencial em mente (apartamento ou casa) e gostaria de conversar sobre como transformar o espaço.',
  },
  {
    index: '02',
    title: 'Comercial',
    description:
      'Lojas, clínicas e restaurantes onde o espaço trabalha a favor da marca — '
      + 'fluxo de circulação, vitrine e permanência calculados para vender mais.',
    tags: ['Identidade espacial', 'Fluxo', 'Vitrine'],
    wa: 'Olá, Carolina! Tenho um espaço comercial (loja, clínica ou restaurante) e quero um projeto que trabalhe a favor da marca. Podemos conversar?',
  },
  {
    index: '03',
    title: 'Consultoria',
    description:
      'Para quem já tem o imóvel e precisa de direção. Em poucas sessões, '
      + 'saímos com paleta, plano de compras e prioridades definidas.',
    tags: ['Paleta', 'Plano de compras', 'Curadoria'],
    wa: 'Olá, Carolina! Já tenho o imóvel e preciso de direção — gostaria de saber mais sobre a consultoria.',
  },
] as const

/**
 * Cada serviço vira uma página em /servicos/[slug].
 * `intro` e `includes` alimentam essa página; `title`/`description`/`media`
 * seguem alimentando a lista da home.
 */
export const services = [
  {
    slug: 'projeto-completo',
    title: 'Projeto de interiores completo',
    description: 'Do briefing ao dia da mudança, com detalhamento executivo de tudo.',
    media: '/media/servicos/projeto-completo.jpg',
    intro:
      'O escopo mais completo do estúdio: cada ambiente é pensado a partir da sua rotina '
      + 'e entregue detalhado, do primeiro moodboard ao dia em que você recebe a chave. '
      + 'Nada fica para o improviso da obra.',
    includes: [
      'Levantamento do imóvel e briefing de rotina',
      'Estudo de layout com duas propostas de planta',
      'Projeto executivo: plantas, cortes e elevações',
      'Detalhamento de marcenaria e caderno de acabamentos',
      'Projeto luminotécnico e pontos elétricos',
      'Render 3D de cada ambiente para aprovação',
    ],
  },
  {
    slug: 'marcenaria',
    title: 'Projeto de marcenaria',
    description: 'Desenho técnico de cada peça sob medida, pronto para o marceneiro executar.',
    media: '/media/servicos/marcenaria.jpg',
    intro:
      'Cada peça sob medida desenhada com precisão de milímetro — do painel da TV à despensa. '
      + 'O marceneiro recebe um projeto que não deixa dúvida, e você recebe móveis que encaixam '
      + 'no espaço e no uso.',
    includes: [
      'Desenho técnico de todas as peças (vistas e cortes)',
      'Especificação de materiais, ferragens e acabamentos',
      'Detalhes de iluminação embutida e tomadas',
      'Render 3D das peças para aprovação',
      'Memorial para cotação com qualquer marceneiro',
    ],
  },
  {
    slug: 'luminotecnico',
    title: 'Projeto luminotécnico',
    description: 'Camadas de luz, temperatura de cor e cenas — o que muda um ambiente à noite.',
    media: '/media/servicos/iluminacao.jpg',
    intro:
      'Luz é o que transforma um ambiente à noite. Trabalhamos em camadas — geral, tarefa e '
      + 'destaque — com temperatura de cor e cenas pensadas para cada momento do dia.',
    includes: [
      'Planta de forro com pontos de luz e circuitos',
      'Especificação de luminárias e temperatura de cor',
      'Cenas de iluminação (jantar, receber, relaxar)',
      'Cálculo de fluxo luminoso por ambiente',
      'Detalhamento de sancas, perfis e embutidos',
    ],
  },
  {
    slug: 'render-3d',
    title: 'Render 3D fotorrealista',
    description: 'Você aprova vendo o ambiente pronto, antes de comprar o primeiro material.',
    media: '/media/servicos/render-3d.jpg',
    intro:
      'Você aprova o ambiente vendo ele pronto — antes de comprar o primeiro material. '
      + 'Imagens realistas que mostram luz, textura e proporção exatamente como vão ficar.',
    includes: [
      'Modelagem 3D fiel ao projeto executivo',
      'Imagens em alta resolução de cada ambiente',
      'Estudo de luz natural e artificial',
      'Ângulos-chave para cada espaço',
      'Ajustes de acabamento e mobiliário até aprovar',
    ],
  },
  {
    slug: 'tour-360',
    title: 'Tour virtual 360º',
    description: 'Caminhe pelo projeto no navegador ou no óculos VR antes da obra começar.',
    media: '/media/servicos/tour-360.jpg',
    intro:
      'Caminhe pelo seu projeto antes da obra começar — no navegador, no celular ou no óculos '
      + 'de VR. A forma mais imersiva de sentir a escala e o percurso dos ambientes.',
    includes: [
      'Cenas 360º navegáveis de cada ambiente',
      'Link para abrir no navegador ou celular',
      'Compatível com óculos de realidade virtual',
      'Transições suaves entre ambientes',
      'Ideal para aprovar o layout à distância',
    ],
  },
  {
    slug: 'acompanhamento-de-obra',
    title: 'Acompanhamento de obra',
    description: 'Visitas periódicas, gestão de fornecedores e conferência de cada entrega.',
    media: '/media/servicos/obra.jpg',
    intro:
      'O projeto só termina quando o ambiente está montado. Visitas periódicas, gestão de '
      + 'fornecedores e conferência de cada entrega para que a obra saia fiel ao que foi aprovado.',
    includes: [
      'Visitas técnicas programadas ao canteiro',
      'Orçamento e curadoria de fornecedores',
      'Conferência de medidas e acabamentos',
      'Compatibilização entre as equipes',
      'Acompanhamento até a entrega final',
    ],
  },
] as const

export const stats = [
  { value: 120, suffix: '+', label: 'projetos entregues' },
  { value: 9, suffix: ' anos', label: 'de estúdio' },
  { value: 14, suffix: 'k', label: 'm² projetados' },
  { value: 98, suffix: '%', label: 'de clientes por indicação' },
] as const

export const process = [
  {
    step: '01',
    title: 'Conversa inicial',
    description:
      'Uma call de 40 minutos para entender rotina, orçamento e prazo. '
      + 'Sai daqui com escopo e proposta na mão.',
  },
  {
    step: '02',
    title: 'Estudo preliminar',
    description:
      'Levantamento do imóvel, moodboard e duas propostas de layout. '
      + 'Você escolhe a direção antes de qualquer detalhamento.',
  },
  {
    step: '03',
    title: 'Projeto executivo',
    description:
      'Render 3D, plantas, cortes, detalhamento de marcenaria e caderno de acabamentos. '
      + 'Tudo que a obra precisa para não improvisar.',
  },
  {
    step: '04',
    title: 'Obra acompanhada',
    description:
      'Visitas programadas, orçamento com fornecedores e conferência de medidas. '
      + 'A entrega é o ambiente montado, não o PDF.',
  },
] as const

export const testimonials = [
  {
    quote:
      'Entreguei um apartamento vazio e recebi um lugar que parece que sempre foi meu. '
      + 'O nível de detalhe da marcenaria impressionou até o marceneiro.',
    author: 'Marina Costa',
    role: 'Apartamento 118m² — Gramado',
  },
  {
    quote:
      'A clínica ficou pronta em 4 meses e o número de pacientes que comentam do espaço '
      + 'na primeira consulta é absurdo. Virou parte do atendimento.',
    author: 'Dr. Rafael Menezes',
    role: 'Clínica odontológica — Canela',
  },
  {
    quote:
      'O que mais valeu foi o acompanhamento de obra. Não tive que decidir nada sozinha '
      + 'no susto, e o orçamento fechou dentro do previsto.',
    author: 'Juliana Prado',
    role: 'Casa 240m² — Nova Petrópolis',
  },
] as const

export const faq = [
  {
    question: 'Como funciona o orçamento?',
    answer:
      'O valor é calculado por m² e pelo escopo escolhido. Depois da conversa inicial você '
      + 'recebe uma proposta fechada, com prazo e entregáveis descritos — sem custo por hora '
      + 'e sem surpresa no meio do caminho.',
  },
  {
    question: 'Quanto tempo leva um projeto?',
    answer:
      'Um apartamento de até 120m² leva em média 6 a 8 semanas para o projeto executivo completo. '
      + 'Projetos comerciais e casas maiores variam de 10 a 16 semanas. A obra é contada à parte.',
  },
  {
    question: 'Vocês atendem fora da cidade?',
    answer:
      'Sim. Projeto e aprovações acontecem online, com visitas presenciais combinadas nos '
      + 'momentos-chave. Já atendemos clientes em outros estados e fora do país.',
  },
  {
    question: 'Preciso comprar tudo com fornecedor indicado?',
    answer:
      'Não. Indicamos fornecedores testados e negociamos condições, mas você compra com quem '
      + 'quiser. O caderno de acabamentos traz especificação técnica suficiente para cotar em qualquer lugar.',
  },
  {
    question: 'Dá para fazer o projeto por etapas?',
    answer:
      'Dá. Muitos clientes começam pelos ambientes sociais e seguem para os íntimos depois. '
      + 'O projeto já é entregue prevendo as fases, então nada precisa ser refeito.',
  },
  {
    question: 'E se eu já tiver móveis que quero manter?',
    answer:
      'Ótimo ponto de partida. Fotografamos e medimos as peças no levantamento e elas entram '
      + 'no projeto — costuma render ambientes com mais personalidade do que começar do zero.',
  },
] as const
