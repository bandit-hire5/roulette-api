import { UserSortFields } from "~src/interfaces/entity/user";

export enum SortDirections {
  ASC = "ASC",
  DESC = "DESC",
}

export type SortFields = UserSortFields;

export interface Sort<TSortFields = SortFields> {
  readonly field: TSortFields;
  readonly direction: SortDirections;
}
