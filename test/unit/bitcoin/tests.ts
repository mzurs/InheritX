import { Identity } from "@dfinity/agent";
import { Test } from "azle/test";
import { randomIdentifier } from "../../utils/utils";
import {
  bitcoinBalanceOfTwoAddresses,
  getBalanceByIdentifier,
  restrictTransfer,
  transferToIdentifier,
  verifyBalance,
} from "./functions";
import { getP2PKHAddress, mineToAddress } from "./functions/utils";

export async function get_bitcoin_Canister_tests(
  userAIdentity: Identity,
  userBIdentity: Identity
): Promise<Test[]> {
  const identifier1 = randomIdentifier();
  const identifier2 = randomIdentifier();

  return [
    {
      name: `Balance of ${identifier1} & ${identifier2} should be 0`,
      test: async () => {
        return await bitcoinBalanceOfTwoAddresses(identifier1, identifier2);
      },
    },
    {
      name: `Restrict Transfer Invoke from Unknown Principal `,
      test: async () => {
        return await restrictTransfer(userBIdentity);
      },
    },
    {
      name: `Balance Should Be 50 BTC after 1 block mined to Identifier: ${identifier1}`,
      test: async () => {
        await mineToAddress(1, await getP2PKHAddress(identifier1));
        await new Promise((resolve) => setTimeout(resolve, 15000));

        return await verifyBalance(identifier1, 50);
      },
    },
    {
      name: `Transfer 50 BTC to Identifier ${identifier2}`,
      test: async () => {
        return await transferToIdentifier(
          userAIdentity,
          identifier1,
          identifier2
        );
      },
    },
    {
      name: `Balance of Identifier ${identifier1} after transfer should be zero`,
      test: async () => {
        return await verifyBalance(identifier1, 0);
      },
    },
    {
      name: `Balance of Identifer ${identifier2} after transfer must be greater than 49`,
      test: async () => {
        return { Ok: (await getBalanceByIdentifier(identifier2)) >= 49 };
      },
    },
  ];
}
