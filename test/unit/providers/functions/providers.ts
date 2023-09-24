import { ActorSubclass } from "@dfinity/agent";
import {
  TestatorDetails,
  _SERVICE,
} from "../../../../declarations/providers/providers.did";
import { AzleResult } from "azle/test";
import { Principal } from "azle";

export async function check_testator_death_with_wrong_principal(
  providers: ActorSubclass<_SERVICE>
): Promise<AzleResult<boolean, string>> {
  const testPrincipal = Principal.fromText(
    "fozjk-zvlft-ubpd3-r5gbm-edhvu-vqgwh-jzkxz-wsmbc-xmrw5-xm3tj-vae"
  );
  const isTestatorDied = await providers.isTestatorDied(testPrincipal);
  if (!isTestatorDied) {
    return {
      Ok: isTestatorDied === false,
    };
  } else {
    return {
      Err: JSON.stringify(isTestatorDied),
    };
  }
}

export async function check_testator_details_with_correct_id(
  providers: ActorSubclass<_SERVICE>
): Promise<AzleResult<boolean, string>> {
  const testPrincipal = Principal.fromText(
    "fu727-7jdc5-rsfnw-jhdwu-n7ne3-4j4mc-7pvb4-bivf6-emr4q-q4svi-oqe"
  );
  //Base64 ID strings
  const RIGHT_DEATH_USERID = "kutIDRN21IH_";

  const userDetails: TestatorDetails = {
    firstNames: ["Claudine", "Paulette"],
    lastName: "Thiebaut",
    sex: "F",
    birthDate: "19350728",
    birthLocationCode: "78018",
  };

  const result = await providers.check_testator_details_with_id(
    testPrincipal,
    RIGHT_DEATH_USERID,
    userDetails
  );
  if (result.result) {
    return {
      Ok: result.result,
    };
  } else {
    return {
      Err: JSON.stringify(result),
    };
  }
}

export async function check_testator_details_with_wrong_id(
  providers: ActorSubclass<_SERVICE>
): Promise<AzleResult<boolean, string>> {
  const testPrincipal = Principal.fromText(
    "fu727-7jdc5-rsfnw-jhdwu-n7ne3-4j4mc-7pvb4-bivf6-emr4q-q4svi-oqe"
  );
  //Base64 ID strings
  const WRONG_DEATH_USERID = "ArUxoA1ZWJm4";

  const userDetails: TestatorDetails = {
    firstNames: ["Claudine", "Paulette"],
    lastName: "Thiebaut",
    sex: "F",
    birthDate: "19350728",
    birthLocationCode: "78018",
  };

  const result = await providers.check_testator_details_with_id(
    testPrincipal,
    WRONG_DEATH_USERID,
    userDetails
  );
  if (!result.result) {
    return {
      Ok: result.result === false,
    };
  } else {
    return {
      Err: JSON.stringify(result),
    };
  }
}

export async function check_testator_details_with_wrong_details(
  providers: ActorSubclass<_SERVICE>
): Promise<AzleResult<boolean, string>> {
  const testPrincipal = Principal.fromText(
    "fu727-7jdc5-rsfnw-jhdwu-n7ne3-4j4mc-7pvb4-bivf6-emr4q-q4svi-oqe"
  );
  //Base64 ID strings
  const RIGHT_DEATH_USERID = "kutIDRN21IH_";

  const userDetails: TestatorDetails = {
    firstNames: ["Claudine", "aulette"], // remove 'P'
    lastName: "Thiebaut",
    sex: "F",
    birthDate: "19350728",
    birthLocationCode: "78018",
  };

  const result = await providers.check_testator_details_with_id(
    testPrincipal,
    RIGHT_DEATH_USERID,
    userDetails
  );
  if (!result.result) {
    return {
      Ok: result.result === false,
    };
  } else {
    return {
      Err: JSON.stringify(result),
    };
  }
}
