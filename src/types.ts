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

export interface SchoolScore {
  name: string;
  score: number;
}

export interface LastAnswer {
  isCorrect: boolean;
  selectedAnswer: string;
  question: Question;
}

