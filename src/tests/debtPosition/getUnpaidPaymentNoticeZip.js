import { assert, statusOk } from "../../common/assertions.js";
import {
  getUnpaidPaymentNoticeZip,
  getPagedUnpaidDebtPositions,
  DEBT_POSITION_API_NAMES
} from "../../api/debtPosition.js";
import defaultHandleSummaryBuilder from "../../common/handleSummaryBuilder.js";
import { defaultApiOptionsBuilder } from "../../common/dynamicScenarios/defaultOptions.js";
import { logErrorResult } from "../../common/dynamicScenarios/utils.js";
import { getAuthToken, abort, getAuthFiscalCode } from "../../common/utils.js";
import { CONFIG } from "../../common/envVars.js";

const application = "debtPosition";
const testName = "getUnpaidPaymentNoticeZip";

// Dynamic scenarios' K6 configuration
export const options = defaultApiOptionsBuilder(
  application,
  testName,
  [
    DEBT_POSITION_API_NAMES.getUnpaidPaymentNoticeZip,
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
    debtPositions: debtPositions.map(item => item.organizationId),
    fiscalCode: xFiscalCode
  };

}

export default (data) => {
  const organizationId = getTestEntity(data.debtPositions);
  const getUnpaidPaymentNoticeZipResult = getUnpaidPaymentNoticeZip(data.brokerId, organizationId, data.fiscalCode, data.token);

  assert(getUnpaidPaymentNoticeZipResult, [statusOk()]);

  if (getUnpaidPaymentNoticeZipResult.status !== 200) {
    logErrorResult(
      `Unexpected ${testName} status`,
      getUnpaidPaymentNoticeZipResult,
      true
    );
    return;
  }
};