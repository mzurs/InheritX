import {
  $query,
  $update,
  Opt,
  Principal,
  Result,
  ic,
  match,
  nat,
  nat32,
} from "azle";
import { ICRC1Account, ICRC1TransferArgs,ICRC1TransferError} from "azle/canisters/icrc";
import {
  binaryAddressFromPrincipal,
  Tokens,
  TransferArgs,
} from "azle/canisters/ledger";
import { getIdentifierBlob, icpLedger } from "../../icrc";
import { ICPTRANSFER, ICRCICPTRANSFER } from "../../utils/types";
import { WILL_CANISTER_ID } from "../../utils/utils";

//==============================================ICP Ledger METHODS===============================================

//----------------------------------------------Query Methods--------------------------------------------------------

// current balance of a principal
$query;
export async function icrc_icp_balanceOf(
  identifier: nat32
): Promise<Result<nat, string>> {
  const account: ICRC1Account = {
    owner: ic.id(),
    subaccount: Opt.Some(getIdentifierBlob(identifier)),
  };

  return await icpLedger.icrc1_balance_of(account).call();
}

// get the current fee of transfer for ICP Ledger
$query;
export async function icrc_icp_fee(): Promise<Result<nat, string>> {
  return await icpLedger.icrc1_fee().call();
}

$update;
export async function get_account_balance_of_icp_identifier(
  principal: Principal,
  identifier: nat32
): Promise<Result<Tokens, string>> {
  return await icpLedger
    .account_balance({
      account: binaryAddressFromPrincipal(principal, identifier),
    })
    .call();
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
      Err: (err) => 0n,
    });

    if (balance <= 0) {
      return {
        message: `Insufficient Funds : ${balance}`,
      };
    }

    const icrcFeeResult = await icpLedger.icrc1_fee().call();
    const icrcFee = match(icrcFeeResult, {
      Ok: (fee) => fee,
      Err: (err) => ic.trap(err),
    });

    //transfer params object
    const transfer: ICRC1TransferArgs = {
      from_subaccount: Opt.Some(getIdentifierBlob(identifier)),
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

$update;
export async function icp_transfer(
  identifier: nat32,
  to: Principal
): Promise<ICPTRANSFER> {
  if (ic.caller().toText() != WILL_CANISTER_ID) {
    return { unAuthorized: true };
  }
  //calculating the canister subaccount based on identifier
  const from = getIdentifierBlob(identifier);
  const balance = await icpLedger
    .account_balance({
      account: binaryAddressFromPrincipal(ic.id(), identifier),
    })
    .call();
  const balanceValue = match(balance, {
    Ok: (value) => value.e8s,
    Err: (err) => 0n,
  });

  if (balanceValue <= 0) {
    return {
      message: `Insufficient Funds : ${balanceValue}`,
    };
  } else {
    const transferArgs: TransferArgs = {
      memo: 0n,
      amount: {
        e8s: balanceValue - 10_000n,
      },
      fee: {
        e8s: 10_000n,
      },
      from_subaccount: Opt.Some(from),
      to: binaryAddressFromPrincipal(to, 0),
      created_at_time: Opt.None,
    };
    const transferResult = await icpLedger.transfer(transferArgs).call();
    const transfer = match(transferResult, {
      Ok: (result) => result,
      Err: (err) => err,
    });
    if (typeof transfer == "string") {
      return {
        message: transfer,
      };
    } else {
      return transfer;
    }
  }
}
