import http from "k6/http";
import { formatXml } from "../../common/xml";

const nodo4PspUrl = "https://api.uat.platform.pagopa.it/nodo/node-for-psp/v1";

const verifyTemplate = open('./soap/requests_template_nodo/verifyPaymentNotice.xml');
const activateTemplate = open('./soap/requests_template_nodo/activatePaymentNoticeV2.xml');
const sendOutcomeTemplate = open('./soap/requests_template_nodo/sendPaymentOutcomeV2.xml');

export function verifyPaymentNotice(psp, orgFiscalCode, nav) {
    const payload = formatXml(verifyTemplate, {
        psp_id: psp.id,
        psp_id_broker: psp.id_broker,
        psp_id_channel: psp.id_channel,
        psp_password: psp.password,
        org_fiscal_code: orgFiscalCode,
        nav: nav
    });

    const params = {
        headers: {
            'Content-Type': 'text/xml',
            'SOAPAction': 'verifyPaymentNotice'
        },
    };

    return http.post(nodo4PspUrl, payload, params);
}

export function activatePaymentNotice(psp, orgFiscalCode, nav, amount, dueDate) {
    const payload = formatXml(activateTemplate, {
        psp_id: psp.id,
        psp_id_broker: psp.id_broker,
        psp_id_channel: psp.id_channel,
        psp_password: psp.password,
        org_fiscal_code: orgFiscalCode,
        nav: nav,
        amount: amount,
        due_date: dueDate
    });

    const params = {
        headers: {
            'Content-Type': 'text/xml',
            'SOAPAction': 'activatePaymentNoticeV2'
        }
    };

    return http.post(nodo4PspUrl, payload, params);
}

export function sendPaymentOutcome(psp, paymentToken, citizenFiscalCode, citizenName, citizenEmail) {
    const currentDate = new Date().toISOString().split('T')[0];

    const payload = formatXml(sendOutcomeTemplate, {
        psp_id: psp.id,
        psp_id_broker: psp.id_broker,
        psp_id_channel: psp.id_channel,
        psp_password: psp.password,
        payment_token: paymentToken,
        citizen_fiscal_code: citizenFiscalCode,
        citizen_name: citizenName,
        citizen_email: citizenEmail,
        current_date: currentDate
    });

    const params = {
        headers: {
            'Content-Type': 'text/xml',
            'SOAPAction': 'sendPaymentOutcomeV2'
        }
    };

    return http.post(nodo4PspUrl, payload, params);
}
