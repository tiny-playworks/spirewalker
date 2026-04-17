import type { GameCommand } from '../../commands/types';
import type { GameEvent } from '../../events/types';
import type { RewardItem } from '../../model/reward';
import { isLegalMapStep, pruneMapEdgesToAlive } from '../../model/mapGraph';
import type { RunState } from '../../model/run';
import { mulberry32 } from '../../utils/rng';
import { buildInitialBattle, DEFAULT_ENEMY_LINEUP, lineupBoss, lineupElite } from '../createMvpRun';
import { WANDERING_MERCHANT_EVENT_ID } from '../generateBranchingFloor';
import { generateCardRewardChoices } from '../generateRewardChoices';
import { generateShop } from '../generateShop';
import { rollPostBattlePotionOffer } from '../postBattleExtras';
import { hashMapNodeId } from './shared';

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
  pruneMapEdgesToAlive(map);

  if (node.type === 'battle' || node.type === 'elite' || node.type === 'boss') {
    const key = `map_${nodeId}`;
    let enemySlots = DEFAULT_ENEMY_LINEUP;
    if (node.type === 'boss') enemySlots = lineupBoss();
    else if (node.type === 'elite') enemySlots = lineupElite();
    run.battle = buildInitialBattle(
      run.seed,
      { currentHp: run.player.currentHp, maxHp: run.player.maxHp },
      key,
      run.masterDeck,
      enemySlots,
      run.meta.relics,
    );
    run.screen = { type: 'battle' };
    events.push({ type: 'ENTERED_BATTLE_FROM_MAP', nodeId });
    return;
  }
  if (node.type === 'event' && node.eventScriptId === WANDERING_MERCHANT_EVENT_ID) {
    run.screen = { type: 'event', eventId: WANDERING_MERCHANT_EVENT_ID };
    return;
  }
  /** 其它 event 节点（含层首营地）：仅占点，不进入子屏 */
  if (node.type === 'event') {
    return;
  }
  if (node.type === 'shop') {
    run.shop = generateShop(run.seed, run.meta.floor, run.meta.relics);
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
    const cards = generateCardRewardChoices(run.seed, salt, tier);
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
