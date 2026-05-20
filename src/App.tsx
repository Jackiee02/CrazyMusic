import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import CyberDuckScene from './components/CyberDuckScene';
import DreamyPigScene from './components/DreamyPigScene';
import Piano from './components/Piano';
import GameHUD from './components/GameHUD';
import HelpModal from './components/HelpModal';
import WelcomeScreen from './components/WelcomeScreen';
import NoteSheet from './components/NoteSheet';
import { SceneTheme, GameState, PianoKeyType, ScoreState, PIANO_KEYS } from './types';
import { SongType, SONG_POOLS, getPianoKeysForSongNotes } from './songs';
import { gameAudio } from './utils/audio';
import { AlertCircle, RotateCcw, Home, Trophy, Award, Sparkles } from 'lucide-react';

export default function App() {
  const [screen, setScreen] = useState<'welcome' | 'playing'>('welcome');
  const [theme, setTheme] = useState<SceneTheme>('cyber_duck');
  
  const [gameState, setGameState] = useState<GameState>('idle');
  const [currentSong, setCurrentSong] = useState<SongType | null>(null);
  const [difficulty, setDifficulty] = useState<'easy' | 'normal' | 'hard'>('normal');
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [lastActiveNote, setLastActiveNote] = useState<string | null>(null);
  const [activeNoteCount, setActiveNoteCount] = useState<number>(0);
  const [showHelp, setShowHelp] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Note-by-note interactive gameplay states
  const [activeNoteIndex, setActiveNoteIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(3000);
  const [maxNoteTime, setMaxNoteTime] = useState<number>(3000);
  const [isAutoplayMode, setIsAutoplayMode] = useState<boolean>(false);

  // Score statistics state
  const [scoreState, setScoreState] = useState<ScoreState>({
    currentScore: 0,
    highScore: 0,
    lives: 3,
    streak: 0,
    maxStreak: 0,
  });

  // Audio volume state
  const [volume, setVolume] = useState(0.5);

  const isPig = theme === 'dreamy_pig';

  // Triggers visual feedback for a note (both piano and character scene)
  const triggerNoteActivity = useCallback((note: string) => {
    setLastActiveNote(note);
    setActiveNoteCount(prev => prev + 1);
    
    // Spark lighting up key
    setActiveKeys(prev => {
      const updated = new Set(prev);
      updated.add(note);
      return updated;
    });

    // Auto clear after 220ms
    setTimeout(() => {
      setActiveKeys(prev => {
        const updated = new Set(prev);
        updated.delete(note);
        return updated;
      });
    }, 220);
  }, []);

  const isPausedRef = useRef(isPaused);
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  const gameStateRef = useRef(gameState);
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const activeNoteIndexRef = useRef(activeNoteIndex);
  useEffect(() => {
    activeNoteIndexRef.current = activeNoteIndex;
  }, [activeNoteIndex]);

  // Handle master volume adjustments
  useEffect(() => {
    gameAudio.setVolume(volume);
  }, [volume]);

  // High fidelity countdown timer effect for the interactive "user_repeating" play state
  useEffect(() => {
    if (gameState !== 'user_repeating' || isPaused || !currentSong) return;

    const tickMs = 50;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= tickMs) {
          return 0; // trigger timeout
        }
        return prev - tickMs;
      });
    }, tickMs);

    return () => clearInterval(interval);
  }, [gameState, isPaused, currentSong, activeNoteIndex]);

  // Handler for note timeout ("没跟上" - didn't keep up with the note)
  const handleNoteTimeout = useCallback(() => {
    if (!currentSong || gameStateRef.current !== 'user_repeating' || isPausedRef.current) return;

    // 1. Play the tone automatically so the rhythm of the melody doesn't break
    const songKeys = getPianoKeysForSongNotes(currentSong.notes);
    const missedKey = songKeys[activeNoteIndexRef.current];
    if (missedKey) {
      gameAudio.playPianoTone(missedKey.frequency, 0.4);
      triggerNoteActivity(missedKey.note);
    }

    // 2. Reduce life by 1 & reset correct street combo
    const nextLives = scoreState.lives - 1;
    setScoreState(prev => ({
      ...prev,
      lives: nextLives,
      streak: 0,
    }));

    // 3. Play a soft buzz warning
    gameAudio.playErrorBuzzer();

    // 4. Advance note pointer (or trigger game over if dead)
    const nextIndex = activeNoteIndexRef.current + 1;
    if (nextLives <= 0) {
      setGameState('game_over');
      updateHighScoreIfNeeded(scoreState.currentScore);
    } else if (nextIndex >= songKeys.length) {
      // Finished the song!
      setGameState('victory');
      updateHighScoreIfNeeded(scoreState.currentScore);
    } else {
      setActiveNoteIndex(nextIndex);
      // Reset timer for next note
      const baseLimit = difficulty === 'easy' ? 3500 : difficulty === 'normal' ? 2400 : 1600;
      const nextBeatFactor = (currentSong.beats && currentSong.beats[nextIndex] !== undefined)
        ? currentSong.beats[nextIndex]
        : 1;
      const nextLimit = Math.max(baseLimit * Math.min(1.5, nextBeatFactor), baseLimit * 0.6);
      setTimeLeft(nextLimit);
      setMaxNoteTime(nextLimit);
    }
  }, [currentSong, scoreState.lives, scoreState.currentScore, difficulty, triggerNoteActivity]);

  // Monitor timer timeout
  useEffect(() => {
    if (gameState === 'user_repeating' && timeLeft === 0 && !isPaused) {
      handleNoteTimeout();
    }
  }, [timeLeft, gameState, isPaused, handleNoteTimeout]);

  // Autoplay note sequence scheduler
  useEffect(() => {
    if (gameState !== 'autoplay' || !currentSong || isPaused) return;

    const songKeys = getPianoKeysForSongNotes(currentSong.notes);
    if (activeNoteIndex >= songKeys.length) {
      // Finished playing the full song successfully! Transition to victory layout
      setGameState('victory');
      return;
    }

    const key = songKeys[activeNoteIndex];
    
    // Calculate adaptive delay based on previous note's rhythm duration
    const baseAutoplaySpeed = difficulty === 'easy' ? 600 : difficulty === 'normal' ? 450 : 350;
    const prevBeatFactor = (activeNoteIndex > 0 && currentSong.beats && currentSong.beats[activeNoteIndex - 1] !== undefined)
      ? currentSong.beats[activeNoteIndex - 1]
      : 1;
    
    const delay = activeNoteIndex === 0 ? 500 : (baseAutoplaySpeed * prevBeatFactor);

    const timer = setTimeout(() => {
      gameAudio.playPianoTone(key.frequency, 0.45);
      triggerNoteActivity(key.note);
      setActiveNoteIndex(prev => prev + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [gameState, activeNoteIndex, currentSong, isPaused, triggerNoteActivity, difficulty]);

  // Load highscore from local storage
  useEffect(() => {
    try {
      const storedHighScore = localStorage.getItem('pet_piano_highscore');
      if (storedHighScore) {
        setScoreState(prev => ({ ...prev, highScore: parseInt(storedHighScore, 10) }));
      }
    } catch (e) {
      console.warn('Could not read highscore', e);
    }
  }, []);

  // Update highscore logic helper
  const updateHighScoreIfNeeded = (finalScore: number) => {
    if (finalScore > scoreState.highScore) {
      setScoreState(prev => ({ ...prev, highScore: finalScore }));
      try {
        localStorage.setItem('pet_piano_highscore', finalScore.toString());
      } catch (e) {
        console.warn('Could not save highscore', e);
      }
      return true;
    }
    return false;
  };

  // Reset/Start dynamic game
  const handleResetGame = useCallback((selectedDiff: 'easy' | 'normal' | 'hard' = difficulty) => {
    gameAudio.resume();
    setIsPaused(false);
    setIsAutoplayMode(false);
    
    // Select a completely random song from the chosen difficulty pool (preventing memorization)
    const pool = SONG_POOLS[selectedDiff];
    const selectedSong = pool[Math.floor(Math.random() * pool.length)];
    setCurrentSong(selectedSong);
    setActiveNoteIndex(0);

    setScoreState(prev => ({
      ...prev,
      currentScore: 0,
      lives: 3,
      streak: 0,
    }));

    // Setup timer threshold for the first note
    const baseLimit = selectedDiff === 'easy' ? 3500 : selectedDiff === 'normal' ? 2450 : 1650;
    const firstBeatFactor = (selectedSong.beats && selectedSong.beats[0] !== undefined)
      ? selectedSong.beats[0]
      : 1;
    const initialLimit = Math.max(baseLimit * Math.min(1.5, firstBeatFactor), baseLimit * 0.6);
    setTimeLeft(initialLimit);
    setMaxNoteTime(initialLimit);
    
    gameStateRef.current = 'user_repeating';
    setGameState('user_repeating');
  }, [difficulty]);

  // Handle start game selection transfer
  const handleStartGame = useCallback(() => {
    setScreen('playing');
    handleResetGame(difficulty);
  }, [difficulty, handleResetGame]);

  // Handle Give Up and let the system autoplay the song notes
  const handleGiveUpAndAutoplay = useCallback(() => {
    if (!currentSong) return;
    setIsPaused(false);
    setIsAutoplayMode(true);
    gameStateRef.current = 'autoplay';
    setGameState('autoplay');
  }, [currentSong]);

  // Process manual or key binding taps on the piano
  const handleKeyInteraction = useCallback((key: PianoKeyType) => {
    // If paused, completely ignore inputs
    if (isPausedRef.current) return;

    // Resume audio context
    gameAudio.resume();

    // 1. Synthesize sound and flash key active
    gameAudio.playPianoTone(key.frequency, 0.5);
    triggerNoteActivity(key.note);

    // 2. Score calculation if game sequence repeating state is ongoing
    if (gameState === 'user_repeating' && currentSong) {
      const songKeys = getPianoKeysForSongNotes(currentSong.notes);
      const targetKey = songKeys[activeNoteIndex];
      
      if (key.note === targetKey.note) {
        // Correct Note strike!
        const nextIndex = activeNoteIndex + 1;
        
        // Score formula: Base (10pts) + Streak increment multiplier!
        const currentStreak = scoreState.streak + 1;
        const streakBonus = Math.floor(currentStreak / 5) * 5;
        const correctScoreGain = 10 + streakBonus;

        setScoreState(prev => {
          const nextStreak = prev.streak + 1;
          return {
            ...prev,
            currentScore: prev.currentScore + correctScoreGain,
            streak: nextStreak,
            maxStreak: Math.max(prev.maxStreak, nextStreak)
          };
        });

        // Did they match the entire song notes?
        if (nextIndex >= songKeys.length) {
          // Play success chime and transition to victory!
          gameAudio.playSuccessChime();
          setGameState('victory');
          updateHighScoreIfNeeded(scoreState.currentScore + correctScoreGain + 100); // 100pts victory bonus!
        } else {
          // Move to next note
          setActiveNoteIndex(nextIndex);
          // Re-initialize countdown timer of next note
          const baseLimit = difficulty === 'easy' ? 3500 : difficulty === 'normal' ? 2400 : 1600;
          const nextBeatFactor = (currentSong.beats && currentSong.beats[nextIndex] !== undefined)
            ? currentSong.beats[nextIndex]
            : 1;
          const nextLimit = Math.max(baseLimit * Math.min(1.5, nextBeatFactor), baseLimit * 0.6);
          setTimeLeft(nextLimit);
          setMaxNoteTime(nextLimit);
        }

      } else {
        // Wrong Note strike! Oh no!
        gameAudio.playErrorBuzzer();
        const nextLives = scoreState.lives - 1;

        setScoreState(prev => ({
          ...prev,
          lives: nextLives,
          streak: 0
        }));

        if (nextLives <= 0) {
          // Trigger GAME OVER
          setGameState('game_over');
          updateHighScoreIfNeeded(scoreState.currentScore);
        }
        // NOTE: We don't advance the note pointer on wrong hits, allowing player to try again!
      }
    }
  }, [gameState, activeNoteIndex, currentSong, scoreState, difficulty, triggerNoteActivity]);

  // Target key note name to highlight inside the physical piano keyboard
  const pianoTargetNoteClass = (gameState === 'user_repeating' && currentSong)
    ? currentSong.notes[activeNoteIndex]
    : null;

  return (
    <AnimatePresence mode="wait">
      {screen === 'welcome' ? (
        <motion.div
          key="welcome-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full"
        >
          <WelcomeScreen
            theme={theme}
            setTheme={setTheme}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            onStartGame={handleStartGame}
            highScore={scoreState.highScore}
          />
        </motion.div>
      ) : (
        <motion.div
          key="game-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          id="root-viewport" 
          className={`min-h-screen flex flex-col justify-start transition-colors duration-700 font-sans p-2 xs:p-3 sm:p-5 md:p-6 lg:p-8 gap-4
            ${isPig 
              ? 'bg-rose-100/40 text-rose-955 selection:bg-rose-200' 
              : 'bg-slate-950 text-slate-100 selection:bg-cyan-900/50'
            }
          `}
        >
          {/* Visual background atmospheric elements */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            {isPig ? (
              <div className="absolute top-10 left-10 w-96 h-96 bg-pink-300/10 rounded-full blur-3xl animate-pulse" />
            ) : (
              <>
                <div className="absolute -top-10 -left-10 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl" />
                <div className="absolute top-2/3 right-10 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl animate-pulse" />
              </>
            )}
          </div>

          {/* Main Core Viewport limiting maximum desktop width for elegant scaling */}
          <div className="w-full max-w-6xl mx-auto flex-1 flex flex-col gap-4 justify-start relative z-15">
            
            {/* Top Control Bar */}
            <GameHUD
              theme={theme}
              gameState={gameState}
              resetGame={() => handleResetGame(difficulty)}
              volume={volume}
              setVolume={setVolume}
              isPaused={isPaused}
              setIsPaused={setIsPaused}
              setShowHelp={setShowHelp}
              onBackToMenu={() => {
                setScreen('welcome');
                setGameState('idle');
                setIsPaused(false);
              }}
              currentSongName={currentSong?.name}
              currentSongArtist={currentSong?.artist}
              onGiveUp={handleGiveUpAndAutoplay}
            />

            {/* Dynamic Interactive Character Stage (Duck or Pig) */}
            <div id="main-scene-rack" className="w-full aspect-[4/3] xs:aspect-[16/10] sm:aspect-[16/9] md:h-[300px] lg:h-[340px] relative overflow-hidden rounded-2xl border border-transparent">
              <AnimatePresence mode="wait">
                {theme === 'cyber_duck' ? (
                  <motion.div
                    key="cyber_duck"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full"
                  >
                    <CyberDuckScene 
                      lastActiveNote={lastActiveNote} 
                      activeNoteCount={activeNoteCount} 
                      gameState={gameState} 
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="dreamy_pig"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full"
                  >
                    <DreamyPigScene 
                      lastActiveNote={lastActiveNote} 
                      activeNoteCount={activeNoteCount} 
                      gameState={gameState} 
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Floating Arcade Scoreboard & Health hearts in the top right OVER the active stage */}
              <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2 pointer-events-none select-none">
                
                {/* Hearts / Remaining Lives with beautiful shadow */}
                <div className="flex gap-1 items-center bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-lg">
                  {[1, 2, 3].map((heartIndex) => {
                    const isActive = scoreState.lives >= heartIndex;
                    return (
                      <motion.span
                        key={heartIndex}
                        animate={isActive ? { scale: [1, 1.15, 1] } : { scale: 1, rotate: [0, 15, -15, 0] }}
                        transition={{
                          repeat: isActive ? Infinity : 0,
                          repeatDelay: 3.5,
                          duration: 0.5
                        }}
                        className="text-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] cursor-default"
                        title={`生命值 ${scoreState.lives}`}
                      >
                        {isActive ? '❤️' : '🖤'}
                      </motion.span>
                    );
                  })}
                </div>

                {/* Score & Combo Panel */}
                <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-2xl border border-white/10 shadow-xl">
                  
                  {scoreState.streak > 0 && (
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-center gap-1 text-xs font-black text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded-md border border-amber-500/20"
                    >
                      <span>🔥 {scoreState.streak} 连击</span>
                    </motion.div>
                  )}

                  <div className="flex items-baseline gap-1">
                    <span className="text-[9px] font-black uppercase text-white/40 tracking-widest mr-1">SCORE</span>
                    <span className="text-xl sm:text-2xl font-mono font-black text-white leading-none tracking-tight">
                      {scoreState.currentScore}
                    </span>
                  </div>

                </div>

              </div>
              
              {/* Optional Pause Overlay directly over screen */}
              <AnimatePresence>
                {isPaused && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsPaused(false)}
                    className="absolute inset-0 bg-black/65 backdrop-blur-xs flex flex-col justify-center items-center z-19 cursor-pointer"
                  >
                    <motion.div
                      initial={{ scale: 0.9 }}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="bg-slate-900/90 border border-amber-400/40 p-6 rounded-3xl text-center shadow-2xl max-w-xs"
                    >
                      <span className="text-4xl block mb-2">⏸️</span>
                      <h4 className="text-lg font-black text-amber-400 font-sans uppercase">游戏已暂停</h4>
                      <p className="text-xs text-white/70 mt-1">点击任意位置或按下顶部“继续”按钮恢复游戏</p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Note scrolling sheet visualizer cue track */}
            <NoteSheet
              currentSong={currentSong}
              activeNoteIndex={activeNoteIndex}
              theme={theme}
              timeLeft={timeLeft}
              maxNoteTime={maxNoteTime}
              gameState={gameState}
            />

            {/* Dynamic Bottom Half: The responsive full-functioning touch piano */}
            <div className={`p-2.5 xs:p-4 rounded-2xl border transition-all duration-300 shadow-xl
              ${isPig 
                ? 'bg-rose-50/70 border-rose-200/50 shadow-pink-100' 
                : 'bg-slate-900 border-cyan-500/20 shadow-cyan-950/20'
              }
            `}>
              <div className="flex justify-between items-center mb-1.5 px-1 opacity-75">
                <span className="text-[10px] font-black uppercase tracking-wider">🎹 疯狂钢琴手键盘控制表</span>
                <span className="text-[9px] font-mono select-none opacity-50">
                  支持物理键盘 A 到 K 
                </span>
              </div>
              <Piano 
                theme={theme} 
                activeKeys={activeKeys} 
                onKeyPlay={handleKeyInteraction} 
                targetKeyNote={pianoTargetNoteClass}
              />
            </div>
          </div>

          {/* Help Modal */}
          <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} isPig={isPig} />

          {/* Game Over Popups */}
          <AnimatePresence>
            {gameState === 'game_over' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-md"
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className={`w-full max-w-sm p-6 rounded-3xl text-center border shadow-2xl relative
                    ${isPig 
                      ? 'bg-rose-50 border-rose-300 text-rose-955' 
                      : 'bg-slate-900 border-cyan-500/30 text-slate-100'
                    }
                  `}
                >
                  <div className="w-16 h-16 bg-red-500/20 border border-red-500/40 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                     <AlertCircle className="w-8 h-8" />
                  </div>
                  
                  <h3 className="text-xl font-black font-sans mb-1 uppercase tracking-tight">生命已用尽</h3>
                  <p className="text-xs opacity-75 mb-6 leading-relaxed">
                    别灰心！这是一段考验反应与音律的节奏挑战，重整旗鼓，再次弹奏出完美歌谣吧！
                  </p>

                  <div className={`p-4 rounded-xl mb-6 grid grid-cols-2 gap-4 border
                    ${isPig ? 'bg-pink-100/30 border-rose-200' : 'bg-slate-950/50 border-slate-800'}
                  `}>
                    <div className="text-center">
                      <span className="text-[10px] font-bold block opacity-60">本局得分</span>
                      <span className="text-2xl font-mono font-black">{scoreState.currentScore}</span>
                    </div>
                    <div className="text-center border-l dark:border-slate-800 border-rose-200">
                      <span className="text-[10px] font-bold block opacity-60">最高连击数</span>
                      <span className="text-2xl font-mono font-black text-amber-500">{scoreState.maxStreak}</span>
                    </div>
                  </div>

                  {scoreState.currentScore >= scoreState.highScore && scoreState.currentScore > 0 && (
                    <div className="mb-6 p-2 rounded-lg bg-yellow-500/20 border border-yellow-500/30 text-amber-400 font-bold text-xs uppercase flex items-center justify-center gap-1.5">
                      <Award className="w-4 h-4 animate-spin" />
                      <span>恭喜！刷新了最高得分纪录！</span>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      id="btn-game-over-retry"
                      onClick={() => handleResetGame(difficulty)}
                      className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-wider transform transition active:scale-95 shadow-md flex items-center justify-center gap-1.5 cursor-pointer
                        ${isPig 
                          ? 'bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white shadow-pink-200' 
                          : 'bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 hover:from-cyan-500 hover:via-sky-600 hover:to-blue-700 text-white shadow-cyan-950/40'
                        }
                      `}
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>重新开始挑战</span>
                    </button>
                    
                    <button
                      id="btn-game-over-lobby"
                      onClick={() => {
                        setScreen('welcome');
                        setGameState('idle');
                        setIsPaused(false);
                      }}
                      className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-wider transform transition active:scale-95 shadow-md flex items-center justify-center gap-1.5 cursor-pointer border
                        ${isPig
                          ? 'bg-rose-100 hover:bg-rose-200 text-rose-700 border-rose-200 shadow-rose-100/50'
                          : 'bg-slate-950 hover:bg-slate-900 text-cyan-400 border-cyan-500/30 shadow-[0_0_8px_rgba(6,182,212,0.1)]'
                        }
                      `}
                    >
                      <Home id="game-over-home-icon" className="w-4 h-4" />
                      <span>返回大厅</span>
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {gameState === 'victory' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 backdrop-blur-md"
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className={`w-full max-w-sm p-6 rounded-3xl text-center border shadow-2xl relative
                    ${isPig 
                      ? 'bg-rose-50 border-rose-300 text-rose-955' 
                      : 'bg-slate-900 border-cyan-500/30 text-slate-100'
                    }
                  `}
                >
                  <div className="w-16 h-16 bg-yellow-500/20 border border-yellow-500 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <Trophy className="w-8 h-8" />
                  </div>
                  
                  <h3 className="text-xl font-black font-sans mb-1 uppercase tracking-wider text-amber-500">
                    {isAutoplayMode ? '🎶 自动演奏完毕！' : '🎉 完美演奏大成功！'}
                  </h3>
                  <p className="text-xs opacity-85 mb-4 leading-relaxed">
                    {isAutoplayMode 
                      ? '欣赏完精彩的系统音乐弹奏啦！要不要开启实战挑战，亲自演奏一次？' 
                      : '太棒了！你完美跟上了所有节拍，弹奏出精美乐章！你就是当代疯狂钢琴大师！'
                    }
                  </p>

                  {currentSong && (
                    <div className={`p-3 rounded-xl mb-6 border font-mono
                      ${isPig ? 'bg-pink-100/50 border-rose-200 text-rose-800' : 'bg-slate-950/60 border-cyan-500/10 text-cyan-400'}
                    `}>
                      <span className="text-[10px] block opacity-65 uppercase">
                        {isAutoplayMode ? '当前演练曲目' : '通关曲目'}
                      </span>
                      <span className="text-sm font-black">《{currentSong.name}》</span>
                      {currentSong.artist && <span className="text-[10px] opacity-70 ml-1">({currentSong.artist})</span>}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      id="btn-victory-retry"
                      onClick={() => handleResetGame(difficulty)}
                      className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-wider transform transition active:scale-95 shadow-md flex items-center justify-center gap-1.5 cursor-pointer
                        ${isPig 
                          ? 'bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white shadow-pink-200' 
                          : 'bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 hover:from-cyan-500 hover:via-sky-600 hover:to-blue-700 text-white shadow-cyan-950/40'
                        }
                      `}
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>{isAutoplayMode ? '亲自开启挑战' : '挑战下一首'}</span>
                    </button>
                    
                    <button
                      id="btn-victory-lobby"
                      onClick={() => {
                        setScreen('welcome');
                        setGameState('idle');
                        setIsPaused(false);
                        setIsAutoplayMode(false);
                      }}
                      className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-wider transform transition active:scale-95 shadow-md flex items-center justify-center gap-1.5 cursor-pointer border
                        ${isPig
                          ? 'bg-rose-100 hover:bg-rose-200 text-rose-700 border-rose-200 shadow-rose-100/50'
                          : 'bg-slate-950 hover:bg-slate-900 text-cyan-400 border-cyan-500/30 shadow-[0_0_8px_rgba(6,182,212,0.1)]'
                        }
                      `}
                    >
                      <Home id="victory-home-icon" className="w-4 h-4" />
                      <span>返回大厅</span>
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
