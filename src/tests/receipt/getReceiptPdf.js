import { assert, statusOk } from "../../common/assertions.js";
import {
    getPagedDebtorReceipts,
    getReceiptPdf,
    RECEIPT_API_NAMES
} from "../../api/receipt.js";
import defaultHandleSummaryBuilder from "../../common/handleSummaryBuilder.js";
import { defaultApiOptionsBuilder } from "../../common/dynamicScenarios/defaultOptions.js";
import { logErrorResult } from "../../common/dynamicScenarios/utils.js";
import { getAuthToken, getTestEntity, abort } from "../../common/utils.js";
import { CONFIG } from "../../common/envVars.js";

const application = "receipt";
const testName = "getReceiptPdf";

// Dynamic scenarios' K6 configuration
export const options = defaultApiOptionsBuilder(
  application,
  testName,
  [
    RECEIPT_API_NAMES.getReceiptPdf
  ] // applying apiName tags to thresholds
);

// K6 summary configuration
export const handleSummary = defaultHandleSummaryBuilder(application, testName);

export function setup() {
    const authToken = getAuthToken();
    const brokerId = CONFIG.CONTEXT.BROKER_ID;
    
    const receipts = getPagedDebtorReceipts(brokerId, authToken).json().content;
    
    if (receipts.length === 0) {
        abort("No elements found in receipts list please restart test with at least one element");
    }

    return {
        brokerId,
        receipts,
        token: authToken
    };
}

export default (data) => {
    const receipt = getTestEntity(data.receipts);

    const getReceiptPdfResult = getReceiptPdf(data.brokerId, receipt.organizationId, receipt.receiptId, data.token);
    
    assert(getReceiptPdfResult, [statusOk()]);
        
    if (getReceiptPdfResult.status !== 200) {
        logErrorResult(
            `Unexpected ${testName} status`, 
            getReceiptPdfResult, 
            true
        );
    }
};
