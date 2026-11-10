import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, 
  PlayCircle, 
  FileText, 
  Settings, 
  Search, 
  Check, 
  ArrowRight, 
  ExternalLink, 
  Copy, 
  ChevronDown, 
  Send, 
  Sparkles,
  Bot,
  User,
  RotateCcw,
  Sun,
  Moon,
  AlertCircle
} from 'lucide-react';
import { MODS, CAPTIONS, IDEAS } from './data/noobToonData';
import ShortVideoPlayer, { VideoSlotData } from './components/ShortVideoPlayer';

const VIDEO_SLOTS: VideoSlotData[] = [
  { 
    id: 1, 
    title: 'Short 01 · GTA 6', 
    status: 'ready', 
    videoUrl: 'https://i.imgur.com/i3uYK0q.mp4', 
    posterUrl: '/assets/slot1_poster.jpg',
  },
  { 
    id: 2, 
    title: 'Short 02 · GTA 6', 
    status: 'ready', 
    videoUrl: 'https://i.imgur.com/ZW1BKV1.mp4', 
    posterUrl: '/assets/slot2_poster.jpg',
  },
  { 
    id: 3, 
    title: 'Short 03 · GTA 6', 
    status: 'ready', 
    videoUrl: 'https://i.imgur.com/utCxZV4.mp4', 
    posterUrl: '/assets/slot3_poster.jpg',
  },
  { 
    id: 4, 
    title: 'Short 04 · GTA 6', 
    status: 'ready', 
    videoUrl: 'https://i.imgur.com/ixDjSCs.mp4', 
    posterUrl: '/assets/slot4_poster.jpg',
  },
  { 
    id: 5, 
    title: 'Short 05 · GTA 6', 
    status: 'ready', 
    videoUrl: 'https://i.imgur.com/Zcc8B6o.mp4', 
    posterUrl: '/assets/slot5_poster.jpg',
  },
  { 
    id: 6, 
    title: 'Short 06 · GTA 6', 
    status: 'ready', 
    videoUrl: 'https://i.imgur.com/wRP9sQG.mp4', 
    posterUrl: '/assets/slot6_poster.jpg',
  },
  { 
    id: 7, 
    title: 'Short 07 · GTA 6', 
    status: 'ready', 
    videoUrl: 'https://i.imgur.com/7y3ZTBg.mp4', 
    posterUrl: '/assets/slot7_poster.jpg',
  },
  { 
    id: 8, 
    title: 'Short 08 · GTA 6', 
    status: 'ready', 
    videoUrl: 'https://i.imgur.com/i3uYK0q.mp4', 
    posterUrl: '/assets/slot8_poster.jpg',
  },
];

interface ChatMessage {
  role: 'user' | 'bot' | 'sys';
  content: string;
}

interface AppState {
  v: number;
  name: string;
  theme: 'dark' | 'light';
  tasks: Record<number, boolean[]>;
  done: Record<number, boolean>;
  last: number | null;
  chats: Record<number, ChatMessage[]>;
}

const STORAGE_KEY = 'noobtoon.v1';

export default function App() {
  const [state, setState] = useState<AppState>(() => {
    const defaultState: AppState = {
      v: 2,
      name: '',
      theme: 'dark',
      tasks: {},
      done: {},
      last: 0,
      chats: {}
    };
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaultState, ...parsed };
      }
    } catch (e) {
      console.error('Failed to load state:', e);
    }
    return defaultState;
  });

  // Check-in login gate: check-in happens when you log in or reload the page; login happens after submitting check-in
  const [hasEntered, setHasEntered] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>(state.name || '');
  const [nameError, setNameError] = useState<string>('');
  
  const [currentTab, setCurrentTab] = useState<'home' | 'play' | 'titles' | 'settings'>('home');
  const [mobileHomeView, setMobileHomeView] = useState<'trail' | 'detail'>('trail');
  const [currentStep, setCurrentStep] = useState<number>(state.last ?? 0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mentorOpen, setMentorOpen] = useState<boolean>(false);
  const [chatInput, setChatInput] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  
  // Captions & Ideas pagination / reveal states
  const [showCaptions, setShowCaptions] = useState<boolean>(false);
  const [captionCount, setCaptionCount] = useState<number>(0);
  const [copiedCaptionIdx, setCopiedCaptionIdx] = useState<number | null>(null);

  const [showIdeas, setShowIdeas] = useState<boolean>(false);
  const [ideaCount, setIdeaCount] = useState<number>(0);
  const [copiedIdeaIdx, setCopiedIdeaIdx] = useState<{ id: number; type: 'title' | 'all' } | null>(null);

  const [activePlayingVideoId, setActivePlayingVideoId] = useState<number | null>(null);

  const [settingsName, setSettingsName] = useState<string>(state.name);
  const [settingsToast, setSettingsToast] = useState<string>('');

  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Sync state to localStorage & theme to document
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if (state.theme === 'light') {
      document.body.classList.add('light');
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.body.classList.remove('light');
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  }, [state]);

  useEffect(() => {
    setSettingsName(state.name);
    setNameInput(state.name || '');
  }, [state.name]);

  // Handle Welcome check-in (mandatory name requirement)
  const handleCheckin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = nameInput.trim();
    if (!cleanName) {
      setNameError('Por favor, digite seu nome! O preenchimento é obrigatório para acessar a aba principal do app.');
      return;
    }
    setNameError('');
    setState(prev => ({ ...prev, name: cleanName }));
    setHasEntered(true);
    setCurrentTab('home');
  };

  // Progress calculations
  const totalTasks = MODS.reduce((sum, m) => sum + m.tasks.length, 0);
  const completedTasksCount = MODS.reduce((sum, _, idx) => {
    const stepTasks = state.tasks[idx] || [];
    return sum + stepTasks.filter(Boolean).length;
  }, 0);
  const completedStepsCount = MODS.filter((_, idx) => state.done[idx]).length;
  const progressPercent = Math.round((completedStepsCount / MODS.length) * 100);

  // Find next unfinished step or current
  const nextTargetStep = () => {
    if (state.last !== null && !state.done[state.last]) return state.last;
    const firstUnfinished = MODS.findIndex((_, idx) => !state.done[idx]);
    return firstUnfinished >= 0 ? firstUnfinished : 0;
  };

  // Task check toggle
  const toggleTask = (stepIdx: number, taskIdx: number) => {
    setState(prev => {
      const prevStepTasks = prev.tasks[stepIdx] || [false, false, false];
      const newStepTasks = [...prevStepTasks];
      newStepTasks[taskIdx] = !newStepTasks[taskIdx];

      const allDone = MODS[stepIdx].tasks.every((_, i) => newStepTasks[i]);
      const newDone = { ...prev.done, [stepIdx]: allDone };

      return {
        ...prev,
        tasks: { ...prev.tasks, [stepIdx]: newStepTasks },
        done: newDone,
        last: stepIdx
      };
    });
  };

  // Complete current step and advance
  const handleCompleteStep = () => {
    if (completedStepsCount === MODS.length || (currentStep === MODS.length - 1 && isCurStepDone)) {
      setCurrentTab('play');
      return;
    }

    setState(prev => {
      const stepTasks = MODS[currentStep].tasks.map(() => true);
      return {
        ...prev,
        tasks: { ...prev.tasks, [currentStep]: stepTasks },
        done: { ...prev.done, [currentStep]: true },
        last: currentStep < MODS.length - 1 ? currentStep + 1 : currentStep
      };
    });

    if (currentStep < MODS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Reopen completed step
  const handleReopenStep = () => {
    setState(prev => ({
      ...prev,
      done: { ...prev.done, [currentStep]: false }
    }));
  };

  // Mentor Chat message submission
  const handleSendChat = async (promptText?: string) => {
    const textToSend = (promptText || chatInput).trim();
    if (!textToSend || isAiLoading) return;

    const currentChat = state.chats[currentStep] || [];
    const updatedChat: ChatMessage[] = [...currentChat, { role: 'user', content: textToSend }];

    setState(prev => ({
      ...prev,
      chats: { ...prev.chats, [currentStep]: updatedChat }
    }));
    setChatInput('');
    setIsAiLoading(true);

    try {
      const res = await fetch('/api/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: updatedChat,
          stepIndex: currentStep,
          stepTitle: MODS[currentStep].t,
          stepSummary: MODS[currentStep].s,
          tasks: MODS[currentStep].tasks,
          userName: state.name
        })
      });

      let reply = '';
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        reply = data.text || '';
      }

      if (!reply) {
        reply = `Oi, ${state.name || 'Criador'}! Para a etapa "${MODS[currentStep].t}": recomendo focar em concluir o checklist das 3 tarefas acima e estruturar o gancho inicial do seu Short. Como posso te apoiar nesta etapa?`;
      }

      setState(prev => ({
        ...prev,
        chats: {
          ...prev.chats,
          [currentStep]: [...(prev.chats[currentStep] || []), { role: 'bot', content: reply }]
        }
      }));
    } catch (err) {
      console.error('Chat error:', err);
      setState(prev => ({
        ...prev,
        chats: {
          ...prev.chats,
          [currentStep]: [
            ...(prev.chats[currentStep] || []),
            { 
              role: 'bot', 
              content: `Oi, ${state.name}! Como estou no modo de resposta rápida para a etapa "${MODS[currentStep].t}": recomendo começar completando as 3 tarefas acima. Se precisar de dicas para edição, roteiro ou títulos, me mande o tema do seu vídeo!` 
            }
          ]
        }
      }));
    } finally {
      setIsAiLoading(false);
      setTimeout(() => {
        if (chatScrollRef.current) {
          chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
        }
      }, 100);
    }
  };

  // Progressive revealing of captions & ideas
  const toggleCaptionsReveal = () => {
    if (!showCaptions) {
      setShowCaptions(true);
      if (captionCount < CAPTIONS.length) {
        setCaptionCount(CAPTIONS.length);
      }
    } else {
      setShowCaptions(false);
    }
  };

  const toggleIdeasReveal = () => {
    if (!showIdeas) {
      setShowIdeas(true);
      if (ideaCount < IDEAS.length) {
        setIdeaCount(IDEAS.length);
      }
    } else {
      setShowIdeas(false);
    }
  };

  // Copy helper
  const copyText = (text: string, onDone: () => void) => {
    navigator.clipboard.writeText(text).then(() => {
      onDone();
    }).catch(() => {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      onDone();
    });
  };

  // Filtered steps based on search query
  const queryNormalized = searchQuery.toLowerCase().trim();
  const filteredSteps = MODS.map((m, idx) => ({ ...m, originalIndex: idx })).filter(m => {
    if (!queryNormalized) return true;
    const combined = `${m.t} ${m.s} ${m.tasks.join(' ')} ${m.hints.join(' ')}`.toLowerCase();
    return combined.includes(queryNormalized);
  });

  // ==================== CHECK-IN LOGIN GATE ====================
  if (!hasEntered) {
    return (
      <div className="min-h-screen relative overflow-hidden flex flex-col justify-between p-4 sm:p-6 bg-[var(--bg)] text-[var(--fg)] transition-colors duration-300 select-none">
        {/* Ambient background glow */}
        <div 
          className="absolute left-1/2 -bottom-[20vh] -translate-x-1/2 w-[120vw] h-[60vh] pointer-events-none"
          style={{
            background: 'radial-gradient(closest-side, rgba(255, 95, 162, 0.12), rgba(62, 230, 208, 0.05) 50%, transparent)'
          }}
        />

        {/* Top Controls on Check-in */}
        <header className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-end pb-2">
          <div className="flex items-center gap-2">
            {/* Quick Theme Toggle */}
            <button
              type="button"
              onClick={() => setState(prev => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }))}
              title={state.theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[var(--line)] bg-[var(--surface)]/85 backdrop-blur-md text-[var(--fg)] hover:border-[var(--pink)] transition-colors cursor-pointer text-xs font-bold shadow-sm"
            >
              {state.theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-[var(--orange)]" />
                  <span className="hidden sm:inline">Tema Claro</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-[var(--purple)]" />
                  <span className="hidden sm:inline">Tema Escuro</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* Central Check-in Card */}
        <main className="relative z-10 w-full max-w-md sm:max-w-lg mx-auto my-auto py-4">
          <div className="bg-[var(--surface)]/95 backdrop-blur-xl border border-[var(--line)] shadow-2xl rounded-3xl p-6 sm:p-10 text-center transition-colors duration-300">
            {/* Greeting Headline */}
            <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-wider leading-none text-[var(--fg)]">
              Olá, seja <span className="sunset">bem-vindo</span>
            </h1>

            {/* Prompt Question */}
            <p className="text-base sm:text-lg text-[var(--muted)] mt-3 font-medium">
              Como devemos te chamar?
            </p>

            {/* Mandatory Name Form */}
            <form onSubmit={handleCheckin} className="w-full flex flex-col gap-3.5 mt-6 text-left">
              <div>
                <div className="relative">
                  <User className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none" />
                  <input
                    id="checkin-name"
                    type="text"
                    maxLength={30}
                    value={nameInput}
                    onChange={e => {
                      setNameInput(e.target.value);
                      if (nameError) setNameError('');
                    }}
                    placeholder="Digite seu nome..."
                    autoFocus
                    className={`w-full pl-12 pr-4 py-3.5 rounded-xl border bg-[var(--surface2)] text-[var(--fg)] text-base sm:text-lg placeholder:text-[var(--muted)]/60 focus:outline-none transition-all font-medium shadow-inner ${
                      nameError 
                        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/30' 
                        : 'border-[var(--line)] focus:border-[var(--pink)] focus:ring-2 focus:ring-[var(--pink)]/30'
                    }`}
                  />
                </div>
              </div>

              {/* Error message if empty */}
              {nameError && (
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 dark:text-red-400 text-xs sm:text-sm font-medium animate-pulse" role="alert">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500 dark:text-red-400" />
                  <span>{nameError}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="mt-2 w-full py-4 px-6 rounded-xl font-display text-xl sm:text-2xl tracking-wider uppercase sunset-bg text-[#16061a] font-black shadow-[0_0_24px_rgba(255,95,162,0.45)] hover:shadow-[0_0_36px_rgba(255,95,162,0.65)] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Acesse</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </main>
      </div>
    );
  }

  // ==================== MAIN DASHBOARD ====================
  const curMod = MODS[currentStep];
  const curTasks = state.tasks[currentStep] || [false, false, false];
  const curCompletedCount = curTasks.filter(Boolean).length;
  const isCurStepDone = state.done[currentStep];
  const allStagesDone = completedStepsCount === MODS.length;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] pb-28 transition-colors duration-300">
      {/* Top Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
        
        {/* Top Desktop & Mobile Header Bar */}
        <header className="mb-6 flex items-center justify-between border-b border-[var(--line)]/70 pb-4">

          {/* Selected Header Area: Large Image in the right corner */}
          <div className="flex items-center justify-end ml-auto mr-3 sm:mr-5">
            <img
              src="/assets/banner_header.png"
              onError={(e) => {
                e.currentTarget.src = 'https://i.imgur.com/m1GmTFD.png';
              }}
              alt="GTA VI"
              className="h-24 sm:h-32 md:h-36 lg:h-44 w-auto max-h-[175px] object-contain drop-shadow-[0_0_30px_rgba(255,95,162,0.55)] hover:scale-105 transition-transform"
            />
          </div>

          {/* Quick Theme Toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setState(prev => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }))}
              title={state.theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
              className="p-2.5 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--fg)] transition-colors cursor-pointer"
            >
              {state.theme === 'dark' ? <Sun className="w-4 h-4 text-[var(--orange)]" /> : <Moon className="w-4 h-4 text-[var(--purple)]" />}
            </button>
          </div>
        </header>
        
        {/* Top Header & Progress Hero (Visible in Home view) */}
        {currentTab === 'home' && (
          <header className="mb-6 flex flex-col gap-5">
            <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-5 items-stretch">
              {/* Left Hero Greeting */}
              <div className="flex flex-col justify-center gap-2 bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-5 sm:p-7 shadow-md">
                <p className="text-xs uppercase tracking-[0.25em] font-bold text-[var(--teal)]">
                  Olá, <span className="text-[var(--pink)] font-black">{state.name}</span>!
                </p>
                <h2 className="font-display text-3xl sm:text-5xl lg:text-5xl uppercase tracking-tight leading-[0.95] text-balance">
                  Seu canal no YouTube <span className="sunset">começa aqui.</span>
                </h2>
                <p className="text-sm sm:text-base text-[var(--muted)] max-w-xl mt-1 leading-relaxed">
                  Aprenda do zero, siga cada etapa e transforme sua ideia em um canal dark pronto para publicar e monetizar.
                </p>
              </div>

              {/* Right Hero Progress Card */}
              <div className="relative overflow-hidden bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-5 sm:p-6 flex flex-col justify-between gap-4 shadow-xl">
                <div className="flex items-center gap-4">
                  {/* Circular Ring */}
                  <div className="relative w-18 h-18 sm:w-20 sm:h-20 shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 84 84">
                      <defs>
                        <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="var(--orange)" />
                          <stop offset="50%" stopColor="var(--pink)" />
                          <stop offset="100%" stopColor="var(--purple)" />
                        </linearGradient>
                      </defs>
                      <circle
                        cx="42"
                        cy="42"
                        r="36"
                        fill="none"
                        stroke="var(--surface2)"
                        strokeWidth="8"
                      />
                      <circle
                        cx="42"
                        cy="42"
                        r="36"
                        fill="none"
                        stroke="url(#ringGrad)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray="226.2"
                        strokeDashoffset={226.2 * (1 - progressPercent / 100)}
                        className="transition-all duration-700 ease-out"
                      />
                    </svg>
                    <span className="absolute inset-0 grid place-items-center font-display text-xl font-bold tabular-nums">
                      {progressPercent}%
                    </span>
                  </div>

                  {/* Numbers & Stats */}
                  <div className="flex flex-col gap-1 min-w-0">
                    <strong className="text-base sm:text-lg leading-tight font-bold truncate">
                      {completedStepsCount} de {MODS.length} etapas concluídas
                    </strong>
                    <span className="text-xs sm:text-sm text-[var(--muted)] tabular-nums">
                      {completedTasksCount} de {totalTasks} tarefas feitas
                    </span>
                  </div>
                </div>

                {/* Linear Bar */}
                <div className="h-1.5 w-full rounded-full bg-[var(--surface2)] overflow-hidden">
                  <div 
                    className="h-full sunset-bg rounded-full transition-all duration-500" 
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* Motivational Line */}
                <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                  {allStagesDone
                    ? `Parabéns, ${state.name}! Você completou todas as 6 etapas da trilha. Seus vídeos e títulos já estão liberados no Play!`
                    : completedStepsCount === 0 && completedTasksCount === 0
                    ? 'Comece pela etapa 1. São apenas 3 tarefas simples para começar a rodar.'
                    : `Ótimo ritmo! Faltam apenas ${totalTasks - completedTasksCount} tarefas para finalizar sua jornada.`}
                </p>

                {/* Continue CTA */}
                <button
                  type="button"
                  onClick={() => {
                    if (allStagesDone) {
                      setCurrentTab('play');
                    } else {
                      const next = nextTargetStep();
                      setCurrentStep(next);
                      setMobileHomeView('detail');
                    }
                  }}
                  className="w-full py-3.5 px-5 rounded-xl sunset-bg text-[#16061a] font-display text-lg tracking-wider uppercase font-bold flex items-center justify-between shadow-[0_0_18px_rgba(255,95,162,0.3)] hover:shadow-[0_0_28px_rgba(255,95,162,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                >
                  <div className="flex flex-col text-left min-w-0 pr-2">
                    <span className="truncate">{allStagesDone ? 'Ir para o Play' : 'Continuar de onde parei'}</span>
                    <small className="font-sans text-xs normal-case font-semibold opacity-85 truncate">
                      {allStagesDone ? 'Próxima etapa · Seus Shorts prontos' : `Etapa ${nextTargetStep() + 1} · ${MODS[nextTargetStep()].t}`}
                    </small>
                  </div>
                  <ArrowRight className="w-5 h-5 shrink-0" />
                </button>
              </div>
            </div>

            {/* Quick Search Bar */}
            <div className="relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Pesquisar etapa, assunto ou tarefa (ex.: nicho, canal, roteiro, edição, thumbnail)"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--fg)] text-sm sm:text-base focus:outline-none focus:border-[var(--pink)] focus:ring-2 focus:ring-[var(--pink)]/20 transition-all shadow-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[var(--muted)] hover:text-[var(--fg)] underline cursor-pointer"
                >
                  Limpar
                </button>
              )}
            </div>

            {/* Mobile View Switcher (Trilha vs Etapa Aberta) - only on phone/tablet (< lg) */}
            <div className="lg:hidden flex rounded-xl p-1 bg-[var(--surface)] border border-[var(--line)] shadow-sm">
              <button
                type="button"
                onClick={() => setMobileHomeView('trail')}
                className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  mobileHomeView === 'trail'
                    ? 'sunset-bg text-[#16061a] shadow'
                    : 'text-[var(--muted)] hover:text-[var(--fg)]'
                }`}
              >
                <span>Trilha de Etapas</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/20 font-bold">6</span>
              </button>
              <button
                type="button"
                onClick={() => setMobileHomeView('detail')}
                className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  mobileHomeView === 'detail'
                    ? 'sunset-bg text-[#16061a] shadow'
                    : 'text-[var(--muted)] hover:text-[var(--fg)]'
                }`}
              >
                <span>Etapa {currentStep + 1}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${isCurStepDone ? 'bg-emerald-700 text-white' : 'bg-black/20'}`}>
                  {isCurStepDone ? '✓' : `${curCompletedCount}/3`}
                </span>
              </button>
            </div>
          </header>
        )}

        {/* ================= VIEW 1: HOME (TRILHA + ETAPA ABERTA + MENTOR) ================= */}
        {currentTab === 'home' && (
          <main className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 lg:gap-8 items-start">
            
            {/* Left Column: 6-Stage Track (Trilha) */}
            <div className={`flex flex-col gap-4 ${mobileHomeView === 'detail' ? 'hidden lg:flex' : 'flex'}`}>
              <div className="flex justify-between items-baseline">
                <p className="text-xs uppercase tracking-[0.24em] font-bold text-[var(--teal)]">
                  Sua trilha · 6 etapas
                </p>
                <span className="text-xs text-[var(--muted)] tabular-nums font-semibold">
                  {completedStepsCount}/{MODS.length} concluídas
                </span>
              </div>

              {/* Steps List */}
              <div className="flex flex-col gap-3 relative">
                {/* Vertical connecting line */}
                <div 
                  className="absolute left-[19px] top-5 bottom-5 w-0.5 pointer-events-none opacity-40"
                  style={{
                    background: 'linear-gradient(var(--pink), var(--purple), var(--teal))'
                  }}
                />

                {filteredSteps.length === 0 ? (
                  <div className="p-6 border border-dashed border-[var(--line)] rounded-xl bg-[var(--surface)] text-center text-sm text-[var(--muted)]">
                    Nenhuma etapa encontrada para "{searchQuery}".
                    <button
                      onClick={() => setSearchQuery('')}
                      className="block mx-auto mt-2 text-xs font-bold text-[var(--pink)] underline cursor-pointer"
                    >
                      Limpar filtro
                    </button>
                  </div>
                ) : (
                  filteredSteps.map(step => {
                    const originalIdx = step.originalIndex;
                    const isDone = state.done[originalIdx];
                    const stepTasks = state.tasks[originalIdx] || [];
                    const isDoing = stepTasks.some(Boolean) && !isDone;
                    const isActive = currentStep === originalIdx;
                    const doneCount = stepTasks.filter(Boolean).length;
                    const stepPct = isDone ? 100 : Math.round((doneCount / step.tasks.length) * 100);

                    return (
                      <div key={originalIdx} className="grid grid-cols-[40px_1fr] gap-3 items-center relative z-10">
                        {/* Node circle */}
                        <div 
                          className={`w-10 h-10 rounded-full grid place-items-center font-display text-base border-2 bg-[var(--bg)] transition-all ${
                            isDone 
                              ? 'border-[var(--teal)] text-[var(--teal)] shadow-[0_0_12px_rgba(62,230,208,0.3)]' 
                              : isActive 
                              ? 'border-[var(--pink)] text-[var(--pink)] shadow-[0_0_14px_rgba(255,95,162,0.4)]' 
                              : isDoing 
                              ? 'border-[var(--orange)] text-[var(--orange)]' 
                              : 'border-[var(--line)] text-[var(--muted)]'
                          }`}
                        >
                          {isDone ? <Check className="w-5 h-5 stroke-[3]" /> : originalIdx + 1}
                        </div>

                        {/* Card button */}
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentStep(originalIdx);
                            setState(prev => ({ ...prev, last: originalIdx }));
                            setMobileHomeView('detail');
                          }}
                          className={`w-full text-left p-4 rounded-xl border bg-[var(--surface)] transition-all cursor-pointer flex justify-between items-center gap-3 ${
                            isActive
                              ? 'border-[var(--pink)] shadow-[0_0_0_1px_var(--pink),0_0_20px_rgba(255,95,162,0.25)]'
                              : 'border-[var(--line)] hover:border-[var(--purple)] hover:translate-x-1'
                          }`}
                        >
                          <div className="flex flex-col gap-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--muted)]">
                                Etapa {String(originalIdx + 1).padStart(2, '0')}
                              </span>
                              <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border ${
                                isDone 
                                  ? 'border-[var(--teal)] text-[var(--teal)]' 
                                  : isDoing 
                                  ? 'border-[var(--orange)] text-[var(--orange)]' 
                                  : 'border-[var(--line)] text-[var(--muted)]'
                              }`}>
                                {isDone ? 'Concluída' : isDoing ? 'Em andamento' : 'Não iniciada'}
                              </span>
                            </div>
                            <h3 className="font-bold text-base leading-snug truncate">
                              {step.t}
                            </h3>
                            <p className="text-xs text-[var(--muted)] line-clamp-1">
                              {step.s}
                            </p>
                            {/* Mini progress */}
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex-1 h-1 rounded-full bg-[var(--surface2)] overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${isDone ? 'bg-[var(--teal)]' : 'sunset-bg'}`}
                                  style={{ width: `${stepPct}%` }}
                                />
                              </div>
                              <span className="text-[11px] text-[var(--muted)] tabular-nums">
                                {isDone ? '3/3' : `${doneCount}/${step.tasks.length}`}
                              </span>
                            </div>
                          </div>
                          <ArrowRight className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'text-[var(--pink)] translate-x-1' : 'text-[var(--muted)]'}`} />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Column: Stage Detail + Interactive Tasks + Mentor */}
            <div className={`flex flex-col gap-6 ${mobileHomeView === 'trail' ? 'hidden lg:flex' : 'flex'}`}>
              
              {/* Mobile Back Button to Trail */}
              <div className="lg:hidden flex items-center justify-between pb-1">
                <button
                  type="button"
                  onClick={() => setMobileHomeView('trail')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--pink)]/40 bg-[var(--surface)] text-xs font-bold text-[var(--pink)] hover:bg-[var(--pink)]/10 transition-colors cursor-pointer shadow-sm"
                >
                  <span>← Ver todas as etapas (Trilha)</span>
                </button>
                <span className="text-xs text-[var(--muted)] font-semibold">
                  Etapa {currentStep + 1} de {MODS.length}
                </span>
              </div>

              {/* Detail Card */}
              <section className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-5 sm:p-7 flex flex-col gap-5 sm:gap-6 shadow-md">
                
                {/* Stage Header */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <p className="text-xs uppercase tracking-widest font-bold text-[var(--orange)]">
                      Etapa {currentStep + 1} de {MODS.length}
                    </p>
                    <span className={`text-[10px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full border ${
                      isCurStepDone 
                        ? 'border-[var(--teal)] text-[var(--teal)]' 
                        : curCompletedCount > 0 
                        ? 'border-[var(--orange)] text-[var(--orange)]' 
                        : 'border-[var(--line)] text-[var(--muted)]'
                    }`}>
                      {isCurStepDone ? 'Concluída' : curCompletedCount > 0 ? 'Em andamento' : 'Não iniciada'}
                    </span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-4xl lg:text-4xl uppercase leading-tight tracking-tight">
                    {curMod.t}
                  </h2>
                  <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed">
                    {curMod.s}
                  </p>

                  {/* Progress info */}
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex-1 h-1.5 rounded-full bg-[var(--surface2)] overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${isCurStepDone ? 'bg-[var(--teal)]' : 'sunset-bg'}`}
                        style={{ width: `${isCurStepDone ? 100 : (curCompletedCount / curMod.tasks.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-[var(--muted)] font-semibold tabular-nums">
                      {isCurStepDone ? 'Etapa concluída' : `${curCompletedCount} de ${curMod.tasks.length} tarefas`}
                    </span>
                  </div>
                </div>

                {/* 3 Interactive Tasks Checklist */}
                <div className="flex flex-col gap-3">
                  {curMod.tasks.map((taskName, taskIdx) => {
                    const isChecked = Boolean(curTasks[taskIdx]);
                    const link = curMod.links[taskIdx];

                    return (
                      <div 
                        key={taskIdx}
                        className={`border rounded-xl bg-[var(--surface2)] transition-all overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between ${
                          isChecked ? 'border-[var(--teal)]/40 bg-[var(--surface2)]/70' : 'border-[var(--line)] hover:border-[var(--purple)]'
                        }`}
                      >
                        <label className="flex items-start gap-3.5 p-4 cursor-pointer flex-1 min-w-0">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleTask(currentStep, taskIdx)}
                            className="mt-0.5 w-5 h-5 rounded-md border-2 border-[var(--purple)] text-[var(--teal)] accent-[var(--teal)] cursor-pointer shrink-0"
                          />
                          <div className="flex flex-col gap-1 min-w-0">
                            <strong className={`text-sm sm:text-base font-bold leading-snug transition-colors ${isChecked ? 'line-through text-[var(--muted)] decoration-[var(--teal)]' : ''}`}>
                              {taskName}
                            </strong>
                            <small className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                              {curMod.hints[taskIdx]}
                            </small>
                          </div>
                        </label>

                        {/* External Link - responsive button on mobile, divider on desktop */}
                        {link && (
                          <div className="px-4 pb-3 sm:pb-0 sm:py-3 sm:px-4 sm:border-l border-[var(--line)] shrink-0 flex items-center">
                            <a
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--pink)]/40 bg-[var(--surface)] text-xs font-bold text-[var(--pink)] hover:bg-[var(--pink)]/10 transition-colors"
                            >
                              <span>{link.label}</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* All Stages Congratulations Banner */}
                {allStagesDone && (
                  <div className="p-6 rounded-2xl border border-[var(--pink)]/40 bg-[var(--surface2)] text-center flex flex-col items-center gap-2 relative overflow-hidden shadow-lg">
                    <div className="text-xs uppercase tracking-[0.25em] font-bold text-[var(--teal)]">
                      Trilha completa
                    </div>
                    <h3 className="font-display text-3xl sm:text-4xl uppercase sunset font-black">
                      Parabéns, {state.name}!
                    </h3>
                    <p className="text-sm sm:text-base text-slate-200 max-w-md">
                      Você concluiu as 6 etapas fundamentais. Seus vídeos e ferramentas estão prontos no menu <strong>Play</strong> e <strong>Títulos</strong>!
                    </p>
                  </div>
                )}

                {/* Bottom Actions */}
                <div className="flex flex-col gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCompleteStep}
                    className="w-full py-4 px-6 rounded-xl font-display text-xl tracking-wider uppercase font-bold sunset-bg text-[#16061a] shadow-[0_0_20px_rgba(255,95,162,0.3)] hover:shadow-[0_0_32px_rgba(255,95,162,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex flex-col text-left">
                      <span>
                        {allStagesDone 
                          ? 'Ir para o Play' 
                          : isCurStepDone 
                          ? (currentStep === MODS.length - 1 ? 'Rever trilha' : 'Próxima etapa') 
                          : (currentStep === MODS.length - 1 ? 'Concluir trilha' : 'Concluir e continuar')}
                      </span>
                      <small className="font-sans text-xs normal-case font-semibold opacity-85">
                        {allStagesDone
                          ? 'Acessar biblioteca completa de vídeos'
                          : isCurStepDone
                          ? `Ir para etapa ${currentStep + 2}`
                          : `${curCompletedCount} de ${curMod.tasks.length} tarefas feitas`}
                      </small>
                    </div>
                    <ArrowRight className="w-5 h-5 shrink-0" />
                  </button>

                  <div className="flex justify-between items-center text-xs font-semibold text-[var(--muted)]">
                    {currentStep > 0 ? (
                      <button
                        type="button"
                        onClick={() => setCurrentStep(currentStep - 1)}
                        className="hover:text-[var(--fg)] py-2 underline cursor-pointer"
                      >
                        ← Etapa anterior ({MODS[currentStep - 1].t})
                      </button>
                    ) : <span />}

                    {isCurStepDone && (
                      <button
                        type="button"
                        onClick={handleReopenStep}
                        className="hover:text-[var(--pink)] py-2 underline cursor-pointer flex items-center gap-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Reabrir etapa
                      </button>
                    )}
                  </div>
                </div>
              </section>

              {/* Mentor com IA Section */}
              <aside className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl overflow-hidden shadow-md">
                {/* Accordion header */}
                <button
                  type="button"
                  onClick={() => setMentorOpen(!mentorOpen)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left hover:bg-[var(--surface2)]/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl sunset-bg flex items-center justify-center font-display text-sm font-bold text-[#16061a] shadow-[0_0_12px_rgba(255,95,162,0.3)]">
                      NT
                    </div>
                    <div className="flex flex-col">
                      <strong className="text-base font-bold flex items-center gap-2">
                        Mentor com IA <Sparkles className="w-4 h-4 text-[var(--pink)]" />
                      </strong>
                      <small className="text-xs text-[var(--muted)]">
                        Tire dúvidas sobre a etapa atual: "{curMod.t}"
                      </small>
                    </div>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-[var(--muted)] transition-transform duration-300 ${mentorOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Accordion body */}
                {mentorOpen && (
                  <div className="border-t border-[var(--line)] p-4 sm:p-5 flex flex-col gap-4">
                    {/* Chat Messages Log */}
                    <div 
                      ref={chatScrollRef}
                      className="max-h-80 overflow-y-auto flex flex-col gap-3 pr-2 scrollbar-thin"
                    >
                      <div className="p-3.5 rounded-xl bg-[var(--surface2)] border border-[var(--line)] text-sm max-w-[92%] leading-relaxed">
                        <div className="flex items-center gap-1.5 font-bold text-xs text-[var(--teal)] mb-1">
                          <Bot className="w-3.5 h-3.5" /> Mentor Noob Toon
                        </div>
                        Oi, <strong>{state.name}</strong>! Estou pronto para ajudar você na etapa <strong>"{curMod.t}"</strong>. Você pode clicar nas perguntas rápidas abaixo ou digitar sua dúvida!
                      </div>

                      {(state.chats[currentStep] || []).map((msg, i) => (
                        <div
                          key={i}
                          className={`p-3.5 rounded-xl text-sm max-w-[92%] leading-relaxed ${
                            msg.role === 'user'
                              ? 'self-end bg-gradient-to-r from-[var(--pink)]/20 to-[var(--purple)]/20 border border-[var(--pink)]/30 text-white'
                              : 'self-start bg-[var(--surface2)] border border-[var(--line)]'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 font-bold text-xs mb-1 opacity-75">
                            {msg.role === 'user' ? (
                              <><User className="w-3.5 h-3.5" /> Você</>
                            ) : (
                              <><Bot className="w-3.5 h-3.5" /> Mentor Noob Toon</>
                            )}
                          </div>
                          <div className="whitespace-pre-wrap">{msg.content}</div>
                        </div>
                      ))}

                      {isAiLoading && (
                        <div className="p-3.5 rounded-xl bg-[var(--surface2)] border border-[var(--line)] text-sm self-start flex items-center gap-2 text-[var(--muted)]">
                          <Sparkles className="w-4 h-4 animate-spin text-[var(--pink)]" />
                          <span>O mentor está pensando e formulando sua resposta...</span>
                        </div>
                      )}
                    </div>

                    {/* Stage Chips */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {curMod.chips.map((chip, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSendChat(chip)}
                          className="text-xs px-3 py-1.5 rounded-full border border-[var(--purple)] text-[var(--purple)] hover:bg-[var(--purple)]/10 transition-colors cursor-pointer text-left"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>

                    {/* Chat Input form */}
                    <form 
                      onSubmit={e => {
                        e.preventDefault();
                        handleSendChat();
                      }} 
                      className="flex gap-2 items-center"
                    >
                      <input
                        type="text"
                        value={chatInput}
                        onChange={e => setChatInput(e.target.value)}
                        placeholder={`Pergunte ao mentor sobre ${curMod.t}...`}
                        className="flex-1 px-4 py-3 rounded-xl border border-[var(--line)] bg-[var(--surface2)] text-sm focus:outline-none focus:border-[var(--pink)]"
                      />
                      <button
                        type="submit"
                        disabled={isAiLoading || !chatInput.trim()}
                        className="h-11 px-4 rounded-xl sunset-bg text-[#16061a] font-display text-sm uppercase tracking-wider font-bold disabled:opacity-50 flex items-center justify-center cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                )}
              </aside>

            </div>
          </main>
        )}

        {/* ================= VIEW 2: PLAY (SHORTS VÍDEOS) ================= */}
        {currentTab === 'play' && (
          <main className="py-6 flex flex-col gap-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex flex-col gap-2 max-w-xl">
                <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl uppercase sunset font-black leading-none">
                  Dê o Play
                </h2>
                <p className="font-display text-2xl sm:text-3xl uppercase tracking-wide text-slate-100">
                  Agora basta você clicar, baixar e postar.{' '}
                  <span className="sunset">Seus vídeos de Shorts estão prontos!</span>
                </p>
                <p className="text-sm sm:text-base text-[var(--muted)]">
                  Biblioteca temática para canais de games e Shorts com retenção alta.
                </p>
              </div>

              {/* Artwork Badge */}
              <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-xl flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl sunset-bg grid place-items-center font-display text-2xl font-black text-[#16061a]">
                  VI
                </div>
                <div>
                  <h4 className="font-display text-lg uppercase tracking-wider leading-none">GTA 6 Shorts Pack</h4>
                  <p className="text-xs text-[var(--muted)] mt-1">Série Exclusiva Noob Toon</p>
                </div>
              </div>
            </div>

            {/* Video Slots Grid */}
            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-2xl sm:text-3xl uppercase tracking-wide">
                  Vídeos da Coleção
                </h3>
                <span className="text-xs uppercase tracking-wider font-bold px-3 py-1 rounded-full border border-[var(--teal)]/40 text-[var(--teal)] bg-[var(--surface2)]">
                  {VIDEO_SLOTS.length} vídeos
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
                {VIDEO_SLOTS.map(slot => (
                  <ShortVideoPlayer
                    key={slot.id}
                    slot={slot}
                    activeVideoId={activePlayingVideoId}
                    onPlayChange={(id, isPlaying) => {
                      if (isPlaying) {
                        setActivePlayingVideoId(id);
                      } else if (activePlayingVideoId === id) {
                        setActivePlayingVideoId(null);
                      }
                    }}
                  />
                ))}
              </div>
            </section>

            {/* More Videos CTA */}
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--line)] text-center flex flex-col items-center gap-3">
              <p className="font-display text-2xl sm:text-3xl uppercase tracking-wide">
                Acesse mais <span className="sunset">200 vídeos</span>
              </p>
              <a
                href="https://drive.google.com/drive/folders/1qeDer6LpanfUVDRte19YtyNNpniA6ahx?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full max-w-md py-4 px-6 rounded-xl sunset-bg text-[#16061a] font-display text-xl tracking-wider uppercase font-bold shadow-[0_0_20px_rgba(255,95,162,0.3)] hover:shadow-[0_0_30px_rgba(255,95,162,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer flex items-center justify-center gap-2.5 text-center no-underline"
              >
                <span>Acesse mais 200 vídeos</span>
                <ExternalLink className="w-5 h-5 shrink-0" />
              </a>
            </div>
          </main>
        )}

        {/* ================= VIEW 3: TÍTULOS (200 LEGENDAS + 50 IDEIAS GTA 6) ================= */}
        {currentTab === 'titles' && (
          <main className="py-6 flex flex-col gap-8">
            <div>
              <h2 className="font-display text-5xl sm:text-6xl uppercase sunset font-black leading-none">
                Títulos & Legendas
              </h2>
              <p className="text-base sm:text-lg text-[var(--muted)] mt-2">
                200 legendas prontas com hashtags e 50 ideias completas com roteiro e contexto para Shorts.
              </p>
            </div>

            {/* Section 1: 200 Legendas Prontas */}
            <section className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-6 sm:p-7 flex flex-col gap-5 shadow-md">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div>
                  <h3 className="font-display text-2xl sm:text-3xl uppercase tracking-wide">
                    200 Legendas Prontas para Shorts
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--muted)]">
                    Com hashtags otimizadas para o algoritmo do YouTube. Toque em "Copiar" e cole direto no seu vídeo.
                  </p>
                </div>
                <span className="self-start sm:self-auto text-xs uppercase tracking-wider font-bold px-3 py-1 rounded-full border border-[var(--teal)] text-[var(--teal)]">
                  200 legendas
                </span>
              </div>

              {/* Progress bar */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 rounded-full bg-[var(--surface2)] overflow-hidden">
                  <div
                    className="h-full sunset-bg transition-all duration-300"
                    style={{ width: `${(captionCount / CAPTIONS.length) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-[var(--muted)] font-semibold tabular-nums">
                  {captionCount} / {CAPTIONS.length}
                </span>
              </div>

              {/* Toggle Button */}
              <button
                type="button"
                onClick={toggleCaptionsReveal}
                className="w-full py-3.5 px-5 rounded-xl sunset-bg text-[#16061a] font-display text-lg tracking-wider uppercase font-bold flex items-center justify-between cursor-pointer hover:shadow-lg transition-all"
              >
                <span>{showCaptions ? 'Recolher legendas' : 'Ver todas as 200 legendas'}</span>
                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${showCaptions ? 'rotate-180' : ''}`} />
              </button>

              {/* Captions List */}
              {showCaptions && (
                <div className="max-h-[520px] overflow-y-auto flex flex-col gap-3 pr-2 scrollbar-thin mt-2">
                  {CAPTIONS.slice(0, captionCount).map((cap, idx) => {
                    const tagIndex = cap.indexOf(' #');
                    const textPart = tagIndex >= 0 ? cap.slice(0, tagIndex) : cap;
                    const tagsPart = tagIndex >= 0 ? cap.slice(tagIndex + 1).split(/\s+/) : [];

                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-[var(--surface2)] border border-[var(--line)] hover:border-[var(--purple)] transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 shadow-sm"
                      >
                        <div className="flex items-center justify-between sm:justify-start gap-3">
                          <span className="font-display text-xs sm:text-sm text-[var(--pink)] tabular-nums px-2 py-0.5 rounded-md bg-[var(--surface)] border border-[var(--line)]">
                            #{String(idx + 1).padStart(3, '0')}
                          </span>
                          
                          {/* Mobile Copy Button */}
                          <div className="sm:hidden">
                            <button
                              type="button"
                              onClick={() => copyText(cap, () => {
                                setCopiedCaptionIdx(idx);
                                setTimeout(() => setCopiedCaptionIdx(null), 1500);
                              })}
                              className="px-3 py-1 rounded-full border border-[var(--purple)] text-[var(--purple)] hover:bg-[var(--purple)]/10 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                            >
                              {copiedCaptionIdx === idx ? (
                                <><Check className="w-3.5 h-3.5" /> Copiada!</>
                              ) : (
                                <><Copy className="w-3.5 h-3.5" /> Copiar</>
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col gap-2">
                          <p className="text-sm sm:text-base leading-relaxed text-[var(--fg)] font-medium">
                            {textPart}
                          </p>
                          {tagsPart.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {tagsPart.map((tag, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="text-[11px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[var(--purple)]/15 text-[var(--purple)] border border-[var(--purple)]/20"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Desktop Copy Button */}
                        <div className="hidden sm:block shrink-0 pt-0.5">
                          <button
                            type="button"
                            onClick={() => copyText(cap, () => {
                              setCopiedCaptionIdx(idx);
                              setTimeout(() => setCopiedCaptionIdx(null), 1500);
                            })}
                            className="px-3.5 py-1.5 rounded-full border border-[var(--purple)] text-[var(--purple)] hover:bg-[var(--purple)]/10 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            {copiedCaptionIdx === idx ? (
                              <><Check className="w-3.5 h-3.5" /> Copiada!</>
                            ) : (
                              <><Copy className="w-3.5 h-3.5" /> Copiar</>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Section 2: 50 Ideias de Vídeos GTA 6 */}
            <section className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-5 sm:p-7 flex flex-col gap-5 shadow-md">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div>
                  <h3 className="font-display text-2xl sm:text-3xl uppercase tracking-wide">
                    50 Ideias de Vídeos & Roteiros · GTA 6
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--muted)]">
                    Ideias estruturadas com tema, título magnético, gancho principal e contexto de gravação.
                  </p>
                </div>
                <span className="self-start sm:self-auto text-xs uppercase tracking-wider font-bold px-3 py-1 rounded-full border border-[var(--teal)] text-[var(--teal)]">
                  50 ideias
                </span>
              </div>

              {/* Progress bar */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 rounded-full bg-[var(--surface2)] overflow-hidden">
                  <div
                    className="h-full sunset-bg transition-all duration-300"
                    style={{ width: `${(ideaCount / IDEAS.length) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-[var(--muted)] font-semibold tabular-nums">
                  {ideaCount} / {IDEAS.length}
                </span>
              </div>

              {/* Toggle Button */}
              <button
                type="button"
                onClick={toggleIdeasReveal}
                className="w-full py-3.5 px-5 rounded-xl sunset-bg text-[#16061a] font-display text-lg tracking-wider uppercase font-bold flex items-center justify-between cursor-pointer hover:shadow-lg transition-all"
              >
                <span>{showIdeas ? 'Recolher ideias' : 'Ver todas as 50 ideias de roteiro'}</span>
                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${showIdeas ? 'rotate-180' : ''}`} />
              </button>

              {/* Ideas List */}
              {showIdeas && (
                <div className="max-h-[550px] overflow-y-auto flex flex-col gap-4 pr-2 scrollbar-thin mt-2">
                  {IDEAS.slice(0, ideaCount).map((idea, idx) => {
                    const fullIdeaText = `${idea.t}\n\nIdeia principal: ${idea.ideia}\n\nContexto do conteúdo: ${idea.ctx}`;

                    return (
                      <div
                        key={idx}
                        className="p-5 sm:p-6 rounded-2xl bg-[var(--surface2)] border border-[var(--line)] hover:border-[var(--purple)] transition-all flex flex-col gap-3.5 shadow-sm"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[var(--line)]/50">
                          <span className="text-xs uppercase font-extrabold tracking-widest text-[var(--pink)] flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md bg-[var(--surface)] border border-[var(--line)]">
                              #{String(idx + 1).padStart(2, '0')}
                            </span>
                            <span>{idea.tema}</span>
                          </span>

                          {/* Quick copy actions */}
                          <div className="flex items-center gap-2 pt-1 sm:pt-0">
                            <button
                              type="button"
                              onClick={() => copyText(idea.t, () => {
                                setCopiedIdeaIdx({ id: idx, type: 'title' });
                                setTimeout(() => setCopiedIdeaIdx(null), 1500);
                              })}
                              className="px-3 py-1.5 rounded-full border border-[var(--purple)] text-[var(--purple)] hover:bg-[var(--purple)]/10 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                            >
                              {copiedIdeaIdx?.id === idx && copiedIdeaIdx?.type === 'title' ? (
                                <><Check className="w-3.5 h-3.5" /> Título copiado</>
                              ) : (
                                <><Copy className="w-3.5 h-3.5" /> Copiar título</>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => copyText(fullIdeaText, () => {
                                setCopiedIdeaIdx({ id: idx, type: 'all' });
                                setTimeout(() => setCopiedIdeaIdx(null), 1500);
                              })}
                              className="px-3 py-1.5 rounded-full border border-[var(--teal)] text-[var(--teal)] hover:bg-[var(--teal)]/10 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                            >
                              {copiedIdeaIdx?.id === idx && copiedIdeaIdx?.type === 'all' ? (
                                <><Check className="w-3.5 h-3.5" /> Tudo copiado</>
                              ) : (
                                <><Copy className="w-3.5 h-3.5" /> Copiar tudo</>
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Title */}
                        <div>
                          <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--teal)] block">
                            Título para o Short
                          </span>
                          <h4 className="text-base sm:text-lg font-bold text-[var(--fg)] mt-0.5 leading-snug">
                            {idea.t}
                          </h4>
                        </div>

                        {/* Core Idea */}
                        <div className="p-3 sm:p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--line)]/60">
                          <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--purple)] block">
                            Ideia Principal
                          </span>
                          <p className="text-xs sm:text-sm text-[var(--fg)]/95 mt-1 leading-relaxed font-normal">
                            {idea.ideia}
                          </p>
                        </div>

                        {/* Context */}
                        <div className="p-3 sm:p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--line)]/60">
                          <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--orange)] block">
                            Contexto do Conteúdo (Gravação)
                          </span>
                          <p className="text-xs sm:text-sm text-[var(--muted)] mt-1 leading-relaxed font-medium">
                            {idea.ctx}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </main>
        )}

        {/* ================= VIEW 4: CONFIGURAÇÕES ================= */}
        {currentTab === 'settings' && (
          <main className="py-6 max-w-xl mx-auto flex flex-col gap-6">
            <div>
              <h2 className="font-display text-4xl sm:text-5xl uppercase sunset font-black leading-none">
                Configurações
              </h2>
              <p className="text-sm text-[var(--muted)] mt-1">
                Personalize seu nome de criador e as preferências de visualização do painel.
              </p>
            </div>

            {/* Panel: Nome */}
            <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-6 flex flex-col gap-4 shadow-md">
              <div>
                <h3 className="text-lg font-bold">Seu nome ou apelido</h3>
                <p className="text-xs sm:text-sm text-[var(--muted)]">
                  É como a ferramenta chama você no painel e nas conversas com o mentor.
                </p>
              </div>

              <form 
                onSubmit={e => {
                  e.preventDefault();
                  const clean = settingsName.trim();
                  if (!clean) {
                    setSettingsToast('O nome não pode ficar vazio.');
                    return;
                  }
                  setState(prev => ({ ...prev, name: clean }));
                  setSettingsToast(`Nome salvo com sucesso! Olá, ${clean}.`);
                  setTimeout(() => setSettingsToast(''), 3000);
                }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <input
                  type="text"
                  maxLength={30}
                  value={settingsName}
                  onChange={e => setSettingsName(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border border-[var(--line)] bg-[var(--surface2)] text-base focus:outline-none focus:border-[var(--pink)]"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl sunset-bg text-[#16061a] font-display text-base tracking-wider uppercase font-bold shrink-0 cursor-pointer"
                >
                  Salvar nome
                </button>
              </form>
              {settingsToast && (
                <p className="text-xs text-[var(--teal)] font-semibold">
                  {settingsToast}
                </p>
              )}
            </div>

            {/* Panel: Tema */}
            <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-6 flex flex-col gap-4 shadow-md">
              <div>
                <h3 className="text-lg font-bold">Aparência do Painel</h3>
                <p className="text-xs sm:text-sm text-[var(--muted)]">
                  Alterne entre o tema escuro (modo neon gamer) e o tema claro.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setState(prev => ({ ...prev, theme: 'dark' }))}
                  className={`p-4 rounded-xl border flex items-center justify-center gap-2.5 font-bold text-sm cursor-pointer transition-all ${
                    state.theme === 'dark'
                      ? 'border-[var(--pink)] bg-[var(--surface2)] shadow-[0_0_12px_rgba(255,95,162,0.3)] text-white'
                      : 'border-[var(--line)] bg-[var(--surface2)] text-[var(--muted)]'
                  }`}
                >
                  <Moon className="w-4 h-4 text-[var(--purple)]" />
                  <span>Escuro</span>
                </button>

                <button
                  type="button"
                  onClick={() => setState(prev => ({ ...prev, theme: 'light' }))}
                  className={`p-4 rounded-xl border flex items-center justify-center gap-2.5 font-bold text-sm cursor-pointer transition-all ${
                    state.theme === 'light'
                      ? 'border-[var(--pink)] bg-[var(--surface2)] shadow-[0_0_12px_rgba(255,95,162,0.3)] text-black'
                      : 'border-[var(--line)] bg-[var(--surface2)] text-[var(--muted)]'
                  }`}
                >
                  <Sun className="w-4 h-4 text-[var(--orange)]" />
                  <span>Claro</span>
                </button>
              </div>
            </div>

            {/* Panel: Reiniciar progresso */}
            <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-6 flex flex-col gap-3 shadow-md">
              <h3 className="text-lg font-bold text-[#ffa45c]">Reiniciar trilha</h3>
              <p className="text-xs text-[var(--muted)]">
                Deseja recomeçar as tarefas da trilha do zero? Seu nome continuará salvo.
              </p>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Tem certeza de que deseja zerar o progresso das 6 etapas?')) {
                    setState(prev => ({
                      ...prev,
                      tasks: {},
                      done: {},
                      last: 0
                    }));
                    setCurrentStep(0);
                    setSettingsToast('Progresso reiniciado com sucesso.');
                    setTimeout(() => setSettingsToast(''), 3000);
                  }
                }}
                className="self-start px-4 py-2.5 rounded-xl border border-[var(--line)] text-xs font-bold text-[var(--muted)] hover:text-white hover:border-[#ffa45c] transition-colors cursor-pointer"
              >
                Zerar checklist da trilha
              </button>
            </div>
          </main>
        )}

      </div>

      {/* ================= FIXED BOTTOM NAVIGATION ================= */}
      <nav 
        className="fixed left-0 right-0 bottom-0 z-50 bg-[var(--bg)]/90 backdrop-blur-md border-t border-[var(--line)] px-4 py-2 transition-colors duration-300"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 8px)' }}
      >
        <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
          <button
            type="button"
            onClick={() => setCurrentTab('home')}
            className={`flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl transition-all cursor-pointer ${
              currentTab === 'home' 
                ? 'text-[var(--pink)] drop-shadow-[0_0_8px_rgba(255,95,162,0.4)]' 
                : 'text-[var(--muted)] hover:text-[var(--fg)]'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[11px] font-bold tracking-wider uppercase">Home</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentTab('play')}
            className={`flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl transition-all cursor-pointer ${
              currentTab === 'play' 
                ? 'text-[var(--pink)] drop-shadow-[0_0_8px_rgba(255,95,162,0.4)]' 
                : 'text-[var(--muted)] hover:text-[var(--fg)]'
            }`}
          >
            <PlayCircle className="w-5 h-5" />
            <span className="text-[11px] font-bold tracking-wider uppercase">Play</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentTab('titles')}
            className={`flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl transition-all cursor-pointer ${
              currentTab === 'titles' 
                ? 'text-[var(--pink)] drop-shadow-[0_0_8px_rgba(255,95,162,0.4)]' 
                : 'text-[var(--muted)] hover:text-[var(--fg)]'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span className="text-[11px] font-bold tracking-wider uppercase">Títulos</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentTab('settings')}
            className={`flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl transition-all cursor-pointer ${
              currentTab === 'settings' 
                ? 'text-[var(--pink)] drop-shadow-[0_0_8px_rgba(255,95,162,0.4)]' 
                : 'text-[var(--muted)] hover:text-[var(--fg)]'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="text-[11px] font-bold tracking-wider uppercase">Ajustes</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
