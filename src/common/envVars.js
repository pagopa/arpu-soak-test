import { coalesce } from "./utils.js";

const vu = parseInt(coalesce(__ENV.VUS_MAX_ENV, 3));

const rampStageNumber = Math.max(
  parseInt(coalesce(__ENV.SCENARIO_RAMP_STAGE_NUMBER_ENV, 3)),
  3
);

export const CONFIG = {
  TARGET_ENV: __ENV.TARGET_ENV,
  USE_INTERNAL_ACCESS_ENV:
    __ENV.USE_INTERNAL_ACCESS_ENV &&
    __ENV.USE_INTERNAL_ACCESS_ENV.toLowerCase() === "true",

  DUMP_REQUESTS: __ENV.REQ_DUMP && __ENV.REQ_DUMP.toLowerCase() === "true",

  VIRTUAL_USERS: vu,
  MAX_AVAILABLE_TEST_ENTITIES_ENV: coalesce(
    __ENV.MAX_AVAILABLE_TEST_ENTITIES_ENV,
    vu
  ),

  SCENARIOS: {
    TYPES: coalesce(__ENV.SCENARIO_TYPE_ENV, "ALL").split(","),

    perVuIterations: {
      RAMPING_SIZE:
        __ENV.SCENARIO_PER_VU_RAMPING_SIZE &&
        __ENV.SCENARIO_PER_VU_RAMPING_SIZE.toLowerCase() === "true",
      ONESHOT:
        __ENV.SCENARIO_PER_VU_SINGLE_ITERATION_ENV &&
        __ENV.SCENARIO_PER_VU_SINGLE_ITERATION_ENV.toLowerCase() !== "false",
      EXECUTIONS: parseInt(coalesce(__ENV.SCENARIO_PER_VU_EXECUTIONS_ENV, 1)),
      DURATION: parseInt(coalesce(__ENV.SCENARIO_DURATION_ENV, 3)),
    },

    constantArrivalRate: {
      RATE: vu,
      DURATION: parseInt(coalesce(__ENV.SCENARIO_DURATION_ENV, 3)),
      TIME_UNIT: parseInt(coalesce(__ENV.SCENARIO_TIME_UNIT_ENV, 1)),
    },

    RAMPS: {
      STAGES_NUMBER: rampStageNumber,
      STAGE_SECONDS_DURATION: Math.max(
        parseInt(coalesce(__ENV.SCENARIO_DURATION_ENV, 1)) / rampStageNumber,
        1
      ),

      rampingGrowingArrivalRate: {
        RAMP_BUILDING_VU_POOL: Math.min(
          parseInt(
            coalesce(
              __ENV.SCENARIO_RAMP_GROWING_RAMP_BUILDING_VU_POOL,
              Math.ceil((vu * (rampStageNumber - 1)) / 2)
            )
          ),
          Math.ceil((vu * (rampStageNumber - 1)) / 2)
        ),
      },
    },
  },

  THRESHOLDS: {
    DURATIONS: {
      AVG: parseInt(coalesce(__ENV.THRESHOLDS_API_MAX_AVG_MS_ENV, 500)),
      MAX: parseInt(coalesce(__ENV.THRESHOLDS_API_MAX_MAX_MS_ENV, 1000)),
      P90: parseInt(coalesce(__ENV.THRESHOLDS_API_MAX_P90_MS_ENV, 800)),
      P95: parseInt(coalesce(__ENV.THRESHOLDS_API_MAX_P95_MS_ENV, 1000)),
    },
    REQ_FAILED: {
      RATE: parseFloat(
        coalesce(__ENV.THRESHOLDS_API_MAX_FAILED_REQ_RATE_ENV, 0.05)
      ),
    },
  },

  SUMMARY: {
    RESULTS_DIR: __ENV.RESULTS_DIR,
  },

  CONTEXT: {
    BROKER_ID: parseInt(__ENV.BROKER_ID),
    IPZS_ORGANIZATION_FISCAL_CODE: "00399810589"
  }

};

export const defaultHeaders = {
  "Content-Type": "application/json",
};

export function buildDefaultParams(apiName, token) {
  return {
    headers: Object.assign(
      {},
      defaultHeaders,
      token ? { Authorization: `Bearer ${token}` } : {}
    ),
    tags: { apiName },
    redirects: 0,
  };
}