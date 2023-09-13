import { ActorSubclass } from "@dfinity/agent";
import { Test } from "azle/test";
import { AddUserDetails, _SERVICE } from "../../../dfx_generated/will/will.did";
import {
  createUsers,
  reCreateUsers,
  update_users,
  update_users_without_create_user,
} from "./functions/users";

export function get_will_tests(
  will: ActorSubclass<_SERVICE>,
  userA_will: ActorSubclass<_SERVICE>,
  userB_will: ActorSubclass<_SERVICE>
): Test[] {
  return [
    //--------------------------------------------------USERS----------------------------------------------------------
    {
      name: "Create New User A and B => ",
      test: async () => {
        return await createUsers(userA_will, userB_will);
      },
    },
    {
      name: "Restrict to create user with Same principal  => ",
      test: async () => {
        return await reCreateUsers(userA_will);
      },
    },
    {
      name: "Update User A and B => ",
      test: async () => {
        return await update_users(userA_will, userB_will);
      },
    },
    {
      name: "Cannot update details before user object creation => ",
      test: async () => {
        return await update_users_without_create_user();
      },
    },
  ];
}
