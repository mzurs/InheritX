import { $query, nat, match, ic, $update, nat32, Principal, Opt } from "azle";
import { ICRC1Account, ICRC1TransferArgs } from "azle/canisters/icrc";
import { ckbtcLedger } from "../../icrc";
import { WILL_CANISTER_ID } from "../../utils/utils";
import { ICRCCKBTCTRANSFER } from "../../utils/types";

//==============================================CKBTC Ledger METHODS===============================================

//----------------------------------------------Query Methods--------------------------------------------------------

// Retrieve the Balance of Sub Account
$query;
export async function ckbtc_balance_of(account: ICRC1Account): Promise<nat> {
  const result = await ckbtcLedger.icrc1_balance_of(account).call();

  return match(result, {
    Ok: (ok) => ok,
    Err: (err) => ic.trap(err),
  });
}

// Retrieve the fee associated with this ledger canister
$query;
export async function ckbtc_fee(): Promise<nat> {
  const result = await ckbtcLedger.icrc1_fee().call();

  return match(result, {
    Ok: (ok) => ok,
    Err: (err) => ic.trap(err),
  });
}

//----------------------------------------------Update Methods--------------------------------------------------------

// Transfer to Hier SubAccount From icrc canister SubAccount
$update;
export async function icrc_ckbtc_transfer(
  identifier: nat32,
  to: Principal,
  amount: nat
): Promise<ICRCCKBTCTRANSFER> {
  // Only authorized principal can initiate this transfer
  if (ic.caller().toText() != WILL_CANISTER_ID) {
    return {
      unAuthorized: true,
    };
  } else {
    // arguments objects to pass in transfer Function
    const transferArgs: ICRC1TransferArgs = {
      from_subaccount: Opt.None,
      to: {
        owner: to,
        subaccount: Opt.None,
      },
      amount: amount - 10n,
      fee: Opt.Some(10n),
      memo: Opt.None,
      created_at_time: Opt.Some(ic.time()),
    };

    const transfer = await ckbtcLedger.icrc1_transfer(transferArgs).call();
    const result = match(transfer, {
      Ok: (res) => res,
      Err: () => null,
    });
    if (!result) {
      return {
        message: transfer.Err!,
      };
    } else {
      return result;
    }
  }
}
