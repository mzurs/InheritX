import { Principal } from "azle";

export const ICRC_LIST = ["ICP", "ckBTC", "CHAT"];

//----------Mainnet Ledger IDs

export const ICP_PRINCIPAL: string = "ryjl3-tyaaa-aaaaa-aaaba-cai";
export const CKBTC_PRINCIPAL: string = "mxzaz-hqaaa-aaaar-qaada-cai";
export const CHAT_PRINCIPAL: string = "2ouva-viaaa-aaaaq-aaamq-cai";

export type Will = {
  willName: string;
  identifier: number;
  tokenTicker: string;
  testator: Principal;
  heirs: Principal;
  value: number;
  timeStamp: bigint;
  isClaimed: boolean;
};
