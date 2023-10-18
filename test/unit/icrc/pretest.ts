import { getCanisterId, runTests } from "azle/test";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import { get_icrc_tests } from "./tests";
import { pretestIcrc } from "./pretest_icrc";
import { execSync } from "child_process";
import { createActor } from "../../utils/actors";

async function deployICRCCanister(principal: string) {
  execSync(`bash scripts/dev/setup_test_nodes.sh no-bitcoin`, {
    stdio: "inherit",
  });

  await new Promise((resolve) => setTimeout(resolve, 15000));

  execSync(
    `bash scripts/dev/deploy_test.sh icrc install ${principal}  || true`,
    {
      stdio: "inherit",
    }
  );

  execSync(`bash scripts/dev/icp/icp.sh  || true`, {
    stdio: "inherit",
  });

  execSync(`bash scripts/dev/ckbtc/ckbtc.sh  || true`, {
    stdio: "inherit",
  });
}

const pretest = async () => {
  try {
    const userAIdentity = Ed25519KeyIdentity.generate();
    const userBIdentity = Ed25519KeyIdentity.generate();

    const userAPrincipal = userAIdentity.getPrincipal();

    await deployICRCCanister(userAPrincipal.toText());

    // transfer some amount to user A principal
    await pretestIcrc({
      principalA: userAIdentity.getPrincipal().toText(),
    });

    await runTests(
      await get_icrc_tests(
        await createActor("icrc", userAIdentity),
        userAIdentity,
        userBIdentity
      )
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
