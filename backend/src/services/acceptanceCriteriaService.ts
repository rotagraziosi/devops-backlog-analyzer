import azureDevOpsClient from '../clients/azureDevOpsClient';
import ollamaClient from '../clients/ollamaClient';
import promptService from './promptService';
import { AcceptanceCriteriaResult } from '../types';

export class AcceptanceCriteriaService {
  async generateAcceptanceCriteria(workItemId: number): Promise<AcceptanceCriteriaResult> {
    // Fetch work item from Azure DevOps
    const workItem = await azureDevOpsClient.getWorkItem(workItemId);

    // Fetch work item comments
    let comments: { id: number; text: string; createdBy: { displayName: string }; createdDate: string }[] = [];
    try {
      const commentsResponse = await azureDevOpsClient.getWorkItemComments(workItemId);
      comments = commentsResponse.comments || [];
    } catch (error) {
      // Comments are optional, continue without them
      console.warn(`Could not fetch comments for work item ${workItemId}:`, error);
    }

    // Generate prompt for acceptance criteria
    const prompt = promptService.generateAcceptanceCriteriaPrompt(workItem, comments);

    // Get LLM response
    const llmResponse = await ollamaClient.generate(prompt);

    // Process and structure the response
    const result = this.processLlmResponse(workItemId, workItem.fields['System.Title'], llmResponse);

    return result;
  }

  private processLlmResponse(workItemId: number, title: string, llmResponse: string): AcceptanceCriteriaResult {
    try {
      // Try to extract JSON from the response
      const jsonMatch = llmResponse.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        throw new Error('No JSON found in LLM response');
      }

      const parsedResponse = JSON.parse(jsonMatch[0]);

      // Build the result
      const result: AcceptanceCriteriaResult = {
        workItemId,
        title: title || 'Unknown',
        existingAcceptanceCriteria: parsedResponse.existingAcceptanceCriteria || [],
        generatedAcceptanceCriteria: parsedResponse.generatedAcceptanceCriteria || [],
        mode: parsedResponse.mode || 'new',
        reasoning: parsedResponse.reasoning || '',
      };

      return result;
    } catch (error) {
      // Fallback: return a structured error response
      return {
        workItemId,
        title: title || 'Unknown',
        existingAcceptanceCriteria: [],
        generatedAcceptanceCriteria: ['Unable to generate acceptance criteria. Please try again.'],
        mode: 'new',
        reasoning: 'Failed to parse LLM response',
      };
    }
  }
}

export default new AcceptanceCriteriaService();
