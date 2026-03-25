import { assert, statusOk } from "../../common/assertions.js";
import {
  getDebtorUnpaidDebtPositionInstallments,
  INSTALLMENT_API_NAMES
} from "../../api/installment.js";
import {
  getPagedUnpaidDebtPositions
} from "../../api/debtPosition.js";
import defaultHandleSummaryBuilder from "../../common/handleSummaryBuilder.js";
import { defaultApiOptionsBuilder } from "../../common/dynamicScenarios/defaultOptions.js";
import { logErrorResult } from "../../common/dynamicScenarios/utils.js";
import { getAuthToken, getTestEntity, abort, getAuthFiscalCode } from "../../common/utils.js";
import { CONFIG } from "../../common/envVars.js";

const application = "installment";
const testName = "getDebtorUnpaidDebtPositionInstallments";

// Dynamic scenarios' K6 configuration
export const options = defaultApiOptionsBuilder(
  application,
  testName,
  [
    INSTALLMENT_API_NAMES.getDebtorUnpaidDebtPositionInstallments
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

  return {
    brokerId,
    debtPositions: debtPositions
  };
}

export default (data) => {
  const debtPosition = getTestEntity(data.debtPositions);

  const getDebtorUnpaidDebtPositionInstallmentsResult = getDebtorUnpaidDebtPositionInstallments(data.brokerId, debtPosition.debtPositionId, debtPosition.paymentOptionId, debtPosition.organizationId);

  assert(getDebtorUnpaidDebtPositionInstallmentsResult, [statusOk()]);

  if (getDebtorUnpaidDebtPositionInstallmentsResult.status !== 200) {
    logErrorResult(
        `Unexpected ${testName} status`, 
        getDebtorUnpaidDebtPositionInstallmentsResult, 
        true
    );
  }
};