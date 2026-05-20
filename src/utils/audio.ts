// Web Audio API custom synthesizer for the Pet Piano Game

class AudioSetup {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private volume: number = 0.5;

  init() {
    if (this.ctx) return;
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtxClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    } catch (e) {
      console.error('Failed to initialize Web Audio Context', e);
    }
  }

  resume() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  getVolume() {
    return this.volume;
  }

  playPianoTone(frequency: number, duration: number = 1.0) {
    this.resume();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;

    // We combine three oscillators for a rich, warm, hammer-striking-tines sound (electric piano vibe)
    // Osc 1: Fundamental Sine (warm base)
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(frequency, t);

    // Osc 2: Sub-oscillator Triangle (fullness)
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(frequency, t);

    // Osc 3: Harmonic Tine (overtone)
    const osc3 = this.ctx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(frequency * 2, t); // Octave overtone

    // Lowpass filter for decaying acoustic dampening
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, t);
    filter.frequency.exponentialRampToValueAtTime(300, t + duration * 0.8);

    // Volume Envelope (ADSR)
    const gain1 = this.ctx.createGain();
    const gain2 = this.ctx.createGain();
    const gain3 = this.ctx.createGain();

    // Fundamental Envelope (sine + triangle)
    gain1.gain.setValueAtTime(0, t);
    gain1.gain.linearRampToValueAtTime(0.4, t + 0.01); // fast attack
    gain1.gain.exponentialRampToValueAtTime(0.15, t + 0.3); // decay
    gain1.gain.setValueAtTime(0.15, t + duration * 0.4);
    gain1.gain.exponentialRampToValueAtTime(0.0001, t + duration); // long release

    // Sub Envelope
    gain2.gain.setValueAtTime(0, t);
    gain2.gain.linearRampToValueAtTime(0.2, t + 0.02);
    gain2.gain.exponentialRampToValueAtTime(0.05, t + 0.25);
    gain2.gain.setValueAtTime(0.05, t + duration * 0.3);
    gain2.gain.exponentialRampToValueAtTime(0.0001, t + duration * 0.9);

    // Harmonic Tine Envelope (sharp transient hammer strike)
    gain3.gain.setValueAtTime(0, t);
    gain3.gain.linearRampToValueAtTime(0.25, t + 0.005);
    gain3.gain.exponentialRampToValueAtTime(0.001, t + 0.12); // decays very fast

    // Connections
    osc1.connect(gain1);
    osc2.connect(gain2);
    osc3.connect(gain3);

    gain1.connect(filter);
    gain2.connect(filter);
    gain3.connect(filter);

    filter.connect(this.masterGain);

    // Start & Stop triggers
    osc1.start(t);
    osc2.start(t);
    osc3.start(t);

    osc1.stop(t + duration + 0.1);
    osc2.stop(t + duration + 0.1);
    osc3.stop(t + duration + 0.1);
  }

  playSuccessChime() {
    this.resume();
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (Arpeggio)
    
    notes.forEach((freq, idx) => {
      const delay = idx * 0.1;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + delay);
      
      gain.gain.setValueAtTime(0, t + delay);
      gain.gain.linearRampToValueAtTime(0.15, t + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + delay + 0.4);
      
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(t + delay);
      osc.stop(t + delay + 0.5);
    });
  }

  playErrorBuzzer() {
    this.resume();
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;
    
    // Low dissonant tone for mistake
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(140, t);
    
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(143.5, t); // detuning for harsh dissonance
    
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.3, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
    
    // Lowpass filter to muffle the harshness slightly but keep buzzer response
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, t);
    
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    
    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.4);
    osc2.stop(t + 0.4);
  }

  playLevelUp() {
    this.resume();
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;
    const notes = [440.00, 554.37, 659.25, 880.00]; // A4, C#5, E5, A5
    
    notes.forEach((freq, idx) => {
      const delay = idx * 0.08;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + delay);
      
      gain.gain.setValueAtTime(0, t + delay);
      gain.gain.linearRampToValueAtTime(0.12, t + delay + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + delay + 0.3);
      
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(t + delay);
      osc.stop(t + delay + 0.4);
    });
  }
}

export const gameAudio = new AudioSetup();
export default gameAudio;
