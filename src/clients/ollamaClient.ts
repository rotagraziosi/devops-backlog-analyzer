import axios, { AxiosInstance } from 'axios';
import config from '../config';
import { OllamaRequest, OllamaResponse } from '../types';

export class OllamaClient {
  private client: AxiosInstance;
  private model: string;

  constructor() {
    this.model = config.ollama.model;
    this.client = axios.create({
      baseURL: config.ollama.baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 120000, // 2 minutes timeout for LLM responses
    });
  }

  async generate(prompt: string): Promise<string> {
    try {
      const request: OllamaRequest = {
        model: this.model,
        prompt,
        stream: false,
      };

      const response = await this.client.post<OllamaResponse>(
        '/api/generate',
        request
      );

      return response.data.response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Failed to generate response from Ollama: ${error.response?.data?.error || error.message}`
        );
      }
      throw error;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.client.get('/api/tags');
      return true;
    } catch (error) {
      throw new Error('Ollama service is not available. Make sure Ollama is running.');
    }
  }

  getModel(): string {
    return this.model;
  }
}

export default new OllamaClient();
