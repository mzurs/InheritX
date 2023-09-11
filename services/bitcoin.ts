import { CallResult, Service, nat64, serviceQuery, serviceUpdate } from "azle";

export class Bitcoin extends Service {
  @serviceUpdate
  getBalance: (address: string) => CallResult<nat64>;
}
