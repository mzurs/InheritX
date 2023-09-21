import { getCanisterId } from "azle/test";
import { execSync } from "child_process";
import { Principal } from "@dfinity/principal";

type PretestParams = {
  principalA: string;
  principalB: string;
};

export async function pretestIcrc(args: PretestParams) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const willCanisterId = getCanisterId("will");
  //switching to default identity
  execSync(`dfx identity use default`, {
    stdio: "inherit",
  });

  // set the will canister Id as a authorized canister id to invoke functions calls
  execSync(
    `dfx canister call icrc set_will_canister_id '(\"${willCanisterId}\")'`,
    {
      stdio: "inherit",
    }
  );

  // Send the 10 ICP from default dfx identity to User Principal A
  execSync(
    `dfx canister call icp_ledger send_dfx '(record {memo=2 ; amount= record {e8s=1_000_000_000}; fee= record {e8s=10_000} ; to="'$(dfx ledger account-id --of-principal ${args.principalA})'"  })' `,
    {
      stdio: "inherit",
    }
  );

  // Send the 10 ckBTC from default dfx principal to User Principal A
  execSync(
    `dfx canister call ckbtc_ledger icrc1_transfer \
    '(record {  to = record {owner=principal  "'${args.principalA}'"}; amount= 1_000_000_000 })' `,
    {
      stdio: "inherit",
    }
  );
}
