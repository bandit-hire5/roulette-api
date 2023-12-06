import ICompany from "~src/interfaces/entity/company";
import { inject, injectable } from "inversify";
import { EntityManager, ObjectType, Repository } from "typeorm";
import Company from "~src/entities/company/company";
import GLOBAL_IDENTIFIERS from "~src/di/identifiers";
import ICompanyRepository from "~api/interfaces/company-repository";
import { assert } from "~src/utils/validate";
import { executeTransaction } from "~src/utils/transactions";
import AppError from "~src/models/error";
import { ERRORS } from "~src/interfaces/app/app";

@injectable()
export default class CompanyRepository implements ICompanyRepository {
  @inject(GLOBAL_IDENTIFIERS.DB_DATA_REPOSITORY) getDbDataRepository: (
    entity: ObjectType<ICompany>
  ) => Repository<Company>;
  @inject(GLOBAL_IDENTIFIERS.ENTITY_MANAGER) getEntityManager: () => EntityManager;

  protected get entityManager(): EntityManager {
    return this.getEntityManager();
  }

  protected get companyDbRepository(): Repository<Company> {
    return this.getDbDataRepository(Company) as Repository<Company>;
  }

  async create(data: ICompany): Promise<ICompany> {
    const company = this.companyDbRepository.create({
      ...data,
    });

    await assert(company);

    await executeTransaction(async (transactionManager: EntityManager): Promise<void> => {
      await transactionManager.save(Company, company);
    });

    return company;
  }

  async get(id: string): Promise<ICompany> {
    const company = await this.companyDbRepository.findOne({
      where: {
        id,
      },
    });

    if (!company) {
      throw new AppError(ERRORS.NO_SUCH_ENTITY, "Company doesn't exist");
    }

    return company;
  }
}
