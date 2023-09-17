import { ActorSubclass } from "@dfinity/agent";
import { _SERVICE } from "../../../dfx_generated/providers/providers.did";
import { Test } from "azle/test";
import {
  check_testator_death_with_wrong_principal,
  check_testator_details_with_correct_id,
  check_testator_details_with_wrong_details,
  check_testator_details_with_wrong_id,
} from "./functions/providers";

export function get_providers_tests(
  providers: ActorSubclass<_SERVICE>
): Test[] {
  return [
    {
      name: "Check whether Testator Died with Wrong Principal => ",
      test: async () => {
        return check_testator_death_with_wrong_principal(providers);
      },
    },
    {
      name: "Check Death API with Correct Id",
      test: async () => {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        return await check_testator_details_with_correct_id(providers);
      },
    },
    {
      name: "Check Death API with Wrong Id",
      test: async () => {
        await new Promise((resolve) => setTimeout(resolve, 5000));

        return await check_testator_details_with_wrong_id(providers);
      },
    },
    {
      name: "Check Death API with Wrong Details",
      test: async () => {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        return await check_testator_details_with_wrong_details(providers);
      },
    },
  ];
}
