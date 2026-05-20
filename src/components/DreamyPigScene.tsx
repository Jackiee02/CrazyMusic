import { motion, AnimatePresence } from 'motion/react';

interface SceneProps {
  lastActiveNote: string | null;
  activeNoteCount: number;
  gameState: string;
}

const STATIC_PETALS = [
  { left: '8%', size: 12, delay: '0s', duration: '8s' },
  { left: '23%', size: 16, delay: '1.5s', duration: '9s' },
  { left: '38%', size: 10, delay: '4s', duration: '7s' },
  { left: '52%', size: 14, delay: '2s', duration: '10s' },
  { left: '67%', size: 18, delay: '5.5s', duration: '12s' },
  { left: '82%', size: 12, delay: '3s', duration: '8.5s' },
  { left: '15%', size: 14, delay: '6s', duration: '11s' },
  { left: '30%', size: 10, delay: '0.8s', duration: '7.5s' },
  { left: '45%', size: 16, delay: '3.2s', duration: '9.5s' },
  { left: '60%', size: 12, delay: '7s', duration: '8s' },
  { left: '75%', size: 15, delay: '1.2s', duration: '10.5s' },
  { left: '90%', size: 13, delay: '4.8s', duration: '11.5s' },
];

export default function DreamyPigScene({ lastActiveNote, activeNoteCount, gameState }: SceneProps) {
  // Floating ambient clouds
  const clouds = [
    { x: '10%', y: '15%', scale: 1.2, duration: 25 },
    { x: '75%', y: '25%', scale: 0.9, duration: 32 },
    { x: '45%', y: '10%', scale: 0.8, duration: 40 }
  ];

  return (
    <div id="dreamy-pig-scene" className="relative w-full h-full overflow-hidden bg-gradient-to-b from-pink-100 via-rose-50 to-pink-200 flex flex-col justify-between p-4 border border-rose-300/40 rounded-2xl shadow-[inset_0_0_30px_rgba(251,113,133,0.15)]">
      
      {/* Dynamic FPS friendly styles */}
      <style>{`
        @keyframes dreamy-petal-fall {
          0% {
            transform: translateY(-40px) rotate(0deg) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(380px) rotate(360deg) translateX(25px);
            opacity: 0;
          }
        }
        .animate-petal-fall {
          animation-name: dreamy-petal-fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>

      {/* Soft moving clouds */}
      {clouds.map((c, i) => (
        <motion.div
          key={i}
          className="absolute bg-white/60 backdrop-blur-[1px] rounded-full filter blur-[1px] pointer-events-none"
          style={{
            left: c.x,
            top: c.y,
            height: '24px',
            width: '64px',
            scale: c.scale
          }}
          animate={{
            x: [0, 50, -50, 0],
            opacity: [0.6, 0.9, 0.6]
          }}
          transition={{
            duration: c.duration,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Falling customizable sakura/dreamy petals */}
      {STATIC_PETALS.map((p, idx) => (
        <div
          key={idx}
          className="absolute pointer-events-none text-rose-300/80 drop-shadow-sm select-none animate-petal-fall"
          style={{
            left: p.left,
            top: '-5%',
            animationDelay: p.delay,
            animationDuration: p.duration,
            fontSize: `${p.size}px`
          }}
        >
          🌸
        </div>
      ))}

      {/* Cozy Stars */}
      <div className="absolute top-10 right-10 text-xl animate-pulse select-none opacity-40">⭐</div>
      <div className="absolute top-24 left-8 text-lg animate-pulse select-none opacity-30 delay-1000">✨</div>
      <div className="absolute bottom-20 right-16 text-sm animate-pulse select-none opacity-40 delay-500">🌸</div>

      {/* Beautiful ambient banner */}
      <div className="relative z-10 flex justify-between items-center w-full px-2">
        <div className="flex items-center space-x-1.5">
          <span className="text-rose-400 text-xs">💖</span>
          <span className="font-sans text-xs font-semibold tracking-wider text-rose-500/80">
            Nana Pig Piano
          </span>
        </div>
        {lastActiveNote && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-2 py-0.5 rounded-full bg-white/75 border border-pink-200 font-sans text-xs text-rose-500 font-medium flex items-center gap-1 shadow-sm"
          >
            <span>✨ NOTE:</span>
            <span className="font-bold">{lastActiveNote}</span>
          </motion.div>
        )}
      </div>

      {/* Core Stage: Beautiful Pig with golden Crown and Angel Wings */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center w-full min-h-[140px]">
        
        {/* Soft magical circular glow aura */}
        <div className="absolute w-36 h-36 bg-radial from-rose-200/50 to-transparent rounded-full filter blur-xl pointer-events-none" />

        {/* Adorable Pig SVG */}
        <motion.div
          animate={{
            y: lastActiveNote ? -14 : [0, -5, 0],
            scale: lastActiveNote ? 1.08 : 1,
            rotate: lastActiveNote ? [0, 4, -4, 0] : [0, -1, 1, 0]
          }}
          transition={{
            y: lastActiveNote ? { type: "spring", stiffness: 400, damping: 10 } : { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
            scale: { type: "spring", stiffness: 300, damping: 14 },
            rotate: { duration: 5, repeat: Infinity, ease: "easeInOut" }
          }}
          className="relative w-44 h-44 cursor-pointer"
        >
          {/* Main Pig SVG */}
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
            {/* Soft Shadow */}
            <ellipse cx="100" cy="155" rx="36" ry="12" fill="#fda4af" opacity="0.4" />

            {/* Angel Wings Back - Left & Right */}
            <g id="pig-wings">
              {/* Left Wing */}
              <motion.path 
                d="M 68,110 C 45,95 38,125 50,135 C 58,142 66,132 68,110 Z" 
                fill="#ffffff" 
                stroke="#fda4af"
                strokeWidth="1.5"
                animate={{
                  rotate: lastActiveNote ? [-30, 10, -30] : [0, -5, 0]
                }}
                style={{ originX: '68px', originY: '115px' }}
                transition={{ duration: 0.3 }}
              />
              {/* Right Wing */}
              <motion.path 
                d="M 132,110 C 155,95 162,125 150,135 C 142,142 134,132 132,110 Z" 
                fill="#ffffff" 
                stroke="#fda4af"
                strokeWidth="1.5"
                animate={{
                  rotate: lastActiveNote ? [30, -10, 30] : [0, 5, 0]
                }}
                style={{ originX: '132px', originY: '115px' }}
                transition={{ duration: 0.3 }}
              />
            </g>

            {/* Pig Body (Cute Ball) */}
            <circle cx="100" cy="118" r="34" fill="#fecdd3" stroke="#f43f5e" strokeWidth="2" />

            {/* Cute Pig Feet */}
            <circle cx="82" cy="150" r="8" fill="#fda4af" stroke="#f43f5e" strokeWidth="1.5" />
            <circle cx="118" cy="150" r="8" fill="#fda4af" stroke="#f43f5e" strokeWidth="1.5" />
            {/* Hoof lines */}
            <line x1="82" y1="145" x2="82" y2="153" stroke="#e11d48" strokeWidth="2" />
            <line x1="118" y1="145" x2="118" y2="153" stroke="#e11d48" strokeWidth="2" />

            {/* Head */}
            <circle cx="100" cy="74" r="26" fill="#ffe4e6" stroke="#fb7185" strokeWidth="2" />

            {/* Fluffy Pig Ears - Left & Right */}
            <g id="pig-ears">
              {/* Left Ear */}
              <path d="M 76,64 C 62,56 66,42 74,48 C 78,51 78,58 76,64 Z" fill="#fecdd3" stroke="#fb7185" strokeWidth="1.5" />
              <path d="M 74,61 C 66,57 68,50 72,52" fill="#fda4af" />
              
              {/* Right Ear */}
              <path d="M 124,64 C 138,56 134,42 126,48 C 122,51 122,58 124,64 Z" fill="#fecdd3" stroke="#fb7185" strokeWidth="1.5" />
              <path d="M 126,61 C 134,57 132,50 128,52" fill="#fda4af" />
            </g>

            {/* Rosy Blush Cheeks (Glow effect) */}
            <ellipse cx="82" cy="80" rx="4.5" ry="3" fill="#fb7185" opacity="0.6" />
            <ellipse cx="118" cy="80" rx="4.5" ry="3" fill="#fb7185" opacity="0.6" />

            {/* Pig Eyes - Tender Curvy Happy Arc when notes hit */}
            <g id="pig-eyes">
              {lastActiveNote ? (
                <>
                  <path d="M 80,72 Q 85,67 90,72" fill="none" stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M 110,72 Q 115,67 120,72" fill="none" stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <circle cx="85" cy="73" r="2.5" fill="#4c0519" />
                  <circle cx="86" cy="71" r="0.8" fill="#ffffff" />
                  <circle cx="115" cy="73" r="2.5" fill="#4c0519" />
                  <circle cx="116" cy="71" r="0.8" fill="#ffffff" />
                </>
              )}
            </g>

            {/* Cute Pig Snout */}
            <rect x="88" y="78" width="24" height="15" rx="7.5" fill="#fda4af" stroke="#f43f5e" strokeWidth="1.5" />
            <ellipse cx="95" cy="85" rx="2.5" ry="3.5" fill="#e11d48" />
            <ellipse cx="105" cy="85" rx="2.5" ry="3.5" fill="#e11d48" />

            {/* Golden Queen Crown (Fitted slightly tilted) */}
            <motion.path 
              d="M 88,52 L 91,42 L 97,47 L 100,39 L 103,47 L 109,42 L 112,52 Z" 
              fill="#facc15" 
              stroke="#ca8a04" 
              strokeWidth="1.5"
              animate={{
                y: lastActiveNote ? -2 : 0,
                rotate: lastActiveNote ? [-4, 4, -4] : 0
              }}
              style={{ originX: '100px', originY: '52px' }}
            />
            {/* Crown Jewel dots */}
            <circle cx="91" cy="40" r="1.5" fill="#f43f5e" />
            <circle cx="100" cy="37" r="1.5" fill="#3b82f6" />
            <circle cx="109" cy="40" r="1.5" fill="#f43f5e" />
          </svg>

          {/* Floating Soft Hearts on hit */}
          <AnimatePresence>
            {lastActiveNote && (
              <motion.div
                key={activeNoteCount}
                initial={{ opacity: 1, y: 10, scale: 0.2 }}
                animate={{ opacity: 0, y: -65, scale: 1.4, rotate: [-15, 15, -15] }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <div className="text-2xl text-pink-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)] select-none">
                  💖
                </div>
                <div className="absolute text-sm text-rose-400 -top-4 -left-2 select-none animate-ping">
                  🌸
                </div>
                <div className="absolute text-sm text-amber-400 top-20 right-0 select-none">
                  ✨
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
