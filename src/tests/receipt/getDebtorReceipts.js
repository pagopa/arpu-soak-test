import { assert, statusOk } from "../../common/assertions.js";
import {
    getDebtorReceipts,
    RECEIPT_API_NAMES
} from "../../api/receipt.js";
import {
    getPagedUnpaidDebtPositions
} from "../../api/debtPosition.js";
import defaultHandleSummaryBuilder from "../../common/handleSummaryBuilder.js";
import { defaultApiOptionsBuilder } from "../../common/dynamicScenarios/defaultOptions.js";
import { logErrorResult } from "../../common/dynamicScenarios/utils.js";
import { getAuthToken, getTestEntity, abort, getAuthFiscalCode } from "../../common/utils.js";
import { CONFIG } from "../../common/envVars.js";

const application = "receipt";
const testName = "getDebtorReceipts";

// Dynamic scenarios' K6 configuration
export const options = defaultApiOptionsBuilder(
  application,
  testName,
  [
    RECEIPT_API_NAMES.getDebtorReceipts
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
        debtPositions,
        token: authToken
    };
}

export default (data) => {
    const debtPosition = getTestEntity(data.debtPositions);
    const paymentOption = getTestEntity(debtPosition.paymentOptions);

    const getDebtorReceiptsResult = getDebtorReceipts(data.brokerId, debtPosition.organizationId, debtPosition.debtPositionId, paymentOption.paymentOptionId, data.token);

    assert(getDebtorReceiptsResult, [statusOk()]);
    
    if (getDebtorReceiptsResult.status !== 200) {
        logErrorResult(
            `Unexpected ${testName} status`, 
            getDebtorReceiptsResult, 
            true
        );
    }
};
