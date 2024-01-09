import { nat32, Record, Variant } from "azle";

export type SendRequest = Record<{
  identifier: nat32;
  destinationAddress: string;
}>;

export type BitcoinTransfer = Variant<{
  unAuthorized: boolean;
  txid: string;
  inSufficientFunds: boolean;
}>;
