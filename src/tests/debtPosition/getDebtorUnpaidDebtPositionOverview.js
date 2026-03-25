import { assert, statusOk } from "../../common/assertions.js";
import {
  getDebtorUnpaidDebtPositionOverview,
  getPagedUnpaidDebtPositions,
  DEBT_POSITION_API_NAMES
} from "../../api/debtPosition.js";
import defaultHandleSummaryBuilder from "../../common/handleSummaryBuilder.js";
import { defaultApiOptionsBuilder } from "../../common/dynamicScenarios/defaultOptions.js";
import { logErrorResult } from "../../common/dynamicScenarios/utils.js";
import { getAuthToken, getTestEntity, abort, getAuthFiscalCode } from "../../common/utils.js";
import { CONFIG } from "../../common/envVars.js";

const application = "debtPosition";
const testName = "getDebtorUnpaidDebtPositionOverview";

// Dynamic scenarios' K6 configuration
export const options = defaultApiOptionsBuilder(
  application,
  testName,
  [
    DEBT_POSITION_API_NAMES.getDebtorUnpaidDebtPositionOverview,
  ] // applying apiName tags to thresholds
);

// K6 summary configuration
export const handleSummary = defaultHandleSummaryBuilder(application, testName);

export function setup() {
  const authToken = getAuthToken();
  const xFiscalCode = getAuthFiscalCode(authToken);
  const brokerId = CONFIG.CONTEXT.BROKER_ID;
  const debtPositions = getPagedUnpaidDebtPositions(brokerId, xFiscalCode, authToken).json().content;

  if(debtPositions.length === 0){
    abort("No elements found in debtPositions list please restart test with at least one element");
  }

  return {
    brokerId: brokerId,
    token: authToken,
    debtPositions: debtPositions,
    fiscalCode: xFiscalCode
  };

}

export default (data) => {
  const debtPosition = getTestEntity(data.debtPositions);
  const getDebtorUnpaidDebtPositionOverviewResult = getDebtorUnpaidDebtPositionOverview(data.brokerId, debtPosition.organizationId, debtPosition.debtPositionId, data.fiscalCode, data.token);

  assert(getDebtorUnpaidDebtPositionOverviewResult, [statusOk()]);

  if (getDebtorUnpaidDebtPositionOverviewResult.status !== 200) {
    logErrorResult(
      `Unexpected getDebtorUnpaidDebtPositionOverview status`,
      getDebtorUnpaidDebtPositionOverviewResult,
      true
    );
    return;
  }
};