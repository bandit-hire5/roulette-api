import ICompany from "~src/interfaces/entity/company";
import IBase from "~src/interfaces/app/base";

export default interface User {
  readonly externalId: string;
  readonly email: string;
  readonly department: string;
  readonly locale: string;
  readonly timeZone: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly avatarImageUrl: string;
  readonly company: ICompany;
}

export type UserFull = IBase & User;

export enum UserSortFields {
  firstName = "User.firstName",
  lastName = "User.lastName",
  email = "User.email",
}

export interface UserListFilters {
  readonly query?: string;
  readonly userIds?: string[];
}
