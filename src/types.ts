export interface StageLink {
  href: string;
  label: string;
}

export interface Stage {
  t: string;
  s: string;
  tasks: string[];
  hints: string[];
  links: (StageLink | null)[];
  chips: string[];
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'bot' | 'sys';
  content: string;
}

export interface VideoIdea {
  tema: string;
  t: string;
  ideia: string;
  ctx: string;
}

export interface UserState {
  v: number;
  name: string;
  theme: 'dark' | 'light';
  tasks: Record<number, boolean[]>;
  done: Record<number, boolean>;
  last: number | null;
  chats: Record<number, ChatMessage[]>;
  legacy13?: unknown;
}
