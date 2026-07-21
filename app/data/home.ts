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
  },
  {
    index: '02',
    title: 'Comercial',
    description:
      'Lojas, clínicas e restaurantes onde o espaço trabalha a favor da marca — '
      + 'fluxo de circulação, vitrine e permanência calculados para vender mais.',
    tags: ['Identidade espacial', 'Fluxo', 'Vitrine'],
  },
  {
    index: '03',
    title: 'Consultoria',
    description:
      'Para quem já tem o imóvel e precisa de direção. Em poucas sessões, '
      + 'saímos com paleta, plano de compras e prioridades definidas.',
    tags: ['Paleta', 'Plano de compras', 'Curadoria'],
  },
] as const

export const services = [
  {
    title: 'Projeto de interiores completo',
    description: 'Do briefing ao dia da mudança, com detalhamento executivo de tudo.',
    media: '/media/servicos/projeto-completo.jpg',
  },
  {
    title: 'Projeto de marcenaria',
    description: 'Desenho técnico de cada peça sob medida, pronto para o marceneiro executar.',
    media: '/media/servicos/marcenaria.jpg',
  },
  {
    title: 'Projeto luminotécnico',
    description: 'Camadas de luz, temperatura de cor e cenas — o que muda um ambiente à noite.',
    media: '/media/servicos/iluminacao.jpg',
  },
  {
    title: 'Render 3D fotorrealista',
    description: 'Você aprova vendo o ambiente pronto, antes de comprar o primeiro material.',
    media: '/media/servicos/render-3d.jpg',
  },
  {
    title: 'Tour virtual 360º',
    description: 'Caminhe pelo projeto no navegador ou no óculos VR antes da obra começar.',
    media: '/media/servicos/tour-360.jpg',
  },
  {
    title: 'Acompanhamento de obra',
    description: 'Visitas periódicas, gestão de fornecedores e conferência de cada entrega.',
    media: '/media/servicos/obra.jpg',
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
    role: 'Apartamento 118m² — Batel',
  },
  {
    quote:
      'A clínica ficou pronta em 4 meses e o número de pacientes que comentam do espaço '
      + 'na primeira consulta é absurdo. Virou parte do atendimento.',
    author: 'Dr. Rafael Menezes',
    role: 'Clínica odontológica — Água Verde',
  },
  {
    quote:
      'O que mais valeu foi o acompanhamento de obra. Não tive que decidir nada sozinha '
      + 'no susto, e o orçamento fechou dentro do previsto.',
    author: 'Juliana Prado',
    role: 'Casa 240m² — Santa Felicidade',
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
