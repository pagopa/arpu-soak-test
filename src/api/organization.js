import http from "k6/http";
import { logResult } from "../common/dynamicScenarios/utils.js";
import { getBaseUrl } from "../common/environment.js"
import { buildDefaultParams } from "../common/envVars.js";

export const ORGANIZATION_API_NAMES = {
    getOrganizationsWithSpontaneous: "organization/getOrganizationsWithSpontaneous"
}

const baseUrl = getBaseUrl();

export function getOrganizationsWithSpontaneous(brokerId, token) {
    const apiName = ORGANIZATION_API_NAMES.getOrganizationsWithSpontaneous;
    const params = buildDefaultParams(apiName, token);

    const res = http.get(`${baseUrl}/brokers/${brokerId}/spontaneous/organizations`, params);

    logResult(apiName, res);
    return res;
}