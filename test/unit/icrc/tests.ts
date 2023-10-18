import { ActorSubclass, Identity } from "@dfinity/agent";
import { Test } from "azle/test";

import { _SERVICE } from "../../../declarations/icrc/icrc.did";
import {
  compareICPBalance,
  compareIcrcCanistersIdentifierBalance,
  transferFromICRC,
  transferICPToICRC,
} from "./functions/icp";
import {
  compareckBTCBalance,
  transferFromICRCckBTC,
  transferckBTCToICRC,
} from "./functions/ckbtc";
import { randomIdentifier } from "../../utils/utils";

export async function get_icrc_tests(
  userA_icrc: ActorSubclass<_SERVICE>,
  userAIdentity: Identity,
  userBIdentity: Identity
): Promise<Test[]> {
  const identifier = randomIdentifier();
  //--------------------------The Test Should be run in sequence in order to be passed
  return [
    // {
    //   //==================================ICP=====================================================

    {
      name: `PrincipalA => ${userAIdentity
        .getPrincipal()
        .toText()} Balance should be 1 ICP`,
      test: async () => {
        return await compareICPBalance(
          userAIdentity.getPrincipal().toText(),
          1
        );
      },
    },
    {
      name: "Transfer 1 ICP from User A TO ICRC Derived Account",
      test: async () => {
        return await transferICPToICRC(userAIdentity, identifier, 1);
      },
    },
    {
      // After transferring the amount shoud be 0
      name: `PrincipalA => ${userAIdentity
        .getPrincipal()
        .toText()} Balance should be 0 ICP`,
      test: async () => {
        return await compareICPBalance(
          userAIdentity.getPrincipal().toText(),
          0
        );
      },
    },
    {
      name: `Canister Subaccount With Identifier ${identifier} should contain 0.9999 ICP`,
      test: async () => {
        return await compareIcrcCanistersIdentifierBalance(
          identifier,
          1 - 0.0001
        );
      },
    },
    {
      name: `Transfer From ICRC Canister to Principal=> ${userBIdentity
        .getPrincipal()
        .toText()} `,
      test: async () => {
        const userBPrinicipal = userBIdentity.getPrincipal();
        return await transferFromICRC(userA_icrc, userBPrinicipal, identifier);
      },
    },
    {
      name: `Canister Subaccount With Identifier ${identifier} should contain 0 ICP`,
      test: async () => {
        return await compareIcrcCanistersIdentifierBalance(identifier, 0);
      },
    },

    //===========================================CKBTC=================================================

    {
      name: `PrincipalA => ${userAIdentity
        .getPrincipal()
        .toText()} Balance should be 1 ckBTC`,
      test: async () => {
        return await compareckBTCBalance(userAIdentity.getPrincipal(), 1);
      },
    },
    {
      name: "Transfer 1 ckBTC from User A tO Derived ICRC Canister Principal",
      test: async () => {
        return await transferckBTCToICRC(userAIdentity, identifier, 1);
      },
    },
    {
      // After transferring the amount shoud be 0
      name: `PrincipalA => ${userAIdentity
        .getPrincipal()
        .toText()} Balance should be 0 ckBTC`,
      test: async () => {
        return await compareckBTCBalance(userAIdentity.getPrincipal(), 0);
      },
    },

    {
      name: `Transfer From ICRC Canister to Principal=> ${userBIdentity
        .getPrincipal()
        .toText()} `,
      test: async () => {
        const userBPrinicipal = userBIdentity.getPrincipal();
        return await transferFromICRCckBTC(
          userA_icrc,
          userBPrinicipal,
          identifier,
          1
        );
      },
    },
  ];
}
