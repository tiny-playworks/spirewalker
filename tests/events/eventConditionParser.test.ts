import { describe, expect, test } from '@rstest/core';
import { EVENT_DEFINITIONS } from '@/game/core/definitions/events';
import { createMapRun } from '@/game/core/engine/createMapRun';
import {
  evaluateChoiceRequirements,
  evaluateConditionAST,
  evaluateRequirementString,
  parseConditionString,
} from '@/game/core/events/eventConditionParser';
import type { RunState } from '@/game/core/model/run';
import { resolveGenericEvent } from '@/game/core/systems/event/eventRuntime';

function baseRun(overrides?: {
  gold?: number;
  hp?: number;
  maxHp?: number;
  relics?: string[];
  deck?: string[];
}): RunState {
  const run = createMapRun(1);
  if (overrides?.gold !== undefined) run.meta.gold = overrides.gold;
  if (overrides?.maxHp !== undefined) run.player.maxHp = overrides.maxHp;
  if (overrides?.hp !== undefined) run.player.currentHp = overrides.hp;
  if (overrides?.relics !== undefined) run.meta.relics = overrides.relics;
  if (overrides?.deck !== undefined) run.masterDeck = overrides.deck;
  return run;
}

describe('eventConditionParser', () => {
  test('gold 比较运算符', () => {
    const run = baseRun({ gold: 50 });
    expect(evaluateRequirementString('gold >= 50', run)).toBe(true);
    expect(evaluateRequirementString('gold > 49', run)).toBe(true);
    expect(evaluateRequirementString('gold <= 50', run)).toBe(true);
    expect(evaluateRequirementString('gold < 51', run)).toBe(true);
    expect(evaluateRequirementString('gold == 50', run)).toBe(true);
    expect(evaluateRequirementString('gold = 50', run)).toBe(true);
    expect(evaluateRequirementString('gold >= 51', run)).toBe(false);
    expect(evaluateRequirementString('gold > 50', run)).toBe(false);
    expect(evaluateRequirementString('gold < 50', run)).toBe(false);
  });

  test('hp / maxHp 比较运算符', () => {
    const run = baseRun({ hp: 20, maxHp: 40 });
    expect(evaluateRequirementString('hp >= 20', run)).toBe(true);
    expect(evaluateRequirementString('hp > 19', run)).toBe(true);
    expect(evaluateRequirementString('hp <= 20', run)).toBe(true);
    expect(evaluateRequirementString('hp < 21', run)).toBe(true);
    expect(evaluateRequirementString('hp == 20', run)).toBe(true);
    expect(evaluateRequirementString('hp = 20', run)).toBe(true);
    expect(evaluateRequirementString('hp < 20', run)).toBe(false);

    expect(evaluateRequirementString('maxHp >= 40', run)).toBe(true);
    expect(evaluateRequirementString('maxHp > 39', run)).toBe(true);
    expect(evaluateRequirementString('maxHp <= 40', run)).toBe(true);
    expect(evaluateRequirementString('maxHp < 41', run)).toBe(true);
    expect(evaluateRequirementString('maxHp == 40', run)).toBe(true);
    expect(evaluateRequirementString('maxHp = 40', run)).toBe(true);
    expect(evaluateRequirementString('maxHp < 40', run)).toBe(false);
  });

  test('relic / !relic 语法', () => {
    const withRelic = baseRun({ relics: ['vajra'] });
    const without = baseRun({ relics: [] });

    expect(evaluateRequirementString('relic:vajra', withRelic)).toBe(true);
    expect(evaluateRequirementString('has_relic:vajra', withRelic)).toBe(true);
    expect(evaluateRequirementString('relic == vajra', withRelic)).toBe(true);
    expect(evaluateRequirementString('relic = vajra', withRelic)).toBe(true);
    expect(evaluateRequirementString('relic:vajra', without)).toBe(false);

    expect(evaluateRequirementString('!relic:vajra', without)).toBe(true);
    expect(evaluateRequirementString('no_relic:vajra', without)).toBe(true);
    expect(evaluateRequirementString('relic != vajra', without)).toBe(true);
    expect(evaluateRequirementString('!relic:vajra', withRelic)).toBe(false);
  });

  test('card / !card 语法', () => {
    const withCard = baseRun({ deck: ['strike', 'defend'] });
    const without = baseRun({ deck: ['defend'] });

    expect(evaluateRequirementString('card:strike', withCard)).toBe(true);
    expect(evaluateRequirementString('has_card:strike', withCard)).toBe(true);
    expect(evaluateRequirementString('card:strike', without)).toBe(false);

    expect(evaluateRequirementString('!card:strike', without)).toBe(true);
    expect(evaluateRequirementString('no_card:strike', without)).toBe(true);
    expect(evaluateRequirementString('!card:strike', withCard)).toBe(false);
  });

  test('多条件 AND 分隔符', () => {
    const run = baseRun({ gold: 50, hp: 20, relics: ['vajra'], deck: ['strike'] });
    expect(evaluateRequirementString('gold >= 50; hp >= 15', run)).toBe(true);
    expect(evaluateRequirementString('gold >= 50, hp >= 15', run)).toBe(true);
    expect(evaluateRequirementString('gold >= 50 && hp >= 15', run)).toBe(true);
    expect(evaluateRequirementString('gold >= 50 AND hp >= 15', run)).toBe(true);
    expect(evaluateRequirementString('gold >= 50; hp >= 15; relic:vajra', run)).toBe(true);
    expect(evaluateRequirementString('gold >= 50; hp >= 99', run)).toBe(false);
    expect(evaluateRequirementString('hp > 10 && card:strike', run)).toBe(true);
  });

  test('undefined / 空串 → true', () => {
    const run = baseRun();
    expect(evaluateRequirementString(undefined, run)).toBe(true);
    expect(evaluateRequirementString('', run)).toBe(true);
    expect(evaluateRequirementString('   ', run)).toBe(true);
    expect(evaluateChoiceRequirements({}, run)).toBe(true);
    expect(evaluateChoiceRequirements({ requirements: undefined }, run)).toBe(true);
  });

  test('非法条件 → false', () => {
    const run = baseRun({ gold: 999 });
    expect(evaluateRequirementString('banana >= 1', run)).toBe(false);
    expect(evaluateRequirementString('gold >= 50; not_a_condition', run)).toBe(false);
    expect(parseConditionString('wat')).toEqual([]);
  });

  test('AST 求值与 parse', () => {
    const run = baseRun({ gold: 30, hp: 10, maxHp: 40, relics: [], deck: [] });
    const asts = parseConditionString('gold >= 30; !relic:vajra; no_card:strike');
    expect(asts).toHaveLength(3);
    expect(asts.every((ast) => evaluateConditionAST(ast, run))).toBe(true);
  });

  test('resolveGenericEvent：requirements 未满足时返回 false 且不改状态', () => {
    const entry = Object.values(EVENT_DEFINITIONS).find((def) =>
      def.choices.some((c) => c.requirements?.includes('gold >=')),
    );
    expect(entry).toBeDefined();
    const choice = entry!.choices.find((c) => c.requirements?.includes('gold >='))!;
    const match = choice.requirements!.match(/gold\s*>=\s*(\d+)/);
    const need = Number(match![1]);

    const run = baseRun({ gold: Math.max(0, need - 1) });
    const snapshot = {
      gold: run.meta.gold,
      hp: run.player.currentHp,
      maxHp: run.player.maxHp,
      deck: [...run.masterDeck],
      relics: [...run.meta.relics],
      screen: structuredClone(run.screen),
    };
    const events: never[] = [];
    expect(resolveGenericEvent(run, entry!.id, choice.id, events)).toBe(false);
    expect(run.meta.gold).toBe(snapshot.gold);
    expect(run.player.currentHp).toBe(snapshot.hp);
    expect(run.player.maxHp).toBe(snapshot.maxHp);
    expect(run.masterDeck).toEqual(snapshot.deck);
    expect(run.meta.relics).toEqual(snapshot.relics);
    expect(run.screen).toEqual(snapshot.screen);
    expect(events).toHaveLength(0);
  });
});
