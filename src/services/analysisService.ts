import azureDevOpsClient from '../clients/azureDevOpsClient';
import ollamaClient from '../clients/ollamaClient';
import promptService from './promptService';
import { AnalysisResult, WorkItem } from '../types';

export class AnalysisService {
  async analyzeWorkItem(workItemId: number): Promise<AnalysisResult> {
    // Fetch work item from Azure DevOps
    const workItem = await azureDevOpsClient.getWorkItem(workItemId);

    // Generate analysis prompt
    const prompt = promptService.generateAnalysisPrompt(workItem);

    // Get LLM response
    const llmResponse = await ollamaClient.generate(prompt);

    // Process and structure the response
    const analysisResult = this.processLlmResponse(workItemId, llmResponse);

    return analysisResult;
  }

  private processLlmResponse(workItemId: number, llmResponse: string): AnalysisResult {
    try {
      // Try to extract JSON from the response
      const jsonMatch = llmResponse.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        throw new Error('No JSON found in LLM response');
      }

      const parsedResponse = JSON.parse(jsonMatch[0]);

      // Build the analysis result
      const analysisResult: AnalysisResult = {
        workItemId,
        isReady: parsedResponse.isReady || false,
        missingElements: parsedResponse.missingElements || [],
        definitionOfReady: {
          title: {
            exists: parsedResponse.title?.exists || false,
            isClear: parsedResponse.title?.isClear || false,
            feedback: parsedResponse.title?.feedback,
          },
          description: {
            exists: parsedResponse.description?.exists || false,
            isExhaustive: parsedResponse.description?.isExhaustive || false,
            describesValue: parsedResponse.description?.describesValue || false,
            feedback: parsedResponse.description?.feedback,
          },
          acceptanceCriteria: {
            exists: parsedResponse.acceptanceCriteria?.exists || false,
            count: parsedResponse.acceptanceCriteria?.count || 0,
            arePrecise: parsedResponse.acceptanceCriteria?.arePrecise || false,
            coverScope: parsedResponse.acceptanceCriteria?.coverScope || false,
            feedback: parsedResponse.acceptanceCriteria?.feedback,
          },
          estimation: {
            exists: parsedResponse.estimation?.exists || false,
            feedback: parsedResponse.estimation?.feedback,
          },
        },
        recommendations: parsedResponse.recommendations || [],
        rawLlmResponse: llmResponse,
      };

      return analysisResult;
    } catch (error) {
      // Fallback: return a structured error response
      return {
        workItemId,
        isReady: false,
        missingElements: ['Unable to parse LLM response'],
        definitionOfReady: {
          title: { exists: false, isClear: false, feedback: 'Analysis failed' },
          description: { exists: false, isExhaustive: false, describesValue: false, feedback: 'Analysis failed' },
          acceptanceCriteria: { exists: false, count: 0, arePrecise: false, coverScope: false, feedback: 'Analysis failed' },
          estimation: { exists: false, feedback: 'Analysis failed' },
        },
        recommendations: ['Please try again or check the LLM response format'],
        rawLlmResponse: llmResponse,
      };
    }
  }
}

export default new AnalysisService();
