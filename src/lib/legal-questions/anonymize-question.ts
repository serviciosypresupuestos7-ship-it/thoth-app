export function anonymizeQuestion(text: string): string {
    let anonymized = text;

    // DNI/NIE
    anonymized = anonymized.replace(/[XYZ]?\d{7,8}[A-Z]/gi, "[DOCUMENTO_ID]");

    // Phone numbers
    anonymized = anonymized.replace(/(?:\+34|0034)?[ -]*(?:6|7|8|9)[0-9][ -]*[0-9]{2}[ -]*[0-9]{2}[ -]*[0-9]{2}/g, "[TELEFONO]");

    // Emails
    anonymized = anonymized.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[EMAIL]");

    // IBAN
    anonymized = anonymized.replace(/[a-zA-Z]{2}[0-9]{2}[a-zA-Z0-9]{4}[0-9]{7}([a-zA-Z0-9]?){0,16}/g, "[IBAN]");

    // Amounts (Euros)
    anonymized = anonymized.replace(/\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?\s*(?:€|euros|eur)/gi, "[IMPORTE]");

    return anonymized;
}
