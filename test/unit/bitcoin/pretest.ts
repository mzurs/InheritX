import { runTests } from "azle/test";
import { execSync } from "child_process";
import { get_bitcoin_Canister_tests } from "./tests";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import { configureBitcoinWallet } from "../../utils/bitcoin_wallet";

async function deployBitcoinCanister(principal: string) {
  execSync(`bash scripts/dev/setup_test_nodes.sh`, {
    stdio: "inherit",
  });

  await new Promise((resolve) => setTimeout(resolve, 15000));

  execSync(
    `bash scripts/dev/deploy_test.sh bitcoin_canister install ${principal}  || true`,
    {
      stdio: "inherit",
    }
  );
}

const pretest = async () => {
  try {
    const userAIdentity = Ed25519KeyIdentity.generate();
    const userBIdentity = Ed25519KeyIdentity.generate();

    const userAPrincipal = userAIdentity.getPrincipal();

    await deployBitcoinCanister(userAPrincipal.toText());

    await configureBitcoinWallet();

    await runTests(
      await get_bitcoin_Canister_tests(userAIdentity, userBIdentity)
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
