import { addStatusStacks } from '../combat/statusCombat';
import { CARD_DEFINITIONS, STRIKE } from '../definitions/cards/starter';
import { STATUS_STRENGTH } from '../definitions/statuses';
import type { BattleState } from '../model/battle';
import type { CardInstance } from '../model/card';
import type { RunState } from '../model/run';
import { RUN_SAVE_VERSION } from '../persistence/saveVersion';
import { createInstanceId, resetIdCounter } from '../utils/id';
import { mulberry32 } from '../utils/rng';
import { shuffleInPlace } from '../utils/shuffle';
import { createStarterMasterDeck } from './starterDeck';

export const PLAYER_UNIT_ID = 'u_player';
/** 兼容单敌与测试：多敌时指第一个敌人 */
export const ENEMY_UNIT_ID = 'u_enemy_0';

export interface BattleEnemySlot {
  unitId: string;
  name: string;
  maxHp: number;
  monsterId: string;
}

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

function nextEnemyDamage(moveCount: number): number {
  return moveCount % 2 === 0 ? 6 : 9;
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
): BattleState {
  const maxHp = playerHp?.maxHp ?? 50;
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
  for (let i = 0; i < 5; i++) {
    const id = pile.shift();
    if (id) hand.push(id);
  }

  const enemyUnitIds = enemySlots.map((s) => s.unitId);
  const units: BattleState['units'] = {
    [PLAYER_UNIT_ID]: {
      id: PLAYER_UNIT_ID,
      side: 'player',
      name: '铁甲战士',
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
    monsters[slot.unitId] = {
      unitId: slot.unitId,
      monsterId: slot.monsterId,
      intent: { type: 'attack', value: nextEnemyDamage(0) },
      moveHistory: [],
    };
  }

  if (relicIds.includes('vajra')) {
    addStatusStacks(units[PLAYER_UNIT_ID], STATUS_STRENGTH, 1);
  }

  const battle: BattleState = {
    id: battleKey,
    turn: 1,
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
    },
    monsters,
    pendingAction: null,
    lastResolvedEvents: [],
  };

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
    meta: { floor: 1, gold: 0, relics: [], potions: [] },
  };
}
