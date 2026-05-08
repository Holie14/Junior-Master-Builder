
/**
 * SoundService - Procedural Audio using Web Audio API
 * Generates metallic and industrial sounds without external files.
 */

class SoundService {
  private audioCtx: AudioContext | null = null;
  private isEnabled: boolean = false;

  private init() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public async resume() {
    if (!this.audioCtx) this.init();
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume();
    }
  }

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    if (enabled) this.resume();
  }

  /* Positive "Uplifting" Chime for correct answers */
  public playClang() {
    if (!this.isEnabled || !this.audioCtx) return;
    this.init();

    const osc = this.audioCtx.createOscillator();
    const osc2 = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    
    // Bright bell-like timbre
    osc.type = 'sine';
    osc2.type = 'triangle';
    
    // Perfect fifth for harmony
    osc.frequency.setValueAtTime(880, this.audioCtx.currentTime); // A5
    osc2.frequency.setValueAtTime(1318.51, this.audioCtx.currentTime); // E6

    gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.6);

    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc2.start();
    osc.stop(this.audioCtx.currentTime + 0.6);
    osc2.stop(this.audioCtx.currentTime + 0.6);
  }

  /* Musical Adventure Loop */
  private musicInterval: any = null;
  private musicStep: number = 0;

  public startAmbient() {
    if (!this.isEnabled || !this.audioCtx || this.musicInterval) return;
    this.init();

    // Victory/Motivational Sequence (C Major Pentatonic - very bright and positive)
    // C4, E4, G4, A4, C5, G4, E4, D4
    const melody = [261.63, 329.63, 392.00, 440.00, 523.25, 392.00, 329.63, 293.66];
    const bass = [130.81, 196.00, 174.61, 196.00];

    this.musicStep = 0;
    this.musicInterval = setInterval(() => {
      if (!this.isEnabled || !this.audioCtx) return;

      // 1. Driving Bass (Steady and motivating)
      this.playSynthNote(bass[this.musicStep % bass.length], 0.05, 0.4, 'triangle', 0.06);

      // 2. Uplifting Melody
      // Play melody note every 2nd step for more clarity, or every step for energy
      if (this.musicStep % 2 === 0) {
        this.playSynthNote(melody[(this.musicStep / 2) % melody.length], 0.02, 0.4, 'sine', 0.04);
      }

      // 3. Bright Percussive "Snap"
      if (this.musicStep % 4 === 0) {
        this.playNoiseHit(0.015, 0.05);
      }

      this.musicStep++;
    }, 200); // 150 BPM - Energetic pace
  }

  private playSynthNote(freq: number, attack: number, decay: number, type: OscillatorType, volume: number) {
    if (!this.audioCtx) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
    
    gain.gain.setValueAtTime(0, this.audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(volume, this.audioCtx.currentTime + attack);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + attack + decay);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start();
    osc.stop(this.audioCtx.currentTime + attack + decay);
  }

  private playNoiseHit(volume: number, decay: number) {
    if (!this.audioCtx) return;
    const bufferSize = this.audioCtx.sampleRate * decay;
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const source = this.audioCtx.createBufferSource();
    source.buffer = buffer;
    const gain = this.audioCtx.createGain();
    gain.gain.setValueAtTime(volume, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + decay);

    source.connect(gain);
    gain.connect(this.audioCtx.destination);
    source.start();
  }

  public stopAmbient() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  /* Success Fanfare */
  public playSuccess() {
    if (!this.isEnabled || !this.audioCtx) return;
    this.init();

    const notes = [440, 554, 659, 880]; // A Major arpeggio
    notes.forEach((freq, i) => {
      const osc = this.audioCtx!.createOscillator();
      const gain = this.audioCtx!.createGain();
      
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, this.audioCtx!.currentTime + i * 0.1);
      
      gain.gain.setValueAtTime(0, this.audioCtx!.currentTime + i * 0.1);
      gain.gain.linearRampToValueAtTime(0.1, this.audioCtx!.currentTime + i * 0.1 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx!.currentTime + i * 0.1 + 0.4);

      osc.connect(gain);
      gain.connect(this.audioCtx!.destination);
      
      osc.start(this.audioCtx!.currentTime + i * 0.1);
      osc.stop(this.audioCtx!.currentTime + i * 0.1 + 0.4);
    });
  }

  /* Graduation Fanfare / Victory March */
  public playGraduationFanfare() {
    if (!this.isEnabled || !this.audioCtx) return;
    this.init();

    // Triumphant melody sequence (C Major)
    // Notes: C4, G4, C5, G4, C5, E5, D5, C5
    const notes = [261.63, 392.00, 523.25, 392.00, 523.25, 659.25, 587.33, 523.25];
    const durations = [0.4, 0.2, 0.4, 0.2, 0.4, 0.4, 0.6, 0.8];
    
    let timeOffset = 0;
    notes.forEach((freq, i) => {
      const startTime = this.audioCtx!.currentTime + timeOffset;
      const duration = durations[i];
      
      const osc = this.audioCtx!.createOscillator();
      const gain = this.audioCtx!.createGain();
      
      // Brass-like quality using square + triangle
      osc.type = i % 2 === 0 ? 'square' : 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);
      
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.08, startTime + 0.05);
      gain.gain.linearRampToValueAtTime(0.06, startTime + duration - 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx!.destination);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
      
      timeOffset += duration;
    });
  }
}

export const soundService = new SoundService();
