import { UserFull as IUserFull } from "~src/interfaces/entity/user";
import ICompany from "~src/interfaces/entity/company";

export default interface RequestContext {
  token?: string;
  user?: IUserFull;
  company?: ICompany;
  systemUser?: boolean;
  dangerouslyIgnorePermissionsCheck?: boolean;
}
