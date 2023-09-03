import {
  CallResult,
  Principal,
  Result,
  Service,
  nat,
  nat32,
  serviceQuery,
  serviceUpdate,
} from "azle";
import { Will } from "../canisters/will/utils/types";
import {
  ICPTRANSFER,
  ICRCCKBTCTRANSFER,
  ICRCICPTRANSFER,
} from "../canisters/icrc/utils/types";

export class ICRCCANISTER extends Service {
  @serviceUpdate
  icrc_icp_transfer: (
    identifier: nat32,
    to: Principal
  ) => CallResult<ICRCICPTRANSFER>;

  @serviceUpdate
  icp_transfer: (identifier: nat32, to: Principal) => CallResult<ICPTRANSFER>;

  @serviceUpdate
  icrc_ckbtc_transfer: (
    identifier: nat32,
    to: Principal,
    amount: nat
  ) => CallResult<ICRCCKBTCTRANSFER>;
}
