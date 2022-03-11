import { Pipeline } from './types';
import { Config } from '@backstage/config';
import { createApiRef } from '@backstage/core-plugin-api';

export const spinnakerApiRef = createApiRef<Spinnaker>({
  id: 'plugin.spinnaker.service',
});

type PipelinesFetchOpts = {
  limit?: number;
  query?: string;
  sort?: string;
  order?: string;
  applicationName: string;
}

export interface Spinnaker {
  getApplicationPipelines(opts?: PipelinesFetchOpts): Promise<Pipeline[]>;
}

interface PipelinesResponse {
  data: Pipeline[];
}

type Options = {
  spinnakerConfig: Config;
};

/**
 * API to talk to Spinnaker.
 */
export class SpinnakerApi implements Spinnaker {
  private readonly spinnakerConfig: Config;

  constructor(opts: Options) {
    this.spinnakerConfig = opts.spinnakerConfig;
    console.log(this.spinnakerConfig);
  }

  private async fetch<T = any>(input: string, init?: RequestInit): Promise<T> {
    const authedInit = await this.addAuthHeaders(init || {});

    const resp = await fetch(`${input}`, authedInit);
    if (!resp.ok) {
      throw new Error(`Request failed with ${resp.status} ${resp.statusText}`);
    }
    return await resp.json();
  }

  async getApplicationPipelines(opts: PipelinesFetchOpts): Promise<Pipeline[]> {
    const limit = opts?.limit || 50;
    console.log(this.spinnakerConfig);
    const response = await this.fetch<PipelinesResponse>(`/applications/${opts.applicationName}/pipelines?expand=true&limit=${limit}&statuses=RUNNING,SUSPENDED,PAUSED,NOT_STARTED`);
    return response.data;
  }

  private async addAuthHeaders(init: RequestInit): Promise<RequestInit> {
    const token = "";
    const headers = init.headers || {'Content-Type': 'application/json'};

    return {
      ...init,
      headers: {
        ...headers,
        ...(token ? { Authorization: `Basic ${token}` } : {}),
      }
    };
  }

}