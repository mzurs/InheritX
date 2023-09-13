import { ActorSubclass } from "@dfinity/agent";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import { getCanisterId } from "azle/test";

//Function to create Random Identity for any given createActor Method of canister
export async function createRandomIndentity(
  createActor: ActorSubclass<any>
): Promise<ActorSubclass<any>> {
  const userAIdentity = await Ed25519KeyIdentity.generate();
  const identity = userAIdentity;
  return createActor(getCanisterId("will"), {
    agentOptions: {
      host: "http://127.0.0.1:8080",
      identity,
    },
  });
}
