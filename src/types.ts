export enum GameState {
  Welcome = 0,
  Question = 1,
  Feedback = 2,
  Final = 3
}

export interface Option {
  text: string;
  isCorrect: boolean;
}

export interface Question {
  text: string;
  options: Option[];
}

export interface AvatarConfig {
  character: string;   // 'cat' | 'fox' | 'panda' | 'dino' | 'robot' | 'unicorn' | 'penguin' | 'alien'
  accessory: string;   // 'sunglasses' | 'party_hat' | 'crown' | 'headphones' | 'mustache' | 'wizard_hat' | 'none'
  color: string;       // 'blue' | 'purple' | 'orange' | 'cyan' | 'lime' | 'pink' | 'amber'
}

export interface Player {
  id: string;
  name: string;
  school: string;
  highScore: number;
  avatar?: AvatarConfig;
}

export interface QuestionResult {
  questionIndex: number;
  isCorrect: boolean;
  timeTaken: number;
  points: number;
}

export interface SavedQuiz {
  id: string;
  title: string;
  storyText: string;
  questions: Question[];
  timestamp: number;
}

export interface GameAttempt {
  id: string;
  playerName: string;
  schoolName: string;
  results: QuestionResult[];
  totalScore: number;
  timestamp: number;
  avatar?: AvatarConfig;
  quizTitle?: string;
}

export interface LeaderboardEntry {
  playerName: string;
  schoolName: string;
  score: number;
  isVirtual?: boolean;
  avatar?: AvatarConfig;
}

export interface LastAnswer {
  isCorrect: boolean;
  selectedAnswer: string;
  question: Question;
}
