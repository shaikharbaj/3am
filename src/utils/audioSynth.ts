// Web Audio API Sound Synthesizer for 3AM Programmer Ambient Sounds

class SoundEngine {
  private ctx: AudioContext | null = null;
  private rainGainNode: GainNode | null = null;
  private rainSource: AudioBufferSourceNode | null = null;
  
  private windGainNode: GainNode | null = null;
  private windSource: AudioBufferSourceNode | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Mechanical Keyboard Switch Click (Cherry MX feel)
  playKeyClick() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const pitch = 1800 + (Math.random() - 0.5) * 400;

      osc.type = 'square';
      osc.frequency.setValueAtTime(pitch, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.02);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.025);
    } catch {
      // Audio fallback
    }
  }

  // Soft Chime / Success Sound
  playSuccessSound() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1); // E5

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch {
      // ignore
    }
  }

  playTerminalEnter() {
    this.playSuccessSound();
  }

  playErrorSound() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.setValueAtTime(180, now + 0.06);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch {
      // ignore
    }
  }

  playClick() {
    this.playKeyClick();
  }

  // Ambient Rain Noise Generator
  setRain(enabled: boolean, volume: number = 0.3) {
    try {
      this.initCtx();
      if (!this.ctx) return;

      if (!enabled) {
        if (this.rainSource) {
          this.rainSource.stop();
          this.rainSource.disconnect();
          this.rainSource = null;
        }
        return;
      }

      if (this.rainSource) {
        if (this.rainGainNode) {
          this.rainGainNode.gain.setValueAtTime(volume * 0.35, this.ctx.currentTime);
        }
        return;
      }

      const bufferSize = 2 * this.ctx.sampleRate;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.11;
        b6 = white * 0.115926;
      }

      const whiteSource = this.ctx.createBufferSource();
      whiteSource.buffer = noiseBuffer;
      whiteSource.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1000, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(volume * 0.35, this.ctx.currentTime);

      whiteSource.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteSource.start();
      this.rainSource = whiteSource;
      this.rainGainNode = gain;
    } catch {
      // ignore
    }
  }

  // Ambient Winter Snow Wind Generator
  setWinterWind(enabled: boolean, volume: number = 0.3) {
    try {
      this.initCtx();
      if (!this.ctx) return;

      if (!enabled) {
        if (this.windSource) {
          this.windSource.stop();
          this.windSource.disconnect();
          this.windSource = null;
        }
        return;
      }

      if (this.windSource) {
        if (this.windGainNode) {
          this.windGainNode.gain.setValueAtTime(volume * 0.25, this.ctx.currentTime);
        }
        return;
      }

      const bufferSize = 2 * this.ctx.sampleRate;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.1;
      }

      const whiteSource = this.ctx.createBufferSource();
      whiteSource.buffer = noiseBuffer;
      whiteSource.loop = true;

      // Soft whistling winter wind filter
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(400, this.ctx.currentTime);
      filter.Q.setValueAtTime(3.0, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(volume * 0.25, this.ctx.currentTime);

      whiteSource.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteSource.start();
      this.windSource = whiteSource;
      this.windGainNode = gain;
    } catch {
      // ignore
    }
  }
}

export const soundFx = new SoundEngine();

