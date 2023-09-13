import { getCanisterId } from "azle/test";
import { execSync } from "child_process";

async function pretest() {
  await new Promise((resolve) => setTimeout(resolve, 5000));

  //Deploying Canister In Sequence

  //================================== 3.  Providers  Canister Deployment===========================================

  execSync(
    `dfx deploy providers --specified-id 222l7-eqaaa-aaaar-aghea-cai
  `,
    {
      stdio: "inherit",
    }
  );

  execSync(`dfx generate providers`, {
    stdio: "inherit",
  });

  //================================== 3.  Will Canister Deployment===========================================

  execSync(
    `dfx deploy icrc --specified-id be2us-64aaa-aaaaa-qaabq-cai
  `,
    {
      stdio: "inherit",
    }
  );

  execSync(`dfx generate icrc`, {
    stdio: "inherit",
  });

  //================================== 4.  Will Canister Deployment===========================================

  execSync(
    `PROVIDERS_CANISTER_ID=${getCanisterId(
      "providers"
    )} ICRC_CANISTER_ID=${getCanisterId(
      "icrc"
    )} dfx deploy will --specified-id bkyz2-fmaaa-aaaaa-qaaaq-cai`,
    {
      stdio: "inherit",
    }
  );

  execSync(`dfx generate will`, {
    stdio: "inherit",
  });
}

pretest();
