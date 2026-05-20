import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { PIANO_KEYS, PianoKeyType, SceneTheme } from '../types';

interface PianoProps {
  theme: SceneTheme;
  activeKeys: Set<string>;
  onKeyPlay: (key: PianoKeyType) => void;
  targetKeyNote?: string | null;
}

export default function Piano({ theme, activeKeys, onKeyPlay, targetKeyNote }: PianoProps) {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  // Separate white and black keys for proper layout rendering
  const whiteKeys = PIANO_KEYS.filter(k => !k.isBlack);
  const blackKeys = PIANO_KEYS.filter(k => k.isBlack);

  // Custom key positions mapping where indices represent which white key boundary to sit on
  const getBlackKeyLeftPosition = (note: string) => {
    switch (note) {
      case 'G#3': return 'calc((100% / 15) * 1)';
      case 'A#3': return 'calc((100% / 15) * 2)';
      case 'C#4': return 'calc((100% / 15) * 4)';
      case 'D#4': return 'calc((100% / 15) * 5)';
      case 'F#4': return 'calc((100% / 15) * 7)';
      case 'G#4': return 'calc((100% / 15) * 8)';
      case 'A#4': return 'calc((100% / 15) * 9)';
      case 'C#5': return 'calc((100% / 15) * 11)';
      case 'D#5': return 'calc((100% / 15) * 12)';
      case 'F#5': return 'calc((100% / 15) * 14)';
      default: return '0%';
    }
  };

  // Keyboard listeners for desktop accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid firing during input focus
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }
      const upperKey = e.key.toUpperCase();
      const matchedKey = PIANO_KEYS.find(k => k.keyboardKey === upperKey);
      if (matchedKey) {
        onKeyPlay(matchedKey);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onKeyPlay]);

  return (
    <div id="piano-container" className="relative w-full h-44 xs:h-52 sm:h-60 md:h-64 lg:h-72 select-none">
      
      {/* Container holding the white keys */}
      <div className="flex w-full h-full gap-[2px] bg-slate-900/30 p-1 sm:p-2 rounded-2xl relative z-10">
        {whiteKeys.map((key) => {
          const isActive = activeKeys.has(key.note);
          const isTarget = key.note === targetKeyNote;
          const isPigTheme = theme === 'dreamy_pig';
          
          return (
            <button
              id={`piano-white-${key.note}`}
              key={key.note}
              className={`flex-1 flex flex-col justify-end items-center pb-4 rounded-b-lg transition-all duration-100 relative overflow-hidden focus:outline-none cursor-pointer
                ${isActive 
                  ? isPigTheme
                    ? 'bg-rose-300 ring-4 ring-rose-400/50 shadow-[0_0_15px_#f43f5e] border-t-4 border-rose-500' 
                    : 'bg-cyan-300 ring-4 ring-cyan-400/50 shadow-[0_0_20px_#06b6d4] border-t-4 border-cyan-500' 
                  : isTarget
                  ? isPigTheme
                    ? 'bg-rose-50 ring-2 ring-rose-400 animate-pulse border-b-4 border-rose-300 text-rose-600'
                    : 'bg-slate-900 ring-2 ring-cyan-400 animate-pulse border-b-4 border-cyan-700 text-cyan-400'
                  : isPigTheme
                    ? 'bg-white hover:bg-pink-50 text-rose-500 border-b-4 border-gray-200' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-b-4 border-slate-300'
                }
              `}
              onClick={() => onKeyPlay(key)}
              onMouseEnter={() => setHoveredKey(key.note)}
              onMouseLeave={() => setHoveredKey(null)}
            >
              {/* Target flashing indicator circle */}
              {isTarget && !isActive && (
                <span className={`absolute inset-0 opacity-15 animate-ping rounded-full ${isPigTheme ? 'bg-rose-400' : 'bg-cyan-400'}`} />
              )}
              
              {/* Visual star pointer for target note */}
              {isTarget && (
                <span className={`absolute top-1 text-[11px] animate-bounce z-25 ${isPigTheme ? 'text-rose-500' : 'text-cyan-400'}`}>
                  ⭐️
                </span>
              )}

              {/* Active lighting pulse overlay */}
              {isActive && (
                <span className={`absolute inset-0 opacity-20 animate-ping rounded-full ${isPigTheme ? 'bg-pink-300' : 'bg-cyan-300'}`} />
              )}

              {/* Note name & Bind display */}
              <div className="flex flex-col items-center pointer-events-none z-10">
                <span className="font-mono text-[9px] sm:text-xs font-bold leading-none uppercase opacity-40">
                  {key.keyboardKey}
                </span>
                <span className="font-sans text-xs sm:text-sm font-black tracking-tighter mt-1">
                  {key.label}
                </span>
                <span className="font-mono text-[9px] sm:text-[10px] uppercase font-semibold opacity-65">
                  {key.note.replace('4', '').replace('5', '⁺')}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Floating Absolutely Positioned Black Keys */}
      <div className="absolute top-1 left-1 right-1 h-[60%] pointer-events-none z-20 px-[2px] sm:px-2">
        <div className="relative w-full h-full">
          {blackKeys.map((key) => {
            const isActive = activeKeys.has(key.note);
            const isTarget = key.note === targetKeyNote;
            const isPigTheme = theme === 'dreamy_pig';
            const leftPos = getBlackKeyLeftPosition(key.note);

            return (
              <button
                id={`piano-black-${key.note}`}
                key={key.note}
                style={{
                  left: leftPos,
                  width: 'calc((100% / 15) * 0.62)', // Beautifully scaled for 15 keys
                  transform: 'translateX(-50%)',
                }}
                className={`absolute h-full rounded-b-md transition-all duration-100 focus:outline-none pointer-events-auto cursor-pointer flex flex-col justify-end items-center pb-2.5
                  ${isActive
                    ? isPigTheme
                      ? 'bg-rose-400 ring-4 ring-rose-400/40 shadow-[0_0_15px_#f43f5e]'
                      : 'bg-pink-500 ring-4 ring-pink-500/40 shadow-[0_0_20px_#ec4899]'
                    : isTarget
                    ? isPigTheme
                      ? 'bg-rose-950 ring-2 ring-rose-400 animate-pulse text-rose-300 border-b-4 border-rose-500'
                      : 'bg-indigo-950 ring-2 ring-cyan-400 animate-pulse text-cyan-300 border-b-4 border-cyan-500'
                    : isPigTheme
                      ? 'bg-stone-800 hover:bg-stone-700 text-rose-300 border-b-4 border-stone-950'
                      : 'bg-zinc-900 hover:bg-zinc-800 text-cyan-400 border-b-4 border-black'
                  }
                `}
                onClick={() => onKeyPlay(key)}
                onMouseEnter={() => setHoveredKey(key.note)}
                onMouseLeave={() => setHoveredKey(null)}
              >
                {/* Visual glow element on hit */}
                {isActive && (
                  <span className={`absolute inset-0 opacity-30 animate-pulse rounded-b-md ${isPigTheme ? 'bg-rose-200' : 'bg-pink-400'}`} />
                )}

                {/* Target indicator star for black keys */}
                {isTarget && (
                  <span className={`absolute top-1 text-[9px] animate-bounce z-25 ${isPigTheme ? 'text-rose-400' : 'text-cyan-400'}`}>
                    ⭐️
                  </span>
                )}

                {/* Key Bind Indicator */}
                <div className="flex flex-col items-center pointer-events-none z-10">
                  <span className="font-mono text-[8px] sm:text-[10px] font-bold opacity-75">
                    {key.keyboardKey}
                  </span>
                  <span className="font-sans text-[9px] sm:text-xs font-black mt-0.5 tracking-tighter scale-90">
                    {key.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
