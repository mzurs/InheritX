import { execSync } from "child_process";

export async function configureBitcoinWallet() {
  execSync(`bash scripts/dev/btc/regtest_wallet.sh create  || true`, {
    stdio: "inherit",
  });
  await new Promise((resolve) => setTimeout(resolve, 5000));
}

export async function send_btc(p2pkhAddress: string, amount: number = 50) {
  console.log(`Transfer ${amount} => ${p2pkhAddress}`);

  execSync(
    ` bash scripts/dev/btc/regtest_wallet.sh send ${p2pkhAddress} ${amount}  || true`,
    {
      stdio: "inherit",
    }
  );
  await new Promise((resolve) => setTimeout(resolve, 5000));
}

// const pretest = async () => {
//   //   configureBitcoinWallet();
//   send_btc("n2gDN2iqZuFxFnZhLhon3MTocknLKdsihj", 10);
// };
// pretest();
