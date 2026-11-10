import { Stage } from '../types';

export const MODS: Stage[] = [
  {
    t: "Escolha seu nicho",
    s: "Defina o assunto, o público e o nome do seu canal.",
    tasks: ["Escolher o tema", "Definir o nome", "Identificar o público"],
    hints: [
      "Algo que você domina e faria 50 vídeos sobre.",
      "Curto, fácil de falar e de achar na busca.",
      "Idade, interesses e o problema que você resolve."
    ],
    links: [null, null, null],
    chips: [
      "Me ajude a escolher um nicho",
      "Me dê 10 nomes para o meu canal",
      "Quem é o público do meu tema?"
    ]
  },
  {
    t: "Crie seu canal",
    s: "Crie e personalize seu canal no YouTube.",
    tasks: ["Criar o canal", "Adicionar foto e banner", "Escrever a descrição"],
    hints: [
      "No YouTube, clique na sua foto de perfil → Criar um canal.",
      "No YouTube Studio: Personalização → Perfil.",
      "O que o canal ensina, para quem e quando sai vídeo novo."
    ],
    links: [
      { href: "https://www.youtube.com", label: "YouTube" },
      { href: "https://studio.youtube.com", label: "Studio" },
      null
    ],
    chips: [
      "Passo a passo para criar o canal",
      "Escreva a descrição do meu canal",
      "Preciso de uma Conta Google?"
    ]
  },
  {
    t: "Prepare seu conteúdo",
    s: "Planeje seu primeiro vídeo.",
    tasks: ["Escolher o tema do vídeo", "Criar título e roteiro", "Separar os materiais necessários"],
    hints: [
      "Uma dúvida real que o seu público pesquisa.",
      "Gancho forte nos primeiros 30 segundos.",
      "Celular, luz, áudio e o que vai aparecer no vídeo."
    ],
    links: [null, null, null],
    chips: [
      "Me dê 10 ideias para o primeiro vídeo",
      "Escreva um roteiro curto para mim",
      "O que preciso para gravar só com o celular?"
    ]
  },
  {
    t: "Grave e edite",
    s: "Produza seu vídeo com ferramentas simples.",
    tasks: ["Gravar o conteúdo", "Editar o vídeo", "Criar a thumbnail"],
    hints: [
      "De frente para a luz, celular na altura dos olhos.",
      "Corte pausas e erros. O CapCut resolve.",
      "Um foco, até 4 palavras, contraste alto."
    ],
    links: [null, null, null],
    chips: [
      "Tenho vergonha de gravar. Como começar?",
      "Passo a passo de edição no CapCut",
      "O que colocar na thumbnail?"
    ]
  },
  {
    t: "Publique seu vídeo",
    s: "Envie e publique seu primeiro vídeo no YouTube.",
    tasks: ["Enviar o vídeo", "Adicionar título e descrição", "Publicar"],
    hints: [
      "YouTube Studio → Criar → Enviar vídeos.",
      "Palavra-chave no título e nas primeiras linhas.",
      "Visibilidade: Público, ou Programar para outra data."
    ],
    links: [
      { href: "https://studio.youtube.com", label: "Studio" },
      null,
      null
    ],
    chips: [
      "Escreva a descrição do meu vídeo",
      "Qual o melhor horário para postar?",
      "Meu vídeo é conteúdo para crianças?"
    ]
  },
  {
    t: "Cresça e monetize",
    s: "Acompanhe resultados e desenvolva seu canal.",
    tasks: ["Analisar visualizações", "Planejar novos conteúdos", "Conhecer as opções de monetização"],
    hints: [
      "Studio → Estatísticas: veja cliques e retenção.",
      "Repita o que funcionou e ajuste o resto.",
      "Programa de Parcerias, afiliados e publis."
    ],
    links: [
      { href: "https://studio.youtube.com", label: "Studio" },
      null,
      { href: "https://support.google.com/youtube/answer/72851", label: "Requisitos" }
    ],
    chips: [
      "Meu vídeo teve poucas visualizações. E agora?",
      "Monte um calendário de 30 dias",
      "Quais os requisitos para monetizar?"
    ]
  }
];
