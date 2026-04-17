/** 文档第一阶段：Strike×5 + Defend×5 */
export function createStarterMasterDeck(): string[] {
  return [...Array.from({ length: 5 }, () => 'strike'), ...Array.from({ length: 5 }, () => 'defend')];
}
