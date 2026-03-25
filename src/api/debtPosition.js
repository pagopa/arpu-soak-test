import http from "k6/http";
import { logResult } from "../common/dynamicScenarios/utils.js";
import { getBaseUrl } from "../common/environment.js"
import { buildDefaultParams } from "../common/envVars.js";
import { buildDebtPositionPayload, buildDebtPositionPayloadCie } from "../common/utils.js";

export const DEBT_POSITION_API_NAMES = {
    getPagedUnpaidDebtPositions: "debtPosition/getPagedUnpaidDebtPositions",
    getDebtorUnpaidDebtPositionOverview: "debtPosition/getDebtorUnpaidDebtPositionOverview",
    getUnpaidPaymentNoticeZip: "debtPosition/getUnpaidPaymentNoticeZip",
    getPaymentNotice: "debtPosition/getPaymentNotice",
    createSpontaneousDebtPosition: "debtPosition/createSpontaneousDebtPosition",
    getDebtPositionDetail: "debtPosition/getDebtPositionDetail",
}

const baseUrl = getBaseUrl();

export function getPagedUnpaidDebtPositions(brokerId, fiscalCode, token) {
    const apiName = DEBT_POSITION_API_NAMES.getPagedUnpaidDebtPositions;
    const params = buildDefaultParams(apiName, token);
    Object.assign(params.headers, { 
        "X-fiscal-code": fiscalCode 
    });

    const res = http.get(`${baseUrl}/brokers/${brokerId}/debt-positions/unpaid`, params);

    logResult(apiName, res);
    return res;
}

export function getDebtorUnpaidDebtPositionOverview(brokerId, organizationId, debtPositionId, fiscalCode, token) {
    const apiName = DEBT_POSITION_API_NAMES.getPagedUnpaidDebtPositions;
    const params = buildDefaultParams(apiName, token);
    Object.assign(params.headers, { 
        "X-fiscal-code": fiscalCode
    });

    const res = http.get(`${baseUrl}/brokers/${brokerId}/debt-positions/debtor/unpaid/${debtPositionId}/overview?organizationId=${organizationId}`, params);

    logResult(apiName, res);
    return res;
}

export function getUnpaidPaymentNoticeZip(brokerId, debtPositionId, fiscalCode, token) {
    const apiName = DEBT_POSITION_API_NAMES.getUnpaidPaymentNoticeZip;
    const params = buildDefaultParams(apiName, token);
    Object.assign(params.headers, { 
        "X-fiscal-code": fiscalCode 
    });

    const res = http.get(`${baseUrl}/brokers/${brokerId}/debt-positions/${debtPositionId}/notice/zip`, params);
    logResult(apiName, res);
    return res;
}

export function getPaymentNotice(brokerId, organizationId, nav, fiscalCode, token) {
    const apiName = DEBT_POSITION_API_NAMES.getPaymentNotice;
    const params = buildDefaultParams(apiName, token);
    Object.assign(params.headers, { 
        "X-fiscal-code": fiscalCode 
    });

    const res = http.get(`${baseUrl}/brokers/${brokerId}/organizations/${organizationId}/debt-positions/notice?nav=${nav}`, params);
    logResult(apiName, res);
    return res;
}

export function createSpontaneousDebtPosition(brokerId, organizationId, debtPositionTypeOrgId, fiscalCode, token) {
  const apiName = DEBT_POSITION_API_NAMES.createSpontaneousDebtPosition;
  const params = buildDefaultParams(apiName, token);
  const payload = buildDebtPositionPayload(organizationId, debtPositionTypeOrgId, fiscalCode);

  const res = http.post(`${baseUrl}/brokers/${brokerId}/spontaneous/debt-positions`, JSON.stringify(payload), params);
  logResult(apiName, res);
  return res;
}

export function createSpontaneousDebtPositionCie(brokerId, fiscalCode, token) {
  const apiName = DEBT_POSITION_API_NAMES.createSpontaneousDebtPosition;
  const params = buildDefaultParams(apiName, token);
  const payload = buildDebtPositionPayloadCie(fiscalCode);

  const res = http.post(`${baseUrl}/brokers/${brokerId}/spontaneous/debt-positions`, JSON.stringify(payload), params);
  logResult(apiName, res);
  return res;
}

export function getDebtPositionDetail(brokerId, debtPositionId, fiscalCode, token) {
    const apiName = DEBT_POSITION_API_NAMES.getDebtPositionDetail;
    const params = buildDefaultParams(apiName, token);
    Object.assign(params.headers, { 
        "X-fiscal-code": fiscalCode 
    });

    const res = http.get(`${baseUrl}/brokers/${brokerId}/debt-positions/${debtPositionId}`, params);
    logResult(apiName, res);
    return res;
}
