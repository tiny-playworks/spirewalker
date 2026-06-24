/**
 * 一次性生成器：从核心卡（starter + rare + legendary）产出统一风格的卡牌插画 prompt，
 * 连同状态/意图图标、兜底插画 prompt 一起写入 assets/prompts/combat-asset-prompts.md。
 *
 * 用法：pnpm exec tsx scripts/gen-card-art-prompts.ts
 * 注意：仅生成「核心层」插画 prompt，长尾卡走兜底插画，不在此清单内。
 */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ALL_CARD_DEFINITIONS } from '../src/game/core/definitions/cards/index';
import { getCardArchetype } from '../src/game/core/definitions/cards/archetypes';
import type { CardDefinition, EffectDefinition } from '../src/game/core/model/card';

const STYLE_SUFFIX =
  'dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024';

const ICON_STYLE_SUFFIX =
  'glowing magical UI emblem, dark fantasy, centered, transparent background, crisp readable silhouette, simple icon design, 1:1, 256x256';

const ARCHETYPE_PALETTE: Record<string, string> = {
  guard: 'cool cyan and steel-blue protective energy',
  burst: 'fiery crimson and molten-orange embers',
  mixed: 'violet and magenta void energy',
  neutral: 'muted grey-gold ethereal light',
};

const TYPE_MOTIF: Record<string, string> = {
  attack: 'a hooded dark-armored void warrior in a dynamic offensive action',
  skill: 'a hooded dark-armored void warrior performing a focused defensive or utility gesture',
  power: 'a hooded dark-armored void warrior wreathed in a persistent magical aura, ritual pose',
};

function statusMotif(statusId: string): string | null {
  switch (statusId) {
    case 'strength':
      return 'blade and arms glowing with empowering crimson runes';
    case 'vulnerable':
      return 'target armor cracking apart with glowing red fissures';
    case 'weak':
      return 'draining grey mist sapping the strength of a foe';
    case 'momentum':
      return 'swirling streams of momentum energy spiraling around the body';
    case 'metallicize':
      return 'skin hardening into dark metallic plating';
    case 'steady_guard':
      return 'a steady braced stance ringed by layered translucent wards';
    case 'primed_break':
      return 'a coiled charge of energy about to burst';
    case 'patience_power':
      return 'a meditative charging pose slowly gathering inner power';
    default:
      return null;
  }
}

function describeEffects(def: CardDefinition): string[] {
  const motifs: string[] = [];
  const walk = (effects: EffectDefinition[], repeated = false) => {
    for (const e of effects) {
      if (e.type === 'damage') {
        if (e.target === 'all_enemies') motifs.push('a sweeping area strike crashing into several enemies at once');
        else motifs.push(repeated ? 'a rapid multi-hit flurry of strikes' : 'a single decisive heavy strike');
      } else if (e.type === 'block') {
        motifs.push('raising a glowing protective ward or shield');
      } else if (e.type === 'heal') {
        motifs.push('soft restorative light mending wounds');
      } else if (e.type === 'draw') {
        motifs.push('spectral cards and scrolls swirling toward the hand');
      } else if (e.type === 'gain_energy') {
        motifs.push('a surging radiant energy core flaring with power');
      } else if (e.type === 'apply_status') {
        const m = statusMotif(e.statusId);
        if (m) motifs.push(m);
      } else if (e.type === 'repeat') {
        motifs.push('a rapid multi-hit flurry of strikes');
        walk(e.effects, true);
      } else if (e.type === 'custom') {
        if (e.scriptId === 'momentum_burst_damage') motifs.push('unleashing stored momentum as an explosive burst strike');
        else if (e.scriptId === 'momentum_burst_draw') motifs.push('converting swirling momentum into a fan of drawn cards');
        else if (e.scriptId === 'momentum_guard_by_stacks') motifs.push('weaving momentum energy into a defensive barrier');
      }
    }
  };
  walk(def.effects);
  return [...new Set(motifs)];
}

function buildPrompt(def: CardDefinition): string {
  const archetype = getCardArchetype(def.id);
  const palette = ARCHETYPE_PALETTE[archetype] ?? ARCHETYPE_PALETTE.neutral;
  const motif = TYPE_MOTIF[def.type] ?? TYPE_MOTIF.skill;
  const effectMotifs = describeEffects(def);
  const action = effectMotifs.length > 0 ? effectMotifs.join(', ') : 'channeling void power';
  return `${motif}, ${action}, ${palette} accents, ${STYLE_SUFFIX}`;
}

function isUpgraded(id: string): boolean {
  return id.endsWith('+');
}

// 核心层：只收 rare + legendary 亮牌（uncommon/common 长尾走兜底插画）
const cards = Object.values(ALL_CARD_DEFINITIONS).filter((c) => {
  if (isUpgraded(c.id)) return false;
  if (c.type === 'curse' || c.type === 'status') return false;
  return c.rarity === 'rare' || c.rarity === 'legendary';
});

// starter 核心：取 starter 模块真正的命名导出基础牌（CARD_DEFINITIONS 已被合并成全集，不能用）
import {
  STRIKE, DEFEND, BASH, FLEX, CLEAVE, SURGE, SKIM, MOMENTUM, TEMPO_GUARD, PRIME_RHYTHM,
  BRACE_RHYTHM, BURST_STRIKE, SNAP_STRIKE, CASH_FLOW, RELEASE_FLOW, STEADY_STEP, RECENTER,
  PATCH_BREATH, SECOND_WIND, SOFT_STEP, ANCHORED_BREATH, HELD_BREATH, PATIENT_CUT, ANCHOR_SLASH,
  STABLE_MIND, GUARD_STRIKE, QUICK_RELEASE, FOLLOW_THROUGH, BREAK_OPENING, FULL_RELEASE,
  SURVEY_FIELD, MEASURED_REST, BURN_EDGE, CLEAR_MIND, OVERLOAD, BLOOD_RUSH, FORTIFY,
  PATIENCE_STANCE, FLOW_SHIFT, BALANCE_EDGE, GUARD_VIGIL_BANNER, BURST_SIGNAL_BANNER,
} from '../src/game/core/definitions/cards/starter';
const STARTER_CARDS: CardDefinition[] = [
  STRIKE, DEFEND, BASH, FLEX, CLEAVE, SURGE, SKIM, MOMENTUM, TEMPO_GUARD, PRIME_RHYTHM,
  BRACE_RHYTHM, BURST_STRIKE, SNAP_STRIKE, CASH_FLOW, RELEASE_FLOW, STEADY_STEP, RECENTER,
  PATCH_BREATH, SECOND_WIND, SOFT_STEP, ANCHORED_BREATH, HELD_BREATH, PATIENT_CUT, ANCHOR_SLASH,
  STABLE_MIND, GUARD_STRIKE, QUICK_RELEASE, FOLLOW_THROUGH, BREAK_OPENING, FULL_RELEASE,
  SURVEY_FIELD, MEASURED_REST, BURN_EDGE, CLEAR_MIND, OVERLOAD, BLOOD_RUSH, FORTIFY,
  PATIENCE_STANCE, FLOW_SHIFT, BALANCE_EDGE, GUARD_VIGIL_BANNER, BURST_SIGNAL_BANNER,
];
const starterCore = STARTER_CARDS.filter(
  (c) => !isUpgraded(c.id) && c.type !== 'curse' && c.type !== 'status',
);

const seen = new Set<string>();
const coreSet: CardDefinition[] = [];
for (const c of [...starterCore, ...cards]) {
  if (seen.has(c.id)) continue;
  seen.add(c.id);
  coreSet.push(c);
}

coreSet.sort((a, b) => {
  const ra = ['legendary', 'rare', 'uncommon', 'common'].indexOf(a.rarity);
  const rb = ['legendary', 'rare', 'uncommon', 'common'].indexOf(b.rarity);
  if (ra !== rb) return ra - rb;
  return a.id.localeCompare(b.id);
});

const byArch: Record<string, CardDefinition[]> = { guard: [], burst: [], mixed: [], neutral: [] };
for (const c of coreSet) byArch[getCardArchetype(c.id)].push(c);

const lines: string[] = [];
lines.push('# Spirewalker 战斗资源 Prompt 清单');
lines.push('');
lines.push('> 自动生成（scripts/gen-card-art-prompts.ts）。统一风格后缀已内置，直接复制到 GPT 出图即可。');
lines.push('> 出图为正方形透明/深色底插画，落地路径见每节说明。卡名仅作对照，不要画进图里。');
lines.push('');

lines.push('## 统一风格基准');
lines.push('');
lines.push('所有战斗插画共用同一基调，保证嵌进卡框/界面后风格一致：');
lines.push('');
lines.push('```');
lines.push(STYLE_SUFFIX);
lines.push('```');
lines.push('');
lines.push('流派配色：守=' + ARCHETYPE_PALETTE.guard + '；爆=' + ARCHETYPE_PALETTE.burst + '；混=' + ARCHETYPE_PALETTE.mixed + '；通=' + ARCHETYPE_PALETTE.neutral + '。');
lines.push('');

lines.push('## 尺寸与格式规格');
lines.push('');
lines.push('| 资产 | 出图尺寸 | 比例 | 格式 | 背景 | 备注 |');
lines.push('| --- | --- | --- | --- | --- | --- |');
lines.push('| 核心卡插画 / 兜底插画 | 1024×1024 | 1:1 | webp（优先）或 png | 深色或不透明均可 | 进 public 前可压到 ~512 |');
lines.push('| 状态图标 | **256×256** | 1:1 | webp（优先）或 png | 必须透明 | UI 显示约 64px，无需 1024 |');
lines.push('| 意图图标 | **256×256** | 1:1 | webp（优先）或 png | 必须透明 | UI 显示约 32px，无需 1024 |');
lines.push('');
lines.push('- 插画区在 UI 里用 `object-fit: cover` 裁切，统一 1:1 不会变形。');
lines.push('- 图标叠在深色 chip/画框上，背景务必透明；GPT 偶尔不给 alpha，拿到后确认。');
lines.push('- 164 张卡插画全 1024 会让仓库变重，建议批量压缩后再放入 public。');
lines.push('');

lines.push('## A. 状态图标（8 个） → public/assets/combat/statuses/<id>.webp');
lines.push('');
lines.push('风格：1:1 **256×256**，透明底，发光符文宝石小图标，可在 64px 下清晰辨认。');
lines.push('');
const STATUS_ICON_PROMPTS: Array<[string, string, string]> = [
  ['strength', '力量', 'a glowing crimson fist rune emblem, empowering aura'],
  ['weak', '虚弱', 'a cracked grey downward-arrow rune draining energy'],
  ['vulnerable', '易伤', 'a shattered shield rune with red fracture glow'],
  ['momentum', '连势', 'a spiraling cyan momentum vortex rune'],
  ['metallicize', '金属化', 'a dark metallic hexagon plate rune with steel sheen'],
  ['steady_guard', '稳势', 'a layered teal ward sigil, calm steady glow'],
  ['primed_break', '破势预热', 'a charged amber burst rune about to detonate'],
  ['patience_power', '蓄势', 'a meditative gathering-energy rune, slow building violet glow'],
];
for (const [id, cn, motif] of STATUS_ICON_PROMPTS) {
  lines.push(`- \`${id}.webp\`（${cn}）`);
  lines.push('');
  lines.push('```');
  lines.push(`${motif}, status icon, ${ICON_STYLE_SUFFIX}`);
  lines.push('```');
  lines.push('');
}

lines.push('## B. 意图图标（5 个） → public/assets/combat/intents/<id>.webp');
lines.push('');
const INTENT_ICON_PROMPTS: Array<[string, string, string]> = [
  ['attack', '攻击', 'crossed blades / weapon strike icon, aggressive red glow'],
  ['defend', '防御', 'raised shield icon, steel-blue protective glow'],
  ['buff', '增益', 'upward spiral aura icon, golden empowering glow'],
  ['debuff', '减益', 'downward draining hex icon, sickly purple glow'],
  ['unknown', '未知', 'a glowing question sigil shrouded in mist, neutral grey'],
];
for (const [id, cn, motif] of INTENT_ICON_PROMPTS) {
  lines.push(`- \`${id}.webp\`（${cn}）`);
  lines.push('');
  lines.push('```');
  lines.push(`${motif}, enemy intent icon, ${ICON_STYLE_SUFFIX}`);
  lines.push('```');
  lines.push('');
}

lines.push('## C. 兜底插画（12 张） → public/assets/cards/art_shared/<archetype>_<type>.webp');
lines.push('');
lines.push('长尾卡未单独出图时使用，按流派×类型各一张。');
lines.push('');
for (const arch of ['guard', 'burst', 'mixed', 'neutral'] as const) {
  for (const type of ['attack', 'skill', 'power'] as const) {
    lines.push(`- \`${arch}_${type}.webp\``);
    lines.push('');
    lines.push('```');
    lines.push(`${TYPE_MOTIF[type]}, ${ARCHETYPE_PALETTE[arch]} accents, generic emblematic composition, ${STYLE_SUFFIX}`);
    lines.push('```');
    lines.push('');
  }
}

lines.push(`## D. 核心卡插画（${coreSet.length} 张） → public/assets/cards/art/<cardId>.webp`);
lines.push('');
lines.push('文件名用卡的基础 id（升级版 +/++ 复用同一张图）。');
lines.push('');
for (const arch of ['guard', 'burst', 'mixed', 'neutral'] as const) {
  const group = byArch[arch];
  if (group.length === 0) continue;
  lines.push(`### ${arch}（${group.length}）`);
  lines.push('');
  for (const def of group) {
    lines.push(`- \`${def.id}.webp\` — ${def.name}（${def.rarity}/${def.type}）：${def.description}`);
    lines.push('');
    lines.push('```');
    lines.push(buildPrompt(def));
    lines.push('```');
    lines.push('');
  }
}

const out = resolve(process.cwd(), 'assets/prompts/combat-asset-prompts.md');
writeFileSync(out, lines.join('\n'), 'utf8');
console.log(`核心卡 ${coreSet.length} 张；已写入 ${out}`);
console.log('流派分布：', Object.fromEntries(Object.entries(byArch).map(([k, v]) => [k, v.length])));
