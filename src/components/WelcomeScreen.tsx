import React, { useState, useRef } from 'react';
import { SCHOOLS } from '@/constants';
import { parseQuestionsTxt } from '@/utils/questionParser';
import { Question, Player, AvatarConfig } from '@/types';
import Avatar, { AVATAR_CHARACTERS, AVATAR_ACCESSORIES, AVATAR_COLORS, getRandomAvatar } from '@/components/common/Avatar';

interface WelcomeScreenProps {
  players: Player[];
  onCreatePlayer: (name: string, school: string, avatar: AvatarConfig) => Player;
  onStart: (player: Player, storyText: string, questions: Question[]) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ players, onCreatePlayer, onStart }) => {
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedPlayerId, setSelectedPlayerId] = useState('');
  const [newPlayerName, setNewPlayerName] = useState('');
  
  // Avatar Customizer Local States
  const [avatarChar, setAvatarChar] = useState('panda');
  const [avatarAcc, setAvatarAcc] = useState('none');
  const [avatarColor, setAvatarColor] = useState('purple');
  const [activeTab, setActiveTab] = useState<'character' | 'accessory' | 'color'>('character');

  const [storyFile, setStoryFile] = useState<File | null>(null);
  const [questionsFile, setQuestionsFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const storyInputRef = useRef<HTMLInputElement>(null);
  const questionsInputRef = useRef<HTMLInputElement>(null);

  // Filter players that belong to the currently selected school
  const schoolPlayers = players.filter((p) => p.school === selectedSchool);
  const selectedPlayer = players.find(p => p.id === selectedPlayerId);

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

  const handleCreatePlayer = (e: React.FormEvent) => {
    e.preventDefault();
    const nameTrimmed = newPlayerName.trim();
    if (!nameTrimmed) {
      setError("El nombre del jugador no puede estar vacío.");
      return;
    }
    if (!selectedSchool) {
      setError("Por favor, selecciona primero una escuela.");
      return;
    }

    // Check duplicate name inside the same school
    const isDuplicate = schoolPlayers.some(
      (p) => p.name.toLowerCase() === nameTrimmed.toLowerCase()
    );
    if (isDuplicate) {
      setError(`Ya existe un jugador llamado "${nameTrimmed}" en esta escuela.`);
      return;
    }

    try {
      const newPlayer = onCreatePlayer(nameTrimmed, selectedSchool, {
        character: avatarChar,
        accessory: avatarAcc,
        color: avatarColor
      });
      setSelectedPlayerId(newPlayer.id);
      setNewPlayerName('');
      setError('');
      
      // Randomize avatar configuration for the next player
      const rand = getRandomAvatar();
      setAvatarChar(rand.character);
      setAvatarAcc(rand.accessory);
      setAvatarColor(rand.color);
    } catch (err) {
      setError("Error al crear el jugador.");
    }
  };

  const handleStartClick = async () => {
    const activePlayer = players.find((p) => p.id === selectedPlayerId);
    if (!selectedSchool || !activePlayer || !storyFile || !questionsFile) {
      setError("Por favor, completa todos los campos (escuela, jugador y archivos).");
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
      onStart(activePlayer, storyText, questions);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Error desconocido al procesar los archivos.";
      setError(`Error: ${message}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 text-center relative overflow-hidden">
      {/* Background radial glowing gradients */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl -z-10 animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl -z-10 animate-float" style={{ animationDelay: '2s' }} />

      <h1 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tight">
        <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 text-transparent bg-clip-text filter drop-shadow-sm text-glow">
          Quiz del Cuento
        </span>
      </h1>
      
      <p className="text-slate-300 text-base md:text-lg max-w-xl mb-10 font-light leading-relaxed">
        ¡Prepara tu clase interactiva! Selecciona tu escuela, crea tus jugadores, sube el cuento con las preguntas, y pon a prueba a tus alumnos compitiendo en tiempo real.
      </p>

      <div className="w-full max-w-md glass-card rounded-2xl p-8 border border-slate-800/80 shadow-2xl space-y-5">
        
        {/* Step 1: School Selection */}
        <div className="space-y-1.5 text-left">
          <label className="text-xs font-semibold text-purple-300 uppercase tracking-wider pl-1">1. Selecciona Escuela</label>
          <select
            value={selectedSchool}
            onChange={(e) => {
              setSelectedSchool(e.target.value);
              setSelectedPlayerId(''); // Reset player when school changes
              setError('');
            }}
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

        {/* Step 2: Player Management (Conditional on school selected) */}
        {selectedSchool && (
          <div className="space-y-4 p-4 bg-slate-950/40 rounded-xl border border-slate-800/60 animate-fade-in text-left">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-pink-300 uppercase tracking-wider pl-1">2. Elige tu Jugador</label>
              {schoolPlayers.length > 0 ? (
                <select
                  value={selectedPlayerId}
                  onChange={(e) => {
                    setSelectedPlayerId(e.target.value);
                    setError('');
                  }}
                  className="w-full p-3 bg-slate-950 border border-slate-800 focus:border-pink-500 rounded-xl text-slate-100 text-sm focus:ring-2 focus:ring-pink-500/20 transition-all cursor-pointer outline-none"
                >
                  <option value="" disabled>-- Selecciona un jugador existente --</option>
                  {schoolPlayers.map((p) => {
                    const charEmoji = p.avatar ? (AVATAR_CHARACTERS.find(c => c.id === p.avatar?.character)?.emoji || '👤') : '👤';
                    return (
                      <option key={p.id} value={p.id} className="bg-slate-900">
                        {charEmoji} {p.name} (Récord: {p.highScore} pts)
                      </option>
                    );
                  })}
                </select>
              ) : (
                <p className="text-xs text-slate-500 italic pl-1">No hay jugadores registrados en esta escuela todavía.</p>
              )}
            </div>

            {/* Display active selected player card with their avatar! */}
            {selectedPlayer && (
              <div className="flex items-center gap-3 p-3 bg-purple-950/20 border border-purple-500/20 rounded-xl animate-fade-in">
                <Avatar config={selectedPlayer.avatar} size={44} className="animate-float" />
                <div>
                  <div className="text-sm font-bold text-slate-100">¡Hola, {selectedPlayer.name}! 👋</div>
                  <div className="text-[10px] text-purple-300 uppercase tracking-wider font-semibold">Récord Máximo: {selectedPlayer.highScore} pts</div>
                </div>
              </div>
            )}

            {/* Quick Create Player Inline Form with Avatar Customizer */}
            <form onSubmit={handleCreatePlayer} className="space-y-3.5 pt-3.5 border-t border-slate-800/60">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">O crea un nuevo jugador</label>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nombre del alumno..."
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  className="flex-grow p-2.5 bg-slate-950 border border-slate-800 focus:border-pink-500 rounded-lg text-slate-100 text-xs outline-none"
                />
              </div>

              {/* Avatar Designer Section */}
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-850 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider pl-1">Diseña tu Avatar 🎨</span>
                  <button
                    type="button"
                    onClick={() => {
                      const rand = getRandomAvatar();
                      setAvatarChar(rand.character);
                      setAvatarAcc(rand.accessory);
                      setAvatarColor(rand.color);
                    }}
                    className="text-[10px] bg-slate-900 hover:bg-slate-800 active:scale-95 px-2.5 py-1 rounded-md border border-slate-800 transition-all flex items-center gap-1 cursor-pointer text-slate-300 hover:text-white"
                  >
                    🎲 Aleatorio
                  </button>
                </div>

                <div className="flex gap-3 items-center">
                  {/* Avatar Live Preview */}
                  <div className="flex flex-col items-center justify-center bg-slate-900/60 p-2 rounded-xl border border-slate-800/80 w-16">
                    <Avatar config={{ character: avatarChar, accessory: avatarAcc, color: avatarColor }} size={48} className="animate-float" />
                  </div>

                  {/* Customizer Tabs & Selectors */}
                  <div className="flex-grow space-y-1.5 min-w-0">
                    <div className="flex border-b border-slate-850 pb-1 gap-2">
                      {(['character', 'accessory', 'color'] as const).map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setActiveTab(tab)}
                          className={`pb-0.5 px-0.5 font-bold uppercase text-[9px] border-b-2 transition-all cursor-pointer ${
                            activeTab === tab
                              ? 'text-pink-400 border-pink-400'
                              : 'text-slate-500 border-transparent hover:text-slate-400'
                          }`}
                        >
                          {tab === 'character' ? 'Personaje' : tab === 'accessory' ? 'Accesorio' : 'Fondo'}
                        </button>
                      ))}
                    </div>

                    <div className="max-h-16 overflow-y-auto pr-0.5 scrollbar-thin">
                      {activeTab === 'character' && (
                        <div className="grid grid-cols-4 gap-1">
                          {AVATAR_CHARACTERS.map((char) => (
                            <button
                              key={char.id}
                              type="button"
                              onClick={() => setAvatarChar(char.id)}
                              title={char.name}
                              className={`p-1 text-base rounded-md border transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                                avatarChar === char.id
                                  ? 'bg-purple-950/60 border-purple-500 text-white'
                                  : 'bg-slate-900/40 border-slate-900 text-slate-400 hover:border-slate-800'
                              }`}
                            >
                              {char.emoji}
                            </button>
                          ))}
                        </div>
                      )}

                      {activeTab === 'accessory' && (
                        <div className="grid grid-cols-4 gap-1">
                          {AVATAR_ACCESSORIES.map((acc) => (
                            <button
                              key={acc.id}
                              type="button"
                              onClick={() => setAvatarAcc(acc.id)}
                              title={acc.name}
                              className={`p-1 text-base rounded-md border transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                                avatarAcc === acc.id
                                  ? 'bg-purple-950/60 border-purple-500 text-white'
                                  : 'bg-slate-900/40 border-slate-900 text-slate-400 hover:border-slate-800'
                              }`}
                            >
                              {acc.emoji}
                            </button>
                          ))}
                        </div>
                      )}

                      {activeTab === 'color' && (
                        <div className="flex flex-wrap gap-1 py-0.5">
                          {AVATAR_COLORS.map((col) => (
                            <button
                              key={col.id}
                              type="button"
                              onClick={() => setAvatarColor(col.id)}
                              title={col.label}
                              className={`w-4 h-4 rounded-full border transition-all hover:scale-110 active:scale-90 cursor-pointer ${col.bgClass} ${
                                avatarColor === col.id
                                  ? 'ring-2 ring-pink-500 scale-105 border-white'
                                  : 'border-slate-800'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-550 hover:to-rose-550 active:scale-95 text-white font-bold text-[11px] rounded-xl shadow-md transition-all cursor-pointer"
              >
                ➕ Añadir Alumno
              </button>
            </form>
          </div>
        )}

        {/* Step 3: Cuento Upload */}
        <div className="space-y-1.5 text-left">
          <label className="text-xs font-semibold text-purple-300 uppercase tracking-wider pl-1">3. Texto del Cuento</label>
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

        {/* Step 4: Questions Upload */}
        <div className="space-y-1.5 text-left">
          <label className="text-xs font-semibold text-purple-300 uppercase tracking-wider pl-1">4. Preguntas de Comprensión</label>
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
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl text-left">
            ⚠️ {error}
          </div>
        )}

        <button
          onClick={handleStartClick}
          disabled={!selectedSchool || !selectedPlayerId || !storyFile || !questionsFile}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-purple-500/20 active:scale-[0.98] transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none disabled:transform-none cursor-pointer"
        >
          ¡Empezar Competición!
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
