"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectPersonalData = detectPersonalData;
function detectPersonalData(text) {
    var detected_data_types = new Set();
    // DNI/NIE (Spanish)
    if (/[XYZ]?\d{7,8}[A-Z]/i.test(text)) {
        detected_data_types.add("dni_nie");
    }
    // Phone numbers (Spanish format approximation)
    if (/(?:\+34|0034)?[ -]*(?:6|7|8|9)[0-9][ -]*[0-9]{2}[ -]*[0-9]{2}[ -]*[0-9]{2}/.test(text)) {
        detected_data_types.add("phone");
    }
    // Emails
    if (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text)) {
        detected_data_types.add("email");
    }
    // IBAN
    if (/[a-zA-Z]{2}[0-9]{2}[a-zA-Z0-9]{4}[0-9]{7}([a-zA-Z0-9]?){0,16}/.test(text)) {
        detected_data_types.add("iban");
    }
    // Amounts (Euros)
    if (/\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?\s*(?:€|euros|eur)/i.test(text)) {
        detected_data_types.add("amount");
    }
    return {
        contains_personal_data: detected_data_types.size > 0,
        detected_data_types: Array.from(detected_data_types)
    };
}
