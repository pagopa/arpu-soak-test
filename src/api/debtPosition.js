import http from "k6/http";
import { logResult } from "../common/dynamicScenarios/utils.js";
import { getBaseUrl } from "../common/environment.js"
import { buildDefaultParams } from "../common/envVars.js";
import { getAuthFiscalCode } from "../common/utils.js";

export const DEBT_POSITION_API_NAMES = {
    getPagedUnpaidDebtPositions: "debtPosition/getPagedUnpaidDebtPositions",
    getDebtorUnpaidDebtPositionOverview: "debtPosition/getDebtorUnpaidDebtPositionOverview"
}

const baseUrl = getBaseUrl();
const xFiscalCode = getAuthFiscalCode();

export function getPagedUnpaidDebtPositions(brokerId, token) {
    const apiName = DEBT_POSITION_API_NAMES.getPagedUnpaidDebtPositions;
    const params = buildDefaultParams(apiName, token);
    params.headers = {...params.headers, 
        "X-fiscal-code" : xFiscalCode};

    const res = http.get(`${baseUrl}/brokers/${brokerId}/debt-positions/unpaid`, params);

    logResult(apiName, res);
    return res;
}

export function getDebtorUnpaidDebtPositionOverview(brokerId, organizationId, token) {
    const apiName = DEBT_POSITION_API_NAMES.getPagedUnpaidDebtPositions;
    const params = buildDefaultParams(apiName, token);
    params.headers = {...params.headers, 
        "X-fiscal-code" : xFiscalCode,
        "organizationId" : organizationId
    };

    const res = http.get(`${baseUrl}/brokers/${brokerId}/debt-positions/debtor/unpaid/${debtPositionId}/overview`, params);

    logResult(apiName, res);
    return res;
}
