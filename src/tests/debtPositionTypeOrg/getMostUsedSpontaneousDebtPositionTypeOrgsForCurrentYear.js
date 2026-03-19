import { assert, statusOk } from "../../common/assertions.js";
import {
  getMostUsedSpontaneousDebtPositionTypeOrgsForCurrentYear,
  DEBT_POSITION_TYPE_ORG_API_NAMES
} from "../../api/debtPositionTypeOrg.js";
import defaultHandleSummaryBuilder from "../../common/handleSummaryBuilder.js";
import { defaultApiOptionsBuilder } from "../../common/dynamicScenarios/defaultOptions.js";
import { logErrorResult } from "../../common/dynamicScenarios/utils.js";
import { getAuthToken } from "../../common/utils.js";
import { getOrganizationsWithSpontaneous } from "../../api/organization.js";
import { CONFIG } from "../../common/envVars.js";

const application = "debtPositionTypeOrg";
const testName = "getMostUsedSpontaneousDebtPositionTypeOrgsForCurrentYear";

// Dynamic scenarios' K6 configuration
export const options = defaultApiOptionsBuilder(
  application,
  testName,
  [
    DEBT_POSITION_TYPE_ORG_API_NAMES.getMostUsedSpontaneousDebtPositionTypeOrgsForCurrentYear,
  ] // applying apiName tags to thresholds
);

// K6 summary configuration
export const handleSummary = defaultHandleSummaryBuilder(application, testName);

export function setup() {
  const authToken = getAuthToken();
  const brokerId = CONFIG.CONTEXT.BROKER_ID;
  const organizations = getOrganizationsWithSpontaneous(brokerId, authToken).json();

  if(organizations.length === 0){
    abort("No elements found in organizations list please restart test with at least one element");
  }

  return {
    brokerId: brokerId,
    token: authToken,
    organizations: organizations.map(item => item.organizationId)
  };

}


export default (data) => {
  const organizationId = getTestEntity(data.organizations);
  const getMostUsedSpontaneousDebtPositionTypeOrgsForCurrentYearResult = getMostUsedSpontaneousDebtPositionTypeOrgsForCurrentYear(data.brokerId, organizationId, data.token);

  assert(getMostUsedSpontaneousDebtPositionTypeOrgsForCurrentYearResult, [statusOk()]);

  if (getMostUsedSpontaneousDebtPositionTypeOrgsForCurrentYearResult.status !== 200) {
    logErrorResult(
      `Unexpected getMostUsedSpontaneousDebtPositionTypeOrgsForCurrentYearResult status`,
      getMostUsedSpontaneousDebtPositionTypeOrgsForCurrentYearResult,
      true
    );
    return;
  }
};