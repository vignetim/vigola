export type Question = { id: string; letter: string; category: string; text: string; answer: string; explanation: string; code?: string; difficulty: 'Kolay' | 'Orta' | 'Zor'; points: number; penalty: number; multiplier: number };
export type Player = { id: string; name: string; score: number; connected: boolean; correct: number; wrong: number };
export type GameState = {
 code: string; phase: 'lobby' | 'countdown' | 'open' | 'answering' | 'resolved' | 'final'; players: Player[]; index: number; total: number; letters: string[];
 question: Omit<Question, 'answer' | 'explanation'> & { answer?: string; explanation?: string };
 queue: { id: string; at: number }[]; locked: string[]; revealAt: number | null; deadline: number | null; pending: boolean;
 result: { id: string; correct: boolean; delta: number; timeout?: boolean } | null;
 history: { letter: string; status: 'correct' | 'passed' }[];
 watchers: { id: string; name: string }[];
 completed: (Question & { index: number; status: 'correct' | 'passed' })[];
 events: { id: string; message: string; kind: string }[];
};
