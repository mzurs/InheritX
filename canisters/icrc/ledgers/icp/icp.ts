import {
  $query,
  $update,
  Opt,
  Principal,
  Result,
  Variant,
  ic,
  match,
  nat,
  nat32,
} from "azle";
import {
  ICRC1Account,
  ICRC1TransferArgs,
  ICRC1TransferError,
} from "azle/canisters/icrc";
import {
  binaryAddressFromPrincipal,
  Tokens,
  TransferResult,
} from "azle/canisters/ledger";
import { icpLedger } from "../../icrc";
import { Will } from "../../utils/icrc_supported_tokens_list";
import { ICRCICPTRANSFER } from "../../utils/types";
import { WILL_CANISTER_ID } from "../../utils/utils";

//==============================================ICP(ICRC) Ledger METHODS===============================================

//----------------------------------------------Query Methods--------------------------------------------------------

// current balance of a principal
$query;
export async function icrc_icp_balanceOf(
  identifier: nat32
): Promise<Result<nat, string>> {
  //generating unique bianry address for a given identifier
  const binarySubAccount = binaryAddressFromPrincipal(ic.id(), identifier);

  const account: ICRC1Account = {
    owner: ic.id(),
    subaccount: Opt.Some(binarySubAccount),
  };

  return await icpLedger.icrc1_balance_of(account).call();
}

// get the current fee of transfer for ICP Ledger
$query;
export async function icrc_icp_fee(): Promise<Result<nat, string>> {
  return await icpLedger.icrc1_fee().call();
}
//----------------------------------------------Update Methods-------------------------------------------------------

$update;
export async function icrc_icp_transfer(
  identifier: nat32,
  to: Principal
): Promise<ICRCICPTRANSFER> {
  // Only authorized principal can initiate this transfer
  if (ic.caller().toText() != WILL_CANISTER_ID) {
    return {
      unAuthorized: true,
    };
  } else {
    // binary address of ICRC Canister
    const icrcBinaryAddress = binaryAddressFromPrincipal(ic.id(), identifier);

    // SubAcount of ICRC Canister
    const icrcSubAccount: ICRC1Account = {
      owner: ic.id(),
      subaccount: Opt.Some(icrcBinaryAddress),
    };

    // SubAccount of `to` Principal
    const toSubAccount: ICRC1Account = {
      owner: to,
      subaccount: Opt.None,
    };

    // Fetching current balance of icrc subaccount
    const balanceResult = await icpLedger
      .icrc1_balance_of(icrcSubAccount)
      .call();
    const balance = match(balanceResult, {
      Ok: (value) => value,
      Err: (err) => err,
    });

    if (typeof balance == "string") {
      return {
        message: balance,
      };
    }

    const icrcFeeResult = await icpLedger.icrc1_fee().call();
    const icrcFee = match(icrcFeeResult, {
      Ok: (fee) => fee,
      Err: (err) => ic.trap(err),
    });

    //transfer params object
    const transfer: ICRC1TransferArgs = {
      from_subaccount: Opt.Some(icrcBinaryAddress),
      to: toSubAccount,
      amount: balance,
      fee: Opt.Some(icrcFee),
      memo: Opt.None,
      created_at_time: Opt.Some(ic.time()),
    };

    // Initiate Transfer to ICP Ledger for requested SubAccount/Principal
    const initiateTransferResult = await icpLedger
      .icrc1_transfer(transfer)
      .call();
    const initiateTransfer = match(initiateTransferResult, {
      Ok: (transfer) => transfer,
      Err: (err) => err,
    });
    if (typeof initiateTransfer == "string") {
      return {
        message: initiateTransfer,
      };
    }
    return initiateTransfer;
  }
}
