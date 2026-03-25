import { assert, statusOk } from "../../common/assertions.js";
import {
  getDebtPositionDetail,
  getPagedUnpaidDebtPositions,
  DEBT_POSITION_API_NAMES
} from "../../api/debtPosition.js";
import defaultHandleSummaryBuilder from "../../common/handleSummaryBuilder.js";
import { defaultApiOptionsBuilder } from "../../common/dynamicScenarios/defaultOptions.js";
import { logErrorResult } from "../../common/dynamicScenarios/utils.js";
import { getAuthToken, getTestEntity, abort, getAuthFiscalCode } from "../../common/utils.js";
import { CONFIG } from "../../common/envVars.js";

const application = "debtPosition";
const testName = "getDebtPositionDetail";

// Dynamic scenarios' K6 configuration
export const options = defaultApiOptionsBuilder(
  application,
  testName,
  [
    DEBT_POSITION_API_NAMES.getDebtPositionDetail,
  ] // applying apiName tags to thresholds
);

// K6 summary configuration
export const handleSummary = defaultHandleSummaryBuilder(application, testName);

export function setup() {
  const authToken = getAuthToken();
  const xFiscalCode = getAuthFiscalCode();
  const brokerId = CONFIG.CONTEXT.BROKER_ID;
  const debtPositions = getPagedUnpaidDebtPositions(brokerId, xFiscalCode, authToken).json().content;

  if(debtPositions.length === 0){
    abort("No elements found in debtPositions list please restart test with at least one element");
  }

  return {
    brokerId: brokerId,
    token: authToken,
    debtPositions: debtPositions.map(item => item.debtPositionId),
    fiscalCode: xFiscalCode
  };

}

export default (data) => {
  const debtPositionId = getTestEntity(data.debtPositions);
  const getDebtPositionDetailResult = getDebtPositionDetail(data.brokerId, debtPositionId, data.fiscalCode, data.token);

  assert(getDebtPositionDetailResult, [statusOk()]);

  if (getDebtPositionDetailResult.status !== 200) {
    logErrorResult(
      `Unexpected ${testName} status`,
      getDebtPositionDetailResult,
      true
    );
    return;
  }
};