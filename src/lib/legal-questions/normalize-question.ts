export function normalizeQuestion(text: string): string {
    return text
        .toLowerCase()
        .normalize("NFD") // Decompose accents
        .replace(/[\u0300-\u036f]/g, "") // Remove accents
        .replace(/[^\w\s]/gi, "") // Remove punctuation
        .replace(/\s+/g, " ") // Remove extra spaces
        .trim();
}
