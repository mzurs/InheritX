import { ActorSubclass } from "@dfinity/agent";
import { Test } from "azle/test";
import type { Principal } from "@dfinity/principal";

import { AddUserDetails, _SERVICE } from "../../../dfx_generated/will/will.did";
import {
  createUsers,
  reCreateUsers,
  update_users,
  update_users_without_create_user,
} from "./functions/users";
import {
  create_will_for_heirs,
  length_of_wills_for_heirs,
} from "./functions/will";
import { create_actor } from "../utils/utils";

export function get_will_tests(
  will: ActorSubclass<_SERVICE>,
  userA_will: ActorSubclass<_SERVICE>,
  userAIdentity: Principal,
  userB_will: ActorSubclass<_SERVICE>,
  userBIdentity: Principal
): Test[] {
  return [
    //--------------------------------------------------USERS----------------------------------------------------------
    {
      name: "Create New User A and B => ",
      test: async () => {
        const randomActorA = await create_actor("will");
        const randomActorB = await create_actor("will");

        return await createUsers(randomActorA, randomActorB);
      },
    },
    {
      name: "Restrict to create user with Same principal  => ",
      test: async () => {
        return await reCreateUsers();
      },
    },
    {
      name: "Update User A and B => ",
      test: async () => {
        return await update_users();
      },
    },
    {
      name: "Cannot update details before user object creation => ",
      test: async () => {
        return await update_users_without_create_user();
      },
    },
    //--------------------------------------------------WILL----------------------------------------------------------

    // {
    //   name: "Create ICRC Will for UserB",
    //   test: async () => {
    //     return await create_will_for_heirs();
    //   },
    // },

    // {
    //   name: "Delete ICRC Will for UserA",
    //   test: async () => {
    //     return await delete_will("icrc");
    //   },
    // },
  ];
}
