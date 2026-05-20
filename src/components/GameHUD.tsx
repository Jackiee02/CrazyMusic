import React from 'react';
import { SceneTheme, GameState } from '../types';
import { Volume2, VolumeX, RotateCcw, Play, Pause, HelpCircle, Home, Sparkles } from 'lucide-react';

interface GameHUDProps {
  theme: SceneTheme;
  gameState: GameState;
  resetGame: () => void;
  volume: number;
  setVolume: (v: number) => void;
  isPaused: boolean;
  setIsPaused: (p: boolean) => void;
  setShowHelp: (b: boolean) => void;
  onBackToMenu: () => void;
  currentSongName?: string;
  currentSongArtist?: string;
  onGiveUp?: () => void;
}

export default function GameHUD({
  theme,
  gameState,
  resetGame,
  volume,
  setVolume,
  isPaused,
  setIsPaused,
  setShowHelp,
  onBackToMenu,
  currentSongName,
  currentSongArtist,
  onGiveUp
}: GameHUDProps) {
  const isPig = theme === 'dreamy_pig';

  return (
    <div 
      id="game-hud-top-bar" 
      className={`w-full p-3 sm:p-4 rounded-2xl border transition-all duration-300 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md select-none relative z-20
        ${isPig 
          ? 'bg-white/95 border-rose-200/80 backdrop-blur-md shadow-pink-100' 
          : 'bg-slate-900/95 border-cyan-500/25 backdrop-blur-md shadow-cyan-950/40 text-white'
        }
      `}
    >
      {/* Left side actions: Home & Restart & Pause */}
      <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-center sm:justify-start">
        
        {/* Back to Lobby */}
        <button
          id="btn-hud-lobby"
          onClick={onBackToMenu}
          className={`px-3 py-1.5 sm:px-3.5 rounded-xl transition-all duration-150 cursor-pointer flex items-center gap-1.5 text-xs font-black border-2 shadow-xs active:scale-95
            ${isPig 
              ? 'bg-rose-100/80 hover:bg-rose-200 text-rose-800 border-rose-300/80 shadow-rose-100' 
              : 'bg-slate-950 hover:bg-slate-900 text-cyan-400 border-cyan-500/30 shadow-[0_0_8px_rgba(6,182,212,0.1)]'
            }
          `}
          title="返回大厅"
        >
          <Home className="w-4 h-4" />
          <span className="hidden xs:inline">返回大厅</span>
        </button>

        {/* Restart / Challenger */}
        <button
          id="btn-hud-restart"
          onClick={resetGame}
          disabled={gameState === 'melody_playing'}
          className={`px-3 py-1.5 sm:px-3.5 rounded-xl transition-all duration-150 cursor-pointer flex items-center gap-1.5 text-xs font-black border-2 shadow-xs active:scale-95 disabled:opacity-40 disabled:pointer-events-none
            ${isPig 
              ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200 shadow-rose-100' 
              : 'bg-slate-950 hover:bg-slate-900 text-cyan-400 border-cyan-500/30 shadow-[0_0_8px_rgba(6,182,212,0.1)]'
            }
          `}
          title="重新开始"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden xs:inline">重新开始</span>
        </button>

        {/* Pause / Resume */}
        <button
          id="btn-hud-pause"
          onClick={() => setIsPaused(!isPaused)}
          className={`px-3 py-1.5 sm:px-3.5 rounded-xl transition-all duration-150 cursor-pointer flex items-center gap-1.5 text-xs font-black border-2 shadow-xs active:scale-95
            ${isPaused 
              ? isPig 
                ? 'bg-amber-400 hover:bg-amber-500 text-amber-950 border-amber-500 shadow-amber-100' 
                : 'bg-amber-500 hover:bg-amber-600 text-slate-950 border-amber-400' 
              : isPig 
                ? 'bg-white hover:bg-rose-100 text-rose-600 border-rose-200/50' 
                : 'bg-slate-950 hover:bg-slate-950 border-cyan-500/15 text-cyan-400'
            }
          `}
          title={isPaused ? "继续游戏" : "暂停游戏"}
        >
          {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4 fill-current" />}
          <span>{isPaused ? '继续' : '暂停'}</span>
        </button>

        {/* Autoplay / Give Up */}
        {onGiveUp && gameState !== 'victory' && gameState !== 'game_over' && (
          <button
            id="btn-hud-autoplay"
            onClick={onGiveUp}
            disabled={gameState === 'autoplay'}
            className={`px-3 py-1.5 sm:px-3.5 rounded-xl transition-all duration-150 cursor-pointer flex items-center gap-1.5 text-xs font-black border-2 shadow-xs active:scale-95 disabled:opacity-50 disabled:pointer-events-none
              ${gameState === 'autoplay'
                ? isPig
                  ? 'bg-gradient-to-r from-pink-400 to-rose-450 text-white border-rose-300'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-400'
                : isPig
                ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-205 shadow-rose-50'
                : 'bg-slate-950 hover:bg-slate-900 border-cyan-500/20 text-cyan-400'
              }
            `}
            title="放弃挑战，让它自动弹奏给你听"
          >
            <Sparkles className={`w-4 h-4 ${gameState === 'autoplay' ? 'animate-spin text-white' : 'text-amber-500'}`} />
            <span>{gameState === 'autoplay' ? '自动演奏中' : '自动示范'}</span>
          </button>
        )}

      </div>

      {/* Center Dynamic Game State Banner */}
      <div id="hud-status-advisor" className="flex flex-col sm:flex-row items-center gap-2 py-1 overflow-hidden">
        {currentSongName && (
          <div className={`px-3 py-1 rounded-xl border font-black text-[11px] uppercase tracking-wide flex items-center gap-1.5 shadow-xs
            ${isPig 
              ? 'bg-rose-100/50 border-rose-200 text-rose-650 shadow-rose-50' 
              : 'bg-slate-950 border-cyan-500/20 text-cyan-400 shadow-cyan-950/20'
            }
          `}>
            <span>🎵 {currentSongName}</span>
            {currentSongArtist && <span className="text-[9px] opacity-65">({currentSongArtist})</span>}
          </div>
        )}

        <div className={`px-4 py-1.5 rounded-xl border text-center text-xs font-bold leading-none flex items-center gap-2 max-w-sm whitespace-nowrap
          ${isPaused
            ? 'bg-amber-400/25 border-amber-400/45 text-amber-500 dark:text-amber-400 animate-pulse'
            : gameState === 'melody_playing'
            ? isPig 
              ? 'bg-rose-55 border-rose-200 text-rose-500 font-extrabold' 
              : 'bg-cyan-950/40 border-cyan-500/30 text-cyan-400 font-extrabold'
            : gameState === 'user_repeating'
            ? 'bg-emerald-50 border-emerald-250 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 font-extrabold shadow-[0_0_8px_rgba(16,185,129,0.15)]'
            : gameState === 'autoplay'
            ? 'bg-amber-50 border-amber-250 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 font-extrabold shadow-[0_0_8px_rgba(245,158,11,0.15)]'
            : isPig
            ? 'bg-rose-50/55 border-rose-100 text-rose-650'
            : 'bg-slate-800/50 border-slate-700 text-slate-300'
          }
        `}>
          {isPaused ? (
            <>
              <Pause className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
              <span>⏸️ 游戏暂停中 (点击继续)</span>
            </>
          ) : gameState === 'melody_playing' ? (
            <>
              <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-400" />
              <span>🎵 听一听！宠物正在演练旋律...</span>
            </>
          ) : gameState === 'user_repeating' ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>👉 轮到你啦！模仿奏乐复刻</span>
            </>
          ) : gameState === 'autoplay' ? (
            <>
              <Sparkles className="w-3.5 h-3.5 animate-bounce text-amber-500" />
              <span>🔮 欣赏模式中！正在为您自动弹奏...</span>
            </>
          ) : gameState === 'game_over' ? (
            <span>😢 生命用完了。再试一次吧！</span>
          ) : (
            <span>⭐ 开始游玩，挑战完美连击吧！</span>
          )}
        </div>
      </div>

      {/* Right Volume / Help utilities */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
        
        {/* Help guide toggler */}
        <button 
          id="hud-help-button"
          onClick={() => setShowHelp(true)}
          className={`p-1.5 rounded-xl transition duration-150 cursor-pointer ${isPig ? 'hover:bg-rose-100 text-rose-500' : 'hover:bg-slate-800 text-cyan-400'}`}
          title="新手指南"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* Volume Level Dial */}
        <div className="flex items-center gap-1.5">
          <button
            id="hud-volume-toggle"
            onClick={() => setVolume(volume === 0 ? 0.5 : 0)}
            className={`p-1.5 rounded-xl transition duration-150 cursor-pointer ${isPig ? 'hover:bg-rose-100 text-rose-500' : 'hover:bg-slate-800 text-cyan-400'}`}
          >
            {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          
          <input
            id="hud-volume-slider"
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className={`w-16 sm:w-20 accent-pink-500 h-1 rounded-lg bg-gray-250 dark:bg-slate-700 cursor-pointer`}
          />
        </div>

      </div>
    </div>
  );
}
