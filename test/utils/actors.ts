import { getCanisterId } from "azle/test";
import { createActor as createActor_ICP } from "../../dfx_generated/icp/icp";
import { createActor as createActor_ICRC } from "../../dfx_generated/icrc";
import { createActor as createActor_ckBTC } from "../../dfx_generated/ckbtc/ckbtc";
import { createActor as createActor_Will } from "../../dfx_generated/will";
import { createActor as createActor_Providers } from "../../dfx_generated/providers";
import { ActorSubclass, Identity } from "@dfinity/agent";
import { _SERVICE as _ICRC } from "../../dfx_generated/icrc/icrc.did";
import { _SERVICE as _Provider } from "../../dfx_generated/providers/providers.did";
import { _SERVICE } from "../../dfx_generated/will/will.did";

// type  ActorSubclassService=_ICRC |_Provider;

async function createCanistersBasedActors(
  canisterActor: any,
  canisterName: string,
  identity?: Identity
) {
  if (!identity) {
    return canisterActor(getCanisterId(canisterName), {
      agentOptions: {
        host: "http://127.0.0.1:8080",
      },
    });
  } else {
    return canisterActor(getCanisterId(canisterName), {
      agentOptions: {
        host: "http://127.0.0.1:8080",
        identity,
      },
    });
  }
}

export async function createActor(
  canisterName: string,
  identity?: Identity
){
  switch (canisterName) {
    case "will":
      return await createCanistersBasedActors(
        createActor_Will,
        canisterName,
        identity
      );

    case "icrc":
      return await createCanistersBasedActors(
        createActor_ICRC,
        canisterName,
        identity
      );

    case "providers":
      return await createCanistersBasedActors(
        createActor_Providers,
        canisterName,
        identity
      );
    case "icp_ledger":
      return await createCanistersBasedActors(
        createActor_ICP,
        canisterName,
        identity
      );
    case "ckbtc_ledger":
      return await createCanistersBasedActors(
        createActor_ckBTC,
        canisterName,
        identity
      );
    default:
        return `Canister ${canisterName} Not Found`
  }
}
