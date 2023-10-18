import { AzleResult } from "azle/test";
import { getBalance, getP2PKHAddress, mineToAddress } from "./utils";
import { createActor } from "../../../utils/actors";
import { ActorSubclass, Identity } from "@dfinity/agent";
import {
  ManualReply,
  _SERVICE as _BTC,
} from "../../../../declarations/bitcoin_canister/bitcoin_canister.did";
import {
  e8sToHuman,
  humanToE8s,
  randomIdentifier,
} from "../../../utils/utils";
import { match } from "azle";

export async function bitcoinBalanceOfTwoAddresses(
  identifier1: number,
  identifier2: number
): Promise<AzleResult<boolean, string>> {
  // console.log("🚀 ~ file: index.ts:9 ~ identifier1:", identifier1);
  const identifier1Address = await getP2PKHAddress(identifier1);
  const identifier2Address = await getP2PKHAddress(identifier2);

  const identifier1Balance = await getBalance(identifier1Address);
  const identifier2Balance = await getBalance(identifier2Address);

  return {
    Ok: identifier1Balance === 0n && identifier2Balance === 0n,
  };
}

export async function restrictTransfer(
  userBIdentity: Identity
): Promise<AzleResult<boolean, string>> {
  const userB_actor_bitcoinCanister: ActorSubclass<_BTC> = await createActor(
    "bitcoin_canister",
    userBIdentity
  );

  const srcRandomIdentifier = randomIdentifier();
  const destRandomIdentifierAddress = await getP2PKHAddress(randomIdentifier());

  const transferResullt: ManualReply =
    await userB_actor_bitcoinCanister.bitcoin_transfer({
      destinationAddress: destRandomIdentifierAddress,
      identifier: srcRandomIdentifier,
    });

  return {
    Ok: match(transferResullt, {
      unAuthorized: (res) => res === true,
      txid: (id) => false,
      inSufficientFunds: (n) => false,
    }),
  };
}

export async function getBalanceByIdentifier(
  identifier: number
): Promise<number> {
  const actor_bitcoinCanister: ActorSubclass<_BTC> = await createActor(
    "bitcoin_canister"
  );

  const balance = await actor_bitcoinCanister.get_balance_by_identifier(
    identifier
  );
  // console.log("🚀 ~ file: index.ts:69 ~ balance:", e8sToHuman(balance))
  return e8sToHuman(balance);
}
export async function verifyBalance(
  identifier: number,
  currentBalance: number
): Promise<AzleResult<boolean, string>> {
  const actor_bitcoinCanister: ActorSubclass<_BTC> = await createActor(
    "bitcoin_canister"
  );

  const address = await actor_bitcoinCanister.get_p2pkh_address(identifier);

  const balance = await actor_bitcoinCanister.get_balance(address);
  // console.log("🚀 ~ file: index.ts:69 ~ balance:", balance);

  return {
    Ok: humanToE8s(currentBalance) === balance,
  };
}

export async function transferToIdentifier(
  userAIdentity: Identity,
  identifier1: number,
  identifier2: number
): Promise<AzleResult<boolean, string>> {
  const userA_actor_bitcoinCanister: ActorSubclass<_BTC> = await createActor(
    "bitcoin_canister",
    userAIdentity
  );

  const identifier2Address = await getP2PKHAddress(identifier2);

  const transferResullt: ManualReply =
    await userA_actor_bitcoinCanister.bitcoin_transfer({
      identifier: identifier1,
      destinationAddress: identifier2Address,
    });

  mineToAddress(1);

  await new Promise((resolve) => setTimeout(resolve, 20000));

  return {
    Ok: match(transferResullt, {
      unAuthorized: (res) => res === false,
      txid: (id) => {
        // console.log("🚀 ~ file: index.ts:100 ~ id:", id);
        return true;
      },
      inSufficientFunds: (n) => false,
    }),
  };
}
