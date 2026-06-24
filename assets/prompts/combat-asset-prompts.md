# Spirewalker 战斗资源 Prompt 清单

> 自动生成（scripts/gen-card-art-prompts.ts）。统一风格后缀已内置，直接复制到 GPT 出图即可。
> 出图为正方形透明/深色底插画，落地路径见每节说明。卡名仅作对照，不要画进图里。

## 统一风格基准

所有战斗插画共用同一基调，保证嵌进卡框/界面后风格一致：

**核心卡**（D 节）：

```
premium dark fantasy collectible card art, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

**兜底卡**（C 节）：简约徽章感，弱化场景与特效。

```
dark fantasy game card illustration, simple emblematic pose, soft muted temple background, minimal magical effects, clean readable silhouette, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

流派配色：守=cool cyan and steel-blue protective energy；爆=fiery crimson and molten-orange embers；混=violet and magenta void energy；通=muted grey-gold ethereal light。

## 尺寸与格式规格

| 资产 | 出图尺寸 | 比例 | 格式 | 背景 | 备注 |
| --- | --- | --- | --- | --- | --- |
| 核心卡插画 / 兜底插画 | 1024×1024 | 1:1 | webp（优先）或 png | 深色或不透明均可 | 进 public 前可压到 ~512 |
| 状态图标 | **256×256** | 1:1 | webp（优先）或 png | 必须透明 | UI 显示约 64px，无需 1024 |
| 意图图标 | **256×256** | 1:1 | webp（优先）或 png | 必须透明 | UI 显示约 32px，无需 1024 |

- 插画区在 UI 里用 `object-fit: cover` 裁切，统一 1:1 不会变形。
- 图标叠在深色 chip/画框上，背景务必透明；GPT 偶尔不给 alpha，拿到后确认。
- 164 张卡插画全 1024 会让仓库变重，建议批量压缩后再放入 public。

## A. 状态图标（8 个） → public/assets/combat/statuses/<id>.webp

风格：1:1 **256×256**，透明底，发光符文宝石小图标，可在 64px 下清晰辨认。

- `strength.webp`（力量）

```
a glowing crimson fist rune emblem, empowering aura, status icon, glowing magical UI emblem, dark fantasy, centered, transparent background, crisp readable silhouette, simple icon design, 1:1, 256x256
```

- `weak.webp`（虚弱）

```
a cracked grey downward-arrow rune draining energy, status icon, glowing magical UI emblem, dark fantasy, centered, transparent background, crisp readable silhouette, simple icon design, 1:1, 256x256
```

- `vulnerable.webp`（易伤）

```
a shattered shield rune with red fracture glow, status icon, glowing magical UI emblem, dark fantasy, centered, transparent background, crisp readable silhouette, simple icon design, 1:1, 256x256
```

- `momentum.webp`（连势）

```
a spiraling cyan momentum vortex rune, status icon, glowing magical UI emblem, dark fantasy, centered, transparent background, crisp readable silhouette, simple icon design, 1:1, 256x256
```

- `metallicize.webp`（金属化）

```
a dark metallic hexagon plate rune with steel sheen, status icon, glowing magical UI emblem, dark fantasy, centered, transparent background, crisp readable silhouette, simple icon design, 1:1, 256x256
```

- `steady_guard.webp`（稳势）

```
a layered teal ward sigil, calm steady glow, status icon, glowing magical UI emblem, dark fantasy, centered, transparent background, crisp readable silhouette, simple icon design, 1:1, 256x256
```

- `primed_break.webp`（破势预热）

```
a charged amber burst rune about to detonate, status icon, glowing magical UI emblem, dark fantasy, centered, transparent background, crisp readable silhouette, simple icon design, 1:1, 256x256
```

- `patience_power.webp`（蓄势）

```
a meditative gathering-energy rune, slow building violet glow, status icon, glowing magical UI emblem, dark fantasy, centered, transparent background, crisp readable silhouette, simple icon design, 1:1, 256x256
```

## B. 意图图标（5 个） → public/assets/combat/intents/<id>.webp

- `attack.webp`（攻击）

```
crossed blades / weapon strike icon, aggressive red glow, enemy intent icon, glowing magical UI emblem, dark fantasy, centered, transparent background, crisp readable silhouette, simple icon design, 1:1, 256x256
```

- `defend.webp`（防御）

```
raised shield icon, steel-blue protective glow, enemy intent icon, glowing magical UI emblem, dark fantasy, centered, transparent background, crisp readable silhouette, simple icon design, 1:1, 256x256
```

- `buff.webp`（增益）

```
upward spiral aura icon, golden empowering glow, enemy intent icon, glowing magical UI emblem, dark fantasy, centered, transparent background, crisp readable silhouette, simple icon design, 1:1, 256x256
```

- `debuff.webp`（减益）

```
downward draining hex icon, sickly purple glow, enemy intent icon, glowing magical UI emblem, dark fantasy, centered, transparent background, crisp readable silhouette, simple icon design, 1:1, 256x256
```

- `unknown.webp`（未知）

```
a glowing question sigil shrouded in mist, neutral grey, enemy intent icon, glowing magical UI emblem, dark fantasy, centered, transparent background, crisp readable silhouette, simple icon design, 1:1, 256x256
```

## C. 兜底插画（12 张） → public/assets/cards/art_shared/<archetype>_<type>.webp

长尾卡未单独出图时使用，按流派×类型各一张。风格刻意简约、徽章感，与下方核心卡插画区分。

- `guard_attack.webp`

```
A hooded dark-armored void warrior in a dynamic offensive action with a readable weapon strike, subtle cool cyan and steel-blue protective energy accents, generic emblematic composition, dark fantasy game card illustration, simple emblematic pose, soft muted temple background, minimal magical effects, clean readable silhouette, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `guard_skill.webp`

```
A hooded dark-armored void warrior performing a focused defensive or utility gesture, subtle cool cyan and steel-blue protective energy accents, generic emblematic composition, dark fantasy game card illustration, simple emblematic pose, soft muted temple background, minimal magical effects, clean readable silhouette, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `guard_power.webp`

```
A hooded dark-armored void warrior in a ritual stance with persistent aura, passive power-up feeling, subtle cool cyan and steel-blue protective energy accents, generic emblematic composition, dark fantasy game card illustration, simple emblematic pose, soft muted temple background, minimal magical effects, clean readable silhouette, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `burst_attack.webp`

```
A hooded dark-armored void warrior in a dynamic offensive action with a readable weapon strike, subtle fiery crimson and molten-orange embers accents, generic emblematic composition, dark fantasy game card illustration, simple emblematic pose, soft muted temple background, minimal magical effects, clean readable silhouette, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `burst_skill.webp`

```
A hooded dark-armored void warrior performing a focused defensive or utility gesture, subtle fiery crimson and molten-orange embers accents, generic emblematic composition, dark fantasy game card illustration, simple emblematic pose, soft muted temple background, minimal magical effects, clean readable silhouette, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `burst_power.webp`

```
A hooded dark-armored void warrior in a ritual stance with persistent aura, passive power-up feeling, subtle fiery crimson and molten-orange embers accents, generic emblematic composition, dark fantasy game card illustration, simple emblematic pose, soft muted temple background, minimal magical effects, clean readable silhouette, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `mixed_attack.webp`

```
A hooded dark-armored void warrior in a dynamic offensive action with a readable weapon strike, subtle violet and magenta void energy accents, generic emblematic composition, dark fantasy game card illustration, simple emblematic pose, soft muted temple background, minimal magical effects, clean readable silhouette, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `mixed_skill.webp`

```
A hooded dark-armored void warrior performing a focused defensive or utility gesture, subtle violet and magenta void energy accents, generic emblematic composition, dark fantasy game card illustration, simple emblematic pose, soft muted temple background, minimal magical effects, clean readable silhouette, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `mixed_power.webp`

```
A hooded dark-armored void warrior in a ritual stance with persistent aura, passive power-up feeling, subtle violet and magenta void energy accents, generic emblematic composition, dark fantasy game card illustration, simple emblematic pose, soft muted temple background, minimal magical effects, clean readable silhouette, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `neutral_attack.webp`

```
A hooded dark-armored void warrior in a dynamic offensive action with a readable weapon strike, subtle muted grey-gold ethereal light accents, generic emblematic composition, dark fantasy game card illustration, simple emblematic pose, soft muted temple background, minimal magical effects, clean readable silhouette, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `neutral_skill.webp`

```
A hooded dark-armored void warrior performing a focused defensive or utility gesture, subtle muted grey-gold ethereal light accents, generic emblematic composition, dark fantasy game card illustration, simple emblematic pose, soft muted temple background, minimal magical effects, clean readable silhouette, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `neutral_power.webp`

```
A hooded dark-armored void warrior in a ritual stance with persistent aura, passive power-up feeling, subtle muted grey-gold ethereal light accents, generic emblematic composition, dark fantasy game card illustration, simple emblematic pose, soft muted temple background, minimal magical effects, clean readable silhouette, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

## D. 核心卡插画（164 张） → public/assets/cards/art/<cardId>.webp

文件名用卡的基础 id（升级版 +/++ 复用同一张图）。
核心卡风格：电影感定格瞬间、流派氛围场景、饱和配色与层次化魔法特效，明显区别于兜底插画。

### guard（47）

- `guard_legendary_1.webp` — 不动明王（legendary/skill）：获得 10 点格挡。若你本回合未消耗连势，额外获得 10 点格挡。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, extending both hands to shape a protective barrier, effect readable and not a boss transformation, primary card mechanic visualized as translucent protective ward with cyan shield arcs, momentum rings held intact without breaking, concentrated magical effect radiating from hands with sharp readable glow, sanctified temple ruins bathed in cyan ward-light, steel-blue barrier glyphs floating above cracked stone, mythic showcase card art, epic environmental magic, powerful layered effects, legendary presence without visual clutter, diagonal composition with the void spire behind one shoulder, bold saturated cool cyan and steel-blue protective energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `guard_legendary_2.webp` — 铁壁圣殿（legendary/power）：获得 8 层金属化。

```
Premium collectible card art of a hooded dark-armored void warrior in a ritual stance with persistent aura, one knee grounded in a lasting power-up stance, less motion, more enduring status, primary card mechanic visualized as dark metallic plating spreading across arms and shoulders, armor hardening, steel sheen, persistent aura halo and ascending energy motes surrounding the figure, sanctified temple ruins bathed in cyan ward-light, steel-blue barrier glyphs floating above cracked stone, mythic showcase card art, epic environmental magic, powerful layered effects, legendary presence without visual clutter, slightly elevated view, bold saturated cool cyan and steel-blue protective energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `guard_legendary_3.webp` — 定海神针（legendary/attack）：消耗所有稳势，每层造成 6 点伤害。消耗所有连势，每层造成 4 点伤害。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, hammering an energy-charged punch with gauntleted fist, weapon strike or energy impact clearly visible, primary card mechanic visualized as layered stable ward rings collapsing into a focused spear thrust of force, unleashing spiraling momentum streams into a violent energy impact, explosive impact flash and weapon trail cutting through the frame, sanctified temple ruins bathed in cyan ward-light, steel-blue barrier glyphs floating above cracked stone, mythic showcase card art, epic environmental magic, powerful layered effects, legendary presence without visual clutter, three-quarter view from the right, bold saturated cool cyan and steel-blue protective energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `guard_legendary_4.webp` — 钢铁洪流（legendary/attack）：造成等同于你格挡值 2.5 倍的伤害。消耗。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, driving a downward crushing blow with impact sparks, weapon strike or energy impact clearly visible, primary card mechanic visualized as cyan shield energy detonating outward from stored block into a crushing weapon strike, explosive impact flash and weapon trail cutting through the frame, sanctified temple ruins bathed in cyan ward-light, steel-blue barrier glyphs floating above cracked stone, mythic showcase card art, epic environmental magic, powerful layered effects, legendary presence without visual clutter, three-quarter view from the left, bold saturated cool cyan and steel-blue protective energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `guard_legendary_5.webp` — 圣盾连击（legendary/attack）：造成 5 点伤害并获得 5 点格挡，重复 4 次。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, hammering an energy-charged punch with gauntleted fist, weapon strike or energy impact clearly visible, primary card mechanic visualized as rapid alternating strikes each leaving a brief cyan shield arc in its wake, explosive impact flash and weapon trail cutting through the frame, sanctified temple ruins bathed in cyan ward-light, steel-blue barrier glyphs floating above cracked stone, mythic showcase card art, epic environmental magic, powerful layered effects, legendary presence without visual clutter, diagonal composition with the void spire behind one shoulder, bold saturated cool cyan and steel-blue protective energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `guard_legendary_6.webp` — 永恒壁垒（legendary/skill）：获得 15 点格挡。若你本回合未消耗连势，额外获得 5 点格挡。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, turning sideways with shield arm forward, effect readable and not a boss transformation, primary card mechanic visualized as translucent protective ward with cyan shield arcs, momentum rings held intact without breaking, concentrated magical effect radiating from hands with sharp readable glow, sanctified temple ruins bathed in cyan ward-light, steel-blue barrier glyphs floating above cracked stone, mythic showcase card art, epic environmental magic, powerful layered effects, legendary presence without visual clutter, slightly elevated view, bold saturated cool cyan and steel-blue protective energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `fortify.webp` — 固守（rare/skill）：获得 10 点格挡。回合结束时，将 50% 剩余格挡转化为伤害，随机攻击一名敌人。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, raising one arm in a focused defensive gesture, effect readable and not a boss transformation, primary card mechanic visualized as translucent protective ward, cyan shield arcs, barrier wrapping around armor, residual block energy coiling on the ward, ready to lash out as retaliatory force at turn end, concentrated magical effect radiating from hands with sharp readable glow, sanctified temple ruins bathed in cyan ward-light, steel-blue barrier glyphs floating above cracked stone, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, slightly elevated view, bold saturated cool cyan and steel-blue protective energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `gd_c_aegis_mastery.webp` — 神盾精通（rare/power）：获得 6 层稳势和 4 层金属化。

```
Premium collectible card art of a hooded dark-armored void warrior in a ritual stance with persistent aura, standing in a ritual stance with enduring aura, less motion, more enduring status, primary card mechanic visualized as braced stance, grounded posture, layered stable ward rings, dark metallic plating spreading across arms and shoulders, armor hardening, steel sheen, persistent aura halo and ascending energy motes surrounding the figure, sanctified temple ruins bathed in cyan ward-light, steel-blue barrier glyphs floating above cracked stone, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, centered frontal view, bold saturated cool cyan and steel-blue protective energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `gd_c_breaking_guard.webp` — 破势大师（rare/power）：获得 4 层破势预热，获得 3 层连势。

```
Premium collectible card art of a hooded dark-armored void warrior in a ritual stance with persistent aura, one knee grounded in a lasting power-up stance, less motion, more enduring status, primary card mechanic visualized as coiled unstable energy charge, compressed explosive aura about to burst, spiraling momentum streams, flowing energy trails around the body, persistent aura halo and ascending energy motes surrounding the figure, sanctified temple ruins bathed in cyan ward-light, steel-blue barrier glyphs floating above cracked stone, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, centered frontal view, bold saturated cool cyan and steel-blue protective energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `gd_c_eternal_fortress.webp` — 永恒堡垒（rare/skill）：获得 12 点格挡，获得 4 层金属化。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, extending both hands to shape a protective barrier, effect readable and not a boss transformation, primary card mechanic visualized as translucent protective ward, cyan shield arcs, barrier wrapping around armor, dark metallic plating spreading across arms and shoulders, armor hardening, steel sheen, concentrated magical effect radiating from hands with sharp readable glow, sanctified temple ruins bathed in cyan ward-light, steel-blue barrier glyphs floating above cracked stone, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, slightly low angle emphasizing power, bold saturated cool cyan and steel-blue protective energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `gd_c_fortress_master.webp` — 堡垒大师（rare/power）：获得 3 层力量和 5 层金属化。

```
Premium collectible card art of a hooded dark-armored void warrior in a ritual stance with persistent aura, rooted posture with a steady glow across shoulders, less motion, more enduring status, primary card mechanic visualized as crimson runes glowing on arms and weapon, empowered posture, dark metallic plating spreading across arms and shoulders, armor hardening, steel sheen, persistent aura halo and ascending energy motes surrounding the figure, sanctified temple ruins bathed in cyan ward-light, steel-blue barrier glyphs floating above cracked stone, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, three-quarter view from the left, bold saturated cool cyan and steel-blue protective energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `gd_c_guardian_devastation.webp` — 守卫毁灭（rare/attack）：造成等同于你格挡值两倍的伤害。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, lunging forward with a visible weapon strike, weapon strike or energy impact clearly visible, primary card mechanic visualized as cyan shield energy detonating outward from stored block into a crushing weapon strike, explosive impact flash and weapon trail cutting through the frame, sanctified temple ruins bathed in cyan ward-light, steel-blue barrier glyphs floating above cracked stone, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, centered frontal view, bold saturated cool cyan and steel-blue protective energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `gd_c_guardian_wrath.webp` — 守卫之怒（rare/attack）：造成 15 点伤害四次。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, lunging forward with a visible weapon strike, weapon strike or energy impact clearly visible, primary card mechanic visualized as rapid multi-hit flurry with each impact clearly readable, explosive impact flash and weapon trail cutting through the frame, sanctified temple ruins bathed in cyan ward-light, steel-blue barrier glyphs floating above cracked stone, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, slightly low angle emphasizing power, bold saturated cool cyan and steel-blue protective energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `gd_c_impenetrable_wall.webp` — 不可逾越之墙（rare/skill）：获得 20 点格挡。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, extending both hands to shape a protective barrier, effect readable and not a boss transformation, primary card mechanic visualized as translucent protective ward, cyan shield arcs, barrier wrapping around armor, concentrated magical effect radiating from hands with sharp readable glow, sanctified temple ruins bathed in cyan ward-light, steel-blue barrier glyphs floating above cracked stone, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, centered frontal view, bold saturated cool cyan and steel-blue protective energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `gd_c_last_wall.webp` — 最后壁垒（rare/skill）：获得 25 点格挡。消耗。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, raising one arm in a focused defensive gesture, effect readable and not a boss transformation, primary card mechanic visualized as translucent protective ward, cyan shield arcs, barrier wrapping around armor, concentrated magical effect radiating from hands with sharp readable glow, sanctified temple ruins bathed in cyan ward-light, steel-blue barrier glyphs floating above cracked stone, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, slightly low angle emphasizing power, bold saturated cool cyan and steel-blue protective energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `gd_c_metallic_mastery.webp` — 金属化精通（rare/power）：获得 8 层金属化。

```
Premium collectible card art of a hooded dark-armored void warrior in a ritual stance with persistent aura, standing in a ritual stance with enduring aura, less motion, more enduring status, primary card mechanic visualized as dark metallic plating spreading across arms and shoulders, armor hardening, steel sheen, persistent aura halo and ascending energy motes surrounding the figure, sanctified temple ruins bathed in cyan ward-light, steel-blue barrier glyphs floating above cracked stone, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, diagonal composition with the void spire behind one shoulder, bold saturated cool cyan and steel-blue protective energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `gd_c_momentum_bastion.webp` — 连势壁垒（rare/skill）：获得 8 点格挡，获得 6 层连势。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, turning sideways with shield arm forward, effect readable and not a boss transformation, primary card mechanic visualized as translucent protective ward, cyan shield arcs, barrier wrapping around armor, spiraling momentum streams, flowing energy trails around the body, concentrated magical effect radiating from hands with sharp readable glow, sanctified temple ruins bathed in cyan ward-light, steel-blue barrier glyphs floating above cracked stone, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, slightly elevated view, bold saturated cool cyan and steel-blue protective energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `gd_c_momentum_lord.webp` — 连势之王（rare/skill）：获得 8 层连势，抽 2 张牌。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, kneeling slightly while reinforcing armor with energy, effect readable and not a boss transformation, primary card mechanic visualized as spiraling momentum streams, flowing energy trails around the body, spectral cards and scrolls flowing toward the hand, concentrated magical effect radiating from hands with sharp readable glow, sanctified temple ruins bathed in cyan ward-light, steel-blue barrier glyphs floating above cracked stone, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, slightly elevated view, bold saturated cool cyan and steel-blue protective energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `gd_c_steady_master.webp` — 稳势大师（rare/power）：获得 5 层稳势。

```
Premium collectible card art of a hooded dark-armored void warrior in a ritual stance with persistent aura, standing in a ritual stance with enduring aura, less motion, more enduring status, primary card mechanic visualized as braced stance, grounded posture, layered stable ward rings, persistent aura halo and ascending energy motes surrounding the figure, sanctified temple ruins bathed in cyan ward-light, steel-blue barrier glyphs floating above cracked stone, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, centered frontal view, bold saturated cool cyan and steel-blue protective energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `gd_c_titan_slam.webp` — 巨人碾压（rare/attack）：造成 20 点伤害。消耗所有稳势，每层造成额外 5 点伤害。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, thrusting a spear or blade in a three-quarter turn, weapon strike or energy impact clearly visible, primary card mechanic visualized as cyan shield energy detonating outward from stored block into a crushing weapon strike, explosive impact flash and weapon trail cutting through the frame, sanctified temple ruins bathed in cyan ward-light, steel-blue barrier glyphs floating above cracked stone, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, slightly elevated view, bold saturated cool cyan and steel-blue protective energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `gd_c_ultimate_defense.webp` — 终极防御（rare/skill）：获得 15 点格挡，获得 3 层金属化，抽 2 张牌。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, extending both hands to shape a protective barrier, effect readable and not a boss transformation, primary card mechanic visualized as translucent protective ward, cyan shield arcs, barrier wrapping around armor, dark metallic plating spreading across arms and shoulders, armor hardening, steel sheen, spectral cards and scrolls flowing toward the hand, concentrated magical effect radiating from hands with sharp readable glow, sanctified temple ruins bathed in cyan ward-light, steel-blue barrier glyphs floating above cracked stone, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, diagonal composition with the void spire behind one shoulder, bold saturated cool cyan and steel-blue protective energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `gd_c_unstoppable_bulwark.webp` — 不可阻挡之壁（rare/skill）：获得 15 点格挡，获得 3 层力量。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, planting feet wide while channeling a ward, effect readable and not a boss transformation, primary card mechanic visualized as translucent protective ward, cyan shield arcs, barrier wrapping around armor, crimson runes glowing on arms and weapon, empowered posture, concentrated magical effect radiating from hands with sharp readable glow, sanctified temple ruins bathed in cyan ward-light, steel-blue barrier glyphs floating above cracked stone, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, diagonal composition with the void spire behind one shoulder, bold saturated cool cyan and steel-blue protective energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `guard_rare_atk_1.webp` — 铁壁猛击（rare/attack）：造成等同于你格挡值两倍的伤害。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, lunging forward with a visible weapon strike, weapon strike or energy impact clearly visible, primary card mechanic visualized as cyan shield energy detonating outward from stored block into a crushing weapon strike, explosive impact flash and weapon trail cutting through the frame, sanctified temple ruins bathed in cyan ward-light, steel-blue barrier glyphs floating above cracked stone, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, three-quarter view from the left, bold saturated cool cyan and steel-blue protective energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `guard_rare_atk_2.webp` — 稳势爆发（rare/attack）：造成 20 点伤害。消耗所有稳势，每层造成额外 5 点伤害。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, hammering an energy-charged punch with gauntleted fist, weapon strike or energy impact clearly visible, primary card mechanic visualized as layered stable ward rings collapsing into a focused spear thrust of force, explosive impact flash and weapon trail cutting through the frame, sanctified temple ruins bathed in cyan ward-light, steel-blue barrier glyphs floating above cracked stone, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, three-quarter view from the left, bold saturated cool cyan and steel-blue protective energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `guard_rare_atk_3.webp` — 金属化打击（rare/attack）：造成 15 点伤害，获得等同于你金属化层数的格挡。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, delivering a sweeping blade arc with energy trailing the weapon, weapon strike or energy impact clearly visible, primary card mechanic visualized as dark metallic plating spreading then reflecting into a steel ward barrier after the strike, explosive impact flash and weapon trail cutting through the frame, sanctified temple ruins bathed in cyan ward-light, steel-blue barrier glyphs floating above cracked stone, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, three-quarter view from the left, bold saturated cool cyan and steel-blue protective energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `guard_rare_atk_4.webp` — 守势连击（rare/attack）：造成 5 点伤害四次。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, lunging forward with a visible weapon strike, weapon strike or energy impact clearly visible, primary card mechanic visualized as rapid multi-hit flurry with each impact clearly readable, explosive impact flash and weapon trail cutting through the frame, sanctified temple ruins bathed in cyan ward-light, steel-blue barrier glyphs floating above cracked stone, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, diagonal composition with the void spire behind one shoulder, bold saturated cool cyan and steel-blue protective energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `guard_rare_atk_5.webp` — 破势反击（rare/attack）：造成 25 点伤害。消耗所有破势预热，每层造成额外 8 点伤害。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, lunging forward with a visible weapon strike, weapon strike or energy impact clearly visible, primary card mechanic visualized as coiled explosive aura erupting into a concentrated blast on impact, explosive impact flash and weapon trail cutting through the frame, sanctified temple ruins bathed in cyan ward-light, steel-blue barrier glyphs floating above cracked stone, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, three-quarter view from the right, bold saturated cool cyan and steel-blue protective energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `guard_rare_power_1.webp` — 金属化精通（rare/power）：获得 8 层金属化。

```
Premium collectible card art of a hooded dark-armored void warrior in a ritual stance with persistent aura, head bowed while a persistent aura wraps the body, less motion, more enduring status, primary card mechanic visualized as dark metallic plating spreading across arms and shoulders, armor hardening, steel sheen, persistent aura halo and ascending energy motes surrounding the figure, sanctified temple ruins bathed in cyan ward-light, steel-blue barrier glyphs floating above cracked stone, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, slightly low angle emphasizing power, bold saturated cool cyan and steel-blue protective energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `guard_rare_power_2.webp` — 稳势精通（rare/power）：获得 5 层稳势。

```
Premium collectible card art of a hooded dark-armored void warrior in a ritual stance with persistent aura, rooted posture with a steady glow across shoulders, less motion, more enduring status, primary card mechanic visualized as braced stance, grounded posture, layered stable ward rings, persistent aura halo and ascending energy motes surrounding the figure, sanctified temple ruins bathed in cyan ward-light, steel-blue barrier glyphs floating above cracked stone, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, centered frontal view, bold saturated cool cyan and steel-blue protective energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `guard_rare_power_3.webp` — 守势大师（rare/power）：获得 3 层力量和 5 层金属化。

```
Premium collectible card art of a hooded dark-armored void warrior in a ritual stance with persistent aura, palms open as a slow-burning aura settles on armor, less motion, more enduring status, primary card mechanic visualized as crimson runes glowing on arms and weapon, empowered posture, dark metallic plating spreading across arms and shoulders, armor hardening, steel sheen, persistent aura halo and ascending energy motes surrounding the figure, sanctified temple ruins bathed in cyan ward-light, steel-blue barrier glyphs floating above cracked stone, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, slightly elevated view, bold saturated cool cyan and steel-blue protective energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `guard_rare_power_4.webp` — 连势大师（rare/power）：获得 6 层连势。

```
Premium collectible card art of a hooded dark-armored void warrior in a ritual stance with persistent aura, arms spread in a passive empowerment ritual, less motion, more enduring status, primary card mechanic visualized as spiraling momentum streams, flowing energy trails around the body, persistent aura halo and ascending energy motes surrounding the figure, sanctified temple ruins bathed in cyan ward-light, steel-blue barrier glyphs floating above cracked stone, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, slightly low angle emphasizing power, bold saturated cool cyan and steel-blue protective energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `guard_rare_power_5.webp` — 破势预热精通（rare/power）：获得 4 层破势预热。

```
Premium collectible card art of a hooded dark-armored void warrior in a ritual stance with persistent aura, arms spread in a passive empowerment ritual, less motion, more enduring status, primary card mechanic visualized as coiled unstable energy charge, compressed explosive aura about to burst, persistent aura halo and ascending energy motes surrounding the figure, sanctified temple ruins bathed in cyan ward-light, steel-blue barrier glyphs floating above cracked stone, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, slightly low angle emphasizing power, bold saturated cool cyan and steel-blue protective energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `guard_rare_skill_1.webp` — 铁壁防御（rare/skill）：获得 20 点格挡。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, drawing inward with controlled breath and ward rings, effect readable and not a boss transformation, primary card mechanic visualized as translucent protective ward, cyan shield arcs, barrier wrapping around armor, concentrated magical effect radiating from hands with sharp readable glow, sanctified temple ruins bathed in cyan ward-light, steel-blue barrier glyphs floating above cracked stone, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, diagonal composition with the void spire behind one shoulder, bold saturated cool cyan and steel-blue protective energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `guard_rare_skill_2.webp` — 稳势防御（rare/skill）：获得 12 点格挡，获得 3 层稳势。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, drawing inward with controlled breath and ward rings, effect readable and not a boss transformation, primary card mechanic visualized as translucent protective ward, cyan shield arcs, barrier wrapping around armor, braced stance, grounded posture, layered stable ward rings, concentrated magical effect radiating from hands with sharp readable glow, sanctified temple ruins bathed in cyan ward-light, steel-blue barrier glyphs floating above cracked stone, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, three-quarter view from the right, bold saturated cool cyan and steel-blue protective energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `guard_rare_skill_3.webp` — 金属化防御（rare/skill）：获得 10 点格挡，获得 4 层金属化。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, drawing inward with controlled breath and ward rings, effect readable and not a boss transformation, primary card mechanic visualized as translucent protective ward, cyan shield arcs, barrier wrapping around armor, dark metallic plating spreading across arms and shoulders, armor hardening, steel sheen, concentrated magical effect radiating from hands with sharp readable glow, sanctified temple ruins bathed in cyan ward-light, steel-blue barrier glyphs floating above cracked stone, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, three-quarter view from the right, bold saturated cool cyan and steel-blue protective energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `guard_rare_skill_4.webp` — 势能壁垒（rare/skill）：获得 8 点格挡，获得 5 层连势。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, extending both hands to shape a protective barrier, effect readable and not a boss transformation, primary card mechanic visualized as translucent protective ward, cyan shield arcs, barrier wrapping around armor, spiraling momentum streams, flowing energy trails around the body, concentrated magical effect radiating from hands with sharp readable glow, sanctified temple ruins bathed in cyan ward-light, steel-blue barrier glyphs floating above cracked stone, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, centered frontal view, bold saturated cool cyan and steel-blue protective energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `guard_rare_skill_5.webp` — 坚守阵地（rare/skill）：获得 15 点格挡，抽 2 张牌。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, planting feet wide while channeling a ward, effect readable and not a boss transformation, primary card mechanic visualized as translucent protective ward, cyan shield arcs, barrier wrapping around armor, spectral cards and scrolls flowing toward the hand, concentrated magical effect radiating from hands with sharp readable glow, sanctified temple ruins bathed in cyan ward-light, steel-blue barrier glyphs floating above cracked stone, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, slightly elevated view, bold saturated cool cyan and steel-blue protective energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `patience_stance.webp` — 耐心（rare/power）：能力（Patience）：每回合结束时，若你本回合未打出攻击，获得 1 层力量。

```
Premium collectible card art of a hooded dark-armored void warrior in a ritual stance with persistent aura, head bowed while a persistent aura wraps the body, less motion, more enduring status, primary card mechanic visualized as meditative stillness slowly gathering inner strength between strikes, persistent aura halo and ascending energy motes surrounding the figure, sanctified temple ruins bathed in cyan ward-light, steel-blue barrier glyphs floating above cracked stone, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, slightly low angle emphasizing power, bold saturated cool cyan and steel-blue protective energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `anchor_slash.webp` — 定锋（uncommon/attack）：造成 6 点伤害，获得 4 点格挡，并获得 1 层稳势。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, driving a downward crushing blow with impact sparks, weapon strike or energy impact clearly visible, primary card mechanic visualized as single decisive heavy strike with visible impact, translucent protective ward, cyan shield arcs, barrier wrapping around armor, braced stance, grounded posture, layered stable ward rings, explosive impact flash and weapon trail cutting through the frame, sanctified temple ruins bathed in cyan ward-light, steel-blue barrier glyphs floating above cracked stone, distinct collectible card illustration, clear magical focal point, stronger color contrast and environmental storytelling, three-quarter view from the left, bold saturated cool cyan and steel-blue protective energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `anchored_breath.webp` — 定息（uncommon/skill）：获得 5 点格挡，并获得 1 层金属化与 1 层稳势。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, kneeling slightly while reinforcing armor with energy, effect readable and not a boss transformation, primary card mechanic visualized as translucent protective ward, cyan shield arcs, barrier wrapping around armor, dark metallic plating spreading across arms and shoulders, armor hardening, steel sheen, braced stance, grounded posture, layered stable ward rings, concentrated magical effect radiating from hands with sharp readable glow, sanctified temple ruins bathed in cyan ward-light, steel-blue barrier glyphs floating above cracked stone, distinct collectible card illustration, clear magical focal point, stronger color contrast and environmental storytelling, slightly low angle emphasizing power, bold saturated cool cyan and steel-blue protective energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `guard_vigil_banner.webp` — 守势旗帜（uncommon/skill）：获得 7 点格挡。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, turning sideways with shield arm forward, effect readable and not a boss transformation, primary card mechanic visualized as translucent protective ward, cyan shield arcs, barrier wrapping around armor, concentrated magical effect radiating from hands with sharp readable glow, sanctified temple ruins bathed in cyan ward-light, steel-blue barrier glyphs floating above cracked stone, distinct collectible card illustration, clear magical focal point, stronger color contrast and environmental storytelling, three-quarter view from the right, bold saturated cool cyan and steel-blue protective energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `patient_cut.webp` — 缓收（uncommon/attack）：造成 6 点伤害。获得等同当前连势层数的格挡，不消耗连势。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, spinning into a slashing follow-through, weapon strike or energy impact clearly visible, primary card mechanic visualized as single decisive heavy strike with visible impact, translucent protective ward forming as momentum energy weaves into barrier arcs, explosive impact flash and weapon trail cutting through the frame, sanctified temple ruins bathed in cyan ward-light, steel-blue barrier glyphs floating above cracked stone, distinct collectible card illustration, clear magical focal point, stronger color contrast and environmental storytelling, three-quarter view from the right, bold saturated cool cyan and steel-blue protective energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `stable_mind.webp` — 定心（uncommon/skill）：获得 7 点格挡。若本回合未主动消耗连势，再抽 1 张牌并获得 1 层连势。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, turning sideways with shield arm forward, effect readable and not a boss transformation, primary card mechanic visualized as translucent protective ward, cyan shield arcs, barrier wrapping around armor, spectral cards drifting inward while momentum rings hold steady around the body, concentrated magical effect radiating from hands with sharp readable glow, sanctified temple ruins bathed in cyan ward-light, steel-blue barrier glyphs floating above cracked stone, distinct collectible card illustration, clear magical focal point, stronger color contrast and environmental storytelling, diagonal composition with the void spire behind one shoulder, bold saturated cool cyan and steel-blue protective energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `brace_rhythm.webp` — 稳架（common/skill）：获得 5 点格挡，并获得 2 层连势。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, turning sideways with shield arm forward, effect readable and not a boss transformation, primary card mechanic visualized as translucent protective ward, cyan shield arcs, barrier wrapping around armor, spiraling momentum streams, flowing energy trails around the body, concentrated magical effect radiating from hands with sharp readable glow, sanctified temple ruins bathed in cyan ward-light, steel-blue barrier glyphs floating above cracked stone, signature card art with one bold readable magical effect, restrained but vivid color accents, not generic placeholder art, diagonal composition with the void spire behind one shoulder, bold saturated cool cyan and steel-blue protective energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `guard_strike.webp` — 护锋（common/attack）：造成 6 点伤害，获得 4 点格挡。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, thrusting a spear or blade in a three-quarter turn, weapon strike or energy impact clearly visible, primary card mechanic visualized as single decisive heavy strike with visible impact, translucent protective ward, cyan shield arcs, barrier wrapping around armor, explosive impact flash and weapon trail cutting through the frame, sanctified temple ruins bathed in cyan ward-light, steel-blue barrier glyphs floating above cracked stone, signature card art with one bold readable magical effect, restrained but vivid color accents, not generic placeholder art, three-quarter view from the right, bold saturated cool cyan and steel-blue protective energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `held_breath.webp` — 屏息（common/skill）：获得 6 点格挡。获得 1 层稳势。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, raising one arm in a focused defensive gesture, effect readable and not a boss transformation, primary card mechanic visualized as translucent protective ward, cyan shield arcs, barrier wrapping around armor, braced stance, grounded posture, layered stable ward rings, concentrated magical effect radiating from hands with sharp readable glow, sanctified temple ruins bathed in cyan ward-light, steel-blue barrier glyphs floating above cracked stone, signature card art with one bold readable magical effect, restrained but vivid color accents, not generic placeholder art, three-quarter view from the left, bold saturated cool cyan and steel-blue protective energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `soft_step.webp` — 垫步（common/skill）：获得 3 点格挡，并获得 1 层连势。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, planting feet wide while channeling a ward, effect readable and not a boss transformation, primary card mechanic visualized as translucent protective ward, cyan shield arcs, barrier wrapping around armor, spiraling momentum streams, flowing energy trails around the body, concentrated magical effect radiating from hands with sharp readable glow, sanctified temple ruins bathed in cyan ward-light, steel-blue barrier glyphs floating above cracked stone, signature card art with one bold readable magical effect, restrained but vivid color accents, not generic placeholder art, three-quarter view from the right, bold saturated cool cyan and steel-blue protective energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

### burst（45）

- `burst_legendary_1.webp` — 能量湮灭（legendary/attack）：消耗所有能量，每点造成 18 点伤害。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, thrusting a spear or blade in a three-quarter turn, weapon strike or energy impact clearly visible, primary card mechanic visualized as radiant energy core in the palm flaring into a devastating crimson annihilation beam, explosive impact flash and weapon trail cutting through the frame, ember storm erupting around the warrior, molten sparks and heat distortion filling the air, mythic showcase card art, epic environmental magic, powerful layered effects, legendary presence without visual clutter, diagonal composition with the void spire behind one shoulder, bold saturated fiery crimson and molten-orange embers accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `burst_legendary_2.webp` — 连势风暴（legendary/attack）：消耗所有连势，每层造成 5 点伤害。消耗所有破势预热，每层造成 8 点伤害。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, driving a downward crushing blow with impact sparks, weapon strike or energy impact clearly visible, primary card mechanic visualized as unleashing spiraling momentum streams into a violent energy impact, coiled explosive aura erupting into a concentrated blast on impact, explosive impact flash and weapon trail cutting through the frame, ember storm erupting around the warrior, molten sparks and heat distortion filling the air, mythic showcase card art, epic environmental magic, powerful layered effects, legendary presence without visual clutter, diagonal composition with the void spire behind one shoulder, bold saturated fiery crimson and molten-orange embers accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `burst_legendary_3.webp` — 破甲重击（legendary/attack）：消耗 5 点格挡，造成 35 点伤害。消耗。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, thrusting a spear or blade in a three-quarter turn, weapon strike or energy impact clearly visible, primary card mechanic visualized as shattering a translucent ward to fuel a heavy armor-breaking strike, explosive impact flash and weapon trail cutting through the frame, ember storm erupting around the warrior, molten sparks and heat distortion filling the air, mythic showcase card art, epic environmental magic, powerful layered effects, legendary presence without visual clutter, slightly low angle emphasizing power, bold saturated fiery crimson and molten-orange embers accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `burst_legendary_4.webp` — 破势洪流（legendary/attack）：消耗所有破势预热，每层造成 6 点伤害并抽 1 张牌。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, hammering an energy-charged punch with gauntleted fist, weapon strike or energy impact clearly visible, primary card mechanic visualized as coiled explosive aura erupting into a concentrated blast on impact, spectral cards and scrolls flowing toward the hand, explosive impact flash and weapon trail cutting through the frame, ember storm erupting around the warrior, molten sparks and heat distortion filling the air, mythic showcase card art, epic environmental magic, powerful layered effects, legendary presence without visual clutter, diagonal composition with the void spire behind one shoulder, bold saturated fiery crimson and molten-orange embers accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `burst_legendary_5.webp` — 连势狂潮（legendary/attack）：消耗所有连势，每层造成 3 点伤害并抽 1 张牌。获得 2 点能量。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, delivering a sweeping blade arc with energy trailing the weapon, weapon strike or energy impact clearly visible, primary card mechanic visualized as spectral cards and scrolls flowing toward the hand as momentum streams dissolve, radiant energy core flaring in the palm or chest, explosive impact flash and weapon trail cutting through the frame, ember storm erupting around the warrior, molten sparks and heat distortion filling the air, mythic showcase card art, epic environmental magic, powerful layered effects, legendary presence without visual clutter, centered frontal view, bold saturated fiery crimson and molten-orange embers accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `burst_legendary_6.webp` — 连锁爆破（legendary/attack）：消耗所有连势，每层造成 5 点伤害，消耗后抽 1 张牌。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, delivering a sweeping blade arc with energy trailing the weapon, weapon strike or energy impact clearly visible, primary card mechanic visualized as unleashing spiraling momentum streams into a violent energy impact, spectral cards and scrolls flowing toward the hand as momentum streams dissolve, explosive impact flash and weapon trail cutting through the frame, ember storm erupting around the warrior, molten sparks and heat distortion filling the air, mythic showcase card art, epic environmental magic, powerful layered effects, legendary presence without visual clutter, slightly elevated view, bold saturated fiery crimson and molten-orange embers accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `blood_rush.webp` — 血怒（rare/attack）：造成 6 点伤害。若你本回合已消耗过牌，改为造成 16 点伤害。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, hammering an energy-charged punch with gauntleted fist, weapon strike or energy impact clearly visible, primary card mechanic visualized as fierce crimson strike intensifying as if fueled by spent cards this turn, explosive impact flash and weapon trail cutting through the frame, ember storm erupting around the warrior, molten sparks and heat distortion filling the air, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, three-quarter view from the left, bold saturated fiery crimson and molten-orange embers accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `br_b_burst_master.webp` — 爆发大师（rare/power）：获得 4 层破势预热和 4 层连势。

```
Premium collectible card art of a hooded dark-armored void warrior in a ritual stance with persistent aura, standing in a ritual stance with enduring aura, less motion, more enduring status, primary card mechanic visualized as coiled unstable energy charge, compressed explosive aura about to burst, spiraling momentum streams, flowing energy trails around the body, persistent aura halo and ascending energy motes surrounding the figure, ember storm erupting around the warrior, molten sparks and heat distortion filling the air, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, slightly elevated view, bold saturated fiery crimson and molten-orange embers accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `br_b_energy_annihilation.webp` — 能量湮灭（rare/attack）：造成 40 点伤害。消耗所有能量。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, lunging forward with a visible weapon strike, weapon strike or energy impact clearly visible, primary card mechanic visualized as radiant energy core in the palm flaring into a devastating crimson annihilation beam, explosive impact flash and weapon trail cutting through the frame, ember storm erupting around the warrior, molten sparks and heat distortion filling the air, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, slightly low angle emphasizing power, bold saturated fiery crimson and molten-orange embers accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `br_b_energy_master.webp` — 能量大师（rare/skill）：获得 4 点能量。消耗 5 层连势。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, planting feet wide while channeling a ward, effect readable and not a boss transformation, primary card mechanic visualized as radiant energy core flaring in the palm or chest, unleashing spiraling momentum streams into a violent energy impact, concentrated magical effect radiating from hands with sharp readable glow, ember storm erupting around the warrior, molten sparks and heat distortion filling the air, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, centered frontal view, bold saturated fiery crimson and molten-orange embers accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `br_b_final_rupture.webp` — 终结裂变（rare/attack）：造成 30 点伤害。消耗所有连势和破势预热，每层造成额外 5 点伤害。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, thrusting a spear or blade in a three-quarter turn, weapon strike or energy impact clearly visible, primary card mechanic visualized as unleashing spiraling momentum streams into a violent energy impact, explosive impact flash and weapon trail cutting through the frame, ember storm erupting around the warrior, molten sparks and heat distortion filling the air, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, diagonal composition with the void spire behind one shoulder, bold saturated fiery crimson and molten-orange embers accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `br_b_momentum_fortify_r.webp` — 连势精通·极（rare/power）：获得 6 层连势。

```
Premium collectible card art of a hooded dark-armored void warrior in a ritual stance with persistent aura, palms open as a slow-burning aura settles on armor, less motion, more enduring status, primary card mechanic visualized as spiraling momentum streams, flowing energy trails around the body, persistent aura halo and ascending energy motes surrounding the figure, ember storm erupting around the warrior, molten sparks and heat distortion filling the air, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, diagonal composition with the void spire behind one shoulder, bold saturated fiery crimson and molten-orange embers accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `br_b_momentum_master.webp` — 连势大师（rare/skill）：获得 8 层连势。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, kneeling slightly while reinforcing armor with energy, effect readable and not a boss transformation, primary card mechanic visualized as spiraling momentum streams, flowing energy trails around the body, concentrated magical effect radiating from hands with sharp readable glow, ember storm erupting around the warrior, molten sparks and heat distortion filling the air, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, three-quarter view from the right, bold saturated fiery crimson and molten-orange embers accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `br_b_momentum_master_p.webp` — 连势大师·极（rare/power）：获得 5 层连势和 2 层力量。

```
Premium collectible card art of a hooded dark-armored void warrior in a ritual stance with persistent aura, arms spread in a passive empowerment ritual, less motion, more enduring status, primary card mechanic visualized as spiraling momentum streams, flowing energy trails around the body, crimson runes glowing on arms and weapon, empowered posture, persistent aura halo and ascending energy motes surrounding the figure, ember storm erupting around the warrior, molten sparks and heat distortion filling the air, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, diagonal composition with the void spire behind one shoulder, bold saturated fiery crimson and molten-orange embers accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `br_b_momentum_slash_r.webp` — 连势裂斩（rare/attack）：造成 14 点伤害两次。消耗 5 层连势。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, hammering an energy-charged punch with gauntleted fist, weapon strike or energy impact clearly visible, primary card mechanic visualized as unleashing spiraling momentum streams into a violent energy impact, explosive impact flash and weapon trail cutting through the frame, ember storm erupting around the warrior, molten sparks and heat distortion filling the air, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, three-quarter view from the left, bold saturated fiery crimson and molten-orange embers accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `br_b_momentum_storm.webp` — 连势风暴（rare/attack）：造成 8 点伤害五次。消耗 5 层连势。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, lunging forward with a visible weapon strike, weapon strike or energy impact clearly visible, primary card mechanic visualized as unleashing spiraling momentum streams into a violent energy impact, explosive impact flash and weapon trail cutting through the frame, ember storm erupting around the warrior, molten sparks and heat distortion filling the air, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, diagonal composition with the void spire behind one shoulder, bold saturated fiery crimson and molten-orange embers accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `br_b_power_master.webp` — 力量奥义（rare/power）：获得 3 层力量。

```
Premium collectible card art of a hooded dark-armored void warrior in a ritual stance with persistent aura, rooted posture with a steady glow across shoulders, less motion, more enduring status, primary card mechanic visualized as crimson runes glowing on arms and weapon, empowered posture, persistent aura halo and ascending energy motes surrounding the figure, ember storm erupting around the warrior, molten sparks and heat distortion filling the air, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, three-quarter view from the right, bold saturated fiery crimson and molten-orange embers accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `br_b_primed_devastate.webp` — 预热毁灭（rare/attack）：造成 35 点伤害。消耗 8 层连势。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, delivering a sweeping blade arc with energy trailing the weapon, weapon strike or energy impact clearly visible, primary card mechanic visualized as unleashing spiraling momentum streams into a violent energy impact, explosive impact flash and weapon trail cutting through the frame, ember storm erupting around the warrior, molten sparks and heat distortion filling the air, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, slightly elevated view, bold saturated fiery crimson and molten-orange embers accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `br_b_primed_draw_r.webp` — 破势过牌·极（rare/skill）：抽 5 张牌。消耗 4 层连势。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, planting feet wide while channeling a ward, effect readable and not a boss transformation, primary card mechanic visualized as spectral cards and scrolls flowing toward the hand as momentum streams dissolve, concentrated magical effect radiating from hands with sharp readable glow, ember storm erupting around the warrior, molten sparks and heat distortion filling the air, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, diagonal composition with the void spire behind one shoulder, bold saturated fiery crimson and molten-orange embers accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `br_b_primed_fortify_r.webp` — 破势精通·极（rare/power）：获得 6 层破势预热。

```
Premium collectible card art of a hooded dark-armored void warrior in a ritual stance with persistent aura, head bowed while a persistent aura wraps the body, less motion, more enduring status, primary card mechanic visualized as coiled unstable energy charge, compressed explosive aura about to burst, persistent aura halo and ascending energy motes surrounding the figure, ember storm erupting around the warrior, molten sparks and heat distortion filling the air, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, three-quarter view from the left, bold saturated fiery crimson and molten-orange embers accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `br_b_primed_master.webp` — 破势大师（rare/skill）：获得 5 层破势预热。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, planting feet wide while channeling a ward, effect readable and not a boss transformation, primary card mechanic visualized as coiled unstable energy charge, compressed explosive aura about to burst, concentrated magical effect radiating from hands with sharp readable glow, ember storm erupting around the warrior, molten sparks and heat distortion filling the air, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, three-quarter view from the right, bold saturated fiery crimson and molten-orange embers accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `br_b_triple_rupture.webp` — 三重裂变（rare/attack）：造成 10 点伤害三次。消耗 6 层连势。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, spinning into a slashing follow-through, weapon strike or energy impact clearly visible, primary card mechanic visualized as unleashing spiraling momentum streams into a violent energy impact, explosive impact flash and weapon trail cutting through the frame, ember storm erupting around the warrior, molten sparks and heat distortion filling the air, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, slightly low angle emphasizing power, bold saturated fiery crimson and molten-orange embers accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `burst_rare_atk_1.webp` — 破势终结（rare/attack）：造成 30 点伤害。消耗所有连势和破势预热，每层造成额外 5 点伤害。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, driving a downward crushing blow with impact sparks, weapon strike or energy impact clearly visible, primary card mechanic visualized as unleashing spiraling momentum streams into a violent energy impact, explosive impact flash and weapon trail cutting through the frame, ember storm erupting around the warrior, molten sparks and heat distortion filling the air, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, three-quarter view from the left, bold saturated fiery crimson and molten-orange embers accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `burst_rare_atk_2.webp` — 连势风暴（rare/attack）：造成 8 点伤害五次。消耗 5 层连势。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, lunging forward with a visible weapon strike, weapon strike or energy impact clearly visible, primary card mechanic visualized as 5 rapid momentum-fueled strikes each trailing spiraling energy streams, explosive impact flash and weapon trail cutting through the frame, ember storm erupting around the warrior, molten sparks and heat distortion filling the air, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, diagonal composition with the void spire behind one shoulder, bold saturated fiery crimson and molten-orange embers accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `burst_rare_atk_3.webp` — 破势猛击（rare/attack）：造成 35 点伤害。消耗 8 层连势。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, thrusting a spear or blade in a three-quarter turn, weapon strike or energy impact clearly visible, primary card mechanic visualized as unleashing spiraling momentum streams into a violent energy impact, explosive impact flash and weapon trail cutting through the frame, ember storm erupting around the warrior, molten sparks and heat distortion filling the air, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, diagonal composition with the void spire behind one shoulder, bold saturated fiery crimson and molten-orange embers accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `burst_rare_atk_4.webp` — 爆发终结（rare/attack）：造成 40 点伤害。消耗所有能量。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, lunging forward with a visible weapon strike, weapon strike or energy impact clearly visible, primary card mechanic visualized as radiant energy core in the palm flaring into a devastating crimson annihilation beam, explosive impact flash and weapon trail cutting through the frame, ember storm erupting around the warrior, molten sparks and heat distortion filling the air, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, slightly elevated view, bold saturated fiery crimson and molten-orange embers accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `burst_rare_atk_5.webp` — 破势连击（rare/attack）：造成 10 点伤害三次。消耗 6 层连势。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, thrusting a spear or blade in a three-quarter turn, weapon strike or energy impact clearly visible, primary card mechanic visualized as 3 rapid momentum-fueled strikes each trailing spiraling energy streams, explosive impact flash and weapon trail cutting through the frame, ember storm erupting around the warrior, molten sparks and heat distortion filling the air, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, three-quarter view from the left, bold saturated fiery crimson and molten-orange embers accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `burst_rare_power_1.webp` — 破势精通（rare/power）：获得 6 层破势预热。

```
Premium collectible card art of a hooded dark-armored void warrior in a ritual stance with persistent aura, arms spread in a passive empowerment ritual, less motion, more enduring status, primary card mechanic visualized as coiled unstable energy charge, compressed explosive aura about to burst, persistent aura halo and ascending energy motes surrounding the figure, ember storm erupting around the warrior, molten sparks and heat distortion filling the air, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, slightly elevated view, bold saturated fiery crimson and molten-orange embers accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `burst_rare_power_2.webp` — 连势精通（rare/power）：获得 6 层连势。

```
Premium collectible card art of a hooded dark-armored void warrior in a ritual stance with persistent aura, head bowed while a persistent aura wraps the body, less motion, more enduring status, primary card mechanic visualized as spiraling momentum streams, flowing energy trails around the body, persistent aura halo and ascending energy motes surrounding the figure, ember storm erupting around the warrior, molten sparks and heat distortion filling the air, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, three-quarter view from the left, bold saturated fiery crimson and molten-orange embers accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `burst_rare_power_3.webp` — 力量觉醒（rare/power）：获得 3 层力量。

```
Premium collectible card art of a hooded dark-armored void warrior in a ritual stance with persistent aura, head bowed while a persistent aura wraps the body, less motion, more enduring status, primary card mechanic visualized as crimson runes glowing on arms and weapon, empowered posture, persistent aura halo and ascending energy motes surrounding the figure, ember storm erupting around the warrior, molten sparks and heat distortion filling the air, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, slightly elevated view, bold saturated fiery crimson and molten-orange embers accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `burst_rare_power_4.webp` — 爆发大师（rare/power）：获得 4 层破势预热和 4 层连势。

```
Premium collectible card art of a hooded dark-armored void warrior in a ritual stance with persistent aura, standing in a ritual stance with enduring aura, less motion, more enduring status, primary card mechanic visualized as coiled unstable energy charge, compressed explosive aura about to burst, spiraling momentum streams, flowing energy trails around the body, persistent aura halo and ascending energy motes surrounding the figure, ember storm erupting around the warrior, molten sparks and heat distortion filling the air, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, slightly low angle emphasizing power, bold saturated fiery crimson and molten-orange embers accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `burst_rare_power_5.webp` — 连势大师（rare/power）：获得 5 层连势和 2 层力量。

```
Premium collectible card art of a hooded dark-armored void warrior in a ritual stance with persistent aura, palms open as a slow-burning aura settles on armor, less motion, more enduring status, primary card mechanic visualized as spiraling momentum streams, flowing energy trails around the body, crimson runes glowing on arms and weapon, empowered posture, persistent aura halo and ascending energy motes surrounding the figure, ember storm erupting around the warrior, molten sparks and heat distortion filling the air, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, centered frontal view, bold saturated fiery crimson and molten-orange embers accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `burst_rare_skill_1.webp` — 破势大师（rare/skill）：获得 5 层破势预热。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, drawing inward with controlled breath and ward rings, effect readable and not a boss transformation, primary card mechanic visualized as coiled unstable energy charge, compressed explosive aura about to burst, concentrated magical effect radiating from hands with sharp readable glow, ember storm erupting around the warrior, molten sparks and heat distortion filling the air, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, centered frontal view, bold saturated fiery crimson and molten-orange embers accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `burst_rare_skill_2.webp` — 连势大师（rare/skill）：获得 8 层连势。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, kneeling slightly while reinforcing armor with energy, effect readable and not a boss transformation, primary card mechanic visualized as spiraling momentum streams, flowing energy trails around the body, concentrated magical effect radiating from hands with sharp readable glow, ember storm erupting around the warrior, molten sparks and heat distortion filling the air, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, three-quarter view from the right, bold saturated fiery crimson and molten-orange embers accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `burst_rare_skill_3.webp` — 破势过牌（rare/skill）：抽 5 张牌。消耗 4 层连势。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, extending both hands to shape a protective barrier, effect readable and not a boss transformation, primary card mechanic visualized as spectral cards and scrolls flowing toward the hand as momentum streams dissolve, concentrated magical effect radiating from hands with sharp readable glow, ember storm erupting around the warrior, molten sparks and heat distortion filling the air, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, three-quarter view from the right, bold saturated fiery crimson and molten-orange embers accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `burst_rare_skill_4.webp` — 连势能量（rare/skill）：获得 4 点能量。消耗 5 层连势。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, extending both hands to shape a protective barrier, effect readable and not a boss transformation, primary card mechanic visualized as momentum streams funneling into a radiant energy core flaring in the chest, concentrated magical effect radiating from hands with sharp readable glow, ember storm erupting around the warrior, molten sparks and heat distortion filling the air, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, diagonal composition with the void spire behind one shoulder, bold saturated fiery crimson and molten-orange embers accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `burst_rare_skill_5.webp` — 破势防御（rare/skill）：获得 15 点格挡。消耗 3 层连势。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, drawing inward with controlled breath and ward rings, effect readable and not a boss transformation, primary card mechanic visualized as momentum streams folding into translucent protective ward wrapping around armor, concentrated magical effect radiating from hands with sharp readable glow, ember storm erupting around the warrior, molten sparks and heat distortion filling the air, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, three-quarter view from the left, bold saturated fiery crimson and molten-orange embers accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `full_release.webp` — 断流（rare/attack）：造成 6 点伤害，并消耗全部连势，每层额外造成 3 点伤害。抽 1 张牌。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, lunging forward with a visible weapon strike, weapon strike or energy impact clearly visible, primary card mechanic visualized as unleashing spiraling momentum streams into a violent energy impact, spectral cards and scrolls flowing toward the hand, explosive impact flash and weapon trail cutting through the frame, ember storm erupting around the warrior, molten sparks and heat distortion filling the air, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, diagonal composition with the void spire behind one shoulder, bold saturated fiery crimson and molten-orange embers accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `overload.webp` — 过载（rare/skill）：消耗你手中所有攻击牌。每消耗一张，对一名随机敌人造成 8 点伤害。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, turning sideways with shield arm forward, effect readable and not a boss transformation, primary card mechanic visualized as hand igniting with discarded attack energy erupting as scattered crimson bolts, concentrated magical effect radiating from hands with sharp readable glow, ember storm erupting around the warrior, molten sparks and heat distortion filling the air, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, centered frontal view, bold saturated fiery crimson and molten-orange embers accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `burst_signal_banner.webp` — 爆发旗帜（uncommon/attack）：造成 7 点伤害。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, hammering an energy-charged punch with gauntleted fist, weapon strike or energy impact clearly visible, primary card mechanic visualized as single decisive heavy strike with visible impact, explosive impact flash and weapon trail cutting through the frame, ember storm erupting around the warrior, molten sparks and heat distortion filling the air, distinct collectible card illustration, clear magical focal point, stronger color contrast and environmental storytelling, slightly elevated view, bold saturated fiery crimson and molten-orange embers accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `burst_strike.webp` — 破势击（uncommon/attack）：造成 4 点伤害，并消耗全部连势，每层额外造成 3 点伤害。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, hammering an energy-charged punch with gauntleted fist, weapon strike or energy impact clearly visible, primary card mechanic visualized as unleashing spiraling momentum streams into a violent energy impact, explosive impact flash and weapon trail cutting through the frame, ember storm erupting around the warrior, molten sparks and heat distortion filling the air, distinct collectible card illustration, clear magical focal point, stronger color contrast and environmental storytelling, centered frontal view, bold saturated fiery crimson and molten-orange embers accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `follow_through.webp` — 追击（uncommon/attack）：造成 4 点伤害，并消耗至多 2 层连势，每层额外造成 3 点伤害。若实际消耗了连势，获得 1 点能量。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, spinning into a slashing follow-through, weapon strike or energy impact clearly visible, primary card mechanic visualized as unleashing spiraling momentum streams into a violent energy impact, explosive impact flash and weapon trail cutting through the frame, ember storm erupting around the warrior, molten sparks and heat distortion filling the air, distinct collectible card illustration, clear magical focal point, stronger color contrast and environmental storytelling, slightly elevated view, bold saturated fiery crimson and molten-orange embers accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `snap_strike.webp` — 断势击（uncommon/attack）：造成 5 点伤害，并消耗至多 2 层连势，每层额外造成 4 点伤害。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, thrusting a spear or blade in a three-quarter turn, weapon strike or energy impact clearly visible, primary card mechanic visualized as unleashing spiraling momentum streams into a violent energy impact, explosive impact flash and weapon trail cutting through the frame, ember storm erupting around the warrior, molten sparks and heat distortion filling the air, distinct collectible card illustration, clear magical focal point, stronger color contrast and environmental storytelling, slightly elevated view, bold saturated fiery crimson and molten-orange embers accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `break_opening.webp` — 压锋（common/skill）：获得 2 层连势。获得 1 层破势预热。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, planting feet wide while channeling a ward, effect readable and not a boss transformation, primary card mechanic visualized as spiraling momentum streams, flowing energy trails around the body, coiled unstable energy charge, compressed explosive aura about to burst, concentrated magical effect radiating from hands with sharp readable glow, ember storm erupting around the warrior, molten sparks and heat distortion filling the air, signature card art with one bold readable magical effect, restrained but vivid color accents, not generic placeholder art, three-quarter view from the right, bold saturated fiery crimson and molten-orange embers accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `quick_release.webp` — 疾放（common/attack）：造成 3 点伤害，并消耗至多 1 层连势，每层额外造成 5 点伤害。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, delivering a sweeping blade arc with energy trailing the weapon, weapon strike or energy impact clearly visible, primary card mechanic visualized as unleashing spiraling momentum streams into a violent energy impact, explosive impact flash and weapon trail cutting through the frame, ember storm erupting around the warrior, molten sparks and heat distortion filling the air, signature card art with one bold readable magical effect, restrained but vivid color accents, not generic placeholder art, slightly elevated view, bold saturated fiery crimson and molten-orange embers accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

### mixed（33）

- `mixed_legendary_1.webp` — 连势转化（legendary/skill）：消耗 3 层连势，获得 3 点能量。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, extending both hands to shape a protective barrier, effect readable and not a boss transformation, primary card mechanic visualized as momentum streams funneling into a radiant energy core flaring in the chest, concentrated magical effect radiating from hands with sharp readable glow, clashing void currents of violet and magenta swirling through shattered archways, mythic showcase card art, epic environmental magic, powerful layered effects, legendary presence without visual clutter, slightly low angle emphasizing power, bold saturated violet and magenta void energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `mixed_legendary_2.webp` — 金属风暴（legendary/attack）：造成等同于你金属化层数 2 倍的伤害，然后获得等同于金属化层数的格挡。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, lunging forward with a visible weapon strike, weapon strike or energy impact clearly visible, primary card mechanic visualized as dark metallic plating spreading then reflecting into a steel ward barrier after the strike, explosive impact flash and weapon trail cutting through the frame, clashing void currents of violet and magenta swirling through shattered archways, mythic showcase card art, epic environmental magic, powerful layered effects, legendary presence without visual clutter, three-quarter view from the right, bold saturated violet and magenta void energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `mixed_legendary_3.webp` — 攻守兼备（legendary/attack）：造成 8 点伤害。若你有格挡，额外造成 15 点伤害。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, lunging forward with a visible weapon strike, weapon strike or energy impact clearly visible, primary card mechanic visualized as strike empowered by a glowing ward shell still wrapped around the warrior, explosive impact flash and weapon trail cutting through the frame, clashing void currents of violet and magenta swirling through shattered archways, mythic showcase card art, epic environmental magic, powerful layered effects, legendary presence without visual clutter, three-quarter view from the right, bold saturated violet and magenta void energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `mixed_legendary_4.webp` — 双势合一（legendary/skill）：获得 3 层连势和 3 层金属化。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, drawing inward with controlled breath and ward rings, effect readable and not a boss transformation, primary card mechanic visualized as spiraling momentum streams, flowing energy trails around the body, dark metallic plating spreading across arms and shoulders, armor hardening, steel sheen, concentrated magical effect radiating from hands with sharp readable glow, clashing void currents of violet and magenta swirling through shattered archways, mythic showcase card art, epic environmental magic, powerful layered effects, legendary presence without visual clutter, slightly elevated view, bold saturated violet and magenta void energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `mixed_legendary_5.webp` — 势能爆发（legendary/attack）：消耗所有连势，每层造成 4 点伤害。获得 2 层力量。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, thrusting a spear or blade in a three-quarter turn, weapon strike or energy impact clearly visible, primary card mechanic visualized as unleashing spiraling momentum streams into a violent energy impact, crimson runes glowing on arms and weapon, empowered posture, explosive impact flash and weapon trail cutting through the frame, clashing void currents of violet and magenta swirling through shattered archways, mythic showcase card art, epic environmental magic, powerful layered effects, legendary presence without visual clutter, slightly low angle emphasizing power, bold saturated violet and magenta void energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `mixed_legendary_6.webp` — 双生风暴（legendary/attack）：造成 8 点伤害并获得 8 点格挡，重复 2 次。消耗。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, spinning into a slashing follow-through, weapon strike or energy impact clearly visible, primary card mechanic visualized as rapid alternating strikes each leaving a brief cyan shield arc in its wake, explosive impact flash and weapon trail cutting through the frame, clashing void currents of violet and magenta swirling through shattered archways, mythic showcase card art, epic environmental magic, powerful layered effects, legendary presence without visual clutter, three-quarter view from the left, bold saturated violet and magenta void energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `balance_edge.webp` — 均衡刃（rare/attack）：造成 8 点伤害。若你本回合获得过格挡，额外造成 8 点伤害。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, spinning into a slashing follow-through, weapon strike or energy impact clearly visible, primary card mechanic visualized as balanced strike where block energy and blade force meet at the edge of the weapon, explosive impact flash and weapon trail cutting through the frame, clashing void currents of violet and magenta swirling through shattered archways, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, three-quarter view from the right, bold saturated violet and magenta void energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `flow_shift.webp` — 流转（rare/skill）：若你上回合打出过攻击：获得 12 点格挡。否则：对一名随机敌人造成 12 点伤害。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, planting feet wide while channeling a ward, effect readable and not a boss transformation, primary card mechanic visualized as stance shifting between defensive ward and offensive blade in a single fluid motion, concentrated magical effect radiating from hands with sharp readable glow, clashing void currents of violet and magenta swirling through shattered archways, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, centered frontal view, bold saturated violet and magenta void energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `mixed_rare_atk_1.webp` — 攻防一体（rare/attack）：造成 15 点伤害，获得 10 点格挡。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, spinning into a slashing follow-through, weapon strike or energy impact clearly visible, primary card mechanic visualized as single decisive heavy strike with visible impact, translucent protective ward, cyan shield arcs, barrier wrapping around armor, explosive impact flash and weapon trail cutting through the frame, clashing void currents of violet and magenta swirling through shattered archways, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, slightly elevated view, bold saturated violet and magenta void energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `mixed_rare_atk_2.webp` — 条件爆发（rare/attack）：造成 10 点伤害。若你有格挡，造成额外 15 点伤害。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, thrusting a spear or blade in a three-quarter turn, weapon strike or energy impact clearly visible, primary card mechanic visualized as strike empowered by a glowing ward shell still wrapped around the warrior, explosive impact flash and weapon trail cutting through the frame, clashing void currents of violet and magenta swirling through shattered archways, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, centered frontal view, bold saturated violet and magenta void energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `mixed_rare_atk_3.webp` — 灵活连击（rare/attack）：造成 6 点伤害三次，获得 6 点格挡。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, thrusting a spear or blade in a three-quarter turn, weapon strike or energy impact clearly visible, primary card mechanic visualized as rapid multi-hit flurry with each impact clearly readable, translucent protective ward, cyan shield arcs, barrier wrapping around armor, explosive impact flash and weapon trail cutting through the frame, clashing void currents of violet and magenta swirling through shattered archways, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, slightly low angle emphasizing power, bold saturated violet and magenta void energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `mixed_rare_atk_4.webp` — 连势打击（rare/attack）：造成 8 点伤害。消耗 3 层连势，造成额外 12 点伤害。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, spinning into a slashing follow-through, weapon strike or energy impact clearly visible, primary card mechanic visualized as unleashing spiraling momentum streams into a violent energy impact, explosive impact flash and weapon trail cutting through the frame, clashing void currents of violet and magenta swirling through shattered archways, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, three-quarter view from the left, bold saturated violet and magenta void energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `mixed_rare_power_1.webp` — 连势大师（rare/power）：获得 6 层连势。

```
Premium collectible card art of a hooded dark-armored void warrior in a ritual stance with persistent aura, one knee grounded in a lasting power-up stance, less motion, more enduring status, primary card mechanic visualized as spiraling momentum streams, flowing energy trails around the body, persistent aura halo and ascending energy motes surrounding the figure, clashing void currents of violet and magenta swirling through shattered archways, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, centered frontal view, bold saturated violet and magenta void energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `mixed_rare_power_2.webp` — 金属化精通（rare/power）：获得 6 层金属化。

```
Premium collectible card art of a hooded dark-armored void warrior in a ritual stance with persistent aura, standing in a ritual stance with enduring aura, less motion, more enduring status, primary card mechanic visualized as dark metallic plating spreading across arms and shoulders, armor hardening, steel sheen, persistent aura halo and ascending energy motes surrounding the figure, clashing void currents of violet and magenta swirling through shattered archways, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, centered frontal view, bold saturated violet and magenta void energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `mixed_rare_power_3.webp` — 力量领悟（rare/power）：获得 3 层力量。

```
Premium collectible card art of a hooded dark-armored void warrior in a ritual stance with persistent aura, one knee grounded in a lasting power-up stance, less motion, more enduring status, primary card mechanic visualized as crimson runes glowing on arms and weapon, empowered posture, persistent aura halo and ascending energy motes surrounding the figure, clashing void currents of violet and magenta swirling through shattered archways, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, slightly low angle emphasizing power, bold saturated violet and magenta void energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `mixed_rare_skill_1.webp` — 灵活防御（rare/skill）：获得 12 点格挡，造成 5 点伤害。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, planting feet wide while channeling a ward, effect readable and not a boss transformation, primary card mechanic visualized as translucent protective ward, cyan shield arcs, barrier wrapping around armor, sweeping area strike with visible energy impact across multiple enemy silhouettes, concentrated magical effect radiating from hands with sharp readable glow, clashing void currents of violet and magenta swirling through shattered archways, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, slightly elevated view, bold saturated violet and magenta void energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `mixed_rare_skill_2.webp` — 势能壁垒（rare/skill）：获得 10 点格挡，获得 5 层连势。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, kneeling slightly while reinforcing armor with energy, effect readable and not a boss transformation, primary card mechanic visualized as translucent protective ward, cyan shield arcs, barrier wrapping around armor, spiraling momentum streams, flowing energy trails around the body, concentrated magical effect radiating from hands with sharp readable glow, clashing void currents of violet and magenta swirling through shattered archways, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, diagonal composition with the void spire behind one shoulder, bold saturated violet and magenta void energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `mixed_rare_skill_3.webp` — 灵活过牌（rare/skill）：抽 4 张牌，获得 6 点格挡。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, raising one arm in a focused defensive gesture, effect readable and not a boss transformation, primary card mechanic visualized as spectral cards and scrolls flowing toward the hand, translucent protective ward, cyan shield arcs, barrier wrapping around armor, concentrated magical effect radiating from hands with sharp readable glow, clashing void currents of violet and magenta swirling through shattered archways, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, slightly elevated view, bold saturated violet and magenta void energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `mx_a_absolute_break.webp` — 绝对破击（rare/attack）：造成 15 点伤害，施加 2 层易伤，获得 6 点格挡。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, thrusting a spear or blade in a three-quarter turn, weapon strike or energy impact clearly visible, primary card mechanic visualized as single decisive heavy strike with visible impact, enemy armor cracking with glowing red fissures, translucent protective ward, cyan shield arcs, barrier wrapping around armor, explosive impact flash and weapon trail cutting through the frame, clashing void currents of violet and magenta swirling through shattered archways, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, diagonal composition with the void spire behind one shoulder, bold saturated violet and magenta void energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `mx_a_adaptive_mastery.webp` — 适应精通（rare/skill）：获得 3 层力量，获得 3 层金属化。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, extending both hands to shape a protective barrier, effect readable and not a boss transformation, primary card mechanic visualized as crimson runes glowing on arms and weapon, empowered posture, dark metallic plating spreading across arms and shoulders, armor hardening, steel sheen, concentrated magical effect radiating from hands with sharp readable glow, clashing void currents of violet and magenta swirling through shattered archways, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, slightly low angle emphasizing power, bold saturated violet and magenta void energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `mx_a_balanced_harmony.webp` — 均衡和谐（rare/power）：获得 3 层力量，获得 3 层金属化。

```
Premium collectible card art of a hooded dark-armored void warrior in a ritual stance with persistent aura, one knee grounded in a lasting power-up stance, less motion, more enduring status, primary card mechanic visualized as crimson runes glowing on arms and weapon, empowered posture, dark metallic plating spreading across arms and shoulders, armor hardening, steel sheen, persistent aura halo and ascending energy motes surrounding the figure, clashing void currents of violet and magenta swirling through shattered archways, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, centered frontal view, bold saturated violet and magenta void energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `mx_a_fortified_momentum.webp` — 固守连势（rare/skill）：获得 10 点格挡，获得 4 层连势。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, raising one arm in a focused defensive gesture, effect readable and not a boss transformation, primary card mechanic visualized as translucent protective ward, cyan shield arcs, barrier wrapping around armor, spiraling momentum streams, flowing energy trails around the body, concentrated magical effect radiating from hands with sharp readable glow, clashing void currents of violet and magenta swirling through shattered archways, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, diagonal composition with the void spire behind one shoulder, bold saturated violet and magenta void energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `mx_a_iron_curtain.webp` — 铁幕降临（rare/skill）：获得 12 点格挡，获得 2 层金属化，抽 2 张牌。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, extending both hands to shape a protective barrier, effect readable and not a boss transformation, primary card mechanic visualized as translucent protective ward, cyan shield arcs, barrier wrapping around armor, dark metallic plating spreading across arms and shoulders, armor hardening, steel sheen, spectral cards and scrolls flowing toward the hand, concentrated magical effect radiating from hands with sharp readable glow, clashing void currents of violet and magenta swirling through shattered archways, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, three-quarter view from the right, bold saturated violet and magenta void energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `mx_a_momentum_ascension.webp` — 连势升腾（rare/power）：获得 4 层连势，获得 2 层金属化。

```
Premium collectible card art of a hooded dark-armored void warrior in a ritual stance with persistent aura, one knee grounded in a lasting power-up stance, less motion, more enduring status, primary card mechanic visualized as spiraling momentum streams, flowing energy trails around the body, dark metallic plating spreading across arms and shoulders, armor hardening, steel sheen, persistent aura halo and ascending energy motes surrounding the figure, clashing void currents of violet and magenta swirling through shattered archways, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, slightly low angle emphasizing power, bold saturated violet and magenta void energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `mx_a_momentum_crescendo.webp` — 连势渐强（rare/attack）：造成 5 点伤害两次。消耗 2 层连势，额外造成 5 点伤害。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, lunging forward with a visible weapon strike, weapon strike or energy impact clearly visible, primary card mechanic visualized as rapid multi-hit flurry with each impact clearly readable, unleashing spiraling momentum streams into a violent energy impact, explosive impact flash and weapon trail cutting through the frame, clashing void currents of violet and magenta swirling through shattered archways, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, diagonal composition with the void spire behind one shoulder, bold saturated violet and magenta void energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `mx_a_momentum_devastation.webp` — 连势毁灭（rare/attack）：造成 12 点伤害。消耗所有连势，每层额外造成 4 点伤害。抽 1 张牌。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, hammering an energy-charged punch with gauntleted fist, weapon strike or energy impact clearly visible, primary card mechanic visualized as unleashing spiraling momentum streams into a violent energy impact, spectral cards and scrolls flowing toward the hand, explosive impact flash and weapon trail cutting through the frame, clashing void currents of violet and magenta swirling through shattered archways, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, centered frontal view, bold saturated violet and magenta void energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `mx_a_momentum_unleash.webp` — 连势释放（rare/skill）：抽 3 张牌，获得 2 点能量。消耗 2 层连势。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, planting feet wide while channeling a ward, effect readable and not a boss transformation, primary card mechanic visualized as spectral cards and scrolls flowing toward the hand, spectral cards and scrolls flowing toward the hand as momentum streams dissolve, radiant energy core flaring in the palm or chest, concentrated magical effect radiating from hands with sharp readable glow, clashing void currents of violet and magenta swirling through shattered archways, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, slightly low angle emphasizing power, bold saturated violet and magenta void energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `mx_a_unyielding_guard.webp` — 不屈守卫（rare/power）：获得 3 层金属化，获得 2 层稳势。

```
Premium collectible card art of a hooded dark-armored void warrior in a ritual stance with persistent aura, palms open as a slow-burning aura settles on armor, less motion, more enduring status, primary card mechanic visualized as dark metallic plating spreading across arms and shoulders, armor hardening, steel sheen, braced stance, grounded posture, layered stable ward rings, persistent aura halo and ascending energy motes surrounding the figure, clashing void currents of violet and magenta swirling through shattered archways, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, diagonal composition with the void spire behind one shoulder, bold saturated violet and magenta void energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `cash_flow.webp` — 转势（uncommon/skill）：抽 1 张牌，并消耗全部连势，每层额外抽 1 张牌。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, drawing inward with controlled breath and ward rings, effect readable and not a boss transformation, primary card mechanic visualized as spectral cards and scrolls flowing toward the hand as momentum streams dissolve, concentrated magical effect radiating from hands with sharp readable glow, clashing void currents of violet and magenta swirling through shattered archways, distinct collectible card illustration, clear magical focal point, stronger color contrast and environmental storytelling, slightly elevated view, bold saturated violet and magenta void energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `momentum.webp` — 蓄势（uncommon/skill）：获得 2 层连势（每次出牌后获得等同层数的格挡，并衰减 1 层）。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, turning sideways with shield arm forward, effect readable and not a boss transformation, primary card mechanic visualized as spiraling momentum streams, flowing energy trails around the body, concentrated magical effect radiating from hands with sharp readable glow, clashing void currents of violet and magenta swirling through shattered archways, distinct collectible card illustration, clear magical focal point, stronger color contrast and environmental storytelling, three-quarter view from the left, bold saturated violet and magenta void energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `release_flow.webp` — 放势（uncommon/skill）：抽 1 张牌，并消耗至多 2 层连势，每层额外抽 1 张牌。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, extending both hands to shape a protective barrier, effect readable and not a boss transformation, primary card mechanic visualized as spectral cards and scrolls flowing toward the hand as momentum streams dissolve, concentrated magical effect radiating from hands with sharp readable glow, clashing void currents of violet and magenta swirling through shattered archways, distinct collectible card illustration, clear magical focal point, stronger color contrast and environmental storytelling, three-quarter view from the right, bold saturated violet and magenta void energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `prime_rhythm.webp` — 起手式（common/skill）：获得 2 层连势，抽 1 张牌。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, kneeling slightly while reinforcing armor with energy, effect readable and not a boss transformation, primary card mechanic visualized as spiraling momentum streams, flowing energy trails around the body, spectral cards and scrolls flowing toward the hand, concentrated magical effect radiating from hands with sharp readable glow, clashing void currents of violet and magenta swirling through shattered archways, signature card art with one bold readable magical effect, restrained but vivid color accents, not generic placeholder art, three-quarter view from the right, bold saturated violet and magenta void energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `tempo_guard.webp` — 守势（common/skill）：获得 3 点格挡，并获得 2 层连势。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, extending both hands to shape a protective barrier, effect readable and not a boss transformation, primary card mechanic visualized as translucent protective ward, cyan shield arcs, barrier wrapping around armor, spiraling momentum streams, flowing energy trails around the body, concentrated magical effect radiating from hands with sharp readable glow, clashing void currents of violet and magenta swirling through shattered archways, signature card art with one bold readable magical effect, restrained but vivid color accents, not generic placeholder art, slightly low angle emphasizing power, bold saturated violet and magenta void energy accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

### neutral（39）

- `neutral_legendary_1.webp` — 命运之轮（legendary/skill）：消耗所有连势。每消耗 1 层，抽 1 张牌。消耗。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, extending both hands to shape a protective barrier, effect readable and not a boss transformation, primary card mechanic visualized as spectral cards and scrolls flowing toward the hand as momentum streams dissolve, concentrated magical effect radiating from hands with sharp readable glow, pale ethereal mist and ancient rune circles glowing on the temple floor, mythic showcase card art, epic environmental magic, powerful layered effects, legendary presence without visual clutter, three-quarter view from the left, bold saturated muted grey-gold ethereal light accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `neutral_legendary_2.webp` — 虚空契约（legendary/skill）：失去 6 点生命，获得 3 层连势和 3 层稳势。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, kneeling slightly while reinforcing armor with energy, effect readable and not a boss transformation, primary card mechanic visualized as dark ethereal life force draining from the chest as a deliberate sacrifice, spiraling momentum streams, flowing energy trails around the body, braced stance, grounded posture, layered stable ward rings, concentrated magical effect radiating from hands with sharp readable glow, pale ethereal mist and ancient rune circles glowing on the temple floor, mythic showcase card art, epic environmental magic, powerful layered effects, legendary presence without visual clutter, three-quarter view from the left, bold saturated muted grey-gold ethereal light accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `neutral_rare_atk_1.webp` — 终极打击（rare/attack）：造成 20 点伤害。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, spinning into a slashing follow-through, weapon strike or energy impact clearly visible, primary card mechanic visualized as single decisive heavy strike with visible impact, explosive impact flash and weapon trail cutting through the frame, pale ethereal mist and ancient rune circles glowing on the temple floor, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, diagonal composition with the void spire behind one shoulder, bold saturated muted grey-gold ethereal light accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `neutral_rare_atk_2.webp` — 连击风暴（rare/attack）：造成 5 点伤害四次。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, hammering an energy-charged punch with gauntleted fist, weapon strike or energy impact clearly visible, primary card mechanic visualized as rapid multi-hit flurry with each impact clearly readable, explosive impact flash and weapon trail cutting through the frame, pale ethereal mist and ancient rune circles glowing on the temple floor, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, three-quarter view from the left, bold saturated muted grey-gold ethereal light accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `neutral_rare_atk_3.webp` — 顺劈风暴（rare/attack）：对所有敌人造成 15 点伤害。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, lunging forward with a visible weapon strike, weapon strike or energy impact clearly visible, primary card mechanic visualized as sweeping area strike with visible energy impact across multiple enemy silhouettes, explosive impact flash and weapon trail cutting through the frame, pale ethereal mist and ancient rune circles glowing on the temple floor, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, diagonal composition with the void spire behind one shoulder, bold saturated muted grey-gold ethereal light accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `neutral_rare_atk_4.webp` — 破甲风暴（rare/attack）：造成 12 点伤害，施加 3 层易伤。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, delivering a sweeping blade arc with energy trailing the weapon, weapon strike or energy impact clearly visible, primary card mechanic visualized as single decisive heavy strike with visible impact, enemy armor cracking with glowing red fissures, explosive impact flash and weapon trail cutting through the frame, pale ethereal mist and ancient rune circles glowing on the temple floor, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, slightly low angle emphasizing power, bold saturated muted grey-gold ethereal light accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `neutral_rare_power_1.webp` — 力量觉醒（rare/power）：获得 4 层力量。

```
Premium collectible card art of a hooded dark-armored void warrior in a ritual stance with persistent aura, standing in a ritual stance with enduring aura, less motion, more enduring status, primary card mechanic visualized as crimson runes glowing on arms and weapon, empowered posture, persistent aura halo and ascending energy motes surrounding the figure, pale ethereal mist and ancient rune circles glowing on the temple floor, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, centered frontal view, bold saturated muted grey-gold ethereal light accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `neutral_rare_power_2.webp` — 易伤精通（rare/power）：对所有敌人施加 3 层易伤。

```
Premium collectible card art of a hooded dark-armored void warrior in a ritual stance with persistent aura, arms spread in a passive empowerment ritual, less motion, more enduring status, primary card mechanic visualized as enemy armor cracking with glowing red fissures, persistent aura halo and ascending energy motes surrounding the figure, pale ethereal mist and ancient rune circles glowing on the temple floor, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, three-quarter view from the left, bold saturated muted grey-gold ethereal light accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `neutral_rare_power_3.webp` — 虚弱精通（rare/power）：对所有敌人施加 3 层虚弱。

```
Premium collectible card art of a hooded dark-armored void warrior in a ritual stance with persistent aura, head bowed while a persistent aura wraps the body, less motion, more enduring status, primary card mechanic visualized as draining grey mist sapping an enemy silhouette, persistent aura halo and ascending energy motes surrounding the figure, pale ethereal mist and ancient rune circles glowing on the temple floor, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, slightly elevated view, bold saturated muted grey-gold ethereal light accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `neutral_rare_skill_1.webp` — 铁壁防御（rare/skill）：获得 20 点格挡。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, turning sideways with shield arm forward, effect readable and not a boss transformation, primary card mechanic visualized as translucent protective ward, cyan shield arcs, barrier wrapping around armor, concentrated magical effect radiating from hands with sharp readable glow, pale ethereal mist and ancient rune circles glowing on the temple floor, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, three-quarter view from the right, bold saturated muted grey-gold ethereal light accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `neutral_rare_skill_2.webp` — 扫视风暴（rare/skill）：抽 5 张牌。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, planting feet wide while channeling a ward, effect readable and not a boss transformation, primary card mechanic visualized as spectral cards and scrolls flowing toward the hand, concentrated magical effect radiating from hands with sharp readable glow, pale ethereal mist and ancient rune circles glowing on the temple floor, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, slightly elevated view, bold saturated muted grey-gold ethereal light accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `neutral_rare_skill_3.webp` — 涌能风暴（rare/skill）：获得 3 点能量。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, planting feet wide while channeling a ward, effect readable and not a boss transformation, primary card mechanic visualized as radiant energy core flaring in the palm or chest, concentrated magical effect radiating from hands with sharp readable glow, pale ethereal mist and ancient rune circles glowing on the temple floor, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, diagonal composition with the void spire behind one shoulder, bold saturated muted grey-gold ethereal light accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `neutral_rare_skill_4.webp` — 柔韧风暴（rare/skill）：获得 5 层力量。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, raising one arm in a focused defensive gesture, effect readable and not a boss transformation, primary card mechanic visualized as crimson runes glowing on arms and weapon, empowered posture, concentrated magical effect radiating from hands with sharp readable glow, pale ethereal mist and ancient rune circles glowing on the temple floor, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, three-quarter view from the right, bold saturated muted grey-gold ethereal light accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `neutral_rare_skill_5.webp` — 治疗风暴（rare/skill）：回复 20 点生命。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, extending both hands to shape a protective barrier, effect readable and not a boss transformation, primary card mechanic visualized as soft restorative light mending wounds on armor and skin, concentrated magical effect radiating from hands with sharp readable glow, pale ethereal mist and ancient rune circles glowing on the temple floor, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, centered frontal view, bold saturated muted grey-gold ethereal light accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `nt_d_annihilation.webp` — 毁灭横扫（rare/attack）：对所有敌人造成 14 点伤害。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, lunging forward with a visible weapon strike, weapon strike or energy impact clearly visible, primary card mechanic visualized as sweeping area strike with visible energy impact across multiple enemy silhouettes, explosive impact flash and weapon trail cutting through the frame, pale ethereal mist and ancient rune circles glowing on the temple floor, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, centered frontal view, bold saturated muted grey-gold ethereal light accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `nt_d_citadel.webp` — 堡垒（rare/skill）：获得 18 点格挡。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, kneeling slightly while reinforcing armor with energy, effect readable and not a boss transformation, primary card mechanic visualized as translucent protective ward, cyan shield arcs, barrier wrapping around armor, concentrated magical effect radiating from hands with sharp readable glow, pale ethereal mist and ancient rune circles glowing on the temple floor, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, diagonal composition with the void spire behind one shoulder, bold saturated muted grey-gold ethereal light accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `nt_d_fortress.webp` — 要塞（rare/power）：获得 3 层金属化。

```
Premium collectible card art of a hooded dark-armored void warrior in a ritual stance with persistent aura, arms spread in a passive empowerment ritual, less motion, more enduring status, primary card mechanic visualized as dark metallic plating spreading across arms and shoulders, armor hardening, steel sheen, persistent aura halo and ascending energy motes surrounding the figure, pale ethereal mist and ancient rune circles glowing on the temple floor, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, three-quarter view from the left, bold saturated muted grey-gold ethereal light accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `nt_d_judgement_cut.webp` — 裁决之刃（rare/attack）：造成 20 点伤害。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, spinning into a slashing follow-through, weapon strike or energy impact clearly visible, primary card mechanic visualized as single decisive heavy strike with visible impact, explosive impact flash and weapon trail cutting through the frame, pale ethereal mist and ancient rune circles glowing on the temple floor, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, three-quarter view from the right, bold saturated muted grey-gold ethereal light accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `nt_d_mighty_blow.webp` — 万钧一击（rare/attack）：造成 16 点伤害，获得 8 点格挡。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, driving a downward crushing blow with impact sparks, weapon strike or energy impact clearly visible, primary card mechanic visualized as single decisive heavy strike with visible impact, translucent protective ward, cyan shield arcs, barrier wrapping around armor, explosive impact flash and weapon trail cutting through the frame, pale ethereal mist and ancient rune circles glowing on the temple floor, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, diagonal composition with the void spire behind one shoulder, bold saturated muted grey-gold ethereal light accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `nt_d_momentum_draw_burst.webp` — 连势涌现（rare/skill）：抽 3 张牌。消耗 3 层连势，每层额外抽 1 张牌。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, extending both hands to shape a protective barrier, effect readable and not a boss transformation, primary card mechanic visualized as spectral cards and scrolls flowing toward the hand as momentum streams dissolve, concentrated magical effect radiating from hands with sharp readable glow, pale ethereal mist and ancient rune circles glowing on the temple floor, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, three-quarter view from the right, bold saturated muted grey-gold ethereal light accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `nt_d_momentum_overflow.webp` — 连势满溢（rare/skill）：获得 5 层力量，获得 2 层连势。消耗。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, raising one arm in a focused defensive gesture, effect readable and not a boss transformation, primary card mechanic visualized as crimson runes glowing on arms and weapon, empowered posture, spiraling momentum streams, flowing energy trails around the body, concentrated magical effect radiating from hands with sharp readable glow, pale ethereal mist and ancient rune circles glowing on the temple floor, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, diagonal composition with the void spire behind one shoulder, bold saturated muted grey-gold ethereal light accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `nt_d_momentum_unleash.webp` — 连势释放（rare/attack）：造成 8 点伤害。消耗所有连势，每层造成额外 4 点伤害。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, thrusting a spear or blade in a three-quarter turn, weapon strike or energy impact clearly visible, primary card mechanic visualized as unleashing spiraling momentum streams into a violent energy impact, explosive impact flash and weapon trail cutting through the frame, pale ethereal mist and ancient rune circles glowing on the temple floor, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, diagonal composition with the void spire behind one shoulder, bold saturated muted grey-gold ethereal light accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `nt_d_steady_fortification.webp` — 稳固防线（rare/skill）：获得 2 层稳势，获得 10 点格挡。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, drawing inward with controlled breath and ward rings, effect readable and not a boss transformation, primary card mechanic visualized as braced stance, grounded posture, layered stable ward rings, translucent protective ward, cyan shield arcs, barrier wrapping around armor, concentrated magical effect radiating from hands with sharp readable glow, pale ethereal mist and ancient rune circles glowing on the temple floor, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, three-quarter view from the left, bold saturated muted grey-gold ethereal light accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `nt_d_storm_slash.webp` — 风暴斩（rare/attack）：造成 5 点伤害四次。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, hammering an energy-charged punch with gauntleted fist, weapon strike or energy impact clearly visible, primary card mechanic visualized as rapid multi-hit flurry with each impact clearly readable, explosive impact flash and weapon trail cutting through the frame, pale ethereal mist and ancient rune circles glowing on the temple floor, dramatic premium card art, ornate armor details, layered magical VFX, dynamic pose with strong silhouette, slightly elevated view, bold saturated muted grey-gold ethereal light accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `burn_edge.webp` — 燃锋（uncommon/attack）：造成 14 点伤害。消耗。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, spinning into a slashing follow-through, weapon strike or energy impact clearly visible, primary card mechanic visualized as single decisive heavy strike with visible impact, explosive impact flash and weapon trail cutting through the frame, pale ethereal mist and ancient rune circles glowing on the temple floor, distinct collectible card illustration, clear magical focal point, stronger color contrast and environmental storytelling, three-quarter view from the right, bold saturated muted grey-gold ethereal light accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `clear_mind.webp` — 清念（uncommon/skill）：抽 2 张牌，获得 2 点能量。消耗。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, planting feet wide while channeling a ward, effect readable and not a boss transformation, primary card mechanic visualized as spectral cards and scrolls flowing toward the hand, radiant energy core flaring in the palm or chest, concentrated magical effect radiating from hands with sharp readable glow, pale ethereal mist and ancient rune circles glowing on the temple floor, distinct collectible card illustration, clear magical focal point, stronger color contrast and environmental storytelling, slightly elevated view, bold saturated muted grey-gold ethereal light accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `bash.webp` — 重击（common/attack）：造成 7 点伤害，施加 2 层易伤。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, thrusting a spear or blade in a three-quarter turn, weapon strike or energy impact clearly visible, primary card mechanic visualized as single decisive heavy strike with visible impact, enemy armor cracking with glowing red fissures, explosive impact flash and weapon trail cutting through the frame, pale ethereal mist and ancient rune circles glowing on the temple floor, signature card art with one bold readable magical effect, restrained but vivid color accents, not generic placeholder art, slightly elevated view, bold saturated muted grey-gold ethereal light accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `cleave.webp` — 顺劈（common/attack）：对所有敌人造成 8 点伤害。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, thrusting a spear or blade in a three-quarter turn, weapon strike or energy impact clearly visible, primary card mechanic visualized as sweeping area strike with visible energy impact across multiple enemy silhouettes, explosive impact flash and weapon trail cutting through the frame, pale ethereal mist and ancient rune circles glowing on the temple floor, signature card art with one bold readable magical effect, restrained but vivid color accents, not generic placeholder art, three-quarter view from the right, bold saturated muted grey-gold ethereal light accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `defend.webp` — 防御（common/skill）：获得 5 点格挡。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, raising one arm in a focused defensive gesture, effect readable and not a boss transformation, primary card mechanic visualized as translucent protective ward, cyan shield arcs, barrier wrapping around armor, concentrated magical effect radiating from hands with sharp readable glow, pale ethereal mist and ancient rune circles glowing on the temple floor, signature card art with one bold readable magical effect, restrained but vivid color accents, not generic placeholder art, centered frontal view, bold saturated muted grey-gold ethereal light accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `flex.webp` — 柔韧（common/skill）：获得 2 点力量。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, drawing inward with controlled breath and ward rings, effect readable and not a boss transformation, primary card mechanic visualized as crimson runes glowing on arms and weapon, empowered posture, concentrated magical effect radiating from hands with sharp readable glow, pale ethereal mist and ancient rune circles glowing on the temple floor, signature card art with one bold readable magical effect, restrained but vivid color accents, not generic placeholder art, slightly low angle emphasizing power, bold saturated muted grey-gold ethereal light accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `measured_rest.webp` — 养息（common/skill）：回复 3 点生命，获得 4 点格挡，并获得 1 层连势。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, kneeling slightly while reinforcing armor with energy, effect readable and not a boss transformation, primary card mechanic visualized as soft restorative light mending wounds on armor and skin, translucent protective ward, cyan shield arcs, barrier wrapping around armor, spiraling momentum streams, flowing energy trails around the body, concentrated magical effect radiating from hands with sharp readable glow, pale ethereal mist and ancient rune circles glowing on the temple floor, signature card art with one bold readable magical effect, restrained but vivid color accents, not generic placeholder art, slightly elevated view, bold saturated muted grey-gold ethereal light accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `patch_breath.webp` — 调息（common/skill）：回复 4 点生命，获得 4 点格挡。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, drawing inward with controlled breath and ward rings, effect readable and not a boss transformation, primary card mechanic visualized as soft restorative light mending wounds on armor and skin, translucent protective ward, cyan shield arcs, barrier wrapping around armor, concentrated magical effect radiating from hands with sharp readable glow, pale ethereal mist and ancient rune circles glowing on the temple floor, signature card art with one bold readable magical effect, restrained but vivid color accents, not generic placeholder art, slightly low angle emphasizing power, bold saturated muted grey-gold ethereal light accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `recenter.webp` — 回气（common/skill）：抽 1 张牌，获得 1 点能量。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, raising one arm in a focused defensive gesture, effect readable and not a boss transformation, primary card mechanic visualized as spectral cards and scrolls flowing toward the hand, radiant energy core flaring in the palm or chest, concentrated magical effect radiating from hands with sharp readable glow, pale ethereal mist and ancient rune circles glowing on the temple floor, signature card art with one bold readable magical effect, restrained but vivid color accents, not generic placeholder art, slightly low angle emphasizing power, bold saturated muted grey-gold ethereal light accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `second_wind.webp` — 续拍（common/skill）：获得 5 点格挡，获得 1 点能量。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, extending both hands to shape a protective barrier, effect readable and not a boss transformation, primary card mechanic visualized as translucent protective ward, cyan shield arcs, barrier wrapping around armor, radiant energy core flaring in the palm or chest, concentrated magical effect radiating from hands with sharp readable glow, pale ethereal mist and ancient rune circles glowing on the temple floor, signature card art with one bold readable magical effect, restrained but vivid color accents, not generic placeholder art, slightly low angle emphasizing power, bold saturated muted grey-gold ethereal light accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `skim.webp` — 扫视（common/skill）：抽 2 张牌。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, extending both hands to shape a protective barrier, effect readable and not a boss transformation, primary card mechanic visualized as spectral cards and scrolls flowing toward the hand, concentrated magical effect radiating from hands with sharp readable glow, pale ethereal mist and ancient rune circles glowing on the temple floor, signature card art with one bold readable magical effect, restrained but vivid color accents, not generic placeholder art, slightly elevated view, bold saturated muted grey-gold ethereal light accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `steady_step.webp` — 整步（common/skill）：获得 6 点格挡，抽 1 张牌。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, raising one arm in a focused defensive gesture, effect readable and not a boss transformation, primary card mechanic visualized as translucent protective ward, cyan shield arcs, barrier wrapping around armor, spectral cards and scrolls flowing toward the hand, concentrated magical effect radiating from hands with sharp readable glow, pale ethereal mist and ancient rune circles glowing on the temple floor, signature card art with one bold readable magical effect, restrained but vivid color accents, not generic placeholder art, centered frontal view, bold saturated muted grey-gold ethereal light accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `strike.webp` — 打击（common/attack）：造成 6 点伤害。

```
Premium collectible card art of a hooded dark-armored void warrior in a dynamic offensive action, lunging forward with a visible weapon strike, weapon strike or energy impact clearly visible, primary card mechanic visualized as single decisive heavy strike with visible impact, explosive impact flash and weapon trail cutting through the frame, pale ethereal mist and ancient rune circles glowing on the temple floor, signature card art with one bold readable magical effect, restrained but vivid color accents, not generic placeholder art, three-quarter view from the left, bold saturated muted grey-gold ethereal light accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `surge.webp` — 涌能（common/skill）：获得 1 点能量。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, kneeling slightly while reinforcing armor with energy, effect readable and not a boss transformation, primary card mechanic visualized as radiant energy core flaring in the palm or chest, concentrated magical effect radiating from hands with sharp readable glow, pale ethereal mist and ancient rune circles glowing on the temple floor, signature card art with one bold readable magical effect, restrained but vivid color accents, not generic placeholder art, diagonal composition with the void spire behind one shoulder, bold saturated muted grey-gold ethereal light accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `survey_field.webp` — 观势（common/skill）：抽 2 张牌。获得 1 层连势。

```
Premium collectible card art of a hooded dark-armored void warrior performing a focused defensive or utility gesture, extending both hands to shape a protective barrier, effect readable and not a boss transformation, primary card mechanic visualized as spectral cards and scrolls flowing toward the hand, spiraling momentum streams, flowing energy trails around the body, concentrated magical effect radiating from hands with sharp readable glow, pale ethereal mist and ancient rune circles glowing on the temple floor, signature card art with one bold readable magical effect, restrained but vivid color accents, not generic placeholder art, diagonal composition with the void spire behind one shoulder, bold saturated muted grey-gold ethereal light accents dominating the scene, cinematic frozen action moment, dramatic rim light on ornate void armor, rich saturated magical particle trails, ruined ancient temple with crumbling pillars and drifting ash, distant void spire blazing against storm clouds, volumetric god rays, painterly brushwork, highly detailed, heroic focal composition, clear readable silhouette, full body or three-quarter body visible, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```
