export interface AcceptanceCriteriaResult {
  workItemId: number;
  title: string;
  existingAcceptanceCriteria: string[];
  generatedAcceptanceCriteria: string[];
  mode: 'new' | 'augment' | 'improve';
  reasoning: string;
}

export interface AcceptanceCriteriaApiResponse {
  success: boolean;
  data?: AcceptanceCriteriaResult;
  error?: string;
}
