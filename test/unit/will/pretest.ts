import { Ed25519KeyIdentity } from "@dfinity/identity";
import { execSync } from "child_process";
import { get_will_tests } from "./tests";
import { runTests } from "azle/test";

async function deployWillCanister(principal: string) {
  execSync(`bash scripts/dev/setup_test_nodes.sh no-bitcoin`, {
    stdio: "inherit",
  });

  await new Promise((resolve) => setTimeout(resolve, 15000));

  execSync(
    `bash scripts/dev/deploy_test.sh will install ${principal}  || true`,
    {
      stdio: "inherit",
    }
  );
}

const pretest = async () => {
  try {
    const userAIdentity = Ed25519KeyIdentity.generate();
    const userBIdentity = Ed25519KeyIdentity.generate();

    await deployWillCanister(userAIdentity.getPrincipal().toText());

    await runTests(await get_will_tests(userAIdentity, userBIdentity));

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
