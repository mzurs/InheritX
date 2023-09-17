import { ActorSubclass, Identity } from "@dfinity/agent";
import { Test } from "azle/test";

import { _SERVICE } from "../../../dfx_generated/icrc/icrc.did";
import {
  compareICPBalance,
  compareIcrcCanistersIdentifierBalance,
  transferFromICRC,
  transferICPToICRC,
} from "./functions/icp";

export function get_icrc_tests(
  icrc: ActorSubclass<_SERVICE>,
  userA_icrc: ActorSubclass<_SERVICE>,
  userAIdentity: Identity,
  userB_icrc: ActorSubclass<_SERVICE>,
  userBIdentity: Identity
): Test[] {
  //--------------------------The Test Should be run in sequence in order to be passed
  return [
    {
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
      name: "Transfer 1 ICP from User A Identifier Derived Account",
      test: async () => {
        const identifier: number = 172_696_504;
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
      name: `Canister Subaccount With Identifier ${"172_696_504"} should contain 0.9999 ICP`,
      test: async () => {
        const identifier: number = 172_696_504;
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
        const identifier = 172_696_504;
        const userBPrinicipal = userBIdentity.getPrincipal();
        return await transferFromICRC(userA_icrc, userBPrinicipal, identifier);
      },
    },
    {
      name: `Canister Subaccount With Identifier ${"172_696_504"} should contain 0 ICP`,
      test: async () => {
        const identifier: number = 172_696_504;
        return await compareIcrcCanistersIdentifierBalance(identifier, 0);
      },
    },
  ];
}
