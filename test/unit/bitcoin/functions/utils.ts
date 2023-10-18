import { ActorSubclass } from "@dfinity/agent";
import { _SERVICE } from "../../../../declarations/bitcoin_canister/bitcoin_canister.did";
import { createActor } from "../../../utils/actors";
import { execSync } from "child_process";

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
    execSync(
      `bash scripts/dev/btc/mineToAddress.sh  ${blocks} n2dcQfuwFw7M2UYzLfM6P7DwewsQaygb8S  || true`,
      {
        stdio: "inherit",
      }
    );
  } else {
    execSync(
      `bash scripts/dev/btc/mineToAddress.sh  ${blocks} ${address}  || true`,
      {
        stdio: "inherit",
      }
    );
  }
}
