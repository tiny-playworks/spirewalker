import { ALL_ITEMS, ARCANA, CORES, ITEM_BY_ID, MUZZLES, RELICS, WEAPONS } from './content';
import { createRandom, hashSeed } from './random';
import type {
  BuildTag,
  ChestTier,
  CombatModifiers,
  ItemDefinition,
  ItemKind,
  LootDrop,
  Rarity,
  RewardCategory,
  RewardItem,
  RouteOption,
  ShopOffer,
} from './types';

const NORMAL_WEIGHTS: Record<Rarity, number> = {
  common: 0.65,
  rare: 0.27,
  epic: 0.07,
  legendary: 0.01,
};

const ELITE_WEIGHTS: Record<Rarity, number> = {
  common: 0.25,
  rare: 0.45,
  epic: 0.25,
  legendary: 0.05,
};

const BOSS_WEIGHTS: Record<Rarity, number> = {
  common: 0.1,
  rare: 0.4,
  epic: 0.35,
  legendary: 0.15,
};

const SHOP_WEIGHTS: Record<Rarity, number> = {
  common: 0.52,
  rare: 0.34,
  epic: 0.12,
  legendary: 0.02,
};

const ITEM_POOLS: Record<ItemKind, ItemDefinition[]> = {
  weapon: WEAPONS,
  muzzle: MUZZLES,
  core: CORES,
  relic: RELICS,
  arcana: ARCANA,
};

export function generateRouteChoices(seed: number, roomIndex: number, eliteAvailable = true): RouteOption[] {
  const random = createRandom(hashSeed(seed, 'route', roomIndex));
  const regular: RewardCategory[] = ['weapon', 'muzzle', 'core', 'relic', 'gold', ...(roomIndex > 0 ? ['arcana' as const] : [])];
  const first = roomIndex === 1 ? 'arcana' : random.pick(regular);
  let second: RewardCategory;

  if (roomIndex > 0 && eliteAvailable && random.next() < 0.34) {
    second = 'elite';
  } else {
    const remaining = regular.filter((category) => category !== first);
    second = random.pick(remaining);
  }

  return random.shuffle([first, second]).map((category, index) => ({
    id: `route-${roomIndex}-${index}-${category}`,
    category,
    elite: category === 'elite',
  }));
}

export function generateRewardOffers(args: {
  seed: number;
  roomIndex: number;
  category: ItemKind;
  elite: boolean;
  count: number;
  currentTags: BuildTag[];
  modifiers: CombatModifiers;
  reroll?: number;
  excludedDefinitionIds?: string[];
}): RewardItem[] {
  const random = createRandom(hashSeed(args.seed, 'reward', args.roomIndex, args.category, args.reroll ?? 0));
  const excluded = new Set(args.excludedDefinitionIds ?? []);
  const pool = ITEM_POOLS[args.category].filter((item) => !excluded.has(item.id));
  const selected: ItemDefinition[] = [];

  const preferredTag = dominantTag(args.currentTags);
  const preferred = random.shuffle(pool.filter((item) => item.tag === preferredTag));
  const alternative = random.shuffle(pool.filter((item) => item.tag !== preferredTag && item.tag !== 'neutral'));
  const unrestricted = random.shuffle(pool);

  pushUnique(selected, preferred[0]);
  pushUnique(selected, alternative[0]);
  for (const item of unrestricted) {
    if (selected.length >= args.count) break;
    pushUnique(selected, item);
  }

  return selected.slice(0, args.count).map((definition, index) => ({
    uid: `${args.category}-${definition.id}-${args.roomIndex}-${args.reroll ?? 0}-${index}`,
    kind: args.category,
    definitionId: definition.id,
    rarity: rollChestRarity(random.next(), args.elite ? 'elite' : 'normal', args.modifiers),
  }));
}

export function generateChestDrops(args: {
  seed: number;
  roomIndex: number;
  category: RewardCategory;
  elite: boolean;
  currentTags: BuildTag[];
  modifiers: CombatModifiers;
  extraDrop?: boolean;
  objectiveBonus?: boolean;
  reroll?: number;
  excludedDefinitionIds?: string[];
}): LootDrop[] {
  const random = createRandom(hashSeed(args.seed, 'chest-count', args.roomIndex, args.category, args.reroll ?? 0));
  const count = 1 + Number(random.next() < (args.elite ? 0.5 : 0.35))
    + Number(args.objectiveBonus ?? false) + Number(args.extraDrop ?? false);
  const positions = dropPositions(count);

  if (args.category === 'gold') {
    const total = 52 + args.roomIndex * 12 + (args.elite ? 28 : 0);
    return positions.map((position, index) => ({
      id: `gold-${args.roomIndex}-${index}`,
      item: null,
      gold: index === positions.length - 1 ? total - Math.floor(total / count) * index : Math.floor(total / count),
      worldX: position.x,
      worldY: position.y,
      resolved: false,
      resolution: null,
    }));
  }

  const category = args.category === 'elite'
    ? rollEliteRewardCategory(args.seed, args.roomIndex)
    : args.category;
  const items = generateRewardOffers({
    seed: args.seed,
    roomIndex: args.roomIndex,
    category,
    elite: args.elite,
    count,
    currentTags: args.currentTags,
    modifiers: args.modifiers,
    reroll: args.reroll,
    excludedDefinitionIds: args.category === 'arcana' || category === 'arcana' ? args.excludedDefinitionIds : undefined,
  });
  return items.map((item, index) => ({
    id: `drop-${item.uid}`,
    item,
    gold: 0,
    worldX: positions[index]?.x ?? 640,
    worldY: positions[index]?.y ?? 405,
    resolved: false,
    resolution: null,
  }));
}

export function generateBossDrops(args: {
  seed: number;
  modifiers: CombatModifiers;
  excludedArcanaIds?: string[];
}): LootDrop[] {
  const random = createRandom(hashSeed(args.seed, 'boss-drops'));
  const kinds: ItemKind[] = ['weapon', 'muzzle', 'core', 'relic', 'arcana'];
  const positions = dropPositions(6);
  const drops = kinds.map((kind, index): LootDrop => {
    const excluded = kind === 'arcana' ? new Set(args.excludedArcanaIds ?? []) : new Set<string>();
    const pool = ITEM_POOLS[kind].filter((definition) => !excluded.has(definition.id));
    const definition = random.pick(pool);
    const item: RewardItem = {
      uid: `boss-${kind}-${index}-${definition.id}`,
      kind,
      definitionId: definition.id,
      rarity: rollChestRarity(random.next(), 'boss', args.modifiers),
    };
    return {
      id: `drop-${item.uid}`,
      item,
      gold: 0,
      worldX: positions[index]?.x ?? 640,
      worldY: positions[index]?.y ?? 405,
      resolved: false,
      resolution: null,
    };
  });
  drops.push({
    id: `boss-gold-${args.seed}`,
    item: null,
    gold: 120,
    worldX: positions[5]?.x ?? 640,
    worldY: positions[5]?.y ?? 405,
    resolved: false,
    resolution: null,
  });
  return drops;
}

export function generateShopOffers(args: {
  seed: number;
  reroll: number;
  extraSlot: boolean;
  modifiers: CombatModifiers;
}): ShopOffer[] {
  const random = createRandom(hashSeed(args.seed, 'shop', args.reroll));
  const kinds: ItemKind[] = ['weapon', 'muzzle', 'core', 'relic', random.pick(['weapon', 'muzzle', 'core', 'relic'])];
  if (args.extraSlot) kinds.push(random.pick(['weapon', 'muzzle', 'core', 'relic']));

  return kinds.map((kind, index) => {
    const definition = random.pick(ITEM_POOLS[kind]);
    const rarity = rollRarity(random.next(), SHOP_WEIGHTS, args.modifiers, false);
    const item: RewardItem = {
      uid: `shop-${args.reroll}-${index}-${definition.id}`,
      kind,
      definitionId: definition.id,
      rarity,
    };
    return {
      id: item.uid,
      item,
      price: getItemPrice(item, args.modifiers.shopDiscount),
      sold: false,
    };
  });
}

export function rollEliteRewardCategory(seed: number, roomIndex: number): ItemKind {
  return createRandom(hashSeed(seed, 'elite-category', roomIndex)).pick(['weapon', 'muzzle', 'core', 'relic', 'arcana']);
}

export function getItemDefinition(item: RewardItem): ItemDefinition {
  const definition = ITEM_BY_ID.get(item.definitionId);
  if (!definition) throw new Error(`Unknown item definition: ${item.definitionId}`);
  return definition;
}

export function getItemPrice(item: RewardItem, discount = 0): number {
  const rarityMultiplier: Record<Rarity, number> = {
    common: 1,
    rare: 1.55,
    epic: 2.25,
    legendary: 3.5,
  };
  return Math.max(1, Math.round(getItemDefinition(item).basePrice * rarityMultiplier[item.rarity] * (1 - discount)));
}

export function getDismantleValue(item: RewardItem, ratio: number): number {
  return Math.max(1, Math.round(getItemPrice(item) * ratio));
}

export function rarityClass(rarity: Rarity): string {
  return `rarity-${rarity}`;
}

export function rollChestRarity(roll: number, tier: ChestTier, modifiers: CombatModifiers): Rarity {
  const weights = tier === 'boss' ? BOSS_WEIGHTS : tier === 'elite' ? ELITE_WEIGHTS : NORMAL_WEIGHTS;
  return rollRarity(roll, weights, modifiers, tier === 'elite');
}

function rollRarity(
  roll: number,
  source: Record<Rarity, number>,
  modifiers: CombatModifiers,
  elite: boolean,
): Rarity {
  const weights = { ...source };
  const rareBonus = Math.min(0.02, modifiers.rareWeightBonus);
  const legendaryBonus = Math.min(0.01, modifiers.legendaryWeightBonus);
  const eliteEpicBonus = elite ? Math.min(0.05, modifiers.epicEliteBonus) : 0;
  weights.common = Math.max(0, weights.common - rareBonus - legendaryBonus - eliteEpicBonus);
  weights.rare += rareBonus;
  weights.epic += eliteEpicBonus;
  weights.legendary += legendaryBonus;

  let cursor = 0;
  for (const rarity of ['legendary', 'epic', 'rare', 'common'] as const) {
    cursor += weights[rarity];
    if (roll < cursor) return rarity;
  }
  return 'common';
}

function dominantTag(tags: BuildTag[]): BuildTag {
  const counts = new Map<BuildTag, number>();
  for (const tag of tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  return [...counts.entries()].sort((left, right) => right[1] - left[1])[0]?.[0] ?? 'neutral';
}

function pushUnique(target: ItemDefinition[], item: ItemDefinition | undefined): void {
  if (!item || target.some((entry) => entry.id === item.id)) return;
  target.push(item);
}

function dropPositions(count: number): Array<{ x: number; y: number }> {
  if (count === 1) return [{ x: 640, y: 485 }];
  if (count === 2) return [{ x: 485, y: 470 }, { x: 795, y: 470 }];
  if (count === 3) return [{ x: 435, y: 435 }, { x: 640, y: 505 }, { x: 845, y: 435 }];
  if (count === 4) return [{ x: 395, y: 405 }, { x: 545, y: 500 }, { x: 735, y: 500 }, { x: 885, y: 405 }];
  return Array.from({ length: count }, (_, index) => ({
    x: 350 + index * (580 / Math.max(1, count - 1)),
    y: 340 + Math.sin(Math.PI * index / Math.max(1, count - 1)) * 185,
  }));
}

export function allItemDefinitions(): ItemDefinition[] {
  return ALL_ITEMS;
}
