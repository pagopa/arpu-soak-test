# arc-soak-tests

This repository contains K6 scripts to run soak tests on ARC application, giving the possibility to dinamically configure through environment variables the workload pattern to simulate.

In order to be able to execute them, you have to [install K6](https://k6.io/docs/get-started/installation/).

## Scenarios

K6 allows to configure tests having a different [workloads](https://k6.io/docs/using-k6/scenarios/), or traffic patterns.

All configured tests as default will be executed simulating the following workloads:

- perVuIterations: A workload having a fixed number of invocations executed by a fixed number of parallel clients.
- This scenario could be further configured in order to be executed sequentally more than once with a randomic number of clients untill the reach of the total number of invocations desidered (through the setting of SCENARIO_PER_VU_SINGLE_ITERATION_ENV to false and defining the maximum number of executions through MAX_AVAILABLE_TEST_ENTITIES_ENV)
- rampingArrivalRate: A workload having a variable number of parallel clients which will run as many executions as allowed by the execution unit configured. Each variation of the number of users represent a stage. In this scenario. As default it will configure 3 stage (the minimum number) running a random number of parallel users at each stage (the last stage will always be 0, in order to wait previous stage executions).
- rampingGrowingArrivalRate: As previous scenario, but here it will be possible to configure a pool of virtual users, used to draw a growing ramp, maximizing the number of the parallel clients at the latest stages.
- constantArrivalRate: A workload having a fixed number of concurrent HTTP requests: it will execute as many invocations as required in order to have a constant rate of requestson the temporal unit configured.

## Configuration

# Context

The following environment variables allow to configure the test context data:

| ENV       | Description                                                       | Default |
|-----------|-------------------------------------------------------------------|---------|
| BROKER_ID | Identifier of the broker                                          |         |   

# Scenario

The following environment variables allow to configure the scenarios discuessed above:

| ENV                                  | Description                                                                                                                                                                                 | Default |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| TARGET_ENV                           | The environment to test                                                                                                                                                                     |         |
| USE_INTERNAL_ACCESS_ENV              | If use always internal base url or not                                                                                                                                                      | false   |
| RESULTS_DIR                          | The directory inside which create the results dir                                                                                                                                           | .       |
| REQ_DUMP                             | A boolen to log all requests or not                                                                                                                                                         | false   |
| VUS_MAX_ENV                          | The maximum number of parallel clients to simulate                                                                                                                                          | 3       |
| MAX_AVAILABLE_TEST_ENTITIES_ENV      | Scenario perVuIterations with multiple iterations: maximum number of executions                                                                                                             | 3       |
| SCENARIO_TYPE_ENV                    | The comma separated names of the scenarios to execute. Use the keys listed in [Scenarios](#Scenarios) paragraph                                                                             | ALL     |
| SCENARIO_PER_VU_SINGLE_ITERATION_ENV | perVuIterations scenario: if run a single iteration or multiple consecutive until consume all MAX_AVAILABLE_TEST_ENTITIES_ENV                                                               | false   |
| SCENARIO_PER_VU_EXECUTIONS_ENV       | perVuIterations scenario: the number of executions which each client will perform                                                                                                           | 1       |
| SCENARIO_DURATION_ENV                | perVuIterations,constantArrivalRate, rampingArrivalRate, rampingGrowingArrivalRate scenario: Duration of the scenario expressed as the temporal unit defined through SCENARIO_TIME_UNIT_ENV | 10      |
| SCENARIO_TIME_UNIT_ENV               | constantArrivalRate scenario: scenario time unit expressed as seconds                                                                                                                       | 1       |
| SCENARIO_RAMP_STAGE_NUMBER_ENV       | rampingArrivalRate, rampingGrowingArrivalRate scenario: the number of stages of the ramp                                                                                                    | 3       |
| THRESHOLDS_API_MAX_AVG_MS_ENV        | Max AVG duration applied as default to single API tests                                                                                                                                     | 500     |
| THRESHOLDS_API_MAX_MS_ENV            | Max duration applied as default to single API tests                                                                                                                                         | 1000    |
| THRESHOLDS_API_MAX_P90_MS_ENV        | Max P90 duration applied as default to single API tests                                                                                                                                     | 800     |
| THRESHOLDS_API_MAX_P95_MS_ENV        | Max P95 duration applied as default to single API tests                                                                                                                                     | 1000    |

## Utility scripts

Inside this repository there are some usefull scripts which will simplify test executions:

| SCRIPT    | Description                                                                                |
| --------- | ------------------------------------------------------------------------------------------ |
| run.sh    | It will run a single \*\*.js test inside the `src/tests` folder.                           |
| runAll.sh | It will run all the tests inside the `src/tests` folder, optionally setting a base folder. |
