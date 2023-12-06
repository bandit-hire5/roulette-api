import { injectable } from "inversify";
import fetch from "node-fetch";
import IIDPClient from "~api/interfaces/providers/idp";
import {
  UserResponse as IUserResponse,
  OAuthTokenResponse as IOAuthTokenResponse,
  CompanyInfoResponse as ICompanyInfoResponse,
} from "~api/providers/idp/interfaces";
import { SG_SSO_API_LINK, SG_IDP_API_LINK, SG_OAUTH2_CLIENT_ID, SG_OAUTH2_CLIENT_SECRET } from "~src/constants";
import { convertResponse } from "~api/providers/idp/validate";
import { getCurrentUnixTimestamp, isTimestampExpired } from "~src/utils/date";
import { SSO_AUDIENCE } from "~api/constants";

@injectable()
export default class IDPClient implements IIDPClient {
  private token: string;
  private expire: number;

  async appToken(): Promise<string> {
    if (this.token && !isTimestampExpired(this.expire)) {
      return this.token;
    }

    const response = await fetch(this.getSSOApiURL(`oauth2/token`), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "post",
      body: `client_id=${SG_OAUTH2_CLIENT_ID}&client_secret=${SG_OAUTH2_CLIENT_SECRET}&grant_type=client_credentials&scope=server2server&audience=${SSO_AUDIENCE}`,
    });

    const data = convertResponse<IOAuthTokenResponse>(await response.json());

    this.token = data.access_token;
    this.expire = getCurrentUnixTimestamp() + data.expires_in - 10;

    return this.token;
  }

  async me(token: string): Promise<IUserResponse> {
    const response = await fetch(this.getIDPApiURL(`users/me`), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "get",
    });

    return convertResponse<IUserResponse>(await response.json());
  }

  async companyInfo(companyId: string): Promise<ICompanyInfoResponse> {
    const response = await fetch(this.getIDPApiURL(`server2server/companies/info?companyId=${companyId}`), {
      headers: {
        Authorization: `Bearer ${await this.appToken()}`,
        "Content-Type": "application/json",
      },
      method: "get",
    });

    return convertResponse<ICompanyInfoResponse>(await response.json());
  }

  private getSSOApiURL(url: string): string {
    return `${SG_SSO_API_LINK}/${url}`;
  }

  private getIDPApiURL(url: string): string {
    return `${SG_IDP_API_LINK}/idp/${url}`;
  }
}
