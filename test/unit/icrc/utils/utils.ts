import { getCanisterId } from "azle/test";
import { createActor as createActor_ICP } from "../../../../declarations/icp/icp";
import { createActor as createActor_ICRC } from "../../../../declarations/icrc";
import { createActor as createActor_ckBTC } from "../../../../declarations/ckbtc/ckbtc";

export async function createICPActorWithIdentity(identity?: any): Promise<any> {
  if (!identity) {
    return createActor_ICP(getCanisterId("icp_ledger"), {
      agentOptions: {
        host: "http://127.0.0.1:8080",
      },
    });
  } else {
    return createActor_ICP(getCanisterId("icp_ledger"), {
      agentOptions: {
        host: "http://127.0.0.1:8080",
        identity,
      },
    });
  }
}

export async function createICRCActorWithIdentity(
  identity?: any
): Promise<any> {
  if (!identity) {
    return createActor_ICRC(getCanisterId("icrc"), {
      agentOptions: {
        host: "http://127.0.0.1:8080",
      },
    });
  } else {
    return createActor_ICRC(getCanisterId("icrc"), {
      agentOptions: {
        host: "http://127.0.0.1:8080",
        identity,
      },
    });
  }
}

export async function createckBTCActorWithIdentity(
  identity?: any
): Promise<any> {
  if (!identity) {
    return createActor_ckBTC(getCanisterId("ckbtc_ledger"), {
      agentOptions: {
        host: "http://127.0.0.1:8080",
      },
    });
  } else {
    return createActor_ckBTC(getCanisterId("ckbtc_ledger"), {
      agentOptions: {
        host: "http://127.0.0.1:8080",
        identity,
      },
    });
  }
}
