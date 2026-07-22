import { DEFAULT_CHARACTER_ID, getCharacterDefinition } from './characters';
import { mulberry32 } from '../utils/rng';
import { GENERATED_RELICS } from './generated_relics';

export interface RelicDefinition {
  id: string;
  name: string;
  description: string;
}

export const RELIC_DEFINITIONS: Record<string, RelicDefinition> = {
  vajra: {
    id: 'vajra',
    name: '瓦哈纳',
    description: '每场战斗开始时获得 1 层力量。',
  },
  anchor: {
    id: 'anchor',
    name: '船锚',
    description: '拾取时最大生命与当前生命 +5。',
  },
  wind_chime: {
    id: 'wind_chime',
    name: '风铃',
    description: '每场战斗开始时获得 2 层连势。',
  },
  tactical_gloves: {
    id: 'tactical_gloves',
    name: '战术手套',
    description: '每场战斗开始时额外抽 1 张牌。',
  },
  burst_emblem: {
    id: 'burst_emblem',
    name: '裂响纹章',
    description: '主动消耗连势的伤害牌额外造成 2 点伤害；若是本回合第一次主动消耗，再抽 1 张牌。',
  },
  insight_lens: {
    id: 'insight_lens',
    name: '观势镜',
    description: '主动消耗连势的过牌牌额外抽 1 张牌。',
  },
  guard_knot: {
    id: 'guard_knot',
    name: '稳势结',
    description: '敌人效果会减少你的连势时，少失去 1 层。战斗开始时获得 1 层稳势。',
  },
  still_core: {
    id: 'still_core',
    name: '定心核',
    description: '每场战斗开始时获得 1 层金属化与 1 层稳势。',
  },
  soft_guard: {
    id: 'soft_guard',
    name: '缓护符',
    description: '每场战斗开始时获得 4 点格挡。',
  },
  quick_fuse: {
    id: 'quick_fuse',
    name: '疾燃引线',
    description: '每回合第一次主动消耗连势时，获得 1 点能量。',
  },
  sighted_edge: {
    id: 'sighted_edge',
    name: '识隙刃',
    description: '主动消耗连势的伤害牌每消耗 1 层连势，额外造成 1 点伤害。',
  },
  blaze_core: {
    id: 'blaze_core',
    name: '炽焰核心',
    description: '每当你消耗一张牌，本回合你的攻击伤害 +2（可叠加）；玩家回合结束时清零。',
  },
  fractured_blade: {
    id: 'fractured_blade',
    name: '断裂之刃',
    description:
      '你每回合第一次打出的攻击牌会被消耗，且该牌每段攻击伤害翻倍。',
  },
  iron_heart: {
    id: 'iron_heart',
    name: '铁壁之心',
    description: '每当你获得格挡时，额外再获得 2 点格挡。',
  },
  counter_sigil: {
    id: 'counter_sigil',
    name: '反击印记',
    description:
      '受到敌人攻击时，若你用格挡吸收了伤害，对攻击者造成等同于该次受击总量 30% 的伤害（格挡吸收 + 实际扣血之和）。',
  },
  twin_core: {
    id: 'twin_core',
    name: '双生核心',
    description:
      '每回合第一次获得格挡后，你的下一次攻击伤害 +5；每回合第一次打出攻击后，你的下一张技能或能力牌的第一段格挡或伤害 +5。',
  },
  harmony_emblem: {
    id: 'harmony_emblem',
    name: '调和徽记',
    description: '若你在同一回合内打出过攻击牌以及技能/能力牌：抽 1 张牌并获得 1 点能量（每回合至多一次）。',
  },
  ward_banner: {
    id: 'ward_banner',
    name: '沉壁旌',
    description: '每场战斗开始时额外获得 6 点格挡。',
  },
  flare_banner: {
    id: 'flare_banner',
    name: '烈势徽',
    description: '每回合第一次主动消耗连势时，获得 1 点能量。',
  },
};

Object.assign(RELIC_DEFINITIONS, GENERATED_RELICS);

export const MOMENTUM_BURST_RELIC_IDS = ['burst_emblem', 'quick_fuse', 'flare_banner'] as const;
export const MOMENTUM_FLOW_RELIC_IDS = ['guard_knot', 'still_core'] as const;
export const MOMENTUM_STABILITY_RELIC_IDS = ['guard_knot', 'still_core'] as const;
export const COMMON_RELIC_POOL = [
  'vajra',
  'anchor',
  'wind_chime',
  'tactical_gloves',
  'burst_emblem',
  'insight_lens',
  'guard_knot',
  'still_core',
  'soft_guard',
  'quick_fuse',
  'sighted_edge',
  'blaze_core',
  'fractured_blade',
  'iron_heart',
  'counter_sigil',
  'twin_core',
  'harmony_emblem',
  'ward_banner',
  'flare_banner',
  'momentum_siphon',
  'flow_anchor',
  'surge_drain',
  'unbroken_flow',
  'tide_walker',
  'stone_bulwark',
  'echo_plating',
  'bulwark_sigil',
  'fortify_root',
  'shell_shard',
  'ward_of_rust',
  'volatile_core',
  'rupture_fang',
  'momentum_burst_core',
  'ignition_surge',
  'frenzy_essence',
  'ruins_lantern',
  'ancient_tablet',
  'healing_stone',
  'soul_vessel',
  'echo_charm',
  'vitality_draught',
  'memory_shard',
  'void_charm',
  'balanced_stance',
  'guard_momentum_link',
  'burst_defense_sync',
  'flow_regulator',
  'surge_bloom',
  'flow_resonance',
  'momentum_anchor',
  'momentum_well',
  'surge_siphon',
  'fortification_rune',
  'iron_veil',
  'living_wall',
  'resonance_plating',
  'stalwart_core',
  'thorn_ward',
  'iron_shroud',
  'bulwark_heart',
  'blood_fang',
  'momentum_fury',
  'war_cry',
  'explorer_charm',
  'mystic_lens',
  'vitality_stone',
  'soul_echo',
  'quickdraw_glove',
  'meditation_stone',
  'rhythm_lock',
  'cycle_engine',
  'void_crown',
  'entropy_seal',
  'momentum_seed',
  'cascade_gem',
  'momentum_siphon_b3',
  'tide_reshaper',
  'echo_crest',
  'bulwark_plating',
  'sanctuary_bell',
  'rending_slash',
  'war_drums',
  'relentless_tide',
  'rune_pouch',
  'verdant_vial',
  'tome_of_depths',
  'quickstep_boots',
  'alternating_crest',
  'chain_bolt',
  'draw_power_sigil',
] as const;

/** 生成遗物池：用于 Boss fallback，避免生成资产只存在于定义文件而没有获取路径。 */
export const GENERATED_RELIC_POOL = Object.keys(GENERATED_RELICS) as readonly string[];

/** Boss 战后随机其一（角色池优先，角色池拿空后从全量遗物池 fallback）。 */
export const BOSS_RELIC_POOL = [
  ...new Set([...COMMON_RELIC_POOL, ...GENERATED_RELIC_POOL]),
] as readonly string[];

export function rollBossRelicReward(
  seed: number,
  salt: number,
  ownedRelicIds: string[],
  characterId = DEFAULT_CHARACTER_ID,
): string | null {
  const characterPool = getCharacterDefinition(characterId).rewardRelicPool;
  const available = characterPool.filter((id) => !ownedRelicIds.includes(id));
  const fallback = BOSS_RELIC_POOL.filter((id) => !ownedRelicIds.includes(id));
  const pool = available.length > 0 ? available : fallback;
  if (pool.length === 0) return null;
  const rng = mulberry32((seed ^ salt ^ 0xb055) >>> 0);
  return pool[Math.floor(rng() * pool.length)]!;
}
