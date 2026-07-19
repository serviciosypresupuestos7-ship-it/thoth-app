export class LLMService {
    /**
     * Generates a JSON response using the configured LLM provider.
     */
    static async generateJSON(prompt: string, systemPrompt: string, settings: any, maxTokens: number = 1000): Promise<any> {
        const provider = settings?.llm_provider || 'openai';
        const model = settings?.llm_model || 'gpt-4o-mini';

        try {
            if (provider === 'openai') {
                return await this.generateOpenAI(prompt, systemPrompt, model, settings.openai_api_key, maxTokens);
            } else if (provider === 'anthropic') {
                return await this.generateAnthropic(prompt, systemPrompt, model, settings.anthropic_api_key, maxTokens);
            } else if (provider === 'gemini') {
                return await this.generateGemini(prompt, systemPrompt, model, settings.gemini_api_key, maxTokens);
            } else if (provider === 'groq') {
                return await this.generateGroq(prompt, systemPrompt, model, settings.groq_api_key, maxTokens);
            } else {
                throw new Error(`Unsupported LLM provider: ${provider}`);
            }
        } catch (error) {
            console.error(`Error in LLMService (${provider}):`, error);
            throw error;
        }
    }

    static async generateChat(messages: { role: string, content: string }[], systemPrompt: string, settings: any, maxTokens: number = 1000): Promise<string> {
        const provider = settings?.llm_provider || 'openai';
        const model = settings?.llm_model || 'gpt-4o-mini';

        try {
            if (provider === 'openai') {
                if (!settings.openai_api_key) throw new Error("OpenAI API key missing");
                const res = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${settings.openai_api_key}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        model: model,
                        max_tokens: maxTokens,
                        messages: [{ role: 'system', content: systemPrompt }, ...messages]
                    })
                });
                const data = await res.json();
                if (data.error) throw new Error(data.error.message);
                return data.choices[0].message.content;
            } else if (provider === 'gemini') {
                if (!settings.gemini_api_key) throw new Error("Gemini API key missing");
                const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${settings.gemini_api_key}`;

                // Convert messages to Gemini format
                const geminiMessages = messages.map(m => ({
                    role: m.role === 'user' ? 'user' : 'model',
                    parts: [{ text: m.content }]
                }));

                const res = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        system_instruction: { parts: [{ text: systemPrompt }] },
                        contents: geminiMessages,
                        generationConfig: { maxOutputTokens: maxTokens }
                    })
                });
                const data = await res.json();
                if (data.error) throw new Error(data.error.message);
                return data.candidates[0].content.parts[0].text;
            } else {
                throw new Error(`Chat not implemented for provider: ${provider}`);
            }
        } catch (error) {
            console.error(`Error in LLMService.generateChat (${provider}):`, error);
            throw error;
        }
    }

    private static async generateOpenAI(prompt: string, systemPrompt: string, model: string, apiKey: string, maxTokens: number): Promise<any> {
        if (!apiKey) throw new Error("OpenAI API key missing");

        const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: model,
                max_tokens: maxTokens,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: prompt },
                ],
                response_format: { type: 'json_object' },
            }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error.message);
        return JSON.parse(data.choices[0].message.content);
    }

    private static async generateGroq(prompt: string, systemPrompt: string, model: string, apiKey: string, maxTokens: number): Promise<any> {
        if (!apiKey) throw new Error("Groq API key missing");

        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: model,
                max_tokens: maxTokens,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: prompt },
                ],
                response_format: { type: 'json_object' },
            }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error.message);
        return JSON.parse(data.choices[0].message.content);
    }

    private static async generateAnthropic(prompt: string, systemPrompt: string, model: string, apiKey: string, maxTokens: number): Promise<any> {
        if (!apiKey) throw new Error("Anthropic API key missing");

        const res = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: model,
                max_tokens: maxTokens,
                system: systemPrompt,
                messages: [{ role: 'user', content: prompt }]
            })
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error.message);
        return JSON.parse(data.content[0].text);
    }

    private static async generateGemini(prompt: string, systemPrompt: string, model: string, apiKey: string, maxTokens: number): Promise<any> {
        if (!apiKey) throw new Error("Gemini API key missing");

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: systemPrompt }] },
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    responseMimeType: "application/json",
                    maxOutputTokens: maxTokens
                }
            })
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error.message);
        return JSON.parse(data.candidates[0].content.parts[0].text);
    }
}
