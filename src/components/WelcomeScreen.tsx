import React, { useState, useRef } from 'react';
import { SCHOOLS } from '@/constants';
import { parseQuestionsTxt } from '@/utils/questionParser';
import { Question } from '@/types';

interface WelcomeScreenProps {
  onStart: (schoolName: string, storyText: string, questions: Question[]) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const [selectedSchool, setSelectedSchool] = useState('');
  const [storyFile, setStoryFile] = useState<File | null>(null);
  const [questionsFile, setQuestionsFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const storyInputRef = useRef<HTMLInputElement>(null);
  const questionsInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "text/plain" || file.name.endsWith('.txt')) {
        setter(file);
        setError('');
      } else {
        setter(null);
        setError("Por favor, selecciona un archivo de texto (.txt)");
      }
    }
  };

  const handleStartClick = async () => {
    if (!selectedSchool || !storyFile || !questionsFile) {
      setError("Por favor, completa todos los campos.");
      return;
    }
    try {
      const storyText = await storyFile.text();
      const questionsText = await questionsFile.text();
      const questions = parseQuestionsTxt(questionsText);
      if (questions.length === 0) {
        setError("El archivo de preguntas está vacío o tiene un formato incorrecto.");
        return;
      }
      onStart(selectedSchool, storyText, questions);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Error desconocido al procesar los archivos.";
      setError(`Error: ${message}`);
    }
  };

  // Incredible "Demo Mode" feature to instantly load sample data
  const handleLoadDemo = () => {
    const demoStory = `Caperucita Roja era una niña muy buena que vivía en un pueblo al borde del bosque. Un día, su mamá le pidió que llevara una cesta con pasteles y frutas a su abuelita, que estaba enferma y vivía al otro lado del bosque. Por el camino, Caperucita se encontró al astuto lobo feroz, quien la convenció de tomar un camino más largo mientras él corría a la casa de la abuelita. Afortunadamente, un valiente leñador escuchó los gritos y salvó a Caperucita y a su abuela justo a tiempo, ahuyentando al lobo para siempre.`;
    
    const demoQuestions: Question[] = [
      {
        text: "¿Por qué Caperucita Roja iba a cruzar el bosque?",
        options: [
          { text: "Para jugar con el lobo feroz", isCorrect: false },
          { text: "Para visitar a su abuelita enferma y llevarle comida", isCorrect: true },
          { text: "Para buscar flores silvestres", isCorrect: false },
          { text: "Para ayudar al leñador con la leña", isCorrect: false }
        ]
      },
      {
        text: "¿Qué truco usó el lobo feroz con Caperucita Roja?",
        options: [
          { text: "Le robó su caperuza roja", isCorrect: false },
          { text: "La invitó a comer pasteles en el río", isCorrect: false },
          { text: "La convenció de tomar el camino más largo para llegar después que él", isCorrect: true },
          { text: "Le dio un mapa falso", isCorrect: false }
        ]
      },
      {
        text: "¿Quién salvó al final a Caperucita y a su abuela?",
        options: [
          { text: "Su mamá", isCorrect: false },
          { text: "El leñador", isCorrect: true },
          { text: "Un cazador del pueblo", isCorrect: false },
          { text: "El lobo arrepentido", isCorrect: false }
        ]
      }
    ];

    setSelectedSchool(selectedSchool || SCHOOLS[0]);
    onStart(selectedSchool || SCHOOLS[0], demoStory, demoQuestions);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 text-center relative overflow-hidden">
      {/* Visual decorative glowing blur circles */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl -z-10 animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl -z-10 animate-float" style={{ animationDelay: '2s' }} />

      <h1 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tight">
        <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 text-transparent bg-clip-text filter drop-shadow-sm text-glow">
          Quiz del Cuento
        </span>
      </h1>
      
      <p className="text-slate-300 text-base md:text-lg max-w-xl mb-10 font-light leading-relaxed">
        ¡Prepara tu clase interactiva! Elige tu escuela, sube el cuento con sus preguntas correspondientes, y pon a prueba a tus alumnos en una competición vibrante.
      </p>

      <div className="w-full max-w-md glass-card rounded-2xl p-8 border border-slate-800/80 shadow-2xl space-y-5">
        <div className="space-y-1.5 text-left">
          <label className="text-xs font-semibold text-purple-300 uppercase tracking-wider pl-1">1. Tu Escuela</label>
          <select
            value={selectedSchool}
            onChange={(e) => setSelectedSchool(e.target.value)}
            className="w-full p-3.5 bg-slate-950/80 border border-slate-800 hover:border-slate-700 focus:border-purple-500 rounded-xl text-slate-100 text-base focus:ring-2 focus:ring-purple-500/20 transition-all cursor-pointer outline-none"
          >
            <option value="" disabled>-- Selecciona una escuela --</option>
            {SCHOOLS.map((school) => (
              <option key={school} value={school} className="bg-slate-900">
                {school}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5 text-left">
          <label className="text-xs font-semibold text-purple-300 uppercase tracking-wider pl-1">2. Texto del Cuento</label>
          <button
            onClick={() => storyInputRef.current?.click()}
            className={`w-full p-3.5 border rounded-xl text-left text-sm transition-all flex items-center justify-between cursor-pointer outline-none ${
              storyFile 
                ? 'bg-purple-950/40 border-purple-500/50 text-purple-200' 
                : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            <span className="truncate">{storyFile ? `📖 ${storyFile.name}` : 'Cargar Cuento (.txt)'}</span>
            <span className="text-xs bg-slate-800/60 py-1 px-2.5 rounded-lg border border-slate-700/40">Subir</span>
          </button>
          <input
            type="file"
            accept=".txt"
            ref={storyInputRef}
            onChange={(e) => handleFileChange(e, setStoryFile)}
            className="hidden"
          />
        </div>

        <div className="space-y-1.5 text-left">
          <label className="text-xs font-semibold text-purple-300 uppercase tracking-wider pl-1">3. Preguntas de Comprensión</label>
          <button
            onClick={() => questionsInputRef.current?.click()}
            className={`w-full p-3.5 border rounded-xl text-left text-sm transition-all flex items-center justify-between cursor-pointer outline-none ${
              questionsFile 
                ? 'bg-purple-950/40 border-purple-500/50 text-purple-200' 
                : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            <span className="truncate">{questionsFile ? `❓ ${questionsFile.name}` : 'Cargar Preguntas (.txt)'}</span>
            <span className="text-xs bg-slate-800/60 py-1 px-2.5 rounded-lg border border-slate-700/40">Subir</span>
          </button>
          <input
            type="file"
            accept=".txt"
            ref={questionsInputRef}
            onChange={(e) => handleFileChange(e, setQuestionsFile)}
            className="hidden"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl">
            ⚠️ {error}
          </div>
        )}

        <button
          onClick={handleStartClick}
          disabled={!selectedSchool || !storyFile || !questionsFile}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-purple-500/20 active:scale-[0.98] transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none disabled:transform-none"
        >
          ¡Empezar Competición!
        </button>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-4 text-slate-500 text-xs uppercase tracking-widest font-semibold">O también</span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        <button
          onClick={handleLoadDemo}
          className="w-full py-3 bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/30 text-purple-400 hover:text-purple-300 font-semibold text-sm rounded-xl transition-all outline-none"
        >
          ✨ Probar con Demo Interactiva
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
