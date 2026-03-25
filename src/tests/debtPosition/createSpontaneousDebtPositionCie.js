import { assert, statusOk } from "../../common/assertions.js";
import {
  createSpontaneousDebtPositionCie,
  DEBT_POSITION_API_NAMES
} from "../../api/debtPosition.js";
import defaultHandleSummaryBuilder from "../../common/handleSummaryBuilder.js";
import { defaultApiOptionsBuilder } from "../../common/dynamicScenarios/defaultOptions.js";
import { logErrorResult } from "../../common/dynamicScenarios/utils.js";
import { getAuthToken, getAuthFiscalCode } from "../../common/utils.js";
import { CONFIG } from "../../common/envVars.js";


const application = "debtPosition";
const testName = "createSpontaneousDebtPositionCie";

// K6 options
export const options = defaultApiOptionsBuilder(
  application,
  testName,
  [DEBT_POSITION_API_NAMES.createSpontaneousDebtPosition]
);

// Summary
export const handleSummary = defaultHandleSummaryBuilder(application, testName);

export function setup() {
  const authToken = getAuthToken();
  const xFiscalCode = getAuthFiscalCode(authToken);
  const brokerId = CONFIG.CONTEXT.BROKER_ID;

  return {
      brokerId,
      token: authToken,
      fiscalCode: xFiscalCode
  };
}

export default (data) => {
  const createSpontaneousDebtPositionCieResult = createSpontaneousDebtPositionCie(data.brokerId, data.fiscalCode, data.token);

  assert(createSpontaneousDebtPositionCieResult, [statusOk()]);

  if (createSpontaneousDebtPositionCieResult.status !== 200) {
    logErrorcreateSpontaneousDebtPositionCieResultult(`Unexpected ${testName} status`, createSpontaneousDebtPositionCieResult, true);
  }
};