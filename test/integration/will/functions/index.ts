import { AzleResult, getCanisterId } from "azle/test";
import { IcrcType } from "../utils/utils";
import { ActorSubclass, Identity } from "@dfinity/agent";
import {
  CreateWillArgs,
  GetHeirWills,
  GetTestatorWills,
  ManualReply_1,
  ManualReply_2,
  ManualReply_3,
  ManualReply_4,
  _SERVICE as _WILL,
  userDetailsArgs,
} from "../../../../dfx_generated/will/will.did";
import { createActor } from "../../../utils/actors";
import { _SERVICE as _ICP } from "../../../../dfx_generated/icp/icp/icp_ledger.did";
import { humanToE8s } from "../../../utils/utils";
import { _SERVICE as _ICRC } from "../../../../dfx_generated/icrc/icrc.did";
import {
  TransferArg,
  _SERVICE,
} from "../../../../dfx_generated/ckbtc/ckbtc/ckbtc_ledger.did";
import { Principal } from "@dfinity/principal";
// function to create will test
export async function createICRCWill(
  asset: string,
  identifier: number,
  userAIdentity: Identity,
  userBIdentity: Identity,
  amount: number
): Promise<AzleResult<boolean, string>> {
  if (!IcrcType.includes(asset)) {
    return {
      Err: `Asset: ${asset} Not Supported By InheritX`,
    };
  } else {
    //user A & B principal from identities
    const principalUserA = userAIdentity.getPrincipal();
    // console.log("🚀 ~ file: index.ts:28 ~ principalUserA:", principalUserA.toText())
    const principalUserB = userBIdentity.getPrincipal();
    // console.log("🚀 ~ file: index.ts:30 ~ principalUserB:", principalUserB.toText())

    //creates actor of will canister for UserA

    const actor_icp_userA: ActorSubclass<_ICP> = await createActor(
      "icp_ledger",
      userAIdentity
    );
    const actor_will_userA: ActorSubclass<_WILL> = await createActor(
      "will",
      userAIdentity
    );
    const actor_icrc_userA: ActorSubclass<_ICRC> = await createActor(
      "icrc",
      userAIdentity
    );

    const identifierAccount =
      await actor_icrc_userA.get_canister_binary_subaccount_from_identifier(
        identifier
      );
    if (asset === "ckBTC") {
      const actorCKBTC: ActorSubclass<_SERVICE> = await createActor(
        "ckbtc_ledger",
        userAIdentity
      );

      const transferArgs: TransferArg = {
        from_subaccount: [],
        to: {
          owner: Principal.fromText(getCanisterId("icrc")),
          subaccount: [],
        },
        memo: [],
        fee: [10n],
        created_at_time: [],
        amount: humanToE8s(amount) - 10n,
      };
      const transferResult = await actorCKBTC.icrc1_transfer(transferArgs);
    }

    if (asset === "ICP") {
      const transferICP = await actor_icp_userA.transfer({
        to: identifierAccount,
        amount: { e8s: humanToE8s(amount) - humanToE8s(0.0001) },
        fee: { e8s: 10_000n },
        from_subaccount: [],
        created_at_time: [],
        memo: 0n,
      });
      console.log("🚀 ~ file: index.ts:67 ~ transferICP:", transferICP);
    }
    // if ("Ok" in transferICP) {
    //create user with correct details to proceed corrct test results
    const userDetails: userDetailsArgs = {
      firstNames: ["Claudine", "Paulette"],
      lastName: "Thiebaut",
      sex: "F",
      birthDate: "19350728",
      birthLocationCode: "78018",
    };

    await actor_will_userA.add_user_details(userDetails);

    //create will object
    const createWillObj: CreateWillArgs = {
      icrc: {
        heirs: principalUserB,
        willName: `Will For UserB`,
        willDescription: `Hi, my name is User A , I am creating a will to pass-on my 1 ICP to User B`,
        tokenTicker: asset,
        identifier: identifier,
        amount: 100_000_000n,
      },
    };
    const willType = "ICRC";
    const createWill: ManualReply_2 = await actor_will_userA.create_will(
      createWillObj,
      willType
    );
    // console.log("🚀 ~ file: index.ts:62 ~ createWill:", createWill);
    if ("icrc" in createWill && "success" in createWill.icrc) {
      return {
        Ok: createWill.icrc.success === true,
      };
    } else {
      return {
        Err: JSON.stringify(createWill),
      };
    }
    // } else {
    //   return {
    //     Err: JSON.stringify(transferICP),
    //   };
    // }
  }
}

//function to compare total will for heirs or testator
export async function compareTotalWill(
  userType: string,
  identity: Identity,
  totalWills: number
): Promise<AzleResult<boolean, string>> {
  console.log(
    "🚀 ~ file: index.ts:83 ~ identity:",
    identity.getPrincipal().toText()
  );
  const actor_will_userAny: ActorSubclass<_WILL> = await createActor(
    "will",
    identity
  );

  switch (userType) {
    case "testator":
      const testatorWills: GetTestatorWills =
        await actor_will_userAny.get_wills_for_testator();
      // console.log("🚀 ~ file: index.ts:91 ~ testatorWills:", testatorWills);

      if ("wills" in testatorWills) {
        return {
          Ok: testatorWills.wills.length === totalWills,
        };
      } else {
        return {
          Err: JSON.stringify(testatorWills),
        };
      }
    case "heirs":
      const heirsWills: GetHeirWills =
        await actor_will_userAny.get_wills_for_heir();
      // console.log("🚀 ~ file: index.ts:104 ~ heirsWills:", heirsWills);

      if ("wills" in heirsWills) {
        return {
          Ok: heirsWills.wills.length === totalWills,
        };
      } else {
        return {
          Err: JSON.stringify(heirsWills),
        };
      }
    default:
      return {
        Err: JSON.stringify(`UserType: ${userType} not found`),
      };
  }
}

export async function deleteWill(
  identity: Identity,
  identifier: number,
  willType: string,
  asset: string
): Promise<AzleResult<boolean, string>> {
  const actor_will_user: ActorSubclass<_WILL> = await createActor(
    "will",
    identity
  );

  const deleteWillResult: ManualReply_3 = await actor_will_user.delete_will(
    identifier,
    willType
  );
  console.log("🚀 ~ file: index.ts:178 ~ deleteWillResult:", deleteWillResult);
  if (asset === "ICP") {
    if (
      "icrc" in deleteWillResult &&
      "icpRetainResult" in deleteWillResult.icrc &&
      "success" in deleteWillResult.icrc.icpRetainResult
    ) {
      return {
        Ok: deleteWillResult.icrc.icpRetainResult.success === true,
      };
    } else {
      return {
        Err: JSON.stringify(deleteWillResult),
      };
    }
  }
  if (asset === "ckBTC") {
    if (
      "icrc" in deleteWillResult &&
      "ckbtcRetainResult" in deleteWillResult.icrc &&
      "success" in deleteWillResult.icrc.ckbtcRetainResult
    ) {
      return {
        Ok: deleteWillResult.icrc.ckbtcRetainResult.success === true,
      };
    } else {
      return {
        Err: JSON.stringify(deleteWillResult),
      };
    }
  }
  return {
    Err: JSON.stringify(`Asset ${asset} Not supported`),
  };
}

export async function claimICRCWill(
  userAIdentity: Identity,
  userBIdentity: Identity,
  identifier: number,
  asset: string,
  amount: number
): Promise<AzleResult<boolean, string>> {
  //user A & B principal from identities
  const principalUserA = userAIdentity.getPrincipal();
  // console.log("🚀 ~ file: index.ts:28 ~ principalUserA:", principalUserA.toText())
  const principalUserB = userBIdentity.getPrincipal();
  // console.log("🚀 ~ file: index.ts:30 ~ principalUserB:", principalUserB.toText())

  const actor_icp_userA: ActorSubclass<_ICP> = await createActor(
    "icp_ledger",
    userAIdentity
  );
  const actor_will_userA: ActorSubclass<_WILL> = await createActor(
    "will",
    userAIdentity
  );

  const actor_icrc_userA: ActorSubclass<_ICRC> = await createActor(
    "icrc",
    userAIdentity
  );

  const actor_will_userB: ActorSubclass<_WILL> = await createActor(
    "will",
    userBIdentity
  );
  const identifierAccount =
    await actor_icrc_userA.get_canister_binary_subaccount_from_identifier(
      identifier
    );
  if (asset === "ICP") {
    const transferICP = await actor_icp_userA.transfer({
      to: identifierAccount,
      amount: { e8s: humanToE8s(amount) - humanToE8s(0.0001) },
      fee: { e8s: 10_000n },
      from_subaccount: [],
      created_at_time: [],
      memo: 0n,
    });
    // console.log("🚀 ~ file: index.ts:240 ~ transferICP:", transferICP);
  }

  if (asset === "ckBTC") {
    const actorCKBTC: ActorSubclass<_SERVICE> = await createActor(
      "ckbtc_ledger",
      userAIdentity
    );

    const transferArgs: TransferArg = {
      from_subaccount: [],
      to: {
        owner: Principal.fromText(getCanisterId("icrc")),
        subaccount: [],
      },
      memo: [],
      fee: [10n],
      created_at_time: [],
      amount: humanToE8s(amount) - 10n,
    };
    const transferResult = await actorCKBTC.icrc1_transfer(transferArgs);
  }
  //create will object
  const createWillObj: CreateWillArgs = {
    icrc: {
      heirs: principalUserB,
      willName: `Will For UserB`,
      willDescription: `Hi, my name is User A , I am creating a will to pass-on my ${amount} ${asset} to User B`,
      tokenTicker: asset,
      identifier: identifier,
      amount: humanToE8s(amount) - 10n,
    },
  };
  const willType = "ICRC";
  const createWill: ManualReply_2 = await actor_will_userA.create_will(
    createWillObj,
    willType
  );

  if ("icrc" in createWill && "success" in createWill.icrc) {
    const base64ID = "kutIDRN21IH_";
    const reportDeathResult: ManualReply_4 =
      await actor_will_userB.report_death_by_base64Id(identifier, base64ID);
    // console.log(
    //   "🚀 ~ file: index.ts:251 ~ reportDeathResult:",
    //   reportDeathResult
    // );

    if ("result" in reportDeathResult) {
      const willType = "ICRC";
      const claimWillResult: ManualReply_1 = await actor_will_userB.claim_will(
        identifier,
        willType
      );
      // console.log(
      //   "🚀 ~ file: index.ts:253 ~ claimWillResult:",
      //   claimWillResult
      // );

      if (asset === "ICP") {
        if (
          "icrc" in claimWillResult &&
          "icpClaimResult" in claimWillResult.icrc
        ) {
          return {
            Ok: claimWillResult.icrc.icpClaimResult.success === true,
          };
        } else {
          return {
            Err: JSON.stringify(claimWillResult),
          };
        }
      }
      if (asset === "ckBTC") {
        if (
          "icrc" in claimWillResult &&
          "ckbtcClaimResult" in claimWillResult.icrc
        ) {
          return {
            Ok: claimWillResult.icrc.ckbtcClaimResult.success === true,
          };
        } else {
          return {
            Err: JSON.stringify(claimWillResult),
          };
        }
      } else {
        return {
          Err: JSON.stringify(`Asset ${asset} Not supported`),
        };
      }
    } else {
      return {
        Err: JSON.stringify(reportDeathResult),
      };
    }
  } else {
    return {
      Err: JSON.stringify(createWill),
    };
  }
}
