import { nat32, nat64, Record } from "azle";

export type SendRequest = Record<{
  identifier: nat32;
  destinationAddress: string;
  amountInSatoshi: nat64;
}>;
