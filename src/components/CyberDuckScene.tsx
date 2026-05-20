import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SceneProps {
  lastActiveNote: string | null;
  activeNoteCount: number;
  gameState: string;
}

export default function CyberDuckScene({ lastActiveNote, activeNoteCount, gameState }: SceneProps) {
  const [eqHeights, setEqHeights] = useState<number[]>([40, 20, 60, 30, 70, 45, 80, 50, 30, 60, 40]);
  const [glitchActive, setGlitchActive] = useState(false);

  // Animate the audio visualizer / equalizer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === 'melody_playing' || lastActiveNote) {
      interval = setInterval(() => {
        setEqHeights(prev => prev.map(() => Math.floor(Math.random() * 85) + 15));
      }, 100);
    } else {
      interval = setInterval(() => {
        // Slow idling bars
        setEqHeights(prev => prev.map(h => {
          const target = Math.floor(Math.random() * 20) + 10;
          return h * 0.8 + target * 0.2;
        }));
      }, 250);
    }
    return () => clearInterval(interval);
  }, [gameState, lastActiveNote]);

  // Visual glitch on new key press
  useEffect(() => {
    if (lastActiveNote) {
      setGlitchActive(true);
      const timer = setTimeout(() => setGlitchActive(false), 200);
      return () => clearTimeout(timer);
    }
  }, [lastActiveNote, activeNoteCount]);

  // Custom stars/nodes floating in the background
  const nodes = [
    { x: '10%', y: '20%', size: 4, delay: 0 },
    { x: '85%', y: '15%', size: 6, delay: 1 },
    { x: '15%', y: '65%', size: 5, delay: 1.5 },
    { x: '90%', y: '70%', size: 4, delay: 0.5 },
    { x: '75%', y: '35%', size: 3, delay: 2.2 },
    { x: '25%', y: '40%', size: 5, delay: 1.8 }
  ];

  return (
    <div id="cyber-duck-scene" className="relative w-full h-full overflow-hidden bg-slate-950 flex flex-col justify-between p-4 border border-cyan-500/20 rounded-2xl shadow-[inset_0_0_30px_rgba(6,182,212,0.15)]">
      
      {/* Retrowave Perspective Grid Background */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <svg width="100%" height="100%">
          <defs>
            <linearGradient id="grid-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.8" />
            </linearGradient>
            <pattern id="grid-patt" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-patt)" className="text-cyan-500/30" />
          <rect width="100%" height="100%" fill="url(#grid-grad)" />
        </svg>
      </div>

      {/* Cyberpunk Sun/Horizon */}
      <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-64 h-32 bg-gradient-to-t from-pink-500/10 via-fuchsia-500/5 to-transparent rounded-t-full filter blur-xl pointer-events-none" />
      
      {/* Floating Sparkles & Nodes */}
      {nodes.map((n, i) => (
        <motion.div
          key={i}
          className="absolute bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]"
          style={{
            left: n.x,
            top: n.y,
            width: n.size,
            height: n.size,
          }}
          animate={{
            y: [0, -12, 0],
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            delay: n.delay,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Ambient Cyber Header Indicators */}
      <div className="relative z-10 flex justify-between items-center w-full px-2">
        <div className="flex items-center space-x-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span className="font-mono text-[10px] tracking-widest text-cyan-400 font-bold uppercase">
            Handsome Duckie Piano
          </span>
        </div>
        {lastActiveNote && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-2 py-0.5 rounded-md border border-pink-500/40 bg-pink-950/40 font-mono text-xs text-pink-400 flex items-center gap-1.5 shadow-[0_0_8px_rgba(236,72,153,0.3)]"
          >
            <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-pulse" />
            NOTE: {lastActiveNote}
          </motion.div>
        )}
      </div>

      {/* Main Center Stage: Animated Cyber Duck */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center w-full min-h-[140px]">
        
        {/* Neon Light Bars behind Duck */}
        <div className="absolute flex justify-center space-x-32 w-full opacity-60">
          <div className="w-1.5 h-32 bg-cyan-500/30 rounded-full blur-[2px] shadow-[0_0_15px_#06b6d4]" />
          <div className="w-1.5 h-32 bg-pink-500/30 rounded-full blur-[2px] shadow-[0_0_15px_#ec4899]" />
        </div>

        {/* The Animated SVG Character: Cyber Duck */}
        <motion.div
          animate={{
            y: lastActiveNote ? -16 : [0, -4, 0],
            rotate: lastActiveNote ? [0, -3, 3, 0] : [0, -1.5, 1.5, 0],
            scale: lastActiveNote ? 1.05 : 1
          }}
          transition={{
            y: lastActiveNote ? { type: "spring", stiffness: 350, damping: 12 } : { duration: 2.2, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            scale: { type: "spring", stiffness: 300, damping: 15 }
          }}
          className="relative w-44 h-44 cursor-pointer"
        >
          {/* Cyber Headset Glow Arc */}
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            {/* Duck Body & Shadow */}
            <ellipse cx="100" cy="150" rx="42" ry="16" fill="#1e1b4b" opacity="0.3" />
            
            {/* Main Cyber Yellow Body */}
            <g id="duck-full-body">
              {/* Back wing (techno wing panel) */}
              <motion.path 
                d="M 60,110 Q 30,105 45,130 T 70,135 Z" 
                fill="#facc15" 
                stroke="#e11d48"
                strokeWidth="2.5"
                animate={{
                  rotate: lastActiveNote ? [-15, 10, -15] : [0, -5, 0],
                }}
                transition={{ duration: 0.2 }}
                style={{ originX: '65px', originY: '120px' }}
              />

              {/* Legs / Robofeet */}
              <path d="M 85,145 L 80,165" stroke="#f97316" strokeWidth="4.5" strokeLinecap="round" />
              <path d="M 80,165 C 75,165 72,168 70,168 M 80,165 L 88,168" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
              
              <path d="M 115,145 L 120,165" stroke="#f97316" strokeWidth="4.5" strokeLinecap="round" />
              <path d="M 120,165 C 122,165 125,168 128,168 M 120,165 L 112,168" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />

              {/* Body */}
              <circle cx="100" cy="118" r="32" fill="#eab308" stroke="#ca8a04" strokeWidth="2" />
              
              {/* Front Techno Wing Wing Panel */}
              <motion.path 
                d="M 130,112 Q 155,108 140,132 T 115,134 Z" 
                fill="#fbbf24" 
                stroke="#06b6d4"
                strokeWidth="2.5"
                animate={{
                  rotate: lastActiveNote ? [25, -5, 25] : [0, 8, 0],
                }}
                transition={{ duration: 0.2 }}
                style={{ originX: '120px', originY: '122px' }}
              />

              {/* Cyber Chest Heart Module */}
              <circle cx="100" cy="115" r="7" fill="#111827" stroke="#eca8a9" strokeWidth="1" />
              <circle cx="100" cy="115" r="4" className={lastActiveNote ? "fill-pink-500 animate-ping" : "fill-cyan-400"} />

              {/* Neck */}
              <rect x="94" y="70" width="12" height="25" rx="5" fill="#eab308" />

              {/* Head */}
              <circle cx="100" cy="65" r="24" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />

              {/* Rosy holographic microcheeks */}
              <ellipse cx="84" cy="72" rx="4" ry="2.5" fill="#f43f5e" opacity="0.6" />
              <ellipse cx="116" cy="72" rx="4" ry="2.5" fill="#f43f5e" opacity="0.6" />

              {/* Duck Beak (Techno Beak) */}
              <path d="M 80,68 C 80,58 120,58 120,68 C 120,72 110,78 100,78 C 90,78 80,72 80,68 Z" fill="#f97316" stroke="#ea580c" strokeWidth="1.5" />
              <line x1="84" y1="68" x2="116" y2="68" stroke="#ea580c" strokeWidth="1" />

              {/* Cool Cyber Visor Shades */}
              <motion.g
                animate={{
                  scale: glitchActive ? [1, 0.9, 1.1, 1] : 1
                }}
              >
                {/* Red/cyan overlay glasses */}
                <path d="M 74,58 L 126,58 C 129,58 132,62 124,66 C 114,70 86,70 76,66 C 68,62 71,58 74,58 Z" fill="#0891b2" opacity="0.9" />
                <rect x="78" y="59" width="44" height="6" fill="#ec4899" opacity="0.8" />
                <line x1="72" y1="62" x2="128" y2="62" stroke="#22d3ee" strokeWidth="2.5" />
                <line x1="78" y1="65" x2="122" y2="65" stroke="#fae8ff" strokeWidth="1.5" />
              </motion.g>

              {/* Blue Sci-fi Headphones */}
              <path d="M 72,66 C 68,66 68,52 74,48 C 84,40 116,40 126,48 C 132,52 132,66 128,66" fill="none" stroke="#22d3ee" strokeWidth="4.5" strokeLinecap="round" />
              {/* Cup left */}
              <rect x="70" y="54" width="6" height="18" rx="2" fill="#024e68" stroke="#22d3ee" strokeWidth="1.5" />
              {/* Cup right */}
              <rect x="124" y="54" width="6" height="18" rx="2" fill="#024e68" stroke="#22d3ee" strokeWidth="1.5" />
              {/* Antenna */}
              <line x1="127" y1="54" x2="134" y2="42" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" />
              <circle cx="134" cy="42" r="3" fill="#ec4899" />
            </g>
          </svg>

          {/* Action sparkles popping out on note hit */}
          <AnimatePresence>
            {lastActiveNote && (
              <motion.div
                key={activeNoteCount}
                initial={{ opacity: 1, scale: 0.1 }}
                animate={{ opacity: 0, scale: 1.5 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <div className="absolute w-20 h-20 border-2 border-cyan-400 rounded-full animate-ping opacity-60" />
                <span className="text-xl font-bold font-mono text-cyan-400 select-none animate-bounce drop-shadow-[0_0_8px_cyan]">
                  🎵
                </span>
                <span className="absolute top-0 left-0 text-md font-mono text-pink-400 transform -translate-x-4 -translate-y-4">
                  💥
                </span>
                <span className="absolute bottom-2 right-2 text-md font-mono text-cyan-400 transform translate-x-4 translate-y-4">
                  ✨
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Cyberpunk Electronic Equalizer (Synthesizer Panel at Bottom of display) */}
      <div className="relative z-10 w-full px-2 mt-auto">
        <div className="h-10 flex items-end justify-between px-1 gap-1 border-t border-cyan-950 pt-2 bg-slate-950/80 rounded-b-lg">
          {eqHeights.map((h, idx) => (
            <motion.div
              key={idx}
              className="flex-1 rounded-sm shadow-[0_0_5px_currentColor]"
              style={{
                height: `${h}%`,
                backgroundColor: idx % 2 === 0 ? '#06b6d4' : '#ec4899',
                color: idx % 2 === 0 ? 'rgba(6,182,212,0.5)' : 'rgba(236,72,153,0.5)'
              }}
              animate={{ height: `${h}%` }}
              transition={{ type: "tween", duration: 0.1 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
