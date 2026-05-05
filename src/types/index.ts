export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type Module = {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  color: string;
  gradientColors: [string, string];
  slides: Slide[];
  quiz: QuizQuestion[];
};

export type Slide = {
  id: string;
  title: string;
  body: string;
  emoji: string;
};

export type ModuleProgress = {
  moduleId: string;
  completed: boolean;
  score: number; // 0-3
};

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Module: { moduleId: string };
  Quiz: { moduleId: string };
  Result: { moduleId: string; score: number; total: number };
};
