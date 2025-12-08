# DevOps Agile Props Filling

A full-stack application that analyzes Azure DevOps backlog items against the Definition of Ready using Ollama for AI-powered analysis.

## Project Structure

This project is organized into two main parts:

```
devops-agile-props-filling/
├── backend/           # Node.js Express API with TypeScript
│   ├── src/
│   │   ├── clients/       # Azure DevOps & Ollama clients
│   │   ├── services/      # Business logic
│   │   ├── routes/        # API endpoints
│   │   ├── config/        # Configuration
│   │   └── types/         # TypeScript types
│   ├── package.json
│   └── README.md          # Backend documentation
├── frontend/          # Angular application (to be created)
└── README.md          # This file
```

## Features

- **Backend API** (Node.js + Express + TypeScript)
  - Fetch Azure DevOps work item details via REST API
  - Analyze backlog items against Definition of Ready criteria
  - Generate structured feedback using Ollama LLM
  - Provide actionable recommendations for improvement
  - Multi-language support (French and English)

- **Frontend** (Angular)
  - Simple interface to input work item ID
  - Display analysis results
  - (To be implemented)

## Definition of Ready

The application checks backlog items against these criteria:

1. **Clear and concise title**
2. **Exhaustive description** that describes the value of the development
3. **At least 2 acceptance criteria** that precisely cover the scope
4. **Story point estimation**

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- [Ollama](https://ollama.ai/) installed and running locally
- Azure DevOps account with Personal Access Token (PAT)
- Angular CLI (for frontend development)

## Quick Start

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
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

5. Start the backend:
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

### Frontend Setup

The frontend folder is ready for your Angular application. You can initialize it with:

```bash
cd frontend
ng new . --skip-git
```

Or create your Angular app structure as you prefer.

## Backend API Documentation

For detailed backend API documentation, see [backend/README.md](backend/README.md)

### Main Endpoints

- **GET/POST** `/api/analyze/:workItemId` - Analyze a work item
- **GET** `/api/health` - Check service status

Example request:
```bash
curl http://localhost:3000/api/analyze/12345
```

## Azure DevOps Setup

1. Generate a Personal Access Token (PAT):
   - Go to Azure DevOps → User Settings → Personal Access Tokens
   - Create new token with "Work Items (Read)" permission
   - Copy the token to your `.env` file in the backend folder

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

## Language Configuration

The application supports both French and English responses. Set the `LANGUAGE` environment variable in `backend/.env`:

- **French** (default): `LANGUAGE=fr`
- **English**: `LANGUAGE=en`

When set to French, the LLM will receive prompts in French and return analysis results in French.

## Development

### Backend Development

```bash
cd backend
npm run dev
```

### Frontend Development

After setting up your Angular app:

```bash
cd frontend
ng serve
```

Configure proxy to backend API by creating `frontend/proxy.conf.json`:
```json
{
  "/api": {
    "target": "http://localhost:3000",
    "secure": false
  }
}
```

Then update `angular.json` to use the proxy configuration.

## Configuration

All backend configuration is managed through environment variables in `backend/.env`:

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
- Check the base URL in `backend/.env`
- Ensure the model is pulled: `ollama pull llama2`

### Azure DevOps Authentication

- Verify PAT has correct permissions
- Check organization and project names
- Ensure PAT hasn't expired

## License

ISC
