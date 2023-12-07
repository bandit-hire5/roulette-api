import ICompany from "~src/interfaces/entity/company";
import ICronofy from "~src/interfaces/entity/cronofy";
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
  readonly pauseMe: boolean;
  readonly company: ICompany;
  readonly cronofy: ICronofy;
}

export type UserFull = IBase & User;

export interface UserFlat {
  readonly id: string;
  readonly email: string;
  readonly department: string;
  readonly locale: string;
  readonly timeZone: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly avatarImageUrl: string;
  readonly connectedWithCronofy: boolean;
  readonly pauseMe: boolean;
  readonly company: ICompany;
}

export enum UserSortFields {
  firstName = "User.firstName",
  lastName = "User.lastName",
  email = "User.email",
}

export interface UserListFilters {
  readonly query?: string;
  readonly userIds?: string[];
}
