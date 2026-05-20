import React, { useState, useMemo } from 'react';
import WelcomeScreen from '@/components/WelcomeScreen';
import QuestionScreen from '@/components/QuestionScreen';
import FeedbackScreen from '@/components/FeedbackScreen';
import FinalScreen from '@/components/FinalScreen';
import { GameState, Question, Option, SchoolScore, LastAnswer } from '@/types';
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
  const [playerSchool, setPlayerSchool] = useState('');
  const [scores, setScores] = useState<SchoolScore[]>([]);
  const [storyText, setStoryText] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [lastAnswer, setLastAnswer] = useState<LastAnswer | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);

  const sortedScores = useMemo(() => {
    return [...scores].sort((a, b) => b.score - a.score);
  }, [scores]);

  const handleStartGame = (schoolName: string, loadedStory: string, loadedQuestions: Question[]) => {
    setPlayerSchool(schoolName);
    setStoryText(loadedStory);
    setQuestions(loadedQuestions);
    setShuffledQuestions(shuffleArray(loadedQuestions));
    setScore(0);
    setCurrentQuestionIndex(0);
    
    // Initialize scores for ALL schools to 0 at the start of a new game.
    const initialScores = SCHOOLS.map((name) => ({ name, score: 0 }));
    setScores(initialScores);
    setGameState(GameState.Question);
  };

  const handleAnswer = async (answer: Option, timeTaken: number) => {
    const isCorrect = answer.isCorrect;
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    
    setLastAnswer({
      isCorrect,
      selectedAnswer: answer.text,
      question: currentQuestion,
    });

    // 1. Calculate player's points for this round
    let playerPointsThisRound = 0;
    if (isCorrect) {
      const timeLimit = 60000;
      playerPointsThisRound = Math.round(1000 - (Math.min(timeTaken, timeLimit) / timeLimit) * 500);
    }
    const newPlayerScore = score + playerPointsThisRound;
    setScore(newPlayerScore);

    // 2. Simulate results for all schools and update the leaderboard
    setScores((prevScores) =>
      prevScores.map((school) => {
        // A) Update the player's school score
        if (school.name === playerSchool) {
          return { ...school, score: newPlayerScore };
        }
        // B) Simulate for opponent schools
        // Give opponents a chance to be correct (e.g., between 65% and 85% probability)
        const opponentCorrectChance = 0.65 + Math.random() * 0.2;
        const isOpponentCorrect = Math.random() < opponentCorrectChance;
        if (isOpponentCorrect) {
          // If correct, simulate a realistic time taken (e.g., between 2s and 50s)
          const simulatedTime = Math.random() * 48000 + 2000;
          const timeLimit = 60000;
          const opponentPoints = Math.round(1000 - (simulatedTime / timeLimit) * 500);
          return { ...school, score: school.score + opponentPoints };
        } else {
          // Opponent was incorrect, no points for this round
          return school;
        }
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
        return <WelcomeScreen onStart={handleStartGame} />;
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
        if (!lastAnswer) return null;
        return (
          <FeedbackScreen
            isCorrect={lastAnswer.isCorrect}
            explanation={explanation}
            isLoadingExplanation={isLoadingExplanation}
            onNext={handleNextQuestion}
            scores={sortedScores}
            playerSchool={playerSchool}
          />
        );
      case GameState.Final:
        return (
          <FinalScreen
            scores={sortedScores}
            onPlayAgain={handlePlayAgain}
            playerSchool={playerSchool}
          />
        );
      default:
        return <WelcomeScreen onStart={handleStartGame} />;
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
