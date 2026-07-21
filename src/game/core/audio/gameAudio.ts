import type { GameEvent } from '../events/types';
import type { GameCommand } from '../commands/types';

export interface AudioSettings {
  muted: boolean;
  volume: number;
}

const KEY = 'sljt_audio_v1';
const DEFAULTS: AudioSettings = { muted: false, volume: 0.28 };

export function loadAudioSettings(): AudioSettings {
  try {
    const value = JSON.parse(localStorage.getItem(KEY) ?? 'null') as Partial<AudioSettings> | null;
    return value ? { muted: Boolean(value.muted), volume: Number(value.volume ?? DEFAULTS.volume) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

export function saveAudioSettings(settings: AudioSettings): void {
  try { localStorage.setItem(KEY, JSON.stringify(settings)); } catch { /* 本地设置失败不影响游戏 */ }
}

export function setAudioMuted(muted: boolean): AudioSettings {
  const next = { ...loadAudioSettings(), muted };
  saveAudioSettings(next);
  return next;
}

export type GameSoundCue =
  | 'select'
  | 'card'
  | 'hit'
  | 'block'
  | 'momentum'
  | 'reward'
  | 'victory'
  | 'defeat'
  | 'turn'
  | 'route';

type ToneStep = {
  frequency: number;
  delay: number;
  duration: number;
  gain: number;
  wave: OscillatorType;
};

const SOUND_PATTERNS: Record<GameSoundCue, ToneStep[]> = {
  select: [{ frequency: 460, delay: 0, duration: .07, gain: .42, wave: 'sine' }],
  card: [
    { frequency: 330, delay: 0, duration: .09, gain: .45, wave: 'triangle' },
    { frequency: 520, delay: .045, duration: .1, gain: .3, wave: 'sine' },
  ],
  hit: [
    { frequency: 155, delay: 0, duration: .13, gain: .56, wave: 'sawtooth' },
    { frequency: 92, delay: .035, duration: .14, gain: .3, wave: 'square' },
  ],
  block: [
    { frequency: 230, delay: 0, duration: .09, gain: .44, wave: 'square' },
    { frequency: 360, delay: .045, duration: .1, gain: .28, wave: 'sine' },
  ],
  momentum: [
    { frequency: 390, delay: 0, duration: .08, gain: .28, wave: 'sine' },
    { frequency: 520, delay: .055, duration: .1, gain: .34, wave: 'sine' },
    { frequency: 690, delay: .11, duration: .13, gain: .4, wave: 'sine' },
  ],
  reward: [
    { frequency: 480, delay: 0, duration: .11, gain: .34, wave: 'sine' },
    { frequency: 640, delay: .065, duration: .13, gain: .38, wave: 'sine' },
    { frequency: 810, delay: .13, duration: .16, gain: .42, wave: 'sine' },
  ],
  victory: [
    { frequency: 392, delay: 0, duration: .16, gain: .32, wave: 'triangle' },
    { frequency: 523, delay: .095, duration: .18, gain: .36, wave: 'triangle' },
    { frequency: 659, delay: .19, duration: .22, gain: .42, wave: 'triangle' },
  ],
  defeat: [
    { frequency: 220, delay: 0, duration: .18, gain: .4, wave: 'sawtooth' },
    { frequency: 165, delay: .11, duration: .22, gain: .36, wave: 'sawtooth' },
    { frequency: 110, delay: .24, duration: .28, gain: .3, wave: 'sine' },
  ],
  turn: [
    { frequency: 300, delay: 0, duration: .08, gain: .3, wave: 'triangle' },
    { frequency: 220, delay: .05, duration: .1, gain: .26, wave: 'triangle' },
  ],
  route: [
    { frequency: 300, delay: 0, duration: .1, gain: .3, wave: 'sine' },
    { frequency: 440, delay: .07, duration: .13, gain: .34, wave: 'sine' },
  ],
};

function eventCues(events: readonly GameEvent[]): GameSoundCue[] {
  if (events.some((event) => event.type === 'BATTLE_WON')) return ['victory'];
  if (events.some((event) => event.type === 'BATTLE_LOST' || event.type === 'ENTERED_GAME_OVER')) return ['defeat'];
  if (events.some((event) => event.type === 'ENTERED_REWARD_FROM_BATTLE' || event.type === 'ENTERED_REWARD_FROM_TREASURE')) {
    return ['reward'];
  }

  const cues: GameSoundCue[] = [];
  if (events.some((event) => event.type === 'CARD_PLAYED')) cues.push('card');
  if (events.some((event) => event.type === 'DAMAGE_DEALT')) cues.push('hit');
  if (events.some((event) => event.type === 'BLOCK_GAINED' || event.type === 'BLOCK_ABSORBED')) cues.push('block');
  if (events.some((event) => (event.type === 'STATUS_APPLIED' && event.statusId === 'momentum') || event.type === 'MOMENTUM_CONSUMED')) cues.push('momentum');
  if (events.some((event) => event.type === 'TURN_ENDED') && cues.length === 0) cues.push('turn');
  return cues.slice(0, 3);
}

function commandFallbackCue(command: GameCommand): GameSoundCue | null {
  switch (command.type) {
    case 'PLAY_CARD':
    case 'BEGIN_DRAG_CARD':
      return 'select';
    case 'CHOOSE_MAP_NODE':
      return 'route';
    case 'END_TURN':
      return 'turn';
    case 'SELECT_REWARD_CARD':
    case 'TAKE_REWARD_GOLD':
    case 'TAKE_REWARD_UPGRADE_CARD':
    case 'BUY_SHOP_CARD':
    case 'BUY_SHOP_RELIC':
    case 'BUY_SHOP_POTION':
    case 'BUY_SHOP_REMOVE_CARD':
    case 'BUY_SHOP_UPGRADE_CARD':
    case 'RESOLVE_EVENT_OPTION':
    case 'LEAVE_REST_TO_MAP':
      return 'reward';
    default:
      return null;
  }
}

/** 使用 Web Audio 合成短促提示，不依赖第三方音频资源。 */
export function playUiSound(cue: GameSoundCue): void {
  playSoundCues([cue]);
}

export function playGameCommandSounds(command: GameCommand, events: readonly GameEvent[]): void {
  const cues = eventCues(events);
  const fallback = commandFallbackCue(command);
  playSoundCues(cues.length > 0 ? cues : fallback ? [fallback] : []);
}

function playSoundCues(cues: readonly GameSoundCue[]): void {
  if (cues.length === 0) return;
  const settings = loadAudioSettings();
  if (settings.muted || typeof window === 'undefined') return;
  const AudioContextCtor = window.AudioContext
    ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextCtor) return;
  const context = new AudioContextCtor();
  const now = context.currentTime;
  let endAt = now;
  cues.forEach((cue, cueIndex) => {
    const cueOffset = cueIndex * .055;
    SOUND_PATTERNS[cue].forEach((step) => {
      const start = now + cueOffset + step.delay;
      const end = start + step.duration;
      const gain = context.createGain();
      gain.gain.setValueAtTime(Math.max(.001, settings.volume * step.gain), start);
      gain.gain.exponentialRampToValueAtTime(.001, end);
      gain.connect(context.destination);
      const oscillator = context.createOscillator();
      oscillator.type = step.wave;
      oscillator.frequency.setValueAtTime(step.frequency, start);
      oscillator.frequency.exponentialRampToValueAtTime(Math.max(70, step.frequency * .78), end);
      oscillator.connect(gain);
      oscillator.start(start);
      oscillator.stop(end);
      endAt = Math.max(endAt, end);
    });
  });
  window.setTimeout(() => void context.close(), Math.max(0, (endAt - now) * 1000 + 80));
}
