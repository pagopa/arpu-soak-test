import { assert, statusOk } from "../../common/assertions.js";
import {
  getPaymentNotice,
  getDebtorUnpaidDebtPositionOverview,
  getPagedUnpaidDebtPositions,
  DEBT_POSITION_API_NAMES,
} from "../../api/debtPosition.js";
import defaultHandleSummaryBuilder from "../../common/handleSummaryBuilder.js";
import { defaultApiOptionsBuilder } from "../../common/dynamicScenarios/defaultOptions.js";
import { logErrorResult } from "../../common/dynamicScenarios/utils.js";
import { getAuthToken, getRandom, getTestEntity, abort, getAuthFiscalCode } from "../../common/utils.js";
import { CONFIG } from "../../common/envVars.js";

const application = "debtPosition";
const testName = "getPaymentNotice";

// Dynamic scenarios' K6 configuration
export const options = defaultApiOptionsBuilder(
  application,
  testName,
  [
    DEBT_POSITION_API_NAMES.getPaymentNotice,
  ] // applying apiName tags to thresholds
);

// K6 summary configuration
export const handleSummary = defaultHandleSummaryBuilder(application, testName);

export function setup() {
  const authToken = getAuthToken();
  const xFiscalCode = getAuthFiscalCode(authToken);
  const brokerId = CONFIG.CONTEXT.BROKER_ID;

  const debtPositions = getPagedUnpaidDebtPositions(brokerId, xFiscalCode, authToken).json().content;

  if (debtPositions.length === 0) {
    abort("No elements found in debtPositions list please restart test with at least one element");
  }

  const organizationId = getRandom(debtPositions.content.map(item => item.organizationId));

  const overview = getDebtorUnpaidDebtPositionOverview(brokerId, organizationId, xFiscalCode, authToken).json();

  if (overview.paymentOptions.length === 0) {
    abort("No paymentOptions found");
  }

  return {
    brokerId,
    organizationId,
    paymentOptions: overview.paymentOptions,
    token: authToken,
    fiscalCode: xFiscalCode
  };
}

export default (data) => {
  const paymentOption = getTestEntity(data.paymentOptions);

  if (paymentOption.installments.length === 0) {
    logErrorResult("No installments found", paymentOption, true);
    return;
  }

  const installment = getTestEntity(paymentOption.installments);

  if (installment.nav == null) {
    logErrorResult("Missing nav in installment", installment, true);
    return;
  }

  const getPaymentNoticeResult = getPaymentNotice(data.brokerId, data.organizationId, installment.nav, data.fiscalCode, data.token);

  assert(getPaymentNoticeResult, [statusOk()]);

  if (getPaymentNoticeResult.status !== 200) {
    logErrorResult(
        `Unexpected ${testName} status`, 
        getPaymentNoticeResult, 
        true
    );
  }
};