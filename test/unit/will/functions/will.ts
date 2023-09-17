import { ActorSubclass } from "@dfinity/agent";
import { AzleResult } from "azle/test";
import {
  CreateWillArgs,
  _SERVICE,
} from "../../../../dfx_generated/will/will.did";
import { createRandomIdentity, create_actor } from "../../utils/utils";

//----------------------------Create Will for Heirs

export async function create_will_for_heirs(): Promise<
  AzleResult<boolean, string>
> {
  const testator_will = await create_actor("will");
  const heirsIdentity = (await createRandomIdentity()).getPrincipal();

  //requesting random Identifier
  const requesttRandomIdentifier =
    await testator_will.request_random_will_identifier();

  //will object creation
  const willObj: CreateWillArgs = {
    icrc: {
      willName: `Will for ${heirsIdentity}`,
      willDescription: `Hi, my name is XYZ, I am creating a will for my belongings`,
      tokenTicker: "ICP",
      heirs: heirsIdentity,
      amount: 100000000n, //1 ICP,
      identifier: requesttRandomIdentifier,
    },
  };

  const createWill = await testator_will.create_will(willObj, "ICRC");

  if ("icrc" in createWill && "success" in createWill.icrc) {
    return {
      Ok: createWill.icrc.success === true,
    };
  } else {
    return {
      Err: JSON.stringify(createWill),
    };
  }
}

export async function length_of_wills_for_heirs(
  heirs_will: ActorSubclass<_SERVICE>,
  length: number
): Promise<AzleResult<boolean, string>> {
  const willClaims = await heirs_will.get_wills_for_heir();
  console.log("🚀 ~ file: will.ts:51 ~ willClaims:", willClaims);

  if ("wills" in willClaims) {
    return {
      Ok: willClaims.wills.length === length,
    };
  } else {
    return {
      Err: JSON.stringify(willClaims),
    };
  }
}

export async function deleteWill(type: string) {
  const testator_will: ActorSubclass<_SERVICE> = await create_actor("will");
  const heirsIdentity = (await createRandomIdentity()).getPrincipal();

  //requesting random Identifier
  const requesttRandomIdentifier =
    await testator_will.request_random_will_identifier();

  //will object creation
  const willObj: CreateWillArgs = {
    icrc: {
      willName: `Will for ${heirsIdentity}`,
      willDescription: `Hi, my name is XYZ, I am creating a will for my belongings`,
      tokenTicker: "ICP",
      heirs: heirsIdentity,
      amount: 100000000n, //1 ICP,
      identifier: requesttRandomIdentifier,
    },
  };

  //create Will
  await testator_will.create_will(willObj, "ICRC");

  const deleteWill = testator_will.delete_will(requesttRandomIdentifier,"ICRC");
}
