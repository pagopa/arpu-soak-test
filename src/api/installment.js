import http from "k6/http";
import { logResult } from "../common/dynamicScenarios/utils.js";
import { getBaseUrl } from "../common/environment.js"
import { buildDefaultParams } from "../common/envVars.js";

export const INSTALLMENT_API_NAMES = {
    getDebtorUnpaidDebtPositionInstallments: "debtPosition/getDebtorUnpaidDebtPositionInstallments",
    getPublicInstallmentsByIuvOrNav: "debtPosition/getPublicInstallmentsByIuvOrNav"
}

const baseUrl = getBaseUrl();

export function getDebtorUnpaidDebtPositionInstallments(brokerId, debtPositionId, paymentOptionId, organizationId, token) {
    const apiName = INSTALLMENT_API_NAMES.getDebtorUnpaidDebtPositionInstallments;
    const params = buildDefaultParams(apiName, token)

    const res = http.get(`${baseUrl}/brokers/${brokerId}/debt-positions/debtor/unpaid/${debtPositionId}/${paymentOptionId}/installments?organizationId=${organizationId}`, params);

    logResult(apiName, res);
    return res;
}

export function getPublicInstallmentsByIuvOrNav(brokerId, iuvOrNav, fiscalCode) {
    const apiName = INSTALLMENT_API_NAMES.getPublicInstallmentsByIuvOrNav;
    const params = buildDefaultParams(apiName);
    Object.assign(params.headers, { 
        "X-fiscal-code": fiscalCode 
    });

    const res = http.get(`${baseUrl}/public/brokers/${brokerId}/installments?iuvOrNav=${iuvOrNav}`, params);

    logResult(apiName, res);
    return res;
}
