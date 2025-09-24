export type TLockToken = {
  decimals: number;
  voted: boolean;
  attachments: bigint;
  id: bigint;
  amount: bigint;
  voting_amount: bigint;
  rebase_amount: bigint;
  lockEnd: bigint;
  vote_ts: bigint;
  votes: readonly {
    pair: `0x${string}`;
    weight: bigint;
  }[];
  account: `0x${string}`;
  token: `0x${string}`;
  tokenSymbol: string;
  tokenDecimals: bigint;
};
