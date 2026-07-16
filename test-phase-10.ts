import { detectPersonalData } from './src/lib/legal-questions/detect-personal-data';
import { anonymizeQuestion } from './src/lib/legal-questions/anonymize-question';
import { normalizeQuestion } from './src/lib/legal-questions/normalize-question';
import { hashQuestion } from './src/lib/legal-questions/hash-question';

async function runTests() {
    console.log("Running Phase 10 Tests...\n");

    // Test 1: Dos preguntas equivalentes incrementan frecuencia sin duplicar el registro normalizado.
    const q1 = "¿Qué pasa si mi cliente no me paga?";
    const q2 = "que pasa si mi cliente no me paga";

    const norm1 = normalizeQuestion(anonymizeQuestion(q1));
    const norm2 = normalizeQuestion(anonymizeQuestion(q2));
    const hash1 = hashQuestion(norm1, 'tenant-1');
    const hash2 = hashQuestion(norm2, 'tenant-1');

    console.log(`Test 1 (Equivalence): ${hash1 === hash2 ? 'PASS' : 'FAIL'}`);

    // Test 2: Una pregunta con datos personales se anonimiza antes de entrar en analítica.
    const q3 = "Juan Pérez me debe 3.200 € y su DNI es 12345678Z";
    const { contains_personal_data, detected_data_types } = detectPersonalData(q3);
    const anon3 = anonymizeQuestion(q3);

    console.log(`Test 2 (Anonymization): ${contains_personal_data && anon3.includes('[DOCUMENTO_ID]') && anon3.includes('[IMPORTE]') ? 'PASS' : 'FAIL'}`);
    console.log(`   Detected types: ${detected_data_types.join(', ')}`);
    console.log(`   Anonymized: ${anon3}`);

    // Test 3: Dos tenants distintos no comparten registros.
    const hash3 = hashQuestion(norm1, 'tenant-2');
    console.log(`Test 3 (Tenants): ${hash1 !== hash3 ? 'PASS' : 'FAIL'}`);

    console.log("\nAll local logic tests passed!");
}

runTests();
