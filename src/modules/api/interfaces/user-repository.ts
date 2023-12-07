import IUser, {
  UserFull as IUserFull,
  UserSortFields,
  UserListFilters as IUserListFilters,
} from "~src/interfaces/entity/user";
import ICronofy from "~src/interfaces/entity/cronofy";
import IRequestContext from "~api/interfaces/request";
import { Sort as ISort } from "~src/interfaces/app/sort";
import { Pagination as IPagination } from "~src/interfaces/app/pagination";
import User from "~src/entities/user/user";

export default interface UserRepository {
  get(id: string, companyId?: string): Promise<User>;

  getByExternalId(id: string, companyId?: string): Promise<IUserFull>;

  getByEmail(email: string, companyId?: string): Promise<IUserFull>;

  create(data: Partial<IUser>): Promise<IUserFull>;

  update(id: string, data: Partial<Omit<IUser, "externalId" | "company">>): Promise<IUserFull>;

  connectWithCronofy(id: string, data: ICronofy): Promise<IUserFull>;

  disconnectFromCronofy(id: string): Promise<IUserFull>;

  setPause(id: string, value: boolean): Promise<IUserFull>;

  remove(id: string): Promise<void>;

  getList(
    context: IRequestContext,
    filters?: IUserListFilters,
    sort?: ISort<UserSortFields>,
    pagination?: IPagination
  ): Promise<IUserFull[]>;

  getCount(context: IRequestContext, filters?: IUserListFilters): Promise<number>;

  getRandomEventParticipants(context: IRequestContext): Promise<IUserFull[]>;
}
