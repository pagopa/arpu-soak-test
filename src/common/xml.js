export function formatXml(template, variables) {
    let result = template;
    for (const [key, value] of Object.entries(variables)) {
        result = result.split(`{${key}}`).join(value);
    }
    return result;
}

export function extractXmlValue(xmlString, tagName) {
    const regex = new RegExp(`<${tagName}[^>]*>(.*?)</${tagName}>`);
    const match = xmlString?.match(regex);
    return match ? match[1] : null;
}
