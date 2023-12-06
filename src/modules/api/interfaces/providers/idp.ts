import {
  UserResponse as IUserResponse,
  CompanyInfoResponse as ICompanyInfoResponse,
} from "~api/providers/idp/interfaces";

export interface UserFilters {
  readonly searchString?: string;
  readonly userIds?: string[];
  readonly companyIds?: string[];
  readonly internalUserIds?: string[];
}

export enum UserSortFields {
  FIRSTNAME_ASC = "FIRSTNAME_ASC",
  FIRSTNAME_DESC = "FIRSTNAME_DESC",
  LASTNAME_ASC = "LASTNAME_ASC",
  LASTNAME_DESC = "LASTNAME_DESC",
  EMAIL_ASC = "EMAIL_ASC",
  EMAIL_DESC = "EMAIL_DESC",
  CM_ID_ASC = "CM_ID_ASC",
  CM_ID_DESC = "CM_ID_DESC",
}

export default interface IDPClient {
  appToken(): Promise<string>;
  me(token: string): Promise<IUserResponse>;
  companyInfo(companyId: string): Promise<ICompanyInfoResponse>;
}
