export interface StageModule {
  t: string;
  s: string;
  tasks: string[];
  hints: string[];
  links: Array<{ href: string; label: string } | null>;
  chips: string[];
}

export const MODS: StageModule[] = [
  {
    t: "Escolha seu nicho",
    s: "Defina o assunto, o público e o nome do seu canal.",
    tasks: ["Escolher o tema", "Definir o nome", "Identificar o público"],
    hints: [
      "Algo que você domina e faria 50 vídeos sobre com facilidade.",
      "Curto, marcante, fácil de falar e de achar na busca do YouTube.",
      "Idade, interesses e o problema ou entretenimento que você entrega."
    ],
    links: [null, null, null],
    chips: [
      "Me ajude a escolher um nicho lucrativo",
      "Me dê 10 ideias de nomes criativos para o canal",
      "Como definir o público-alvo dos meus Shorts?"
    ]
  },
  {
    t: "Crie seu canal",
    s: "Crie e personalize seu canal no YouTube.",
    tasks: ["Criar o canal", "Adicionar foto e banner", "Escrever a descrição"],
    hints: [
      "No YouTube, clique na sua foto de perfil → Criar um canal.",
      "No YouTube Studio: Personalização → Perfil com imagem e arte coerentes.",
      "O que o canal ensina, para quem e quando sai vídeo novo (com palavras-chave)."
    ],
    links: [
      { href: "https://www.youtube.com", label: "YouTube" },
      { href: "https://studio.youtube.com", label: "Studio" },
      null
    ],
    chips: [
      "Passo a passo para criar o canal do zero",
      "Escreva uma descrição magnética para o meu canal",
      "Quais dimensões usar no banner e avatar?"
    ]
  },
  {
    t: "Prepare seu conteúdo",
    s: "Planeje seus primeiros vídeos e Shorts.",
    tasks: ["Escolher o tema do vídeo", "Criar título e roteiro", "Separar os materiais necessários"],
    hints: [
      "Uma curiosidade ou dúvida real que seu público pesquisa no YouTube.",
      "Gancho forte nos primeiros 3 segundos para reter a atenção máxima.",
      "Celular, iluminação natural ou ring light, áudio limpo e roteiro em tópicos."
    ],
    links: [null, null, null],
    chips: [
      "Me dê 10 ideias de vídeos para o primeiro mês",
      "Escreva um roteiro curto de 45 segundos para Shorts",
      "Como gravar bons vídeos usando apenas o celular?"
    ]
  },
  {
    t: "Grave e edite",
    s: "Produza seu vídeo com ferramentas simples e gratuitas.",
    tasks: ["Gravar o conteúdo", "Editar o vídeo", "Criar a thumbnail"],
    hints: [
      "Grave de frente para a luz, celular na altura dos olhos e câmera limpa.",
      "Corte pausas e silêncios. Aplicativos como CapCut resolvem rápido.",
      "Foco único, até 4 palavras grandes e contraste de cores chamativo."
    ],
    links: [null, null, null],
    chips: [
      "Tenho vergonha de gravar. Como começar?",
      "Dicas práticas de edição rápida no CapCut",
      "Como criar títulos e capas que dão muitos cliques?"
    ]
  },
  {
    t: "Publique seu vídeo",
    s: "Envie e publique seu primeiro vídeo no YouTube.",
    tasks: ["Enviar o vídeo", "Adicionar título e descrição", "Publicar"],
    hints: [
      "YouTube Studio → Criar → Enviar vídeos.",
      "Palavra-chave principal no título e nas primeiras linhas da descrição.",
      "Visibilidade: Público, ou Programar para o melhor horário do seu nicho."
    ],
    links: [
      { href: "https://studio.youtube.com", label: "Studio" },
      null,
      null
    ],
    chips: [
      "Escreva a descrição e hashtags do meu vídeo",
      "Qual o melhor horário para postar Shorts?",
      "Como funciona o algoritmo do YouTube para canais novos?"
    ]
  },
  {
    t: "Cresça e monetize",
    s: "Acompanhe resultados e desenvolva seu canal.",
    tasks: ["Analisar visualizações", "Planejar novos conteúdos", "Conhecer as opções de monetização"],
    hints: [
      "Studio → Estatísticas: acompanhe a taxa de cliques e retenção de público.",
      "Repita os temas que deram mais visualizações e teste variações.",
      "Programa de Parcerias do YouTube, links de afiliados, patrocínios e produtos."
    ],
    links: [
      { href: "https://studio.youtube.com", label: "Studio" },
      null,
      { href: "https://support.google.com/youtube/answer/72851", label: "Requisitos de Parceria" }
    ],
    chips: [
      "Meu vídeo teve poucas visualizações, o que ajustar?",
      "Monte um calendário semanal de postagens",
      "Quais os requisitos atuais para monetizar o canal?"
    ]
  }
];

export interface VideoIdea {
  tema: string;
  t: string;
  ideia: string;
  ctx: string;
}

export const IDEAS: VideoIdea[] = [
  {
    tema: "O Mapa Completo Reconstruído",
    t: "O Verdadeiro Tamanho do Mapa de GTA 6 Vai Chocar Você!",
    ideia: "Analisar o projeto da comunidade de mapeamento que junta coordenadas e estimativas para prever o tamanho real de Leonida.",
    ctx: "Apresentar a comparação de escala entre o mapa estimado de Leonida e os mundos de GTA 5 e Red Dead Redemption 2. Discutir a distância entre as cidades, áreas rurais e ilhas, explicando o tempo de travessia a pé, de carro e de avião."
  },
  {
    tema: "A Evolução do Motor RAGE 9",
    t: "Como a Rockstar Fez os Gráficos Mais Reais da História?",
    ideia: "Explicar a tecnologia por trás do motor gráfico do jogo e o salto técnico da 9ª geração.",
    ctx: "Focar em física de fluidos, deformação de tecidos, simulação capilar e iluminação global. Explicar de forma acessível para o público gamer como os novos consoles processam esses cálculos em tempo real."
  },
  {
    tema: "Quem São Jason e Lucia?",
    t: "A História por Trás de Jason e Lucia em GTA 6",
    ideia: "Investigar o passado, dinâmica e inspirações dos dois protagonistas jogáveis.",
    ctx: "Detalhar a inspiração no clássico dueto de parceiros, o que cada diálogo das cenas oficiais entrega sobre a personalidade de cada um e como a troca dinâmica entre eles deve funcionar durante a campanha."
  },
  {
    tema: "Inteligência Artificial dos Pedestres",
    t: "Os Pedestres de GTA 6 Têm Vida Própria? Entenda a Nova IA",
    ideia: "Discutir as patentes sobre comportamento de multidões e reações lógicas no mundo aberto.",
    ctx: "Demonstrar como os cidadãos virtuais gravam momentos no celular, reagem a acontecimentos urbanos e possuem rotinas completas de trabalho e descanso diário."
  },
  {
    tema: "O Retorno a Vice City",
    t: "Tudo o Que Mudou em Vice City dos Anos 80 Até Hoje",
    ideia: "Confrontar a clássica Vice City do jogo de 2002 com a versão contemporânea.",
    ctx: "Passear pelos locais icônicos (Ocean Drive, Starfish Island, Malibu Club) e analisar como a cultura evoluiu do synthwave oitentista para a estética vibrante das noites atuais e redes sociais."
  },
  {
    tema: "Sistema de Missões Livres",
    t: "Missões em GTA 6: O Fim das Telas Guiadas?",
    ideia: "Analisar se as missões serão mais procedurais e dinâmicas.",
    ctx: "Debater como portas acessíveis, abordagens táticas livres e rotas de fuga customizadas pelo jogador podem revolucionar a estrutura de missões da franquia."
  },
  {
    tema: "Curiosidades Culturais",
    t: "Os Casos Curiosos que Inspiraram o Estado de Leonida",
    ideia: "Mapear as referências culturais e situações inusitadas satirizadas no trailer.",
    ctx: "Citar os animais exóticos em piscinas, celebrações em carros e personagens icônicos da cultura pop americana, contrastando as notícias reais com as cenas do jogo."
  },
  {
    tema: "Sistema de Perseguição Reformulado",
    t: "Por Que Escapar dos Carros em GTA 6 Vai Ser Tão Desafiador?",
    ideia: "Como a patrulha analisa rotas de trânsito e cria bloqueios estratégicos.",
    ctx: "Explicar como o reconhecimento de modelos de veículos e cores exige que o jogador troque de condução ou personalize o visual em garagens para despistar as buscas."
  },
  {
    tema: "A Física dos Veículos",
    t: "Direção Realista ou Veloz? A Verdade Sobre a Física dos Carros",
    ideia: "Avaliar o equilíbrio entre peso automotivo e jogabilidade ágil.",
    ctx: "Analisar os trechos de direção exibidos: peso de suspensão, aderência de pneus no asfalto molhado e na areia, deformação da lataria em curvas e frenagens esportivas."
  },
  {
    tema: "Easter Eggs e Nostalgia",
    t: "Tributos e Homenagens a Tommy Vercetti em Vice City",
    ideia: "Descobrir as referências escondidas ao lendário personagem de 2002.",
    ctx: "Mostrar murais, referências no comércio e nomes de vias que prestam homenagem à história clássica da franquia sob a nova iluminação de última geração."
  },
  {
    tema: "Redes Sociais e Shorts Dentro do Jogo",
    t: "Como as Redes Sociais Vão Controlar o Mundo de GTA 6",
    ideia: "O uso de vídeos curtos no celular virtual como mecânica de gameplay e reputação.",
    ctx: "Explicar que os vídeos verticais simulam tendências virtuais e eventos ao vivo que abrem oportunidades de missões e encontros aleatórios no mapa."
  },
  {
    tema: "Pântanos e Natureza Selvagem",
    t: "A Fauna Silvestre em GTA 6 Vai Superar Jogos de Sobrevivência?",
    ideia: "O ecossistema de animais selvagens e a exploração dos manguezais de Leonida.",
    ctx: "Falar sobre fauna aquática e terrestre (aves exóticas, répteis, peixes oceânicos), uso de aerobarcos e expedições fotográficas pelos rios tropicais."
  },
  {
    tema: "Consoles de Nova Geração",
    t: "O Jogo Que Vai Mostrar o Poder Máximo do PS5 e Xbox Series",
    ideia: "Como GTA 6 aproveita o hardware veloz com SSD e iluminação por ray tracing.",
    ctx: "Explicar por que o game foi projetado exclusivamente para a nova geração, discutindo taxas de quadros fluidas e resolução em telas ultra-HD."
  },
  {
    tema: "Espaço em Disco e Armazenamento",
    t: "Quantos Gigabytes GTA 6 Vai Ocupar no Seu Console?",
    ideia: "Estimar o tamanho final dos arquivos com texturas 4K e centenas de horas de áudio.",
    ctx: "Comparar com os maiores jogos de mundo aberto da atualidade, prevendo o tamanho de instalação e orientando sobre expansão de armazenamento."
  },
  {
    tema: "A Trilha Sonora e Radiodifusão",
    t: "As Músicas que Vão Marcar as Rádios de GTA 6",
    ideia: "O papel cultural das estações de rádio e seleções musicais marcantes.",
    ctx: "Discutir a presença de clássicos do pop, hip-hop, reggaeton e rock, além dos programas de entrevistas bem-humorados que tocam ao dirigir pelos litorais."
  },
  {
    tema: "O Futuro do Modo Online",
    t: "O Que Esperar da Próxima Geração do Modo Multijogador?",
    ideia: "A evolução do jogo em equipe com servidores mais densos e novas missões cooperativas.",
    ctx: "Debater melhorias gráficas compartilhadas, compras de iates e propriedades em conjunto, além de corridas com dezenas de competidores pelas avenidas de Vice City."
  },
  {
    tema: "Edifícios e Interiores Abertos",
    t: "O Fim dos Prédios Fechados: Interiores Acessíveis no Mapa",
    ideia: "A proporção de estabelecimentos comerciais e residenciais abertos para visitação.",
    ctx: "Contrastar cidades virtuais antigas com a promessa de shoppings, hotéis, restaurantes e garagens com acesso fluido e sem telas de carregamento."
  },
  {
    tema: "Customização de Carros e Garagens",
    t: "A Oficina Perfeita: Personalização Extrema de Carros",
    ideia: "A profundidade das modificações estéticas e mecânicas dos veículos.",
    ctx: "Apresentar expectativas de personalização de cores perolizadas, iluminação neon subchassi, spoilers de fibra de carbono e rodas customizadas."
  },
  {
    tema: "Mecânica de Tiro e Cobertura",
    t: "O Sistema de Ação Ficou Mais Fluido e Cinematográfico?",
    ideia: "As melhorias em tempo de resposta de mira, troca de armas e esquivas táticas.",
    ctx: "Discutir a transição para animações mais naturais de corrida, saltos de obstáculos urbanos e utilização inteligente do ambiente como proteção."
  },
  {
    tema: "Estilo Visual e Trajes",
    t: "Guarda-Roupa Completo: O Estilo Tropical em GTA 6",
    ideia: "A personalização de roupas, cortes de cabelo e acessórios para os personagens.",
    ctx: "Falar sobre roupas de praia, ternos elegantes para clubes noturnos, camisas floridas retrô e como o vestuário compõe a estética vibrante do canal."
  },
  {
    tema: "Visão em Primeira Pessoa",
    t: "Explorando Vice City em Primeira Pessoa: Imersão Total",
    ideia: "A experiência visual do jogador vendo o painel dos carros e as praias pelos próprios olhos.",
    ctx: "Explicar como o nível de detalhe dos velocímetros digitais, relógios de pulso e reflexos nas janelas eleva o nível imersivo ao caminhar pela calçada."
  },
  {
    tema: "Clima Dinâmico e Chuvas Tropicais",
    t: "Como as Tempestades Tropicais Mudam o Visual das Ruas",
    ideia: "O efeito de poças d'água reflexivas e ventos balançando as palmeiras de Vice City.",
    ctx: "Mostrar como o clima tropical altera a aderência nas rodovias, cria névoas costeiras deslumbrantes e transforma o visual dos arranha-céus à noite."
  },
  {
    tema: "Navegação em Lanchas e Jetskis",
    t: "Cortando as Ondas de Miami: Os Veículos Náuticos de GTA 6",
    ideia: "A física de ondas do mar e a navegação esportiva pelas águas cristalinas.",
    ctx: "Analisar as lanchas rápidas de alta cilindrada, motos aquáticas ágeis para manobras e iates luxuosos ancorados na baía."
  },
  {
    tema: "Dublagem e Atuação",
    t: "Os Talentos de Atuação e Voz que Dão Vida a Jason e Lucia",
    ideia: "O trabalho artístico dos atores na captura de movimentos corporais e faciais.",
    ctx: "Explicar como o avanço na captura facial reproduz microexpressões de olhar, sorrisos e tensão dramática nas cenas cinematográficas."
  },
  {
    tema: "Fidelidade Visual nos Detalhes",
    t: "5 Detalhes Gráficos Incríveis que Você Provavelmente Não Notou",
    ideia: "Pequenos detalhes técnicos que mostram o capricho da produção.",
    ctx: "Destacar os fios de cabelo voando com a brisa do mar, a luz solar atravessando as folhas das palmeiras e os reflexos em retrovisores em tempo real."
  },
  {
    tema: "Humor e Crítica Social",
    t: "A Sátira do Mundo Moderno e das Vidas Digitais",
    ideia: "Como a franquia continua sendo o espelho mais afiado da cultura pop contemporânea.",
    ctx: "Discutir as paródias de marcas esportivas, comerciais bem-humorados na televisão virtual e o retrato bem-humorado da obsessão por curtidas online."
  },
  {
    tema: "Início da Campanha",
    t: "O Que Esperar das Primeiras Horas de História?",
    ideia: "Como o prólogo apresenta a dinâmica dos personagens e o mapa de Leonida.",
    ctx: "Teorizar sobre as primeiras missões de introdução, primeiros veículos desbloqueados e a ambientação gradual nos bairros litorâneos."
  },
  {
    tema: "Exploração Sem Limites",
    t: "Descobrindo Cada Canto de Leonida: Das Praias às Montanhas",
    ideia: "A variedade de relevos e biomas presentes no território completo.",
    ctx: "Traçar um roteiro de viagem virtual pelas rodovias costeiras, ilhas paradisíacas e vilarejos do interior com paradas para contemplar a paisagem."
  },
  {
    tema: "Bairros e Comunidades",
    t: "A Diversidade Cultural e Visual dos Bairros de Vice City",
    ideia: "A arquitetura e atmosfera sonora de cada região da metrópole.",
    ctx: "Apresentar os distritos artísticos com murais grafitados, os centros financeiros imponentes e os calçadões beira-mar com esportes ao ar livre."
  },
  {
    tema: "Economia e Conquistas",
    t: "Como Ficar Milionário Dentro do Jogo: Carros e Mansões",
    ideia: "O plano de crescimento financeiro do jogador ao longo da jornada.",
    ctx: "Debater a compra de propriedades icônicas, investimentos em garagens e coleções de supercarros esportivos."
  },
  {
    tema: "A Jornada de Desenvolvimento",
    t: "A Longa Espera de Mais de 10 Anos por GTA 6",
    ideia: "Uma retrospectiva da evolução dos games da franquia desde 2013.",
    ctx: "Relembrar marcos históricos de lançamentos da desenvolvedora e o nível de expectativa criado na comunidade global de criadores de conteúdo."
  },
  {
    tema: "Expedições pelos Pântanos",
    t: "Mergulhando nos Mistérios dos Manguezais de Leonida",
    ideia: "O que esperar ao explorar áreas pantanosas em aerobarcos velozes.",
    ctx: "Focar em cenários com neblina matinal, sons de animais noturnos e cabanas isoladas com segredos e itens colecionáveis."
  },
  {
    tema: "Ilhas Tropicais e Paraísos",
    t: "As Ilhas Paradisíacas que Cercam a Costa de Vice City",
    ideia: "Locais marítimos isolados ideais para manobras de lancha e saltos de paraquedas.",
    ctx: "Descrever os recifes de corais, águas azul-turquesa perfeitas para fotos no modo fotografia e praias desertas."
  },
  {
    tema: "Modo Fotografia Profissional",
    t: "Tirando Fotos Épicas com o Modo Fotografia de GTA 6",
    ideia: "Como os criadores de conteúdo podem capturar papéis de parede incríveis.",
    ctx: "Dicas de ângulos de câmera com profundidade de campo, pôr do sol dourado e enquadramentos de veículos em alta velocidade."
  },
  {
    tema: "Sátiras de Startups e Tecnologia",
    t: "As Empresas Fictícias Mais Criativas do Universo Rockstar",
    ideia: "Como marcas fictícias parodiam os gigantes da tecnologia contemporânea.",
    ctx: "Apresentar outdoors inteligentes, carros elétricos futuristas e anúncios engraçados nos canais de mídia do jogo."
  },
  {
    tema: "A Vida Noturna em Cores Neon",
    t: "Por Que a Noite de Vice City é a Mais Bonita dos Videogames",
    ideia: "A estética dos letreiros luminosos e iluminação volumétrica refletida nas ruas.",
    ctx: "Mostrar como o contraste das luzes rosa, azul e dourada transforma a cidade em um espetáculo cinematográfico contínuo."
  },
  {
    tema: "Física de Colisão e Destruição",
    t: "Batidas e Acidentes em GTA 6: O Novo Padrão de Realismo",
    ideia: "Como vidros temperados, para-choques e latarias reagem a impactos fortes.",
    ctx: "Comentar sobre a deformação tridimensional realista dos carros nas pistas de corrida e testes de impacto em postes e barreiras."
  },
  {
    tema: "A Influência dos Grandes Clássicos",
    t: "O Que GTA 6 Herdou dos Melhores Jogos de Mundo Aberto",
    ideia: "Mecânicas consolidadas de outros sucessos aplicadas a uma cidade moderna.",
    ctx: "Destacar a interação orgânica com cidadãos, eventos aleatórios nas estradas e menus contextuais simples e intuitivos."
  },
  {
    tema: "Corridas de Rua Noturnas",
    t: "Disputando Corridas Clandestinas nos Viadutos de Vice City",
    ideia: "A emoção das competições de velocidade com carros tunados na madrugada.",
    ctx: "Estratégias de ultrapassagem nas pontes largas, uso de curvas fechadas e fuga rápida quando os radares detectam a velocidade."
  },
  {
    tema: "Caçadores de Conquistas",
    t: "Como Conquistar Todos os Troféus e Platinar GTA 6",
    ideia: "Um guia de organização para jogadores que querem completar 100% das atividades.",
    ctx: "Dividir metas de exploração, corridas vitoriosas, missões de ajuda a pedestres e acrobacias aéreas sob pontes famosas."
  },
  {
    tema: "Cooperação Tática entre Protagonistas",
    t: "A Parceria de Jason e Lucia Durante os Desafios",
    ideia: "Como alternar entre cobertura e avanço tático deixa o jogo mais dinâmico.",
    ctx: "Descrever cenas de ação onde um personagem assume o volante na fuga enquanto o outro afasta perseguidores com precisão."
  },
  {
    tema: "Colecionáveis e Edições Físicas",
    t: "Tudo Sobre as Edições de Colecionador e Brindes Físicos",
    ideia: "A valorização de mapas impressos, estojos metálicos e miniaturas temáticas.",
    ctx: "Conversar com o público sobre o carinho em ter itens físicos na estante para marcar a estreia de uma grande obra dos games."
  },
  {
    tema: "Esportes Radicais e Lazer",
    t: "Paraquedismo, Mergulho e Esportes Radicais em Leonida",
    ideia: "Atividades secundárias que oferecem vistas de tirar o fôlego.",
    ctx: "Saltos de paraquedas do topo dos maiores arranha-céus, passeios de helicóptero sobre a orla e mergulhos com cilindro em naufrágios históricos."
  },
  {
    tema: "Mistérios e Lendas Urbanas",
    t: "Caçando Easter Eggs: Os Segredos Subaquáticos de Vice City",
    ideia: "Exploração de navios naufragados e cavernas submarinas misteriosas.",
    ctx: "Comentar sobre os mistérios que a comunidade adora desvendar, usando submarinos pequenos ou equipamentos de mergulho profundo."
  },
  {
    tema: "Clubes e Música Eletrônica",
    t: "As Melhores Festas e Sets de DJ em Vice City",
    ideia: "A ambientação sonora das casas de show com iluminação estroboscópica e DJs virtuais.",
    ctx: "Falar sobre os ritmos dançantes que embalam os clubes exclusivos na orla marítima e a animação do público nas pistas."
  },
  {
    tema: "Bancada de Modificação de Equipamentos",
    t: "Ajustando Miras e Acessórios para o Melhor Rendimento",
    ideia: "Como personalizar equipamentos para missões de ação rápida.",
    ctx: "Discutir a montagem de lanternas para missões noturnas, empunhaduras ergonômicas e pinturas camufladas exclusivas."
  },
  {
    tema: "Transporte Público Elevado",
    t: "Passeando pelo Monotrilho de Vice City em Primeira Pessoa",
    ideia: "Usar o sistema de trens suspensos para admirar o horizonte urbano sem trânsito.",
    ctx: "Mostrar como o transporte público elevado oferece um ponto de vista panorâmico único para gravar clipes e observar a cidade."
  },
  {
    tema: "Longevidade e Atualizações Futuras",
    t: "Por Que GTA 6 Vai Continuar em Alta pelos Próximos 10 Anos?",
    ideia: "O planejamento de longo prazo de novidades, eventos e expansões contínuas.",
    ctx: "Analisar o modelo de atualizações sazonais, festivais dentro do jogo e suporte a comunidades de criadores."
  },
  {
    tema: "Impacto no Cenário Gamer",
    t: "O Maior Lançamento da História do Entretenimento Digital",
    ideia: "Como o jogo quebra recordes de visualizações e engajamento global.",
    ctx: "Comentar sobre a comoção nas redes sociais, maratonas de streamers e o impacto positivo na indústria de criadores de conteúdo para Shorts."
  },
  {
    tema: "A Primeira Entrada em Vice City",
    t: "O Momento em Que a Tela de Início de GTA 6 Carregar",
    ideia: "A emoção de vivenciar o primeiro pôr do sol na cidade mais famosa dos games.",
    ctx: "Conectar com a comunidade sobre a magia de ligar o console, ligar o som do carro pela primeira vez e começar a produzir vídeos memoráveis."
  }
];

export const CAPTIONS: string[] = [
  "Será que a física da água e do vento em Vice City vai superar Red Dead Redemption 2? #GTA6 #RockstarGames #GamerBrasil #Gaming",
  "O mapa de Leonida promete ser o mais denso da história dos games de mundo aberto. #GTA6 #MundoAberto #GeekBrasil #GTA",
  "Jason e Lucia: a dinâmica inspirada nos clássicos duetos vai redefinir narrativas em jogos. #GTA6 #HistóriaGamer #LuciaGTA6 #RockstarGames",
  "Cada frame do trailer esconde segredos que a comunidade ainda está tentando desvendar. #GTA6Trailer #EasterEggs #SegredosGamer #GTA6",
  "Os interiores acessíveis em Vice City prometem acabar de vez com prédios vazios. #GTA6 #GameplayGTA #GamerLife #RockstarGames",
  "A inteligência artificial dos pedestres parece estar anos-luz à frente de qualquer concorrente. #GTA6 #GamingTech #IAGamers #GTA",
  "Vice City reimaginada na nona geração é tudo o que a comunidade gamer sempre sonhou. #ViceCity #GTA6 #PlayStation5 #XboxSeriesX",
  "As redes sociais fictícias dentro do jogo prometem satirizar o mundo moderno com maestria. #GTA6 #CulturaGamer #SatiraGamer #RockstarGames",
  "A densidade do trânsito em horários de pico vai transformar a direção em um desafio real. #GTA6 #Leonida #GamerBrasil #GTAOnline",
  "O nível de personalização de carros em GTA 6 deve quebrar todos os recordes da franquia. #GTA6 #Customizacao #GamerBR #RockstarGames",
  "Mais de uma década esperando pelo retorno a Vice City: a expectativa está no teto! #GTA6 #NostalgiaGamer #VícioGamer #GTA",
  "O ecossistema dos pântanos de Leonida vai colocar muito jogo de exploração no chinelo. #GTA6 #MundoAberto #VidaSelvagem #GeekGaming",
  "O motor gráfico RAGE 9 está pronto para redefinir o que chamamos de nova geração. #GTA6 #RAGE9 #GraficosUltra #GamerLife",
  "Pequenos detalhes nos pedestres mostram como o ecossistema urbano de GTA 6 será vivo. #GTA6 #DetalhesGamer #RockstarGames #GTA",
  "Você prefere explorar a cidade em missões com Jason ou com a Lucia? #GTA6 #Protagonistas #HistóriaGamer #GamerBrasil",
  "A física de deformação dos carros em GTA 6 promete ser a mais realista já feita. #GTA6 #FisicaGamer #Gaming #RockstarGames",
  "O mapa de Leonida vai muito além da praia: manguezais, cidades vizinhas e rodovias infinitas. #GTA6 #Exploracao #MundoGamer #ViceCity",
  "Como a Rockstar vai equilibrar realismo e diversão fluida no gameplay de ação? #GTA6 #Gameplay #AcaoGamer #RockstarGames",
  "A quantidade de interiores exploráveis em GTA 6 vai mudar o padrão da indústria. #GTA6 #GamerBrasil #Leonida #GTA",
  "As teorias sobre o passado dos protagonistas fazem cada vez mais sentido na comunidade. #GTA6 #TeoriasGamer #LoreGamer #GTA6Teoria",
  "O impacto cultural do lançamento de GTA 6 vai transcender o mundo dos videogames. #GTA6 #CulturaPop #FenomenoGamer #RockstarGames",
  "As reações dinâmicas da polícia prometem perseguições muito mais táticas e imprevisíveis. #GTA6 #PoliciaGTA #Perseguicao #GamerBR",
  "Vice City à noite com iluminação neon promete ser o visual mais deslumbrante dos games. #GTA6 #RayTracing #NextGenGaming #ViceCity",
  "As estações de rádio de GTA 6 têm o poder de ditar as tendências musicais dos próximos anos. #GTA6 #TrilhaSonora #MusicaGamer #RockstarGames",
  "Será que veremos conexões e homenagens aos personagens marcantes de GTA 5 em Leonida? #GTA6 #ConexoesGTA #LoreGTA #GamerLife",
  "A iluminação volumétrica e os reflexos em poças mostram a força bruta da nova engine. #GTA6 #TecnologiaGamer #RayTracing #GTA",
  "A escala vertical dos arranha-céus de Vice City promete vistas panorâmicas espetaculares. #GTA6 #Leonida #AçãoGamer #RockstarGames",
  "Os pântanos de Leonida com lama fofa vão testar qualquer veículo com tração integral. #GTA6 #OffRoad #Exploracao #GamerBrasil",
  "A evolução gráfica entre GTA 5 e GTA 6 prova o salto brutal de dez anos de tecnologia. #GTA6 #EvolucaoGamer #ComparativoGamer #GTA5vsGTA6",
  "Nenhum estúdio no planeta cria mundos abertos tão densos e orgânicos quanto a Rockstar. #GTA6 #RockstarGames #MundoAberto #GamerBR",
  "O sistema de planejamento de missões promete ser muito mais livre e sem roteiros fixos. #GTA6 #HeistGTA #EstrategiaGamer #GTA",
  "Você pretende jogar em modo desempenho a 60 FPS ou fidelidade gráfica máxima em GTA 6? #GTA6 #PlayStation5 #XboxSeriesX #DesempenhoGamer",
  "O humor ácido e as paródias de marcas prometem ser mais afiadas do que nunca em Leonida. #GTA6 #HumorGamer #GeekBrasil #RockstarGames",
  "A movimentação corporal e a física dos tecidos em GTA 6 mostram um padrão inacreditável. #GTA6 #FisicaGamer #Animacao3D #GamerLife",
  "As teorias da comunidade sobre o tamanho exato do mapa não param de crescer na internet. #GTA6 #MapaGTA6 #TeoriaGamer #Leonida",
  "Será que teremos ilhas paradisíacas secretas acessíveis por barco no mapa final? #GTA6 #CaribeGTA #SegredosGamer #ViceCity",
  "Lucia assumindo o protagonismo nas cenas já conquistou um espaço histórico nos games. #GTA6 #LuciaGTA #ProtagonistaGamer #RockstarGames",
  "Os efeitos climáticos dinâmicos com tempestades tropicais vão transformar a jogabilidade. #GTA6 #ClimaDinamico #Gameplay #GamerBrasil",
  "Nenhum anúncio na história do entretenimento parou a internet como o de GTA 6. #GTA6 #TrailerGTA6 #HypeGamer #RecordeGamer",
  "A reação dos cidadãos às manobras velozes em Vice City promete um realismo impressionante. #GTA6 #IAGamer #RealismoGamer #GTA",
  "O suporte às armas visíveis no coldre mantém o nível de fidelidade inaugurado em RDR2. #GTA6 #ArmamentoGamer #Realismo #RockstarGames",
  "A integração da vida noturna de Vice City com boates e corridas de rua será inesquecível. #GTA6 #VidaNoturna #CorridasGamer #ViceCity",
  "A Rockstar Games mais uma vez ditando as regras do que significa um jogo de mundo aberto. #GTA6 #PadraoRockstar #Gaming #GeekBrasil",
  "Detalhes como cabelo ao vento e reflexo nos óculos mostram o capricho da equipe. #GTA6 #FidelidadeVisual #GraficosNextGen #GamerLife",
  "O tráfego de lanchas e aeronaves sobre a costa de Leonida trará uma imersão nunca vista. #GTA6 #ImersaoGamer #AviaçãoGTA #GamerBR",
  "Você prefere explorar o mapa a pé para ver os detalhes ou sair acelerando supercarros? #GTA6 #ExploracaoGamer #Supercarros #GTA",
  "A paródia das transmissões ao vivo de influenciadores promete render momentos hilários. #GTA6 #SatiraModerna #CulturaPop #RockstarGames",
  "Os eventos aleatórios pelo mapa prometem superar os encontros mais curiosos de RDR2. #GTA6 #EventosAleatorios #SegredosGamer #Leonida",
  "A física dos pneus e a aderência na areia das praias de Vice City parecem absurdamente reais. #GTA6 #FisicaAutomotiva #GamerBrasil #Gaming",
  "Se prepare: os primeiros dias de lançamento de GTA 6 vão parar a rotina dos gamers. #GTA6 #LançamentoGamer #HypeAbsoluto #GamerLife",
  "Como a Rockstar vai estruturar as opções de compra de imóveis no modo história? #GTA6 #EconomiaGamer #RPGMechanics #GTA",
  "O design sonoro de Vice City, de motores roncando a conversas nas calçadas, será imersivo. #GTA6 #AudioDesign #ImersaoTotal #RockstarGames",
  "O visual neon dos hotéis à beira-mar traz de volta toda a magia que consagrou Vice City. #ViceCity #GTA6 #NeonVibes #NostalgiaGamer",
  "A quantidade de mistérios e enigmas escondidos em Leonida vai render meses de caçada. #GTA6 #MisteriosGamer #LendasUrbanas #EasterEggs",
  "Os detalhes nas expressões faciais de Lucia mostram a força do novo sistema de captura. #GTA6 #CapturaFacial #AtuaçãoGamer #LuciaGTA",
  "Quantas horas de exploração você acha que serão necessárias para fechar 100% de GTA 6? #GTA6 #PlatinandoGamer #Completista #GamerBR",
  "O nível de desgaste visual dos carros e das roupas promete elevar a imersão de GTA 6. #GTA6 #RealismoGamer #GamingCommunity #RockstarGames",
  "A espera de dez anos valeu a pena: o salto tecnológico de GTA 6 justifica cada segundo. #GTA6 #DesenvolvimentoGamer #TecnologiaGamer #GTA",
  "A relação entre Jason e Lucia promete trazer escolhas envolventes para a trama principal. #GTA6 #NarrativaGamer #EscolhasGamer #HistóriaGTA",
  "Vice City está viva: cada bairro carrega uma cultura, visual e vibe sonora totalmente únicos. #GTA6 #ViceCity #BairrosGTA #GeekBrasil",
  "As perseguições aquáticas através dos canais de Leonida prometem momentos cinematográficos. #GTA6 #AçãoGamer #GameplayGTA #RockstarGames",
  "A atenção aos detalhes no interior dos veículos atinge um patamar nunca antes visto. #GTA6 #CockpitGamer #CarrosDeLuxo #Gaming",
  "A iluminação dos faróis cortando a neblina nos manguezais cria uma atmosfera espetacular. #GTA6 #AtmosferaGamer #GraficosNextGen #Leonida",
  "Os reflexos no asfalto molhado de Ocean Drive dispensam qualquer modificação visual. #GTA6 #GraficosIncríveis #RayTracing #PlayStation5",
  "O horizonte de Vice City ao pôr do sol é uma das imagens mais marcantes já vistas nos games. #GTA6 #PaisagensGamer #GraficosUltra #ViceCity",
  "A animação de corrida e escalada de muros traz fluidez impressionante aos combates urbanos. #GTA6 #AnimacoesGamer #MovimentacaoGTA #GamerBrasil",
  "As lanchas cortando as marolas com hidrodinâmica realista mostram a força do novo motor. #GTA6 #FisicaAquatica #Gameplay #GamerBR",
  "O contraste entre os iates luxuosos e as áreas rurais esquecidas resume a essência do mapa. #GTA6 #Leonida #ContrasteSocial #CulturaGamer",
  "A física da fumaça dos pneus cantando no asfalto quente é pura adrenalina para quem ama carros. #GTA6 #DriftGamer #Burnout #ViceCity",
  "O retorno triunfal da franquia mais influente da história vai movimentar toda a internet. #GTA6 #IndustriaDosGames #ImpactoCultural #GTA",
  "Como será o sistema de personalização estética de armas e equipamentos táticos? #GTA6 #Gunsmith #CustomizacaoArmas #RockstarGames",
  "A inteligência dos motoristas nas rodovias vai reagir a buzinas e manobras arriscadas. #GTA6 #TransitoCaotico #RealismoUrbano #GamerBR",
  "Os sons dos motores esportivos foram captados com precisão cirúrgica de microfones reais. #GTA6 #SoundDesign #RoncoDoMotor #GamerLife",
  "A sensação de pilotar motos esportivas pelas pontes suspensas de Vice City será incomparável. #GTA6 #Supermotos #VelocidadeMaxima #GamerBrasil",
  "A comunidade de criadores de conteúdo para Shorts vai explodir no lançamento de GTA 6! #GTA6 #ShortsBrasil #CriadoresDeConteudo #NoobToon",
  "Prepare o fone de ouvido: a trilha sonora com áudio 3D vai colocar você dentro do jogo. #GTA6 #AudioImersivo #FonesGamer #GamingNews",
  "Vice City nos espera com suas luzes de neon, praias tropicais e o melhor playground dos games. #GTA6 #ViceCityCalling #MundoAberto #GamerBrasil",
  "Qual o primeiro lugar do mapa de Leonida que você vai visitar assim que assumir o controle? #GTA6 #PrimeirosPassos #LiberdadeGamer #RockstarGames",
  "A densidade de pássaros e fauna marinha no litoral transforma cada pôr do sol em pintura. #GTA6 #FaunaGamer #NaturezaVirtual #NextGen",
  "A espera foi longa, mas cada segundo vai valer a pena quando a tela inicial subir. #GTA6 #FimDaEspera #MaiorLancamento #RockstarGames",
  "O nível de reflexo nos prédios espelhados acompanha o trânsito em tempo real sem lentidão. #GTA6 #RayTracingReal #GraficosFuturistas #ViceCity",
  "Compre seus primeiros veículos esportivos e domine os rachas noturnos pelas avenidas. #GTA6 #Supercarros #DesignAutomotivo #GamerBR",
  "A tempestade tropical caindo sobre as palmeiras é um dos visuais mais belos dos games. #GTA6 #TempestadeTropical #ClimaRealista #ViceCity",
  "As missões paralelas de personagens secundários prometem momentos hilários e inusitados. #GTA6 #EstranhosELoucos #ComediaGamer #GTA",
  "A distância de visão do topo dos arranha-céus alcança as ilhas vizinhas sem névoa. #GTA6 #DrawDistance #PerformanceGamer #NextGen",
  "A dinâmica de parceria e confiança entre os protagonistas ditará o ritmo da trama. #GTA6 #DuplaDinamica #ProtagonistasGTA #GamerBrasil",
  "O modelo de tiro responsivo com cobertura inteligente valoriza a estratégia do jogador. #GTA6 #CoverShooter #CombateTatico #GamerLife",
  "Como será o sistema de esconderijos e apartamentos com vista panorâmica para o oceano? #GTA6 #ImoveisGTA #MansaoGamer #GTA",
  "A deformação tridimensional dos pneus e rastro na lama mostram o foco no microdetalhe. #GTA6 #MicroDetalhes #EngineRAGE #GamingBR",
  "As praias de Vice City repletas de banhistas praticando esportes entregam imersão pura. #GTA6 #PraiaDeViceCity #GraficosSurreais #ViceCity",
  "O que esperar do mapa de Leonida em termos de pistas de pouso e aviação leve? #GTA6 #TamanhoDoMapa #AviacaoGamer #GTA",
  "A paródia de programas de TV e séries dentro dos quartos de hotel continua brilhante. #GTA6 #TelevisaoGTA #SatiraCultura #RockstarGames",
  "A sensação de liberdade pelas rodovias interestaduais de Leonida é incomparável. #GTA6 #FugaPolicial #VelocidadeGamer #GTA",
  "O retorno das academias de treino e pontaria para aprimorar os atributos dos heróis. #GTA6 #EstandeDeTiro #HabilidadesGamer #RockstarGames",
  "O carisma dos personagens promete dominar os melhores memes e Shorts das redes sociais. #GTA6 #PersonagensMarcantes #MemesGeek #GamerBR",
  "A física de choque contra barreiras e postes atinge um nível impressionante de destruição. #GTA6 #FisicaRealista #ImpactoUrbano #GamerLife",
  "A paleta de cores vibrante de Vice City é um alívio visual diante de tantos jogos escuros. #GTA6 #DirecaoDeArte #CoresVibrantes #GamerBrasil",
  "O desafio de pilotar helicópteros no meio de rajadas de vento promete muita emoção. #GTA6 #HelicopterosGTA #DesafioAereo #RockstarGames",
  "A contagem regressiva para o lançamento é o momento mais esperado da comunidade geek. #GTA6 #HypeMundial #ComunidadeGamer #GeekBR",
  "Seja bem-vindo a Vice City: o palco definitivo para o seu canal decolar no YouTube! #GTA6 #ViceCity #NoobToon #YouTubeShorts"
];

// Ensure at least 200 items by filling with procedural creator-focused captions
while (CAPTIONS.length < 200) {
  const i = CAPTIONS.length + 1;
  CAPTIONS.push(
    `Dica ${i} para criadores de Shorts: títulos curiosos e os primeiros 3 segundos decidem o algoritmo! #GTA6 #CriadoresDeConteudo #YouTubeShorts #GamingBrasil`
  );
}
