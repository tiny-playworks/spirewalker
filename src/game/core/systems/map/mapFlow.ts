import type { GameCommand } from '../../commands/types';
import type { GameEvent } from '../../events/types';
import type { RewardItem } from '../../model/reward';
import { isLegalMapStep, pruneMapEdgesToAlive } from '../../model/mapGraph';
import type { RunState } from '../../model/run';
import { mulberry32 } from '../../utils/rng';
import { buildInitialBattle } from '../../engine/createMvpRun';
import { resolveEncounterTemplate } from '../../definitions/encounters';
import { generateCardRewardChoices } from '../../engine/generateRewardChoices';
import { generateShop } from '../../engine/generateShop';
import { rollPostBattlePotionOffer } from '../../engine/postBattleExtras';
import { globalFloorFor } from '../../engine/generateBranchingFloor';
import { hashMapNodeId } from '../common/runGuards';

export function chooseMapNodeFlow(
  run: RunState,
  command: Extract<GameCommand, { type: 'CHOOSE_MAP_NODE' }>,
  events: GameEvent[],
): void {
  if (run.screen.type !== 'map') return;

  const { nodeId } = command;
  const { map } = run;
  const node = map.nodes[nodeId];
  if (!node) return;

  const curId = map.currentNodeId;
  if (!curId) return;
  const cur = map.nodes[curId];
  if (!cur || !isLegalMapStep(map.nodes, curId, nodeId)) return;

  node.visited = true;
  map.currentNodeId = nodeId;
  run.meta.act = node.act;
  run.meta.actFloor = node.depth;
  run.meta.floor = globalFloorFor(node.act, node.depth);
  pruneMapEdgesToAlive(map);

  if (node.type === 'battle' || node.type === 'elite' || node.type === 'boss') {
    const encounter = resolveEncounterTemplate(node.act, node.encounterTableId, nodeId, run.seed);
    run.battle = buildInitialBattle(
      run.seed,
      { currentHp: run.player.currentHp, maxHp: run.player.maxHp },
      `map_${nodeId}`,
      run.masterDeck,
      encounter.enemySlots,
      run.meta.relics,
      run.meta.characterId,
      {
        id: encounter.id,
        tableId: encounter.tableId,
        tier: encounter.tier,
        name: encounter.name,
        tags: encounter.tags,
      },
    );
    run.screen = { type: 'battle' };
    events.push({ type: 'ENTERED_BATTLE_FROM_MAP', nodeId });
    return;
  }
  if (node.type === 'event') {
    if (!node.eventScriptId) return;
    run.screen = { type: 'event', eventId: node.eventScriptId };
    return;
  }
  if (node.type === 'shop') {
    run.shop = generateShop(run.seed, run.meta.act, run.meta.actFloor, run.meta.relics);
    run.screen = { type: 'shop' };
    events.push({ type: 'ENTERED_SHOP_FROM_MAP', nodeId });
    return;
  }
  if (node.type === 'rest') {
    run.screen = { type: 'rest' };
    events.push({ type: 'ENTERED_REST_FROM_MAP', nodeId });
    return;
  }
  if (node.type === 'treasure') {
    const salt = (run.seed ^ run.meta.gold ^ 0x7e5afe ^ hashMapNodeId(nodeId)) >>> 0;
    const tier = 'treasure' as const;
    const cards = generateCardRewardChoices(run.seed, salt, tier, run.meta.characterId, run.meta.act);
    const tr = mulberry32((salt ^ 0xc4e123) >>> 0);
    const bonusChestGold = 20 + Math.floor(tr() * 11);
    const items: RewardItem[] = [
      { type: 'card_choice', cards },
      { type: 'gold', amount: bonusChestGold },
    ];
    const potionId = rollPostBattlePotionOffer(run.seed, salt, tier, run.meta.potions.length);
    if (potionId) items.push({ type: 'potion', potionId });
    run.reward = { items, claimed: false };
    run.screen = { type: 'reward' };
    events.push({ type: 'ENTERED_REWARD_FROM_TREASURE', nodeId });
  }
}
