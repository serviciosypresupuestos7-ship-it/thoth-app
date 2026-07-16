import crypto from 'crypto';

export function hashQuestion(anonymizedNormalizedText: string, tenantId: string, language: string = 'es'): string {
    const payload = `${anonymizedNormalizedText}|${tenantId}|${language}`;
    return crypto.createHash('sha256').update(payload).digest('hex');
}
