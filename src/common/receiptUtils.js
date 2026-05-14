import { getOrganizationsWithSpontaneous } from "../api/organization.js";
import { createSpontaneousDebtPosition } from "../api/debtPosition.js";
import { CONFIG } from "../common/envVars.js"
import { abort } from "../common/utils.js";
import { getDebtPositionTypeOrgsWithSpontaneous } from "../api/debtPositionTypeOrg.js";
import { activatePaymentNotice, sendPaymentOutcome, verifyPaymentNotice } from "../api/soap/nodo.js";
import { extractXmlValue } from "./xml.js";

export function seedsReceipts(brokerId, authToken, userInfo) {
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
        const debtPositionTypeOrgs = getDebtPositionTypeOrgsWithSpontaneous(brokerId, organization.organizationId, authToken).json();

        debtPositionTypeOrgs
            .forEach(debtPositionTypeOrg => {
                const debtPositionRes = createSpontaneousDebtPosition(
                    brokerId, 
                    organization.organizationId, 
                    debtPositionTypeOrg.debtPositionTypeOrgId, 
                    userInfo.fiscalCode, 
                    authToken
                );

                if (debtPositionRes.status < 200 || debtPositionRes.status >= 300) {
                    return;
                }

                const debtPosition = debtPositionRes.json();

                const nav = debtPosition.paymentDetails.nav; 
                const orgFiscalCode = debtPosition.orgFiscalCode;

                const verifyRes = verifyPaymentNotice(pspInfo, orgFiscalCode, nav);
                console.log(JSON.stringify(verifyRes));
                const amount = extractXmlValue(verifyRes.body, 'amount');
                console.log(amount)
                const dueDate = extractXmlValue(verifyRes.body, 'dueDate');
                console.log(dueDate);
                const activateRes = activatePaymentNotice(pspInfo, orgFiscalCode, nav, amount, dueDate);
                console.log(JSON.stringify(activateRes));
                const paymentToken = extractXmlValue(activateRes.body, 'paymentToken');
                console.log(paymentToken);
                const sendPaymentOutcomeRes = sendPaymentOutcome(pspInfo, paymentToken, userInfo.fiscalCode, userInfo.name, userInfo.email);
                console.log(JSON.stringify(sendPaymentOutcomeRes));
            }
        );
    });
}