import { assert, statusOk } from "../../common/assertions.js";
import defaultHandleSummaryBuilder from "../../common/handleSummaryBuilder.js";
import { defaultApiOptionsBuilder } from "../../common/dynamicScenarios/defaultOptions.js";
import { logErrorResult } from "../../common/dynamicScenarios/utils.js";
import { getAuthToken } from "../../common/utils.js";
import { getOrganizationsWithSpontaneous,
    ORGANIZATION_API_NAMES 
} from "../../api/organization.js";
import { CONFIG } from "../../common/envVars.js";

const application = "organization";
const testName = "getOrganizationsWithSpontaneous";

// Dynamic scenarios' K6 configuration
export const options = defaultApiOptionsBuilder(
  application,
  testName,
  [
    ORGANIZATION_API_NAMES.getOrganizationsWithSpontaneous,
  ] // applying apiName tags to thresholds
);

// K6 summary configuration
export const handleSummary = defaultHandleSummaryBuilder(application, testName);

export function setup() {
  return { 
      brokerId: CONFIG.CONTEXT.BROKER_ID, 
      token: getAuthToken()
    };
}


export default (data) => {
  const getOrganizationsWithSpontaneousResult = getOrganizationsWithSpontaneous(data.brokerId, data.token);

  assert(getOrganizationsWithSpontaneousResult, [statusOk()]);

  if (getOrganizationsWithSpontaneousResult.status !== 200) {
    logErrorResult(
      `Unexpected getOrganizationsWithSpontaneousResult status`,
      getOrganizationsWithSpontaneousResult,
      true
    );
    return;
  }
};