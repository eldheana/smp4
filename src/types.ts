export type UserRole = 'peserta' | 'juri' | 'admin' | 'penonton';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  school: string;
  avatar: string;
  isOnline: boolean;
  score: number;
  streak: number;
  correctAnswers: number;
  totalAnswered: number;
  totalTimeMs: number;
  juriIndex?: number; // 1 to 5 for juries
  registeredVia?: 'belajar_id' | 'google' | 'kemdikbud' | 'twitter' | 'facebook' | 'manual';
  statusBadge?: string;
}

export type QuestionDifficulty = 'mudah' | 'sedang' | 'sulit';
export type QuestionRound = 'penyisihan' | 'tebak_cepat' | 'rebutan';

export interface Question {
  id: string;
  category: string;
  difficulty: QuestionDifficulty;
  round: QuestionRound;
  timeLimit: number; // in seconds
  points: number;
  question: string;
  options?: string[]; // for multiple choice
  correctOptionIndex?: number; // 0-3 for multiple choice
  encryptedAnswer: string; // E2EE cipher payload
  decryptedAnswer?: string; // readable only for panitia/juri
  explanation: string;
  source: 'ai' | 'bank' | 'manual';
}

export interface WordwallPair {
  id: string;
  category: string;
  clue: string;
  match: string;
}

export interface CompetitionRound {
  id: string;
  roundNumber: number;
  title: string;
  description: string;
  scheduleTime: string;
  status: 'scheduled' | 'active' | 'completed';
  timeLimitDefault: number;
  questionIds: string[];
}

export interface BuzzerEvent {
  id: string;
  questionId: string;
  userId: string;
  userName: string;
  school: string;
  avatar: string;
  timestamp: number; // performance.now() or Epoch ms
  deltaMs: number; // reaction time from buzzer opening
  status: 'pending_jury' | 'verified_correct' | 'verified_incorrect' | 'passed';
  juryScoreDelta?: number;
}

export interface JuryVote {
  juriId: string;
  juriName: string;
  juriIndex: number;
  decision: 'correct' | 'incorrect' | 'abstain';
  notes?: string;
  timestamp: number;
}

export interface CompetitionSessionState {
  currentRoundId: string;
  currentQuestionId: string | null;
  questionNumber: number;
  totalQuestionsInRound: number;
  isQuestionActive: boolean;
  isBuzzerOpen: boolean;
  isTimerRunning: boolean;
  timeRemaining: number;
  totalTime: number;
  buzzerQueue: BuzzerEvent[];
  activeBuzzerWinner: BuzzerEvent | null;
  juryVotes: JuryVote[];
  lastActionSummary: string;
  onlineAudienceCount: number;
}

export interface PersonalAnalytics {
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  avgResponseTimeSeconds: number;
  highestStreak: number;
  totalScore: number;
  rank: number;
  totalParticipants: number;
  categoryBreakdown: {
    category: string;
    total: number;
    correct: number;
    accuracy: number;
  }[];
  aiFeedback: string;
  strengths: string[];
  weaknesses: string[];
  badgeEarned: string;
}

export interface PushNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'round_start' | 'buzzer_turn' | 'schedule' | 'rank_update';
  read: boolean;
}
