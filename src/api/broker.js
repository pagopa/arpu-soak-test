import http from "k6/http";
import { logResult } from "../common/dynamicScenarios/utils.js";
import { getBaseUrl } from "../common/environment"
import { buildDefaultParams } from "../common/envVars";

export const BROKER_API_NAMES = {
    getPublicBrokerInfo: "broker/getPublicBrokerInfo"
}

const BASE_URL = getBaseUrl();

export function getPublicBrokerInfo(brokerId, externalId) {
    const apiName = BROKER_API_NAMES.getPublicBrokerInfo;
    const params = buildDefaultParams(apiName);

    const res = http.get(`${BASE_URL}/public/brokers?brokerId=${brokerId}&externalId=${externalId}`, params);

    logResult(apiName, res);
    return res;
}