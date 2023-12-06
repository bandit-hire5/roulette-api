export interface UserResponse {
  readonly avatarImageUrl: string;
  readonly cmId: number;
  readonly firstname: string;
  readonly lastname: string;
  readonly email: string;
  readonly companyId: string;
  readonly locale: string;
}

export interface OAuthTokenResponse {
  readonly access_token: string;
  readonly expires_in: number;
}

export interface CompanyInfoResponse {
  readonly allowedEmailDomains: string[];
  readonly company: CompanyInfoCompany;
}

export interface CompanyInfoCompany {
  readonly companyName: string;
  readonly companyId: string;
}
