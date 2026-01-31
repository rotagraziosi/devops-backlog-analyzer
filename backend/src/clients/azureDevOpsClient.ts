import axios, { AxiosInstance } from 'axios';
import config from '../config';
import { WorkItem, WorkItemCommentsResponse } from '../types';

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
    const url = `/${this.project}/_apis/wit/workitems/${id}`;
    try {
      const response = await this.client.get(
        url,
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

  async getWorkItemComments(id: number): Promise<WorkItemCommentsResponse> {
    const url = `/${this.project}/_apis/wit/workitems/${id}/comments`;
    try {
      const response = await this.client.get(
        url,
        {
          params: {
            'api-version': '7.1-preview.4',
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Failed to fetch comments for work item ${id}: ${error.response?.data?.message || error.message}`
        );
      }
      throw error;
    }
  }
}

export default new AzureDevOpsClient();
