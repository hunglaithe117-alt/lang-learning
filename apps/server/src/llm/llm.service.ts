import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface ProcessDocumentResponse {
    document_id: string;
    chunks_count: number;
    message: string;
}

interface ChatResponse {
    message: { role: string; content: string };
}

@Injectable()
export class LlmService {
    private readonly baseUrl: string;

    constructor(private readonly config: ConfigService) {
        this.baseUrl = this.config.get<string>(
            'LLM_SERVICE_URL',
            'http://localhost:8000',
        );
    }

    async processDocument(
        filePath: string,
        documentId: string,
        language: string,
    ): Promise<ProcessDocumentResponse> {
        const formData = new FormData();
        const fs = await import('fs');
        const fileBuffer = fs.readFileSync(filePath);
        const blob = new Blob([fileBuffer]);
        formData.append('file', blob, filePath.split('/').pop());
        formData.append('language', language);

        const response = await fetch(
            `${this.baseUrl}/api/v1/documents/upload?language=${language}`,
            { method: 'POST', body: formData },
        );

        if (!response.ok) {
            throw new HttpException(
                `LLM service error: ${response.statusText}`,
                HttpStatus.BAD_GATEWAY,
            );
        }

        return response.json() as Promise<ProcessDocumentResponse>;
    }

    async chat(
        messages: { role: string; content: string }[],
        options?: {
            documentId?: string;
            language?: string;
            provider?: string;
            model?: string;
        },
    ): Promise<ChatResponse> {
        const response = await fetch(`${this.baseUrl}/api/v1/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages,
                document_id: options?.documentId,
                language: options?.language || 'english',
                provider: options?.provider,
                model: options?.model,
            }),
        });

        if (!response.ok) {
            throw new HttpException(
                `LLM service error: ${response.statusText}`,
                HttpStatus.BAD_GATEWAY,
            );
        }

        return response.json() as Promise<ChatResponse>;
    }

    async getProviders(): Promise<{
        providers: string[];
        default_provider: string;
        default_model: string;
    }> {
        const response = await fetch(
            `${this.baseUrl}/api/v1/providers`,
        );
        return response.json();
    }
}
