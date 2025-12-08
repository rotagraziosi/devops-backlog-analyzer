# DevOps Agile Props Filling

A Node.js REST API that analyzes Azure DevOps backlog items against the Definition of Ready using Ollama for AI-powered analysis.

## Features

- Fetch Azure DevOps work item details via REST API
- Analyze backlog items against Definition of Ready criteria
- Generate structured feedback using Ollama LLM
- Provide actionable recommendations for improvement
- RESTful API endpoints for easy integration
- Multi-language support (French and English)

## Definition of Ready

The application checks backlog items against these criteria:

1. **Clear and concise title**
2. **Exhaustive description** that describes the value of the development
3. **At least 2 acceptance criteria** that precisely cover the scope
4. **Story point estimation**

## Architecture

The application follows a layered architecture:

```
src/
├── clients/           # External service clients
│   ├── azureDevOpsClient.ts   # Azure DevOps API integration
│   └── ollamaClient.ts        # Ollama LLM integration
├── services/          # Business logic layer
│   ├── analysisService.ts     # Main analysis orchestration
│   └── promptService.ts       # LLM prompt generation
├── routes/            # API endpoints
│   ├── analysisRoutes.ts      # Work item analysis endpoints
│   └── healthRoutes.ts        # Health check endpoints
├── config/            # Configuration management
├── types/             # TypeScript type definitions
├── app.ts             # Express application setup
└── index.ts           # Application entry point
```

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- [Ollama](https://ollama.ai/) installed and running locally
- Azure DevOps account with Personal Access Token (PAT)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd devops-agile-props-filling
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```env
PORT=3000

# Language Configuration (fr for French, en for English)
LANGUAGE=fr

# Azure DevOps Configuration
AZURE_DEVOPS_ORG=your-organization
AZURE_DEVOPS_PROJECT=your-project
AZURE_DEVOPS_PAT=your-personal-access-token

# Ollama Configuration
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama2
```

## Azure DevOps Setup

1. Generate a Personal Access Token (PAT):
   - Go to Azure DevOps → User Settings → Personal Access Tokens
   - Create new token with "Work Items (Read)" permission
   - Copy the token to your `.env` file

2. Set your organization and project names in `.env`

## Ollama Setup

1. Install Ollama from [ollama.ai](https://ollama.ai/)

2. Pull a model (e.g., llama2):
```bash
ollama pull llama2
```

3. Verify Ollama is running:
```bash
ollama list
```

4. Update `OLLAMA_MODEL` in `.env` with your preferred model

## Language Configuration

The application supports both French and English responses. Set the `LANGUAGE` environment variable:

- **French** (default): `LANGUAGE=fr`
- **English**: `LANGUAGE=en`

When set to French, the LLM will receive prompts in French and return analysis results in French. The JSON structure remains the same, but all feedback and recommendations will be in the configured language.

## Usage

### Development Mode

Run with hot-reload:
```bash
npm run dev
```

### Production Mode

Build and run:
```bash
npm run build
npm start
```

## API Endpoints

### Analyze Work Item

Analyze a work item against Definition of Ready:

**GET/POST** `/api/analyze/:workItemId`

Example:
```bash
curl http://localhost:3000/api/analyze/12345
```

Response:
```json
{
  "success": true,
  "data": {
    "workItemId": 12345,
    "isReady": false,
    "missingElements": [
      "Acceptance criteria count is below minimum",
      "Story points not set"
    ],
    "definitionOfReady": {
      "title": {
        "exists": true,
        "isClear": true,
        "feedback": "Title is clear and concise"
      },
      "description": {
        "exists": true,
        "isExhaustive": true,
        "describesValue": true,
        "feedback": "Description clearly describes the value"
      },
      "acceptanceCriteria": {
        "exists": true,
        "count": 1,
        "arePrecise": false,
        "coverScope": false,
        "feedback": "Only 1 acceptance criteria found, need at least 2"
      },
      "estimation": {
        "exists": false,
        "feedback": "Story points not set"
      }
    },
    "recommendations": [
      "Add at least one more acceptance criteria",
      "Set story points estimation"
    ]
  }
}
```

### Health Check

Check service status:

**GET** `/api/health`

Example:
```bash
curl http://localhost:3000/api/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2025-12-08T10:30:00.000Z",
  "services": {
    "api": "ok",
    "azureDevOps": "ok",
    "ollama": "ok"
  }
}
```

### Root

Get API information:

**GET** `/`

## Project Structure

```
devops-agile-props-filling/
├── src/
│   ├── clients/
│   │   ├── azureDevOpsClient.ts
│   │   └── ollamaClient.ts
│   ├── services/
│   │   ├── analysisService.ts
│   │   └── promptService.ts
│   ├── routes/
│   │   ├── analysisRoutes.ts
│   │   └── healthRoutes.ts
│   ├── config/
│   │   └── index.ts
│   ├── types/
│   │   └── index.ts
│   ├── app.ts
│   └── index.ts
├── dist/              # Compiled JavaScript (generated)
├── .env               # Environment variables (create from .env.example)
├── .env.example       # Environment variables template
├── package.json
├── tsconfig.json
└── README.md
```

## Development

### Build TypeScript

```bash
npm run build
```

### Lint Code

```bash
npm run lint
```

## Error Handling

The API provides structured error responses:

```json
{
  "success": false,
  "error": "Error message here"
}
```

Common error scenarios:
- Invalid work item ID (400)
- Work item not found (500)
- Azure DevOps authentication failure (500)
- Ollama service unavailable (500)

## Configuration

All configuration is managed through environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | API server port | 3000 |
| `LANGUAGE` | Response language (fr or en) | fr |
| `AZURE_DEVOPS_ORG` | Azure DevOps organization name | - |
| `AZURE_DEVOPS_PROJECT` | Azure DevOps project name | - |
| `AZURE_DEVOPS_PAT` | Personal Access Token | - |
| `OLLAMA_BASE_URL` | Ollama service URL | http://localhost:11434 |
| `OLLAMA_MODEL` | Ollama model to use | llama2 |

## Troubleshooting

### Ollama Connection Issues

- Verify Ollama is running: `ollama list`
- Check the base URL in `.env`
- Ensure the model is pulled: `ollama pull llama2`

### Azure DevOps Authentication

- Verify PAT has correct permissions
- Check organization and project names
- Ensure PAT hasn't expired

### TypeScript Compilation

- Clear dist folder and rebuild: `rm -rf dist && npm run build`
- Check `tsconfig.json` configuration

## License

ISC
