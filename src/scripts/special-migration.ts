import { inject, injectable } from "inversify";
import { EntityManager } from "typeorm";
import migrations from "~src/special-migrations";
import IScript from "~src/interfaces/script";
import { establishConnection } from "~src/api-providers/provider";
import IDENTIFIERS from "~src/di/identifiers";
import IModuleRepository from "~src/interfaces/module-repository";
import { NAMES } from "~src/interfaces/module";

@injectable()
export default class SpecialMigrationScript implements IScript {
  @inject(IDENTIFIERS.MODULE_REPOSITORY) moduleRepository: IModuleRepository;
  @inject(IDENTIFIERS.ENTITY_MANAGER) getEntityManager: () => EntityManager;

  protected get entityManager(): EntityManager {
    return this.getEntityManager();
  }

  protected formatMigrationName(name: string): string {
    return `special:${name}`;
  }

  protected extractMigrationName(name: string): string {
    return name.replace(/^special:/, "");
  }

  protected isSpecialMigration(name: string): boolean {
    return /^special:/.test(name);
  }

  public async run(): Promise<void> {
    const connection = await establishConnection();

    await this.moduleRepository.initialize({ names: [NAMES.API] });

    const executedMigrationNames = (await this.entityManager.query(`select name from special_migrations`))
      .map(({ name }: { name: string }) => name)
      .filter(this.isSpecialMigration)
      .map(this.extractMigrationName);

    const pendingMigrations = migrations.filter(({ name }) => !executedMigrationNames.includes(name));

    if (!pendingMigrations.length) {
      console.log("There are no pending migrations");

      return connection.close();
    }

    const pendingMigrationNames = pendingMigrations.map(({ name }) => name);

    console.log(`Migrations ${pendingMigrationNames} will run now`);

    for (const Migration of pendingMigrations) {
      const name = Migration.name;
      const migration = new Migration();

      console.log(`Migration ${name} is in progress`);

      await migration.run();

      await this.entityManager.query(`insert into special_migrations (timestamp, name) values(?, ?)`, [
        Date.now(),
        this.formatMigrationName(name),
      ]);

      console.log(`Migration ${name} is done`);
    }

    console.log(`Migrations ${pendingMigrationNames} are ready`);

    return connection.close();
  }
}
