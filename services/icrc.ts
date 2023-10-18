import { CallResult, Principal, Service, nat32, serviceUpdate } from "azle";
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
    to: Principal
  ) => CallResult<ICRCCKBTCTRANSFER>;
}
