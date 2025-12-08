import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  azureDevOps: {
    organization: string;
    project: string;
    pat: string;
  };
  ollama: {
    baseUrl: string;
    model: string;
  };
}

const config: Config = {
  port: parseInt(process.env.PORT || '3000', 10),
  azureDevOps: {
    organization: process.env.AZURE_DEVOPS_ORG || '',
    project: process.env.AZURE_DEVOPS_PROJECT || '',
    pat: process.env.AZURE_DEVOPS_PAT || '',
  },
  ollama: {
    baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
    model: process.env.OLLAMA_MODEL || 'llama2',
  },
};

export default config;
