import { $query, $update, Opt, Principal, ic, match, nat64 } from "azle";
import { Bitcoin } from "../../services/bitcoin";
import {
  add_identifier_to_mapping,
  isIdentifierUsed,
  remove_identifier_from_mapping,
  wills,
} from "./will";
import {
  BTCClaimWill,
  BTCCreateWill,
  BTCCreateWillArgs,
  BTCDeleteWill,
  Will,
  tokenTickers,
} from "./utils/types";

//---------------------------------------------WILLS RELATED TO BITCOIN CANISTER---------------------------------------------------

export const BITCOIN_CANISTER_ID = Principal.fromText(
  process.env.BITCOIN_CANISTER_ID!
);
const btc = new Bitcoin(BITCOIN_CANISTER_ID);

//--------------------------------------------------Update Methods------------------------------------------------------
// $update;
// export async function bitcoin_get_balance(address: string): Promise<nat64> {
//   const balance = await btc.getBalance(address).call();
//   return match(balance, {
//     Ok: (res) => res,
//     Err: (err) => ic.trap(err),
//   });
// }

//  create a will for btc supported assets
export async function btc_create_will(
  args: BTCCreateWillArgs
): Promise<BTCCreateWill> {
  // check the reentrancy of unique identifier
  if (isIdentifierUsed.containsKey(args.identifier)) {
    return {
      identifierUsed: true,
    };
  }

  //check tokenTicker supported
  if (!tokenTickers.includes(args.tokenTicker) || args.tokenTicker !== "BTC") {
    return {
      tokenTickerNotSupported: `${args.tokenTicker} Not Supported`,
    };
  }

  const willObject: Will = {
    willName: args.willName,
    willDescription: args.willDescription,
    identifier: args.identifier,
    tokenTicker: args.tokenTicker,
    testator: ic.caller(),
    heirs: args.heirs,
    value: args.amountInSats,
    timeStamp: ic.time(),
    isClaimed: false,
  };

  // add the will object to will stable Memory
  wills.insert(args.identifier, willObject);

  // add Will identifier to theirs respective mapping
  add_identifier_to_mapping(ic.caller(), args.heirs, args.identifier);

  // mark Identifier as used
  isIdentifierUsed.insert(args.identifier, true);

  return {
    success: true,
  };
}

export async function btc_delete_will(
  _will: Will,
  btcAddress: string
): Promise<BTCDeleteWill> {
  const will = _will;
  if (will.isClaimed) {
    return {
      isClaimed: true,
    };
  }
  if (!tokenTickers.includes(will.tokenTicker) || will.tokenTicker !== "BTC") {
    return {
      tokenTickerNotSupported: true,
    };
  }

  const bitcoinTransferResult = await btc
    .bitcoin_transfer({
      identifier: will.identifier,
      destinationAddress: btcAddress,
    })
    .call();

  const bitcoinTransfer = match(bitcoinTransferResult, {
    Ok: (res) => res,
    Err: () => null,
  });

  if (!bitcoinTransfer) {
    return {
      retainError: JSON.stringify(bitcoinTransferResult.Err),
    };
  } else {
    return {
      btcRetainResult: match(bitcoinTransfer, {
        unAuthorized: () => {
          return {
            retainBTCError: Opt.Some("Unauthorized Call to BTC Canister"),
            success: false,
            retainBTCMessage: "",
          };
        },
        txid: (txid) => {
          //After 'txId' remove will object inside stable memory
          wills.remove(will.identifier);
          //Also remove identifier Mapping for a testator and a heirs
          remove_identifier_from_mapping(
            will.testator,
            will.heirs,
            will.identifier
          );
          return {
            retainBTCError: Opt.None,
            success: true,
            retainBTCMessage: String(txid),
          };
        },
        inSufficientFunds: () => {
          // remove will object inside stable memory
          wills.remove(will.identifier);
          //Also remove identifier Mapping for a testator and a heirs
          remove_identifier_from_mapping(
            will.testator,
            will.heirs,
            will.identifier
          );
          return {
            retainBTCError: Opt.None,
            success: true,
            retainBTCMessage: "Insufficient Funds",
          };
        },
      }),
    };
  }
}

export async function btc_claim_will(
  _will: Will,
  btcAddress: string
): Promise<BTCClaimWill> {
  const will = _will;
  if (will.isClaimed) {
    return {
      isClaimed: true,
    };
  }
  if (!tokenTickers.includes(will.tokenTicker) || will.tokenTicker !== "BTC") {
    return {
      tokenTickerNotSupported: true,
    };
  }

  const bitcoinTransferResult = await btc
    .bitcoin_transfer({
      identifier: will.identifier,
      destinationAddress: btcAddress,
    })
    .call();

  const bitcoinTransfer = match(bitcoinTransferResult, {
    Ok: (res) => res,
    Err: () => null,
  });

  if (!bitcoinTransfer) {
    return {
      claimError: JSON.stringify(bitcoinTransferResult.Err),
    };
  } else {
    return {
      btcClaimResult: match(bitcoinTransfer, {
        unAuthorized: () => {
          return {
            claimBTCError: Opt.Some("Unauthorized Call to BTC Canister"),
            success: false,
            claimBTCMessage: "",
          };
        },
        txid: (txid) => {
          //After 'txId' remove will object inside stable memory
          wills.remove(will.identifier);
          //Also remove identifier Mapping for a testator and a heirs
          remove_identifier_from_mapping(
            will.testator,
            will.heirs,
            will.identifier
          );
          return {
            claimBTCError: Opt.None,
            success: true,
            claimBTCMessage: String(txid),
          };
        },
        inSufficientFunds: () => {
          // remove will object inside stable memory
          wills.remove(will.identifier);
          //Also remove identifier Mapping for a testator and a heirs
          remove_identifier_from_mapping(
            will.testator,
            will.heirs,
            will.identifier
          );
          return {
            claimBTCError: Opt.None,
            success: true,
            claimBTCMessage: "Insufficient Funds",
          };
        },
      }),
    };
  }
}
