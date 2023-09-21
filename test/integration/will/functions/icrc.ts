import { ActorSubclass, Identity } from "@dfinity/agent";
import { Principal } from "azle";
import { createActor } from "../../../utils/actors";
import { _SERVICE  as _ICPLedger} from "../../../../dfx_generated/icp/icp/icp_ledger.did";
import { _SERVICE  as _ICRC} from "../../../../dfx_generated/icrc/icrc.did";
import { getCanisterId } from "azle/test";
import { humanToE8s } from "../../../utils/utils";
import { idlFactory } from "../../../../dfx_generated/icrc";

export async function icpBalance(
  principal: Principal,
  identifier?: number
): Promise<bigint> {
  const actor_icp: ActorSubclass<_ICPLedger> = await createActor("icp_ledger");
  return await actor_icp.icrc1_balance_of({
    owner: principal,
    subaccount: identifier ? [Uint8Array.from([identifier])] : [],
  });
}

export async function compareICPBalance(
  principal: Principal,
  value: number,
  identifier: number
) {
  const actor_icp: ActorSubclass<_ICRC> = await createActor("icrc");

  const balance = await actor_icp.get_account_balance_of_icp_identifier(
    Principal.fromText(getCanisterId("icrc")),
    identifier
  );
  console.log("🚀 ~ file: icp.ts:88 ~ balance:", balance);

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
