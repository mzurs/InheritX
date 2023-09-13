import { getCanisterId, runTests } from "azle/test";
import { createActor } from "../../../dfx_generated/providers";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import { get_providers_tests } from "./tests";

const providersCanister = async () => {
  const providerIdentity = await Ed25519KeyIdentity.generate();

  const identity = providerIdentity;
  return createActor(getCanisterId("providers"), {
    agentOptions: {
      host: "http://127.0.0.1:8080",
      identity,
    },
  });
};

async function runProviders() {
  const providers = await providersCanister();

  runTests(get_providers_tests(providers));
}
runProviders();
