import { runTests } from "azle/test";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import { pretestIcrc } from "./pretest";
import { get_will_tests } from "./tests";
import { _SERVICE as _WILL } from "../../../declarations/will/will.did";
import { execSync } from "child_process";
import { configureBitcoinWallet } from "../../utils/bitcoin_wallet";

async function deployCanisters() {
  execSync(`bash scripts/dev/setup_test_nodes.sh`, {
    stdio: "inherit",
  });

  await new Promise((resolve) => setTimeout(resolve, 15000));

  execSync(`yarn deploy`, {
    stdio: "inherit",
  });
}

const pretest = async () => {
  try {
    const userAIdentity = Ed25519KeyIdentity.generate();
    const userBIdentity = Ed25519KeyIdentity.generate();

    await deployCanisters();

    await configureBitcoinWallet();

    // transfer some amount to user A principal
    await pretestIcrc({
      principalA: userAIdentity.getPrincipal().toText(),
      principalB: userBIdentity.getPrincipal().toText(),
    });

    const identifiers = parseInt(String(Math.random() * 10 ** 5));

    await runTests(
      await get_will_tests(identifiers, userAIdentity, userBIdentity)
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
