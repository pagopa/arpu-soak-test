import {
  randomString,
  randomIntBetween,
} from "https://jslib.k6.io/k6-utils/1.1.0/index.js";
import papaparse from "https://jslib.k6.io/papaparse/5.1.1/index.js";
import exec from "k6/execution";
import { getAuthTokenTestUser, getUserInfo } from "../api/auth.js";
import { getScenarioTestEntity, logResult } from "./dynamicScenarios/utils.js";

/** It will return o1 if define, otherwise it will return o2 */
export function coalesce(o1, o2) {
  return o1 !== undefined && o1 !== null ? o1 : o2;
}

/** It will stop the test execution */
export function abort(description) {
  description = `Aborting execution due to: ${description}`;
  if (exec) {
    console.error(description);
    exec.test.abort();
  } else {
    throw new Error(description);
  }
}

/** It will retrieve the TestUser auth token */
export function getAuthToken() {
  const result = getAuthTokenTestUser();
  if (result.status !== 200) {
    logResult(result);
    abort("Cannot retrieve authTokenTestUser");
  }
  return result.json().accessToken;
}

/** It will retrieve the TestUser fiscalCode */
export function getAuthFiscalCode(authToken) {
  const result = getUserInfo(authToken);
  if (result.status !== 200) {
    logResult(result);
    abort("Cannot retrieve user info");
  }
  return result.json().fiscalCode;
}

/** Given a list of test entities, it will return 1 of them starting from the first once reached the end */
export function getTestEntity(testEntities) {
  return getScenarioTestEntity(testEntities);
}

export function randomFiscalCode() {
  "^([A-Za-z]{6}[0-9lmnpqrstuvLMNPQRSTUV]{2}[abcdehlmprstABCDEHLMPRST]{1}[0-9lmnpqrstuvLMNPQRSTUV]{2}[A-Za-z]{1}[0-9lmnpqrstuvLMNPQRSTUV]{3}[A-Za-z]{1})$";

  const name = randomString(6);
  const randDate = randomDate(new Date(1970, 0, 1), new Date(2000, 0, 1));
  const birth_y = randDate.getFullYear().toString().substring(2);
  const birth_m = getFiscalCodeMonth(randDate.getMonth() + 1);
  const isFemale = Math.random() < 0.5;
  let birth_d = (randDate.getDay() + (isFemale ? 40 : 0) + 1).toString();
  birth_d = birth_d.length == 1 ? `0${birth_d}` : birth_d;
  const final = [
    randomString(1),
    (100 + Math.floor(Math.random() * 899)).toString(),
    randomString(1),
  ].join("");
  return [name, birth_y, birth_m, birth_d, final].join("");
}

function getFiscalCodeMonth(month) {
  const monthDict = {
    1: "A",
    2: "B",
    3: "C",
    4: "D",
    5: "E",
    6: "H",
    7: "L",
    8: "M",
    9: "P",
    10: "R",
    11: "S",
    12: "T",
  };
  return monthDict[month];
}

export function randomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

export function randomVatNumber() {
  return randomIntBetween(10000000000, 99999999999);
}

export function getRelativePathToRootFolder() {
  try {
    open(".");
  } catch (error) {
    const testFolderMatch = error.message.match("(?:\\\\|/)src(?:\\\\|/)");
    if (!testFolderMatch) {
      console.log(
        "WARNING! Unexpected folder structure, cannot found src folder"
      );
      return "../..";
    }
    const path = error.message.substr(testFolderMatch.index - 1);
    return path
      .match(/(\\\\|\/)/g)
      .map((x) => "..")
      .join("/");
  }
  return "../..";
}

export const csvDelimiter = coalesce(__ENV.CSV_DELIMITER, ";");

export function getCsvData(filePath, hasHeader) {
  if (hasHeader === undefined) {
    hasHeader = true;
  }

  return papaparse
    .parse(open(filePath), {
      header: hasHeader,
      delimiter: csvDelimiter,
    })
    .data.filter((r) => Object.values(r)[0]);
}

export const getRandom = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
}
