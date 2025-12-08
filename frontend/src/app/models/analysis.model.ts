export interface DefinitionOfReadyItem {
  exists: boolean;
  isClear?: boolean;
  isExhaustive?: boolean;
  describesValue?: boolean;
  arePrecise?: boolean;
  coverScope?: boolean;
  count?: number;
  feedback?: string;
}

export interface DefinitionOfReady {
  title: DefinitionOfReadyItem;
  description: DefinitionOfReadyItem;
  acceptanceCriteria: DefinitionOfReadyItem;
  estimation: DefinitionOfReadyItem;
}

export interface AnalysisResult {
  workItemId: number;
  isReady: boolean;
  missingElements: string[];
  definitionOfReady: DefinitionOfReady;
  recommendations: string[];
  rawLlmResponse?: string;
}

export interface ApiResponse {
  success: boolean;
  data?: AnalysisResult;
  error?: string;
}
