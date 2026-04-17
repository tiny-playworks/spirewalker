行，喵总，既然你都点了 123，那咱就不装含蓄了，直接把这项目的骨架、数据模型、状态机一次性打通。人类最爱在“先做点简单的”里把项目做散，咱别走那条老路 😼

我会按这个顺序来讲：

先给你一个能落地的整体架构
再把核心 TypeScript 数据模型定出来
最后把《杀戮尖塔》味儿的战斗状态机和关键流程串起来

整个目标不是“讲概念”，而是让你看完以后就能开仓库、起目录、开始写 MVP。

⸻

一、项目架构骨架

核心原则还是那句：

React 负责应用和面板 UI，Phaser 负责战斗/地图场景表现，规则逻辑抽成纯 TS Core。

不要让 React 和 Phaser 都各自管一套游戏真相。那个做法很适合把自己气出工伤。

1. 你这个项目最稳的分层

App Shell 层
处理网页应用级的事情：
• 路由和页面切换
• 顶层布局
• 设置页、主菜单、存档管理
• 全局弹窗
• Debug 开关
• 音量、快捷键、语言等设置

这层是 React 的地盘。

Game Core 层
纯 TypeScript，不依赖 React，不依赖 Phaser。

它负责：
• Run 状态
• Battle 状态
• Map 状态
• Reward / Shop / Event 逻辑
• 卡牌结算
• Buff Hook
• 怪物 AI
• RNG / Seed
• 存档序列化

你可以把它理解成“游戏大脑”。

Renderer / Scene 层
Phaser 负责：
• 战斗场景渲染
• 单位、卡牌、攻击、粒子、数字跳字
• 拖拽和空间交互
• 地图节点的可视化
• 镜头、Tween、时间轴

它不负责决定“这张牌能不能打出去”，只负责“这张牌飞出去长什么样”。

UI 层
React 负责：
• HUD
• 手牌说明 / 卡牌详情
• 回合按钮
• 玩家属性区
• 敌人意图描述
• 奖励三选一
• 商店购买 UI
• 地图上的额外说明面板
• 事件文本与选项

也就是说，React 做“信息组织”，Phaser 做“空间表现”。

⸻

2. 推荐目录结构

我给你一个贴近真实前端工程项目的版本：

src/
app/
App.tsx
router/
providers/
layouts/

game/
core/
model/
card.ts
unit.ts
status.ts
relic.ts
battle.ts
map.ts
reward.ts
run.ts

      definitions/
        cards/
          starter.ts
          ironclad.ts
        statuses/
        monsters/
        relics/
        events/

      engine/
        GameEngine.ts
        BattleEngine.ts
        MapEngine.ts
        RewardEngine.ts

      systems/
        battleFlow.ts
        playCard.ts
        drawCard.ts
        damage.ts
        block.ts
        statusHooks.ts
        enemyAi.ts
        deathCheck.ts

      commands/
        types.ts
        playCardCommand.ts
        endTurnCommand.ts
        chooseRewardCommand.ts
        chooseMapNodeCommand.ts

      events/
        types.ts

      utils/
        rng.ts
        id.ts
        invariant.ts
        shuffle.ts

    store/
      gameStore.ts
      selectors.ts
      uiStore.ts

    phaser/
      index.ts
      gameFactory.ts
      scenes/
        BootScene.ts
        BattleScene.ts
        MapScene.ts
      objects/
        CardSprite.ts
        UnitSprite.ts
        IntentBadge.ts
      controllers/
        DragController.ts
        AnimationController.ts
        SceneBridge.ts

features/
battle/
components/
BattleHUD.tsx
HandInfoPanel.tsx
TurnButton.tsx
TargetHint.tsx

    reward/
      RewardModal.tsx

    map/
      MapOverlay.tsx

    shop/
      ShopModal.tsx

    event/
      EventModal.tsx

shared/
components/
hooks/
lib/
styles/
types/

这个结构的重点不是“文件名优雅”，而是责任分离：
• core 纯逻辑
• phaser 纯表现
• features 纯 React 业务 UI
• store 是桥

⸻

3. React 和 Phaser 的共存方式

最推荐的方案是：
• Zustand 做统一 store
• GameEngine 做唯一状态修改入口
• React / Phaser 都只订阅状态和事件

关系是这样：

用户输入
-> dispatch(command)
-> GameEngine.reduce(state, command)
-> nextState + gameEvents
-> store 更新 state / eventQueue
-> React 重渲染
-> Phaser 播放表现

也就是：

命令驱动逻辑，状态驱动 UI，事件驱动动画。

这个分法非常适合前端工程师，因为它和你熟悉的“单向数据流”是一脉相承的，只是把渲染器从 DOM 扩展到了 Phaser Scene。

⸻

4. 推荐的 store 设计

别把所有东西都扔一个 store，读起来会像下水道。

建议拆成：

gameStore
存真正的游戏状态：

interface GameStoreState {
run: RunState | null;
battle: BattleState | null;
ui: UIState;
pendingEvents: GameEvent[];
dispatchCommand: (command: GameCommand) => void;
}

uiStore
如果你后面 UI 状态很多，也可以拆一个：

interface UIState {
hoveredCardId: string | null;
selectedTargetId: string | null;
draggingCardId: string | null;
modal:
| { type: 'none' }
| { type: 'reward' }
| { type: 'shop' }
| { type: 'event'; eventId: string };
inputLocked: boolean;
}

战斗逻辑别被 tooltip 这种东西污染。你一个纯洁的 BattleState，不该知道鼠标悬停在第几张牌上。世界已经够乱了，别再添乱。

⸻

5. Phaser 与 React 通信怎么做最顺

不要双向乱通。

最稳的方式：

React -> Engine
通过 dispatchCommand

比如：
• 点击结束回合
• 点击奖励卡牌
• 选择地图节点
• 点商店购买

Phaser -> Engine
也是 dispatchCommand

比如：
• 卡牌拖拽释放
• 敌人被点击作为目标
• 地图节点点击

Engine -> React / Phaser
通过两样东西输出：
• nextState
• GameEvent[]

React 读 state 更新界面。
Phaser 读 event 播动画。

这就叫职责清清楚楚，没有谁偷偷当主角。

⸻

二、核心数据模型设计

这一段最值钱。模型不稳，后面每写一张牌都像在往危楼上贴瓷砖。

⸻

1. 顶层 RunState

《杀戮尖塔》不是“只有一场战斗”，它是一个 run，所以顶层必须先有 run。

export interface RunState {
seed: number;
player: PlayerRunState;
map: MapState;
screen: ScreenState;
battle?: BattleState;
rewards?: RewardState;
shop?: ShopState;
event?: EventState;
meta: {
floor: number;
gold: number;
relics: string[];
potions: string[];
};
}

这里 screen 很重要，它决定当前流程在哪：

export type ScreenState =
| { type: 'main_menu' }
| { type: 'map' }
| { type: 'battle' }
| { type: 'reward' }
| { type: 'shop' }
| { type: 'event' }
| { type: 'rest' }
| { type: 'game_over' }
| { type: 'victory' };

这样 React 顶层渲染会非常自然：

switch (run.screen.type) {
case 'battle':
return <BattlePage />;
case 'map':
return <MapPage />;
case 'reward':
return <RewardPage />;
}

⸻

2. 卡牌定义与实例分离

这一定要做。别偷懒。

卡牌静态定义

export type CardType = 'attack' | 'skill' | 'power';
export type CardRarity = 'common' | 'uncommon' | 'rare';
export type CardTarget = 'none' | 'self' | 'single_enemy' | 'all_enemies';

export interface CardDefinition {
id: string;
name: string;
description: string;
type: CardType;
rarity: CardRarity;
cost: number;
target: CardTarget;
exhaust?: boolean;
ethereal?: boolean;
retain?: boolean;
effects: EffectDefinition[];
upgradedFrom?: string;
}

战斗中的卡牌实例

export interface CardInstance {
instanceId: string;
definitionId: string;
baseCost: number;
costForTurn: number;
upgraded: boolean;
createdBy?: string;
modifiers: CardModifier[];
}

卡牌修正器

export interface CardModifier {
id: string;
type:
| 'cost_delta'
| 'damage_delta'
| 'block_delta'
| 'retain'
| 'ethereal'
| 'exhaust';
value?: number;
duration: 'turn' | 'battle' | 'permanent';
}

这样你之后做：
• 临时减费
• 本回合保留
• 复制牌
• 随机生成牌
• 升级牌
• 遗物导致的出牌修正

都不会痛苦得像在啃钢筋。

⸻

3. 效果 EffectDefinition

建议前期就声明式，不要所有牌都写成脚本函数。

export type EffectDefinition =
| { type: 'damage'; value: number; target: 'selected' | 'all_enemies' | 'self' }
| { type: 'block'; value: number; target: 'self' | 'selected' }
| { type: 'draw'; value: number }
| { type: 'gain_energy'; value: number }
| { type: 'apply_status'; statusId: string; value: number; target: 'self' | 'selected' | 'all_enemies' }
| { type: 'discard'; value: number }
| { type: 'heal'; value: number; target: 'self' | 'selected' }
| { type: 'repeat'; times: number; effects: EffectDefinition[] }
| { type: 'custom'; scriptId: string; params?: Record<string, unknown> };

建议策略是：
• 80% 卡牌用声明式 effects 组合
• 20% 复杂卡牌走 custom

这样你不会一开始就陷进“我要做超强 DSL 编辑器”的幻觉里。前端人太容易把内容系统先做成平台，最后游戏没做出来，平台倒是很完整，像个悲壮的纪念碑。

⸻

4. 玩家与怪物统一抽象

建议统一成 CombatUnit，只在扩展层分玩家和怪物。

export interface CombatUnit {
id: string;
side: 'player' | 'enemy';
name: string;
hp: number;
maxHp: number;
block: number;
alive: boolean;

stats: {
strength: number;
dexterity: number;
};

statuses: StatusInstance[];
}

玩家战斗态：

export interface PlayerBattleState {
unitId: string;
energy: number;
maxEnergy: number;

drawPile: string[]; // card instance ids
hand: string[];
discardPile: string[];
exhaustPile: string[];

cards: Record<string, CardInstance>;
}

怪物战斗态：

export interface MonsterBattleState {
unitId: string;
monsterId: string;
intent: MonsterIntent | null;
moveHistory: string[];
}

怪物意图：

export type MonsterIntent =
| { type: 'attack'; value: number; hits?: number }
| { type: 'block'; value: number }
| { type: 'buff'; statusId: string; value: number }
| { type: 'debuff'; statusId: string; value: number }
| { type: 'attack_buff'; attack: number; statusId: string; value: number };

⸻

5. Buff / Debuff 状态系统

你要做杀戮尖塔味，状态系统必须稍微正规一点。

export interface StatusInstance {
id: string;
stacks: number;
sourceUnitId?: string;
}

状态定义：

export interface StatusDefinition {
id: string;
name: string;
description: string;
stackBehavior: 'add' | 'replace' | 'refresh';
hooks: StatusHook[];
}

Hook：

export type StatusHook =
| { trigger: 'onBattleStart'; scriptId: string }
| { trigger: 'onTurnStart'; scriptId: string }
| { trigger: 'onTurnEnd'; scriptId: string }
| { trigger: 'onBeforePlayCard'; scriptId: string }
| { trigger: 'onAfterPlayCard'; scriptId: string }
| { trigger: 'onBeforeDealDamage'; scriptId: string }
| { trigger: 'onBeforeTakeDamage'; scriptId: string }
| { trigger: 'onAfterTakeDamage'; scriptId: string }
| { trigger: 'onDeath'; scriptId: string };

这样：
• 力量可以在 onBeforeDealDamage
• 虚弱可以在 onBeforeDealDamage
• 易伤可以在 onBeforeTakeDamage
• 中毒可以在 onTurnEnd
• 金属化可以在 onTurnEnd

全部挂进去。

⸻

6. BattleState

这是战斗的心脏。

export type BattlePhase =
| 'battle_init'
| 'turn_start'
| 'draw_phase'
| 'player_action'
| 'resolving'
| 'turn_end'
| 'enemy_turn'
| 'victory'
| 'defeat';

export type InputMode =
| 'idle'
| 'dragging_card'
| 'selecting_target'
| 'animation_lock';

export interface BattleState {
id: string;
turn: number;
phase: BattlePhase;
inputMode: InputMode;

playerUnitId: string;
enemyUnitIds: string[];

units: Record<string, CombatUnit>;
player: PlayerBattleState;
monsters: Record<string, MonsterBattleState>;

pendingAction:
| null
| {
type: 'play_card';
cardInstanceId: string;
sourceUnitId: string;
};

lastResolvedEvents: GameEvent[];
}

关键点在于：
• phase 管逻辑流程
• inputMode 管交互锁定
• pendingAction 管“正在选择目标的那张牌”
• lastResolvedEvents 给表现层消费

⸻

7. MapState / RewardState / ShopState

地图

export type MapNodeType =
| 'battle'
| 'elite'
| 'event'
| 'shop'
| 'rest'
| 'treasure'
| 'boss';

export interface MapNode {
id: string;
floor: number;
x: number;
y: number;
type: MapNodeType;
nextNodeIds: string[];
visited: boolean;
}

export interface MapState {
nodes: Record<string, MapNode>;
currentNodeId: string | null;
}

奖励

export type RewardItem =
| { type: 'gold'; amount: number }
| { type: 'card_choice'; cards: string[] }
| { type: 'relic'; relicId: string }
| { type: 'potion'; potionId: string };

export interface RewardState {
items: RewardItem[];
claimed: boolean;
}

商店

export interface ShopOfferCard {
definitionId: string;
price: number;
}

export interface ShopOfferRelic {
relicId: string;
price: number;
}

export interface ShopState {
cards: ShopOfferCard[];
relics: ShopOfferRelic[];
removeCardPrice: number;
}

⸻

三、Command 与 Event 设计

这个是项目工程化最重要的味道之一。
不要让点击事件直接改游戏状态。那是小 demo 的做法，不是长期项目的做法。

⸻

1. Command

Command 是“用户或系统请求做某件事”。

export type GameCommand =
| { type: 'START_RUN'; seed?: number }
| { type: 'ENTER_BATTLE'; battleId: string }
| { type: 'PLAY_CARD'; cardInstanceId: string; sourceUnitId: string; targetUnitId?: string }
| { type: 'END_TURN' }
| { type: 'SELECT_REWARD_CARD'; definitionId: string }
| { type: 'TAKE_REWARD_GOLD'; amount: number }
| { type: 'CHOOSE_MAP_NODE'; nodeId: string }
| { type: 'BUY_SHOP_CARD'; definitionId: string }
| { type: 'RESOLVE_ANIMATION_DONE' };

Command 的价值在于：
• 日志化
• 回放
• 单测
• AI 共用同一套入口
• 以后加手柄/键盘/自动出牌也都复用

⸻

2. Event

Event 是“刚刚发生了什么”。

export type GameEvent =
| { type: 'TURN_STARTED'; turn: number; unitId: string }
| { type: 'CARD_DRAWN'; unitId: string; cardInstanceId: string }
| { type: 'CARD_PLAYED'; unitId: string; cardInstanceId: string; targetUnitId?: string }
| { type: 'ENERGY_CHANGED'; unitId: string; value: number }
| { type: 'DAMAGE_DEALT'; sourceUnitId: string; targetUnitId: string; value: number }
| { type: 'BLOCK_GAINED'; unitId: string; value: number }
| { type: 'STATUS_APPLIED'; unitId: string; statusId: string; value: number }
| { type: 'UNIT_DIED'; unitId: string }
| { type: 'TURN_ENDED'; unitId: string }
| { type: 'BATTLE_WON' }
| { type: 'BATTLE_LOST' };

React 可以拿它做战斗日志，Phaser 可以拿它播动画。

⸻

四、GameEngine 最小骨架

这个给你一个真实点的雏形。

export interface EngineResult {
nextRun: RunState;
events: GameEvent[];
}

export class GameEngine {
dispatch(run: RunState, command: GameCommand): EngineResult {
switch (command.type) {
case 'PLAY_CARD':
return this.playCard(run, command);
case 'END_TURN':
return this.endTurn(run);
case 'CHOOSE_MAP_NODE':
return this.chooseMapNode(run, command);
default:
return { nextRun: run, events: [] };
}
}

private playCard(run: RunState, command: Extract<GameCommand, { type: 'PLAY_CARD' }>): EngineResult {
if (!run.battle) return { nextRun: run, events: [] };

    const battle = run.battle;
    if (battle.phase !== 'player_action') return { nextRun: run, events: [] };

    // 1. 校验
    // 2. 扣能量
    // 3. 卡牌移区
    // 4. 执行 effects
    // 5. 检查死亡
    // 6. 返回 nextRun + events

    return { nextRun: run, events: [] };

}

private endTurn(run: RunState): EngineResult {
return { nextRun: run, events: [] };
}

private chooseMapNode(run: RunState, command: Extract<GameCommand, { type: 'CHOOSE_MAP_NODE' }>): EngineResult {
return { nextRun: run, events: [] };
}
}

初期没必要过度 OO，也没必要强上 ECS。
你做的是卡牌回合制，不是模拟 5000 个士兵同时冲锋。别给自己上刑。

⸻

五、战斗状态机设计

这部分直接决定“杀戮尖塔味儿对不对”。

⸻

1. Phase 流转

推荐流程：

battle_init
-> turn_start
-> draw_phase
-> player_action
-> resolving（仅在需要时短暂进入）
-> turn_end
-> enemy_turn
-> turn_start
...
-> victory / defeat

更细一点：

battle_init
• 创建单位
• 初始化抽牌堆
• 洗牌
• 触发 battle start relic/status
• 进入 turn_start

turn_start
• turn + 1
• 玩家格挡清理
• 重置能量
• 处理 turn start hooks
• 进入 draw_phase

draw_phase
• 抽固定张数
• 处理抽牌触发
• 进入 player_action

player_action
• 可出牌
• 可选目标
• 可结束回合
• 当玩家点击结束回合，进入 turn_end

turn_end
• 弃掉未保留手牌
• 处理 turn end hooks
• 敌人生成 / 刷新意图
• 进入 enemy_turn

enemy_turn
• 敌人依次执行动作
• 每次动作后检查死亡/连锁
• 所有敌人结束后回到 turn_start

victory / defeat
• 收尾
• 切屏到 reward 或 game_over

⸻

2. 为什么还要有 InputMode

因为 phase=player_action 时，用户可能：
• 什么都没干
• 正在拖牌
• 正在选目标
• 正在等动画播完

所以你要单独有：

type InputMode =
| 'idle'
| 'dragging_card'
| 'selecting_target'
| 'animation_lock';

这个会让你的交互逻辑特别清楚。

举个例子：
• 拖起一张攻击牌时，inputMode = dragging_card
• 松开但还没选中目标时，可转 selecting_target
• Engine 结算后，事件进入动画队列，inputMode = animation_lock
• 动画放完，回 idle

这样你不会写出那种 if (phase === 'player_action' && !isAnimating && !isSelecting && !isDragging && !modalOpen) 的屎山判断。

⸻

六、出牌流程怎么落地

这是最核心的一条链路。

1. 用户拖拽过程

Phaser 负责：
• 卡牌 pointerdown
• 开始 drag
• 根据拖拽位置高亮目标
• 显示目标箭头
• 松手时判断是否 drop 在合法区域

但 Phaser 不直接改 battle state。它只发命令：

dispatchCommand({
type: 'PLAY_CARD',
cardInstanceId,
sourceUnitId: playerId,
targetUnitId,
});

⸻

2. Engine 处理 PLAY_CARD

顺序建议：

第一步：合法性校验
• 当前 phase 是否为 player_action
• 当前 input 是否允许
• 这张牌是否还在手里
• 能量是否足够
• 目标是否合法
• 玩家是否可出牌

第二步：支付成本
• 扣能量
• 发 ENERGY_CHANGED

第三步：卡牌移区
• hand -> discard / exhaust
• 发 CARD_PLAYED

第四步：结算效果
遍历 effects

比如 damage：
• 算攻击前修正
• 算 target 的受伤修正
• 扣 block
• 扣 hp
• 发 DAMAGE_DEALT

第五步：触发 Hook
• onBeforePlayCard
• onAfterPlayCard
• onBeforeDealDamage
• onBeforeTakeDamage
• onAfterTakeDamage
• onKill 等等

第六步：死亡检查
• 敌人死了发 UNIT_DIED
• 全敌死亡发 BATTLE_WON
• 玩家死亡发 BATTLE_LOST

⸻

3. 动画处理

Engine 先算完，不等动画。

然后把 events 扔给 Phaser 的 AnimationController：

animationController.enqueue(events);

控制器按事件播放：
• CARD_PLAYED -> 卡牌飞出 / 缩放 / 消失
• DAMAGE_DEALT -> 目标抖动、伤害数字
• BLOCK_GAINED -> 护盾闪光
• UNIT_DIED -> 淡出 / 倒下

动画期间：

battle.inputMode = 'animation_lock'

等动画结束，再由一个命令回调：

dispatchCommand({ type: 'RESOLVE_ANIMATION_DONE' });

这时把输入解锁。

这套模式很稳，因为逻辑和表现完全解耦。
以后你甚至可以开“快速模式”，直接跳过动画，逻辑完全不用改。

⸻

七、敌人回合与 AI

《杀戮尖塔》不是复杂 AI，它更像“可预测模式 + 少量变化”。

所以建议不要一开始做通用行为树。真的没必要，除非你特别想把项目做成论文附录。

1. 怪物定义

export interface MonsterDefinition {
id: string;
name: string;
maxHp: number;
moves: MonsterMoveDefinition[];
intentPolicy: 'cycle' | 'weighted_random' | 'rule_based';
}

怪物招式：

export interface MonsterMoveDefinition {
id: string;
intent: MonsterIntent;
effects: EffectDefinition[];
weight?: number;
conditions?: MonsterMoveCondition[];
}

2. 运行时记录

export interface MonsterBattleState {
unitId: string;
monsterId: string;
intent: MonsterIntent | null;
moveHistory: string[];
}

3. 敌人回合流程
   • 按敌人顺序取出 intent
   • 执行对应 effects
   • 记录 moveHistory
   • 计算下一回合 intent

你甚至可以让“计算下一 intent”发生在当前回合结束时，这样玩家始终看得到下一步敌意图，味儿就对了。

⸻

八、地图、事件、奖励、商店怎么接进流程

你的 run 结构要允许不同 screen 之间自然切换。

1. 地图节点进入流程

map
-> choose node
-> 根据 node.type 决定进入：
battle / elite / shop / event / rest / treasure / boss

推荐是：
• React 负责节点详情 UI 和浮层
• Phaser 或 React SVG 负责地图可视化
• 初版甚至用 React 纯渲染地图都行，不必啥都 Phaser

如果你地图只是线和点，其实 React + SVG 反而省事。
Phaser 更适合战斗这种要拖拽、粒子、Tween 的高动态场景。

这是个挺实用的判断：
不是用了 Phaser，就必须每个场景都 Phaser。 没这条宇宙法则。

⸻

2. 奖励系统接法

战斗胜利后：
• battle.phase -> victory
• engine 产出 RewardState
• run.screen = { type: 'reward' }

React 渲染奖励面板，用户选择后再发 command：

{ type: 'SELECT_REWARD_CARD', definitionId: 'strike_plus' }

这样奖励系统和战斗系统就是相邻但独立的。

⸻

3. 商店系统接法

进入 shop 节点：
• 根据 seed + floor 生成商店内容
• run.shop = generateShop(seed, floor, player)
• run.screen = { type: 'shop' }

购买时发 command：

{ type: 'BUY_SHOP_CARD', definitionId: 'pommel_strike' }

Engine 检查金币、库存、是否已买，然后更新：
• 金币减少
• 卡加入牌组
• 商店库存变化

React 只是展示商品和按钮。别让按钮自己偷偷决定价格公式，求你了。

⸻

九、保持 React 开发习惯的最优做法

你是长期 React 前端，这其实是优势，不是包袱。

关键是别一碰游戏就进入“我要抛弃一切前端习惯，彻底成为引擎教徒”的状态。那种转换通常只会带来更多混乱。

1. 保持单向数据流

你最熟悉的东西不要丢：
• 所有逻辑变化都从 command 进入
• store 是单一事实源
• 组件靠 selector 读状态
• Scene 靠事件和状态驱动表现

2. 保持配置驱动

牌、怪、遗物、事件，都尽量配置化。

初版用 TS 对象就行，不要急着做 JSON 编辑器。

3. 保持组件化

React 里这些都很好拆：
• BattleHUD
• EnergyBar
• HandInfoPanel
• IntentPanel
• RewardCardList
• ShopOfferList
• EventOptionPanel

Phaser 里也可以类似拆：
• CardSprite
• UnitSprite
• DamageText
• IntentBadge
• DragController
• AnimationController

4. 保持可测试性

最值得测的不是 UI，而是 Core：
• 抽牌
• 洗牌
• 出牌合法性
• 伤害公式
• Hook 顺序
• 胜负判定
• 怪物意图生成

你把这些写成纯函数或纯 engine reducer，单测会很舒服。

⸻

十、给你一个能立刻开工的 MVP 切片

别贪，先做竖切片。

第一阶段：只做单场战斗

功能只要这些：
• 玩家 50 HP，3 能量
• 初始牌组 10 张
• Strike x5
• Defend x5
• 每回合抽 5
• 一只敌人
• 敌人轮流 6 攻 / 9 攻
• 卡牌拖拽到敌人可出
• 防御牌给自己加格挡
• 能结束回合
• 会判定胜负
• 有简单动画

这个版本做完，项目就真的活了。

第二阶段：扩成标准战斗
• 多敌人
• 目标选择
• Buff：力量、虚弱、易伤
• 出牌事件日志
• 怪物 intent 显示
• 快速模式

第三阶段：接肉鸽外层
• 简单地图
• 战后奖励三选一
• 商店
• 休息点
• 存档

第四阶段：内容扩展
• 遗物
• 药水
• 复杂牌
• 事件
• 精英/Boss
• 平衡

⸻

十一、我建议你开工时的技术栈细节

我给你一版很顺手的：
• React
• TypeScript
• Vite
• Phaser 3
• Zustand
• immer（可选，更新深层 state 时会省事）
• zod（可选，用于配表校验）
• vitest（测 core）
• eslint + typescript-eslint
• prettier

如果你喜欢更严一点，可以在 core 里多用不可变数据。
如果你更重开发手感，也可以在 engine 内部配合 immer。都行，但原则是：

逻辑层尽量可预测，渲染层尽量轻。

⸻

十二、我直接给你一版启动骨架代码思路

gameStore.ts

import { create } from 'zustand';
import { GameEngine } from '../core/engine/GameEngine';
import type { RunState } from '../core/model/run';
import type { GameCommand } from '../core/commands/types';
import type { GameEvent } from '../core/events/types';

interface GameStoreState {
run: RunState | null;
pendingEvents: GameEvent[];
engine: GameEngine;
initRun: (run: RunState) => void;
dispatchCommand: (command: GameCommand) => void;
consumeEvents: () => GameEvent[];
}

export const useGameStore = create<GameStoreState>((set, get) => ({
run: null,
pendingEvents: [],
engine: new GameEngine(),

initRun: (run) => set({ run }),

dispatchCommand: (command) => {
const { run, engine, pendingEvents } = get();
if (!run) return;

    const result = engine.dispatch(run, command);

    set({
      run: result.nextRun,
      pendingEvents: [...pendingEvents, ...result.events],
    });

},

consumeEvents: () => {
const events = get().pendingEvents;
set({ pendingEvents: [] });
return events;
},
}));

⸻

BattlePage.tsx

export function BattlePage() {
const battle = useGameStore((s) => s.run?.battle);
const dispatchCommand = useGameStore((s) => s.dispatchCommand);

if (!battle) return null;

return (

<div className="battle-page">
<PhaserBattleCanvas />
<BattleHUD
onEndTurn={() => dispatchCommand({ type: 'END_TURN' })}
/>
</div>
);
}

⸻

PhaserBattleCanvas.tsx

import { useEffect, useRef } from 'react';
import { createBattleGame } from '../phaser/gameFactory';
import { useGameStore } from '../store/gameStore';

export function PhaserBattleCanvas() {
const containerRef = useRef<HTMLDivElement | null>(null);

useEffect(() => {
if (!containerRef.current) return;
const game = createBattleGame(containerRef.current);
return () => game.destroy(true);
}, []);

return <div ref={containerRef} />;
}

⸻

BattleScene 里订阅 store 事件

update() {
const events = useGameStore.getState().consumeEvents();
if (events.length) {
this.animationController.enqueue(events);
}
}

当然，正式点你可以不用每帧轮询，改为订阅式桥接。
但 MVP 阶段这样先跑起来也可以，不丢人。能跑起来比“优雅地还没开始”强多了。

⸻

十三、最后给你一个最关键的工程建议

你这个项目最容易踩的 5 个坑，我直接提前替你踩了：

第一，别让 Phaser 保存权威战斗状态。
它只保存 sprite、动画引用、位置缓存这类表现数据。

第二，别让 React 组件直接写业务规则。
比如“点击按钮就直接 setHp(hp - 6)”这种，绝对不要。

第三，别把卡牌效果一张张手写死在组件或 scene 里。
前 5 张会很爽，第 20 张会开始骂人。

第四，别一开始就做大而全编辑器和通用系统。
先做能玩的战斗切片，再反推抽象。

第五，所有随机必须统一走 seed RNG。
这会在你调 bug、复现战斗、以后做录像时救你命。

⸻

这波先把 123 全铺开了。
下一步最适合直接继续的，是我给你补一份**“可直接开写的最小代码骨架”**，把这些类型文件、GameEngine、BattleState 初始化、以及第一张 Strike/Defend 的实现直接搭出来。这样你今晚就能开干，不用再对着空气沉思，像很多项目立项会里那样热闹半天最后只多了三页文档 😏
