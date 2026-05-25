export interface KitComponente {
  imagem: string
  titulo: string
  subtitulo: string
  descricao: string
  specs: string[]
  isBrinde?: boolean
}

export interface KitDetalhe {
  id: number
  slug: string
  nome: string
  badge: string
  preco: number
  tagline: string
  subtitulo: string
  checkoutId: number
  paraQuemE: {
    descricao: string
    especies: string
    ambiente: string
    tecnica: string
    nivel: string
  }
  componentes: KitComponente[]
  porQueCombina: string
}

export const kitsDetalhes: KitDetalhe[] = [
  {
    id: 1,
    slug: 'rio-e-tilapia',
    nome: 'Kit Rio & Tilápia',
    badge: 'INICIANTE',
    preco: 199,
    tagline: 'Chega no pesqueiro e já pesca — sem precisar saber escolher cada peça.',
    subtitulo: 'Molinete leve, vara na medida e linha inclusa. Tudo compatível, tudo pronto. É só montar e jogar na água.',
    checkoutId: 1,
    paraQuemE: {
      descricao: 'Perfeito para quem está começando na pesca ou quer um equipamento simples para levar ao pesqueiro sem complicação.',
      especies: 'Tilápia, traíra, curimba',
      ambiente: 'Pesqueiro, represa, rio de médio porte',
      tecnica: 'Fundo com isca natural, flutuante com bóia',
      nivel: 'Iniciante — não precisa de experiência prévia',
    },
    componentes: [
      {
        imagem: 'https://jyoywekxcuyjfynobkpv.supabase.co/storage/v1/object/public/produto-imagens/81025-1778301907989.jpg',
        titulo: 'MOLINETE ENJOYLURE SE3000',
        subtitulo: 'O coração do kit',
        descricao: '11 rolamentos para recolhimento suave. Drag de 6kg — mais que suficiente para tilápia e traíra. Leve, fácil de operar e com manivela que troca de lado (serve para destros e canhotos).',
        specs: ['11 rolamentos (10+1)', 'Drag: 6kg', 'Manivela intercambiável', 'Corpo em grafite reforçado'],
      },
      {
        imagem: 'https://jyoywekxcuyjfynobkpv.supabase.co/storage/v1/object/public/produto-imagens/30751-1778302128836.jpg',
        titulo: 'VARA ENJOYLURE MACIÇA 1,80M',
        subtitulo: 'Escolhida para esse molinete',
        descricao: 'Com ação de 20 a 65 lbs, essa vara aguenta bem o puxão de uma tilápia grande ou uma traíra raivosa. O comprimento de 1,80m é ideal para pesqueiro — não é curta demais para perder alcance, nem longa demais para atrapalhar.',
        specs: ['Comprimento: 1,80m', 'Ação: 20 a 65 lbs', 'Compatível com molinete', 'Resistente e leve'],
      },
      {
        imagem: '',
        titulo: 'LINHA DE PESCA 100M',
        subtitulo: 'Brinde exclusivo',
        descricao: 'Linha inclusa para você montar o equipamento e já sair pescando. Sem precisar comprar nada a mais.',
        specs: [],
        isBrinde: true,
      },
    ],
    porQueCombina: 'A Vara Enjoylure 1,80m foi projetada para molinetes de tamanho médio como o SE3000. A ação de 20 a 65 lbs é compatível com o drag de 6kg do molinete — isso significa que quando um peixe puxar a linha, o conjunto trabalha junto: a vara dobra na medida certa e o drag solta linha antes de romper.\n\nSe você colocasse um molinete pesado nessa vara, ela sofreria. Se colocasse um molinete fraco numa vara de ação pesada, perderia o peixe. Aqui tudo está calibrado para funcionar junto.',
  },
  {
    id: 2,
    slug: 'pesqueiro-fundo',
    nome: 'Kit Pesqueiro Fundo',
    badge: 'FUNDO',
    preco: 259,
    tagline: 'Isca no fundo, fisgada pesada — montado pra encarar pacu, tambaqui e o que mais aparecer.',
    subtitulo: 'Molinete com capacidade de linha generosa, vara de ação pesada e linha resistente. Para quem quer pescar de verdade no fundo do pesqueiro.',
    checkoutId: 2,
    paraQuemE: {
      descricao: 'Para pescadores que já têm alguma experiência e querem um equipamento pensado para peixes maiores na pesca de fundo.',
      especies: 'Pacu, tambaqui, carpa, tilápia grande',
      ambiente: 'Pesqueiro de fundo, represa, rio largo',
      tecnica: 'Fundo com chumbada, isca natural pesada (milho, massa, bolona)',
      nivel: 'Intermediário',
    },
    componentes: [
      {
        imagem: 'https://jyoywekxcuyjfynobkpv.supabase.co/storage/v1/object/public/produto-imagens/80153-1778302175005.jpg',
        titulo: 'MOLINETE CMIK FB6000',
        subtitulo: 'Potência para peixes grandes',
        descricao: 'Molinete de porte maior, com carretel em alumínio e capacidade para até 310m de linha 0,35mm. Quando um pacu de 5kg resolver correr, ele tem linha de sobra para deixar o peixe cansar sem cortar.',
        specs: ['6 rolamentos', 'Relação de recolhimento: 5.2:1', 'Capacidade: 0,35mm / 310m', 'Carretel em alumínio', 'Peso: 380g'],
      },
      {
        imagem: 'https://jyoywekxcuyjfynobkpv.supabase.co/storage/v1/object/public/produto-imagens/30752-1778302234039.jpg',
        titulo: 'VARA ENJOYLURE MACIÇA 2,10M',
        subtitulo: 'Ação pesada para iscas pesadas',
        descricao: 'Com ação de 60 a 100 lbs, essa vara suporta chumbadas pesadas e a força de peixes grandes sem dobrar além do ponto certo. Os 2,10m de comprimento dão alcance para lançar longe e alavancagem na hora de trazer o peixe para a margem.',
        specs: ['Comprimento: 2,10m', 'Ação: 60 a 100 lbs', 'Compatível com molinete', 'Construção maciça e resistente'],
      },
      {
        imagem: 'https://jyoywekxcuyjfynobkpv.supabase.co/storage/v1/object/public/produto-imagens/80360-1778302395852.jpg',
        titulo: 'LINHA CMIK MONOFILAMENTO 0,35MM — 500M',
        subtitulo: 'Linha certa para pesca de fundo',
        descricao: '0,35mm de diâmetro e 11,3kg de resistência. Espessa o suficiente para suportar o atrito com o fundo e o peso da chumbada, resistente o suficiente para não ceder na fisgada de um tambaqui grande.',
        specs: ['Diâmetro: 0,35mm', 'Comprimento: 500m', 'Resistência: 11,3kg (≈ 25 lbs)', 'Material: Nylon monofilamento'],
      },
      {
        imagem: '',
        titulo: 'CHUMBADA',
        subtitulo: 'Brinde exclusivo',
        descricao: 'Pronta para a pesca de fundo — é só montar na linha e jogar.',
        specs: [],
        isBrinde: true,
      },
    ],
    porQueCombina: 'Pesca de fundo tem uma lógica diferente: isca pesada, linha resistente, equipamento que aguenta esperar. O FB6000 foi escolhido por ter um carretel grande — ele comporta os 500m de linha 0,35mm com folga. A vara de 2,10m com ação de 100 lbs foi escolhida porque iscas pesadas (chumbada + bolona) precisam de uma vara rígida para o lançamento funcionar.\n\nSe você usasse o molinete menor (SE3000) com essa vara e essa linha, o conjunto ficaria desbalanceado — o molinete sofreria na hora de recolher. Aqui tudo está calibrado para pesca de fundo pesada.',
  },
  {
    id: 3,
    slug: 'pesqueiro-superficie',
    nome: 'Kit Pesqueiro Superfície',
    badge: 'SUPERFÍCIE',
    preco: 329,
    tagline: 'Domine o pesqueiro na bóia — precisão, alcance e velocidade para trabalhar a superfície como os bons pescadores fazem.',
    subtitulo: 'Carretilha de alta velocidade, vara de carbono para arremessos precisos e bola cevadeira inclusa para você montar o ponto certo.',
    checkoutId: 3,
    paraQuemE: {
      descricao: 'Para quem quer evoluir na pesca e experimentar a técnica de superfície com bóia cevadeira — uma das mais eficientes em pesqueiros.',
      especies: 'Tilápia, pacu, tambaqui (na superfície)',
      ambiente: 'Pesqueiro, represa, lago',
      tecnica: 'Bóia cevadeira, isca artificial, superfície',
      nivel: 'Intermediário a avançado',
    },
    componentes: [
      {
        imagem: 'https://jyoywekxcuyjfynobkpv.supabase.co/storage/v1/object/public/produto-imagens/712-1778302004530.jpg',
        titulo: 'CARRETILHA CMIK SP200',
        subtitulo: 'Velocidade e precisão em um só equipamento',
        descricao: 'A relação de recolhimento 8.1:1 é uma das mais rápidas do mercado — a cada volta da manivela, o carretel gira 8 vezes. Isso permite trabalhar a bóia com precisão e reagir rápido na fisgada. O perfil baixo facilita o arremesso e reduz o cansaço em sessões longas.',
        specs: ['19 rolamentos (18+1)', 'Relação de recolhimento: 8.1:1', 'Drag: 4,5kg', 'Perfil baixo', 'Guia de linha em titânio', 'Peso: ~220g'],
      },
      {
        imagem: 'https://jyoywekxcuyjfynobkpv.supabase.co/storage/v1/object/public/produto-imagens/81041-1-1778302281009.jpg',
        titulo: 'VARA ENJOYLURE FIBRA DE CARBONO 2,40M',
        subtitulo: 'Mais leve, mais sensível, mais precisa',
        descricao: 'A fibra de carbono faz diferença que você sente: a vara é mais leve que a fibra de vidro e muito mais sensível — você percebe a mordida antes mesmo do peixe virar. Com 2,40m, dá alcance para arremessos longos e posicionamento preciso da bóia cevadeira.',
        specs: ['Comprimento: 2,40m', 'Ação: 15 a 60 lbs', 'Material: Fibra de carbono', 'Compatível com carretilha', 'Alta sensibilidade'],
      },
      {
        imagem: 'https://jyoywekxcuyjfynobkpv.supabase.co/storage/v1/object/public/produto-imagens/80360-1778302395852.jpg',
        titulo: 'LINHA CMIK MONOFILAMENTO 0,35MM — 500M',
        subtitulo: 'Resistência para superfície',
        descricao: 'Linha com resistência de 11,3kg para suportar peixes que chegam com força na bóia. Os 500m garantem que você nunca vai ficar sem linha no carretel.',
        specs: ['Diâmetro: 0,35mm', 'Comprimento: 500m', 'Resistência: 11,3kg', 'Nylon monofilamento'],
      },
      {
        imagem: '',
        titulo: 'BOLA CEVADEIRA',
        subtitulo: 'Brinde exclusivo',
        descricao: 'Pronta para montar seu ponto de pesca na superfície — é só cevar e esperar o cardume chegar.',
        specs: [],
        isBrinde: true,
      },
    ],
    porQueCombina: 'Pesca de superfície com bóia cevadeira exige um equipamento diferente da pesca de fundo. A carretilha SP200 foi escolhida pelo recolhimento rápido (8.1:1) — quando o peixe morde e corre, você precisa recuperar a linha depressa para manter a tensão.\n\nA vara de carbono 2,40m foi escolhida pela sensibilidade: na superfície, você vê a bóia afundar e sente o peixe ao mesmo tempo. Quanto mais sensível a vara, mais rápido você reage.\n\nA combinação carretilha + vara de carbono é o setup que os pescadores experientes usam justamente porque todo o conjunto trabalha junto na superfície.',
  },
]
