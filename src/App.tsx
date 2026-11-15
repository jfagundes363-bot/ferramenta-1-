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
  AlertCircle,
  Lightbulb,
  ShieldAlert,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { MODS, CAPTIONS, IDEAS, FUNNEL_PHASES, PLATFORM_RULES } from './data/noobToonData';
import { buildMentorLocalReply } from './data/mentorKnowledge';

function renderFormattedChatText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={idx} className="font-bold text-[var(--fg)]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

interface CreatorLinkCard {
  id: string;
  name: string;
  imageUrl: string;
  fallbackUrl: string;
}

const CREATOR_LINKS: CreatorLinkCard[] = [
  {
    id: 'davy-jones',
    name: 'Davy Jones',
    imageUrl: '/assets/creators/davy-jones.webp',
    fallbackUrl: 'https://i.imgur.com/s0kKjmkm.jpg',
  },
  {
    id: 'paulinho-loko',
    name: 'Paulinho Loko',
    imageUrl: '/assets/creators/paulinho-loko.webp',
    fallbackUrl: 'https://i.imgur.com/NasovCTm.jpg',
  },
  {
    id: 'coringa',
    name: 'Coringa',
    imageUrl: '/assets/creators/coringa.webp',
    fallbackUrl: 'https://i.imgur.com/MYvlm5Mm.jpg',
  },
  {
    id: 'games-edu',
    name: 'Games Edu',
    imageUrl: '/assets/creators/games-edu.webp',
    fallbackUrl: 'https://i.imgur.com/H11RafOm.jpg',
  },
  {
    id: 'alanzoka',
    name: 'Alanzoka',
    imageUrl: '/assets/creators/alanzoka.webp',
    fallbackUrl: 'https://i.imgur.com/bb5tKz7m.jpg',
  },
  {
    id: 'brksedu',
    name: 'BRKsEDU',
    imageUrl: '/assets/creators/brksedu.webp',
    fallbackUrl: 'https://i.imgur.com/ecPENwam.jpg',
  },
  {
    id: 'bistecone',
    name: 'Bistecone',
    imageUrl: '/assets/creators/bistecone.webp',
    fallbackUrl: 'https://i.imgur.com/qx4cSpAm.jpg',
  },
  {
    id: 'peter-jordan',
    name: 'Peter Jordan',
    imageUrl: '/assets/creators/peter-jordan.webp',
    fallbackUrl: 'https://i.imgur.com/sTernc3m.jpg',
  },
  {
    id: 'ishow-speed',
    name: 'IShow Speed',
    imageUrl: '/assets/creators/ishow-speed.webp',
    fallbackUrl: 'https://i.imgur.com/C1bens2m.jpg',
  },
  {
    id: 'cellbit',
    name: 'Cellbit',
    imageUrl: '/assets/creators/cellbit.webp',
    fallbackUrl: 'https://i.imgur.com/SkLE3vEm.jpg',
  },
  {
    id: 'nobru',
    name: 'Nobru',
    imageUrl: '/assets/creators/nobru.webp',
    fallbackUrl: 'https://i.imgur.com/vyIcAtgm.jpg',
  },
  {
    id: 'lipaogamer',
    name: 'LipaoGamer',
    imageUrl: '/assets/creators/lipaogamer.webp',
    fallbackUrl: 'https://i.imgur.com/TEFjSqvm.jpg',
  },
  {
    id: 'gabepeixe',
    name: 'Gabepeixe',
    imageUrl: '/assets/creators/gabepeixe.webp',
    fallbackUrl: 'https://i.imgur.com/JIjfAGfm.jpg',
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
  funnelDone?: Record<string, boolean>;
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
      funnelDone: {},
      last: 0,
      chats: {}
    };
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaultState, ...parsed, funnelDone: parsed.funnelDone || {} };
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
  
  const [currentTab, setCurrentTab] = useState<'home' | 'rules' | 'play' | 'titles' | 'ideas' | 'settings'>('home');
  const [expandedPhases, setExpandedPhases] = useState<Record<number, boolean>>(() => {
    const funnelMap = state.funnelDone || {};
    const firstOpenPhase = FUNNEL_PHASES.find(p => p.steps.some(s => !funnelMap[s.id]))?.id ?? 1;
    return { 1: firstOpenPhase === 1, 2: firstOpenPhase === 2, 3: firstOpenPhase === 3 };
  });
  const [currentStep, setCurrentStep] = useState<number>(() => {
    const savedStep = state.last ?? 0;
    return savedStep >= 0 && savedStep < MODS.length ? savedStep : 0;
  });
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

  const [clickedCreatorId, setClickedCreatorId] = useState<string | null>(null);

  const [settingsName, setSettingsName] = useState<string>(state.name);
  const [settingsToast, setSettingsToast] = useState<string>('');

  const [isDesktop, setIsDesktop] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const isPhoneUA = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isCoarsePointer = window.matchMedia?.('(pointer: coarse)').matches ?? false;
    if ((isPhoneUA || isCoarsePointer) && window.innerWidth < 1024) return false;
    return window.innerWidth >= 768;
  });

  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Detect device type (computer/notebook vs phone) and viewport resize
  useEffect(() => {
    const detectDevice = () => {
      const isPhoneUA = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isCoarsePointer = window.matchMedia?.('(pointer: coarse)').matches ?? false;
      if ((isPhoneUA || isCoarsePointer) && window.innerWidth < 1024) {
        setIsDesktop(false);
        return;
      }
      setIsDesktop(window.innerWidth >= 768);
    };
    detectDevice();
    window.addEventListener('resize', detectDevice);
    return () => window.removeEventListener('resize', detectDevice);
  }, []);

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

  // Funnel progress calculations (3 Phases / 9 Chronological Steps)
  const funnelDoneMap = state.funnelDone || {};
  const allFunnelSteps = FUNNEL_PHASES.flatMap(phase =>
    phase.steps.map(step => ({ ...step, phaseId: phase.id }))
  );
  const totalFunnelSteps = allFunnelSteps.length;
  const completedFunnelStepsCount = allFunnelSteps.filter(s => Boolean(funnelDoneMap[s.id])).length;
  const completedPhasesCount = FUNNEL_PHASES.filter(phase =>
    phase.steps.every(s => Boolean(funnelDoneMap[s.id]))
  ).length;
  const progressPercent = totalFunnelSteps > 0 ? Math.round((completedFunnelStepsCount / totalFunnelSteps) * 100) : 0;
  const allStagesDone = completedFunnelStepsCount === totalFunnelSteps;
  const nextPendingStep = allFunnelSteps.find(s => !funnelDoneMap[s.id]) || allFunnelSteps[0];

  const toggleFunnelStep = (stepId: string, phaseId: number) => {
    const currentlyDone = Boolean(funnelDoneMap[stepId]);
    const nextDoneValue = !currentlyDone;

    setState(prev => ({
      ...prev,
      funnelDone: {
        ...(prev.funnelDone || {}),
        [stepId]: nextDoneValue
      }
    }));

    if (nextDoneValue) {
      const phaseObj = FUNNEL_PHASES.find(p => p.id === phaseId);
      if (phaseObj) {
        const phaseWillComplete = phaseObj.steps.every(s =>
          s.id === stepId ? true : Boolean(funnelDoneMap[s.id])
        );
        if (phaseWillComplete && phaseId < FUNNEL_PHASES.length) {
          setExpandedPhases(prev => ({ ...prev, [phaseId + 1]: true }));
        }
      }
    }
  };

  const togglePhaseExpand = (phaseId: number) => {
    setExpandedPhases(prev => ({ ...prev, [phaseId]: !prev[phaseId] }));
  };

  const handleAdvanceStep = () => {
    if (allStagesDone) {
      handleSelectTab('play');
      return;
    }
    const targetPhaseId = nextPendingStep.phaseId;
    setExpandedPhases(prev => ({ ...prev, [targetPhaseId]: true }));
    setTimeout(() => {
      const el = document.getElementById(`funnel-step-${nextPendingStep.id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 60);
  };

  // Mentor Chat message submission
  const handleSendChat = async (promptText?: string) => {
    const textToSend = (promptText || chatInput).trim();
    if (!textToSend || isAiLoading) return;

    const currentChat = state.chats[currentStep] || [];
    const updatedChat: ChatMessage[] = [...currentChat, { role: 'user', content: textToSend }];
    const completedStepIds = allFunnelSteps.filter(s => Boolean(funnelDoneMap[s.id])).map(s => s.id);
    const mentorCtx = {
      userName: state.name,
      stepTitle: nextPendingStep.title,
      stepSummary: nextPendingStep.description,
      completedCount: completedFunnelStepsCount,
      totalSteps: totalFunnelSteps,
      completedStepIds,
      currentTab
    };

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
          history: currentChat,
          ...mentorCtx
        })
      });

      let reply = '';
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        reply = data.text || '';
      }

      if (!reply) {
        reply = buildMentorLocalReply(textToSend, mentorCtx);
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
      const fallbackReply = buildMentorLocalReply(textToSend, mentorCtx);
      setState(prev => ({
        ...prev,
        chats: {
          ...prev.chats,
          [currentStep]: [
            ...(prev.chats[currentStep] || []),
            {
              role: 'bot',
              content: fallbackReply
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

  // Filtered funnel phases based on search query
  const queryNormalized = searchQuery.toLowerCase().trim();
  const filteredPhases = FUNNEL_PHASES.map(phase => {
    if (!queryNormalized) return phase;
    const phaseMatches = `${phase.title} ${phase.subtitle}`.toLowerCase().includes(queryNormalized);
    const matchingSteps = phase.steps.filter(step =>
      `${step.title} ${step.description}`.toLowerCase().includes(queryNormalized)
    );
    if (phaseMatches) return phase;
    if (matchingSteps.length > 0) return { ...phase, steps: matchingSteps };
    return null;
  }).filter((p): p is NonNullable<typeof p> => p !== null);

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
  const curMod = MODS[currentStep] || MODS[0];

  const navItems: Array<{ id: 'home' | 'rules' | 'play' | 'titles' | 'ideas' | 'settings'; label: string; mobileLabel?: string; icon: React.ReactNode }> = [
    { id: 'home', label: 'Inicial', mobileLabel: 'Inicial', icon: <Home className="w-5 h-5 shrink-0" /> },
    { id: 'rules', label: 'Restrições e Regras', mobileLabel: 'Regras', icon: <ShieldAlert className="w-5 h-5 shrink-0" /> },
    { id: 'play', label: 'Play', mobileLabel: 'Play', icon: <PlayCircle className="w-5 h-5 shrink-0" /> },
    { id: 'titles', label: 'Títulos', mobileLabel: 'Títulos', icon: <FileText className="w-5 h-5 shrink-0" /> },
    { id: 'ideas', label: 'Ideias', mobileLabel: 'Ideias', icon: <Lightbulb className="w-5 h-5 shrink-0" /> },
    { id: 'settings', label: 'Ajustes', mobileLabel: 'Ajustes', icon: <Settings className="w-5 h-5 shrink-0" /> },
  ];

  const handleSelectTab = (tab: 'home' | 'rules' | 'play' | 'titles' | 'ideas' | 'settings') => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className={`min-h-screen bg-[var(--bg)] text-[var(--fg)] transition-colors duration-300 ${isDesktop ? 'pl-60 xl:pl-64 pb-12' : 'pb-28'}`}>
      {/* ================= DESKTOP / NOTEBOOK LEFT SIDEBAR ================= */}
      {isDesktop && (
        <aside className="fixed top-0 left-0 bottom-0 z-40 w-60 xl:w-64 bg-[var(--surface)]/95 backdrop-blur-md border-r border-[var(--line)] flex flex-col justify-between p-4 transition-colors duration-300">
          <div className="flex flex-col gap-1.5 pt-2">
            <span className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--muted)]">
              Menu
            </span>
            <nav className="flex flex-col gap-1.5" aria-label="Navegação principal">
              {navItems.map(item => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left transition-all cursor-pointer border ${
                      isActive
                        ? 'border-[var(--pink)]/50 bg-gradient-to-r from-[var(--pink)]/15 to-[var(--purple)]/10 text-[var(--pink)] shadow-[0_0_16px_rgba(255,95,162,0.18)]'
                        : 'border-transparent text-[var(--muted)] hover:text-[var(--fg)] hover:bg-[var(--surface2)]/70'
                    }`}
                  >
                    <span className={`w-1 h-5 rounded-full shrink-0 transition-all ${isActive ? 'sunset-bg' : 'bg-transparent'}`} />
                    {item.icon}
                    <span className="text-xs font-bold tracking-wider uppercase leading-tight">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--surface2)] border border-[var(--line)] flex flex-col gap-2.5 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--fg)]">
              Quase lá
            </span>
            <div className="flex items-center gap-2.5">
              <div className="h-2.5 flex-1 rounded-full bg-[var(--bg)] border border-[var(--line)]/80 overflow-hidden">
                <div
                  className="h-full sunset-bg rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(255,95,162,0.5)]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-xs font-bold text-[var(--teal)] tabular-nums shrink-0">
                {progressPercent}%
              </span>
            </div>
            <span className="text-[11px] text-[var(--muted)] tabular-nums font-medium">
              {completedFunnelStepsCount} de {totalFunnelSteps} passos
            </span>
          </div>
        </aside>
      )}

      {/* Top Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-5">
        
        {/* Top Desktop & Mobile Header Bar */}
        <header className="mb-6 flex items-center justify-between border-b border-[var(--line)]/70 pb-4">

          {/* Selected Header Area: Large Image in the right corner */}
          <div className="flex items-center justify-end ml-auto mr-3 sm:mr-5">
            <img
              src="/assets/banner_header.webp"
              onError={(e) => {
                if (!e.currentTarget.dataset.fallbackApplied) {
                  e.currentTarget.dataset.fallbackApplied = '1';
                  e.currentTarget.src = '/assets/banner_header.png';
                }
              }}
              alt="GTA VI"
              decoding="async"
              fetchPriority="high"
              className={`w-auto max-h-[175px] object-contain drop-shadow-[0_0_30px_rgba(255,95,162,0.55)] hover:scale-105 transition-transform ${
                isDesktop ? 'h-24 lg:h-28 xl:h-36' : 'h-24 sm:h-32 md:h-36 lg:h-44'
              }`}
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
              <div className="flex items-stretch gap-4 sm:gap-6 bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-5 sm:p-7 shadow-md">
                <img
                  src="/assets/step_icon.png"
                  onError={(e) => {
                    e.currentTarget.src = 'https://i.imgur.com/HdWKfNg.png';
                  }}
                  alt="Ícone Noob Toon"
                  decoding="async"
                  className="w-24 sm:w-36 md:w-44 self-stretch object-contain shrink-0 rounded-xl drop-shadow-[0_0_16px_rgba(255,95,162,0.4)]"
                />
                <div className="flex flex-1 flex-col justify-center gap-2 min-w-0">
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
                      {completedPhasesCount} de {FUNNEL_PHASES.length} fases concluídas
                    </strong>
                    <span className="text-xs sm:text-sm text-[var(--muted)] tabular-nums">
                      {completedFunnelStepsCount} de {totalFunnelSteps} passos concluídos
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
                    ? `Parabéns, ${state.name}! Você completou todas as ${FUNNEL_PHASES.length} fases da trilha. Seus vídeos e títulos já estão liberados no Play!`
                    : completedFunnelStepsCount === 0
                    ? 'Comece pela Fase 1 (Passo 1.1). Siga o passo a passo para criar e blindar seu canal.'
                    : `Ótimo ritmo! Faltam apenas ${totalFunnelSteps - completedFunnelStepsCount} passos para finalizar sua jornada.`}
                </p>

                {/* Continue CTA */}
                <button
                  type="button"
                  onClick={handleAdvanceStep}
                  className="w-full py-3.5 px-5 rounded-xl sunset-bg text-[#16061a] font-display text-lg tracking-wider uppercase font-bold flex items-center justify-between shadow-[0_0_18px_rgba(255,95,162,0.3)] hover:shadow-[0_0_28px_rgba(255,95,162,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                >
                  <div className="flex flex-col text-left min-w-0 pr-2">
                    <span className="truncate">{allStagesDone ? 'Ir para o Play' : 'Continuar de onde parei'}</span>
                    <small className="font-sans text-xs normal-case font-semibold opacity-85 truncate">
                      {allStagesDone ? 'Próxima etapa · Seus Shorts prontos' : nextPendingStep.title}
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
                placeholder="Pesquisar fase ou passo (ex.: gmail, branding, studio, shorts, tiktok)"
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
          </header>
        )}

        {/* ================= VIEW 1: INICIAL (TRILHA CRONOLÓGICA DE 3 FASES + MENTOR) ================= */}
        {currentTab === 'home' && (
          <main className="flex flex-col gap-6">
            {/* Overall Trail Progress Header */}
            <section className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-5 sm:p-6 flex flex-col gap-4 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] font-bold text-[var(--teal)]">
                    Trilha Passo a Passo · {FUNNEL_PHASES.length} Fases
                  </p>
                  <h3 className="font-display text-2xl sm:text-3xl uppercase tracking-wide mt-0.5">
                    Do Zero à Rotina Diária de Postagens
                  </h3>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-xs uppercase tracking-wider font-bold px-3 py-1 rounded-full border border-[var(--teal)]/40 text-[var(--teal)] bg-[var(--surface2)] tabular-nums">
                    {completedFunnelStepsCount}/{totalFunnelSteps} passos ({progressPercent}%)
                  </span>
                </div>
              </div>

              {/* Overall Trail Progress Bar */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2.5 rounded-full bg-[var(--surface2)] border border-[var(--line)]/80 overflow-hidden">
                  <div
                    className="h-full sunset-bg rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(255,95,162,0.45)]"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-[var(--fg)] tabular-nums shrink-0">
                  {progressPercent}%
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--muted)]">
                <span>
                  {allStagesDone
                    ? 'Todas as fases foram concluídas!'
                    : `Próximo passo recomendado: ${nextPendingStep.title}`}
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setExpandedPhases({ 1: true, 2: true, 3: true })}
                    className="font-bold text-[var(--purple)] hover:underline cursor-pointer"
                  >
                    Expandir todas
                  </button>
                  <button
                    type="button"
                    onClick={handleAdvanceStep}
                    className="font-bold text-[var(--pink)] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>{allStagesDone ? 'Ir para Vídeos' : 'Ir para próximo passo'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </section>

            {/* 3 Chronological Phases Accordion/Stepper */}
            {filteredPhases.length === 0 ? (
              <div className="p-8 border border-dashed border-[var(--line)] rounded-2xl bg-[var(--surface)] text-center text-sm text-[var(--muted)]">
                Nenhum passo encontrado para "{searchQuery}".
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="block mx-auto mt-2 text-xs font-bold text-[var(--pink)] underline cursor-pointer"
                >
                  Limpar filtro
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {filteredPhases.map(phase => {
                  const phaseCompletedCount = phase.steps.filter(s => Boolean(funnelDoneMap[s.id])).length;
                  const isPhaseDone = phaseCompletedCount === phase.steps.length;
                  const isPhaseInProgress = phaseCompletedCount > 0 && !isPhaseDone;
                  const isExpanded = queryNormalized ? true : Boolean(expandedPhases[phase.id]);

                  return (
                    <section
                      key={phase.id}
                      className={`bg-[var(--surface)] border rounded-2xl overflow-hidden shadow-md transition-all ${
                        isPhaseDone
                          ? 'border-[var(--teal)]/50'
                          : isExpanded
                          ? 'border-[var(--pink)]/45 shadow-[0_0_24px_rgba(255,95,162,0.12)]'
                          : 'border-[var(--line)]'
                      }`}
                    >
                      {/* Phase Header (Expand / Collapse) */}
                      <button
                        type="button"
                        onClick={() => togglePhaseExpand(phase.id)}
                        className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left hover:bg-[var(--surface2)]/40 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                          <div
                            className={`relative w-10 h-10 rounded-xl grid place-items-center shrink-0 border-2 p-1 transition-all ${
                              isPhaseDone
                                ? 'border-[var(--teal)] bg-[var(--teal)]/15 shadow-[0_0_12px_rgba(62,230,208,0.25)]'
                                : isPhaseInProgress || isExpanded
                                ? 'border-[var(--pink)] bg-[var(--pink)]/15 shadow-[0_0_12px_rgba(255,95,162,0.25)]'
                                : 'border-[var(--line)] bg-[var(--surface2)]'
                            }`}
                          >
                            <img
                              src="/assets/step_icon.png"
                              onError={(e) => {
                                e.currentTarget.src = 'https://i.imgur.com/HdWKfNg.png';
                              }}
                              alt={`Fase ${phase.id}`}
                              decoding="async"
                              className="w-full h-full object-contain rounded-lg"
                            />
                            {isPhaseDone && (
                              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[var(--teal)] text-[#061816] grid place-items-center shadow">
                                <Check className="w-2.5 h-2.5 stroke-[3.5]" />
                              </span>
                            )}
                          </div>

                          <div className="flex flex-col gap-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full border ${
                                  isPhaseDone
                                    ? 'border-[var(--teal)] text-[var(--teal)]'
                                    : isPhaseInProgress
                                    ? 'border-[var(--orange)] text-[var(--orange)]'
                                    : 'border-[var(--line)] text-[var(--muted)]'
                                }`}
                              >
                                {isPhaseDone ? 'Fase concluída' : isPhaseInProgress ? 'Em andamento' : 'Pendente'}
                              </span>
                              <span className="text-xs font-semibold text-[var(--muted)] tabular-nums">
                                {phaseCompletedCount}/{phase.steps.length} passos
                              </span>
                            </div>
                            <h3 className="font-display text-xl sm:text-2xl uppercase tracking-wide text-[var(--fg)] leading-snug">
                              {phase.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-[var(--muted)]">
                              {phase.subtitle}
                            </p>
                          </div>
                        </div>

                        <ChevronDown
                          className={`w-5 h-5 shrink-0 text-[var(--muted)] transition-transform duration-300 ${
                            isExpanded ? 'rotate-180 text-[var(--pink)]' : ''
                          }`}
                        />
                      </button>

                      {/* Phase Steps Checklist */}
                      {isExpanded && (
                        <div className="border-t border-[var(--line)] p-4 sm:p-6 flex flex-col gap-4 relative bg-[var(--bg)]/35">
                          {phase.steps.map((step, sIdx) => {
                            const isStepDone = Boolean(funnelDoneMap[step.id]);
                            const isNextStep = !allStagesDone && nextPendingStep.id === step.id;

                            return (
                              <div
                                key={step.id}
                                id={`funnel-step-${step.id}`}
                                className={`relative rounded-xl border p-4 sm:p-5 transition-all flex flex-col gap-3.5 ${
                                  isStepDone
                                    ? 'border-[var(--teal)]/45 bg-[var(--surface)]/80'
                                    : isNextStep
                                    ? 'border-[var(--pink)]/60 bg-[var(--surface)] shadow-[0_0_16px_rgba(255,95,162,0.16)]'
                                    : 'border-[var(--line)] bg-[var(--surface)]'
                                }`}
                              >
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                                  <div className="flex items-start gap-3.5 min-w-0">
                                    {/* Sequential Step Icon (Left corner of each stage) */}
                                    <div
                                      className={`relative w-10 h-10 rounded-xl grid place-items-center shrink-0 border-2 p-1 mt-0.5 transition-all ${
                                        isStepDone
                                          ? 'border-[var(--teal)] bg-[var(--teal)]/15 shadow-[0_0_12px_rgba(62,230,208,0.25)]'
                                          : isNextStep
                                          ? 'border-[var(--pink)] bg-[var(--pink)]/15 shadow-[0_0_12px_rgba(255,95,162,0.25)]'
                                          : 'border-[var(--line)] bg-[var(--surface2)]'
                                      }`}
                                    >
                                      <img
                                        src="/assets/step_icon.png"
                                        onError={(e) => {
                                          e.currentTarget.src = 'https://i.imgur.com/HdWKfNg.png';
                                        }}
                                        alt={`Etapa ${step.code}`}
                                        decoding="async"
                                        className="w-full h-full object-contain rounded-lg"
                                      />
                                      {isStepDone && (
                                        <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[var(--teal)] text-[#061816] grid place-items-center shadow">
                                          <Check className="w-2.5 h-2.5 stroke-[3.5]" />
                                        </span>
                                      )}
                                    </div>

                                    <div className="flex flex-col gap-1.5 min-w-0">
                                      <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--orange)]">
                                          Etapa {sIdx + 1} de {phase.steps.length}
                                        </span>
                                        {isNextStep && !isStepDone && (
                                          <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-[var(--pink)]/15 text-[var(--pink)] border border-[var(--pink)]/30">
                                            Passo atual
                                          </span>
                                        )}
                                      </div>
                                      <h4
                                        className={`text-base sm:text-lg font-bold leading-snug transition-colors ${
                                          isStepDone ? 'line-through text-[var(--muted)] decoration-[var(--teal)]' : 'text-[var(--fg)]'
                                        }`}
                                      >
                                        {step.title}
                                      </h4>
                                      <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                                        {step.description}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Step Action Bar: Quick Shortcuts + "Marcar como concluído" Checkbox/Button */}
                                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[var(--line)]/60">
                                  <div className="flex flex-wrap items-center gap-2">
                                    {step.actionHref && (
                                      <a
                                        href={step.actionHref}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--purple)]/50 bg-[var(--surface2)] text-xs font-bold text-[var(--purple)] hover:bg-[var(--purple)]/15 transition-colors no-underline"
                                      >
                                        <span>{step.actionLabel || 'Acessar'}</span>
                                        <ExternalLink className="w-3.5 h-3.5" />
                                      </a>
                                    )}
                                    {step.actionTab && (
                                      <button
                                        type="button"
                                        onClick={() => handleSelectTab(step.actionTab!)}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--pink)]/50 bg-[var(--surface2)] text-xs font-bold text-[var(--pink)] hover:bg-[var(--pink)]/15 transition-colors cursor-pointer"
                                      >
                                        <span>{step.actionLabel}</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                    {step.secondaryTab && (
                                      <button
                                        type="button"
                                        onClick={() => handleSelectTab(step.secondaryTab!)}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--teal)]/40 bg-[var(--surface2)] text-xs font-bold text-[var(--teal)] hover:bg-[var(--teal)]/15 transition-colors cursor-pointer"
                                      >
                                        <span>{step.secondaryLabel}</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>

                                  <label
                                    className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all select-none border ml-auto ${
                                      isStepDone
                                        ? 'border-[var(--teal)] bg-[var(--teal)]/15 text-[var(--teal)]'
                                        : 'border-[var(--pink)]/50 sunset-bg text-[#16061a] shadow-[0_0_14px_rgba(255,95,162,0.3)] hover:shadow-[0_0_20px_rgba(255,95,162,0.5)]'
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isStepDone}
                                      onChange={() => toggleFunnelStep(step.id, phase.id)}
                                      className="w-4 h-4 rounded accent-[var(--teal)] cursor-pointer"
                                    />
                                    <span>{isStepDone ? 'Concluído' : 'Marcar como concluído'}</span>
                                  </label>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </section>
                  );
                })}
              </div>
            )}

            {/* All Phases Completed Banner */}
            {allStagesDone && (
              <div className="p-6 sm:p-7 rounded-2xl border border-[var(--pink)]/40 bg-[var(--surface)] text-center flex flex-col items-center gap-3 shadow-xl">
                <div className="text-xs uppercase tracking-[0.25em] font-bold text-[var(--teal)]">
                  Trilha completa
                </div>
                <h3 className="font-display text-3xl sm:text-4xl uppercase sunset font-black">
                  Parabéns, {state.name}!
                </h3>
                <p className="text-sm sm:text-base text-[var(--muted)] max-w-md">
                  Você concluiu todas as {FUNNEL_PHASES.length} fases do funil. Confira as regras de proteção e baixe seus vídeos prontos para postar!
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 mt-1">
                  <button
                    type="button"
                    onClick={() => handleSelectTab('rules')}
                    className="px-5 py-3 rounded-xl border border-[var(--purple)] text-[var(--purple)] hover:bg-[var(--purple)]/15 font-display text-base uppercase tracking-wider font-bold cursor-pointer transition-all"
                  >
                    Ver Restrições e Regras
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectTab('play')}
                    className="px-6 py-3 rounded-xl sunset-bg text-[#16061a] font-display text-base uppercase tracking-wider font-bold shadow-[0_0_20px_rgba(255,95,162,0.35)] hover:-translate-y-0.5 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <span>Ir para Vídeos Prontos</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

              {/* Mentor Noob Tom Section */}
              <aside className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl overflow-hidden shadow-lg">
                {/* Accordion header */}
                <button
                  type="button"
                  onClick={() => setMentorOpen(!mentorOpen)}
                  className="w-full p-6 sm:p-7 flex items-center justify-between gap-4 text-left hover:bg-[var(--surface2)]/50 transition-colors cursor-pointer"
                >
                  <strong className="font-display text-2xl sm:text-3xl uppercase tracking-wide text-[var(--fg)]">
                    Mentor Noob Tom
                  </strong>
                  <ChevronDown className={`w-6 h-6 text-[var(--muted)] transition-transform duration-300 ${mentorOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Accordion body */}
                {mentorOpen && (
                  <div className="border-t border-[var(--line)] p-6 sm:p-8 flex flex-col gap-6 min-h-[200px] justify-between">
                    {/* Chat Messages Log (only rendered when conversation has messages or loading) */}
                    {((state.chats[currentStep] || []).length > 0 || isAiLoading) && (
                      <div 
                        ref={chatScrollRef}
                        className="max-h-[440px] overflow-y-auto flex flex-col gap-3.5 pr-2 scrollbar-thin"
                      >
                        {(state.chats[currentStep] || []).map((msg, i) => (
                          <div
                            key={i}
                            className={`p-4 rounded-xl text-sm sm:text-base max-w-[92%] leading-relaxed ${
                              msg.role === 'user'
                                ? 'self-end bg-gradient-to-r from-[var(--pink)]/20 to-[var(--purple)]/20 border border-[var(--pink)]/30 text-[var(--fg)]'
                                : 'self-start bg-[var(--surface2)] border border-[var(--line)] text-[var(--fg)]'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 font-bold text-xs mb-1.5 opacity-75">
                              {msg.role === 'user' ? (
                                <><User className="w-3.5 h-3.5" /> Você</>
                              ) : (
                                <><Bot className="w-3.5 h-3.5" /> Mentor Noob Tom</>
                              )}
                            </div>
                            <div className="whitespace-pre-wrap">{renderFormattedChatText(msg.content)}</div>
                          </div>
                        ))}

                        {isAiLoading && (
                          <div className="p-4 rounded-xl bg-[var(--surface2)] border border-[var(--line)] text-sm sm:text-base self-start flex items-center gap-2 text-[var(--muted)]">
                            <Sparkles className="w-4 h-4 animate-spin text-[var(--pink)]" />
                            <span>Mentor Noob Tom está formulando sua resposta...</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Single Question Input Form */}
                    <form 
                      onSubmit={e => {
                        e.preventDefault();
                        handleSendChat();
                      }} 
                      className="flex gap-3 items-center w-full"
                    >
                      <input
                        type="text"
                        value={chatInput}
                        onChange={e => setChatInput(e.target.value)}
                        placeholder="Digite sua dúvida aqui"
                        className="flex-1 px-5 py-4 rounded-xl border border-[var(--line)] bg-[var(--surface2)] text-base text-[var(--fg)] placeholder:text-[var(--muted)]/70 focus:outline-none focus:border-[var(--pink)] focus:ring-2 focus:ring-[var(--pink)]/20 transition-all"
                      />
                      <button
                        type="submit"
                        disabled={isAiLoading || !chatInput.trim()}
                        className="h-14 px-6 rounded-xl sunset-bg text-[#16061a] font-display text-base uppercase tracking-wider font-bold disabled:opacity-50 flex items-center justify-center cursor-pointer shadow-[0_0_16px_rgba(255,95,162,0.3)] hover:shadow-[0_0_24px_rgba(255,95,162,0.5)] transition-all"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </form>
                  </div>
                )}
              </aside>
          </main>
        )}

        {/* ================= VIEW: RESTRIÇÕES E REGRAS ================= */}
        {currentTab === 'rules' && (
          <main className="py-6 flex flex-col gap-8">
            <div className="flex flex-col gap-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full border border-[var(--orange)]/40 bg-[var(--orange)]/10 text-[var(--orange)] text-xs font-bold uppercase tracking-wider">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Proteção do Canal</span>
              </div>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl uppercase sunset font-black leading-[1.2] pt-3">
                Regras de Ouro e Restrições das Plataformas
              </h2>
              <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed">
                Siga estas diretrizes antes de postar para proteger seu canal contra bloqueios, shadowban e desmonetização.
              </p>
            </div>

            {/* 6 Alert Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {PLATFORM_RULES.map(rule => (
                <article
                  key={rule.id}
                  className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-5 sm:p-6 flex flex-col gap-4 shadow-md hover:border-[var(--purple)]/60 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 flex items-center justify-center shrink-0 font-display text-base font-bold">
                      0{rule.id}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-[var(--fg)] leading-snug pt-0.5">
                      {rule.title}
                    </h3>
                  </div>

                  {/* O que NÃO fazer */}
                  <div className="p-3.5 sm:p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-500 dark:text-red-400">
                      <XCircle className="w-4 h-4 shrink-0" />
                      <span>O que NÃO fazer</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[var(--fg)]/90 leading-relaxed">
                      {rule.dont}
                    </p>
                  </div>

                  {/* Como fazer do jeito certo */}
                  {rule.doRight && (
                    <div className="p-3.5 sm:p-4 rounded-xl bg-[var(--teal)]/10 border border-[var(--teal)]/30 flex flex-col gap-1.5 mt-auto">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--teal)]">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>Como fazer do jeito certo</span>
                      </div>
                      <p className="text-xs sm:text-sm text-[var(--fg)]/90 leading-relaxed">
                        {rule.doRight}
                      </p>
                    </div>
                  )}
                </article>
              ))}
            </div>

            {/* Confirmation Banner */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--pink)]/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-5">
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-12 h-12 rounded-2xl sunset-bg text-[#16061a] flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(255,95,162,0.35)]">
                  <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-display text-2xl sm:text-3xl uppercase tracking-wide text-[var(--fg)]">
                    Entendi as regras e estou pronto para postar
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--muted)] mt-0.5">
                    Agora baixe seu vídeo limpo e sem marcas d&apos;água na aba de Vídeos Prontos.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSelectTab('play')}
                className="w-full md:w-auto px-6 py-4 rounded-xl sunset-bg text-[#16061a] font-display text-lg tracking-wider uppercase font-bold shadow-[0_0_20px_rgba(255,95,162,0.35)] hover:shadow-[0_0_30px_rgba(255,95,162,0.55)] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
              >
                <span>Ir para Vídeos Prontos</span>
                <ArrowRight className="w-5 h-5 shrink-0" />
              </button>
            </div>
          </main>
        )}

        {/* ================= VIEW 2: PLAY (LINKS DE CRIADORES) ================= */}
        {currentTab === 'play' && (
          <main className="py-6 flex flex-col gap-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex flex-col gap-2 max-w-2xl">
                <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl uppercase sunset font-black leading-[1.2] pt-3">
                  Dê o Play
                </h2>
                <p className="font-display text-2xl sm:text-3xl uppercase tracking-wide text-[var(--fg)]">
                  Selecione um criador abaixo para{' '}
                  <span className="sunset">acessar os links de conteúdo.</span>
                </p>
              </div>
            </div>

            {/* Creator Link Cards Grid */}
            <section className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {CREATOR_LINKS.map((creator, idx) => {
                  const isSelected = clickedCreatorId === creator.id;
                  return (
                    <article
                      key={creator.id}
                      className={`group rounded-2xl bg-[var(--surface)] border transition-all duration-200 p-4 sm:p-5 flex flex-col gap-4 shadow-md ${
                        isSelected
                          ? 'border-[var(--pink)] shadow-[0_0_24px_rgba(255,95,162,0.22)]'
                          : 'border-[var(--line)] hover:border-[var(--purple)]/60'
                      }`}
                    >
                      {/* Creator Image & Name above the link button */}
                      <div className="flex flex-col items-center gap-3.5 pt-1">
                        <div className="relative mx-auto w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden">
                          <img
                            src={creator.imageUrl}
                            onError={(e) => {
                              if (!e.currentTarget.dataset.fallbackApplied) {
                                e.currentTarget.dataset.fallbackApplied = '1';
                                e.currentTarget.src = creator.fallbackUrl;
                              }
                            }}
                            alt={creator.name}
                            width={176}
                            height={176}
                            loading={idx < 6 ? 'eager' : 'lazy'}
                            decoding="async"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover rounded-full scale-[1.08] group-hover:scale-[1.14] transition-transform duration-300"
                          />
                        </div>

                        <h3 className="font-display text-2xl sm:text-3xl uppercase tracking-wide text-[var(--fg)] text-center">
                          {creator.name}
                        </h3>
                      </div>

                      {/* Click-only button placeholder (link access removed until user provides URLs) */}
                      <button
                        type="button"
                        onClick={() =>
                          setClickedCreatorId((prev) => (prev === creator.id ? null : creator.id))
                        }
                        className={`mt-auto w-full py-3.5 px-5 rounded-xl font-display text-lg tracking-wider uppercase font-bold transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.97] ${
                          isSelected
                            ? 'bg-[var(--surface2)] text-[var(--pink)] border border-[var(--pink)]/60 shadow-[0_0_16px_rgba(255,95,162,0.2)]'
                            : 'sunset-bg text-[#16061a] shadow-[0_0_20px_rgba(255,95,162,0.3)] hover:shadow-[0_0_28px_rgba(255,95,162,0.5)] hover:-translate-y-0.5'
                        }`}
                      >
                        <span>{isSelected ? 'Link em breve' : 'Acessar Link'}</span>
                        <ArrowRight className="w-4 h-4 shrink-0" />
                      </button>
                    </article>
                  );
                })}
              </div>
            </section>

            {/* Centered GTA 6 Theme All-Creators Card */}
            {(() => {
              const isAllSelected = clickedCreatorId === 'all-creators';
              return (
                <div className="flex justify-center pt-2">
                  <article
                    className={`w-full max-w-xl rounded-2xl p-[1px] transition-all duration-300 ${
                      isAllSelected
                        ? 'bg-gradient-to-r from-[var(--orange)] via-[var(--pink)] to-[var(--teal)] shadow-[0_0_34px_rgba(255,95,162,0.38)]'
                        : 'bg-gradient-to-r from-[var(--orange)]/75 via-[var(--pink)]/75 to-[var(--purple)]/75 shadow-[0_0_24px_rgba(255,95,162,0.2)] hover:shadow-[0_0_32px_rgba(255,95,162,0.35)]'
                    }`}
                  >
                    <div className="rounded-2xl bg-[var(--surface)] bg-gradient-to-br from-[#ff9c59]/12 via-[#ff5fa2]/10 to-[#a86bff]/14 p-6 sm:p-8 flex flex-col items-center text-center gap-5">
                      <h3 className="font-display text-2xl sm:text-3xl uppercase tracking-wide text-[var(--fg)] leading-snug">
                        Acesse conteúdos de{' '}
                        <span className="sunset">todos os criadores aqui</span>
                      </h3>

                      <button
                        type="button"
                        onClick={() =>
                          setClickedCreatorId((prev) =>
                            prev === 'all-creators' ? null : 'all-creators'
                          )
                        }
                        className={`w-full max-w-sm py-3.5 px-5 rounded-xl font-display text-lg tracking-wider uppercase font-bold transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.97] ${
                          isAllSelected
                            ? 'bg-[var(--surface2)] text-[var(--pink)] border border-[var(--pink)]/60 shadow-[0_0_16px_rgba(255,95,162,0.2)]'
                            : 'sunset-bg text-[#16061a] shadow-[0_0_20px_rgba(255,95,162,0.3)] hover:shadow-[0_0_28px_rgba(255,95,162,0.5)] hover:-translate-y-0.5'
                        }`}
                      >
                        <span>{isAllSelected ? 'Link em breve' : 'Acessar Link'}</span>
                        <ArrowRight className="w-4 h-4 shrink-0" />
                      </button>
                    </div>
                  </article>
                </div>
              );
            })()}
          </main>
        )}

        {/* ================= VIEW 3: TÍTULOS (200 LEGENDAS) ================= */}
        {currentTab === 'titles' && (
          <main className="py-6 flex flex-col gap-8">
            <div>
              <h2 className="font-display text-5xl sm:text-6xl uppercase sunset font-black leading-[1.2] pt-3">
                Títulos & Legendas
              </h2>
              <p className="text-base sm:text-lg text-[var(--muted)] mt-2">
                200 legendas prontas com hashtags otimizadas para os seus Shorts.
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
          </main>
        )}

        {/* ================= VIEW 4: IDEIAS DE VÍDEOS (50 IDEIAS GTA 6) ================= */}
        {currentTab === 'ideas' && (
          <main className="py-6 flex flex-col gap-8">
            <div>
              <h2 className="font-display text-5xl sm:text-6xl uppercase sunset font-black leading-[1.2] pt-3">
                Ideias de Vídeos
              </h2>
              <p className="text-base sm:text-lg text-[var(--muted)] mt-2">
                50 ideias completas com tema, título magnético, gancho principal e contexto de gravação para Shorts.
              </p>
            </div>

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
              <h2 className="font-display text-4xl sm:text-5xl uppercase sunset font-black leading-[1.2] pt-3">
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
                  if (window.confirm(`Tem certeza de que deseja zerar o progresso das ${FUNNEL_PHASES.length} fases da trilha?`)) {
                    setState(prev => ({
                      ...prev,
                      tasks: {},
                      done: {},
                      funnelDone: {},
                      last: 0
                    }));
                    setCurrentStep(0);
                    setExpandedPhases({ 1: true, 2: false, 3: false });
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

      {/* ================= MOBILE FIXED BOTTOM NAVIGATION (PHONES ONLY) ================= */}
      {!isDesktop && (
        <nav 
          className="fixed left-0 right-0 bottom-0 z-50 bg-[var(--bg)]/90 backdrop-blur-md border-t border-[var(--line)] px-1.5 py-2 transition-colors duration-300"
          style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 8px)' }}
        >
          <div className="max-w-lg mx-auto grid grid-cols-6 gap-0.5">
            {navItems.map(item => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectTab(item.id)}
                  className={`flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? 'text-[var(--pink)] drop-shadow-[0_0_8px_rgba(255,95,162,0.4)]'
                      : 'text-[var(--muted)] hover:text-[var(--fg)]'
                  }`}
                >
                  {item.icon}
                  <span className="text-[9px] sm:text-[11px] font-bold tracking-wider uppercase truncate max-w-full">
                    {item.mobileLabel || item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
