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

export function get_icrc_tests(
  icrc: ActorSubclass<_SERVICE>,
  userA_icrc: ActorSubclass<_SERVICE>,
  userAIdentity: Identity,
  userB_icrc: ActorSubclass<_SERVICE>,
  userBIdentity: Identity
): Test[] {
  const identifier = randomIdentifier();
  //--------------------------The Test Should be run in sequence in order to be passed
  return [
    {
      //==================================ICP=====================================================

      // set user A principal a valid principal to initate call to ICRC methods.
      // Later it'll be replaced by will canister Id when we perform stage testing
      name: "Set icrc Canister Id From user A ICRC identity ",
      test: async () => {
        return {
          Ok:
            (await icrc.set_will_canister_id(
              userAIdentity.getPrincipal().toText()
            )) === userAIdentity.getPrincipal().toText(),
        };
      },
    },
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

    //Pausing this test as right now Canisrter subaccount is not being used for ckBTC assets

    // {
    //   name: `Canister Principal should contain 0.999999 ckBTC`,
    //   test: async () => {
    //     // const identifier: number = 172_696_504;
    //     return await compareIcrcCanistersIdentifierBalanceckBTC(9999990);
    //   },
    // },
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
