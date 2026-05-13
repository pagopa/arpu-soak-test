import { assert, statusOk } from "../../common/assertions.js";
import {
    getPagedDebtorReceipts,
    getReceiptDetail,
    RECEIPT_API_NAMES
} from "../../api/receipt.js";
import defaultHandleSummaryBuilder from "../../common/handleSummaryBuilder.js";
import { defaultApiOptionsBuilder } from "../../common/dynamicScenarios/defaultOptions.js";
import { logErrorResult } from "../../common/dynamicScenarios/utils.js";
import { getAuthToken, getTestEntity, abort, getAuthUserInfo } from "../../common/utils.js";
import { CONFIG } from "../../common/envVars.js";
import { seedsReceipts } from "../../common/receiptUtils.js"

const application = "receipt";
const testName = "getReceiptDetail";

// Dynamic scenarios' K6 configuration
export const options = defaultApiOptionsBuilder(
  application,
  testName,
  [
    RECEIPT_API_NAMES.getReceiptDetail
  ] // applying apiName tags to thresholds
);

// K6 summary configuration
export const handleSummary = defaultHandleSummaryBuilder(application, testName);

export function setup() {
    const authToken = getAuthToken();
    const userInfo = getAuthUserInfo(authToken);
    const brokerId = CONFIG.CONTEXT.BROKER_ID;

   seedsReceipts(brokerId, authToken, userInfo);

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

    const getReceiptDetailResult = getReceiptDetail(data.brokerId, receipt.organizationId, receipt.receiptId, data.token);
    
    assert(getReceiptDetailResult, [statusOk()]);
        
    if (getReceiptDetailResult.status !== 200) {
        logErrorResult(
            `Unexpected ${testName} status`, 
            getReceiptDetailResult, 
            true
        );
    }
};
