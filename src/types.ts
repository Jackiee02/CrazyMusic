export type SceneTheme = 'cyber_duck' | 'dreamy_pig';

export type GameState = 'idle' | 'melody_playing' | 'user_repeating' | 'game_over' | 'victory' | 'autoplay';

export interface PianoKeyType {
  note: string;         // e.g., 'C4', 'C#4', 'D4'
  frequency: number;    // e.g., 261.63
  isBlack: boolean;     // true if accidental, false if natural
  keyboardKey: string;  // Keyboard binding for desktop
  label: string;        // e.g., 'Do', 'Re', 'Mi'
  index: number;        // layout order
}

export interface ScoreState {
  currentScore: number;
  highScore: number;
  lives: number;
  streak: number;
  maxStreak: number;
}

export const PIANO_KEYS: PianoKeyType[] = [
  // Octave 3 (G3 to B3)
  { note: 'G3', frequency: 196.00, isBlack: false, keyboardKey: 'A', label: 'Sol.', index: 0 },
  { note: 'G#3', frequency: 207.65, isBlack: true, keyboardKey: 'W', label: 'Sol.#', index: 1 },
  { note: 'A3', frequency: 220.00, isBlack: false, keyboardKey: 'S', label: 'La.', index: 2 },
  { note: 'A#3', frequency: 233.08, isBlack: true, keyboardKey: 'E', label: 'La.#', index: 3 },
  { note: 'B3', frequency: 246.94, isBlack: false, keyboardKey: 'D', label: 'Si.', index: 4 },

  // Octave 4 (C4 to B4)
  { note: 'C4', frequency: 261.63, isBlack: false, keyboardKey: 'F', label: 'Do', index: 5 },
  { note: 'C#4', frequency: 277.18, isBlack: true, keyboardKey: 'R', label: 'Do#', index: 6 },
  { note: 'D4', frequency: 293.66, isBlack: false, keyboardKey: 'G', label: 'Re', index: 7 },
  { note: 'D#4', frequency: 311.13, isBlack: true, keyboardKey: 'T', label: 'Re#', index: 8 },
  { note: 'E4', frequency: 329.63, isBlack: false, keyboardKey: 'H', label: 'Mi', index: 9 },
  { note: 'F4', frequency: 349.23, isBlack: false, keyboardKey: 'J', label: 'Fa', index: 10 },
  { note: 'F#4', frequency: 369.99, isBlack: true, keyboardKey: 'Y', label: 'Fa#', index: 11 },
  { note: 'G4', frequency: 392.00, isBlack: false, keyboardKey: 'K', label: 'Sol', index: 12 },
  { note: 'G#4', frequency: 415.30, isBlack: true, keyboardKey: 'U', label: 'Sol#', index: 13 },
  { note: 'A4', frequency: 440.00, isBlack: false, keyboardKey: 'L', label: 'La', index: 14 },
  { note: 'A#4', frequency: 466.16, isBlack: true, keyboardKey: 'I', label: 'La#', index: 15 },
  { note: 'B4', frequency: 493.88, isBlack: false, keyboardKey: 'Z', label: 'Si', index: 16 },

  // Octave 5 (C5 to G5)
  { note: 'C5', frequency: 523.25, isBlack: false, keyboardKey: 'X', label: 'Do\'', index: 17 },
  { note: 'C#5', frequency: 554.37, isBlack: true, keyboardKey: 'O', label: 'Do#\'', index: 18 },
  { note: 'D5', frequency: 587.33, isBlack: false, keyboardKey: 'C', label: 'Re\'', index: 19 },
  { note: 'D#5', frequency: 622.25, isBlack: true, keyboardKey: 'P', label: 'Re#\'', index: 20 },
  { note: 'E5', frequency: 659.25, isBlack: false, keyboardKey: 'V', label: 'Mi\'', index: 21 },
  { note: 'F5', frequency: 698.46, isBlack: false, keyboardKey: 'B', label: 'Fa\'', index: 22 },
  { note: 'F#5', frequency: 739.99, isBlack: true, keyboardKey: 'M', label: 'Fa#\'', index: 23 },
  { note: 'G5', frequency: 783.99, isBlack: false, keyboardKey: 'N', label: 'Sol\'', index: 24 },
];
