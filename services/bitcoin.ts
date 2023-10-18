import {
  CallResult,
  Service,
  Record,
  Variant,
  nat32,
  nat64,
  serviceUpdate,
} from "azle";

type SendRequest = Record<{
  identifier: nat32;
  destinationAddress: string;
  // amountInSatoshi: nat64;
}>;

type BitcoinTransfer = Variant<{
  unAuthorized: boolean;
  txid: string;
  inSufficientFunds: boolean;
}>;

export class Bitcoin extends Service {
  @serviceUpdate
  getBalance: (address: string) => CallResult<nat64>;

  @serviceUpdate
  bitcoin_transfer: (request: SendRequest) => CallResult<BitcoinTransfer>;
}
