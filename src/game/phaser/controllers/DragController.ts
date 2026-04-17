import { CARD_DEFINITIONS } from '@/game/core/definitions/cards/starter';
import { PLAYER_UNIT_ID } from '@/game/core/engine/createMvpRun';
import type { BattleState } from '@/game/core/model/battle';
import type { GameCommand } from '@/game/core/commands/types';

export interface RectLike {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface EnemyHitRect {
  unitId: string;
  rect: RectLike;
}

function overlaps(a: RectLike, b: RectLike): boolean {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

export function decidePlayCardCommand(
  battle: BattleState | null,
  cardInstanceId: string,
  cardBounds: RectLike,
  enemyHitRects: EnemyHitRect[],
  aoePlayRect: RectLike,
): GameCommand | null {
  if (!battle || battle.phase !== 'player_action') return null;
  const inst = battle.player.cards[cardInstanceId];
  if (!inst) return null;
  const def = CARD_DEFINITIONS[inst.definitionId];
  if (!def) return null;

  let hitEnemyId: string | undefined;
  for (const { unitId, rect } of enemyHitRects) {
    if (overlaps(cardBounds, rect)) {
      hitEnemyId = unitId;
      break;
    }
  }

  if (def.target === 'single_enemy') {
    if (!hitEnemyId) return null;
    return {
      type: 'PLAY_CARD',
      cardInstanceId,
      sourceUnitId: PLAYER_UNIT_ID,
      targetUnitId: hitEnemyId,
    };
  }
  if (def.target === 'all_enemies') {
    const inAoe = overlaps(cardBounds, aoePlayRect) || Boolean(hitEnemyId);
    if (!inAoe) return null;
    return {
      type: 'PLAY_CARD',
      cardInstanceId,
      sourceUnitId: PLAYER_UNIT_ID,
    };
  }
  return {
    type: 'PLAY_CARD',
    cardInstanceId,
    sourceUnitId: PLAYER_UNIT_ID,
  };
}
