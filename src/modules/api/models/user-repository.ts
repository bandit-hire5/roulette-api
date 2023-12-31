import IUser, {
  UserFull as IUserFull,
  UserListFilters as IUserListFilters,
  UserSortFields,
} from "~src/interfaces/entity/user";
import ICronofy from "~src/interfaces/entity/cronofy";
import { inject, injectable } from "inversify";
import { EntityManager, ObjectType, Repository, SelectQueryBuilder } from "typeorm";
import User from "~src/entities/user/user";
import Cronofy from "~src/entities/user/cronofy";
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
  @inject(IDENTIFIERS.DB_DATA_REPOSITORY) getDbDataRepository: (
    entity: ObjectType<IUser | ICronofy>
  ) => Repository<User | Cronofy>;

  protected get userDbRepository(): Repository<User> {
    return this.getDbDataRepository(User) as Repository<User>;
  }

  protected get cronofyDbRepository(): Repository<Cronofy> {
    return this.getDbDataRepository(Cronofy) as Repository<Cronofy>;
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

  async update(id: string, data: Partial<Omit<IUser, "externalId" | "company">>): Promise<IUserFull> {
    const user = await this.get(id);

    this.userDbRepository.merge(user, data);

    await assert(user);

    await executeTransaction(async (transactionManager: EntityManager): Promise<void> => {
      await transactionManager.save(User, user);
    });

    return user;
  }

  async connectWithCronofy(id: string, data: ICronofy): Promise<IUserFull> {
    const user = await this.get(id);

    this.userDbRepository.merge(user, { cronofy: { ...user.cronofy, ...data } });

    await assert(user);

    await executeTransaction(async (transactionManager: EntityManager): Promise<void> => {
      await transactionManager.save(User, user);
    });

    return user;
  }

  async disconnectFromCronofy(id: string): Promise<IUserFull> {
    await this.cronofyDbRepository.delete({
      user: {
        id,
      },
    });

    return this.get(id);
  }

  async setPause(id: string, pauseMe: boolean): Promise<IUserFull> {
    const user = await this.get(id);

    this.userDbRepository.merge(user, { pauseMe });

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

  async getRandomEventParticipants({ user, company }: IRequestContext): Promise<IUserFull[]> {
    const { id, cronofy, pauseMe, department } = user;

    if (!cronofy) {
      throw new AppError(ERRORS.PERMISSION_DENIED, "User is not connected with cronofy");
    }

    if (pauseMe) {
      throw new AppError(ERRORS.PERMISSION_DENIED, "User is pause for the random roulette");
    }

    const participants = await this.userDbRepository
      .createQueryBuilder("User")
      .innerJoinAndMapOne("User.cronofy", "User.cronofy", "Cronofy")
      .where("User.companyId = :companyId", { companyId: company.id })
      .andWhere("User.id != :id", { id })
      .andWhere("User.department = :department", { department })
      .getMany();

    if (!participants?.length) {
      throw new AppError(ERRORS.NO_SUCH_ENTITY, "Unable to find participant");
    }

    participants.sort(() => 0.5 - Math.random());

    return [user, participants[0]];
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
