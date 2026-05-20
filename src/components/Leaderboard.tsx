import React from 'react';
import { LeaderboardEntry } from '@/types';
import Avatar from '@/components/common/Avatar';

interface PodiumIconProps {
  rank: number;
}

const PodiumIcon: React.FC<PodiumIconProps> = ({ rank }) => {
  const colors = [
    'text-amber-400 filter drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]',
    'text-slate-300 filter drop-shadow-[0_0_6px_rgba(203,213,225,0.4)]',
    'text-amber-750'
  ];
  const size = ['text-3xl', 'text-2xl', 'text-xl'];
  if (rank < 3) {
    return <span className={`${colors[rank]} ${size[rank]} animate-float`}>🏆</span>;
  }
  return null;
};

interface LeaderboardProps {
  scores: LeaderboardEntry[];
  playerSchool: string;
  playerActiveName?: string; // Optional: highlight current active player
  title?: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({
  scores,
  playerSchool,
  playerActiveName = '',
  title = "Clasificación"
}) => {
  const totalCompetitors = scores.length;

  return (
    <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-slate-800 flex flex-col transition-all duration-300 hover:border-purple-500/30">
      <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 flex-shrink-0">
        {title}
      </h2>
      <ul className="space-y-2.5 overflow-y-auto max-h-[50vh] pr-2 -mr-2 scrollbar-thin">
        {scores.map((entry, index) => {
          // Highlight if it's the active player by matching both name and school
          const isPlayer = entry.playerName === playerActiveName && entry.schoolName === playerSchool;
          const rank = index + 1;

          return (
            <li
              key={`${entry.playerName}-${entry.schoolName}-${index}`}
              className={`flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${
                isPlayer
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 scale-[1.03] shadow-lg shadow-purple-500/30 border border-purple-400/30 font-medium'
                  : 'bg-slate-800/50 hover:bg-slate-850 border border-slate-800/40 hover:border-slate-700/50'
              }`}
             >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 text-center flex items-center justify-center font-bold flex-shrink-0">
                  {index < 3 ? (
                    <PodiumIcon rank={index} />
                  ) : (
                    <span className="text-sm font-semibold text-slate-500">{rank}</span>
                  )}
                </div>
                <Avatar config={entry.avatar} size={36} className="border border-slate-750/80 shadow-sm flex-shrink-0" />
                <div className="min-w-0">
                  <div className={`font-semibold text-base truncate ${isPlayer ? 'text-white' : 'text-slate-200'}`}>
                    {entry.playerName || entry.schoolName}
                  </div>
                  {entry.playerName && (
                    <div className={`text-[10px] uppercase tracking-wider truncate ${isPlayer ? 'text-purple-200' : 'text-slate-400'}`}>
                      {entry.schoolName} — Puesto {rank} de {totalCompetitors}
                    </div>
                  )}
                  {!entry.playerName && (
                    <div className={`text-[10px] uppercase tracking-wider truncate text-slate-400`}>
                      Escuela Virtual — Puesto {rank} de {totalCompetitors}
                    </div>
                  )}
                </div>
              </div>
              <div className={`font-bold text-xl tracking-wider ml-2 flex-shrink-0 ${isPlayer ? 'text-white' : 'text-emerald-400'}`}>
                {entry.score}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Leaderboard;
