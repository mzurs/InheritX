import { ActorSubclass, Identity } from "@dfinity/agent";
import { Test } from "azle/test";
import {
  claimICRCWill,
  compareTotalWill,
  createICRCWill,
  deleteWill,
} from "./functions";
import { icpBalance } from "./functions/icrc";
import { e8sToHuman } from "../../utils/utils";

export async function get_will_tests(
  identifier: number,
  userAIdentity: Identity,
  userBIdentity: Identity
): Promise<Test[]> {
  // console.log("🚀 ~ file: tests.ts:12 ~ identifier:", identifier);
  const icpIdentifier = parseInt(String(Math.random() * 10 ** 8));

  const ckbtcIdentifier = parseInt(String(Math.random() * 10 ** 8));

  //Assign User Principals
  const userAPrincipal = userAIdentity.getPrincipal();
  const userBPrincipal = userBIdentity.getPrincipal();

  const userABalance = e8sToHuman(
    await icpBalance(userAIdentity.getPrincipal())
  );
  // console.log("🚀 ~ file: tests.ts:16 ~ userABalance:", userABalance);
  const userBBalance = e8sToHuman(
    await icpBalance(userBIdentity.getPrincipal())
  );
  // console.log("🚀 ~ file: tests.ts:18 ~ userBBalance:", userBBalance);

  //--------------------------The Test Should be run in sequence in order to be passed
  return [
    // -------------------------------ICP-----------------------------------------------
    {
      name: `Create Will from UserA to UserB for 1 ICP`,
      test: async () => {
        return await createICRCWill(
          "ICP",
          identifier,
          userAIdentity,
          userBIdentity,
          1
        );
      },
    },
    {
      name: "List of Testator Will should be 1",
      test: async () => {
        return await compareTotalWill("testator", userAIdentity, 1);
      },
    },
    {
      name: "List of Heirs Will should be 1",
      test: async () => {
        return await compareTotalWill("heirs", userBIdentity, 1);
      },
    },
    {
      name: `Delete Will with Identifier ${identifier}`,
      test: async () => {
        return await deleteWill(userAIdentity, identifier, "ICRC", "ICP");
      },
    },
    {
      name: "List of Testator Will should be 0",
      test: async () => {
        return await compareTotalWill("testator", userAIdentity, 0);
      },
    },
    {
      name: "List of Heirs Will should be 0",
      test: async () => {
        return await compareTotalWill("heirs", userBIdentity, 0);
      },
    },
    {
      name: "Initiate ICP Claim From User B",
      test: async () => {
        return await claimICRCWill(
          userAIdentity,
          userBIdentity,
          icpIdentifier,
          "ICP",
          1
        );
      },
    },
    {
      name: "List of Testator Will should be 0",
      test: async () => {
        return await compareTotalWill("testator", userAIdentity, 0);
      },
    },
    {
      name: "List of Heirs Will should be 0",
      test: async () => {
        return await compareTotalWill("heirs", userBIdentity, 0);
      },
    },
    // -------------------------------ckBTC-----------------------------------------------
    {
      name: `Create Will from UserA to UserB for 1 ckBTC`,
      test: async () => {
        return await createICRCWill(
          "ckBTC",
          ckbtcIdentifier,
          userAIdentity,
          userBIdentity,
          1
        );
      },
    },

    {
      name: "List of Testator Will should be 1",
      test: async () => {
        return await compareTotalWill("testator", userAIdentity, 1);
      },
    },
    {
      name: "List of Heirs Will should be 1",
      test: async () => {
        return await compareTotalWill("heirs", userBIdentity, 1);
      },
    },
    {
      name: `Delete Will with Identifier ${ckbtcIdentifier}`,
      test: async () => {
        return await deleteWill(
          userAIdentity,
          ckbtcIdentifier,
          "ICRC",
          "ckBTC"
        );
      },
    },
    {
      name: "List of Testator Will should be 0",
      test: async () => {
        return await compareTotalWill("testator", userAIdentity, 0);
      },
    },
    {
      name: "List of Heirs Will should be 0",
      test: async () => {
        return await compareTotalWill("heirs", userBIdentity, 0);
      },
    },
    {
      name: "Initiate Claim From User B",
      test: async () => {
        const ckbtcIdentifier1 = parseInt(String(Math.random() * 10 ** 10));

        return await claimICRCWill(
          userAIdentity,
          userBIdentity,
          ckbtcIdentifier1,
          "ckBTC",
          1
        );
      },
    },
    {
      name: "List of Testator Will should be 0",
      test: async () => {
        return await compareTotalWill("testator", userAIdentity, 0);
      },
    },
    {
      name: "List of Heirs Will should be 0",
      test: async () => {
        return await compareTotalWill("heirs", userBIdentity, 0);
      },
    },
  ];
}