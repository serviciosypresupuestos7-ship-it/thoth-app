export class EmbeddingService {
    // Global System Configuration for Embeddings
    // This MUST be consistent across all documents and queries to maintain the same vector space.
    static readonly GLOBAL_CONFIG = {
        provider: 'openai', // e.g., 'openai', 'gemini', 'voyage', 'jina', 'local'
        model: 'text-embedding-3-small',
        dimensions: 1536,
        version: '1.0'
    };

    /**
     * Generates an embedding for the given text using the GLOBAL configured provider.
     * Returns both the vector and the metadata of the model used.
     */
    static async generate(text: string): Promise<{ vector: number[], metadata: any }> {
        const { provider, model, dimensions, version } = this.GLOBAL_CONFIG;
        let vector: number[] = [];

        try {
            if (provider === 'openai') {
                // In a real app, this would use a global system API key, not a tenant key
                const apiKey = process.env.OPENAI_API_KEY;
                vector = await this.generateOpenAI(text, model, apiKey || '');
            } else if (provider === 'gemini') {
                const apiKey = process.env.GEMINI_API_KEY;
                vector = await this.generateGemini(text, model, apiKey || '');
            } else if (provider === 'local') {
                vector = this.generateMock(text, dimensions);
            } else {
                throw new Error(`Unsupported embedding provider: ${provider}`);
            }
        } catch (error) {
            console.error(`Error in EmbeddingService (${provider}):`, error);
            console.warn("Falling back to local/mock embedding to prevent system crash");
            vector = this.generateMock(text, dimensions);
        }

        return {
            vector,
            metadata: {
                embedding_provider: provider,
                embedding_model: model,
                embedding_dimensions: dimensions,
                embedding_version: version
            }
        };
    }

    private static async generateOpenAI(text: string, model: string, apiKey: string): Promise<number[]> {
        if (!apiKey) throw new Error("OpenAI API key missing");

        const res = await fetch('https://api.openai.com/v1/embeddings', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ input: text, model: model })
        });

        const data = await res.json();
        if (data.error) throw new Error(data.error.message);
        return data.data[0].embedding;
    }

    private static async generateGemini(text: string, model: string, apiKey: string): Promise<number[]> {
        if (!apiKey) throw new Error("Gemini API key missing");

        // Gemini uses a different endpoint for embeddings
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:embedContent?key=${apiKey}`;
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: `models/${model}`,
                content: { parts: [{ text: text }] }
            })
        });

        const data = await res.json();
        if (data.error) throw new Error(data.error.message);
        return data.embedding.values;
    }

    private static generateMock(text: string, dimensions: number = 1536): number[] {
        // Generates a deterministic-ish mock embedding based on text length
        const vec = Array.from({ length: dimensions }, (_, i) => Math.sin(text.length + i));
        const norm = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
        return vec.map(val => val / norm);
    }
}
