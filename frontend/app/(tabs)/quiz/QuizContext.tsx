import  { createContext, useContext, useState } from 'react';

type QuizAnswers = {
  [key: number]: string;
};

type QuizContextType = {
  answers: QuizAnswers;
  setAnswer: (question: number, answer: string) => void;
};

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [answers, setAnswers] = useState<QuizAnswers>({});

  function setAnswer(question: number, answer: string) {
    setAnswers((prev) => ({ ...prev, [question]: answer }));
  }

  return (
    <QuizContext.Provider value={{ answers, setAnswer }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) throw new Error('useQuiz must be used within a QuizProvider');
  return context;
}