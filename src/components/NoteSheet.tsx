import React from 'react';
import { motion } from 'motion/react';
import { SongType } from '../songs';
import { PIANO_KEYS } from '../types';

interface NoteSheetProps {
  currentSong: SongType | null;
  activeNoteIndex: number;
  theme: 'cyber_duck' | 'dreamy_pig';
  timeLeft: number;
  maxNoteTime: number;
  gameState: string;
}

export default function NoteSheet({
  currentSong,
  activeNoteIndex,
  theme,
  timeLeft,
  maxNoteTime,
  gameState,
}: NoteSheetProps) {
  if (!currentSong) return null;

  const isPig = theme === 'dreamy_pig';
  const notes = currentSong.notes;

  // Find keyboard keys for notes
  const getKeyboardKey = (note: string) => {
    const key = PIANO_KEYS.find(k => k.note === note);
    return key ? key.keyboardKey : '';
  };

  const getLabelAndNoteAndFrequency = (note: string) => {
    const key = PIANO_KEYS.find(k => k.note === note);
    return key ? { label: key.label, note: key.note } : { label: note, note };
  };

  const isInteractive = gameState === 'user_repeating';

  // Calculate percentage of timer left
  const timePercent = Math.max(0, Math.min(100, (timeLeft / maxNoteTime) * 100));

  // Determine timer color
  const timerBarColor = isPig
    ? timePercent < 30 ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]' : 'bg-gradient-to-r from-pink-400 to-rose-450 shadow-[0_0_8px_rgba(244,63,94,0.3)]'
    : timePercent < 30 ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-gradient-to-r from-cyan-400 to-teal-500 shadow-[0_0_8px_rgba(34,211,238,0.3)]';

  // Get index range to show. We center the active note
  const visibleRange = 7; // show active, plus up to 3 past and 5 future
  const startIdx = Math.max(0, activeNoteIndex - 2);
  const endIdx = Math.min(notes.length, startIdx + visibleRange);
  const displayedNotes = notes.slice(startIdx, endIdx);

  return (
    <div 
      id="scrolling-note-sheet"
      className={`w-full rounded-2xl border p-4 sm:p-5 flex flex-col gap-3 transition-all duration-300 relative overflow-hidden backdrop-blur-md select-none
        ${isPig 
          ? 'bg-white/70 border-rose-200/50 shadow-sm shadow-pink-100/50 text-rose-955' 
          : 'bg-slate-900/65 border-cyan-500/15 text-slate-100'
        }
      `}
    >
      {/* Decorative stave line in the background */}
      <div className="absolute left-6 right-6 top-[55%] h-[2px] bg-gray-250 dark:bg-slate-800 opacity-20 pointer-events-none" />
      
      {/* Top Banner with Progress tracking & Guide Text */}
      <div className="flex justify-between items-center w-full relative z-10 text-xs font-bold px-1">
        <span className="opacity-75 tracking-wider uppercase flex items-center gap-1.5 font-mono">
          <span>🎼 敲击谱流</span>
          <span className={`px-2 py-0.5 rounded-md text-[10px] 
            ${isPig ? 'bg-rose-100 text-rose-700' : 'bg-cyan-950/60 text-cyan-400'}
          `}>
            {activeNoteIndex + 1} / {notes.length} 音符
          </span>
        </span>
        
        {isInteractive && (
          <span className={`text-[10px] sm:text-xs font-black animate-pulse
            ${timePercent < 30 ? 'text-red-500' : isPig ? 'text-rose-600' : 'text-cyan-400'}
          `}>
            {timePercent < 30 ? '⏱️ 快！没时间了！' : '👉 按下高亮琴键'}
          </span>
        )}
        {gameState === 'autoplay' && (
          <span className="text-[10px] sm:text-xs text-amber-500 animate-bounce tracking-wide">
            ✨ 系统正在优雅演奏
          </span>
        )}
      </div>

      {/* Main Track containing Scrolling Notes Grid */}
      <div className="w-full flex justify-center items-center py-2 relative z-10 gap-3 min-h-[90px] xs:gap-4 md:gap-5 overflow-visible">
        {displayedNotes.map((note, index) => {
          const absoluteIdx = startIdx + index;
          const isActive = absoluteIdx === activeNoteIndex;
          const isCompleted = absoluteIdx < activeNoteIndex;
          const kKey = getKeyboardKey(note);
          const { label, note: cleanNote } = getLabelAndNoteAndFrequency(note);

          return (
            <motion.div
              layout
              key={`${note}-${absoluteIdx}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: isActive ? 1.18 : 1,
                opacity: isActive ? 1 : isCompleted ? 0.35 : 0.75,
                y: isActive ? -4 : 0,
              }}
              transition={{ type: 'spring', stiffness: 220, damping: 18 }}
              className={`flex flex-col items-center relative gap-1.5 pt-1
                ${isActive ? 'z-20' : 'z-10'}
              `}
            >
              {/* Note Circle */}
              <div
                className={`w-12 h-12 rounded-full flex flex-col items-center justify-center border-2 transition-all duration-300 shadow-md relative
                  ${isActive
                    ? isPig
                      ? 'bg-gradient-to-b from-rose-50 to-rose-200 border-rose-450 shadow-[0_0_16px_rgba(244,63,94,0.6)] ring-4 ring-rose-400/20'
                      : 'bg-gradient-to-b from-slate-900 to-slate-800 border-cyan-400 shadow-[0_0_16px_rgba(34,211,238,0.6)] ring-4 ring-cyan-400/20'
                    : isCompleted
                    ? isPig
                      ? 'bg-pink-100/50 border-rose-200/50 text-rose-400'
                      : 'bg-slate-950/40 border-slate-800 text-slate-500'
                    : isPig
                    ? 'bg-rose-50 border-rose-250 text-rose-800 hover:bg-rose-100'
                    : 'bg-slate-900 border-slate-700 text-slate-200'
                  }
                `}
              >
                {/* Solfege name e.g. Do / Re / Mi */}
                <span className={`font-black text-xs tracking-tight ${isActive ? 'scale-110' : 'opacity-85'}`}>
                  {label}
                </span>

                {/* Note letter index */}
                <span className={`font-mono text-[9px] -mt-0.5 leading-none opacity-60`}>
                  {cleanNote}
                </span>

                {/* Keyboard Binding hint bubble inside circle */}
                {!isCompleted && kKey && (
                  <span className={`absolute -right-1 -top-1 font-mono text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs border
                    ${isActive
                      ? isPig
                        ? 'bg-rose-500 text-white border-rose-400'
                        : 'bg-cyan-500 text-slate-950 border-cyan-400'
                      : isPig
                      ? 'bg-rose-100 text-rose-700 border-rose-300'
                      : 'bg-slate-800 text-slate-350 border-slate-700'
                    }
                  `}>
                    {kKey}
                  </span>
                )}

                {/* Checked mark overlay for completed notes */}
                {isCompleted && (
                  <span className="absolute inset-0 bg-emerald-500/10 rounded-full flex items-center justify-center text-xs animate-fade-in font-bold">
                    ✅
                  </span>
                )}
              </div>

              {/* Status pointer bubble */}
              {isActive && (
                <motion.div
                  initial={{ y: 4, opacity: 0 }}
                  animate={{ y: [4, 0, 4], opacity: 1 }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className={`text-[8px] font-black px-1.5 py-0.5 rounded-md border tracking-wider uppercase
                    ${isPig 
                      ? 'bg-rose-100 border-rose-200 text-rose-700' 
                      : 'bg-cyan-950 border-cyan-400 text-cyan-400'
                    }
                  `}
                >
                  {isInteractive ? '敲击' : '播放'}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Real-time countdown progress bar for the active note (only in interactive repeat state) */}
      {isInteractive && (
        <div className="w-full flex items-center gap-2 mt-1 px-1 relative z-10 font-mono text-[10px] font-bold">
          <span className="opacity-65">计时</span>
          <div className="h-2 flex-1 rounded-full bg-slate-950/50 border border-slate-800/30 overflow-hidden relative">
            <motion.div 
              id="notesheet-timer-bar-anim"
              className={`h-full ${timerBarColor}`}
              style={{ width: `${timePercent}%` }}
              transition={{ ease: "linear", duration: 0.05 }}
            />
          </div>
          <span className={timePercent < 30 ? 'text-red-500 font-black animate-pulse' : 'opacity-65'}>
            {(timeLeft / 1000).toFixed(1)}s
          </span>
        </div>
      )}
    </div>
  );
}
