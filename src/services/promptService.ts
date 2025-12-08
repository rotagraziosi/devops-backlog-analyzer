import { WorkItem } from '../types';

export class PromptService {
  generateAnalysisPrompt(workItem: WorkItem): string {
    const title = workItem.fields['System.Title'] || 'No title';
    const description = workItem.fields['System.Description'] || 'No description';
    const acceptanceCriteria = workItem.fields['Microsoft.VSTS.Common.AcceptanceCriteria'] || 'No acceptance criteria';
    const storyPoints = workItem.fields['Microsoft.VSTS.Scheduling.StoryPoints'];

    const prompt = `You are an expert Agile coach analyzing Azure DevOps backlog items for their "Definition of Ready".

A backlog item is considered "Ready for Dev" when it meets ALL these criteria:

1. **Title**: A clear and concise title
2. **Description**: An exhaustive and clear description that describes the value of the development
3. **Acceptance Criteria**: At least 2 acceptance criteria that precisely cover the scope of the development
4. **Estimation**: An estimation in story points

Please analyze the following backlog item:

**Work Item ID**: ${workItem.id}
**Title**: ${title}
**Description**: ${this.stripHtml(description)}
**Acceptance Criteria**: ${this.stripHtml(acceptanceCriteria)}
**Story Points**: ${storyPoints !== undefined ? storyPoints : 'Not set'}

Provide your analysis in the following JSON format (respond ONLY with valid JSON, no additional text):

{
  "title": {
    "exists": true/false,
    "isClear": true/false,
    "feedback": "specific feedback about the title"
  },
  "description": {
    "exists": true/false,
    "isExhaustive": true/false,
    "describesValue": true/false,
    "feedback": "specific feedback about the description"
  },
  "acceptanceCriteria": {
    "exists": true/false,
    "count": number,
    "arePrecise": true/false,
    "coverScope": true/false,
    "feedback": "specific feedback about acceptance criteria"
  },
  "estimation": {
    "exists": true/false,
    "feedback": "specific feedback about the estimation"
  },
  "isReady": true/false,
  "missingElements": ["list of missing or inadequate elements"],
  "recommendations": ["list of specific recommendations to make this item ready"]
}`;

    return prompt;
  }

  private stripHtml(html: string): string {
    if (!html) return '';
    return html
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/\s+/g, ' ')
      .trim();
  }
}

export default new PromptService();
