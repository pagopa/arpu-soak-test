import http from "k6/http";
import { logResult } from "../common/dynamicScenarios/utils.js";
import { getBaseUrl } from "../common/environment.js"
import { buildDefaultParams } from "../common/envVars.js";

export const DEBT_POSITION_TYPE_ORG_API_NAMES = {
    getDebtPositionTypeOrgsWithSpontaneous: "debtPositionTypeOrg/getDebtPositionTypeOrgsWithSpontaneous",
    getDebtPositionTypeOrgsWithSpontaneousDetail: "debtPositionTypeOrg/getDebtPositionTypeOrgsWithSpontaneousDetail",
    getMostUsedSpontaneousDebtPositionTypeOrgsForCurrentYear: "debtPositionTypeOrg/getMostUsedSpontaneousDebtPositionTypeOrgsForCurrentYear"
}

const baseUrl = getBaseUrl();

export function getDebtPositionTypeOrgsWithSpontaneous(brokerId, organizationId, token){
    const apiName = DEBT_POSITION_TYPE_ORG_API_NAMES.getDebtPositionTypeOrgsWithSpontaneous;
    const myParams = buildDefaultParams(apiName, token);

    const RES = http.get(`${baseUrl}/brokers/${brokerId}/spontaneous/organizations/${organizationId}/debt-position-type-orgs`, myParams);
    logResult(apiName, RES);
    return RES;
}

export function getDebtPositionTypeOrgsWithSpontaneousDetail(brokerId, organizationId, debtPositionTypeOrgId, token){
    const apiName = DEBT_POSITION_TYPE_ORG_API_NAMES.getDebtPositionTypeOrgsWithSpontaneousDetail;
    const myParams = buildDefaultParams(apiName, token);

    const RES = http.get(`${baseUrl}/brokers/${brokerId}/spontaneous/organizations/${organizationId}/debt-position-type-orgs/${debtPositionTypeOrgId}`, myParams);
    logResult(apiName, RES);
    return RES;
}

export function getMostUsedSpontaneousDebtPositionTypeOrgsForCurrentYear(brokerId, organizationId, token){
    const apiName = DEBT_POSITION_TYPE_ORG_API_NAMES.getMostUsedSpontaneousDebtPositionTypeOrgsForCurrentYear;
    const myParams = buildDefaultParams(apiName, token);

    const RES = http.get(`${baseUrl}/brokers/${brokerId}/spontaneous/organizations/${organizationId}/debt-position-type-orgs/most-used`, myParams);
    logResult(apiName, RES);
    return RES;
}
