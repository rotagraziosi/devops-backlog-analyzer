import { Router, Request, Response } from 'express';
import analysisService from '../services/analysisService';

const router = Router();

router.post('/analyze/:workItemId', async (req: Request, res: Response) => {
  try {
    const workItemId = parseInt(req.params.workItemId, 10);

    if (isNaN(workItemId)) {
      return res.status(400).json({
        error: 'Invalid work item ID. Must be a number.',
      });
    }

    const result = await analysisService.analyzeWorkItem(workItemId);

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    return res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
});

router.get('/analyze/:workItemId', async (req: Request, res: Response) => {
  try {
    const workItemId = parseInt(req.params.workItemId, 10);

    if (isNaN(workItemId)) {
      return res.status(400).json({
        error: 'Invalid work item ID. Must be a number.',
      });
    }

    const result = await analysisService.analyzeWorkItem(workItemId);

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    return res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
});

export default router;
