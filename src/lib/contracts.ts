import { ContractsAbi } from "./abis/contractsAbi";
import { env } from "@/env";
import { monadTestnet } from "./abis/monadTestnet";

const ABIs = {
  PRIVATE_NET: ContractsAbi,
  TESTNET: monadTestnet,
  PROD: ContractsAbi,
};

const getContracts = () => {
  if (env.NEXT_PUBLIC_CONTRACTS === "PRIVATE_NET") {
    return ABIs.PRIVATE_NET;
  }
  if (env.NEXT_PUBLIC_CONTRACTS === "TESTNET") {
    return ABIs.TESTNET;
  }
  if (env.NEXT_PUBLIC_CONTRACTS === "PROD") {
    return ABIs.PROD;
  }
  return ABIs.PRIVATE_NET;
};
const EnvContracts = getContracts();
export const Contracts = {
  Reactor: {
    abi: [...EnvContracts.Reactor.abi] as const,
    address: EnvContracts.Reactor.contractAddress as `0x${string}`,
  },
  Voter: {
    abi: [...EnvContracts.Voter.abi] as const,
    address: EnvContracts.Voter.contractAddress as `0x${string}`,
  },
  VotingEscrow: {
    abi: [...EnvContracts.VotingEscrow.abi] as const,
    address: EnvContracts.VotingEscrow.contractAddress as `0x${string}`,
  },
  Router: {
    abi: [...EnvContracts.Router.abi] as const,
    address: EnvContracts.Router.contractAddress as `0x${string}`,
  },
  PairFactory: {
    abi: [...EnvContracts.PairFactory.abi] as const,
    address: EnvContracts.PairFactory.contractAddress as `0x${string}`,
  },
  TradeHelper: {
    abi: [...EnvContracts.TradeHelper.abi] as const,
    address: EnvContracts.TradeHelper.contractAddress as `0x${string}`,
  },
  veNFTHelper: {
    abi: [...EnvContracts.veNFTHelper.abi] as const,
    address: EnvContracts.veNFTHelper.contractAddress as `0x${string}`,
  },
  RewardsDistributor: {
    abi: [...EnvContracts.RewardsDistributor.abi] as const,
    address: EnvContracts.RewardsDistributor.contractAddress as `0x${string}`,
  },
};
