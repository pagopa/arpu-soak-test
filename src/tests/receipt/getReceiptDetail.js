import { assert, statusOk } from "../../common/assertions.js";
import {
    getPagedDebtorReceipts,
    getReceiptDetail,
    RECEIPT_API_NAMES
} from "../../api/receipt.js";
import defaultHandleSummaryBuilder from "../../common/handleSummaryBuilder.js";
import { defaultApiOptionsBuilder } from "../../common/dynamicScenarios/defaultOptions.js";
import { logErrorResult } from "../../common/dynamicScenarios/utils.js";
import { getAuthToken, getTestEntity, abort, getAuthUserInfo } from "../../common/utils.js";
import { CONFIG } from "../../common/envVars.js";
import { createSpontaneousDebtPosition } from "../../api/debtPosition.js";
import { extractXmlValue } from "../../common/xml.js";
import { verifyPaymentNotice, activatePaymentNotice, sendPaymentOutcome } from "../../api/soap/nodo.js";

const application = "receipt";
const testName = "getReceiptDetail";

// Dynamic scenarios' K6 configuration
export const options = defaultApiOptionsBuilder(
  application,
  testName,
  [
    RECEIPT_API_NAMES.getReceiptDetail
  ] // applying apiName tags to thresholds
);

// K6 summary configuration
export const handleSummary = defaultHandleSummaryBuilder(application, testName);

export function setup() {
    const authToken = getAuthToken();
    const userInfo = getAuthUserInfo(authToken);
    const brokerId = CONFIG.CONTEXT.BROKER_ID;

    const organizations = getOrganizationsWithSpontaneous(brokerId, authToken).json();
      
    if (organizations.length === 0) {
        abort("No elements found in organizations list");
    }

    const pspInfo = {
        id: CONFIG.PSP.ID,
        id_broker: CONFIG.PSP.ID_BROKER,
        id_channel: CONFIG.PSP.ID_CHANNEL,
        password: CONFIG.PSP.PASSWORD
    };

    organizations.forEach(organization => {
        const debtPositionTypeOrgs = getDebtPositionTypeOrgsWithSpontaneous(brokerId, organizationId, authToken).json();

        debtPositionTypeOrgs
        .filter(debtPositionTypeOrg => debtPositionTypeOrg.debtPositionTypeId > 0)
        .forEach(debtPositionTypeOrg => {
            const debtPosition = createSpontaneousDebtPosition(brokerId, organization.organizationId, debtPositionTypeOrg.debtPositionTypeOrgId, userInfo.fiscalCode, authToken).json();

            const nav = debtPosition.paymentOption[0].installments[0].nav; 
            const orgFiscalCode = organization.fiscalCode;

            const verifyRes = verifyPaymentNotice(pspInfo, orgFiscalCode, nav);
            const amount = extractXmlValue(verifyRes.body, 'amount');
            const dueDate = extractXmlValue(verifyRes.body, 'dueDate');

            const activateRes = activatePaymentNotice(pspInfo, orgFiscalCode, nav, amount, dueDate);
            const paymentToken = extractXmlValue(activateRes.body, 'paymentToken');

            sendPaymentOutcome(pspInfo, paymentToken, userInfo.fiscalCode, userInfo.name, userInfo.email);
        });
    });

    const receipts = getPagedDebtorReceipts(brokerId, authToken).json().content;
    
    if (receipts.length === 0) {
        abort("No elements found in receipts list please restart test with at least one element");
    }

    return {
        brokerId,
        receipts,
        token: authToken
    };
}

export default (data) => {
    const receipt = getTestEntity(data.receipts);

    const getReceiptDetailResult = getReceiptDetail(data.brokerId, receipt.organizationId, receipt.receiptId, data.token);
    
    assert(getReceiptDetailResult, [statusOk()]);
        
    if (getReceiptDetailResult.status !== 200) {
        logErrorResult(
            `Unexpected ${testName} status`, 
            getReceiptDetailResult, 
            true
        );
    }
};
