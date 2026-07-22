import type { RunState } from '../model/run';

export type ComparisonOperator = '>=' | '>' | '<=' | '<' | '==' | '=';

export type ConditionAST =
  | { type: 'gold'; operator: ComparisonOperator; value: number }
  | { type: 'hp'; operator: ComparisonOperator; value: number }
  | { type: 'maxHp'; operator: ComparisonOperator; value: number }
  | { type: 'relic'; relicId: string; negated: boolean }
  | { type: 'card'; cardId: string; negated: boolean };

const COMPARISON_RE =
  /^(gold|hp|maxHp)\s*(>=|<=|==|=|>|<)\s*(\d+)$/i;

const RELIC_POSITIVE_RE =
  /^(?:has_relic:|relic:)\s*([A-Za-z0-9_]+)$/i;
const RELIC_EQ_RE =
  /^relic\s*(?:==|=)\s*([A-Za-z0-9_]+)$/i;
const RELIC_NEGATED_RE =
  /^(?:!relic:|no_relic:)\s*([A-Za-z0-9_]+)$/i;
const RELIC_NE_RE =
  /^relic\s*!=\s*([A-Za-z0-9_]+)$/i;

const CARD_POSITIVE_RE =
  /^(?:has_card:|card:)\s*([A-Za-z0-9_]+)$/i;
const CARD_NEGATED_RE =
  /^(?:!card:|no_card:)\s*([A-Za-z0-9_]+)$/i;

function splitConditionFragments(requirements: string): string[] {
  return requirements
    .split(/\s*(?:;|,|&&|AND)\s*/i)
    .map((part) => part.trim())
    .filter(Boolean);
}

function parseConditionFragment(fragment: string): ConditionAST | null {
  const trimmed = fragment.trim();
  if (!trimmed) return null;

  const comparison = trimmed.match(COMPARISON_RE);
  if (comparison) {
    const field = comparison[1]!.toLowerCase();
    const operator = comparison[2] as ComparisonOperator;
    const value = Number(comparison[3]);
    if (field === 'gold') return { type: 'gold', operator, value };
    if (field === 'hp') return { type: 'hp', operator, value };
    if (field === 'maxhp') return { type: 'maxHp', operator, value };
    return null;
  }

  const relicNegated =
    trimmed.match(RELIC_NEGATED_RE) ?? trimmed.match(RELIC_NE_RE);
  if (relicNegated) {
    return { type: 'relic', relicId: relicNegated[1]!, negated: true };
  }

  const relicPositive =
    trimmed.match(RELIC_POSITIVE_RE) ?? trimmed.match(RELIC_EQ_RE);
  if (relicPositive) {
    return { type: 'relic', relicId: relicPositive[1]!, negated: false };
  }

  const cardNegated = trimmed.match(CARD_NEGATED_RE);
  if (cardNegated) {
    return { type: 'card', cardId: cardNegated[1]!, negated: true };
  }

  const cardPositive = trimmed.match(CARD_POSITIVE_RE);
  if (cardPositive) {
    return { type: 'card', cardId: cardPositive[1]!, negated: false };
  }

  return null;
}

/**
 * 将 requirements 字符串解析为 AST 列表。
 * 任一片段无法识别时返回空数组（由求值层判定为失败）。
 */
export function parseConditionString(requirements: string): ConditionAST[] {
  const fragments = splitConditionFragments(requirements);
  if (fragments.length === 0) return [];

  const asts: ConditionAST[] = [];
  for (const fragment of fragments) {
    const ast = parseConditionFragment(fragment);
    if (!ast) return [];
    asts.push(ast);
  }
  return asts;
}

function compare(left: number, operator: ComparisonOperator, right: number): boolean {
  switch (operator) {
    case '>=':
      return left >= right;
    case '>':
      return left > right;
    case '<=':
      return left <= right;
    case '<':
      return left < right;
    case '==':
    case '=':
      return left === right;
    default:
      return false;
  }
}

export function evaluateConditionAST(ast: ConditionAST, run: RunState): boolean {
  switch (ast.type) {
    case 'gold':
      return compare(run.meta.gold, ast.operator, ast.value);
    case 'hp':
      return compare(run.player.currentHp, ast.operator, ast.value);
    case 'maxHp':
      return compare(run.player.maxHp, ast.operator, ast.value);
    case 'relic': {
      const has = run.meta.relics.includes(ast.relicId);
      return ast.negated ? !has : has;
    }
    case 'card': {
      const has = run.masterDeck.includes(ast.cardId);
      return ast.negated ? !has : has;
    }
    default:
      return false;
  }
}

/**
 * 空 / undefined → true；无法识别的片段 → false（整条失败）。
 */
export function evaluateRequirementString(
  requirements: string | undefined,
  run: RunState,
): boolean {
  if (requirements === undefined || requirements.trim() === '') return true;
  const asts = parseConditionString(requirements);
  if (asts.length === 0) return false;
  return asts.every((ast) => evaluateConditionAST(ast, run));
}

export function evaluateChoiceRequirements(
  choice: { requirements?: string },
  run: RunState,
): boolean {
  return evaluateRequirementString(choice.requirements, run);
}
