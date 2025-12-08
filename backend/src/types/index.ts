export interface WorkItem {
  id: number;
  fields: {
    'System.Title': string;
    'System.Description'?: string;
    'Microsoft.VSTS.Common.AcceptanceCriteria'?: string;
    'Microsoft.VSTS.Scheduling.StoryPoints'?: number;
    'System.WorkItemType': string;
    'System.State': string;
  };
}

export interface DefinitionOfReady {
  title: {
    exists: boolean;
    isClear: boolean;
    feedback?: string;
  };
  description: {
    exists: boolean;
    isExhaustive: boolean;
    describesValue: boolean;
    feedback?: string;
  };
  acceptanceCriteria: {
    exists: boolean;
    count: number;
    arePrecise: boolean;
    coverScope: boolean;
    feedback?: string;
  };
  estimation: {
    exists: boolean;
    feedback?: string;
  };
}

export interface AnalysisResult {
  workItemId: number;
  isReady: boolean;
  missingElements: string[];
  definitionOfReady: DefinitionOfReady;
  recommendations: string[];
  rawLlmResponse?: string;
}

export interface OllamaRequest {
  model: string;
  prompt: string;
  stream: boolean;
}

export interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}
