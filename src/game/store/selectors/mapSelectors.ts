import type { RunState } from '@/game/core/model/run';

export function selectMapRunState(run: RunState | null) {
  if (!run || run.screen.type !== 'map') return null;
  const { map, meta, player, masterDeck } = run;
  const curId = map.currentNodeId;
  const cur = curId ? map.nodes[curId] : undefined;
  return {
    map,
    meta,
    player,
    masterDeckSize: masterDeck.length,
    currentNode: cur,
    nextNodeIds: cur?.nextNodeIds ?? [],
  };
}
