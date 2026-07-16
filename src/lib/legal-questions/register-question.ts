import { SupabaseClient } from '@supabase/supabase-js';

export async function registerQuestion(
    supabase: SupabaseClient,
    questionData: {
        question: string | null;
        normalized_question: string;
        anonymized_question: string | null;
        contains_personal_data: boolean;
        detected_data_types: string[];
        hash: string;
        domain: string;
    }
) {
    try {
        // We use an upsert based on the unique constraint (tenant_id, hash)
        // Since tenant_id is automatically handled by RLS (or we are using service role if needed, but usually RLS),
        // we can just upsert by hash if we specify the conflict target.
        // Note: Supabase JS upsert with onConflict requires the exact constraint name or column names.

        // First, try to find if it exists to increment frequency
        const { data: existing } = await supabase
            .from('legal_questions')
            .select('id, frequency, first_asked_at')
            .eq('hash', questionData.hash)
            .single();

        if (existing) {
            // Update existing
            const { error } = await supabase
                .from('legal_questions')
                .update({
                    frequency: existing.frequency + 1,
                    last_asked_at: new Date().toISOString()
                })
                .eq('id', existing.id);

            if (error) throw error;
            return { id: existing.id, isNew: false };
        } else {
            // Insert new
            const { data, error } = await supabase
                .from('legal_questions')
                .insert({
                    question: questionData.question,
                    normalized_question: questionData.normalized_question,
                    anonymized_question: questionData.anonymized_question,
                    contains_personal_data: questionData.contains_personal_data,
                    detected_data_types: questionData.detected_data_types,
                    hash: questionData.hash,
                    domain: questionData.domain,
                    frequency: 1,
                    first_asked_at: new Date().toISOString(),
                    last_asked_at: new Date().toISOString()
                })
                .select('id')
                .single();

            if (error) {
                // Handle race condition where it was inserted between our check and insert
                if (error.code === '23505') { // unique violation
                    const { data: retryExisting } = await supabase
                        .from('legal_questions')
                        .select('id, frequency')
                        .eq('hash', questionData.hash)
                        .single();

                    if (retryExisting) {
                        await supabase
                            .from('legal_questions')
                            .update({
                                frequency: retryExisting.frequency + 1,
                                last_asked_at: new Date().toISOString()
                            })
                            .eq('id', retryExisting.id);
                        return { id: retryExisting.id, isNew: false };
                    }
                }
                throw error;
            }
            return { id: data.id, isNew: true };
        }
    } catch (error) {
        console.error("Error registering question:", error);
        throw error;
    }
}
