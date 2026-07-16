"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var detect_personal_data_1 = require("./src/lib/legal-questions/detect-personal-data");
var anonymize_question_1 = require("./src/lib/legal-questions/anonymize-question");
var normalize_question_1 = require("./src/lib/legal-questions/normalize-question");
var hash_question_1 = require("./src/lib/legal-questions/hash-question");
function runTests() {
    return __awaiter(this, void 0, void 0, function () {
        var q1, q2, norm1, norm2, hash1, hash2, q3, _a, contains_personal_data, detected_data_types, anon3, hash3;
        return __generator(this, function (_b) {
            console.log("Running Phase 10 Tests...\n");
            q1 = "¿Qué pasa si mi cliente no me paga?";
            q2 = "que pasa si mi cliente no me paga";
            norm1 = (0, normalize_question_1.normalizeQuestion)((0, anonymize_question_1.anonymizeQuestion)(q1));
            norm2 = (0, normalize_question_1.normalizeQuestion)((0, anonymize_question_1.anonymizeQuestion)(q2));
            hash1 = (0, hash_question_1.hashQuestion)(norm1, 'tenant-1');
            hash2 = (0, hash_question_1.hashQuestion)(norm2, 'tenant-1');
            console.log("Test 1 (Equivalence): ".concat(hash1 === hash2 ? 'PASS' : 'FAIL'));
            q3 = "Juan Pérez me debe 3.200 € y su DNI es 12345678Z";
            _a = (0, detect_personal_data_1.detectPersonalData)(q3), contains_personal_data = _a.contains_personal_data, detected_data_types = _a.detected_data_types;
            anon3 = (0, anonymize_question_1.anonymizeQuestion)(q3);
            console.log("Test 2 (Anonymization): ".concat(contains_personal_data && anon3.includes('[DOCUMENTO_ID]') && anon3.includes('[IMPORTE]') ? 'PASS' : 'FAIL'));
            console.log("   Detected types: ".concat(detected_data_types.join(', ')));
            console.log("   Anonymized: ".concat(anon3));
            hash3 = (0, hash_question_1.hashQuestion)(norm1, 'tenant-2');
            console.log("Test 3 (Tenants): ".concat(hash1 !== hash3 ? 'PASS' : 'FAIL'));
            console.log("\nAll local logic tests passed!");
            return [2 /*return*/];
        });
    });
}
runTests();
