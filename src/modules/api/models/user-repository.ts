import IUser, {
  UserFull as IUserFull,
  UserListFilters as IUserListFilters,
  UserSortFields,
} from "~src/interfaces/entity/user";
import { inject, injectable } from "inversify";
import { EntityManager, ObjectType, Repository, SelectQueryBuilder } from "typeorm";
import User from "~src/entities/user/user";
import IDENTIFIERS from "~src/di/identifiers";
import IUserRepository from "~api/interfaces/user-repository";
import AppError from "~src/models/error";
import { ERRORS } from "~src/interfaces/app/app";
import { assert } from "~src/utils/validate";
import { executeTransaction } from "~src/utils/transactions";
import IRequestContext from "~api/interfaces/request";
import { Sort as ISort, SortDirections } from "~src/interfaces/app/sort";
import { Pagination as IPagination } from "~src/interfaces/app/pagination";

@injectable()
export default class UserRepository implements IUserRepository {
  @inject(IDENTIFIERS.DB_DATA_REPOSITORY) getDbDataRepository: (entity: ObjectType<IUser>) => Repository<User>;

  protected get userDbRepository(): Repository<User> {
    return this.getDbDataRepository(User) as Repository<User>;
  }

  async get(id: string, companyId?: string): Promise<User> {
    const user = await this.userDbRepository.findOne({
      where: {
        id,
        company: {
          id: companyId,
        },
      },
      relations: {
        company: true,
      },
    });

    if (!user) {
      throw new AppError(ERRORS.NO_SUCH_ENTITY, "User doesn't exist");
    }

    return user;
  }

  async getByExternalId(externalId: string, companyId?: string): Promise<IUserFull> {
    const user = await this.userDbRepository.findOne({
      where: {
        externalId,
        company: {
          id: companyId,
        },
      },
      relations: {
        company: true,
      },
    });

    if (!user) {
      throw new AppError(ERRORS.NO_SUCH_ENTITY, "User doesn't exist");
    }

    return user;
  }

  async getByEmail(email: string, companyId?: string): Promise<IUserFull> {
    const user = await this.userDbRepository.findOne({
      where: {
        email,
        company: {
          id: companyId,
        },
      },
      relations: {
        company: true,
      },
    });

    if (!user) {
      throw new AppError(ERRORS.NO_SUCH_ENTITY, "User doesn't exist");
    }

    return user;
  }

  async create(data: Partial<IUser>): Promise<IUserFull> {
    const user = this.userDbRepository.create({
      ...data,
      id: undefined,
    });

    await assert(user);

    await executeTransaction(async (transactionManager: EntityManager): Promise<void> => {
      await transactionManager.save(User, user);
    });

    return user;
  }

  async update(id: string, data: Partial<Omit<IUser, "company">>): Promise<IUserFull> {
    const user = await this.get(id);

    if (!user) {
      throw new AppError(ERRORS.NO_SUCH_ENTITY, "User doesn't exist");
    }

    this.userDbRepository.merge(user, data);

    await assert(user);

    await executeTransaction(async (transactionManager: EntityManager): Promise<void> => {
      await transactionManager.save(User, user);
    });

    return user;
  }

  async remove(id: string): Promise<void> {
    await executeTransaction(async (transactionManager: EntityManager): Promise<void> => {
      await transactionManager.delete(User, id);
    });
  }

  async getList(
    context: IRequestContext,
    filters?: IUserListFilters,
    sort: ISort<UserSortFields> = {
      field: UserSortFields.firstName,
      direction: SortDirections.ASC,
    },
    pagination?: IPagination
  ): Promise<IUserFull[]> {
    const userBuilder = this.buildUserQueryByFilters(context, filters);

    userBuilder.orderBy(sort.field, sort.direction);

    if (pagination) {
      userBuilder.offset(0);
      userBuilder.limit(pagination.limit);
    }

    return userBuilder.getMany();
  }

  async getCount(context: IRequestContext, filters?: IUserListFilters): Promise<number> {
    const taskTemplateBuilder = this.buildUserQueryByFilters(context, filters);

    return taskTemplateBuilder.getCount();
  }

  private buildUserQueryByFilters(
    { company }: IRequestContext,
    filters: IUserListFilters = {}
  ): SelectQueryBuilder<User> {
    const userBuilder = this.userDbRepository
      .createQueryBuilder("User")
      .where("User.companyId = :companyId", { companyId: company.id });

    if (filters.query) {
      const query = filters.query.replace(/\s\s+/g, " ").trim();
      const words = query.split(" ");

      if (words.length > 1) {
        userBuilder.andWhere("(User.firstName LIKE :firstName AND User.lastName LIKE :lastName)", {
          firstName: `%${words[0]}%`,
          lastName: `%${words[1]}%`,
        });
      } else {
        userBuilder.andWhere("(User.firstName LIKE :query OR User.lastName LIKE :query OR User.email LIKE :query)", {
          query: `%${query}%`,
        });
      }
    }

    if (filters.userIds?.length) {
      userBuilder.andWhere("User.id IN (:...userIds)", {
        userIds: filters.userIds,
      });
    }

    return userBuilder;
  }
}
