import { ic, nat32, Opt, match, Principal } from "azle";
import {
  ICRCCreateWillArgs,
  ICRCs,
  Will,
  ICRCCreateWill,
  ICRCClaimWill,
  ICRCDeleteWill,
} from "./utils/types";
import {
  add_identifier_to_mapping,
  isIdentifierUsed,
  remove_identifier_from_mapping,
  wills,
} from "./will";
import { ICRCCANISTER } from "../../services/icrc";

//---------------------------------------------WILLS RELATED TO ICRCs---------------------------------------------------

export const icrc = new ICRCCANISTER(
  Principal.fromText(process.env.ICRC_CANISTER_ID!)
);
//--------------------------------------------------Query Methods-------------------------------------------------------

//--------------------------------------------------Update Methods------------------------------------------------------

//  create a will for ICRC supported assets

export async function icrc_create_will(
  args: ICRCCreateWillArgs
): Promise<ICRCCreateWill> {
  // check the reentrancy of unique identifier
  if (isIdentifierUsed.containsKey(args.identifier)) {
    return {
      identifierUsed: true,
    };
  }

  //check tokenTicker supported
  if (!ICRCs.includes(args.tokenTicker)) {
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
    value: args.amount,
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

//  delete a will
export async function icrc_delete_will(_will: Will): Promise<ICRCDeleteWill> {
  const will = _will;
  if (will.isClaimed) {
    return {
      isClaimed: true,
    };
  }
  if (!ICRCs.includes(will.tokenTicker)) {
    return {
      tokenTickerNotSupported: true,
    };
  }

  // switch to specific token
  switch (will.tokenTicker) {
    //claim process for CKBTC
    case "ckBTC":
      const retainCKBTCResult = await icrc
        .icrc_ckbtc_transfer(will.identifier, will.testator, will.value)
        .call();
      const retainCKBTC = match(retainCKBTCResult, {
        Ok: (claim) => claim,
        Err: () => null,
      });
      if (!retainCKBTC) {
        return {
          retainError: String(retainCKBTCResult.Err!),
        };
      } else {
        return {
          ckbtcRetainResult: match(retainCKBTC, {
            Ok: (ok) => {
              //After 'Ok' remove will object inside stable memory
              wills.remove(will.identifier);
              //Also remove identifier Mapping for a testator and a heirs
              remove_identifier_from_mapping(
                will.testator,
                will.heirs,
                will.identifier
              );
              return {
                retainCKBTCMessage: `Successfully claim ckBTC => ${ok}`,
                success: true,
              };
            },
            Err: (err) => {
              return {
                retainCKBTCMessage: match(err, {
                  BadBurn: (badBurn) =>
                    String(`Bad Burn: ${badBurn.min_burn_amount}`),
                  BadFee: (badFee) => String(`Bad Fee: ${badFee.expected_fee}`),
                  InsufficientFunds: (insufficientFunds) =>
                    String(
                      `Inssufficient Balance: ${insufficientFunds.balance}`
                    ),
                  TooOld: (tooOld) => String(`TooOld: ${tooOld}`),
                  CreatedInFuture: (createInFuture) =>
                    String(`Created In Future: ${createInFuture.ledger_time}`),
                  Duplicate: (duplicate) =>
                    String(`Duplicate: ${duplicate.duplicate_of}`),
                  TemporarilyUnavailable: (temporarilyUnavailable) =>
                    String(`Temporary Unavilable: ${temporarilyUnavailable}`),
                  GenericError: (genericError) =>
                    String(`Generic Error: ${genericError}`),
                }),
                success: false,
              };
            },
            unAuthorized: (unauthorized) => {
              return {
                retainCKBTCMessage: String(
                  `Unauthorized Access to Will Canister => ${unauthorized}`
                ),
                success: false,
              };
            },
            message: (message) => {
              return {
                retainCKBTCMessage: message,
                success: false,
              };
            },
          }),
        };
      }

    //claim process for ICP
    case "ICP":
      const retainICPResult = await icrc
        .icp_transfer(will.identifier, will.testator)
        .call();

      const retainICP = match(retainICPResult, {
        Ok: (retainICP) => retainICP,
        Err: () => null,
      });
      if (!retainICP) {
        return {
          retainError: String(retainICPResult.Err!),
        };
      } else {
        return {
          icpRetainResult: match(retainICP, {
            Ok: (ok) => {
              //After 'Ok' remove will object inside stable memory
              wills.remove(will.identifier);
              //Also remove identifier Mapping for a testator and a heirs
              remove_identifier_from_mapping(
                will.testator,
                will.heirs,
                will.identifier
              );
              return {
                retainICPMessage: `Successfully claim ICP =>${ok}`,
                success: true,
              };
            },
            Err: (err) => {
              return {
                retainICPMessage: String(err),
                success: false,
              };
            },
            unAuthorized: (unauthorized) => {
              return {
                retainICPMessage: String(
                  `Unauthorized Access to Will Canister => ${unauthorized}`
                ),
                success: false,
              };
            },
            message: (message) => {
              return {
                retainICPMessage: message,
                success: false,
              };
            },
          }),
        };
      }
    default:
      return {
        tokenTickerNotSupported: true,
      };
  }
}
//----------------------ICRC Claim function------------------------------------
export async function icrc_claim_will(_will: Will): Promise<ICRCClaimWill> {
  const will = _will;
  if (will.isClaimed) {
    return {
      isClaimed: true,
    };
  }
  if (!ICRCs.includes(will.tokenTicker)) {
    return {
      tokenTickerNotSupported: true,
    };
  }

  // switch to specific token
  switch (will.tokenTicker) {
    //claim process for CKBTC
    case "ckBTC":
      const claimCKBTCResult = await icrc
        .icrc_ckbtc_transfer(will.identifier, will.heirs, will.value)
        .call();
      const claimCKBTC = match(claimCKBTCResult, {
        Ok: (claim) => claim,
        Err: () => null,
      });
      if (!claimCKBTC) {
        return {
          claimError: String(claimCKBTCResult.Err!),
        };
      } else {
        return {
          ckbtcClaimResult: match(claimCKBTC, {
            Ok: (ok) => {
              //After 'Ok' remove will object inside stable memory
              wills.remove(will.identifier);
              //Also remove identifier Mapping for a testator and a heirs
              remove_identifier_from_mapping(
                will.testator,
                will.heirs,
                will.identifier
              );
              return {
                claimCKBTCMessage: `Successfully claim ckBTC => ${ok}`,
                success: true,
              };
            },
            Err: (err) => {
              return {
                claimCKBTCMessage: match(err, {
                  BadBurn: (badBurn) =>
                    String(`Bad Burn: ${badBurn.min_burn_amount}`),
                  BadFee: (badFee) => String(`Bad Fee: ${badFee.expected_fee}`),
                  InsufficientFunds: (insufficientFunds) =>
                    String(
                      `Inssufficient Balance: ${insufficientFunds.balance}`
                    ),
                  TooOld: (tooOld) => String(`TooOld: ${tooOld}`),
                  CreatedInFuture: (createInFuture) =>
                    String(`Created In Future: ${createInFuture.ledger_time}`),
                  Duplicate: (duplicate) =>
                    String(`Duplicate: ${duplicate.duplicate_of}`),
                  TemporarilyUnavailable: (temporarilyUnavailable) =>
                    String(`Temporary Unavilable: ${temporarilyUnavailable}`),
                  GenericError: (genericError) =>
                    String(`Generic Error: ${genericError}`),
                }),
                success: false,
              };
            },
            unAuthorized: (unauthorized) => {
              return {
                claimCKBTCMessage: String(
                  `Unauthorized Access to Will Canister => ${unauthorized}`
                ),
                success: false,
              };
            },
            message: (message) => {
              return {
                claimCKBTCMessage: message,
                success: false,
              };
            },
          }),
        };
      }

    //claim process for ICP
    case "ICP":
      const claimICPResult = await icrc
        .icp_transfer(will.identifier, will.heirs)
        .call();

      const claimICP = match(claimICPResult, {
        Ok: (claimICP) => claimICP,
        Err: () => null,
      });
      if (!claimICP) {
        return {
          claimError: String(claimICPResult.Err!),
        };
      } else {
        return {
          icpClaimResult: match(claimICP, {
            Ok: (ok) => {
              //After 'Ok' remove will object inside stable memory
              wills.remove(will.identifier);
              //Also remove identifier Mapping for a testator and a heirs
              remove_identifier_from_mapping(
                will.testator,
                will.heirs,
                will.identifier
              );
              return {
                claimICPMessage: `Successfully claim ICP =>${ok}`,
                success: true,
              };
            },
            Err: (err) => {
              return {
                claimICPMessage: String(err),
                success: false,
              };
            },
            unAuthorized: (unauthorized) => {
              return {
                claimICPMessage: String(
                  `Unauthorized Access to Will Canister => ${unauthorized}`
                ),
                success: false,
              };
            },
            message: (message) => {
              return {
                claimICPMessage: message,
                success: false,
              };
            },
          }),
        };
      }
    default:
      return {
        tokenTickerNotSupported: true,
      };
  }
}
