export enum LiquidityActions {
  Stake,
  Unstake,
  Withdraw,
}

export interface StateType {
  actionType: LiquidityActions;
  dialogOpen: boolean;
}
