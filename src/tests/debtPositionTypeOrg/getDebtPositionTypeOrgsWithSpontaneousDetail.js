import { assert, statusOk } from "../../common/assertions.js";
import {
  getDebtPositionTypeOrgsWithSpontaneous,
  getDebtPositionTypeOrgsWithSpontaneousDetail,
  DEBT_POSITION_TYPE_ORG_API_NAMES
} from "../../api/debtPositionTypeOrg.js";
import defaultHandleSummaryBuilder from "../../common/handleSummaryBuilder.js";
import { defaultApiOptionsBuilder } from "../../common/dynamicScenarios/defaultOptions.js";
import { logErrorResult } from "../../common/dynamicScenarios/utils.js";
import { getAuthToken, getTestEntity } from "../../common/utils.js";
import { getOrganizationsWithSpontaneous } from "../../api/organization.js";
import { CONFIG } from "../../common/envVars.js";

const application = "debtPositionTypeOrg";
const testName = "getDebtPositionTypeOrgsWithSpontaneousDetail";

// Dynamic scenarios' K6 configuration
export const options = defaultApiOptionsBuilder(
  application,
  testName,
  [
    DEBT_POSITION_TYPE_ORG_API_NAMES.getDebtPositionTypeOrgsWithSpontaneousDetail,
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

  const organizationId = getRandom(organizations.map(item => item.organizationId));
  const debtPositionTypeOrgs = getDebtPositionTypeOrgsWithSpontaneous(brokerId, organizationId, authToken).json();

  if(debtPositionTypeOrgs.length === 0){
    abort("No elements found in debtPositionTypeOrg list please restart test with at least one element");
  }

  return {
    brokerId: brokerId,
    token: authToken,
    organizationId: organizationId,
    debtPositionTypeOrgs: debtPositionTypeOrgs.map(item => item.debtPositionTypeOrgId) 
  };

}


export default (data) => {
  const debtPositionTypeOrgId = getTestEntity(data.debtPositionTypeOrgs);
  const getDebtPositionTypeOrgsWithSpontaneousDetailResult = getDebtPositionTypeOrgsWithSpontaneousDetail(data.brokerId, data.organizationId, debtPositionTypeOrgId, data.token);

  assert(getDebtPositionTypeOrgsWithSpontaneousDetailResult, [statusOk()]);

  if (getDebtPositionTypeOrgsWithSpontaneousDetailResult.status !== 200) {
    logErrorResult(
      `Unexpected getDebtPositionTypeOrgsWithSpontaneousDetailResult status`,
      getDebtPositionTypeOrgsWithSpontaneousDetailResult,
      true
    );
    return;
  }
};

time="2026-03-19T14:50:22Z" level=error msg="GoError: getting scenario information outside of the VU context is not supported\n\tat testEntitiesBasedScenariosBaseIndexRetriever (file:///app/src/common/dynamicScenarios/utils.js:28:49(12))\n\tat getScenarioTestEntityIndex (file:///app/src/common/dynamicScenarios/utils.js:31:65(3))\n\tat getScenarioTestEntity (file:///app/src/common/dynamicScenarios/utils.js:41:49(5))\n\tat getTestEntity (file:///app/src/common/utils.js:38:31(4))\n\tat setup (file:///app/src/tests/debtPositionTypeOrg/getDebtPositionTypeOrgsWithSpontaneousDetail.js:39:39(34))\n" hint="script exception"
