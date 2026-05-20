import React, { useState, useEffect } from 'react';
import TimerBar from '@/components/TimerBar';
import { Question, Option } from '@/types';

interface QuestionScreenProps {
  question: Question;
  onAnswer: (answer: Option, timeTaken: number) => void;
  questionNumber: number;
  totalQuestions: number;
  score: number;
}

const QuestionScreen: React.FC<QuestionScreenProps> = ({
  question,
  onAnswer,
  questionNumber,
  totalQuestions,
  score,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<Option | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const TIME_LIMIT = 60000; // 60 seconds

  useEffect(() => {
    setSelectedAnswer(null);
    setIsPaused(false);
    setStartTime(Date.now());
  }, [question]);

  const handleAnswerClick = (answer: Option) => {
    if (selectedAnswer) return; // Prevent changing answer
    const timeTaken = Date.now() - startTime;
    setSelectedAnswer(answer);
    setIsPaused(true);
    setTimeout(() => {
      onAnswer(answer, timeTaken);
    }, 1200); // Wait a bit to show selection
  };

  const handleTimeUp = () => {
    if (!selectedAnswer) {
      onAnswer({ text: '', isCorrect: false }, TIME_LIMIT);
    }
  };

  const getButtonClass = (answer: Option) => {
    if (!selectedAnswer) {
      return 'bg-slate-800/80 hover:bg-purple-600/90 border-slate-700/80 hover:border-purple-500 hover:shadow-purple-500/10 hover:shadow-lg text-slate-200';
    }
    if (answer.text === selectedAnswer.text) {
      return answer.isCorrect
        ? 'bg-emerald-600 border-emerald-400 shadow-emerald-500/20 shadow-xl text-white font-bold scale-[1.02]'
        : 'bg-rose-600 border-rose-400 shadow-rose-500/20 shadow-xl text-white font-bold scale-[1.02]';
    }
    // Highlight the correct answer if the player guessed wrong
    if (answer.isCorrect) {
      return 'bg-emerald-900/40 border-emerald-500/40 text-emerald-300 opacity-90';
    }
    return 'bg-slate-900/30 border-slate-800 text-slate-500 opacity-40'; // Fade out incorrect options
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 w-full max-w-3xl mx-auto animate-fade-in">
      <div className="w-full glass-card rounded-2xl shadow-2xl p-8 border border-slate-800/80 flex flex-col relative">
        {/* Glow behind the question screen */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl -z-10" />

        <div className="flex justify-between items-center mb-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-purple-500/10 text-purple-300 rounded-full border border-purple-500/20 font-semibold uppercase tracking-wider text-xs">
              Pregunta {questionNumber} de {totalQuestions}
            </span>
          </div>
          <div className="flex items-center gap-1.5 font-bold">
            <span className="text-slate-400 text-xs uppercase tracking-wider">Puntos:</span>
            <span className="text-lg text-emerald-400 tracking-wider text-glow">{score}</span>
          </div>
        </div>

        <div className="mb-6">
          <TimerBar duration={TIME_LIMIT} onTimeUp={handleTimeUp} isPaused={isPaused} />
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-center leading-relaxed my-8 bg-gradient-to-b from-slate-50 to-slate-200 bg-clip-text text-transparent">
          {question.text}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {question.options.map((answer) => (
            <button
              key={answer.text}
              onClick={() => handleAnswerClick(answer)}
              disabled={!!selectedAnswer}
              className={`w-full p-4.5 rounded-xl border text-base md:text-lg font-semibold text-left transition-all duration-300 transform active:scale-95 cursor-pointer outline-none ${getButtonClass(
                answer
              )} disabled:pointer-events-none`}
            >
              <div className="flex items-center justify-between">
                <span className="pr-2">{answer.text}</span>
                {selectedAnswer && answer.text === selectedAnswer.text && (
                  <span>{answer.isCorrect ? '✅' : '❌'}</span>
                )}
                {selectedAnswer && !selectedAnswer.isCorrect && answer.isCorrect && (
                  <span className="text-xs uppercase bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-400 font-bold border border-emerald-500/30">Correcto</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionScreen;
