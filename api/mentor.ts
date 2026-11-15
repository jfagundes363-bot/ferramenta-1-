import { GoogleGenAI } from '@google/genai';
import { buildMentorLocalReply, buildMentorSystemInstruction, MentorContext } from '../src/data/mentorKnowledge';

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
      return res.status(200).json({
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
    return res.status(200).json({ text: reply });
  } catch (error: unknown) {
    console.error('Error in mentor API:', error);
    return res.status(200).json({
      text: buildMentorLocalReply(message, mentorCtx)
    });
  }
}
