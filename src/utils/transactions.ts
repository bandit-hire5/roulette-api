import { getConnection, EntityManager } from "typeorm";

export const executeTransaction = async (fn: (transactionManager: EntityManager) => Promise<void>): Promise<void> => {
  const queryRunner = getConnection().createQueryRunner();

  await queryRunner.startTransaction();

  try {
    await fn(queryRunner.manager);

    await queryRunner.commitTransaction();
  } catch (e) {
    await queryRunner.rollbackTransaction();

    throw e;
  } finally {
    await queryRunner.release();
  }
};
