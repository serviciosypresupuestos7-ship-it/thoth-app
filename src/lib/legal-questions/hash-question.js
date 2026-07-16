"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashQuestion = hashQuestion;
var crypto_1 = require("crypto");
function hashQuestion(anonymizedNormalizedText, tenantId, language) {
    if (language === void 0) { language = 'es'; }
    var payload = "".concat(anonymizedNormalizedText, "|").concat(tenantId, "|").concat(language);
    return crypto_1.default.createHash('sha256').update(payload).digest('hex');
}
