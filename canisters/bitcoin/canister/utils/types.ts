import { nat32, nat64, Record, Variant } from "azle";

export type SendRequest = Record<{
  identifier: nat32;
  destinationAddress: string;
  // amountInSatoshi: nat64;
}>;

export type BitcoinTransfer = Variant<{
  unAuthorized: boolean;
  txid: string;
  inSufficientFunds: boolean;
}>;
