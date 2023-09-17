import { ActorSubclass } from "@dfinity/agent";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import { getCanisterId } from "azle/test";
import { createActor as willActor } from "../../../dfx_generated/will";
import { _SERVICE  as _WILL} from "../../../dfx_generated/will/will.did";

export function createCanisterActor(
  createActor: any,
  canisterName: string,
  identity: any
) {
  return createActor(getCanisterId(canisterName), {
    agentOptions: {
      host: "http://127.0.0.1:8080",
      identity,
    },
  });
}
//Function to create Random Identity for any given createActor Method of canister
export async function create_actor(
  // createActor: ActorSubclass<any>,
  canisterName: string
): Promise<ActorSubclass<any>> {
  const userAIdentity = await Ed25519KeyIdentity.generate();
  const identity = userAIdentity;

  switch (canisterName) {
    case "will":
      return createCanisterActor(willActor, canisterName, identity) as ActorSubclass<_WILL>;

    // case "icrc":

    default:
      return `No Canister with Name: ${canisterName} found`;
  }
}

export async function createRandomIdentity() {
  return await Ed25519KeyIdentity.generate();
}
