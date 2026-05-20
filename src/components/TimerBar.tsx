import React, { useState, useEffect } from 'react';

interface TimerBarProps {
  duration: number;
  onTimeUp: () => void;
  isPaused: boolean;
}

const TimerBar: React.FC<TimerBarProps> = ({ duration, onTimeUp, isPaused }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (isPaused) return;
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }
    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 100);
    }, 100);
    return () => clearInterval(intervalId);
  }, [timeLeft, onTimeUp, isPaused, duration]);

  const percentage = (timeLeft / duration) * 100;
  const color = percentage > 50 
    ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]' 
    : percentage > 25 
      ? 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.4)]' 
      : 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.4)] animate-pulse';

  return (
    <div className="w-full bg-slate-950/80 rounded-full h-3.5 overflow-hidden p-0.5 border border-slate-800/80 shadow-inner">
      <div
        className={`h-2 rounded-full transition-all duration-100 ease-linear ${color}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export default TimerBar;
