import { Pipeline } from './types';
import { Config } from '@backstage/config';
import { createApiRef } from '@backstage/core-plugin-api';
import ClientOAuth2  from 'client-oauth2';

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
    const authedInit = await this.addAuthHeaders(input, init || {});

    const resp = await fetch(`${input}`, authedInit);
    if (!resp.ok) {
      throw new Error(`Request failed with ${resp.status} ${resp.statusText}`);
    }
    console.log(resp.json());
    return await resp.json();
  }

  async getApplicationPipelines(opts: PipelinesFetchOpts): Promise<Pipeline[]> {
    const limit = opts?.limit || 50;
    const response = await this.fetch<PipelinesResponse>(`/applications/${opts.applicationName}/pipelines?expand=true&limit=${limit}&statuses=RUNNING,SUSPENDED,PAUSED,NOT_STARTED`);
    return response.data;
  }

  private async addAuthHeaders(url: string, init: RequestInit): Promise<RequestInit> {
    const spin = new ClientOAuth2({
      clientId: this.spinnakerConfig.getString("auth.clientId"),
      clientSecret: this.spinnakerConfig.getString("auth.clientSecret"),
      accessTokenUri: this.spinnakerConfig.getString("auth.tokenUrl"),
      authorizationUri: this.spinnakerConfig.getString("auth.authUrl"),
      scopes: this.spinnakerConfig.getStringArray("auth.scopes"),
    });
    console.log(spin);
    const token = spin.code.getToken(url);
    const headers = init.headers || {'Content-Type': 'application/json'};

    return {
      ...init,
      headers: {
        ...headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      }
    };
  }

}