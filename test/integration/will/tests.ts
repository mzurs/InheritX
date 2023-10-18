import { Identity } from "@dfinity/agent";
import { Test } from "azle/test";
import {
  claimICRCWill,
  compareTotalWill,
  createICRCWill,
  deleteWill,
  isWillExistsHeirs,
  isWillExistsTestator,
} from "./functions";
import { claimBTCWill, createBTCWill, deleteBTCWill } from "./functions/btc";

export async function get_will_tests(
  identifier: number,
  userAIdentity: Identity,
  userBIdentity: Identity
): Promise<Test[]> {
  const icpIdentifier = parseInt(String(Math.random() * 10 ** 5));

  const ckbtcIdentifier = parseInt(String(Math.random() * 10 ** 5));

  const btcIdentifier = parseInt(String(Math.random() * 10 ** 5));
  const btcIdentifier1 = parseInt(String(Math.random() * 10 ** 5));

  //--------------------------The Test Should be run in sequence in order to be passed
  return [
    // -------------------------------ICP-----------------------------------------------
    {
      name: "is_will_exists_for_heirs function should return false",
      test: async () => {
        return await isWillExistsHeirs(userBIdentity, false);
      },
    },
    {
      name: "is_will_exists_for_testator function should return false",
      test: async () => {
        return await isWillExistsTestator(userAIdentity, false);
      },
    },
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
      name: "is_will_exists_for_heirs function should return true",
      test: async () => {
        return await isWillExistsHeirs(userBIdentity, true);
      },
    },
    {
      name: "is_will_exists_for_testator function should return true",
      test: async () => {
        return await isWillExistsTestator(userAIdentity, true);
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
      name: `Delete Will of ICP with Identifier ${identifier}`,
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
      name: `Delete Will of ckBTC with Identifier ${ckbtcIdentifier}`,
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
      name: "Initiate Claim of ckBTC From User B",
      test: async () => {
        const ckbtcIdentifier1 = parseInt(String(Math.random() * 10 ** 5));

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

    // -------------------------------BTC-----------------------------------------------
    {
      name: `Create a Will from UserA to UserB for 1 BTC with Identifier ${btcIdentifier}`,
      test: async () => {
        return await createBTCWill(
          btcIdentifier,
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
      name: `Delete Will of BTC with Identifier ${btcIdentifier} for Address mmk8VS6G4KrEJKeNZE8sc8Ta1QPxsWWWWg`,
      test: async () => {
        const btcAddress = "mmk8VS6G4KrEJKeNZE8sc8Ta1QPxsWWWWg";
        await new Promise((resolve) => setTimeout(resolve, 15000));

        return await deleteBTCWill(userAIdentity, btcIdentifier, btcAddress);
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
      name: `Initiate Claim of 1 BTC From User B with Identifier ${btcIdentifier1} for Address n3tf5qn6WfoWEk85xoS5PDR9FvfExZTDaw`,
      test: async () => {
        // mineToAddress(1);
        return await claimBTCWill(
          userAIdentity,
          userBIdentity,
          btcIdentifier1,
          1,
          "n3tf5qn6WfoWEk85xoS5PDR9FvfExZTDaw"
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
