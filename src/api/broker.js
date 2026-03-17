import http from "k6/http";
import { logResult } from "../common/dynamicScenarios/utils.js";
import { getBaseUrl } from "../common/environment.js"
import { buildDefaultParams } from "../common/envVars.js";

export const BROKER_API_NAMES = {
    getPublicBrokerInfo: "broker/getPublicBrokerInfo"
};

const baseUrl = getBaseUrl();

export function getPublicBrokerInfo(brokerId, externalId) {
    const apiName = BROKER_API_NAMES.getPublicBrokerInfo;
    const params = buildDefaultParams(apiName);

    const res = http.get(`${baseUrl}/public/brokers?brokerId=${brokerId}&externalId=${externalId}`, params);

    logResult(apiName, res);
    return res;
}