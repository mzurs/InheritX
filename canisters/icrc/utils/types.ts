import { Variant, nat, nat64 } from "azle";
import { ICRC1TransferArgs, ICRC1TransferError } from "azle/canisters/icrc";
import { TransferResult } from "azle/canisters/ledger";

export type ICRCICPTRANSFER = Variant<{
    Ok: nat;
    Err: ICRC1TransferError;
    unAuthorized: boolean;
    message: string;
  }>
