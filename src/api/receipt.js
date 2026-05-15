import http from "k6/http";
import { logResult } from "../common/dynamicScenarios/utils.js";
import { getBaseUrl } from "../common/environment.js"
import { buildDefaultParams } from "../common/envVars.js";

export const RECEIPT_API_NAMES = {
    getPagedDebtorReceipts: "receipt/getPagedDebtorReceipts",
    getDebtorReceipts: "receipt/getDebtorReceipts",
    getReceiptDetail: "receipt/getReceiptDetail",
    getReceiptPdf: "receipt/getReceiptPdf"
}

const baseUrl = getBaseUrl();

export function getPagedDebtorReceipts(brokerId, token) {
    const apiName = RECEIPT_API_NAMES.getPagedDebtorReceipts;
    const params = buildDefaultParams(apiName, token);

    const res = http.get(`${baseUrl}/brokers/${brokerId}/receipts`, params);

    logResult(apiName, res);
    return res;
}

export function getDebtorReceipts(brokerId, organizationId, debtPositionId, paymentOptionId, token) {
    const apiName = RECEIPT_API_NAMES.getDebtorReceipts;
    const params = buildDefaultParams(apiName, token);

    const res = http.get(`${baseUrl}/brokers/${brokerId}/organization/${organizationId}/debt-position/${debtPositionId}/payment-option/${paymentOptionId}/receipts`, params);

    logResult(apiName, res);
    return res;
}

export function getReceiptDetail(brokerId, organizationId, receiptId, token) {
    const apiName = RECEIPT_API_NAMES.getReceiptDetail;
    const params = buildDefaultParams(apiName, token);

    const res = http.get(`${baseUrl}/brokers/${brokerId}/organizations/${organizationId}/receipts/${receiptId}`, params);

    logResult(apiName, res);
    return res;
}

export function getReceiptPdf(brokerId, organizationId, receiptId, token) {
    const apiName = RECEIPT_API_NAMES.getReceiptPdf;
    const params = buildDefaultParams(apiName, token);

    const res = http.get(`${baseUrl}/brokers/${brokerId}/organizations/${organizationId}/receipts/${receiptId}/pdf`, params);

    logResult(apiName, res);
    return res;
}
