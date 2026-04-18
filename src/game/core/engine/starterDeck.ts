/** v0.4 首套牌：保留基础攻防，同时让首战就能接触 momentum 与节奏修复。 */
export function createStarterMasterDeck(): string[] {
  return [
    ...Array.from({ length: 4 }, () => 'strike'),
    ...Array.from({ length: 4 }, () => 'defend'),
    'prime_rhythm',
    'steady_step',
  ];
}
