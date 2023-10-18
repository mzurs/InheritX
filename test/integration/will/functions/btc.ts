import { ActorSubclass, Identity } from "@dfinity/agent";
import { AzleResult } from "azle/test";
import { createActor } from "../../../utils/actors";
import { _SERVICE as _BTC } from "../../../../declarations/bitcoin_canister/bitcoin_canister.did";
import {
  CreateWillArgs,
  ManualReply_1,
  ManualReply_2,
  ManualReply_3,
  _SERVICE as _WILL,
} from "../../../../declarations/will/will.did";
import { mineToAddress } from "../../../unit/bitcoin/functions/utils";
import { humanToE8s } from "../../../utils/utils";
export async function createBTCWill(
  identifier: number,
  userAIdentity: Identity,
  userBIdentity: Identity,
  amount: number
): Promise<AzleResult<boolean, string>> {
  const actor_btc_userA: ActorSubclass<_BTC> = await createActor(
    "bitcoin_canister",
    userAIdentity
  );

  const actor_will_userA: ActorSubclass<_WILL> = await createActor(
    "will",
    userAIdentity
  );

  const p2pkhAddress = await actor_btc_userA.get_p2pkh_address(identifier);

  await mineToAddress(1, p2pkhAddress);

  //create will object
  const createWillObj: CreateWillArgs = {
    btc: {
      heirs: userBIdentity.getPrincipal(),
      willName: `Will For UserB`,
      willDescription: `Hi, my name is User A , I am creating a will to pass-on my ${amount} BTC to User B`,
      tokenTicker: "BTC",
      identifier: identifier,
      amountInSats: humanToE8s(amount),
    },
  };
  const btcCreateWillResult: ManualReply_2 = await actor_will_userA.create_will(
    createWillObj,
    "BTC"
  );

  if ("btc" in btcCreateWillResult && "success" in btcCreateWillResult.btc) {
    return {
      Ok: btcCreateWillResult.btc.success === true,
    };
  } else {
    return {
      Err: JSON.stringify(btcCreateWillResult),
    };
  }
}

export async function deleteBTCWill(
  userAIdentity: Identity,
  identifier: number,
  btcAddress: string
): Promise<AzleResult<boolean, string>> {
  const actor_will_userA: ActorSubclass<_WILL> = await createActor(
    "will",
    userAIdentity
  );

  const deleteWillResult: ManualReply_3 = await actor_will_userA.delete_will(
    identifier,
    "BTC",
    [btcAddress]
  );
  // console.log("🚀 ~ file: btc.ts:75 ~ deleteWillResult:", deleteWillResult);

  if (
    "btc" in deleteWillResult &&
    "btcRetainResult" in deleteWillResult.btc &&
    "success" in deleteWillResult.btc.btcRetainResult
  ) {
    mineToAddress(1);
    return {
      Ok: deleteWillResult.btc.btcRetainResult.success === true,
    };
  } else {
    return {
      Err: JSON.stringify(deleteWillResult),
    };
  }
}

export async function claimBTCWill(
  userAIdentity: Identity,
  userBIdentity: Identity,
  identifier: number,
  amount: number,
  address: string
): Promise<AzleResult<boolean, string>> {
  const actor_will_userB: ActorSubclass<_WILL> = await createActor(
    "will",
    userBIdentity
  );

  await createBTCWill(identifier, userAIdentity, userBIdentity, amount);

  await new Promise((resolve) => setTimeout(resolve, 15000));

  const claimWillResult: ManualReply_1 = await actor_will_userB.claim_will(
    identifier,
    "BTC",
    [address]
  );
  // console.log("🚀 ~ file: btc.ts:109 ~ claimWillResult:", claimWillResult);

  if (
    "btc" in claimWillResult &&
    "btcClaimResult" in claimWillResult.btc &&
    "success" in claimWillResult.btc.btcClaimResult
  ) {
    await new Promise((resolve) => setTimeout(resolve, 5000));

    mineToAddress(1);

    return {
      Ok: claimWillResult.btc.btcClaimResult.success === true,
    };
  } else {
    return {
      Err: JSON.stringify(claimWillResult),
    };
  }
}
