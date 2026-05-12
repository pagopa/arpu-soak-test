import { assert, statusOk } from "../../common/assertions.js";
import {
    getPagedDebtorReceipts,
    RECEIPT_API_NAMES
} from "../../api/receipt.js";
import defaultHandleSummaryBuilder from "../../common/handleSummaryBuilder.js";
import { defaultApiOptionsBuilder } from "../../common/dynamicScenarios/defaultOptions.js";
import { logErrorResult } from "../../common/dynamicScenarios/utils.js";
import { getAuthToken } from "../../common/utils.js";
import { CONFIG } from "../../common/envVars.js";

const application = "receipt";
const testName = "getPagedDebtorReceipts";

// Dynamic scenarios' K6 configuration
export const options = defaultApiOptionsBuilder(
  application,
  testName,
  [
    RECEIPT_API_NAMES.getPagedDebtorReceipts
  ] // applying apiName tags to thresholds
);

// K6 summary configuration
export const handleSummary = defaultHandleSummaryBuilder(application, testName);

export function setup() {
   const authToken = getAuthToken();
   const brokerId = CONFIG.CONTEXT.BROKER_ID;

  return {
    brokerId,
    token: authToken
  };
}

export default (data) => {
  const getPagedDebtorReceiptsResult = getPagedDebtorReceipts(data.brokerId, data.token);

  assert(getPagedDebtorReceiptsResult, [statusOk()]);

  if (getPagedDebtorReceiptsResult.status !== 200) {
    logErrorResult(
        `Unexpected ${testName} status`, 
        getPagedDebtorReceiptsResult, 
        true
    );
  }
};
