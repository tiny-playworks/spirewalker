export type SynthCue =
  | 'arc-shot' | 'blast-shot' | 'frost-shot' | 'hit' | 'crit' | 'swap' | 'reload' | 'ability' | 'deflect'
  | 'chest-unlock' | 'loot-common' | 'loot-rare' | 'loot-epic' | 'loot-legendary'
  | 'purchase' | 'reroll' | 'heal' | 'boss-intro' | 'victory' | 'defeat';

export class SynthAudio {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private readonly lastCue = new Map<SynthCue, number>();
  private musicTimer: number | null = null;
  private musicStep = 0;

  constructor(private volume: number) {}

  setVolume(volume: number): void {
    this.volume = volume;
    if (this.context && this.master) {
      this.master.gain.setTargetAtTime(volume * 0.24, this.context.currentTime, 0.02);
    }
  }

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

    for (const preset of cuePresets(cue)) {
      const start = this.context.currentTime + preset.delay;
      const oscillator = this.context.createOscillator();
      const gain = this.context.createGain();
      oscillator.type = preset.wave;
      oscillator.frequency.setValueAtTime(preset.frequency, start);
      oscillator.frequency.exponentialRampToValueAtTime(Math.max(40, preset.endFrequency), start + preset.duration);
      gain.gain.setValueAtTime(preset.gain, start);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + preset.duration);
      oscillator.connect(gain);
      gain.connect(this.master);
      oscillator.start(start);
      oscillator.stop(start + preset.duration);
    }
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

interface TonePreset {
  frequency: number;
  endFrequency: number;
  duration: number;
  gain: number;
  wave: OscillatorType;
  delay: number;
}

function tone(frequency: number, endFrequency: number, duration: number, gain: number, wave: OscillatorType, delay = 0): TonePreset {
  return { frequency, endFrequency, duration, gain, wave, delay };
}

function cuePresets(cue: SynthCue): TonePreset[] {
  switch (cue) {
    case 'arc-shot': return [tone(520, 760, 0.07, 0.12, 'square')];
    case 'blast-shot': return [tone(150, 58, 0.18, 0.22, 'sawtooth')];
    case 'frost-shot': return [tone(880, 420, 0.12, 0.11, 'sine')];
    case 'hit': return [tone(240, 130, 0.06, 0.08, 'triangle')];
    case 'crit': return [tone(760, 1_100, 0.11, 0.13, 'square')];
    case 'swap': return [tone(280, 560, 0.09, 0.1, 'triangle')];
    case 'reload': return [tone(190, 260, 0.08, 0.08, 'square')];
    case 'ability': return [tone(220, 720, 0.32, 0.16, 'sawtooth')];
    case 'deflect': return [tone(980, 520, 0.28, 0.14, 'sine')];
    case 'chest-unlock': return [tone(125, 72, 0.16, 0.15, 'square'), tone(360, 680, 0.26, 0.1, 'triangle', 0.08)];
    case 'loot-common': return [tone(420, 520, 0.1, 0.07, 'sine')];
    case 'loot-rare': return [tone(440, 660, 0.16, 0.09, 'triangle'), tone(660, 880, 0.15, 0.06, 'sine', 0.09)];
    case 'loot-epic': return [tone(390, 780, 0.22, 0.1, 'triangle'), tone(590, 1_180, 0.26, 0.07, 'sine', 0.1)];
    case 'loot-legendary': return [tone(330, 660, 0.32, 0.12, 'triangle'), tone(495, 990, 0.36, 0.09, 'sine', 0.1), tone(660, 1_320, 0.4, 0.07, 'sine', 0.2)];
    case 'purchase': return [tone(540, 720, 0.11, 0.08, 'triangle'), tone(720, 900, 0.13, 0.06, 'sine', 0.07)];
    case 'reroll': return [tone(720, 260, 0.18, 0.08, 'triangle'), tone(280, 620, 0.16, 0.06, 'sine', 0.13)];
    case 'heal': return [tone(420, 840, 0.3, 0.09, 'sine'), tone(630, 1_050, 0.28, 0.06, 'sine', 0.08)];
    case 'boss-intro': return [tone(105, 48, 0.55, 0.2, 'sawtooth'), tone(210, 84, 0.62, 0.12, 'square', 0.08)];
    case 'victory': return [tone(440, 880, 0.55, 0.15, 'triangle'), tone(660, 1_320, 0.45, 0.08, 'sine', 0.16)];
    case 'defeat': return [tone(220, 80, 0.65, 0.16, 'sine')];
  }
}
