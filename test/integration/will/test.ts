import { getCanisterId, runTests } from "azle/test";
// import { createActor } from "../../../declarations/will";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import { pretestIcrc } from "./pretest";
import { get_will_tests } from "./tests";
import { ActorSubclass, Identity } from "@dfinity/agent";
import { _SERVICE as _WILL } from "../../../declarations/will/will.did";
import { createActor } from "../../utils/actors";

const getIdentifier = async (identity: Identity): Promise<number> => {
  const actor_will: ActorSubclass<_WILL> = await createActor("will", identity);
  //   console.log("🚀 ~ file: tests.ts:21 ~ actor_will_userA:", actor_will_userA)
  //request unique identifier
  let identifier = await actor_will.request_random_will_identifier();
  // console.log("🚀 ~ file: tests.ts:24 ~ identifier:", identifier);
  return identifier;
};

const userA_Identity = async () => {
  const userAIdentity = Ed25519KeyIdentity.generate();

  return { userAIdentity };
};
const userB_Identity = async () => {
  const userBIdentity = Ed25519KeyIdentity.generate();

  return { userBIdentity };
};

async function runWill() {
  const { userAIdentity } = await userA_Identity();
  // console.log("🚀 ~ file: test.ts:32 ~ runWill ~ userAIdentity:", userAIdentity.getPrincipal().toText())
  const { userBIdentity } = await userB_Identity();
  // console.log("🚀 ~ file: test.ts:34 ~ runWill ~ userBIdentity:", userBIdentity.getPrincipal().toText())

  // transfer some amount to user A principal
  await pretestIcrc({
    principalA: userAIdentity.getPrincipal().toText(),
    principalB: userBIdentity.getPrincipal().toText(),
  });

  const identifiers = await getIdentifier(userAIdentity);

  runTests(await get_will_tests(identifiers, userAIdentity, userBIdentity));
}
runWill();
