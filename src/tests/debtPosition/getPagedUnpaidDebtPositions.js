import { assert, statusOk } from "../../common/assertions.js";
import {
  getPagedUnpaidDebtPositions,
  DEBT_POSITION_API_NAMES
} from "../../api/debtPosition.js";
import defaultHandleSummaryBuilder from "../../common/handleSummaryBuilder.js";
import { defaultApiOptionsBuilder } from "../../common/dynamicScenarios/defaultOptions.js";
import { logErrorResult } from "../../common/dynamicScenarios/utils.js";
import { getAuthToken, getAuthFiscalCode } from "../../common/utils.js";
import { CONFIG } from "../../common/envVars.js";

const application = "debtPosition";
const testName = "getPagedUnpaidDebtPositions";

// Dynamic scenarios' K6 configuration
export const options = defaultApiOptionsBuilder(
  application,
  testName,
  [
    DEBT_POSITION_API_NAMES.getPagedUnpaidDebtPositions,
  ] // applying apiName tags to thresholds
);

// K6 summary configuration
export const handleSummary = defaultHandleSummaryBuilder(application, testName);

export function setup() {
  const authToken = getAuthToken();
  const xFiscalCode = getAuthFiscalCode(authToken);
  const brokerId = CONFIG.CONTEXT.BROKER_ID;

  return {
    brokerId: brokerId,
    fiscalCode: xFiscalCode,
    token: authToken
  };

}


export default (data) => {
  const getPagedUnpaidDebtPositionsResult = getPagedUnpaidDebtPositions(data.brokerId, data.fiscalCode, data.token);

  assert(getPagedUnpaidDebtPositionsResult, [statusOk()]);

  if (getPagedUnpaidDebtPositionsResult.status !== 200) {
    logErrorResult(
      `Unexpected ${testName} status`,
      getPagedUnpaidDebtPositionsResult,
      true
    );
    return;
  }
};