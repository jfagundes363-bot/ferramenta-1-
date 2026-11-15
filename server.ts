import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

import { buildMentorLocalReply, buildMentorSystemInstruction, MentorContext } from './src/data/mentorKnowledge';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API route for AI Mentor
app.post('/api/mentor', async (req, res) => {
  const {
    message,
    history,
    userName,
    stepTitle,
    stepSummary,
    completedCount,
    totalSteps,
    completedStepIds,
    currentTab
  } = req.body || {};

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Mensagem vazia' });
  }

  const mentorCtx: MentorContext = {
    userName,
    stepTitle,
    stepSummary,
    completedCount,
    totalSteps,
    completedStepIds,
    currentTab
  };

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const isPlaceholder = !apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '';
    if (isPlaceholder) {
      return res.json({
        text: buildMentorLocalReply(message, mentorCtx)
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemInstruction = buildMentorSystemInstruction(mentorCtx);

    const chatContents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];
    if (Array.isArray(history)) {
      for (const item of history.slice(-8)) {
        const txt = (item?.content || item?.text || '').trim();
        if (!txt) continue;
        if (item.role === 'user' || item.role === 'bot' || item.role === 'assistant') {
          const role = item.role === 'user' ? 'user' : 'model';
          if (chatContents.length > 0 && chatContents[chatContents.length - 1].role === role) {
            chatContents[chatContents.length - 1].parts[0].text += `\n${txt}`;
          } else {
            chatContents.push({ role, parts: [{ text: txt }] });
          }
        }
      }
    }

    const lastEntry = chatContents[chatContents.length - 1];
    if (!lastEntry || lastEntry.role !== 'user' || lastEntry.parts[0].text !== message.trim()) {
      if (lastEntry && lastEntry.role === 'user') {
        lastEntry.parts[0].text += `\n${message.trim()}`;
      } else {
        chatContents.push({
          role: 'user',
          parts: [{ text: message.trim() }]
        });
      }
    }

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: chatContents,
      config: {
        systemInstruction,
      }
    });

    const reply = response.text?.trim() || buildMentorLocalReply(message, mentorCtx);
    return res.json({ text: reply });
  } catch (error: unknown) {
    console.error('Error in mentor API:', error);
    return res.json({
      text: buildMentorLocalReply(message, mentorCtx)
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
