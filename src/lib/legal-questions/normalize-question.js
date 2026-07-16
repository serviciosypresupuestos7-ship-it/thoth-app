"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeQuestion = normalizeQuestion;
function normalizeQuestion(text) {
    return text
        .toLowerCase()
        .normalize("NFD") // Decompose accents
        .replace(/[\u0300-\u036f]/g, "") // Remove accents
        .replace(/[^\w\s]/gi, "") // Remove punctuation
        .replace(/\s+/g, " ") // Remove extra spaces
        .trim();
}
