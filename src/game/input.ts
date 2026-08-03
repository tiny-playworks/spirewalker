export interface CombatInput {
  moveX: number;
  moveY: number;
  aimX: number;
  aimY: number;
  shooting: boolean;
  reloadPressed: boolean;
  swapPressed: boolean;
  dodgePressed: boolean;
  abilityPressed: boolean;
}

export const EMPTY_COMBAT_INPUT: CombatInput = {
  moveX: 0,
  moveY: 0,
  aimX: 640,
  aimY: 360,
  shooting: false,
  reloadPressed: false,
  swapPressed: false,
  dodgePressed: false,
  abilityPressed: false,
};
