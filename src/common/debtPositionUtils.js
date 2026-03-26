import { CONFIG } from "./envVars.js";

export const buildDebtPositionPayload = (organizationId, debtPositionTypeOrgId, fiscalCode) => {
  const randomAmount = Math.floor(Math.random() * 100) + 1;
  return {
    organizationId,
    debtPositionTypeOrgId,
    paymentOptions: [
      {
        totalAmountCents: randomAmount,
        installments: [
          {
            amountCents: randomAmount,
            remittanceInformation: "SOAK_TEST",
            notificationFeeCents: 0,
            debtor: {
              entityType: "F",
              fiscalCode: fiscalCode,
              fullName: "Marco Polo",
              address: "via roma",
              civic: "33",
              postalCode: "00170",
              location: "Roma",
              province: "RM",
              nation: "IT",
              email: "email@test.com"
            }
          }
        ]
      }
    ]
  };
};

export const buildDebtPositionPayloadCie = ( organizationId, debtPositionTypeOrgId, fiscalCode) => {
  const basePayload = buildDebtPositionPayload(
    organizationId,
    debtPositionTypeOrgId,
    fiscalCode
  );
  return Object.assign(basePayload, {
    fieldValues: {
      payerEntityType: "F",
      payerFiscalCode: fiscalCode,
      payerFullName: "Marco Polo",
      payerAddress: "via roma",
      payerCivic: "33",
      payerPostalCode: "00170",
      payerLocation: "Roma",
      payerProvince: "RM",
      payerNation: "IT",
      payerEmail: "email@test.com",
      orgFiscalCode: "99999999982"
    }
  });
};
