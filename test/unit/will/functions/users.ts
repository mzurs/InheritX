import { ActorSubclass, Identity } from "@dfinity/agent";
import { AzleResult } from "azle/test";
import {
  UpdateUserDetails,
  _SERVICE,
} from "../../../../declarations/will/will.did";
import { createActor } from "../../../utils/actors";
import { createRandomIdentity } from "../../../utils/utils";
// import { createActor } from "../../../../declarations/will";
// import { create_actor } from "../../utils/utils";

//create users for will canister
export async function createUsers(
  userAIdentity: Identity,
  userBIdentity: Identity
): Promise<AzleResult<boolean, string>> {
  const actor_will_userA: ActorSubclass<_SERVICE> = await createActor(
    "will",
    userAIdentity
  );
  const actor_will_userB: ActorSubclass<_SERVICE> = await createActor(
    "will",
    userBIdentity
  );

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

  const resultA: any = await actor_will_userA.add_user_details(
    userADetailsArgs
  );
  const resultB: any = await actor_will_userB.add_user_details(
    userBDetailsArgs
  );
  return {
    Ok: resultA.success === true && resultB.success === true,
  };
}

//function to create user with same principal
//create users for will canister
export async function reCreateUsers(): Promise<AzleResult<boolean, string>> {
  const userA_will = await createActor("will");

  //User A details
  const userADetailsArgs = {
    firstNames: ["Muhammad ", "Zohaib"],
    lastName: "Rehman",
    sex: "M",
    birthDate: "20010910",
    birthLocationCode: "75950",
  };

  //creating user first
  await userA_will.add_user_details(userADetailsArgs);

  //then recreating with same object
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
  userAIdentity: Identity,
  userBIdentity: Identity
) {
  //creating an actors first
  const actor_will_userA: ActorSubclass<_SERVICE> = await createActor(
    "will",
    userAIdentity
  );
  const actor_will_userB: ActorSubclass<_SERVICE> = await createActor(
    "will",
    userBIdentity
  );
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

  //creating user first
  await createUsers(userAIdentity, userBIdentity);

  const updateA: UpdateUserDetails = await actor_will_userA.update_user_details(
    userADetailsArgs
  );
  const updateB: any = await actor_will_userB.update_user_details(
    userBDetailsArgs
  );

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

  const newIdentity = createRandomIdentity();
  const unAuthorizedUser = await createActor("will", newIdentity);

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
