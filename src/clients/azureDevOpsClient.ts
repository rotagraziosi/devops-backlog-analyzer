import axios, { AxiosInstance } from 'axios';
import config from '../config';
import { WorkItem } from '../types';

export class AzureDevOpsClient {
  private client: AxiosInstance;
  private organization: string;
  private project: string;

  constructor() {
    this.organization = config.azureDevOps.organization;
    this.project = config.azureDevOps.project;

    const auth = Buffer.from(`:${config.azureDevOps.pat}`).toString('base64');

    this.client = axios.create({
      baseURL: `https://dev.azure.com/${this.organization}`,
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async getWorkItem(id: number): Promise<WorkItem> {
    try {
      const response = await this.client.get(
        `/${this.project}/_apis/wit/workitems/${id}`,
        {
          params: {
            'api-version': '7.0',
          },
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Failed to fetch work item ${id}: ${error.response?.data?.message || error.message}`
        );
      }
      throw error;
    }
  }

  async validateConfiguration(): Promise<boolean> {
    if (!this.organization || !this.project || !config.azureDevOps.pat) {
      throw new Error('Azure DevOps configuration is incomplete. Check environment variables.');
    }
    return true;
  }
}

export default new AzureDevOpsClient();
