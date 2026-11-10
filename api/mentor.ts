import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  // Set CORS headers for Vercel
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { message, history, userName, stepTitle, stepSummary, tasks } = req.body || {};

    if (!message) {
      return res.status(400).json({ error: 'Mensagem vazia' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const isPlaceholder = !apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '';
    if (isPlaceholder) {
      return res.status(200).json({
        text: `Olá, ${userName || 'Criador'}! Para a etapa "${stepTitle || 'Atual'}", recomendo focar em dar um passo de cada vez: primeiro conclua o checklist e defina seu público e formato curto. Como posso te apoiar nesta tarefa específica?`
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `Você é o mentor especialista da ferramenta Noob Toon, que guia criadores iniciantes a construírem um canal de sucesso no YouTube do zero, com foco especial em vídeos e Shorts.
Aluno: ${userName || 'Criador'}.
Etapa atual: "${stepTitle || 'Etapa'}" — ${stepSummary || ''}
Tarefas desta etapa: ${(tasks || []).join('; ')}.

Diretrizes:
- Responda sempre em português do Brasil com tom caloroso, prático, encorajador e direto.
- Dê passos acionáveis, exemplos reais e dicas práticas para quem está começando agora com celular ou poucos recursos.
- Mantenha a resposta concisa e bem formatada com listas curtas e negrito nos pontos-chave (máximo ~250 palavras).
- Não invente regras do YouTube; indique a Central de Ajuda oficial do YouTube quando for algo que muda com frequência.`;

    const chatContents = [];
    if (Array.isArray(history)) {
      for (const item of history.slice(-8)) {
        if (item.role === 'user' || item.role === 'bot' || item.role === 'assistant') {
          chatContents.push({
            role: item.role === 'bot' ? 'model' : item.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: item.content || item.text || '' }]
          });
        }
      }
    }
    chatContents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: chatContents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    const reply = response.text || 'Não consegui formular uma resposta no momento. Pode tentar reformular a pergunta?';
    return res.status(200).json({ text: reply });
  } catch (error: any) {
    console.error('Error in mentor API:', error);
    return res.status(500).json({
      error: 'Erro ao consultar o mentor.',
      text: 'Desculpe, tive uma instabilidade momentânea na conexão. Por favor tente novamente em alguns segundos!'
    });
  }
}
