import { runTests } from "azle/test";
import { get_providers_tests } from "./tests";
import { execSync } from "child_process";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import { createActor } from "../../utils/actors";

async function deployProvidersCanister(principal: string) {
  execSync(`bash scripts/dev/setup_test_nodes.sh no-bitcoin`, {
    stdio: "inherit",
  });

  await new Promise((resolve) => setTimeout(resolve, 15000));

  execSync(
    `bash scripts/dev/deploy_test.sh providers install ${principal}  || true`,
    {
      stdio: "inherit",
    }
  );
}

const pretest = async () => {
  try {
    const userAIdentity = Ed25519KeyIdentity.generate();
    const userAPrincipal = userAIdentity.getPrincipal();

    await deployProvidersCanister(userAPrincipal.toText());

    await runTests(
      await get_providers_tests(await createActor("providers", userAIdentity))
    );

    await new Promise((resolve) => setTimeout(resolve, 15000));

    execSync(`bash scripts/dev/cleanup.sh all || true`, {
      stdio: "inherit",
    });
  } catch (e) {
    console.log("🚀 ~ file: pretest.ts:40 ~ pretest ~ e:", e);
    execSync(`bash scripts/dev/cleanup.sh all || true`, {
      stdio: "inherit",
    });
  }
};

pretest();
