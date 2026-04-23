import { addStatusStacks } from '../combat/statusCombat';
import { CARD_DEFINITIONS, STRIKE } from '../definitions/cards/starter';
import { DEFAULT_CHARACTER_ID, getCharacterDefinition } from '../definitions/characters';
import { STATUS_METALLICIZE, STATUS_MOMENTUM, STATUS_STEADY_GUARD, STATUS_STRENGTH } from '../definitions/statuses';
import type { BattleEncounterMeta, BattleState } from '../model/battle';
import type { CardInstance } from '../model/card';
import { assertMonsterSlotsResolved, type BattleEnemySlot } from '../model/monster';
import { createEmptyEncounterHistory, type RunState } from '../model/run';
import { RUN_SAVE_VERSION } from '../persistence/saveVersion';
import { buildInitialMonsterRuntime, getMonsterDefinition } from '../definitions/monsters';
import { setInitialEnemyIntent } from '../systems/enemy/enemyAi';
import { createInstanceId, resetIdCounter } from '../utils/id';
import { mulberry32 } from '../utils/rng';
import { shuffleInPlace } from '../utils/shuffle';
import { createStarterMasterDeck } from './starterDeck';

export const PLAYER_UNIT_ID = 'u_player';
/** 兼容单敌与测试：多敌时指第一个敌人 */
export const ENEMY_UNIT_ID = 'u_enemy_0';

export type { BattleEnemySlot } from '../model/monster';

export const DEFAULT_ENEMY_LINEUP: BattleEnemySlot[] = [
  { unitId: 'u_enemy_0', name: '黏液怪', maxHp: 40, monsterId: 'slime' },
];

export function lineupDoubleSlime(): BattleEnemySlot[] {
  return [
    { unitId: 'u_enemy_0', name: '黏液怪 A', maxHp: 25, monsterId: 'slime' },
    { unitId: 'u_enemy_1', name: '黏液怪 B', maxHp: 25, monsterId: 'slime' },
  ];
}

export function lineupBoss(): BattleEnemySlot[] {
  return [{ unitId: 'u_enemy_0', name: '黏液领主', maxHp: 60, monsterId: 'slime_boss' }];
}

/** 精英战：单体高血量（地图 elite 节点） */
export function lineupElite(): BattleEnemySlot[] {
  return [{ unitId: 'u_enemy_0', name: '黏液精英', maxHp: 48, monsterId: 'slime_elite' }];
}

/** 干扰型样板敌人：交替攻击与削减 momentum。 */
export function lineupSapper(): BattleEnemySlot[] {
  return [{ unitId: 'u_enemy_0', name: '渗蚀黏液', maxHp: 34, monsterId: 'slime_sapper' }];
}

/** 多打惩罚样板敌人：交替攻击与多次出牌惩罚。 */
export function lineupGuard(): BattleEnemySlot[] {
  return [{ unitId: 'u_enemy_0', name: '戒备黏液', maxHp: 38, monsterId: 'slime_guard' }];
}

/** 拖延型样板敌人：交替攻击与加格挡。 */
export function lineupShell(): BattleEnemySlot[] {
  return [{ unitId: 'u_enemy_0', name: '壳甲黏液', maxHp: 42, monsterId: 'slime_shell' }];
}

function buildCardInstance(definitionId: string): CardInstance {
  const def = CARD_DEFINITIONS[definitionId] ?? CARD_DEFINITIONS[STRIKE.id];
  const resolvedId = CARD_DEFINITIONS[definitionId] ? definitionId : STRIKE.id;
  return {
    instanceId: createInstanceId('card'),
    definitionId: resolvedId,
    baseCost: def.cost,
    costForTurn: def.cost,
    upgraded: false,
  };
}

function hashBattleKey(key: string): number {
  let h = 0;
  for (let i = 0; i < key.length; i++) {
    h = Math.imul(31, h) + key.charCodeAt(i);
  }
  return h | 0;
}

/**
 * @param battleKey 战斗实例 id，参与洗牌种子，避免每张图战斗完全相同。
 * @param enemySlots 敌人编队；精英见 lineupElite，Boss 见 lineupBoss。
 */
export function buildInitialBattle(
  seed: number,
  playerHp?: { currentHp: number; maxHp: number },
  battleKey = 'mvp_battle',
  deckDefinitionIds: string[] = createStarterMasterDeck(),
  enemySlots: BattleEnemySlot[] = DEFAULT_ENEMY_LINEUP,
  relicIds: string[] = [],
  characterId?: string,
  encounter: BattleEncounterMeta = {
    id: battleKey,
    poolId: 'debug',
    tier: 'normal' as const,
    name: '调试战斗',
    tags: ['普通战'],
  },
): BattleState {
  assertMonsterSlotsResolved(enemySlots);
  const character = characterId ? getCharacterDefinition(characterId) : null;
  const maxHp = playerHp?.maxHp ?? character?.baseMaxHp ?? 50;
  const currentHp = playerHp?.currentHp ?? maxHp;
  const rng = mulberry32((seed ^ hashBattleKey(battleKey) ^ 0x9e3779b9) >>> 0);
  const random = () => rng();

  const cards: Record<string, CardInstance> = {};
  const pile: string[] = [];
  for (const defId of deckDefinitionIds) {
    const c = buildCardInstance(defId);
    cards[c.instanceId] = c;
    pile.push(c.instanceId);
  }
  shuffleInPlace(pile, random);

  const hand: string[] = [];
  const openingHandSize = relicIds.includes('tactical_gloves') ? 6 : 5;
  for (let i = 0; i < openingHandSize; i++) {
    const id = pile.shift();
    if (id) hand.push(id);
  }

  const enemyUnitIds = enemySlots.map((s) => s.unitId);
  const units: BattleState['units'] = {
    [PLAYER_UNIT_ID]: {
      id: PLAYER_UNIT_ID,
      side: 'player',
      name: character?.name ?? '铁甲战士',
      hp: currentHp,
      maxHp,
      block: 0,
      alive: true,
      stats: { strength: 0, dexterity: 0 },
      statuses: [],
    },
  };
  const monsters: BattleState['monsters'] = {};

  for (const slot of enemySlots) {
    units[slot.unitId] = {
      id: slot.unitId,
      side: 'enemy',
      name: slot.name,
      hp: slot.maxHp,
      maxHp: slot.maxHp,
      block: 0,
      alive: true,
      stats: { strength: 0, dexterity: 0 },
      statuses: [],
    };
    const monsterState: BattleState['monsters'][string] = {
      unitId: slot.unitId,
      monsterId: slot.monsterId,
      intent: null,
      moveHistory: [],
      runtime: buildInitialMonsterRuntime(getMonsterDefinition(slot.monsterId)!),
      scriptState: {},
    };
    monsters[slot.unitId] = monsterState;
  }

  if (relicIds.includes('vajra')) {
    addStatusStacks(units[PLAYER_UNIT_ID], STATUS_STRENGTH, 1);
  }
  if (relicIds.includes('wind_chime')) {
    addStatusStacks(units[PLAYER_UNIT_ID], STATUS_MOMENTUM, 2);
  }
  if (relicIds.includes('still_core')) {
    addStatusStacks(units[PLAYER_UNIT_ID], STATUS_METALLICIZE, 1);
    addStatusStacks(units[PLAYER_UNIT_ID], STATUS_STEADY_GUARD, 1);
  }
  if (relicIds.includes('guard_knot')) {
    addStatusStacks(units[PLAYER_UNIT_ID], STATUS_STEADY_GUARD, 1);
  }
  if (relicIds.includes('soft_guard')) {
    units[PLAYER_UNIT_ID].block += 4;
  }
  if (character?.passive.type === 'battle_start_status') {
    addStatusStacks(units[PLAYER_UNIT_ID], character.passive.statusId, character.passive.stacks);
  }

  const battle: BattleState = {
    id: battleKey,
    encounter,
    turn: 1,
    playerCardsPlayedThisTurn: 0,
    playerConsumedMomentumThisTurn: false,
    phase: 'player_action',
    inputMode: 'idle',
    playerUnitId: PLAYER_UNIT_ID,
    enemyUnitIds,
    units,
    player: {
      unitId: PLAYER_UNIT_ID,
      energy: 3,
      maxEnergy: 3,
      drawPile: pile,
      hand,
      discardPile: [],
      exhaustPile: [],
      cards,
      lockedCardInstanceIds: [],
      pendingHandLocks: 0,
      drawPressure: 0,
    },
    monsters,
    nextEnemyUnitSeq: enemySlots.length,
    pendingAction: null,
    lastResolvedEvents: [],
  };

  for (const enemyUnitId of enemyUnitIds) {
    setInitialEnemyIntent(battle, enemyUnitId);
  }

  return battle;
}

/** 文档「第一阶段：只做单场战斗」的初始 Run（直进战斗，无地图）。 */
export function createMvpRun(seed: number): RunState {
  resetIdCounter();
  const masterDeck = createStarterMasterDeck();
  const battle = buildInitialBattle(seed, undefined, 'mvp_battle', masterDeck, DEFAULT_ENEMY_LINEUP, []);
  return {
    seed,
    saveVersion: RUN_SAVE_VERSION,
    player: { maxHp: 50, currentHp: 50 },
    masterDeck,
    map: { nodes: {}, currentNodeId: null },
    screen: { type: 'battle' },
    battle,
    meta: {
      act: 1,
      actFloor: 1,
      floor: 1,
      gold: 0,
      characterId: DEFAULT_CHARACTER_ID,
      relics: [],
      potions: [],
      encounterHistory: createEmptyEncounterHistory(),
    },
  };
}
