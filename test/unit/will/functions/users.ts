import { ActorSubclass } from "@dfinity/agent";
import { AzleResult } from "azle/test";
import {
  UpdateUserDetails,
  _SERVICE,
} from "../../../../dfx_generated/will/will.did";
import { createActor } from "../../../../dfx_generated/will";
import { createRandomIndentity } from "../../utils/utils";

//create users for will canister
export async function createUsers(
  userA_will: ActorSubclass<_SERVICE>,
  userB_will: ActorSubclass<_SERVICE>
): Promise<AzleResult<boolean, string>> {
  //User A details
  const userADetailsArgs = {
    firstNames: ["Muhammad ", "Zohaib"],
    lastName: "Rehman",
    sex: "M",
    birthDate: "20010910",
    birthLocationCode: "75950",
  };

  // User B Details
  const userBDetailsArgs = {
    firstNames: ["Muhammad", "Bilal"],
    lastName: "Rehman",
    sex: "M",
    birthDate: "20090910",
    birthLocationCode: "75950",
  };

  const resultA: any = await userA_will.add_user_details(userADetailsArgs);
  const resultB: any = await userB_will.add_user_details(userBDetailsArgs);
  return {
    Ok: resultA.success === true && resultB.success === true,
  };
}

//function to create user with same principal
//create users for will canister
export async function reCreateUsers(
  userA_will: ActorSubclass<_SERVICE>
): Promise<AzleResult<boolean, string>> {
  //User A details
  const userADetailsArgs = {
    firstNames: ["Muhammad ", "Zohaib"],
    lastName: "Rehman",
    sex: "M",
    birthDate: "20010910",
    birthLocationCode: "75950",
  };

  const resultA = await userA_will.add_user_details(userADetailsArgs);
  if ("userExists" in resultA) {
    return {
      Ok: resultA.userExists === true,
    };
  } else {
    return {
      Err: JSON.stringify(resultA),
    };
  }
}

//function to update users
export async function update_users(
  userA_will: ActorSubclass<_SERVICE>,
  userB_will: ActorSubclass<_SERVICE>
) {
  //User A details
  const userADetailsArgs = {
    firstNames: ["Muhammad ", "Zohaib"],
    lastName: "ur Rehman",
    sex: "M",
    birthDate: "20010910",
    birthLocationCode: "75950",
  };

  // User B Details
  const userBDetailsArgs = {
    firstNames: ["Muhammad", "Bilal"],
    lastName: "ur Rehman",
    sex: "M",
    birthDate: "20090910",
    birthLocationCode: "75950",
  };

  const updateA: UpdateUserDetails = await userA_will.update_user_details(
    userADetailsArgs
  );
  const updateB: any = await userB_will.update_user_details(userBDetailsArgs);

  if ("success" in updateA && "success" in updateB) {
    return {
      Ok: updateA.success == true && updateB.success === true,
    };
  } else {
    return {
      Err: JSON.stringify(updateA, updateB),
    };
  }
}

// function to restrict user to update user without creating them first
export async function update_users_without_create_user(): Promise<
  AzleResult<boolean, string>
> {
  const userADetailsArgs = {
    firstNames: ["Muhammad ", "Zohaib"],
    lastName: "ur Rehman",
    sex: "M",
    birthDate: "20010910",
    birthLocationCode: "75950",
  };

  const unAuthorizedUser = await createRandomIndentity(createActor);

  const updateUser: UpdateUserDetails =
    await unAuthorizedUser.update_user_details(userADetailsArgs);

  if ("userNotExists" in updateUser) {
    return {
      Ok: updateUser.userNotExists == true,
    };
  } else {
    return {
      Err: JSON.stringify(updateUser),
    };
  }
}
