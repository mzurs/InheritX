import {
  CallResult,
  Principal,
  Result,
  Service,
  nat32,
  serviceQuery,
  serviceUpdate,
} from "azle";
import { Will } from "../canisters/will/utils/types";
import { ICPTRANSFER, ICRCICPTRANSFER } from "../canisters/icrc/utils/types";

export class ICRCCANISTER extends Service {
  @serviceUpdate
  icrc_icp_transfer: (
    identifier: nat32,
    to: Principal
  ) => CallResult<ICRCICPTRANSFER>;

  @serviceUpdate
  icp_transfer: (identifier: nat32, to: Principal) => CallResult<ICPTRANSFER>;
}
