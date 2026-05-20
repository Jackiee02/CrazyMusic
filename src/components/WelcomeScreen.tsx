import React from 'react';
import { motion } from 'motion/react';
import { SceneTheme } from '../types';
import { Music, Play, Trophy, Shield } from 'lucide-react';

interface WelcomeScreenProps {
  theme: SceneTheme;
  setTheme: (t: SceneTheme) => void;
  difficulty: 'easy' | 'normal' | 'hard';
  setDifficulty: (d: 'easy' | 'normal' | 'hard') => void;
  onStartGame: () => void;
  highScore: number;
}

export default function WelcomeScreen({
  theme,
  setTheme,
  difficulty,
  setDifficulty,
  onStartGame,
  highScore
}: WelcomeScreenProps) {
  const isPig = theme === 'dreamy_pig';

  return (
    <div 
      id="welcome-gradient-container"
      className={`min-h-screen flex flex-col justify-center items-center p-4 transition-all duration-700 select-none
        ${isPig 
          ? 'bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200 text-rose-950' 
          : 'bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100'
        }
      `}
    >
      {/* Background Decor Sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {isPig ? (
          <>
            <span className="absolute top-[10%] left-[15%] text-4xl animate-pulse opacity-45">🌸</span>
            <span className="absolute top-[75%] left-[80%] text-3xl animate-pulse opacity-30 delay-1000">🌸</span>
            <span className="absolute top-[40%] right-[12%] text-2xl animate-bounce opacity-45 delay-500">✨</span>
            <div className="absolute top-[20%] right-[20%] w-72 h-72 bg-rose-300/20 rounded-full filter blur-3xl animate-pulse" />
          </>
        ) : (
          <>
            <span className="absolute top-[12%] left-[10%] text-3xl opacity-40">⚡</span>
            <span className="absolute top-[70%] left-[85%] text-2xl opacity-30 delay-1000">👾</span>
            <span className="absolute top-[50%] right-[15%] text-3xl opacity-40 delay-500">🛸</span>
            <div className="absolute bottom-[20%] left-[15%] w-80 h-80 bg-cyan-400/10 rounded-full filter blur-3xl animate-pulse" />
          </>
        )}
      </div>

      <motion.div 
        id="welcome-card-box"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 90, damping: 14 }}
        className={`w-full max-w-md rounded-[32px] border p-8 sm:p-10 shadow-2xl relative z-10 backdrop-blur-xl transition-colors duration-500 text-center
          ${isPig 
            ? 'bg-gradient-to-b from-rose-50/95 to-pink-100/95 border-rose-200/80 shadow-pink-200/55 text-rose-950' 
            : 'bg-slate-900/95 border-cyan-500/25 shadow-cyan-950/50 text-white'
          }
        `}
      >
        {/* Game Title */}
        <div className="mb-6">
          <h1 className={`text-4xl sm:text-5xl font-black tracking-tight leading-tight uppercase font-sans
            ${isPig 
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600 drop-shadow-xs' 
              : 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-pink-400 drop-shadow-[0_2px_8px_rgba(6,182,212,0.3)]'
            }
          `}>
            疯狂钢琴手
          </h1>
          <p className="text-xs sm:text-sm mt-2 opacity-75 leading-relaxed tracking-wide">
            跟着萌宠的音律节奏，敲击出专属于你的完美乐章！
          </p>

          {highScore > 0 && (
            <div className={`mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-xl text-xs font-bold border mx-auto
              ${isPig 
                ? 'bg-rose-50/80 border-rose-100 text-rose-600' 
                : 'bg-slate-950/60 border-slate-800 text-amber-400'
              }
            `}>
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>最高纪录: <span className="font-mono text-sm font-black">{highScore}</span> 分</span>
            </div>
          )}
        </div>

        {/* Character Avatar Picker */}
        <div className="mb-8">
          <div className="flex justify-center gap-10 items-center">
            
            {/* Cyber Duck Selection Option */}
            <button
              id="welcome-theme-duck"
              type="button"
              onClick={() => setTheme('cyber_duck')}
              className={`relative flex flex-col items-center gap-2 p-1.5 rounded-full transition-all duration-300 group cursor-pointer
                ${theme === 'cyber_duck'
                  ? 'scale-110'
                  : 'opacity-50 hover:opacity-85 hover:scale-105'
                }
              `}
            >
              <div className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl border-4 transition-all duration-300
                ${theme === 'cyber_duck'
                  ? 'bg-cyan-950/50 border-cyan-400 shadow-[0_0_24px_rgba(34,211,238,0.6)]'
                  : 'bg-slate-800 border-transparent'
                }
              `}>
                🦆
              </div>
            </button>

            {/* Dreamy Pig Selection Option */}
            <button
              id="welcome-theme-pig"
              type="button"
              onClick={() => setTheme('dreamy_pig')}
              className={`relative flex flex-col items-center gap-2 p-1.5 rounded-full transition-all duration-300 group cursor-pointer
                ${theme === 'dreamy_pig'
                  ? 'scale-110'
                  : 'opacity-50 hover:opacity-85 hover:scale-105'
                }
              `}
            >
              <div className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl border-4 transition-all duration-300
                ${theme === 'dreamy_pig'
                  ? 'bg-rose-100 border-rose-400 shadow-[0_0_24px_rgba(244,63,94,0.6)]'
                  : 'bg-rose-50/50 border-transparent'
                }
              `}>
                🐷
              </div>
            </button>

          </div>
        </div>

        {/* Difficulty Selector Block */}
        <div className="mb-4 max-w-xs mx-auto">
          <div className={`flex justify-center p-1 rounded-2xl gap-1 border transition-colors duration-300
            ${isPig 
              ? 'bg-rose-100/60 border-rose-200/60 shadow-[inset_0_2px_4px_rgba(244,63,94,0.05)]' 
              : 'bg-slate-950/80 border-slate-800'
            }
          `}>
            {(['easy', 'normal', 'hard'] as const).map((d) => (
              <button
                id={`welcome-diff-${d}`}
                key={d}
                type="button"
                onClick={() => setDifficulty(d)}
                className={`flex-1 py-2 rounded-xl text-xs font-black tracking-wide transition-all uppercase cursor-pointer
                  ${difficulty === d
                    ? isPig 
                      ? 'bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow-md shadow-rose-200/50' 
                      : 'bg-cyan-500 text-white shadow-md shadow-cyan-950/20'
                    : isPig
                      ? 'text-rose-700/80 hover:bg-rose-200/40'
                      : 'text-slate-400 hover:bg-slate-800/50'
                  }
                `}
              >
                {d === 'easy' ? '简单' : d === 'normal' ? '一般' : '困难'}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Description Context */}
        <div className="mb-8 min-h-[36px] px-2 flex items-center justify-center">
          <p className={`text-xs leading-relaxed font-bold transition-all duration-300
            ${isPig ? 'text-rose-700/90' : 'text-cyan-400/90'}
          `}>
            {difficulty === 'easy' && '👶 简单级：经典暖心儿歌《两只老虎》《小星星》等 (全随机)'}
            {difficulty === 'normal' && '🎵 一般级：周董经典《告白气球》《青花瓷》《晴天》等 (全随机)'}
            {difficulty === 'hard' && '👑 困难级：殿堂名曲《月光奏鸣曲》《致爱丽丝》《经典卡农》 (全随机)'}
          </p>
        </div>

        {/* Start Game Action */}
        <div className="flex flex-col items-center">
          <button
            id="welcome-start-button"
            type="button"
            onClick={onStartGame}
            className={`px-12 py-3.5 rounded-2xl font-black text-sm sm:text-base tracking-widest uppercase shadow-xl hover:scale-105 active:scale-95 transition duration-150 flex items-center gap-2.5 cursor-pointer
              ${isPig 
                ? 'bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white shadow-rose-200/50' 
                : 'bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 hover:from-cyan-500 hover:via-sky-600 hover:to-blue-700 text-white shadow-cyan-950/40'
              }
            `}
          >
            <Play className="w-5 h-5 fill-white" />
            <span>开始音乐敲击</span>
          </button>
          
          <span className="text-[9px] opacity-40 mt-4 flex items-center gap-1">
            <Shield className="w-3 h-3" />
            键盘绑定: A W S E D F T G Y H U J K 演奏
          </span>
        </div>

      </motion.div>
    </div>
  );
}
