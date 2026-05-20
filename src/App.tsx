import React, { useState, useMemo } from 'react';
import WelcomeScreen from '@/components/WelcomeScreen';
import QuestionScreen from '@/components/QuestionScreen';
import FeedbackScreen from '@/components/FeedbackScreen';
import FinalScreen from '@/components/FinalScreen';
import { GameState, Question, Option, Player, GameAttempt, QuestionResult, LeaderboardEntry, LastAnswer, AvatarConfig } from '@/types';
import { getRandomAvatar } from '@/components/common/Avatar';
import { SCHOOLS } from '@/constants';
import { getAnswerExplanation } from '@/services/geminiService';

// Function to shuffle an array helper typed properly
const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.Welcome);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  
  // Players and attempts stored persistently
  const [players, setPlayers] = useState<Player[]>(() => {
    const saved = localStorage.getItem('quiz_players');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [attempts, setAttempts] = useState<GameAttempt[]>(() => {
    const saved = localStorage.getItem('quiz_attempts');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  
  // Real-time in-game tournament leaderboard entries
  const [scores, setScores] = useState<LeaderboardEntry[]>([]);
  const [activeGhosts, setActiveGhosts] = useState<GameAttempt[]>([]);
  
  // Active player results for the current run
  const [currentResults, setCurrentResults] = useState<QuestionResult[]>([]);

  const [storyText, setStoryText] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [lastAnswer, setLastAnswer] = useState<LastAnswer | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [currentQuizTitle, setCurrentQuizTitle] = useState('');

  const sortedScores = useMemo(() => {
    return [...scores].sort((a, b) => b.score - a.score);
  }, [scores]);

  const handleCreatePlayer = (name: string, school: string, avatar: AvatarConfig): Player => {
    const newPlayer: Player = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      school,
      highScore: 0,
      avatar
    };
    const updated = [...players, newPlayer];
    setPlayers(updated);
    localStorage.setItem('quiz_players', JSON.stringify(updated));
    return newPlayer;
  };

  const handleUpdatePlayer = (id: string, name: string, avatar: AvatarConfig) => {
    const oldPlayer = players.find(p => p.id === id);
    const updatedPlayers = players.map(p => p.id === id ? { ...p, name, avatar } : p);
    setPlayers(updatedPlayers);
    localStorage.setItem('quiz_players', JSON.stringify(updatedPlayers));

    if (oldPlayer) {
      const updatedAttempts = attempts.map(attempt => {
        if (attempt.playerName === oldPlayer.name && attempt.schoolName === oldPlayer.school) {
          return { ...attempt, playerName: name, avatar };
        }
        return attempt;
      });
      setAttempts(updatedAttempts);
      localStorage.setItem('quiz_attempts', JSON.stringify(updatedAttempts));
    }
  };

  const handleStartGame = (selectedPlayer: Player, loadedStory: string, loadedQuestions: Question[], quizTitle: string) => {
    setCurrentPlayer(selectedPlayer);
    setStoryText(loadedStory);
    setQuestions(loadedQuestions);
    setShuffledQuestions(shuffleArray(loadedQuestions));
    setScore(0);
    setCurrentQuestionIndex(0);
    setCurrentResults([]);
    setCurrentQuizTitle(quizTitle);
    
    // Set up the tournament leaderboard participants
    const participants: LeaderboardEntry[] = [];
    
    // 1. Add active player
    participants.push({
      playerName: selectedPlayer.name,
      schoolName: selectedPlayer.school,
      score: 0,
      avatar: selectedPlayer.avatar
    });
    
    // 2. Select historical ghost opponents (unique per player name + school, filtered by matching quiz title)
    const uniqueAttempts: { [key: string]: GameAttempt } = {};
    attempts.forEach(attempt => {
      if (attempt.quizTitle && attempt.quizTitle !== quizTitle) {
        return;
      }
      // Don't compete against your current self
      if (attempt.playerName === selectedPlayer.name && attempt.schoolName === selectedPlayer.school) {
        return;
      }
      const key = `${attempt.playerName}-${attempt.schoolName}`;
      // Keep their highest score attempt
      if (!uniqueAttempts[key] || uniqueAttempts[key].totalScore < attempt.totalScore) {
        uniqueAttempts[key] = attempt;
      }
    });
    
    const ghostsToPlay = Object.values(uniqueAttempts);
    setActiveGhosts(ghostsToPlay);
    
    ghostsToPlay.forEach(ghost => {
      participants.push({
        playerName: ghost.playerName,
        schoolName: ghost.schoolName,
        score: 0,
        avatar: ghost.avatar
      });
    });
    
    // 3. Add all remaining schools as virtual competitors (except those that have individual players)
    const virtualSchools = SCHOOLS.filter(
      (s) => s !== selectedPlayer.school && !ghostsToPlay.some((g) => g.schoolName === s)
    );
    
    virtualSchools.forEach((schoolName) => {
      participants.push({
        playerName: '', // Empty means virtual school
        schoolName: schoolName,
        score: 0,
        isVirtual: true,
        avatar: getRandomAvatar()
      });
    });
    
    setScores(participants);
    setGameState(GameState.Question);
  };

  const handleAnswer = async (answer: Option, timeTaken: number) => {
    if (!currentPlayer) return;
    const isCorrect = answer.isCorrect;
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    
    // 1. Calculate player's points for this round
    let playerPointsThisRound = 0;
    if (isCorrect) {
      const timeLimit = 60000;
      playerPointsThisRound = Math.round(1000 - (Math.min(timeTaken, timeLimit) / timeLimit) * 500);
    }
    const newPlayerScore = score + playerPointsThisRound;
    setScore(newPlayerScore);

    // Save active player's question result
    const qResult: QuestionResult = {
      questionIndex: currentQuestionIndex,
      isCorrect,
      timeTaken,
      points: playerPointsThisRound
    };
    setCurrentResults(prev => [...prev, qResult]);

    setLastAnswer({
      isCorrect,
      selectedAnswer: answer.text,
      question: currentQuestion,
    });

    // 2. Update real-time scores for all participants
    setScores((prevScores) =>
      prevScores.map((entry) => {
        // A) Update active player
        if (entry.playerName === currentPlayer.name && entry.schoolName === currentPlayer.school && !entry.isVirtual) {
          return { ...entry, score: newPlayerScore };
        }
        
        // B) Update real ghosts from previous attempts
        if (!entry.isVirtual && entry.playerName) {
          const ghostAttempt = activeGhosts.find(
            (g) => g.playerName === entry.playerName && g.schoolName === entry.schoolName
          );
          if (ghostAttempt) {
            // Find what they did at this exact question index
            const matchingResult = ghostAttempt.results.find(
              (r) => r.questionIndex === currentQuestionIndex
            );
            const pointsToAdd = matchingResult ? matchingResult.points : 0;
            return { ...entry, score: entry.score + pointsToAdd };
          }
        }

        // C) Update virtual opponents (random simulation)
        const opponentCorrectChance = 0.65 + Math.random() * 0.2;
        const isOpponentCorrect = Math.random() < opponentCorrectChance;
        if (isOpponentCorrect) {
          const simulatedTime = Math.random() * 48000 + 2000;
          const timeLimit = 60000;
          const opponentPoints = Math.round(1000 - (simulatedTime / timeLimit) * 500);
          return { ...entry, score: entry.score + opponentPoints };
        }
        return entry;
      })
    );

    // 3. Handle incorrect answer feedback for player
    if (!isCorrect) {
      setIsLoadingExplanation(true);
      setExplanation(null);
      if (answer.text) {
        // Do not fetch explanation if time ran out (empty answer text)
        const expl = await getAnswerExplanation(storyText, currentQuestion.text, answer.text);
        setExplanation(expl);
      } else {
        setExplanation('¡Se acabó el tiempo!');
      }
      setIsLoadingExplanation(false);
    }
    setGameState(GameState.Feedback);
  };

  const handleNextQuestion = () => {
    setExplanation(null);
    if (currentQuestionIndex + 1 < shuffledQuestions.length) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setGameState(GameState.Question);
    } else {
      // Game ended! Save attempt to history for asynchronous multiplayer replays
      if (currentPlayer) {
        const finalResults = [...currentResults];
        
        // Safety check to ensure results match shuffledQuestions length
        const newAttempt: GameAttempt = {
          id: Math.random().toString(36).substring(2, 9),
          playerName: currentPlayer.name,
          schoolName: currentPlayer.school,
          results: finalResults,
          totalScore: score,
          timestamp: Date.now(),
          avatar: currentPlayer.avatar,
          quizTitle: currentQuizTitle
        };
        
        const updatedAttempts = [...attempts, newAttempt];
        setAttempts(updatedAttempts);
        localStorage.setItem('quiz_attempts', JSON.stringify(updatedAttempts));
        
        // Update high score in players list
        const updatedPlayers = players.map(p => {
          if (p.id === currentPlayer.id) {
            return { ...p, highScore: Math.max(p.highScore, score) };
          }
          return p;
        });
        setPlayers(updatedPlayers);
        localStorage.setItem('quiz_players', JSON.stringify(updatedPlayers));
      }
      
      setGameState(GameState.Final);
    }
  };

  const handlePlayAgain = () => {
    setStoryText('');
    setQuestions([]);
    setShuffledQuestions([]);
    setGameState(GameState.Welcome);
  };

  const renderScreen = () => {
    switch (gameState) {
      case GameState.Welcome:
        return (
          <WelcomeScreen
            players={players}
            onCreatePlayer={handleCreatePlayer}
            onUpdatePlayer={handleUpdatePlayer}
            onStart={handleStartGame}
          />
        );
      case GameState.Question:
        if (shuffledQuestions.length === 0) return null;
        return (
          <QuestionScreen
            question={shuffledQuestions[currentQuestionIndex]}
            onAnswer={handleAnswer}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={shuffledQuestions.length}
            score={score}
          />
        );
      case GameState.Feedback:
        if (!lastAnswer || !currentPlayer) return null;
        return (
          <FeedbackScreen
            isCorrect={lastAnswer.isCorrect}
            explanation={explanation}
            isLoadingExplanation={isLoadingExplanation}
            onNext={handleNextQuestion}
            scores={sortedScores}
            playerSchool={currentPlayer.school}
            playerName={currentPlayer.name}
          />
        );
      case GameState.Final:
        if (!currentPlayer) return null;
        return (
          <FinalScreen
            scores={sortedScores}
            onPlayAgain={handlePlayAgain}
            playerSchool={currentPlayer.school}
            playerName={currentPlayer.name}
          />
        );
      default:
        return (
          <WelcomeScreen
            players={players}
            onCreatePlayer={handleCreatePlayer}
            onUpdatePlayer={handleUpdatePlayer}
            onStart={handleStartGame}
          />
        );
    }
  };

  return (
    <main className="bg-slate-950 text-slate-100 min-h-screen flex items-center justify-center font-sans overflow-x-hidden relative">
      {/* Decorative grid pattern in background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
      <div className="relative w-full z-10">{renderScreen()}</div>
    </main>
  );
};

export default App;
