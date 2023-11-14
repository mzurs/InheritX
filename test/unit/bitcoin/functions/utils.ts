import { ActorSubclass } from "@dfinity/agent";
import { _SERVICE } from "../../../../declarations/bitcoin_canister/bitcoin_canister.did";
import { createActor } from "../../../utils/actors";
import { execSync } from "child_process";
import { send_btc } from "../../../utils/bitcoin_wallet";

export async function getP2PKHAddress(identifier: number): Promise<string> {
  const actor_bitcoinCanister: ActorSubclass<_SERVICE> = await createActor(
    "bitcoin_canister"
  );

  return await actor_bitcoinCanister.get_p2pkh_address(identifier);
}

export async function getBalance(p2pkhAddress: string): Promise<bigint> {
  const actor_bitcoinCanister: ActorSubclass<_SERVICE> = await createActor(
    "bitcoin_canister"
  );

  return await actor_bitcoinCanister.get_balance(p2pkhAddress);
}

export async function mineToAddress(blocks: number, address?: string) {
  if (!address) {
    // n2dcQfuwFw7M2UYzLfM6P7DwewsQaygb8S
    // execSync(
    //   `bash scripts/dev/btc/mineToAddress.sh  ${blocks} n2dcQfuwFw7M2UYzLfM6P7DwewsQaygb8S  || true`,
    //   {
    //     stdio: "inherit",
    //   }
    // );

    await send_btc("n2dcQfuwFw7M2UYzLfM6P7DwewsQaygb8S", 50);
  } else {
    // execSync(
    //   `bash scripts/dev/btc/mineToAddress.sh  ${blocks} ${address}  || true`,
    //   {
    //     stdio: "inherit",
    //   }
    // );

    await send_btc(address, 51);
  }
}
