import { Principal } from "@dfinity/principal";
import {
  createICRCActorWithIdentity,
  createckBTCActorWithIdentity,
} from "../utils/utils";
import { ActorSubclass, Identity } from "@dfinity/agent";
import {
  TransferArg,
  _SERVICE as _ckBTCLedger,
} from "../../../../declarations/ckbtc/ckbtc/ckbtc_ledger.did";
import { AzleResult, getCanisterId } from "azle/test";
import { getIdentifierBlob, humanToE8s } from "../../../utils/utils";
import { _SERVICE as _ICRC } from "../../../../declarations/icrc/icrc.did";

// compare the ckBTC Balance of a Principal with a pre-image value
export async function compareckBTCBalance(
  principal: Principal,
  value: number
): Promise<AzleResult<boolean, string>> {
  const actorCKBTC: ActorSubclass<_ckBTCLedger> =
    await createckBTCActorWithIdentity();

  const balance = await actorCKBTC.icrc1_balance_of({
    owner: principal,
    subaccount: [],
  });

  return {
    Ok: balance === humanToE8s(value),
  };
}

export async function transferckBTCToICRC(
  userAIdentity: Identity,
  identifier: number,
  amount: number
): Promise<AzleResult<boolean, string>> {
  const actorCKBTC: ActorSubclass<_ckBTCLedger> =
    await createckBTCActorWithIdentity(userAIdentity);

  const subAccount = getIdentifierBlob(identifier);
  const transferArgs: TransferArg = {
    from_subaccount: [],
    to: {
      owner: Principal.fromText(getCanisterId("icrc")),
      subaccount: [subAccount],
    },
    memo: [],
    fee: [10n],
    created_at_time: [],
    amount: humanToE8s(amount) - 10n,
  };
  const transferResult = await actorCKBTC.icrc1_transfer(transferArgs);
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
export async function compareIcrcCanistersIdentifierBalanceckBTC(
  // princicpal: Principal,
  // identifier: number,
  value: number
): Promise<AzleResult<boolean, string>> {
  const icrcCanisterId = getCanisterId("icrc");

  //create icrc actor
  const icrcActor: ActorSubclass<_ICRC> = await createICRCActorWithIdentity();

  const balance = await icrcActor.ckbtc_balance_of({
    owner: Principal.fromText(icrcCanisterId),
    subaccount: [],
  });
  // console.log("🚀 ~ file: icp.ts:88 ~ balance:", balance);

  return {
    Ok: balance === humanToE8s(value) - humanToE8s(10),
  };
}

export async function transferFromICRCckBTC(
  caller: ActorSubclass<_ICRC>,
  to: Principal,
  identifier: number,
  value: number
): Promise<AzleResult<boolean, string>> {
  const transferResult = await caller.icrc_ckbtc_transfer(identifier, to);
  // console.log("🚀 ~ file: ckbtc.ts:95 ~ transferResult:", transferResult);

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
