# Spirewalker 战斗资源 Prompt 清单

> 自动生成（scripts/gen-card-art-prompts.ts）。统一风格后缀已内置，直接复制到 GPT 出图即可。
> 出图为正方形透明/深色底插画，落地路径见每节说明。卡名仅作对照，不要画进图里。

## 统一风格基准

所有战斗插画共用同一基调，保证嵌进卡框/界面后风格一致：

```
dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

流派配色：守=cool cyan and steel-blue protective energy；爆=fiery crimson and molten-orange embers；混=violet and magenta void energy；通=muted grey-gold ethereal light。

## 尺寸与格式规格

| 资产                  | 出图尺寸                           | 比例 | 格式 | 背景             | 备注                                |
| --------------------- | ---------------------------------- | ---- | ---- | ---------------- | ----------------------------------- |
| 核心卡插画 / 兜底插画 | 1024×1024                          | 1:1  | PNG  | 深色或不透明均可 | 进 public 前建议压到 ~512 或转 webp |
| 状态图标              | 1024×1024 出，downscale 到 256×256 | 1:1  | PNG  | 必须透明         | 显示约 64px，需 alpha 通道          |
| 意图图标              | 1024×1024 出，downscale 到 256×256 | 1:1  | PNG  | 必须透明         | 显示约 32px，需 alpha 通道          |

- 插画区在 UI 里用 `object-fit: cover` 裁切，统一 1:1 不会变形。
- 图标叠在深色 chip/画框上，背景务必透明；GPT 偶尔不给 alpha，拿到后确认。
- 164 张卡插画全 1024 会让仓库变重，建议批量压缩后再放入 public。

## A. 状态图标（8 个） → public/assets/combat/statuses/<id>.png

风格：1:1，透明底，发光符文宝石小图标，可在 64px 下清晰辨认，统一描边。

- `strength.png`（力量）

```
a glowing crimson fist rune emblem, empowering aura, glowing magical status icon, dark fantasy UI emblem, centered, transparent background, crisp readable silhouette, 1:1, 1024x1024 transparent PNG
```

- `weak.png`（虚弱）

```
a cracked grey downward-arrow rune draining energy, glowing magical status icon, dark fantasy UI emblem, centered, transparent background, crisp readable silhouette, 1:1, 1024x1024 transparent PNG
```

- `vulnerable.png`（易伤）

```
a shattered shield rune with red fracture glow, glowing magical status icon, dark fantasy UI emblem, centered, transparent background, crisp readable silhouette, 1:1, 1024x1024 transparent PNG
```

- `momentum.png`（连势）

```
a spiraling cyan momentum vortex rune, glowing magical status icon, dark fantasy UI emblem, centered, transparent background, crisp readable silhouette, 1:1, 1024x1024 transparent PNG
```

- `metallicize.png`（金属化）

```
a dark metallic hexagon plate rune with steel sheen, glowing magical status icon, dark fantasy UI emblem, centered, transparent background, crisp readable silhouette, 1:1, 1024x1024 transparent PNG
```

- `steady_guard.png`（稳势）

```
a layered teal ward sigil, calm steady glow, glowing magical status icon, dark fantasy UI emblem, centered, transparent background, crisp readable silhouette, 1:1, 1024x1024 transparent PNG
```

- `primed_break.png`（破势预热）

```
a charged amber burst rune about to detonate, glowing magical status icon, dark fantasy UI emblem, centered, transparent background, crisp readable silhouette, 1:1, 1024x1024 transparent PNG
```

- `patience_power.png`（蓄势）

```
a meditative gathering-energy rune, slow building violet glow, glowing magical status icon, dark fantasy UI emblem, centered, transparent background, crisp readable silhouette, 1:1, 1024x1024 transparent PNG
```

## B. 意图图标（5 个） → public/assets/combat/intents/<id>.png

- `attack.png`（攻击）

```
crossed blades / weapon strike icon, aggressive red glow, enemy intent icon, dark fantasy UI emblem, centered, transparent background, crisp readable silhouette, 1:1, 1024x1024 transparent PNG
```

- `defend.png`（防御）

```
raised shield icon, steel-blue protective glow, enemy intent icon, dark fantasy UI emblem, centered, transparent background, crisp readable silhouette, 1:1, 1024x1024 transparent PNG
```

- `buff.png`（增益）

```
upward spiral aura icon, golden empowering glow, enemy intent icon, dark fantasy UI emblem, centered, transparent background, crisp readable silhouette, 1:1, 1024x1024 transparent PNG
```

- `debuff.png`（减益）

```
downward draining hex icon, sickly purple glow, enemy intent icon, dark fantasy UI emblem, centered, transparent background, crisp readable silhouette, 1:1, 1024x1024 transparent PNG
```

- `unknown.png`（未知）

```
a glowing question sigil shrouded in mist, neutral grey, enemy intent icon, dark fantasy UI emblem, centered, transparent background, crisp readable silhouette, 1:1, 1024x1024 transparent PNG
```

## C. 兜底插画（12 张） → public/assets/cards/art*shared/<archetype>*<type>.jpeg

长尾卡未单独出图时使用，按流派×类型各一张。

- `guard_attack.jpeg`

```
a hooded dark-armored void warrior in a dynamic offensive action, cool cyan and steel-blue protective energy accents, generic emblematic composition, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `guard_skill.jpeg`

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, cool cyan and steel-blue protective energy accents, generic emblematic composition, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `guard_power.jpeg`

```
a hooded dark-armored void warrior wreathed in a persistent magical aura, ritual pose, cool cyan and steel-blue protective energy accents, generic emblematic composition, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `burst_attack.jpeg`

```
a hooded dark-armored void warrior in a dynamic offensive action, fiery crimson and molten-orange embers accents, generic emblematic composition, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `burst_skill.jpeg`

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, fiery crimson and molten-orange embers accents, generic emblematic composition, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `burst_power.jpeg`

```
a hooded dark-armored void warrior wreathed in a persistent magical aura, ritual pose, fiery crimson and molten-orange embers accents, generic emblematic composition, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `mixed_attack.jpeg`

```
a hooded dark-armored void warrior in a dynamic offensive action, violet and magenta void energy accents, generic emblematic composition, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `mixed_skill.jpeg`

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, violet and magenta void energy accents, generic emblematic composition, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `mixed_power.jpeg`

```
a hooded dark-armored void warrior wreathed in a persistent magical aura, ritual pose, violet and magenta void energy accents, generic emblematic composition, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `neutral_attack.jpeg`

```
a hooded dark-armored void warrior in a dynamic offensive action, muted grey-gold ethereal light accents, generic emblematic composition, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `neutral_skill.jpeg`

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, muted grey-gold ethereal light accents, generic emblematic composition, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `neutral_power.jpeg`

```
a hooded dark-armored void warrior wreathed in a persistent magical aura, ritual pose, muted grey-gold ethereal light accents, generic emblematic composition, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

## D. 核心卡插画（164 张） → public/assets/cards/art/<cardId>.png

文件名用卡的基础 id（升级版 +/++ 复用同一张图）。

### guard（47）

- `guard_legendary_1.png` — 不动明王（legendary/skill）：获得 10 点格挡。若你本回合未消耗连势，额外获得 10 点格挡。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, channeling void power, cool cyan and steel-blue protective energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `guard_legendary_2.png` — 铁壁圣殿（legendary/power）：获得 8 层金属化。

```
a hooded dark-armored void warrior wreathed in a persistent magical aura, ritual pose, skin hardening into dark metallic plating, cool cyan and steel-blue protective energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `guard_legendary_3.png` — 定海神针（legendary/attack）：消耗所有稳势，每层造成 6 点伤害。消耗所有连势，每层造成 4 点伤害。

```
a hooded dark-armored void warrior in a dynamic offensive action, unleashing stored momentum as an explosive burst strike, cool cyan and steel-blue protective energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `guard_legendary_4.png` — 钢铁洪流（legendary/attack）：造成等同于你格挡值 2.5 倍的伤害。消耗。

```
a hooded dark-armored void warrior in a dynamic offensive action, channeling void power, cool cyan and steel-blue protective energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `guard_legendary_5.png` — 圣盾连击（legendary/attack）：造成 5 点伤害并获得 5 点格挡，重复 4 次。

```
a hooded dark-armored void warrior in a dynamic offensive action, channeling void power, cool cyan and steel-blue protective energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `guard_legendary_6.png` — 永恒壁垒（legendary/skill）：获得 15 点格挡。若你本回合未消耗连势，额外获得 5 点格挡。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, channeling void power, cool cyan and steel-blue protective energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `fortify.png` — 固守（rare/skill）：获得 10 点格挡。回合结束时，将 50% 剩余格挡转化为伤害，随机攻击一名敌人。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, raising a glowing protective ward or shield, cool cyan and steel-blue protective energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `gd_c_aegis_mastery.png` — 神盾精通（rare/power）：获得 6 层稳势和 4 层金属化。

```
a hooded dark-armored void warrior wreathed in a persistent magical aura, ritual pose, a steady braced stance ringed by layered translucent wards, skin hardening into dark metallic plating, cool cyan and steel-blue protective energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `gd_c_breaking_guard.png` — 破势大师（rare/power）：获得 4 层破势预热，获得 3 层连势。

```
a hooded dark-armored void warrior wreathed in a persistent magical aura, ritual pose, a coiled charge of energy about to burst, swirling streams of momentum energy spiraling around the body, cool cyan and steel-blue protective energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `gd_c_eternal_fortress.png` — 永恒堡垒（rare/skill）：获得 12 点格挡，获得 4 层金属化。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, raising a glowing protective ward or shield, skin hardening into dark metallic plating, cool cyan and steel-blue protective energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `gd_c_fortress_master.png` — 堡垒大师（rare/power）：获得 3 层力量和 5 层金属化。

```
a hooded dark-armored void warrior wreathed in a persistent magical aura, ritual pose, blade and arms glowing with empowering crimson runes, skin hardening into dark metallic plating, cool cyan and steel-blue protective energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `gd_c_guardian_devastation.png` — 守卫毁灭（rare/attack）：造成等同于你格挡值两倍的伤害。

```
a hooded dark-armored void warrior in a dynamic offensive action, channeling void power, cool cyan and steel-blue protective energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `gd_c_guardian_wrath.png` — 守卫之怒（rare/attack）：造成 15 点伤害四次。

```
a hooded dark-armored void warrior in a dynamic offensive action, a rapid multi-hit flurry of strikes, cool cyan and steel-blue protective energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `gd_c_impenetrable_wall.png` — 不可逾越之墙（rare/skill）：获得 20 点格挡。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, raising a glowing protective ward or shield, cool cyan and steel-blue protective energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `gd_c_last_wall.png` — 最后壁垒（rare/skill）：获得 25 点格挡。消耗。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, raising a glowing protective ward or shield, cool cyan and steel-blue protective energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `gd_c_metallic_mastery.png` — 金属化精通（rare/power）：获得 8 层金属化。

```
a hooded dark-armored void warrior wreathed in a persistent magical aura, ritual pose, skin hardening into dark metallic plating, cool cyan and steel-blue protective energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `gd_c_momentum_bastion.png` — 连势壁垒（rare/skill）：获得 8 点格挡，获得 6 层连势。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, raising a glowing protective ward or shield, swirling streams of momentum energy spiraling around the body, cool cyan and steel-blue protective energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `gd_c_momentum_lord.png` — 连势之王（rare/skill）：获得 8 层连势，抽 2 张牌。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, swirling streams of momentum energy spiraling around the body, spectral cards and scrolls swirling toward the hand, cool cyan and steel-blue protective energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `gd_c_steady_master.png` — 稳势大师（rare/power）：获得 5 层稳势。

```
a hooded dark-armored void warrior wreathed in a persistent magical aura, ritual pose, a steady braced stance ringed by layered translucent wards, cool cyan and steel-blue protective energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `gd_c_titan_slam.png` — 巨人碾压（rare/attack）：造成 20 点伤害。消耗所有稳势，每层造成额外 5 点伤害。

```
a hooded dark-armored void warrior in a dynamic offensive action, channeling void power, cool cyan and steel-blue protective energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `gd_c_ultimate_defense.png` — 终极防御（rare/skill）：获得 15 点格挡，获得 3 层金属化，抽 2 张牌。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, raising a glowing protective ward or shield, skin hardening into dark metallic plating, spectral cards and scrolls swirling toward the hand, cool cyan and steel-blue protective energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `gd_c_unstoppable_bulwark.png` — 不可阻挡之壁（rare/skill）：获得 15 点格挡，获得 3 层力量。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, raising a glowing protective ward or shield, blade and arms glowing with empowering crimson runes, cool cyan and steel-blue protective energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `guard_rare_atk_1.png` — 铁壁猛击（rare/attack）：造成等同于你格挡值两倍的伤害。

```
a hooded dark-armored void warrior in a dynamic offensive action, channeling void power, cool cyan and steel-blue protective energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `guard_rare_atk_2.png` — 稳势爆发（rare/attack）：造成 20 点伤害。消耗所有稳势，每层造成额外 5 点伤害。

```
a hooded dark-armored void warrior in a dynamic offensive action, channeling void power, cool cyan and steel-blue protective energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `guard_rare_atk_3.png` — 金属化打击（rare/attack）：造成 15 点伤害，获得等同于你金属化层数的格挡。

```
a hooded dark-armored void warrior in a dynamic offensive action, channeling void power, cool cyan and steel-blue protective energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `guard_rare_atk_4.png` — 守势连击（rare/attack）：造成 5 点伤害四次。

```
a hooded dark-armored void warrior in a dynamic offensive action, a rapid multi-hit flurry of strikes, cool cyan and steel-blue protective energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `guard_rare_atk_5.png` — 破势反击（rare/attack）：造成 25 点伤害。消耗所有破势预热，每层造成额外 8 点伤害。

```
a hooded dark-armored void warrior in a dynamic offensive action, channeling void power, cool cyan and steel-blue protective energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `guard_rare_power_1.png` — 金属化精通（rare/power）：获得 8 层金属化。

```
a hooded dark-armored void warrior wreathed in a persistent magical aura, ritual pose, skin hardening into dark metallic plating, cool cyan and steel-blue protective energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `guard_rare_power_2.png` — 稳势精通（rare/power）：获得 5 层稳势。

```
a hooded dark-armored void warrior wreathed in a persistent magical aura, ritual pose, a steady braced stance ringed by layered translucent wards, cool cyan and steel-blue protective energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `guard_rare_power_3.png` — 守势大师（rare/power）：获得 3 层力量和 5 层金属化。

```
a hooded dark-armored void warrior wreathed in a persistent magical aura, ritual pose, blade and arms glowing with empowering crimson runes, skin hardening into dark metallic plating, cool cyan and steel-blue protective energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `guard_rare_power_4.png` — 连势大师（rare/power）：获得 6 层连势。

```
a hooded dark-armored void warrior wreathed in a persistent magical aura, ritual pose, swirling streams of momentum energy spiraling around the body, cool cyan and steel-blue protective energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `guard_rare_power_5.png` — 破势预热精通（rare/power）：获得 4 层破势预热。

```
a hooded dark-armored void warrior wreathed in a persistent magical aura, ritual pose, a coiled charge of energy about to burst, cool cyan and steel-blue protective energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `guard_rare_skill_1.png` — 铁壁防御（rare/skill）：获得 20 点格挡。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, raising a glowing protective ward or shield, cool cyan and steel-blue protective energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `guard_rare_skill_2.png` — 稳势防御（rare/skill）：获得 12 点格挡，获得 3 层稳势。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, raising a glowing protective ward or shield, a steady braced stance ringed by layered translucent wards, cool cyan and steel-blue protective energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `guard_rare_skill_3.png` — 金属化防御（rare/skill）：获得 10 点格挡，获得 4 层金属化。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, raising a glowing protective ward or shield, skin hardening into dark metallic plating, cool cyan and steel-blue protective energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `guard_rare_skill_4.png` — 势能壁垒（rare/skill）：获得 8 点格挡，获得 5 层连势。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, raising a glowing protective ward or shield, swirling streams of momentum energy spiraling around the body, cool cyan and steel-blue protective energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `guard_rare_skill_5.png` — 坚守阵地（rare/skill）：获得 15 点格挡，抽 2 张牌。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, raising a glowing protective ward or shield, spectral cards and scrolls swirling toward the hand, cool cyan and steel-blue protective energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `patience_stance.png` — 耐心（rare/power）：能力（Patience）：每回合结束时，若你本回合未打出攻击，获得 1 层力量。

```
a hooded dark-armored void warrior wreathed in a persistent magical aura, ritual pose, a meditative charging pose slowly gathering inner power, cool cyan and steel-blue protective energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `anchor_slash.png` — 定锋（uncommon/attack）：造成 6 点伤害，获得 4 点格挡，并获得 1 层稳势。

```
a hooded dark-armored void warrior in a dynamic offensive action, a single decisive heavy strike, raising a glowing protective ward or shield, a steady braced stance ringed by layered translucent wards, cool cyan and steel-blue protective energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `anchored_breath.png` — 定息（uncommon/skill）：获得 5 点格挡，并获得 1 层金属化与 1 层稳势。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, raising a glowing protective ward or shield, skin hardening into dark metallic plating, a steady braced stance ringed by layered translucent wards, cool cyan and steel-blue protective energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `guard_vigil_banner.png` — 守势旗帜（uncommon/skill）：获得 7 点格挡。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, raising a glowing protective ward or shield, cool cyan and steel-blue protective energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `patient_cut.png` — 缓收（uncommon/attack）：造成 6 点伤害。获得等同当前连势层数的格挡，不消耗连势。

```
a hooded dark-armored void warrior in a dynamic offensive action, a single decisive heavy strike, weaving momentum energy into a defensive barrier, cool cyan and steel-blue protective energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `stable_mind.png` — 定心（uncommon/skill）：获得 7 点格挡。若本回合未主动消耗连势，再抽 1 张牌并获得 1 层连势。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, raising a glowing protective ward or shield, cool cyan and steel-blue protective energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `brace_rhythm.png` — 稳架（common/skill）：获得 5 点格挡，并获得 2 层连势。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, raising a glowing protective ward or shield, swirling streams of momentum energy spiraling around the body, cool cyan and steel-blue protective energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `guard_strike.png` — 护锋（common/attack）：造成 6 点伤害，获得 4 点格挡。

```
a hooded dark-armored void warrior in a dynamic offensive action, a single decisive heavy strike, raising a glowing protective ward or shield, cool cyan and steel-blue protective energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `held_breath.png` — 屏息（common/skill）：获得 6 点格挡。获得 1 层稳势。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, raising a glowing protective ward or shield, a steady braced stance ringed by layered translucent wards, cool cyan and steel-blue protective energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `soft_step.png` — 垫步（common/skill）：获得 3 点格挡，并获得 1 层连势。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, raising a glowing protective ward or shield, swirling streams of momentum energy spiraling around the body, cool cyan and steel-blue protective energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

### burst（45）

- `burst_legendary_1.png` — 能量湮灭（legendary/attack）：消耗所有能量，每点造成 18 点伤害。

```
a hooded dark-armored void warrior in a dynamic offensive action, channeling void power, fiery crimson and molten-orange embers accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `burst_legendary_2.png` — 连势风暴（legendary/attack）：消耗所有连势，每层造成 5 点伤害。消耗所有破势预热，每层造成 8 点伤害。

```
a hooded dark-armored void warrior in a dynamic offensive action, unleashing stored momentum as an explosive burst strike, fiery crimson and molten-orange embers accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `burst_legendary_3.png` — 破甲重击（legendary/attack）：消耗 5 点格挡，造成 35 点伤害。消耗。

```
a hooded dark-armored void warrior in a dynamic offensive action, channeling void power, fiery crimson and molten-orange embers accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `burst_legendary_4.png` — 破势洪流（legendary/attack）：消耗所有破势预热，每层造成 6 点伤害并抽 1 张牌。

```
a hooded dark-armored void warrior in a dynamic offensive action, spectral cards and scrolls swirling toward the hand, fiery crimson and molten-orange embers accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `burst_legendary_5.png` — 连势狂潮（legendary/attack）：消耗所有连势，每层造成 3 点伤害并抽 1 张牌。获得 2 点能量。

```
a hooded dark-armored void warrior in a dynamic offensive action, converting swirling momentum into a fan of drawn cards, a surging radiant energy core flaring with power, fiery crimson and molten-orange embers accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `burst_legendary_6.png` — 连锁爆破（legendary/attack）：消耗所有连势，每层造成 5 点伤害，消耗后抽 1 张牌。

```
a hooded dark-armored void warrior in a dynamic offensive action, unleashing stored momentum as an explosive burst strike, converting swirling momentum into a fan of drawn cards, fiery crimson and molten-orange embers accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `blood_rush.png` — 血怒（rare/attack）：造成 6 点伤害。若你本回合已消耗过牌，改为造成 16 点伤害。

```
a hooded dark-armored void warrior in a dynamic offensive action, channeling void power, fiery crimson and molten-orange embers accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `br_b_burst_master.png` — 爆发大师（rare/power）：获得 4 层破势预热和 4 层连势。

```
a hooded dark-armored void warrior wreathed in a persistent magical aura, ritual pose, a coiled charge of energy about to burst, swirling streams of momentum energy spiraling around the body, fiery crimson and molten-orange embers accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `br_b_energy_annihilation.png` — 能量湮灭（rare/attack）：造成 40 点伤害。消耗所有能量。

```
a hooded dark-armored void warrior in a dynamic offensive action, channeling void power, fiery crimson and molten-orange embers accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `br_b_energy_master.png` — 能量大师（rare/skill）：获得 4 点能量。消耗 5 层连势。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, a surging radiant energy core flaring with power, unleashing stored momentum as an explosive burst strike, fiery crimson and molten-orange embers accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `br_b_final_rupture.png` — 终结裂变（rare/attack）：造成 30 点伤害。消耗所有连势和破势预热，每层造成额外 5 点伤害。

```
a hooded dark-armored void warrior in a dynamic offensive action, unleashing stored momentum as an explosive burst strike, fiery crimson and molten-orange embers accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `br_b_momentum_fortify_r.png` — 连势精通·极（rare/power）：获得 6 层连势。

```
a hooded dark-armored void warrior wreathed in a persistent magical aura, ritual pose, swirling streams of momentum energy spiraling around the body, fiery crimson and molten-orange embers accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `br_b_momentum_master.png` — 连势大师（rare/skill）：获得 8 层连势。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, swirling streams of momentum energy spiraling around the body, fiery crimson and molten-orange embers accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `br_b_momentum_master_p.png` — 连势大师·极（rare/power）：获得 5 层连势和 2 层力量。

```
a hooded dark-armored void warrior wreathed in a persistent magical aura, ritual pose, swirling streams of momentum energy spiraling around the body, blade and arms glowing with empowering crimson runes, fiery crimson and molten-orange embers accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `br_b_momentum_slash_r.png` — 连势裂斩（rare/attack）：造成 14 点伤害两次。消耗 5 层连势。

```
a hooded dark-armored void warrior in a dynamic offensive action, unleashing stored momentum as an explosive burst strike, fiery crimson and molten-orange embers accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `br_b_momentum_storm.png` — 连势风暴（rare/attack）：造成 8 点伤害五次。消耗 5 层连势。

```
a hooded dark-armored void warrior in a dynamic offensive action, unleashing stored momentum as an explosive burst strike, fiery crimson and molten-orange embers accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `br_b_power_master.png` — 力量奥义（rare/power）：获得 3 层力量。

```
a hooded dark-armored void warrior wreathed in a persistent magical aura, ritual pose, blade and arms glowing with empowering crimson runes, fiery crimson and molten-orange embers accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `br_b_primed_devastate.png` — 预热毁灭（rare/attack）：造成 35 点伤害。消耗 8 层连势。

```
a hooded dark-armored void warrior in a dynamic offensive action, unleashing stored momentum as an explosive burst strike, fiery crimson and molten-orange embers accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `br_b_primed_draw_r.png` — 破势过牌·极（rare/skill）：抽 5 张牌。消耗 4 层连势。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, converting swirling momentum into a fan of drawn cards, fiery crimson and molten-orange embers accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `br_b_primed_fortify_r.png` — 破势精通·极（rare/power）：获得 6 层破势预热。

```
a hooded dark-armored void warrior wreathed in a persistent magical aura, ritual pose, a coiled charge of energy about to burst, fiery crimson and molten-orange embers accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `br_b_primed_master.png` — 破势大师（rare/skill）：获得 5 层破势预热。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, a coiled charge of energy about to burst, fiery crimson and molten-orange embers accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `br_b_triple_rupture.png` — 三重裂变（rare/attack）：造成 10 点伤害三次。消耗 6 层连势。

```
a hooded dark-armored void warrior in a dynamic offensive action, unleashing stored momentum as an explosive burst strike, fiery crimson and molten-orange embers accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `burst_rare_atk_1.png` — 破势终结（rare/attack）：造成 30 点伤害。消耗所有连势和破势预热，每层造成额外 5 点伤害。

```
a hooded dark-armored void warrior in a dynamic offensive action, unleashing stored momentum as an explosive burst strike, fiery crimson and molten-orange embers accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `burst_rare_atk_2.png` — 连势风暴（rare/attack）：造成 8 点伤害五次。消耗 5 层连势。

```
a hooded dark-armored void warrior in a dynamic offensive action, unleashing stored momentum as an explosive burst strike, fiery crimson and molten-orange embers accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `burst_rare_atk_3.png` — 破势猛击（rare/attack）：造成 35 点伤害。消耗 8 层连势。

```
a hooded dark-armored void warrior in a dynamic offensive action, unleashing stored momentum as an explosive burst strike, fiery crimson and molten-orange embers accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `burst_rare_atk_4.png` — 爆发终结（rare/attack）：造成 40 点伤害。消耗所有能量。

```
a hooded dark-armored void warrior in a dynamic offensive action, channeling void power, fiery crimson and molten-orange embers accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `burst_rare_atk_5.png` — 破势连击（rare/attack）：造成 10 点伤害三次。消耗 6 层连势。

```
a hooded dark-armored void warrior in a dynamic offensive action, unleashing stored momentum as an explosive burst strike, fiery crimson and molten-orange embers accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `burst_rare_power_1.png` — 破势精通（rare/power）：获得 6 层破势预热。

```
a hooded dark-armored void warrior wreathed in a persistent magical aura, ritual pose, a coiled charge of energy about to burst, fiery crimson and molten-orange embers accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `burst_rare_power_2.png` — 连势精通（rare/power）：获得 6 层连势。

```
a hooded dark-armored void warrior wreathed in a persistent magical aura, ritual pose, swirling streams of momentum energy spiraling around the body, fiery crimson and molten-orange embers accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `burst_rare_power_3.png` — 力量觉醒（rare/power）：获得 3 层力量。

```
a hooded dark-armored void warrior wreathed in a persistent magical aura, ritual pose, blade and arms glowing with empowering crimson runes, fiery crimson and molten-orange embers accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `burst_rare_power_4.png` — 爆发大师（rare/power）：获得 4 层破势预热和 4 层连势。

```
a hooded dark-armored void warrior wreathed in a persistent magical aura, ritual pose, a coiled charge of energy about to burst, swirling streams of momentum energy spiraling around the body, fiery crimson and molten-orange embers accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `burst_rare_power_5.png` — 连势大师（rare/power）：获得 5 层连势和 2 层力量。

```
a hooded dark-armored void warrior wreathed in a persistent magical aura, ritual pose, swirling streams of momentum energy spiraling around the body, blade and arms glowing with empowering crimson runes, fiery crimson and molten-orange embers accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `burst_rare_skill_1.png` — 破势大师（rare/skill）：获得 5 层破势预热。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, a coiled charge of energy about to burst, fiery crimson and molten-orange embers accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `burst_rare_skill_2.png` — 连势大师（rare/skill）：获得 8 层连势。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, swirling streams of momentum energy spiraling around the body, fiery crimson and molten-orange embers accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `burst_rare_skill_3.png` — 破势过牌（rare/skill）：抽 5 张牌。消耗 4 层连势。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, converting swirling momentum into a fan of drawn cards, fiery crimson and molten-orange embers accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `burst_rare_skill_4.png` — 连势能量（rare/skill）：获得 4 点能量。消耗 5 层连势。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, channeling void power, fiery crimson and molten-orange embers accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `burst_rare_skill_5.png` — 破势防御（rare/skill）：获得 15 点格挡。消耗 3 层连势。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, channeling void power, fiery crimson and molten-orange embers accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `full_release.png` — 断流（rare/attack）：造成 6 点伤害，并消耗全部连势，每层额外造成 3 点伤害。抽 1 张牌。

```
a hooded dark-armored void warrior in a dynamic offensive action, unleashing stored momentum as an explosive burst strike, spectral cards and scrolls swirling toward the hand, fiery crimson and molten-orange embers accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `overload.png` — 过载（rare/skill）：消耗你手中所有攻击牌。每消耗一张，对一名随机敌人造成 8 点伤害。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, channeling void power, fiery crimson and molten-orange embers accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `burst_signal_banner.png` — 爆发旗帜（uncommon/attack）：造成 7 点伤害。

```
a hooded dark-armored void warrior in a dynamic offensive action, a single decisive heavy strike, fiery crimson and molten-orange embers accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `burst_strike.png` — 破势击（uncommon/attack）：造成 4 点伤害，并消耗全部连势，每层额外造成 3 点伤害。

```
a hooded dark-armored void warrior in a dynamic offensive action, unleashing stored momentum as an explosive burst strike, fiery crimson and molten-orange embers accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `follow_through.png` — 追击（uncommon/attack）：造成 4 点伤害，并消耗至多 2 层连势，每层额外造成 3 点伤害。若实际消耗了连势，获得 1 点能量。

```
a hooded dark-armored void warrior in a dynamic offensive action, unleashing stored momentum as an explosive burst strike, fiery crimson and molten-orange embers accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `snap_strike.png` — 断势击（uncommon/attack）：造成 5 点伤害，并消耗至多 2 层连势，每层额外造成 4 点伤害。

```
a hooded dark-armored void warrior in a dynamic offensive action, unleashing stored momentum as an explosive burst strike, fiery crimson and molten-orange embers accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `break_opening.png` — 压锋（common/skill）：获得 2 层连势。获得 1 层破势预热。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, swirling streams of momentum energy spiraling around the body, a coiled charge of energy about to burst, fiery crimson and molten-orange embers accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `quick_release.png` — 疾放（common/attack）：造成 3 点伤害，并消耗至多 1 层连势，每层额外造成 5 点伤害。

```
a hooded dark-armored void warrior in a dynamic offensive action, unleashing stored momentum as an explosive burst strike, fiery crimson and molten-orange embers accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

### mixed（33）

- `mixed_legendary_1.png` — 连势转化（legendary/skill）：消耗 3 层连势，获得 3 点能量。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, channeling void power, violet and magenta void energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `mixed_legendary_2.png` — 金属风暴（legendary/attack）：造成等同于你金属化层数 2 倍的伤害，然后获得等同于金属化层数的格挡。

```
a hooded dark-armored void warrior in a dynamic offensive action, channeling void power, violet and magenta void energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `mixed_legendary_3.png` — 攻守兼备（legendary/attack）：造成 8 点伤害。若你有格挡，额外造成 15 点伤害。

```
a hooded dark-armored void warrior in a dynamic offensive action, channeling void power, violet and magenta void energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `mixed_legendary_4.png` — 双势合一（legendary/skill）：获得 3 层连势和 3 层金属化。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, swirling streams of momentum energy spiraling around the body, skin hardening into dark metallic plating, violet and magenta void energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `mixed_legendary_5.png` — 势能爆发（legendary/attack）：消耗所有连势，每层造成 4 点伤害。获得 2 层力量。

```
a hooded dark-armored void warrior in a dynamic offensive action, unleashing stored momentum as an explosive burst strike, blade and arms glowing with empowering crimson runes, violet and magenta void energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `mixed_legendary_6.png` — 双生风暴（legendary/attack）：造成 8 点伤害并获得 8 点格挡，重复 2 次。消耗。

```
a hooded dark-armored void warrior in a dynamic offensive action, channeling void power, violet and magenta void energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `balance_edge.png` — 均衡刃（rare/attack）：造成 8 点伤害。若你本回合获得过格挡，额外造成 8 点伤害。

```
a hooded dark-armored void warrior in a dynamic offensive action, channeling void power, violet and magenta void energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `flow_shift.png` — 流转（rare/skill）：若你上回合打出过攻击：获得 12 点格挡。否则：对一名随机敌人造成 12 点伤害。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, channeling void power, violet and magenta void energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `mixed_rare_atk_1.png` — 攻防一体（rare/attack）：造成 15 点伤害，获得 10 点格挡。

```
a hooded dark-armored void warrior in a dynamic offensive action, a single decisive heavy strike, raising a glowing protective ward or shield, violet and magenta void energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `mixed_rare_atk_2.png` — 条件爆发（rare/attack）：造成 10 点伤害。若你有格挡，造成额外 15 点伤害。

```
a hooded dark-armored void warrior in a dynamic offensive action, channeling void power, violet and magenta void energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `mixed_rare_atk_3.png` — 灵活连击（rare/attack）：造成 6 点伤害三次，获得 6 点格挡。

```
a hooded dark-armored void warrior in a dynamic offensive action, a rapid multi-hit flurry of strikes, raising a glowing protective ward or shield, violet and magenta void energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `mixed_rare_atk_4.png` — 连势打击（rare/attack）：造成 8 点伤害。消耗 3 层连势，造成额外 12 点伤害。

```
a hooded dark-armored void warrior in a dynamic offensive action, unleashing stored momentum as an explosive burst strike, violet and magenta void energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `mixed_rare_power_1.png` — 连势大师（rare/power）：获得 6 层连势。

```
a hooded dark-armored void warrior wreathed in a persistent magical aura, ritual pose, swirling streams of momentum energy spiraling around the body, violet and magenta void energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `mixed_rare_power_2.png` — 金属化精通（rare/power）：获得 6 层金属化。

```
a hooded dark-armored void warrior wreathed in a persistent magical aura, ritual pose, skin hardening into dark metallic plating, violet and magenta void energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `mixed_rare_power_3.png` — 力量领悟（rare/power）：获得 3 层力量。

```
a hooded dark-armored void warrior wreathed in a persistent magical aura, ritual pose, blade and arms glowing with empowering crimson runes, violet and magenta void energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `mixed_rare_skill_1.png` — 灵活防御（rare/skill）：获得 12 点格挡，造成 5 点伤害。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, raising a glowing protective ward or shield, a sweeping area strike crashing into several enemies at once, violet and magenta void energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `mixed_rare_skill_2.png` — 势能壁垒（rare/skill）：获得 10 点格挡，获得 5 层连势。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, raising a glowing protective ward or shield, swirling streams of momentum energy spiraling around the body, violet and magenta void energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `mixed_rare_skill_3.png` — 灵活过牌（rare/skill）：抽 4 张牌，获得 6 点格挡。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, spectral cards and scrolls swirling toward the hand, raising a glowing protective ward or shield, violet and magenta void energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `mx_a_absolute_break.png` — 绝对破击（rare/attack）：造成 15 点伤害，施加 2 层易伤，获得 6 点格挡。

```
a hooded dark-armored void warrior in a dynamic offensive action, a single decisive heavy strike, target armor cracking apart with glowing red fissures, raising a glowing protective ward or shield, violet and magenta void energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `mx_a_adaptive_mastery.png` — 适应精通（rare/skill）：获得 3 层力量，获得 3 层金属化。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, blade and arms glowing with empowering crimson runes, skin hardening into dark metallic plating, violet and magenta void energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `mx_a_balanced_harmony.png` — 均衡和谐（rare/power）：获得 3 层力量，获得 3 层金属化。

```
a hooded dark-armored void warrior wreathed in a persistent magical aura, ritual pose, blade and arms glowing with empowering crimson runes, skin hardening into dark metallic plating, violet and magenta void energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `mx_a_fortified_momentum.png` — 固守连势（rare/skill）：获得 10 点格挡，获得 4 层连势。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, raising a glowing protective ward or shield, swirling streams of momentum energy spiraling around the body, violet and magenta void energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `mx_a_iron_curtain.png` — 铁幕降临（rare/skill）：获得 12 点格挡，获得 2 层金属化，抽 2 张牌。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, raising a glowing protective ward or shield, skin hardening into dark metallic plating, spectral cards and scrolls swirling toward the hand, violet and magenta void energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `mx_a_momentum_ascension.png` — 连势升腾（rare/power）：获得 4 层连势，获得 2 层金属化。

```
a hooded dark-armored void warrior wreathed in a persistent magical aura, ritual pose, swirling streams of momentum energy spiraling around the body, skin hardening into dark metallic plating, violet and magenta void energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `mx_a_momentum_crescendo.png` — 连势渐强（rare/attack）：造成 5 点伤害两次。消耗 2 层连势，额外造成 5 点伤害。

```
a hooded dark-armored void warrior in a dynamic offensive action, a rapid multi-hit flurry of strikes, unleashing stored momentum as an explosive burst strike, violet and magenta void energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `mx_a_momentum_devastation.png` — 连势毁灭（rare/attack）：造成 12 点伤害。消耗所有连势，每层额外造成 4 点伤害。抽 1 张牌。

```
a hooded dark-armored void warrior in a dynamic offensive action, unleashing stored momentum as an explosive burst strike, spectral cards and scrolls swirling toward the hand, violet and magenta void energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `mx_a_momentum_unleash.png` — 连势释放（rare/skill）：抽 3 张牌，获得 2 点能量。消耗 2 层连势。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, spectral cards and scrolls swirling toward the hand, converting swirling momentum into a fan of drawn cards, a surging radiant energy core flaring with power, violet and magenta void energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `mx_a_unyielding_guard.png` — 不屈守卫（rare/power）：获得 3 层金属化，获得 2 层稳势。

```
a hooded dark-armored void warrior wreathed in a persistent magical aura, ritual pose, skin hardening into dark metallic plating, a steady braced stance ringed by layered translucent wards, violet and magenta void energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `cash_flow.png` — 转势（uncommon/skill）：抽 1 张牌，并消耗全部连势，每层额外抽 1 张牌。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, converting swirling momentum into a fan of drawn cards, violet and magenta void energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `momentum.png` — 蓄势（uncommon/skill）：获得 2 层连势（每次出牌后获得等同层数的格挡，并衰减 1 层）。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, swirling streams of momentum energy spiraling around the body, violet and magenta void energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `release_flow.png` — 放势（uncommon/skill）：抽 1 张牌，并消耗至多 2 层连势，每层额外抽 1 张牌。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, converting swirling momentum into a fan of drawn cards, violet and magenta void energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `prime_rhythm.png` — 起手式（common/skill）：获得 2 层连势，抽 1 张牌。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, swirling streams of momentum energy spiraling around the body, spectral cards and scrolls swirling toward the hand, violet and magenta void energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `tempo_guard.png` — 守势（common/skill）：获得 3 点格挡，并获得 2 层连势。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, raising a glowing protective ward or shield, swirling streams of momentum energy spiraling around the body, violet and magenta void energy accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

### neutral（39）

- `neutral_legendary_1.png` — 命运之轮（legendary/skill）：消耗所有连势。每消耗 1 层，抽 1 张牌。消耗。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, converting swirling momentum into a fan of drawn cards, muted grey-gold ethereal light accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `neutral_legendary_2.png` — 虚空契约（legendary/skill）：失去 6 点生命，获得 3 层连势和 3 层稳势。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, a single decisive heavy strike, swirling streams of momentum energy spiraling around the body, a steady braced stance ringed by layered translucent wards, muted grey-gold ethereal light accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `neutral_rare_atk_1.png` — 终极打击（rare/attack）：造成 20 点伤害。

```
a hooded dark-armored void warrior in a dynamic offensive action, a single decisive heavy strike, muted grey-gold ethereal light accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `neutral_rare_atk_2.png` — 连击风暴（rare/attack）：造成 5 点伤害四次。

```
a hooded dark-armored void warrior in a dynamic offensive action, a rapid multi-hit flurry of strikes, muted grey-gold ethereal light accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `neutral_rare_atk_3.png` — 顺劈风暴（rare/attack）：对所有敌人造成 15 点伤害。

```
a hooded dark-armored void warrior in a dynamic offensive action, a sweeping area strike crashing into several enemies at once, muted grey-gold ethereal light accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `neutral_rare_atk_4.png` — 破甲风暴（rare/attack）：造成 12 点伤害，施加 3 层易伤。

```
a hooded dark-armored void warrior in a dynamic offensive action, a single decisive heavy strike, target armor cracking apart with glowing red fissures, muted grey-gold ethereal light accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `neutral_rare_power_1.png` — 力量觉醒（rare/power）：获得 4 层力量。

```
a hooded dark-armored void warrior wreathed in a persistent magical aura, ritual pose, blade and arms glowing with empowering crimson runes, muted grey-gold ethereal light accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `neutral_rare_power_2.png` — 易伤精通（rare/power）：对所有敌人施加 3 层易伤。

```
a hooded dark-armored void warrior wreathed in a persistent magical aura, ritual pose, target armor cracking apart with glowing red fissures, muted grey-gold ethereal light accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `neutral_rare_power_3.png` — 虚弱精通（rare/power）：对所有敌人施加 3 层虚弱。

```
a hooded dark-armored void warrior wreathed in a persistent magical aura, ritual pose, draining grey mist sapping the strength of a foe, muted grey-gold ethereal light accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `neutral_rare_skill_1.png` — 铁壁防御（rare/skill）：获得 20 点格挡。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, raising a glowing protective ward or shield, muted grey-gold ethereal light accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `neutral_rare_skill_2.png` — 扫视风暴（rare/skill）：抽 5 张牌。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, spectral cards and scrolls swirling toward the hand, muted grey-gold ethereal light accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `neutral_rare_skill_3.png` — 涌能风暴（rare/skill）：获得 3 点能量。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, a surging radiant energy core flaring with power, muted grey-gold ethereal light accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `neutral_rare_skill_4.png` — 柔韧风暴（rare/skill）：获得 5 层力量。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, blade and arms glowing with empowering crimson runes, muted grey-gold ethereal light accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `neutral_rare_skill_5.png` — 治疗风暴（rare/skill）：回复 20 点生命。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, soft restorative light mending wounds, muted grey-gold ethereal light accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `nt_d_annihilation.png` — 毁灭横扫（rare/attack）：对所有敌人造成 14 点伤害。

```
a hooded dark-armored void warrior in a dynamic offensive action, a sweeping area strike crashing into several enemies at once, muted grey-gold ethereal light accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `nt_d_citadel.png` — 堡垒（rare/skill）：获得 18 点格挡。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, raising a glowing protective ward or shield, muted grey-gold ethereal light accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `nt_d_fortress.png` — 要塞（rare/power）：获得 3 层金属化。

```
a hooded dark-armored void warrior wreathed in a persistent magical aura, ritual pose, skin hardening into dark metallic plating, muted grey-gold ethereal light accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `nt_d_judgement_cut.png` — 裁决之刃（rare/attack）：造成 20 点伤害。

```
a hooded dark-armored void warrior in a dynamic offensive action, a single decisive heavy strike, muted grey-gold ethereal light accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `nt_d_mighty_blow.png` — 万钧一击（rare/attack）：造成 16 点伤害，获得 8 点格挡。

```
a hooded dark-armored void warrior in a dynamic offensive action, a single decisive heavy strike, raising a glowing protective ward or shield, muted grey-gold ethereal light accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `nt_d_momentum_draw_burst.png` — 连势涌现（rare/skill）：抽 3 张牌。消耗 3 层连势，每层额外抽 1 张牌。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, converting swirling momentum into a fan of drawn cards, muted grey-gold ethereal light accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `nt_d_momentum_overflow.png` — 连势满溢（rare/skill）：获得 5 层力量，获得 2 层连势。消耗。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, blade and arms glowing with empowering crimson runes, swirling streams of momentum energy spiraling around the body, muted grey-gold ethereal light accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `nt_d_momentum_unleash.png` — 连势释放（rare/attack）：造成 8 点伤害。消耗所有连势，每层造成额外 4 点伤害。

```
a hooded dark-armored void warrior in a dynamic offensive action, unleashing stored momentum as an explosive burst strike, muted grey-gold ethereal light accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `nt_d_steady_fortification.png` — 稳固防线（rare/skill）：获得 2 层稳势，获得 10 点格挡。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, a steady braced stance ringed by layered translucent wards, raising a glowing protective ward or shield, muted grey-gold ethereal light accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `nt_d_storm_slash.png` — 风暴斩（rare/attack）：造成 5 点伤害四次。

```
a hooded dark-armored void warrior in a dynamic offensive action, a rapid multi-hit flurry of strikes, muted grey-gold ethereal light accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `burn_edge.png` — 燃锋（uncommon/attack）：造成 14 点伤害。消耗。

```
a hooded dark-armored void warrior in a dynamic offensive action, a single decisive heavy strike, muted grey-gold ethereal light accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `clear_mind.png` — 清念（uncommon/skill）：抽 2 张牌，获得 2 点能量。消耗。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, spectral cards and scrolls swirling toward the hand, a surging radiant energy core flaring with power, muted grey-gold ethereal light accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `bash.png` — 重击（common/attack）：造成 7 点伤害，施加 2 层易伤。

```
a hooded dark-armored void warrior in a dynamic offensive action, a single decisive heavy strike, target armor cracking apart with glowing red fissures, muted grey-gold ethereal light accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `cleave.png` — 顺劈（common/attack）：对所有敌人造成 8 点伤害。

```
a hooded dark-armored void warrior in a dynamic offensive action, a sweeping area strike crashing into several enemies at once, muted grey-gold ethereal light accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `defend.png` — 防御（common/skill）：获得 5 点格挡。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, raising a glowing protective ward or shield, muted grey-gold ethereal light accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `flex.png` — 柔韧（common/skill）：获得 2 点力量。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, blade and arms glowing with empowering crimson runes, muted grey-gold ethereal light accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `measured_rest.png` — 养息（common/skill）：回复 3 点生命，获得 4 点格挡，并获得 1 层连势。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, soft restorative light mending wounds, raising a glowing protective ward or shield, swirling streams of momentum energy spiraling around the body, muted grey-gold ethereal light accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `patch_breath.png` — 调息（common/skill）：回复 4 点生命，获得 4 点格挡。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, soft restorative light mending wounds, raising a glowing protective ward or shield, muted grey-gold ethereal light accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `recenter.png` — 回气（common/skill）：抽 1 张牌，获得 1 点能量。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, spectral cards and scrolls swirling toward the hand, a surging radiant energy core flaring with power, muted grey-gold ethereal light accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `second_wind.png` — 续拍（common/skill）：获得 5 点格挡，获得 1 点能量。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, raising a glowing protective ward or shield, a surging radiant energy core flaring with power, muted grey-gold ethereal light accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `skim.png` — 扫视（common/skill）：抽 2 张牌。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, spectral cards and scrolls swirling toward the hand, muted grey-gold ethereal light accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `steady_step.png` — 整步（common/skill）：获得 6 点格挡，抽 1 张牌。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, raising a glowing protective ward or shield, spectral cards and scrolls swirling toward the hand, muted grey-gold ethereal light accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `strike.png` — 打击（common/attack）：造成 6 点伤害。

```
a hooded dark-armored void warrior in a dynamic offensive action, a single decisive heavy strike, muted grey-gold ethereal light accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `surge.png` — 涌能（common/skill）：获得 1 点能量。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, a surging radiant energy core flaring with power, muted grey-gold ethereal light accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```

- `survey_field.png` — 观势（common/skill）：抽 2 张牌。获得 1 层连势。

```
a hooded dark-armored void warrior performing a focused defensive or utility gesture, spectral cards and scrolls swirling toward the hand, swirling streams of momentum energy spiraling around the body, muted grey-gold ethereal light accents, dark fantasy game card illustration, ruined ancient temple and void spire setting, dramatic chiaroscuro lighting, painterly, highly detailed, centered composition, no text, no border, no UI, no card frame, square 1:1, 1024x1024
```
