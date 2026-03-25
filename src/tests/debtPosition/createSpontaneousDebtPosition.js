import { assert, statusOk } from "../../common/assertions.js";
import {
  createSpontaneousDebtPosition,
  DEBT_POSITION_API_NAMES
} from "../../api/debtPosition.js";
import defaultHandleSummaryBuilder from "../../common/handleSummaryBuilder.js";
import { defaultApiOptionsBuilder } from "../../common/dynamicScenarios/defaultOptions.js";
import { logErrorResult } from "../../common/dynamicScenarios/utils.js";
import { getAuthToken, getRandom, getTestEntity, abort, getAuthFiscalCode } from "../../common/utils.js";
import { CONFIG } from "../../common/envVars.js";
import { getOrganizationsWithSpontaneous } from "../../api/organization.js";
import { getDebtPositionTypeOrgsWithSpontaneous } from "../../api/debtPositionTypeOrg.js";

const application = "debtPosition";
const testName = "createSpontaneousDebtPosition";

// K6 options
export const options = defaultApiOptionsBuilder(
  application,
  testName,
  [DEBT_POSITION_API_NAMES.createSpontaneousDebtPosition]
);

// Summary
export const handleSummary = defaultHandleSummaryBuilder(application, testName);

export function setup() {
  const authToken = getAuthToken();
  const xFiscalCode = getAuthFiscalCode(authToken);
  const brokerId = CONFIG.CONTEXT.BROKER_ID;

  const organizations = getOrganizationsWithSpontaneous(brokerId, authToken).json();

  if (organizations.length === 0) {
    abort("No elements found in organizations list");
  }

  const organizationId = getRandom(organizations.map(item => item.organizationId));

  const debtPositionTypeOrgs = getDebtPositionTypeOrgsWithSpontaneous(
    brokerId,
    organizationId,
    authToken
  ).json();

  if (debtPositionTypeOrgs.length === 0) {
    abort("No elements found in debtPositionTypeOrg list");
  }

  return {
    brokerId,
    token: authToken,
    organizationId,
    debtPositionTypeOrgs: debtPositionTypeOrgs.map(item => item.debtPositionTypeOrgId),
    fiscalCode: xFiscalCode
  };
}

export default (data) => {
  const debtPositionTypeOrgId = getTestEntity(data.debtPositionTypeOrgs);

  const createSpontaneousDebtPositionResult = createSpontaneousDebtPosition(data.brokerId, data.organizationId, debtPositionTypeOrgId, data.fiscalCode, data.token);

  assert(createSpontaneousDebtPositionResult, [statusOk()]);

  if (createSpontaneousDebtPositionResult.status !== 200) {
    logErrorResult(`Unexpected ${testName} status`, createSpontaneousDebtPositionResult, true);
  }
};