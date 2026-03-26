import { assert, statusOk } from "../../common/assertions.js";
import {
  createSpontaneousDebtPositionCie,
  DEBT_POSITION_API_NAMES
} from "../../api/debtPosition.js";
import defaultHandleSummaryBuilder from "../../common/handleSummaryBuilder.js";
import { defaultApiOptionsBuilder } from "../../common/dynamicScenarios/defaultOptions.js";
import { logErrorResult } from "../../common/dynamicScenarios/utils.js";
import { getAuthToken, getAuthFiscalCode, getTestEntity } from "../../common/utils.js";
import { CONFIG } from "../../common/envVars.js";
import { getDebtPositionTypeOrgsWithSpontaneous } from "../../api/debtPositionTypeOrg.js";


const application = "debtPosition";
const testName = "createSpontaneousDebtPositionCie";

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

  const debtPositionTypeOrgs = getDebtPositionTypeOrgsWithSpontaneous(
      brokerId,
      CONFIG.CONTEXT.ORGANIZATION_ID_CIE,
      authToken
    ).json();
  
  if (debtPositionTypeOrgs.length === 0) {
    abort("No elements found in debtPositionTypeOrg list");
  }

  return {
      brokerId,
      token: authToken,
      fiscalCode: xFiscalCode,
      debtPositionTypeOrgs: debtPositionTypeOrgs.map(item => item.debtPositionTypeOrgId)
  };
}

export default (data) => {
  const debtPositionTypeOrgId = getTestEntity(data.debtPositionTypeOrgs);
  const createSpontaneousDebtPositionCieResult = createSpontaneousDebtPositionCie(data.brokerId, data.fiscalCode, debtPositionTypeOrgId, data.token);

  assert(createSpontaneousDebtPositionCieResult, [statusOk()]);

  if (createSpontaneousDebtPositionCieResult.status !== 200) {
    logErrorResult(`Unexpected ${testName} status`, createSpontaneousDebtPositionCieResult, true);
  }
};