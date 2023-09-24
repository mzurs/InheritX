import { Identity } from "@dfinity/agent";
import { Test } from "azle/test";

import { _SERVICE } from "../../../declarations/will/will.did";
import {
  createUsers,
  reCreateUsers,
  update_users,
  update_users_without_create_user,
} from "./functions/users";

export function get_will_tests(
  userAIdentity: Identity,
  userBIdentity: Identity
): Test[] {
  return [
    //--------------------------------------------------USERS----------------------------------------------------------
    {
      name: "Create New User A and B => ",
      test: async () => {
        return await createUsers(userAIdentity, userBIdentity);
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
        return await update_users(userAIdentity, userBIdentity);
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
