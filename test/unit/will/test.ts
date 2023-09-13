import { getCanisterId, runTests } from "azle/test";
import { createActor } from "../../../dfx_generated/will";
import { get_will_tests } from "./tests";
import { Ed25519KeyIdentity } from "@dfinity/identity";
const will_canister = createActor(getCanisterId("will"), {
  agentOptions: {
    host: "http://127.0.0.1:8080",
  },
});

const userA_will = async () => {
  const userAIdentity = await Ed25519KeyIdentity.generate();

  const identity = userAIdentity;
  return createActor(getCanisterId("will"), {
    agentOptions: {
      host: "http://127.0.0.1:8080",
      identity,
    },
  });
};
const userB_will = async () => {
  const userBIdentity = await Ed25519KeyIdentity.generate();
  const identity = userBIdentity;
  return createActor(getCanisterId("will"), {
    agentOptions: {
      host: "http://127.0.0.1:8080",
      identity,
    },
  });
};
async function runWill() {
  const userA = await userA_will();
  const userB = await userB_will();

  runTests(get_will_tests(will_canister, userA, userB));
}
runWill();
