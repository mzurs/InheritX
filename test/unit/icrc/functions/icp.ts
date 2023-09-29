import { AzleResult, getCanisterId } from "azle/test";
import {
  createICPActorWithIdentity,
  createICRCActorWithIdentity,
} from "../utils/utils";
import { ActorSubclass, Identity } from "@dfinity/agent";
import {
  TransferArgs,
  _SERVICE as _ICPLedger,
} from "../../../../declarations/icp/icp/icp_ledger.did";
import { Principal } from "@dfinity/principal";
import { humanToE8s } from "../../../utils/utils";
import { _SERVICE as _ICRC } from "../../../../declarations/icrc/icrc.did";

export async function compareICPBalance(
  principal: string,
  value: number
): Promise<AzleResult<boolean, string>> {
  const icpActor: ActorSubclass<_ICPLedger> =
    await createICPActorWithIdentity();

  const balance = await icpActor.icrc1_balance_of({
    owner: Principal.fromText(principal),
    subaccount: [],
  });
  // console.log("🚀 ~ file: icp.ts:22 ~ balance:", balance);
  return {
    Ok: balance === humanToE8s(value),
  };
}

export async function transferICPToICRC(
  userAIdentity: Identity,
  indentifier: number,
  amount: number
): Promise<AzleResult<boolean, string>> {
  //creating userA actor for ICRC Canister with Identity
  const actorIcrc: ActorSubclass<_ICRC> = await createICRCActorWithIdentity(
    userAIdentity
  );
  const identifierAccount =
    await actorIcrc.get_canister_binary_subaccount_from_identifier(indentifier);

  const identifierAccountHex =
    await actorIcrc.get_canister_hex_subaccount_from_identifier(indentifier);
  // console.log(
  //   "🚀 ~ file: icp.ts:45 ~ identifierAccountHex:",
  //   identifierAccountHex
  // );

  //Creating userA actor for ICP_ledger with Identity
  const actorIcpLedger: ActorSubclass<_ICPLedger> =
    await createICPActorWithIdentity(userAIdentity);

  const transferArgs: TransferArgs = {
    to: identifierAccount,
    amount: { e8s: humanToE8s(amount) - humanToE8s(0.0001) },
    fee: { e8s: 10_000n },
    from_subaccount: [],
    created_at_time: [],
    memo: 0n,
  };

  const transfer = await actorIcpLedger.transfer(transferArgs);
  // console.log("🚀 ~ file: icp.ts:65 ~ transfer:", transfer);

  if ("Ok" in transfer) {
    return { Ok: true };
  } else {
    return {
      Err: JSON.stringify(transfer),
    };
  }
}

export async function compareIcrcCanistersIdentifierBalance(
  identifier: number,
  value: number
): Promise<AzleResult<boolean, string>> {
  const icrcCanisterId = getCanisterId("icrc");

  //create icrc actor
  const icrcActor: ActorSubclass<_ICRC> = await createICRCActorWithIdentity();

  const balance = await icrcActor.get_account_balance_of_icp_identifier(
    Principal.fromText(icrcCanisterId),
    identifier
  );
  // console.log("🚀 ~ file: icp.ts:88 ~ balance:", balance);

  if ("Ok" in balance) {
    return {
      Ok: balance.Ok.e8s === humanToE8s(value),
    };
  } else {
    return {
      Err: JSON.stringify(balance),
    };
  }
}

export async function transferFromICRC(
  caller: ActorSubclass<_ICRC>,
  to: Principal,
  identifier: number
): Promise<AzleResult<boolean, string>> {
  const transferResult = await caller.icp_transfer(identifier, to);
  // console.log("🚀 ~ file: icp.ts:107 ~ transferResult:", transferResult);

  if ("Ok" in transferResult) {
    return {
      Ok: true,
    };
  } else {
    return {
      Err: JSON.stringify(transferResult),
    };
  }
}
