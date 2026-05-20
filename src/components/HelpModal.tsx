import React from 'react';
import { X, HelpCircle, Laptop, Smartphone, Sparkles, Award } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPig: boolean;
}

export default function HelpModal({ isOpen, onClose, isPig }: HelpModalProps) {
  if (!isOpen) return null;

  return (
    <div id="help-modal-ambient" className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div 
        id="help-modal-body"
        className={`w-full max-w-lg p-6 rounded-3xl border shadow-2xl relative animate-in fade-in zoom-in duration-200
          ${isPig 
            ? 'bg-rose-50 border-rose-300 text-rose-950' 
            : 'bg-slate-900 border-cyan-500/30 text-slate-100'
          }
        `}
      >
        {/* Close Button */}
        <button
          id="help-modal-close"
          onClick={onClose}
          className={`absolute top-4 right-4 p-1.5 rounded-full transition duration-150 cursor-pointer
            ${isPig ? 'hover:bg-rose-200 text-rose-500' : 'hover:bg-slate-800 text-cyan-400'}
          `}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className={`w-6 h-6 ${isPig ? 'text-rose-500' : 'text-cyan-400'}`} />
          <h2 className="text-sm font-black tracking-wider uppercase font-mono">🎹 经典街机 · 玩法通关秘籍</h2>
        </div>

        <div className="space-y-4 text-xs leading-relaxed">
          {/* Main concept explanation */}
          <div className={`p-3 rounded-xl border ${isPig ? 'bg-pink-100/50 border-rose-200' : 'bg-slate-950/40 border-cyan-500/10'}`}>
            <p className="font-bold flex items-center gap-1.5 text-rose-600 dark:text-cyan-400">
              <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
              ⚔️ 萌宠音感大对决！
            </p>
            <p className="mt-1.5 opacity-90">
              召唤你的完美音感！游戏开始后，我们的键盘萌友（<strong>帅气机械鸭 Cyber Duck</strong> 或是 <strong>粉嫩娜娜猪 Nana Pig</strong>）会率先奏响一段动感旋律。
            </p>
            <p className="mt-1 opacity-80">
              请等萌宠演奏完毕（灯亮指示），<strong>一字不差地复刻刚才的琴音与顺序</strong>！全对立刻晋级，音符链会变得越来越长、越来越燃！
            </p>
          </div>

          {/* Device Controls details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className={`p-3 rounded-xl border ${isPig ? 'bg-white border-rose-200' : 'bg-slate-950/60 border-slate-800'}`}>
              <span className="font-bold flex items-center gap-1.5 text-xs text-rose-500 dark:text-cyan-400">
                <Smartphone className="w-4 h-4" /> 📱 丝滑指尖搓招
              </span>
              <p className="mt-1 opacity-85">
                手机/平板用户可直接触控黑白琴键，支持滑键与多指连弹，超级顺滑！
              </p>
            </div>

            <div className={`p-3 rounded-xl border ${isPig ? 'bg-white border-rose-200' : 'bg-slate-950/60 border-slate-800'}`}>
              <span className="font-bold flex items-center gap-1.5 text-xs text-rose-500 dark:text-cyan-400">
                <Laptop className="w-4 h-4" /> 💻 物理键盘硬解
              </span>
              <p className="mt-1 opacity-85">
                双手搭在键盘上，使用硬核 <strong>A 到 K</strong> 键，一秒化身超级钢琴手！
              </p>
            </div>
          </div>

          {/* Key bindings dictionary mapping */}
          <div className={`p-3 rounded-xl border ${isPig ? 'bg-pink-100/30 border-rose-200' : 'bg-slate-950/40 border-slate-800'}`}>
            <p className="font-bold mb-1.5 flex items-center gap-1">🎹 键盘热键必杀映射：</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-[10px] opacity-90">
              <div>• C4 (Do) → <span className="font-bold text-rose-500 dark:text-cyan-400 bg-white dark:bg-slate-850 px-1 border rounded shadow-xs">A</span></div>
              <div>• C#4 (Do#) → <span className="font-bold text-rose-500 dark:text-cyan-400 bg-white dark:bg-slate-850 px-1 border rounded shadow-xs">W</span></div>
              <div>• D4 (Re) → <span className="font-bold text-rose-500 dark:text-cyan-400 bg-white dark:bg-slate-850 px-1 border rounded shadow-xs">S</span></div>
              <div>• D#4 (Re#) → <span className="font-bold text-rose-500 dark:text-cyan-400 bg-white dark:bg-slate-850 px-1 border rounded shadow-xs">E</span></div>
              <div>• E4 (Mi) → <span className="font-bold text-rose-500 dark:text-cyan-400 bg-white dark:bg-slate-850 px-1 border rounded shadow-xs">D</span></div>
              <div>• F4 (Fa) → <span className="font-bold text-rose-500 dark:text-cyan-400 bg-white dark:bg-slate-850 px-1 border rounded shadow-xs">F</span></div>
              <div>• F#4 (Fa#) → <span className="font-bold text-rose-500 dark:text-cyan-400 bg-white dark:bg-slate-850 px-1 border rounded shadow-xs">T</span></div>
              <div>• G4 (Sol) → <span className="font-bold text-rose-500 dark:text-cyan-400 bg-white dark:bg-slate-850 px-1 border rounded shadow-xs">G</span></div>
              <div>• G#4 (Sol#) → <span className="font-bold text-rose-500 dark:text-cyan-400 bg-white dark:bg-slate-850 px-1 border rounded shadow-xs">Y</span></div>
              <div>• A4 (La) → <span className="font-bold text-rose-500 dark:text-cyan-400 bg-white dark:bg-slate-850 px-1 border rounded shadow-xs">H</span></div>
              <div>• A#4 (La#) → <span className="font-bold text-rose-500 dark:text-cyan-400 bg-white dark:bg-slate-850 px-1 border rounded shadow-xs">U</span></div>
              <div>• B4 (Si) → <span className="font-bold text-rose-500 dark:text-cyan-400 bg-white dark:bg-slate-850 px-1 border rounded shadow-xs">J</span></div>
              <div>• C5 (Do') → <span className="font-bold text-rose-500 dark:text-cyan-400 bg-white dark:bg-slate-850 px-1 border rounded shadow-xs">K</span></div>
            </div>
          </div>

          {/* Rules / Win criteria */}
          <div className="flex items-center gap-2 text-rose-600 dark:text-amber-400 font-extrabold">
            <Award className="w-5 h-5 text-amber-500 animate-bounce" />
            <span>⚡ 只有 3 颗血心 💖，弹错音符即刻裂开！稳住手速，去打破世界高分纪录吧！</span>
          </div>
        </div>

        <button
          id="help-modal-under-close"
          onClick={onClose}
          className={`w-full mt-6 py-2.5 rounded-xl font-black transition transform active:scale-95 cursor-pointer text-xs uppercase tracking-widest
            ${isPig 
              ? 'bg-rose-450 hover:bg-rose-550 text-white shadow-md' 
              : 'bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-500 hover:to-sky-600 text-slate-905 shadow-md shadow-cyan-950/20'
            }
          `}
        >
          ⚔️ 披挂上阵，立刻挑战！
        </button>
      </div>
    </div>
  );
}
