import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import type { CombatEvent, CombatHudSnapshot, CombatResult, EncounterConfig } from '@/game/types';
import { CombatScene } from './CombatScene';

interface CombatHostProps {
  config: EncounterConfig;
  masterVolume: number;
  reducedMotion: boolean;
  showDamageNumbers: boolean;
  onHud(snapshot: CombatHudSnapshot): void;
  onEvent(event: CombatEvent): void;
  onResult(result: CombatResult): void;
}

export function CombatHost(props: CombatHostProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const latestRef = useRef(props);
  latestRef.current = props;

  useEffect(() => {
    const parent = hostRef.current;
    if (!parent) return;
    const scene = new CombatScene().configure({
      config: props.config,
      masterVolume: props.masterVolume,
      reducedMotion: props.reducedMotion,
      showDamageNumbers: props.showDamageNumbers,
      bridge: {
        onHud: (snapshot) => latestRef.current.onHud(snapshot),
        onEvent: (event) => latestRef.current.onEvent(event),
        onResult: (result) => latestRef.current.onResult(result),
      },
    });
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent,
      width: 1_280,
      height: 720,
      backgroundColor: '#f8edcf',
      scene: [scene],
      antialias: true,
      pixelArt: false,
      roundPixels: false,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1_280,
        height: 720,
      },
      fps: {
        target: 60,
        min: 30,
        smoothStep: true,
      },
      input: {
        mouse: { preventDefaultWheel: true },
      },
      render: {
        antialias: true,
        powerPreference: 'high-performance',
      },
    });
    const preventMenu = (event: MouseEvent) => event.preventDefault();
    parent.addEventListener('contextmenu', preventMenu);
    return () => {
      parent.removeEventListener('contextmenu', preventMenu);
      game.destroy(true);
    };
  }, [props.config.id, props.config.seed, props.masterVolume, props.reducedMotion, props.showDamageNumbers]);

  return <div ref={hostRef} className="combat-canvas-host" data-testid="combat-canvas" />;
}
