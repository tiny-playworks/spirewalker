import { useEffect, useMemo, useRef, useState } from 'react';
import Phaser from 'phaser';
import { createEncounterConfig } from '@/game/run';
import { useGameStore } from '@/game/store';
import type { CombatEvent, CombatHudSnapshot, WorldInteraction, WorldOverlay } from '@/game/types';
import { CombatHud } from '@/ui/CombatHud';
import { GameOverlayLayer, LootInspector, WorldHud } from '@/ui/GameOverlays';
import { CombatScene } from './CombatScene';
import { WorldScene } from './WorldScene';

export function GameHost() {
  const hostRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const worldSceneRef = useRef<WorldScene | null>(null);
  const combatSceneRef = useRef<CombatScene | null>(null);
  const activeCombatIdRef = useRef<string | null>(null);
  const runtimeReadyRef = useRef(false);
  const applyRuntimeRef = useRef<() => void>(() => undefined);
  const [hud, setHud] = useState<CombatHudSnapshot | null>(null);
  const [interaction, setInteraction] = useState<WorldInteraction | null>(null);

  const run = useGameStore((state) => state.run);
  const profile = useGameStore((state) => state.profile);
  const settings = useGameStore((state) => state.settings);
  const overlay = useGameStore((state) => state.overlay);
  const menuPanel = useGameStore((state) => state.menuPanel);
  const startRun = useGameStore((state) => state.startRun);
  const chooseRoute = useGameStore((state) => state.chooseRoute);
  const finishCombat = useGameStore((state) => state.finishCombat);
  const openChest = useGameStore((state) => state.openChest);
  const returnToWorkshop = useGameStore((state) => state.returnToWorkshop);
  const selectLoot = useGameStore((state) => state.selectLoot);
  const setActiveWeapon = useGameStore((state) => state.setActiveWeapon);
  const setOverlay = useGameStore((state) => state.setOverlay);
  const setMenuPanel = useGameStore((state) => state.setMenuPanel);

  const latestRef = useRef({
    run, profile, settings, overlay, menuPanel, startRun, chooseRoute, finishCombat, openChest, returnToWorkshop, selectLoot, setActiveWeapon, setOverlay, setMenuPanel,
  });
  latestRef.current = {
    run, profile, settings, overlay, menuPanel, startRun, chooseRoute, finishCombat, openChest, returnToWorkshop, selectLoot, setActiveWeapon, setOverlay, setMenuPanel,
  };

  const selectedDrop = useMemo(
    () => run?.chest?.drops.find((drop) => drop.id === run.selectedLootId && !drop.resolved) ?? null,
    [run],
  );

  useEffect(() => {
    const parent = hostRef.current;
    if (!parent) return;
    const requestOverlay = (requested: Exclude<WorldOverlay, 'none'>) => {
      const latest = latestRef.current;
      if (latest.menuPanel !== 'none') {
        latest.setMenuPanel('none');
        return;
      }
      latest.setOverlay(latest.overlay === requested ? 'none' : requested);
    };
    const bridge = {
      onInteraction: setInteraction,
      onRouteSelected: (routeId: string) => latestRef.current.chooseRoute(routeId),
      onStartRun: () => latestRef.current.startRun(e2eSeed()),
      onReturnToWorkshop: () => latestRef.current.returnToWorkshop(),
      onChestOpened: () => latestRef.current.openChest(),
      onLootSelected: (dropId: string) => latestRef.current.selectLoot(dropId),
      onWeaponSwapped: (weaponIndex: 0 | 1) => latestRef.current.setActiveWeapon(weaponIndex),
      onOverlayRequested: requestOverlay,
      onMetaPanelRequested: (panel: 'global-tree' | 'character-tree') => latestRef.current.setMenuPanel(panel),
    };
    const worldScene = new WorldScene().configure({
      bridge,
      run: latestRef.current.run,
      reducedMotion: latestRef.current.settings.reducedMotion,
    });
    const combatScene = new CombatScene();
    worldSceneRef.current = worldScene;
    combatSceneRef.current = combatScene;
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent,
      width: 1_280,
      height: 720,
      backgroundColor: '#f8edcf',
      scene: [worldScene, combatScene],
      antialias: true,
      pixelArt: false,
      roundPixels: false,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1_280,
        height: 720,
      },
      fps: { target: 60, min: 30, smoothStep: true },
      input: { mouse: { preventDefaultWheel: true } },
      render: { antialias: true, powerPreference: 'high-performance' },
    });
    gameRef.current = game;
    const markReady = () => {
      runtimeReadyRef.current = true;
      applyRuntimeRef.current();
    };
    if (game.isBooted) markReady();
    else game.events.once(Phaser.Core.Events.READY, markReady);
    const preventMenu = (event: MouseEvent) => event.preventDefault();
    parent.addEventListener('contextmenu', preventMenu);
    return () => {
      parent.removeEventListener('contextmenu', preventMenu);
      runtimeReadyRef.current = false;
      activeCombatIdRef.current = null;
      game.destroy(true);
      gameRef.current = null;
      worldSceneRef.current = null;
      combatSceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || event.target instanceof HTMLInputElement) return;
      const key = event.key.toLowerCase();
      const requested = key === 'c' ? 'character' : key === 'i' ? 'equipment' : key === 'tab' ? 'stats' : null;
      if (key !== 'escape' && !requested) return;
      event.preventDefault();
      const latest = latestRef.current;
      if (latest.menuPanel !== 'none') {
        if (key === 'escape') latest.setMenuPanel('none');
        return;
      }
      if (key === 'escape') latest.setOverlay(latest.overlay === 'none' ? 'pause' : 'none');
      else if (requested) latest.setOverlay(latest.overlay === requested ? 'none' : requested);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  applyRuntimeRef.current = () => {
    const game = gameRef.current;
    const worldScene = worldSceneRef.current;
    const combatScene = combatSceneRef.current;
    const latest = latestRef.current;
    if (!runtimeReadyRef.current || !game || !worldScene || !combatScene) return;
    const isCombat = latest.run?.phase === 'combat';
    if (isCombat && latest.run) {
      const config = createEncounterConfig(latest.run, latest.profile, {
        debugFast: new URLSearchParams(window.location.search).has('e2e'),
        stressTest: new URLSearchParams(window.location.search).has('stress'),
      });
      if (activeCombatIdRef.current !== config.id) {
        setHud(null);
        setInteraction(null);
        activeCombatIdRef.current = config.id;
        combatScene.configure({
          config,
          masterVolume: latest.settings.masterVolume,
          reducedMotion: latest.settings.reducedMotion,
          showDamageNumbers: latest.settings.showDamageNumbers,
          onOverlayRequested: (requested) => {
            const current = latestRef.current;
            current.setOverlay(current.overlay === requested ? 'none' : requested);
          },
          bridge: {
            onHud: setHud,
            onEvent: (_event: CombatEvent) => undefined,
            onResult: (result) => latestRef.current.finishCombat(result),
          },
        });
        if (game.scene.isActive('WorldScene')) game.scene.stop('WorldScene');
        game.scene.start('CombatScene');
        combatScene.setExternalPaused(latest.overlay !== 'none' || latest.menuPanel !== 'none');
      }
      return;
    }

    activeCombatIdRef.current = null;
    if (game.scene.isActive('CombatScene')) game.scene.stop('CombatScene');
    worldScene.configure({
      bridge: {
        onInteraction: setInteraction,
        onRouteSelected: (routeId) => latestRef.current.chooseRoute(routeId),
        onStartRun: () => latestRef.current.startRun(e2eSeed()),
        onReturnToWorkshop: () => latestRef.current.returnToWorkshop(),
        onChestOpened: () => latestRef.current.openChest(),
        onLootSelected: (dropId) => latestRef.current.selectLoot(dropId),
        onWeaponSwapped: (weaponIndex) => latestRef.current.setActiveWeapon(weaponIndex),
        onOverlayRequested: (requested) => {
          const current = latestRef.current;
          current.setOverlay(current.overlay === requested ? 'none' : requested);
        },
        onMetaPanelRequested: (panel) => latestRef.current.setMenuPanel(panel),
      },
      run: latest.run,
      reducedMotion: latest.settings.reducedMotion,
    });
    worldScene.sync(latest.run, latest.settings.reducedMotion);
    if (!game.scene.isActive('WorldScene')) game.scene.start('WorldScene');
    worldScene.setExternalPaused(latest.overlay !== 'none' || latest.menuPanel !== 'none');
  };

  useEffect(() => {
    applyRuntimeRef.current();
  }, [run, profile, settings]);

  useEffect(() => {
    const paused = overlay !== 'none' || menuPanel !== 'none';
    worldSceneRef.current?.setExternalPaused(paused);
    combatSceneRef.current?.setExternalPaused(paused);
  }, [menuPanel, overlay]);

  return (
    <section className="persistent-game" data-phase={run?.phase ?? 'workshop'}>
      <div ref={hostRef} className="game-canvas-host" data-testid="game-canvas" />
      {run?.phase === 'combat' ? <CombatHud hud={hud} boss={false} /> : <WorldHud run={run} />}
      {interaction && overlay === 'none' ? <div className="interaction-prompt" data-testid="interaction-prompt"><kbd>E</kbd><span><b>{interaction.label}</b><small>{interaction.hint}</small></span></div> : null}
      {selectedDrop ? <LootInspector drop={selectedDrop} /> : null}
      <GameOverlayLayer hud={hud} />
    </section>
  );
}

function e2eSeed(): number | undefined {
  return new URLSearchParams(window.location.search).has('e2e') ? 20_260_808 : undefined;
}
