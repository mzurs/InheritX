import {
  CallResult,
  Principal,
  Service,
  serviceQuery,
  serviceUpdate,
} from "azle";
import {
  CheckTestatorDetailsWithID,
  TestatorDetails,
} from "../canisters/providers/utils/types";

export class Provider extends Service {
  @serviceUpdate
  check_testator_details_with_id: (
    testatorPrincipal: Principal,
    base64Id: string,
    testatorDetails: TestatorDetails
  ) => CallResult<CheckTestatorDetailsWithID>;

  @serviceQuery
  isTestatorDied: (testatorPrincipal: Principal) => CallResult<boolean>;
}
