import { getCanisterId, runTests } from "azle/test";
import { createActor } from "../../../declarations/icrc";
// import { get_icrc_tests } from "./tests";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import { get_icrc_tests } from "./tests";
import { pretestIcrc } from "./pretest_icrc";

function stringToUint8Array(str: string): Uint8Array {
  // Encode the string to UTF-8 bytes
  const encoder = new TextEncoder();
  const utf8Bytes = encoder.encode(str);

  // If the string is longer than 32 bytes, truncate it
  if (utf8Bytes.length >= 32) {
    return utf8Bytes.slice(0, 32);
  }

  // If the string is shorter than 32 bytes, pad it with zeros
  const padding = new Uint8Array(32 - utf8Bytes.length);
  return new Uint8Array([...utf8Bytes, ...padding]);
}

const icrc_canister = createActor(getCanisterId("icrc"), {
  agentOptions: {
    host: "http://127.0.0.1:8080",
  },
});

const userA_icrc = async () => {
  //generating identity for user A from mnemonic
  const userAIdentity = await Ed25519KeyIdentity.generate();

  const identity = userAIdentity;

  const actorUserA = createActor(getCanisterId("icrc"), {
    agentOptions: {
      host: "http://127.0.0.1:8080",
      identity,
    },
  });
  return { actorUserA, userAIdentity };
};
const userB_icrc = async () => {
  //generating identity for user B from mnemonic
  const userBIdentity = Ed25519KeyIdentity.generate();
  const identity = userBIdentity;

  const actorUserB = createActor(getCanisterId("icrc"), {
    agentOptions: {
      host: "http://127.0.0.1:8080",
      identity,
    },
  });

  return { actorUserB, userBIdentity };
};
async function runIcrc() {
  const { actorUserA, userAIdentity } = await userA_icrc();
  const { actorUserB, userBIdentity } = await userB_icrc();

  // transfer some amount to user A principal
  await pretestIcrc({
    principalA: userAIdentity.getPrincipal().toText(),
  });

  runTests(
    get_icrc_tests(
      icrc_canister,
      actorUserA,
      userAIdentity,
      actorUserB,
      userBIdentity
    )
  );
}
runIcrc();
