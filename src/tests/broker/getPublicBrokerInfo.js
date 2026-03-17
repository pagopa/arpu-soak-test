import { assert, statusOk } from "../../common/assertions.js";
import { BROKER_API_NAMES, getPublicBrokerInfo } from "../../api/broker.js";
import defaultHandleSummaryBuilder from "../../common/handleSummaryBuilder.js";
import { defaultApiOptionsBuilder } from "../../common/dynamicScenarios/defaultOptions.js";
import { logErrorResult } from "../../common/dynamicScenarios/utils.js";
import { CONFIG } from "../../common/envVars.js";

const application = "broker";
const testName = "getPublicBrokerInfo";

// Dynamic scenarios' K6 configuration
export const options = defaultApiOptionsBuilder(
  application,
  testName,
  [
    BROKER_API_NAMES.getPublicBrokerInfo,
  ] // applying apiName tags to thresholds
);

// K6 summary configuration
export const handleSummary = defaultHandleSummaryBuilder(application, testName);

export function setup() {
  return { 
        brokerId: CONFIG.BROKER_ID
    };
}


export default (data) => {
  const getPublicBrokerInfoResult = getPublicBrokerInfo(data.brokerId);

  assert(getPublicBrokerInfoResult, [statusOk()]);

  if (getPublicBrokerInfoResult.status !== 200) {
    logErrorResult(
      `Unexpected getPublicBrokerInfoResult status`,
      getPublicBrokerInfoResult,
      true
    );
    return;
  }
};