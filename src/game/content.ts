import type {
  ArcanaDefinition,
  CharacterTalentDefinition,
  CoreDefinition,
  GlobalTalentDefinition,
  ItemDefinition,
  MuzzleDefinition,
  RelicDefinition,
  Rarity,
  WeaponDefinition,
} from './types';

export const RARITY_LABELS: Record<Rarity, string> = {
  common: '普通',
  rare: '稀有',
  epic: '史诗',
  legendary: '传奇',
};

export const RARITY_MULTIPLIER: Record<Rarity, number> = {
  common: 1,
  rare: 1.12,
  epic: 1.25,
  legendary: 1.38,
};

export const ARCANA_RARITY_MULTIPLIER: Record<Rarity, number> = {
  common: 1,
  rare: 1.2,
  epic: 1.45,
  legendary: 1.8,
};

// 起始双枪只负责建立快/慢两种射击节奏，不进入奖励池，也不预先绑定构筑路线。
export const STARTER_WEAPONS: WeaponDefinition[] = [
  {
    id: 'starter-repeater', kind: 'weapon', name: '学徒复进器', tag: 'neutral', basePrice: 0,
    description: '均衡的中性连射武器，适合安装任意路线模块。', damage: 9, fireRate: 5.8,
    magazine: 15, reloadMs: 1_350, projectileSpeed: 760, projectileRadius: 5,
  },
  {
    id: 'starter-handcannon', kind: 'weapon', name: '工坊手铳', tag: 'neutral', basePrice: 0,
    description: '缓慢而有冲击力的中性副武器，适合安装任意路线模块。', damage: 27, fireRate: 1.75,
    magazine: 5, reloadMs: 1_750, projectileSpeed: 590, projectileRadius: 8,
  },
];

export const WEAPONS: WeaponDefinition[] = [
  {
    id: 'arc-needle', kind: 'weapon', name: '迅弧针枪', tag: 'arc', basePrice: 48,
    description: '轻巧高射速，适合快速累计电弧触发。', damage: 10, fireRate: 6.4,
    magazine: 14, reloadMs: 1_350, projectileSpeed: 760, projectileRadius: 5,
  },
  {
    id: 'arc-volley', kind: 'weapon', name: '雷鸣连装铳', tag: 'arc', basePrice: 72,
    description: '更大的弹匣和更稳定的持续输出。', damage: 8, fireRate: 8.2,
    magazine: 22, reloadMs: 1_750, projectileSpeed: 720, projectileRadius: 5,
  },
  {
    id: 'blast-cannon', kind: 'weapon', name: '爆芯手炮', tag: 'blast', basePrice: 54,
    description: '缓慢而沉重，每一发都带着炉芯震动。', damage: 31, fireRate: 1.65,
    magazine: 5, reloadMs: 1_850, projectileSpeed: 570, projectileRadius: 9,
  },
  {
    id: 'blast-mortar', kind: 'weapon', name: '琥珀臼炮', tag: 'blast', basePrice: 78,
    description: '高伤害榴弹，弹匣很小但爆发猛烈。', damage: 48, fireRate: 1.05,
    magazine: 3, reloadMs: 2_150, projectileSpeed: 500, projectileRadius: 11,
  },
  {
    id: 'frost-lance', kind: 'weapon', name: '霜晶长针', tag: 'frost', basePrice: 55,
    description: '精准高速的晶针，擅长穿透队列。', damage: 18, fireRate: 3.6,
    magazine: 9, reloadMs: 1_500, projectileSpeed: 900, projectileRadius: 5,
  },
  {
    id: 'frost-repeater', kind: 'weapon', name: '寒辉复进器', tag: 'frost', basePrice: 75,
    description: '稳定发射霜晶弹，便于冻结与碎裂。', damage: 14, fireRate: 4.8,
    magazine: 12, reloadMs: 1_650, projectileSpeed: 820, projectileRadius: 6,
  },
];

export const MUZZLES: MuzzleDefinition[] = [
  {
    id: 'muzzle-ricochet', kind: 'muzzle', name: '导弧折射枪头', tag: 'arc', basePrice: 44,
    description: '子弹命中边界后弹跳一次。', bounces: 1,
  },
  {
    id: 'muzzle-fan', kind: 'muzzle', name: '三相分流枪头', tag: 'arc', basePrice: 68,
    description: '一次射出三枚较弱弹丸。', projectileCount: 3, spreadDeg: 14, damageMultiplier: 0.62,
  },
  {
    id: 'muzzle-bombard', kind: 'muzzle', name: '震爆扩口', tag: 'blast', basePrice: 48,
    description: '命中时产生小范围爆炸。', explosionRadius: 62, damageMultiplier: 0.92,
  },
  {
    id: 'muzzle-heavy', kind: 'muzzle', name: '重压聚能管', tag: 'blast', basePrice: 70,
    description: '弹丸更大、更慢，直接伤害显著提高。', damageMultiplier: 1.3,
  },
  {
    id: 'muzzle-pierce', kind: 'muzzle', name: '冰针穿刺器', tag: 'frost', basePrice: 46,
    description: '弹丸可以额外穿透两个敌人。', pierce: 2,
  },
  {
    id: 'muzzle-prism', kind: 'muzzle', name: '霜棱双生镜', tag: 'frost', basePrice: 69,
    description: '射出两枚平行晶针并获得一次穿透。', projectileCount: 2, spreadDeg: 5,
    pierce: 1, damageMultiplier: 0.76,
  },
];

export const CORES: CoreDefinition[] = [
  {
    id: 'core-chain', kind: 'core', name: '跃弧线圈', tag: 'arc', basePrice: 50,
    description: '命中后向附近目标传导一次电弧。', chainCount: 1, chainDamage: 0.55,
  },
  {
    id: 'core-capacitor', kind: 'core', name: '积蓄电容', tag: 'arc', basePrice: 74,
    description: '电弧可以继续传导，伤害衰减更低。', chainCount: 2, chainDamage: 0.66,
  },
  {
    id: 'core-ember', kind: 'core', name: '余烬炉芯', tag: 'blast', basePrice: 52,
    description: '命中造成持续灼烧。', burnDamage: 4, explosionRadius: 36,
  },
  {
    id: 'core-overpressure', kind: 'core', name: '超压燃室', tag: 'blast', basePrice: 76,
    description: '每次命中都会发生更猛烈的范围爆破。', burnDamage: 3, explosionRadius: 82,
  },
  {
    id: 'core-chill', kind: 'core', name: '低温晶核', tag: 'frost', basePrice: 50,
    description: '命中减速，连续命中后冻结目标。', slowRatio: 0.28, freezeHits: 4,
  },
  {
    id: 'core-shatter', kind: 'core', name: '碎晶共振核', tag: 'frost', basePrice: 76,
    description: '更快冻结，冻结目标死亡时发生碎裂。', slowRatio: 0.36, freezeHits: 3,
  },
];

export const RELICS: RelicDefinition[] = [
  {
    id: 'relic-static-feather', kind: 'relic', name: '静电羽片', tag: 'arc', basePrice: 46,
    description: '射速提高 8%。', modifiers: { fireRateMultiplier: 0.08 },
  },
  {
    id: 'relic-blue-spark', kind: 'relic', name: '蓝闪徽章', tag: 'arc', basePrice: 62,
    description: '暴击率提高 7%。', modifiers: { critChance: 0.07 },
  },
  {
    id: 'relic-conductor', kind: 'relic', name: '双相导体', tag: 'arc', basePrice: 82,
    description: '弹丸速度提高 18%，整体伤害提高 6%。',
    modifiers: { projectileSpeedMultiplier: 0.18, damageMultiplier: 0.06 },
  },
  {
    id: 'relic-amber-dust', kind: 'relic', name: '琥珀火药', tag: 'blast', basePrice: 48,
    description: '整体伤害提高 9%。', modifiers: { damageMultiplier: 0.09 },
  },
  {
    id: 'relic-hot-loader', kind: 'relic', name: '热装填臂', tag: 'blast', basePrice: 64,
    description: '换弹速度提高 16%。', modifiers: { reloadMultiplier: 0.16 },
  },
  {
    id: 'relic-pressure-gauge', kind: 'relic', name: '红线压力表', tag: 'blast', basePrice: 84,
    description: '伤害提高 12%，射速降低 4%。',
    modifiers: { damageMultiplier: 0.12, fireRateMultiplier: -0.04 },
  },
  {
    id: 'relic-snow-lens', kind: 'relic', name: '雪线目镜', tag: 'frost', basePrice: 46,
    description: '暴击伤害提高 25%。', modifiers: { critMultiplier: 0.25 },
  },
  {
    id: 'relic-pale-runner', kind: 'relic', name: '白霜滑靴', tag: 'frost', basePrice: 63,
    description: '移动速度提高 9%。', modifiers: { moveSpeedMultiplier: 0.09 },
  },
  {
    id: 'relic-crystal-scope', kind: 'relic', name: '晶棱准镜', tag: 'frost', basePrice: 83,
    description: '伤害和弹速各提高 8%。',
    modifiers: { damageMultiplier: 0.08, projectileSpeedMultiplier: 0.08 },
  },
  {
    id: 'relic-pocket-shield', kind: 'relic', name: '折叠护盾', tag: 'neutral', basePrice: 52,
    description: '进入战斗时获得 10 点护盾。', modifiers: { startingShield: 10 },
  },
  {
    id: 'relic-light-boots', kind: 'relic', name: '轻羽工靴', tag: 'neutral', basePrice: 58,
    description: '移动速度提高 7%，闪避冷却缩短 5%。',
    modifiers: { moveSpeedMultiplier: 0.07, dashCooldownMultiplier: -0.05 },
  },
  {
    id: 'relic-master-wrench', kind: 'relic', name: '大师扳手', tag: 'neutral', basePrice: 86,
    description: '伤害、射速和换弹速度各提高 5%。',
    modifiers: { damageMultiplier: 0.05, fireRateMultiplier: 0.05, reloadMultiplier: 0.05 },
  },
];

export const ARCANA: ArcanaDefinition[] = [
  {
    id: 'arcana-sixth-circuit', kind: 'arcana', name: '六拍回路', tag: 'arc', basePrice: 64,
    description: '每第 6 次电弧命中额外连锁两个目标。', rule: 'sixth-hit-chain',
  },
  {
    id: 'arcana-switch-spark', kind: 'arcana', name: '换相火花', tag: 'arc', basePrice: 72,
    description: '切枪后 3 秒内的首次电弧命中产生强化连锁，内置冷却 5 秒。', rule: 'swap-chain',
  },
  {
    id: 'arcana-loaded-burst', kind: 'arcana', name: '满膛冲击', tag: 'blast', basePrice: 66,
    description: '完成换弹后的第一发提高伤害与爆炸范围。', rule: 'reload-burst',
  },
  {
    id: 'arcana-aftershock', kind: 'arcana', name: '余爆箴言', tag: 'blast', basePrice: 76,
    description: '爆炸击杀会产生一次较弱的后续爆炸。', rule: 'explosion-aftershock',
  },
  {
    id: 'arcana-shatter-return', kind: 'arcana', name: '碎晶回流', tag: 'frost', basePrice: 65,
    description: '碎裂返还弹药并缩短闪避冷却。', rule: 'shatter-refund',
  },
  {
    id: 'arcana-frozen-tide', kind: 'arcana', name: '凝霜潮汐', tag: 'frost', basePrice: 74,
    description: '冻结目标时向周围释放减速寒潮。', rule: 'freeze-aura',
  },
];

export const ALL_ITEMS: ItemDefinition[] = [...WEAPONS, ...MUZZLES, ...CORES, ...RELICS, ...ARCANA];

export const ITEM_BY_ID = new Map([...STARTER_WEAPONS, ...ALL_ITEMS].map((item) => [item.id, item]));

export const GLOBAL_TALENTS: GlobalTalentDefinition[] = [
  { id: 'survival-hp', branch: 'survival', tier: 1, cost: 1, name: '强化骨架', description: '最大生命 +5。' },
  { id: 'survival-shield', branch: 'survival', tier: 2, cost: 2, name: '启动护盾', description: '每次出发获得 8 点护盾。' },
  { id: 'survival-dash', branch: 'survival', tier: 3, cost: 3, name: '轻量轴承', description: '闪避冷却缩短 5%。' },
  { id: 'survival-heal', branch: 'survival', tier: 4, cost: 4, name: '房间维护', description: '每个房间结束恢复 3 点生命。' },
  { id: 'survival-lethal', branch: 'survival', tier: 5, cost: 5, name: '最后保险', description: '每局第一次致命伤保留 1 点生命。' },
  { id: 'workshop-gold', branch: 'workshop', tier: 1, cost: 1, name: '备用零钱', description: '初始金币 +10。' },
  { id: 'workshop-discount', branch: 'workshop', tier: 2, cost: 2, name: '熟客名牌', description: '商店价格降低 5%。' },
  { id: 'workshop-salvage', branch: 'workshop', tier: 3, cost: 3, name: '精细拆解', description: '装备拆解返还提升至 35%。' },
  { id: 'workshop-reroll', branch: 'workshop', tier: 4, cost: 4, name: '免费盘点', description: '每个商店首次刷新免费。' },
  { id: 'workshop-slot', branch: 'workshop', tier: 5, cost: 5, name: '隐藏货架', description: '商店额外增加一个随机商品位。' },
  { id: 'fortune-rare', branch: 'fortune', tier: 1, cost: 1, name: '蓝光嗅觉', description: '稀有及以上权重 +2%。' },
  { id: 'fortune-reroll', branch: 'fortune', tier: 2, cost: 2, name: '再开一次', description: '每局可免费刷新一个宝箱。' },
  { id: 'fortune-elite', branch: 'fortune', tier: 3, cost: 3, name: '强敌馈赠', description: '精英宝箱史诗权重 +5%。' },
  { id: 'fortune-four', branch: 'fortune', tier: 4, cost: 4, name: '宽口宝箱', description: '每局一个普通或精英宝箱额外掉落 1 件。' },
  { id: 'fortune-legendary', branch: 'fortune', tier: 5, cost: 5, name: '金色火花', description: '传奇权重 +1%。' },
];

export const CHARACTER_TALENTS: CharacterTalentDefinition[] = [
  { id: 't1-fire', tier: 1, cost: 1, name: '火力校准', description: '超频射速额外 +15%。' },
  { id: 't1-move', tier: 1, cost: 1, name: '轻装增压', description: '超频移速额外 +10%。' },
  { id: 't1-reload', tier: 1, cost: 1, name: '极速装填', description: '超频换弹速度额外 +25%。' },
  { id: 't2-cooldown', tier: 2, cost: 2, name: '快速充能', description: '应急偏转冷却降至 50 秒。' },
  { id: 't2-shield', tier: 2, cost: 2, name: '余能护罩', description: '偏转后获得 15 点临时护盾。' },
  { id: 't2-heal', tier: 2, cost: 2, name: '反馈修复', description: '偏转后恢复 5 点生命。' },
  { id: 't3-duration', tier: 3, cost: 3, name: '长时超频', description: '超频持续时间 +2 秒。' },
  { id: 't3-reload', tier: 3, cost: 3, name: '紧急上膛', description: '启动超频时装填两把武器。' },
  { id: 't3-cooldown', tier: 3, cost: 3, name: '冷却回收', description: '超频冷却 -5 秒。' },
  { id: 't4-reactive', tier: 4, cost: 4, name: '应激循环', description: '偏转触发使超频冷却减少 8 秒。' },
  { id: 't4-deflect', tier: 4, cost: 4, name: '主动防护', description: '超频启动使偏转冷却减少 10 秒。' },
  { id: 't4-swap', tier: 4, cost: 4, name: '换枪节拍', description: '超频期间首次切枪获得短暂伤害提升。' },
  { id: 't5-redline', tier: 5, cost: 5, name: '红线运转', description: '超频时间缩短，但基础加成翻倍。' },
  { id: 't5-double', tier: 5, cost: 5, name: '双重偏转', description: '应急偏转可以储存两层。' },
  { id: 't5-adaptive', tier: 5, cost: 5, name: '自适应回路', description: '偏转时自动获得半强度超频。' },
];
