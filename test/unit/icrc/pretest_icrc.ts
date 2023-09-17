import { getCanisterId } from "azle/test";
import { execSync } from "child_process";
import { Principal } from "@dfinity/principal";

type PretestParams = {
  principalA: string;
};

export async function pretestIcrc(args: PretestParams) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  //Deploying Canister In Sequence

  //================================== 3.  CKBTC Ledger Deployment================================================

  execSync(`dfx identity use default`, {
    stdio: "inherit",
  });

  // Send the ICP from default dfx identity to User Principal A
  execSync(
    `dfx canister call icp_ledger send_dfx '(record {memo=2 ; amount= record {e8s=100_000_000}; fee= record {e8s=10_000} ; to="'$(dfx ledger account-id --of-principal ${args.principalA})'"  })' `,
    {
      stdio: "inherit",
    }
  );
  // Send the ckBTC from default dfx principal to User Principal A
  execSync(
    `dfx canister call ckbtc_ledger icrc1_transfer \
    '(record {  to = record {owner=principal  "'${args.principalA}'"}; amount= 100_000_000 })' `,
    {
      stdio: "inherit",
    }
  );
}
