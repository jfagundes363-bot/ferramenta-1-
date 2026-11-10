import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API route for AI Mentor
app.post('/api/mentor', async (req, res) => {
  try {
    const { message, history, stepIndex, userName, stepTitle, stepSummary, tasks } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Mensagem vazia' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const isPlaceholder = !apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '';
    if (isPlaceholder) {
      // Fallback response if GEMINI_API_KEY is not configured yet
      return res.json({
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
    return res.json({ text: reply });
  } catch (error: any) {
    console.error('Error in mentor API:', error);
    return res.status(500).json({
      error: 'Erro ao consultar o mentor.',
      text: 'Desculpe, tive uma instabilidade momentânea na conexão. Por favor tente novamente em alguns segundos!'
    });
  }
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
