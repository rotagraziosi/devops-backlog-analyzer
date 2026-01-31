import { WorkItem, WorkItemComment } from '../types';
import config from '../config';

export class PromptService {
  generateAnalysisPrompt(workItem: WorkItem): string {
    const language = config.language;

    if (language === 'fr') {
      return this.generateFrenchPrompt(workItem);
    }

    return this.generateEnglishPrompt(workItem);
  }

  private generateEnglishPrompt(workItem: WorkItem): string {
    const title = workItem.fields['System.Title'] || 'No title';
    const description = workItem.fields['System.Description'] || 'No description';
    const acceptanceCriteria = workItem.fields['Microsoft.VSTS.Common.AcceptanceCriteria'] || 'No acceptance criteria';
    const storyPoints = workItem.fields['Custom.Estimation'];

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

  private generateFrenchPrompt(workItem: WorkItem): string {
    const title = workItem.fields['System.Title'] || 'Pas de titre';
    const description = workItem.fields['System.Description'] || 'Pas de description';
    const acceptanceCriteria = workItem.fields['Microsoft.VSTS.Common.AcceptanceCriteria'] || 'Pas de critères d\'acceptation';
    const storyPoints = workItem.fields['Custom.Estimation'];

    const prompt = `Vous êtes un expert coach Agile analysant les éléments de backlog Azure DevOps pour leur "Définition de Prêt" (Definition of Ready).

Un élément de backlog est considéré comme "Prêt pour le Développement" lorsqu'il remplit TOUS ces critères :

1. **Titre** : Un titre clair et concis
2. **Description** : Une description exhaustive et claire qui décrit la valeur du développement
3. **Critères d'Acceptation** : Au moins 2 critères d'acceptation qui couvrent précisément le périmètre du développement
4. **Estimation** : Une estimation en story points

Veuillez analyser l'élément de backlog suivant :

**ID de l'élément** : ${workItem.id}
**Titre** : ${title}
**Description** : ${this.stripHtml(description)}
**Critères d'Acceptation** : ${this.stripHtml(acceptanceCriteria)}
**Story Points** : ${storyPoints !== undefined ? storyPoints : 'Non défini'}

Fournissez votre analyse au format JSON suivant (répondez UNIQUEMENT avec du JSON valide, aucun texte supplémentaire) :

{
  "title": {
    "exists": true/false,
    "isClear": true/false,
    "feedback": "commentaire spécifique sur le titre"
  },
  "description": {
    "exists": true/false,
    "isExhaustive": true/false,
    "describesValue": true/false,
    "feedback": "commentaire spécifique sur la description"
  },
  "acceptanceCriteria": {
    "exists": true/false,
    "count": nombre,
    "arePrecise": true/false,
    "coverScope": true/false,
    "feedback": "commentaire spécifique sur les critères d'acceptation"
  },
  "estimation": {
    "exists": true/false,
    "feedback": "commentaire spécifique sur l'estimation"
  },
  "isReady": true/false,
  "missingElements": ["liste des éléments manquants ou inadéquats"],
  "recommendations": ["liste des recommandations spécifiques pour rendre cet élément prêt"]
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

  generateAcceptanceCriteriaPrompt(workItem: WorkItem, comments: WorkItemComment[]): string {
    const language = config.language;

    if (language === 'fr') {
      return this.generateFrenchAcceptanceCriteriaPrompt(workItem, comments);
    }

    return this.generateEnglishAcceptanceCriteriaPrompt(workItem, comments);
  }

  private generateEnglishAcceptanceCriteriaPrompt(workItem: WorkItem, comments: WorkItemComment[]): string {
    const title = workItem.fields['System.Title'] || 'No title';
    const description = workItem.fields['System.Description'] || 'No description';
    const existingAC = workItem.fields['Microsoft.VSTS.Common.AcceptanceCriteria'] || '';
    const strippedAC = this.stripHtml(existingAC);

    const commentsText = comments.length > 0
      ? comments.map(c => `- ${c.createdBy.displayName}: ${this.stripHtml(c.text)}`).join('\n')
      : 'No comments';

    // Determine mode based on existing AC count
    const acLines = strippedAC.split(/[\n\r]+/).filter(line => line.trim().length > 0);
    const existingCount = acLines.length;

    let modeInstruction: string;
    if (existingCount === 0) {
      modeInstruction = 'No acceptance criteria exist. Generate 3-5 new acceptance criteria.';
    } else if (existingCount <= 2) {
      modeInstruction = `Only ${existingCount} acceptance criteria exist. Generate 2-3 additional criteria to complement the existing ones.`;
    } else {
      modeInstruction = `${existingCount} acceptance criteria already exist. Suggest improvements or refinements to the existing criteria.`;
    }

    const prompt = `You are an expert Agile coach specializing in writing clear, testable acceptance criteria for user stories.

**Task**: ${modeInstruction}

Analyze the following backlog item and generate acceptance criteria:

**Work Item ID**: ${workItem.id}
**Title**: ${title}
**Description**: ${this.stripHtml(description)}
**Existing Acceptance Criteria**: ${strippedAC || 'None'}
**Comments/Discussion**:
${commentsText}

Guidelines for acceptance criteria:
- Each criterion should be specific and testable
- Use the Given/When/Then format when appropriate
- Focus on user-visible behavior and outcomes
- Cover edge cases and error scenarios
- Be concise but complete

Provide your response in the following JSON format (respond ONLY with valid JSON, no additional text):

{
  "existingAcceptanceCriteria": ["list of existing AC, empty array if none"],
  "generatedAcceptanceCriteria": ["list of generated AC"],
  "mode": "new|augment|improve",
  "reasoning": "Brief explanation of why these criteria were generated"
}`;

    return prompt;
  }

  private generateFrenchAcceptanceCriteriaPrompt(workItem: WorkItem, comments: WorkItemComment[]): string {
    const title = workItem.fields['System.Title'] || 'Pas de titre';
    const description = workItem.fields['System.Description'] || 'Pas de description';
    const existingAC = workItem.fields['Microsoft.VSTS.Common.AcceptanceCriteria'] || '';
    const strippedAC = this.stripHtml(existingAC);

    const commentsText = comments.length > 0
      ? comments.map(c => `- ${c.createdBy.displayName}: ${this.stripHtml(c.text)}`).join('\n')
      : 'Aucun commentaire';

    // Determine mode based on existing AC count
    const acLines = strippedAC.split(/[\n\r]+/).filter(line => line.trim().length > 0);
    const existingCount = acLines.length;

    let modeInstruction: string;
    if (existingCount === 0) {
      modeInstruction = 'Aucun critère d\'acceptation n\'existe. Générez 3-5 nouveaux critères d\'acceptation.';
    } else if (existingCount <= 2) {
      modeInstruction = `Seulement ${existingCount} critère(s) d'acceptation existe(nt). Générez 2-3 critères supplémentaires pour compléter les existants.`;
    } else {
      modeInstruction = `${existingCount} critères d'acceptation existent déjà. Suggérez des améliorations ou des raffinements aux critères existants.`;
    }

    const prompt = `Vous êtes un expert coach Agile spécialisé dans la rédaction de critères d'acceptation clairs et testables pour les user stories.

**Tâche**: ${modeInstruction}

Analysez l'élément de backlog suivant et générez des critères d'acceptation :

**ID de l'élément**: ${workItem.id}
**Titre**: ${title}
**Description**: ${this.stripHtml(description)}
**Critères d'acceptation existants**: ${strippedAC || 'Aucun'}
**Commentaires/Discussion**:
${commentsText}

Lignes directrices pour les critères d'acceptation :
- Chaque critère doit être spécifique et testable
- Utilisez le format Étant donné/Quand/Alors lorsque c'est approprié
- Concentrez-vous sur le comportement visible par l'utilisateur et les résultats
- Couvrez les cas limites et les scénarios d'erreur
- Soyez concis mais complet

Fournissez votre réponse au format JSON suivant (répondez UNIQUEMENT avec du JSON valide, aucun texte supplémentaire) :

{
  "existingAcceptanceCriteria": ["liste des CA existants, tableau vide si aucun"],
  "generatedAcceptanceCriteria": ["liste des CA générés"],
  "mode": "new|augment|improve",
  "reasoning": "Brève explication de pourquoi ces critères ont été générés"
}`;

    return prompt;
  }
}

export default new PromptService();
