import { CallResult, Principal, Result, Service, nat32, serviceQuery } from "azle";
import { Will } from "../canisters/will/utils/types";
import { ICRCICPTRANSFER } from "../canisters/icrc/utils/types";

export class ICRCCANISTER extends Service {
  @serviceQuery
  icrc_icp_transfer: (
    identifier: nat32,
    to: Principal
  ) => CallResult<ICRCICPTRANSFER>;
}
