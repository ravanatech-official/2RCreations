/**
 * Realistic Heirloom Wedding Album Paper Page-Turn Sound Synthesizer
 * 
 * Generates an organic, ultra-soft, fine-art 300GSM cotton rag paper swoosh
 * using the Web Audio API. 
 * - Zero network bandwidth / 0 KB downloaded
 * - Instantaneous, zero latency
 * - Soft bandpass filtered noise with organic envelope mimicking tactile physical album paper
 */

class AlbumSoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Check saved user preference from localStorage
    try {
      const saved = localStorage.getItem('2r_album_sound_muted');
      if (saved !== null) {
        this.isMuted = saved === 'true';
      }
    } catch {
      this.isMuted = false;
    }
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    try {
      localStorage.setItem('2r_album_sound_muted', String(muted));
    } catch {}
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  /**
   * Plays a subtle, tactile, heirloom cotton paper page-turn swoosh.
   * @param direction 'next' (slightly higher pitch forward) or 'prev' (slightly deeper reverse rustle)
   */
  public playPageTurn(direction: 'next' | 'prev' = 'next') {
    if (this.isMuted) return;

    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const duration = 0.28; // 280ms delicate organic turn
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);

      // Generate soft pink/brown textured noise (sounds like tactile fiber paper, not harsh white noise)
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        output[i] = (b0 + b1 + b2) * 0.12;
      }

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = buffer;

      // Filter: Warm acoustic bandpass mimicking heavy heirloom cotton paper friction
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      const baseFreq = direction === 'next' ? 620 : 540;
      filter.frequency.setValueAtTime(baseFreq, now);
      filter.frequency.exponentialRampToValueAtTime(direction === 'next' ? 950 : 420, now + duration * 0.7);
      filter.Q.setValueAtTime(1.8, now);

      // Subtle high-shelf dampener to remove any digital sharpness
      const dampener = this.ctx.createBiquadFilter();
      dampener.type = 'highshelf';
      dampener.frequency.setValueAtTime(3200, now);
      dampener.gain.setValueAtTime(-14, now); // Gentle warm roll-off

      // Gain Envelope: smooth organic swell and whisper release
      const gainNode = this.ctx.createGain();
      gainNode.gain.setValueAtTime(0.0001, now);
      gainNode.gain.exponentialRampToValueAtTime(0.12, now + 0.04); // peak volume kept low & subtle (12%)
      gainNode.gain.exponentialRampToValueAtTime(0.07, now + 0.14);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      // Connect pipeline
      noiseSource.connect(filter);
      filter.connect(dampener);
      dampener.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      noiseSource.start(now);
      noiseSource.stop(now + duration);
    } catch (e) {
      // Audio playback failed or blocked by browser policy — gracefully ignore
      console.debug('Album page turn audio muted/blocked', e);
    }
  }
}

export const albumSound = new AlbumSoundEngine();
