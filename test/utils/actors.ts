import { getCanisterId } from "azle/test";
import { createActor as createActor_ICP } from "../../declarations/icp/icp";
import { createActor as createActor_ICRC } from "../../declarations/icrc";
import { createActor as createActor_ckBTC } from "../../declarations/ckbtc/ckbtc";
import { createActor as createActor_Will } from "../../declarations/will";
import { createActor as createActor_Providers } from "../../declarations/providers";
import { createActor as createActor_BitcoinCanister } from "../../declarations/bitcoin_canister";
import {  Identity } from "@dfinity/agent";


async function createCanistersBasedActors(
  canisterActor: any,
  canisterName: string,
  identity?: Identity
) {
  
  if (!identity) {
    return canisterActor(canisterName==="bitcoin_canister"?"nq4qv-wqaaa-aaaaf-bhdgq-cai":getCanisterId(canisterName), {
      agentOptions: {
        host: "http://127.0.0.1:8080",
      },
    });
  } else {
    return canisterActor(canisterName==="bitcoin_canister"?"nq4qv-wqaaa-aaaaf-bhdgq-cai":getCanisterId(canisterName), {
      agentOptions: {
        host: "http://127.0.0.1:8080",
        identity,
      },
    });
  }
}

export async function createActor(canisterName: string, identity?: Identity) {
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
    case "bitcoin_canister":
      return await createCanistersBasedActors(
        createActor_BitcoinCanister,
        canisterName,
        identity
      );
    default:
      return `Canister ${canisterName} Not Found`;
  }
}
