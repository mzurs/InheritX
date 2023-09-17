import { getCanisterId, runTests } from "azle/test";
import { createActor } from "../../../dfx_generated/will";
import { get_will_tests } from "./tests";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";

// const mnemonic = generateMnemonic(256);
// console.log("🚀 ~ file: tests.ts:20 ~ userAMnemonic:", userAMnemonic);

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

//constant seed phrases
const USERA_MNEMONIC =
  "diagram piece globe rigid dice reduce sun worth suggest danger bind fury notice turtle hunt rotate brass office ticket address common safe speed adult";
const USERB_MNEMONIC =
  "knock young raccoon stadium embrace upon mean impulse bulb coconut view portion also more mom endorse draft village debris drip rebel aware fossil ice";

const will_canister = createActor(getCanisterId("will"), {
  agentOptions: {
    host: "http://127.0.0.1:8080",
  },
});

const userA_will = async () => {
  //generating identity for user A from mnemonic
  const userAIdentity = await Ed25519KeyIdentity.generate(
    stringToUint8Array(USERA_MNEMONIC)
  );

  const identity = userAIdentity;
  const userAPrinicipal = identity.getPrincipal();
  console.log(
    "🚀 ~ file: test.ts:16 ~ constuserA_will= ~ userAPrinicipal:",
    userAPrinicipal.toText()
  );
  const actorUserA = createActor(getCanisterId("will"), {
    agentOptions: {
      host: "http://127.0.0.1:8080",
      identity,
    },
  });
  return { actorUserA, userAPrinicipal };
};
const userB_will = async () => {
  //generating identity for user B from mnemonic
  const userBIdentity = Ed25519KeyIdentity.generate(
    stringToUint8Array(USERB_MNEMONIC)
  );
  const identity = userBIdentity;
  const userBPrinicipal = identity.getPrincipal();
  console.log(
    "🚀 ~ file: test.ts:29 ~ constuserB_will= ~ userBPrinicipal:",
    userBPrinicipal.toText()
  );

  const actorUserB = createActor(getCanisterId("will"), {
    agentOptions: {
      host: "http://127.0.0.1:8080",
      identity,
    },
  });

  return { actorUserB, userBPrinicipal };
};
async function runWill() {
  const { actorUserA, userAPrinicipal } = await userA_will();
  const { actorUserB, userBPrinicipal } = await userB_will();

  runTests(
    get_will_tests(
      will_canister,
      actorUserA,
      userAPrinicipal,
      actorUserB,
      userBPrinicipal
    )
  );
}
runWill();
