export default interface CronofyClient {
  getToken(code: string): Promise<GetTokenResponse>;
}

export interface CronofyClientOptions {
  readonly clientId: string;
  readonly clientSecret: string;
  readonly dataCenter: string;
  readonly redirectURI: string;
}

export interface GetTokenResponse {
  readonly access_token: string;
  readonly refresh_token: string;
  readonly scope: string;
  readonly sub: string;
}
