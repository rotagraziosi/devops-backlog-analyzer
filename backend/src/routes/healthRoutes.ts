import { Router, Request, Response } from 'express';
import azureDevOpsClient from '../clients/azureDevOpsClient';
import ollamaClient from '../clients/ollamaClient';

const router = Router();

router.get('/health', async (req: Request, res: Response) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      api: 'ok',
      azureDevOps: 'unknown',
      ollama: 'unknown',
    },
  };

  try {
    await azureDevOpsClient.validateConfiguration();
    health.services.azureDevOps = 'ok';
  } catch (error) {
    health.services.azureDevOps = 'error';
    health.status = 'degraded';
  }

  try {
    await ollamaClient.healthCheck();
    health.services.ollama = 'ok';
  } catch (error) {
    health.services.ollama = 'error';
    health.status = 'degraded';
  }

  const statusCode = health.status === 'ok' ? 200 : 503;
  return res.status(statusCode).json(health);
});

export default router;
