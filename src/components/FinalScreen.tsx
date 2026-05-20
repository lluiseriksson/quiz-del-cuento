import React from 'react';
import Leaderboard from '@/components/Leaderboard';
import { SchoolScore } from '@/types';

interface FinalScreenProps {
  scores: SchoolScore[];
  onPlayAgain: () => void;
  playerSchool: string;
}

const FinalScreen: React.FC<FinalScreenProps> = ({ scores, onPlayAgain, playerSchool }) => {
  // Find where the player school finished
  const playerRank = scores.findIndex((s) => s.name === playerSchool) + 1;
  const isPodium = playerRank <= 3;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 w-full animate-fade-in space-y-8 max-w-4xl mx-auto relative">
      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl -z-10" />

      <div className="text-center">
        <div className="text-6xl md:text-7xl mb-4 animate-float">
          {isPodium ? '🏆' : '⭐'}
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold mb-3 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent filter drop-shadow-[0_0_15px_rgba(245,158,11,0.2)]">
          ¡Juego Completado!
        </h1>
        <p className="text-lg md:text-xl text-slate-300 font-light">
          ¡Increíble esfuerzo! Tu escuela finalizó en el puesto{' '}
          <span className="font-bold text-yellow-400 text-glow">#{playerRank}</span>.
        </p>
      </div>

      <div className="w-full flex justify-center">
        <Leaderboard scores={scores} title="Resultados Finales del Torneo" playerSchool={playerSchool} />
      </div>

      <button
        onClick={onPlayAgain}
        className="px-12 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xl rounded-xl shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98] transform hover:-translate-y-0.5 transition-all duration-200 cursor-pointer outline-none"
      >
        🔄 Volver a Jugar
      </button>
    </div>
  );
};

export default FinalScreen;
