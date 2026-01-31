import { Router, Request, Response } from 'express';
import acceptanceCriteriaService from '../services/acceptanceCriteriaService';

const router = Router();

router.get('/generate-ac/:workItemId', async (req: Request, res: Response) => {
  try {
    const workItemId = parseInt(req.params.workItemId, 10);

    if (isNaN(workItemId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid work item ID. Must be a number.',
      });
    }

    const result = await acceptanceCriteriaService.generateAcceptanceCriteria(workItemId);

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
