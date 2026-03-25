import { assert, statusOk } from "../../common/assertions.js";
import {
    getPublicInstallmentsByIuvOrNav,
  INSTALLMENT_API_NAMES
} from "../../api/installment.js";
import {
  getDebtorUnpaidDebtPositionOverview,
  getPagedUnpaidDebtPositions
} from "../../api/debtPosition.js";
import defaultHandleSummaryBuilder from "../../common/handleSummaryBuilder.js";
import { defaultApiOptionsBuilder } from "../../common/dynamicScenarios/defaultOptions.js";
import { logErrorResult } from "../../common/dynamicScenarios/utils.js";
import { getAuthToken, getRandom, getTestEntity, abort, getAuthFiscalCode, coalesce } from "../../common/utils.js";
import { CONFIG } from "../../common/envVars.js";

const application = "installment";
const testName = "getPublicInstallmentsByIuvOrNav";

// Dynamic scenarios' K6 configuration
export const options = defaultApiOptionsBuilder(
  application,
  testName,
  [
    INSTALLMENT_API_NAMES.getPublicInstallmentsByIuvOrNav
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

   const debtPosition = getRandom(debtPositions);

   const overview = getDebtorUnpaidDebtPositionOverview(brokerId, debtPosition.organizationId, debtPosition.debtPositionId, xFiscalCode, authToken).json();

   const paymentOptions = overview.paymentOptions;

  if (paymentOptions.length === 0) {
    abort("No paymentOptions found");
  }

  return {
    brokerId,
    paymentOptions: overview.paymentOptions
  };
}

export default (data) => {
  const paymentOption = getTestEntity(data.paymentOptions);

  if (paymentOption.installments.length === 0) {
    logErrorResult("No installments found", paymentOption, true);
    return;
  }

  const installment = getTestEntity(paymentOption.installments);

  const iuvOrNav = coalesce(installment.nav, installment.iuv)

  if (iuvOrNav) {
    logErrorResult("Missing navOrIuv in installment", installment, true);
    return;
  }

  const getPublicInstallmentsByIuvOrNavResult = getPublicInstallmentsByIuvOrNav(data.brokerId, iuvOrNav);

  assert(getPublicInstallmentsByIuvOrNavResult, [statusOk()]);

  if (getPublicInstallmentsByIuvOrNavResult.status !== 200) {
    logErrorResult(
        `Unexpected ${testName} status`, 
        getPublicInstallmentsByIuvOrNavResult, 
        true
    );
  }
};