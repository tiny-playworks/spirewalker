import type { MonsterIntent } from '@/game/core/model/battle';
import type { RunState } from '@/game/core/model/run';

export function selectBattle(run: RunState | null) {
  return run?.battle ?? null;
}

export function selectBattleHandCards(run: RunState | null) {
  const b = run?.battle;
  if (!b) return [];
  return b.player.hand.map((id) => b.player.cards[id]).filter(Boolean);
}

export function selectPlayerBattleStats(run: RunState | null) {
  const b = run?.battle;
  if (!b) return null;
  const p = b.units[b.playerUnitId];
  if (!p) return null;
  return {
    hp: p.hp,
    maxHp: p.maxHp,
    block: p.block,
    energy: b.player.energy,
    maxEnergy: b.player.maxEnergy,
    turn: b.turn,
    phase: b.phase,
    inputMode: b.inputMode,
  };
}

export function selectCurrentEnemyIntents(
  run: RunState | null,
): Array<{ unitId: string; name: string; hp: number; maxHp: number; intent: MonsterIntent | null }> {
  const b = run?.battle;
  if (!b) return [];
  return b.enemyUnitIds
    .map((id) => {
      const u = b.units[id];
      const m = b.monsters[id];
      if (!u) return null;
      return { unitId: id, name: u.name, hp: u.hp, maxHp: u.maxHp, intent: m?.intent ?? null };
    })
    .filter(Boolean) as Array<{ unitId: string; name: string; hp: number; maxHp: number; intent: MonsterIntent | null }>;
}
