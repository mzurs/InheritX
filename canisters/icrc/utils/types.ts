import { Variant, nat } from "azle";
import { ICRC1TransferError } from "azle/canisters/icrc";
import { TransferError } from "azle/canisters/ledger";

export type ICRCICPTRANSFER = Variant<{
  Ok: nat;
  Err: ICRC1TransferError;
  unAuthorized: boolean;
  message: string;
  success: nat;
}>;

export type ICPTRANSFER = Variant<{
  Ok: nat;
  Err: TransferError;
  unAuthorized: boolean;
  message: string;
}>;

export type ICRCCKBTCTRANSFER = Variant<{
  Ok: nat;
  Err: ICRC1TransferError;
  unAuthorized: boolean;
  message: string;
}>;
