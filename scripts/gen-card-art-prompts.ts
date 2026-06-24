/**
 * 一次性生成器：从核心卡（starter + rare + legendary）产出统一风格的卡牌插画 prompt，
 * 连同状态/意图图标、兜底插画 prompt 一起写入 assets/prompts/combat-asset-prompts.md。
 *
 * 用法：pnpm exec tsx scripts/gen-card-art-prompts.ts
 * 注意：仅生成「核心层」插画 prompt，长尾卡走兜底插画，不在此清单内。
 */
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ALL_CARD_DEFINITIONS } from '../src/game/core/definitions/cards/index';
import { getCardArchetype } from '../src/game/core/definitions/cards/archetypes';
import type { CardDefinition, EffectDefinition } from '../src/game/core/model/card';

const FALLBACK_STYLE_SUFFIX =
  'dark fantasy game card illustration, simple emblematic pose, soft muted temple background, minimal magical effects, clean readable silhouette, no text, no border, no UI, no card frame, square 1:1, 1024x1024';

const CORE_STYLE_SUFFIX =
  'cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024';

const ICON_STYLE_SUFFIX =
  'glowing magical UI emblem, dark fantasy, centered, transparent background, crisp readable silhouette, simple icon design, 1:1, 256x256';

const ARCHETYPE_PALETTE: Record<string, string> = {
  guard: 'cool cyan and steel-blue protective energy',
  burst: 'fiery crimson and molten-orange embers',
  mixed: 'violet and magenta void energy',
  neutral: 'muted grey-gold ethereal light',
};

/** 核心卡专属：流派氛围与场景叙事，兜底卡不含此层 */
const ARCHETYPE_ATMOSPHERE: Record<string, string> = {
  guard:
    'sanctified temple ruins bathed in cyan ward-light, steel-blue barrier glyphs floating above cracked stone',
  burst:
    'ember storm erupting around the warrior, molten sparks and heat distortion filling the air',
  mixed:
    'clashing void currents of violet and magenta swirling through shattered archways',
  neutral:
    'pale ethereal mist and ancient rune circles glowing on the temple floor',
};

/** 核心卡专属：类型化 VFX 强调 */
const TYPE_VFX: Record<string, string> = {
  attack: 'explosive impact flash and weapon trail cutting through the frame',
  skill: 'concentrated magical effect radiating from hands with sharp readable glow',
  power: 'persistent aura halo and ascending energy motes surrounding the figure',
};

const RARITY_INTENSITY: Record<string, string> = {
  common:
    'signature card art with one bold readable magical effect, restrained but vivid color accents, not generic placeholder art',
  uncommon:
    'distinct collectible card illustration, clear magical focal point, stronger color contrast and environmental storytelling',
  rare: 'dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette',
  legendary:
    'mythic showcase card art, epic environmental magic, powerful layered effects, legendary presence without visual clutter',
};

const ATTACK_POSES = [
  'lunging forward with a visible weapon strike',
  'delivering a sweeping blade arc with energy trailing the weapon',
  'driving a downward crushing blow with impact sparks',
  'thrusting a spear or blade in a three-quarter turn',
  'spinning into a slashing follow-through',
  'hammering an energy-charged punch with gauntleted fist',
];

const SKILL_POSES = [
  'raising one arm in a focused defensive gesture',
  'planting feet wide while channeling a ward',
  'extending both hands to shape a protective barrier',
  'kneeling slightly while reinforcing armor with energy',
  'turning sideways with shield arm forward',
  'drawing inward with controlled breath and ward rings',
];

const POWER_POSES = [
  'standing in a ritual stance with enduring aura',
  'arms spread in a passive empowerment ritual',
  'head bowed while a persistent aura wraps the body',
  'one knee grounded in a lasting power-up stance',
  'palms open as a slow-burning aura settles on armor',
  'rooted posture with a steady glow across shoulders',
];

const COMPOSITION_ANGLES = [
  'three-quarter view from the left',
  'three-quarter view from the right',
  'slightly low angle emphasizing power',
  'centered frontal view',
  'slightly elevated view',
  'diagonal composition with the void spire behind one shoulder',
];

function hashPick<T>(id: string, items: T[]): T {
  const h = createHash('md5').update(id).digest();
  return items[h[0] % items.length];
}

function typeAction(def: CardDefinition): string {
  if (def.type === 'attack') {
    const pose = hashPick(def.id, ATTACK_POSES);
    return `in a dynamic offensive action, ${pose}, weapon strike or energy impact clearly visible`;
  }
  if (def.type === 'power') {
    const pose = hashPick(def.id, POWER_POSES);
    return `in a ritual stance with persistent aura, ${pose}, less motion, more enduring status`;
  }
  const pose = hashPick(def.id, SKILL_POSES);
  return `performing a focused defensive or utility gesture, ${pose}, effect readable and not a boss transformation`;
}

function statusMotif(statusId: string): string | null {
  switch (statusId) {
    case 'strength':
      return 'crimson runes glowing on arms and weapon, empowered posture';
    case 'vulnerable':
      return 'enemy armor cracking with glowing red fissures';
    case 'weak':
      return 'draining grey mist sapping an enemy silhouette';
    case 'momentum':
      return 'spiraling momentum streams, flowing energy trails around the body';
    case 'metallicize':
      return 'dark metallic plating spreading across arms and shoulders, armor hardening, steel sheen';
    case 'steady_guard':
      return 'braced stance, grounded posture, layered stable ward rings';
    case 'primed_break':
      return 'coiled unstable energy charge, compressed explosive aura about to burst';
    case 'patience_power':
      return 'meditative stillness slowly gathering inner strength between strikes';
    default:
      return null;
  }
}

function customMotif(scriptId: string, params?: Record<string, unknown>): string | null {
  switch (scriptId) {
    case 'momentum_burst_damage': {
      const hits = params?.hits as number | undefined;
      if (hits && hits > 1) {
        return `${hits} rapid momentum-fueled strikes each trailing spiraling energy streams`;
      }
      return 'unleashing spiraling momentum streams into a violent energy impact';
    }
    case 'momentum_burst_draw':
      return 'spectral cards and scrolls flowing toward the hand as momentum streams dissolve';
    case 'momentum_guard_by_stacks':
      return 'translucent protective ward forming as momentum energy weaves into barrier arcs';
    case 'momentum_conditional_draw':
      return 'spectral cards drifting inward while momentum rings hold steady around the body';
    case 'momentum_conditional_block':
      return 'translucent protective ward with cyan shield arcs, momentum rings held intact without breaking';
    case 'block_to_damage':
      return 'cyan shield energy detonating outward from stored block into a crushing weapon strike';
    case 'steady_guard_burst_damage':
      return 'layered stable ward rings collapsing into a focused spear thrust of force';
    case 'primed_break_burst_damage':
      return 'coiled explosive aura erupting into a concentrated blast on impact';
    case 'energy_to_damage':
      return 'radiant energy core in the palm flaring into a devastating crimson annihilation beam';
    case 'consume_block_for_damage':
      return 'shattering a translucent ward to fuel a heavy armor-breaking strike';
    case 'momentum_to_energy':
      return 'momentum streams funneling into a radiant energy core flaring in the chest';
    case 'momentum_burst_block':
      return 'momentum streams folding into translucent protective ward wrapping around armor';
    case 'metallicize_to_block':
      return 'dark metallic plating spreading then reflecting into a steel ward barrier after the strike';
    case 'conditional_damage':
      return params?.condition === 'has_block'
        ? 'strike empowered by a glowing ward shell still wrapped around the warrior'
        : 'decisive strike with conditional power surging along the blade';
    case 'conditional_block':
      return 'translucent protective ward reinforced by hardened metallic plating';
    case 'multi_hit_with_block':
      return 'rapid alternating strikes each leaving a brief cyan shield arc in its wake';
    case 'overload_exhaust_attacks':
      return 'hand igniting with discarded attack energy erupting as scattered crimson bolts';
    case 'blood_rush_strike':
      return 'fierce crimson strike intensifying as if fueled by spent cards this turn';
    case 'fortify_convert_flag':
      return 'residual block energy coiling on the ward, ready to lash out as retaliatory force at turn end';
    case 'flow_shift':
      return 'stance shifting between defensive ward and offensive blade in a single fluid motion';
    case 'balance_edge':
      return 'balanced strike where block energy and blade force meet at the edge of the weapon';
    case 'void_pact':
      return 'dark ethereal bargain draining life mist while momentum and ward rings rise together';
    default:
      return null;
  }
}

function describeEffects(def: CardDefinition): string[] {
  const motifs: string[] = [];
  const walk = (effects: EffectDefinition[], repeated = false) => {
    for (const e of effects) {
      if (e.type === 'damage') {
        if (e.target === 'self') {
          motifs.push('dark ethereal life force draining from the chest as a deliberate sacrifice');
        } else if (e.target === 'all_enemies') {
          motifs.push('sweeping area strike with visible energy impact across multiple enemy silhouettes');
        } else if (repeated) {
          motifs.push('rapid multi-hit flurry with each impact clearly readable');
        } else {
          motifs.push('single decisive heavy strike with visible impact');
        }
      } else if (e.type === 'block') {
        motifs.push('translucent protective ward, cyan shield arcs, barrier wrapping around armor');
      } else if (e.type === 'heal') {
        motifs.push('soft restorative light mending wounds on armor and skin');
      } else if (e.type === 'draw') {
        motifs.push('spectral cards and scrolls flowing toward the hand');
      } else if (e.type === 'gain_energy') {
        motifs.push('radiant energy core flaring in the palm or chest');
      } else if (e.type === 'apply_status') {
        const m = statusMotif(e.statusId);
        if (m) motifs.push(m);
      } else if (e.type === 'repeat') {
        motifs.push('rapid multi-hit flurry with each impact clearly readable');
        walk(e.effects, true);
      } else if (e.type === 'custom') {
        const m = customMotif(e.scriptId, e.params as Record<string, unknown> | undefined);
        if (m) motifs.push(m);
      }
    }
  };
  walk(def.effects);
  return [...new Set(motifs)];
}

function buildPrompt(def: CardDefinition): string {
  const archetype = getCardArchetype(def.id);
  const palette = ARCHETYPE_PALETTE[archetype] ?? ARCHETYPE_PALETTE.neutral;
  const atmosphere = ARCHETYPE_ATMOSPHERE[archetype] ?? ARCHETYPE_ATMOSPHERE.neutral;
  const typeVfx = TYPE_VFX[def.type] ?? TYPE_VFX.skill;
  const rarity = RARITY_INTENSITY[def.rarity] ?? RARITY_INTENSITY.common;
  const action = typeAction(def);
  const angle = hashPick(`${def.id}:angle`, COMPOSITION_ANGLES);
  const effectMotifs = describeEffects(def);
  const mechanism =
    effectMotifs.length > 0
      ? `primary card mechanic visualized as ${effectMotifs.join(', ')}`
      : 'primary card mechanic visualized as focused void energy with a single bold readable effect';
  return `Premium collectible card art of a hooded dark-armored void warrior ${action}, ${mechanism}, ${typeVfx}, ${atmosphere}, ${rarity}, ${angle}, bold saturated ${palette} accents dominating the scene, ${CORE_STYLE_SUFFIX}`;
}

function isUpgraded(id: string): boolean {
  return id.endsWith('+');
}

const cards = Object.values(ALL_CARD_DEFINITIONS).filter((c) => {
  if (isUpgraded(c.id)) return false;
  if (c.type === 'curse' || c.type === 'status') return false;
  return c.rarity === 'rare' || c.rarity === 'legendary';
});

import {
  STRIKE,
  DEFEND,
  BASH,
  FLEX,
  CLEAVE,
  SURGE,
  SKIM,
  MOMENTUM,
  TEMPO_GUARD,
  PRIME_RHYTHM,
  BRACE_RHYTHM,
  BURST_STRIKE,
  SNAP_STRIKE,
  CASH_FLOW,
  RELEASE_FLOW,
  STEADY_STEP,
  RECENTER,
  PATCH_BREATH,
  SECOND_WIND,
  SOFT_STEP,
  ANCHORED_BREATH,
  HELD_BREATH,
  PATIENT_CUT,
  ANCHOR_SLASH,
  STABLE_MIND,
  GUARD_STRIKE,
  QUICK_RELEASE,
  FOLLOW_THROUGH,
  BREAK_OPENING,
  FULL_RELEASE,
  SURVEY_FIELD,
  MEASURED_REST,
  BURN_EDGE,
  CLEAR_MIND,
  OVERLOAD,
  BLOOD_RUSH,
  FORTIFY,
  PATIENCE_STANCE,
  FLOW_SHIFT,
  BALANCE_EDGE,
  GUARD_VIGIL_BANNER,
  BURST_SIGNAL_BANNER,
} from '../src/game/core/definitions/cards/starter';
const STARTER_CARDS: CardDefinition[] = [
  STRIKE,
  DEFEND,
  BASH,
  FLEX,
  CLEAVE,
  SURGE,
  SKIM,
  MOMENTUM,
  TEMPO_GUARD,
  PRIME_RHYTHM,
  BRACE_RHYTHM,
  BURST_STRIKE,
  SNAP_STRIKE,
  CASH_FLOW,
  RELEASE_FLOW,
  STEADY_STEP,
  RECENTER,
  PATCH_BREATH,
  SECOND_WIND,
  SOFT_STEP,
  ANCHORED_BREATH,
  HELD_BREATH,
  PATIENT_CUT,
  ANCHOR_SLASH,
  STABLE_MIND,
  GUARD_STRIKE,
  QUICK_RELEASE,
  FOLLOW_THROUGH,
  BREAK_OPENING,
  FULL_RELEASE,
  SURVEY_FIELD,
  MEASURED_REST,
  BURN_EDGE,
  CLEAR_MIND,
  OVERLOAD,
  BLOOD_RUSH,
  FORTIFY,
  PATIENCE_STANCE,
  FLOW_SHIFT,
  BALANCE_EDGE,
  GUARD_VIGIL_BANNER,
  BURST_SIGNAL_BANNER,
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

const FALLBACK_TYPE_MOTIF: Record<string, string> = {
  attack: 'in a dynamic offensive action with a readable weapon strike',
  skill: 'performing a focused defensive or utility gesture',
  power: 'in a ritual stance with persistent aura, passive power-up feeling',
};

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
lines.push('**核心卡**（D 节）：');
lines.push('');
lines.push('```');
lines.push(`premium dark fantasy collectible card art, ${CORE_STYLE_SUFFIX}`);
lines.push('```');
lines.push('');
lines.push('**兜底卡**（C 节）：简约徽章感，弱化场景与特效。');
lines.push('');
lines.push('```');
lines.push(FALLBACK_STYLE_SUFFIX);
lines.push('```');
lines.push('');
lines.push(
  '流派配色：守=cool cyan and steel-blue protective energy；爆=fiery crimson and molten-orange embers；混=violet and magenta void energy；通=muted grey-gold ethereal light。',
);
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
lines.push('长尾卡未单独出图时使用，按流派×类型各一张。风格刻意简约、徽章感，与下方核心卡插画区分。');
lines.push('');
for (const arch of ['guard', 'burst', 'mixed', 'neutral'] as const) {
  for (const type of ['attack', 'skill', 'power'] as const) {
    lines.push(`- \`${arch}_${type}.webp\``);
    lines.push('');
    lines.push('```');
    lines.push(
      `A hooded dark-armored void warrior ${FALLBACK_TYPE_MOTIF[type]}, subtle ${ARCHETYPE_PALETTE[arch]} accents, generic emblematic composition, ${FALLBACK_STYLE_SUFFIX}`,
    );
    lines.push('```');
    lines.push('');
  }
}

lines.push(`## D. 核心卡插画（${coreSet.length} 张） → public/assets/cards/art/<cardId>.webp`);
lines.push('');
lines.push('文件名用卡的基础 id（升级版 +/++ 复用同一张图）。');
lines.push('核心卡风格：电影感定格瞬间、流派氛围场景、饱和配色与层次化魔法特效，明显区别于兜底插画。');
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
