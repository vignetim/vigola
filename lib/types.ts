export type GameMode = 'buzzer' | 'multiple-choice' | 'quiz';
export type QuestionLanguage = 'tr' | 'en';
export type Choice = { id: string; text: string; weight?: number };
export type Joker = 'fifty-fifty' | 'double-answer' | 'shield' | 'double-points' | 'bomb';
export type PrivateAnswer = { code: string; questionId: string; choiceId: string | null; choiceIds: string[]; jokers: Joker[]; eliminatedChoiceIds: string[]; availableJokers: Joker[] };
export type ChoiceResult = { id: string; choiceId: string | null; correct: boolean | null; delta: number; elapsedMs?: number; choiceIds?: string[]; jokers?: Joker[]; soloBonus?: boolean; firstCorrectBonus?: boolean; penaltyMultiplier?: number; bombOutcome?: 'winner' | 'hit' | 'shielded' };
export type Question = { id: string; letter: string; category: string; text: string; answer: string; explanation: string; code?: string; choices?: Choice[]; difficulty: 'Kolay' | 'Orta' | 'Zor'; points: number; penalty: number; multiplier: number };
export type Player = { id: string; name: string; score: number; connected: boolean; correct: number; wrong: number };
export type GameState = {
 code: string; mode: GameMode; language: QuestionLanguage; phase: 'lobby' | 'countdown' | 'open' | 'answering' | 'resolved' | 'final'; players: Player[]; index: number; total: number; letters: string[];
 question: Omit<Question, 'answer' | 'explanation'> & { answer?: string; explanation?: string };
 queue: { id: string; at: number }[]; locked: string[]; revealAt: number | null; deadline: number | null; pending: boolean;
 result: { id: string; correct: boolean; delta: number; timeout?: boolean } | null;
 history: { letter: string; status: 'correct' | 'passed' }[];
 watchers: { id: string; name: string }[];
 submitted: string[]; choiceResults: ChoiceResult[];
 completed: (Question & { index: number; status: 'correct' | 'passed'; choiceResults?: ChoiceResult[] })[];
 events: { id: string; message: string; kind: string }[];
};
