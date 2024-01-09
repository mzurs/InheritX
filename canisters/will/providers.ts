import { $update, Principal, match, nat32 } from "azle";
import { Provider } from "../../services/providers";
import { CheckDeathByIdentifier, ReportDeathByBase64Id } from "./utils/types";
import { users, wills } from "./will";

//----------------------------------------------Variables-----------------------------------------------------------

export const providers = new Provider(
  Principal.fromText(process.env.PROVIDERS_CANISTER_ID!)
);

//----------------------------------------------Query Methods-------------------------------------------------------

// this function is used to check whether user already died and data stored in provider canister
$update;
export async function check_death_by_identifier(
  identifier: nat32
): Promise<CheckDeathByIdentifier> {
  //check whether will eixsts for given identifier
  const willExists = wills.containsKey(identifier);

  if (!willExists) {
    return {
      willNotExists: true,
    };
  }

  const willObj = match(wills.get(identifier), {
    Some: (will) => will,
    None: () => null,
  });
  if (!willObj) {
    return {
      willNotExists: true,
    };
  } else {
    const responseResult = await providers
      .isTestatorDied(willObj.testator)
      .call();
    const response = match(responseResult, {
      Ok: (res) => res,
      Err: (err) => null,
    });

    if (response == null) {
      return {
        errorMessageFromCanisterCall: JSON.stringify(responseResult.Err),
      };
    } else {
      return {
        result: response,
      };
    }
  }
}
//----------------------------------------------Update Methods-------------------------------------------------------

// function to process and verify death report by using base64ID provided by MatchID
$update;
export async function report_death_by_base64Id(
  identifier: nat32,
  base64Id: string
): Promise<ReportDeathByBase64Id> {
  //check whether will eixsts for given identifier
  const willExists = wills.containsKey(identifier);

  if (!willExists) {
    return {
      willNotExists: true,
    };
  }
  const willObj = match(wills.get(identifier), {
    Some: (will) => will,
    None: () => null,
  });
  if (!willObj) {
    return {
      willNotExists: true,
    };
  } else {
    const testatorDetailsOpt = users.get(willObj.testator);
    const testatorDetails = match(testatorDetailsOpt, {
      Some: (testator) => testator,
      None: () => null,
    });
    if (!testatorDetails) {
      return {
        testatorDetailsNotFound: JSON.stringify(testatorDetailsOpt.None),
      };
    } else {
      //   const testator: TestatorDetails = testatorDetails;

      const responseResult = await providers
        .check_testator_details_with_id(
          willObj.testator,
          base64Id,
          testatorDetails
        )
        .call();

      const response = match(responseResult, {
        Ok: (res) => res,
        Err: (err) => null,
      });

      if (!response) {
        return {
          errorMessageFromCanisterCall: JSON.stringify(responseResult.Err),
        };
      } else {
        if (response.result) {
          return {
            result: response.result,
          };
        } else {
          return {
            errorMessageFromProviders: JSON.stringify(response.message),
          };
        }
      }
    }
  }
}
