import { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { loadAudioSettings, playUiSound, setAudioMuted } from '@/game/core/audio/gameAudio';
import * as styles from './battlePage.css';

export function AudioToggle() {
  const [muted, setMuted] = useState(() => loadAudioSettings().muted);
  return (
    <button
      type="button"
      className={styles.logToggle}
      aria-pressed={!muted}
      aria-label={muted ? '开启音效' : '关闭音效'}
      title={muted ? '音效已关闭' : '音效已开启'}
      onClick={() => {
        const next = setAudioMuted(!muted).muted;
        setMuted(next);
        if (!next) playUiSound('select');
      }}
    >
      {muted ? <VolumeX size={17} aria-hidden /> : <Volume2 size={17} aria-hidden />}
    </button>
  );
}
