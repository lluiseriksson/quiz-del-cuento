import React from 'react';
import Leaderboard from '@/components/Leaderboard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { LeaderboardEntry } from '@/types';

interface FeedbackScreenProps {
  isCorrect: boolean;
  explanation: string | null;
  isLoadingExplanation: boolean;
  onNext: () => void;
  scores: LeaderboardEntry[];
  playerSchool: string;
  playerName: string;
}

const FeedbackScreen: React.FC<FeedbackScreenProps> = ({
  isCorrect,
  explanation,
  isLoadingExplanation,
  onNext,
  scores,
  playerSchool,
  playerName,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 w-full animate-fade-in space-y-8 max-w-4xl mx-auto">
      <div className="text-center w-full max-w-2xl">
        <div className="flex justify-center mb-4">
          {isCorrect ? (
            <div className="w-20 h-20 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-full flex items-center justify-center text-4xl animate-bounce shadow-lg shadow-emerald-500/20">
              🎉
            </div>
          ) : (
            <div className="w-20 h-20 bg-rose-500/10 border-2 border-rose-500/30 rounded-full flex items-center justify-center text-4xl animate-pulse shadow-lg shadow-rose-500/20">
              💡
            </div>
          )}
        </div>
        
        <h1
          className={`text-5xl md:text-6xl font-extrabold mb-5 tracking-tight ${
            isCorrect 
              ? 'text-emerald-400 filter drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]' 
              : 'text-rose-400 filter drop-shadow-[0_0_15px_rgba(251,113,133,0.3)]'
          }`}
        >
          {isCorrect ? '¡Correcto!' : '¡Buen intento!'}
        </h1>

        {!isCorrect && (
          <div className="w-full bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 shadow-xl min-h-[90px] flex flex-col justify-center text-left">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-1.5 block">Explicación de la IA</span>
            {isLoadingExplanation ? (
              <div className="py-2"><LoadingSpinner /></div>
            ) : (
              <p className="text-base text-slate-200 leading-relaxed italic">
                "{explanation || '¡Se acabó el tiempo!'}"
              </p>
            )}
          </div>
        )}
      </div>

      <div className="w-full flex justify-center">
        <Leaderboard
          scores={scores}
          title="Clasificación en Tiempo Real"
          playerSchool={playerSchool}
          playerActiveName={playerName}
        />
      </div>

      <button
        onClick={onNext}
        className="px-10 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-purple-500/20 active:scale-[0.98] transform hover:-translate-y-0.5 transition-all duration-200 cursor-pointer outline-none"
      >
        Siguiente Pregunta
      </button>
    </div>
  );
};

export default FeedbackScreen;
