export type SynthCue = 'arc-shot' | 'blast-shot' | 'frost-shot' | 'hit' | 'crit' | 'swap' | 'reload' | 'ability' | 'deflect' | 'victory' | 'defeat';

export class SynthAudio {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private readonly lastCue = new Map<SynthCue, number>();
  private musicTimer: number | null = null;
  private musicStep = 0;

  constructor(private readonly volume: number) {}

  async unlock(): Promise<void> {
    if (!this.context) {
      this.context = new AudioContext();
      this.master = this.context.createGain();
      this.master.gain.value = this.volume * 0.24;
      this.master.connect(this.context.destination);
    }
    if (this.context.state === 'suspended') await this.context.resume();
    this.startMusic();
  }

  play(cue: SynthCue): void {
    if (!this.context || !this.master || this.context.state !== 'running') return;
    const nowMs = performance.now();
    const minimumGap = cue.endsWith('shot') ? 45 : cue === 'hit' ? 38 : 80;
    if (nowMs - (this.lastCue.get(cue) ?? 0) < minimumGap) return;
    this.lastCue.set(cue, nowMs);

    const preset = cuePreset(cue);
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = preset.wave;
    oscillator.frequency.setValueAtTime(preset.frequency, this.context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(40, preset.endFrequency), this.context.currentTime + preset.duration);
    gain.gain.setValueAtTime(preset.gain, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.context.currentTime + preset.duration);
    oscillator.connect(gain);
    gain.connect(this.master);
    oscillator.start();
    oscillator.stop(this.context.currentTime + preset.duration);
  }

  dispose(): void {
    if (this.musicTimer !== null) window.clearInterval(this.musicTimer);
    this.musicTimer = null;
    if (this.context) void this.context.close();
    this.context = null;
    this.master = null;
  }

  private startMusic(): void {
    if (this.musicTimer !== null) return;
    this.playMusicNote();
    this.musicTimer = window.setInterval(() => this.playMusicNote(), 420);
  }

  private playMusicNote(): void {
    if (!this.context || !this.master || this.context.state !== 'running') return;
    const notes = [220, 277.18, 329.63, 440, 329.63, 277.18, 246.94, 329.63];
    const frequency = notes[this.musicStep % notes.length]!;
    this.musicStep += 1;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = this.musicStep % 4 === 0 ? 'triangle' : 'sine';
    oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);
    gain.gain.setValueAtTime(0.055, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.context.currentTime + 0.34);
    oscillator.connect(gain);
    gain.connect(this.master);
    oscillator.start();
    oscillator.stop(this.context.currentTime + 0.35);
  }
}

function cuePreset(cue: SynthCue): {
  frequency: number;
  endFrequency: number;
  duration: number;
  gain: number;
  wave: OscillatorType;
} {
  switch (cue) {
    case 'arc-shot': return { frequency: 520, endFrequency: 760, duration: 0.07, gain: 0.12, wave: 'square' };
    case 'blast-shot': return { frequency: 150, endFrequency: 58, duration: 0.18, gain: 0.22, wave: 'sawtooth' };
    case 'frost-shot': return { frequency: 880, endFrequency: 420, duration: 0.12, gain: 0.11, wave: 'sine' };
    case 'hit': return { frequency: 240, endFrequency: 130, duration: 0.06, gain: 0.08, wave: 'triangle' };
    case 'crit': return { frequency: 760, endFrequency: 1_100, duration: 0.11, gain: 0.13, wave: 'square' };
    case 'swap': return { frequency: 280, endFrequency: 560, duration: 0.09, gain: 0.1, wave: 'triangle' };
    case 'reload': return { frequency: 190, endFrequency: 260, duration: 0.08, gain: 0.08, wave: 'square' };
    case 'ability': return { frequency: 220, endFrequency: 720, duration: 0.32, gain: 0.16, wave: 'sawtooth' };
    case 'deflect': return { frequency: 980, endFrequency: 520, duration: 0.28, gain: 0.14, wave: 'sine' };
    case 'victory': return { frequency: 440, endFrequency: 880, duration: 0.55, gain: 0.15, wave: 'triangle' };
    case 'defeat': return { frequency: 220, endFrequency: 80, duration: 0.65, gain: 0.16, wave: 'sine' };
  }
}
