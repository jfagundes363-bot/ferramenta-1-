import { FUNNEL_PHASES, PLATFORM_RULES } from './noobToonData';

export interface MentorContext {
  userName?: string;
  stepTitle?: string;
  stepSummary?: string;
  completedCount?: number;
  totalSteps?: number;
  completedStepIds?: string[];
  currentTab?: string;
}

const TAB_LABELS: Record<string, string> = {
  home: 'Inicial',
  rules: 'Restrições e Regras',
  play: 'Vídeos (Dê o Play)',
  titles: 'Títulos & Legendas',
  ideas: 'Ideias de Vídeos',
  settings: 'Configurações',
};

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export function buildMentorSystemInstruction(ctx: MentorContext): string {
  const phasesSummary = FUNNEL_PHASES.map(
    (phase) =>
      `${phase.title} (${phase.subtitle}):\n` +
      phase.steps.map((s) => `  - ${s.title}: ${s.description}`).join('\n')
  ).join('\n\n');

  const rulesSummary = PLATFORM_RULES.map(
    (r) =>
      `- Regra ${r.id} (${r.title}): NÃO fazer: ${r.dont}` +
      (r.doRight ? ` | Como fazer certo: ${r.doRight}` : '')
  ).join('\n');

  const completedList =
    ctx.completedStepIds && ctx.completedStepIds.length > 0
      ? ctx.completedStepIds.join(', ')
      : 'nenhuma ainda';

  const currentTabName = TAB_LABELS[ctx.currentTab || 'home'] || 'Inicial';

  return `Você é o Mentor Noob Tom, o especialista oficial integrado à plataforma Noob Toon.
Sua missão é responder qualquer dúvida do aluno sobre:
1) A ferramenta Noob Toon (todas as abas, funções, botões e organização);
2) Todas as etapas e fases da trilha de criação e configuração do canal;
3) Como baixar materiais, escolher títulos/ideias e postar vídeos (YouTube Shorts, TikTok e Instagram Reels);
4) Regras de proteção contra spam, shadowban, direitos autorais, strikes e boas práticas do YouTube Studio.

Contexto atual do aluno:
- Nome: ${ctx.userName || 'Criador'}
- Aba aberta: ${currentTabName}
- Progresso na trilha: ${ctx.completedCount ?? 0} de ${ctx.totalSteps ?? 9} passos concluídos (concluídos: ${completedList})
- Próximo passo pendente: "${ctx.stepTitle || 'Passo 1.1: Criar uma Conta Google exclusiva'}" — ${ctx.stepSummary || ''}

Estrutura completa da ferramenta Noob Toon:
- Aba "Inicial": Exibe o progresso geral, busca de passos, a trilha cronológica com 3 Fases e 9 Passos e este chat com o Mentor Noob Tom.
- Aba "Restrições e Regras": Regras de ouro para evitar bloqueios, shadowban e desmonetização.
- Aba "Vídeos" (Dê o Play): Galeria com os cards dos criadores (Davy Jones, Paulinho Loko, Coringa, Games Edu, Alanzoka, BRKsEDU, Bistecone, Peter Jordan, IShow Speed, Cellbit, Nobru, LipaoGamer e Gabepeixe) e o card central "Acesse conteúdos de todos os criadores aqui" para acesso aos materiais.
- Aba "Títulos": 200 legendas e títulos prontos com hashtags otimizadas e botão de copiar com 1 clique.
- Aba "Ideias": 50 ideias completas de vídeos (tema, título, ideia e roteiro/contexto) prontas para copiar.
- Aba "Configurações": Permite atualizar o nome exibido, alternar entre tema escuro e claro, ou zerar o progresso da trilha.

Trilha completa de Fases e Etapas:
${phasesSummary}

Regras de Ouro e Restrições da plataforma:
${rulesSummary}

Diretrizes de resposta:
- Responda sempre em português do Brasil, de forma acolhedora, prática, objetiva e fácil de seguir (tanto para PC quanto para celular).
- Se o usuário perguntar sobre qualquer etapa (ex.: 1.1, 2.3, 3.3), sobre como postar, sobre horários, sobre restrições ou sobre qualquer aba da ferramenta, explique passo a passo com clareza.
- Use listas curtas numeradas ou com marcadores (•). Pode usar **negrito** apenas em termos-chave.
- Mantenha as respostas claras e concisas (até ~250 palavras).
- Se perguntarem algo fora das diretrizes fixas que muda no YouTube (ex.: políticas monetárias atualizadas), oriente consultar também a Central de Ajuda oficial do YouTube Studio.`;
}

export function buildMentorLocalReply(message: string, ctx: MentorContext): string {
  const q = normalizeText(message);
  const name = ctx.userName?.trim() || 'Criador';
  const total = ctx.totalSteps ?? 9;
  const done = ctx.completedCount ?? 0;

  // 1. Direct match on a specific step code (1.1 .. 3.4)
  for (const phase of FUNNEL_PHASES) {
    for (const step of phase.steps) {
      const codeMatch = q.includes(step.code) || q.includes(`passo ${step.code}`) || q.includes(`etapa ${step.code}`);
      if (codeMatch) {
        return [
          `Olá, ${name}! Sobre o **${step.title}** (${phase.title}):`,
          '',
          `• **O que fazer:** ${step.description}`,
          step.actionLabel
            ? `• **Atalho na plataforma:** Dentro desse passo na aba Inicial, você encontra o botão **${step.actionLabel}** para ir direto.`
            : '• **Dica:** Após concluir esse passo, marque a caixa **"Marcar como concluído"** no canto inferior direito do card para atualizar seu progresso.',
        ].join('\n');
      }
    }
  }

  // 2. Specific Phase match (fase 1, fase 2, fase 3)
  if (/\b(fase|etapa)\s*1\b/.test(q)) {
    const p = FUNNEL_PHASES[0];
    return [
      `A **${p.title}** prepara a base da sua operação:`,
      '',
      `1. **${p.steps[0].title}:** ${p.steps[0].description}`,
      `2. **${p.steps[1].title}:** ${p.steps[1].description}`,
      '',
      'Dica: Assim que marcar os 2 passos como concluídos, a Fase 2 abre automaticamente.',
    ].join('\n');
  }
  if (/\b(fase|etapa)\s*2\b/.test(q)) {
    const p = FUNNEL_PHASES[1];
    return [
      `A **${p.title}** blinda o canal e configura o algoritmo:`,
      '',
      `1. **${p.steps[0].title}:** ${p.steps[0].description}`,
      `2. **${p.steps[1].title}:** ${p.steps[1].description}`,
      `3. **${p.steps[2].title}:** ${p.steps[2].description}`,
    ].join('\n');
  }
  if (/\b(fase|etapa)\s*3\b/.test(q)) {
    const p = FUNNEL_PHASES[2];
    return [
      `A **${p.title}** é a sua rotina diária de postagens:`,
      '',
      `1. **Passo 3.1:** Pegue o vídeo na aba **Vídeos** e copie a legenda/título na aba **Títulos**.`,
      `2. **Passo 3.2:** No YouTube, clique em **+** (Criar) > **Enviar vídeos**.`,
      `3. **Passo 3.3:** Título até 60 caracteres, descrição com 3 a 5 hashtags, marque **"Não é conteúdo para crianças"** e publique (12h, 18h ou 21h).`,
      `4. **Passo 3.4:** Reposte o mesmo arquivo .mp4 no **TikTok** e no **Instagram Reels**.`,
    ].join('\n');
  }

  // 3. How to post / upload / schedule / Shorts / TikTok / Reels
  if (
    /(postar|publicar|enviar|upload|subir|rotina|horario|pico|crianca|shorts|tiktok|instagram|reels|multiplataforma)/.test(
      q
    )
  ) {
    return [
      `Veja o passo a passo completo de **como postar seus vídeos** sem erro, ${name}:`,
      '',
      '1. **Separe o material (Passo 3.1):** Acesse a aba **Vídeos** para pegar o arquivo e a aba **Títulos** para copiar um título e hashtags prontos.',
      '2. **Envie no YouTube (Passo 3.2):** No YouTube (PC ou celular), toque no ícone **"+" (Criar)** > **"Enviar vídeos"** e escolha o arquivo .mp4.',
      '3. **Configure antes de publicar (Passo 3.3):**',
      '   • Use um **título de até 60 caracteres** (para não cortar no celular).',
      '   • Cole a descrição com **3 a 5 hashtags** relacionadas ao vídeo.',
      '   • Marque obrigatoriamente **"Não é conteúdo para crianças"**.',
      '   • Publique ou programe para horários de pico: **12h, 18h ou 21h**.',
      '4. **Frequência segura:** Em canal novo, poste de **1 a 3 vídeos por dia** para evitar bloqueio por spam.',
      '5. **Multiplique alcance (Passo 3.4):** Poste o mesmo vídeo limpo (sem marca d’água) também no **TikTok** e no **Instagram Reels**.',
    ].join('\n');
  }

  // 4. Restrictions, rules, spam, copyright, watermark, strikes, links
  if (
    /(regra|restric|limite|quantos videos|spam|ban|bloque|shadowban|direito|autoral|copyright|reutilizado|marca d|agua|kwai|strike|desmonetiz|link na descricao|afiliado)/.test(
      q
    )
  ) {
    return [
      `Aqui estão as **Regras de Ouro** da plataforma para proteger seu canal (você também pode consultá-las na aba **Restrições e Regras**):`,
      '',
      '• **Limite diário (canal novo):** Nunca poste 15 a 30 vídeos de uma vez. Comece com **1 a 3 vídeos por dia** e aumente aos poucos após verificar os Recursos Avançados.',
      '• **Sem marcas d’água:** Nunca baixe vídeo com logo do TikTok ou Kwai para postar no YouTube Shorts ou Reels — use sempre arquivos limpos.',
      '• **Direitos autorais:** Use vídeos editados com cortes dinâmicos, legendas e enquadramento próprios (camada de transformação), sem músicas comerciais proibidas.',
      '• **Hashtags:** Use apenas **3 a 5 hashtags** específicas do tema (nada de colocar 20 hashtags ou tags sem relação).',
      '• **Links clicáveis:** Links na descrição de Shorts só funcionam depois de liberar os **Recursos Avançados** no YouTube Studio (ou use o link na bio / Vídeo Relacionado).',
      '• **Diretrizes da Comunidade:** Evite conteúdo sensível ou promessas enganosas (3 Strikes em 90 dias encerram o canal).',
    ].join('\n');
  }

  // 5. Account creation, Gmail, YouTube Studio, branding, banner, photo, country, keywords, SMS/verification
  if (
    /(gmail|conta google|criar canal|handle|@|branding|banner|foto|perfil|2048|98|descricao do canal|pais|brasil|palavra|algoritmo|sms|telefone|recurso|intermediario|avancado|verific|studio)/.test(
      q
    )
  ) {
    return [
      `Sobre a **criação e blindagem no YouTube Studio** (Fases 1 e 2):`,
      '',
      '• **Conta exclusiva (Passo 1.1):** Crie um Gmail dedicado só para o canal.',
      '• **Canal e @handle (Passo 1.2):** No YouTube, clique na foto de perfil > **"Criar um canal"**, escolha um nome alinhado ao nicho e defina um **@handle** único.',
      '• **Identidade visual (Passo 2.1):** Em YouTube Studio > Personalização > Branding, coloque foto de perfil (mínimo **98x98px**), banner (**2048x1152px**) e descrição com palavras-chave.',
      '• **Algoritmo e País (Passo 2.2):** Em Configurações > Canal > Informações básicas, selecione **Brasil** (ou país do público) e adicione **5 a 10 palavras-chave** do nicho.',
      '• **Recursos Avançados (Passo 2.3):** Em Configurações > Canal > Qualificação para recursos, valide o telefone via **SMS** (Intermediários) e faça a verificação por **vídeo ou documento** (Avançados) para liberar links e maior limite diário.',
    ].join('\n');
  }

  // 6. Videos / Play / Creators tab
  if (/(play|criador|baixar|download|davy|paulinho|coringa|games edu|alanzoka|brksedu|bistecone|peter|speed|cellbit|nobru|lipao|gabepeixe|videos)/.test(q)) {
    return [
      `Na aba **Vídeos** (ícone Play no menu), ficam organizados os cards dos **13 criadores** (Davy Jones, Paulinho Loko, Coringa, Games Edu, Alanzoka, BRKsEDU, Bistecone, Peter Jordan, IShow Speed, Cellbit, Nobru, LipaoGamer e Gabepeixe) e, logo abaixo, o card central **"Acesse conteúdos de todos os criadores aqui"**.`,
      '',
      '• Assim que os links de acesso forem liberados nos botões, basta clicar no criador desejado para baixar o material.',
      '• Depois de baixar, combine o vídeo com uma legenda da aba **Títulos** (ou roteiro da aba **Ideias**) e siga a Fase 3 para publicar.',
    ].join('\n');
  }

  // 7. Titles, captions, hashtags, ideas
  if (/(titulo|legenda|hashtag|60 caracteres|ideia|roteiro|copiar)/.test(q)) {
    return [
      `Sobre **Títulos, Legendas e Ideias** na ferramenta:`,
      '',
      '• **Aba Títulos:** Traz **200 legendas prontas** com hashtags otimizadas e botão de copiar com 1 clique. Lembre-se de manter o título do vídeo com **até 60 caracteres** para não cortar no celular e usar de **3 a 5 hashtags**.',
      '• **Aba Ideias:** Traz **50 ideias completas** com tema, título sugerido, conceito e roteiro/contexto para copiar e gravar ou adaptar.',
    ].join('\n');
  }

  // 8. Tool navigation, tabs, settings, progress
  if (/(ferramenta|plataforma|como funciona|aba|menu|configurac|tema|claro|escuro|zerar|reset|progresso|nome)/.test(q)) {
    return [
      `A ferramenta **Noob Toon** é organizada em 6 abas (no menu lateral esquerdo no PC ou na barra inferior no celular):`,
      '',
      '1. **Inicial:** Trilha passo a passo com 3 Fases (9 passos), barra de progresso, busca rápida e este chat do Mentor.',
      '2. **Restrições e Regras:** Guia rápido com o que NÃO fazer e o jeito certo para proteger seu canal.',
      '3. **Vídeos:** Cards dos criadores e acesso centralizado aos conteúdos.',
      '4. **Títulos:** 200 legendas e hashtags prontas para copiar.',
      '5. **Ideias:** 50 ideias de vídeos com título e roteiro.',
      '6. **Configurações:** Trocar seu nome, alternar tema escuro/claro ou zerar o progresso da trilha.',
      '',
      `Seu progresso atual está em **${done} de ${total} passos concluídos**.`,
    ].join('\n');
  }

  // 9. General / "what do I do now?" / fallback with full helpful guidance
  return [
    `Olá, ${name}! Posso te ajudar com qualquer dúvida sobre a ferramenta **Noob Toon**, as **etapas da trilha**, **como postar** ou as **regras das plataformas**.`,
    '',
    `• **Seu progresso atual:** ${done} de ${total} passos concluídos.`,
    ctx.stepTitle
      ? `• **Próximo passo recomendado:** ${ctx.stepTitle} — ${ctx.stepSummary || ''}`
      : '• Você já concluiu todas as etapas! Siga para a aba **Vídeos** e **Títulos** para manter a rotina diária.',
    '',
    'Se quiser, me pergunte algo específico como: *"Como postar no Shorts?"*, *"Como configurar o passo 2.3?"*, *"Quantos vídeos posso postar por dia?"* ou *"Onde pego os títulos e hashtags?"*.',
  ].join('\n');
}
