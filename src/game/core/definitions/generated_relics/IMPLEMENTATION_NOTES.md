# Generated Relics - Implementation Notes

Each relic below requires a hook point in the battle/event system to function.
This file documents the suggested hook point for each relic.

## Batch 1 (Momentum/Flow themed)

| Relic ID | Name | Suggested Hook Point |
|----------|------|---------------------|
| momentum_siphon | 汲势晶 | `onMomentumConsumed` - after momentum is consumed, grant block equal to consumed stacks |
| momentum_echo | 连势回响 | `onTurnEnd` - if momentum consumed 2+ times this turn, gain 2 momentum |
| tide_mirror | 潮汐之镜 | `onMomentumDecay` - when momentum is lost, gain half (rounded up) as block |
| momentum_catalyst | 连势催化器 | `onMomentumGain` - if current momentum >= 5, gain +1 extra |
| flow_anchor | 定流锚 | `onTurnStart` - if momentum >= 3, gain 3 block |
| surge_drain | 涌势虹吸 | `onMomentumConsumed` - heal 1 HP per consumption |
| momentum_lens | 势态望远镜 | `onMomentumGain` - at every 5th momentum stack, draw 1 card (max 3/battle) |
| residual_flame | 残焰余烬 | `onBattleEnd` - if momentum >= 3, set flag for next battle start |
| unbroken_flow | 不竭之流 | `onMomentumConsumed` - if remaining momentum >= 2 after consumption, draw 1 |
| tide_walker | 踏浪者 | `onMomentumConsume` - reduce consumption cost by 1 (min 0) |

## Batch 2 (Block/Guard themed)

| Relic ID | Name | Suggested Hook Point |
|----------|------|---------------------|
| stone_bulwark | 岩壁壁垒 | `onBlockGain` - if current block == 0, gain +3 extra block |
| echo_plating | 回响甲片 | `onBattleStart` - gain 2 metallicize stacks |
| thorn_root | 荆棘之根 | `onTakeDamage` - when hit by enemy, gain 1 metallicize (this battle) |
| iron_resolve | 铁意决心 | `onTakeDamage` - if block >= 10, reduce incoming damage by 2 |
| bulwark_sigil | 壁垒印记 | `onPlayBlockCard` - when playing a block card, gain +1 extra block |
| fortify_root | 固本之根 | `onTurnEnd` - if block >= 5, retain half block (rounded down) |
| shell_shard | 硬壳碎片 | `onFirstHpLoss` - first time HP is lost in battle, gain 8 block |
| ward_of_rust | 锈蚀之盾 | `onTakeDamage` - when hit and block not broken, deal 2 damage to attacker |
| enduring_wall | 不朽之墙 | `onBlockLoss` - when losing >= 5 block at once, gain 1 steady guard |
| barrier_echo | 屏障回音 | `onExhaustBlockCard` - when exhausting a block card, gain 2 block |

## Batch 3 (Utility/Synergy themed)

| Relic ID | Name | Suggested Hook Point |
|----------|------|---------------------|
| void_charm | 虚空护符 | `onDiscard` - when discarding a card, gain 1 block |
| echo_charm | 回音护符 | `onPlayPowerCard` - when playing a power, draw 1 card (max 2/turn) |
| memory_shard | 记忆碎片 | `onPlaySkillCard` - after playing skill, next card costs -1 (min 0, max 2/turn) |
| meditation_stone | 冥想石 | `onPlaySkillCard` - after playing skill, gain 1 block |
| guard_momentum_link | 守势联动 | `onBlockGain` - when gaining block from a block card, gain 1 momentum (max 2/turn) |
| flow_resonance | 流势共振 | `onMomentumGain` - if hand has attack card, draw 1 (max 2/turn) |
| dual_momentum | 双势合一 | `onTurnStart` - if momentum + steady_guard >= 5, attack/skill effects +50% |
| alternating_crest | 交替纹章 | `onPlayCard` - after playing attack-skill-attack sequence, draw 1 |
| chain_bolt | 链锁之扣 | `onPlayAttackCard` - after 3+ attacks in a turn, next attack +8 damage |
| draw_power_sigil | 抽力印记 | `onDrawCard` - when drawing, gain block equal to strength stacks (max 5/turn) |
| cycle_engine | 循环引擎 | `onPlayCard` - after playing both attack and skill in a turn, draw 1 (max 2/turn) |
| resonance_plating | 共振甲片 | `onExhaustAnyCard` - when exhausting any card, gain 1 block |
| sanctuary_bell | 庇护钟 | `onBlockGain` - after accumulating 15 block gained this turn, heal 1 (max 2/turn) |
| bulwark_heart | 壁垒之心 | `onMomentumConsumed` - when consuming momentum, gain 2 block |
| rending_slash | 裂斩之牙 | `onMomentumConsumed` - when consuming 5+ momentum, deal bonus 6 damage |
| volatile_core | 不稳定核心 | `onMomentumConsumed` - deal 50% of consumed momentum as bonus damage (rounded up) |
| soul_echo | 灵魂回响 | `onPlayPowerCard` - when playing power, gain 1 energy (max 1/turn) |
| alternating_crest | 交替纹章 | `onPlayCardSequence` - after attack-skill-attack in same turn, draw 1 |
