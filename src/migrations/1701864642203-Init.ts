import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1701864642203 implements MigrationInterface {
  name = "Init1701864642203";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" varchar PRIMARY KEY NOT NULL, "version" integer NOT NULL DEFAULT (0), "externalId" varchar, "email" varchar, "locale" varchar(2) NOT NULL DEFAULT (''), "timeZone" varchar NOT NULL DEFAULT (''), "firstName" varchar NOT NULL DEFAULT (''), "lastName" varchar NOT NULL DEFAULT (''), "avatarImageUrl" varchar NOT NULL DEFAULT (''), "companyId" varchar, CONSTRAINT "UQ_bc97b425592aa51df5da7a440a6" UNIQUE ("externalId"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"))`
    );
    await queryRunner.query(`CREATE TABLE "company" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL)`);
    await queryRunner.query(
      `CREATE TABLE "job" ("id" varchar PRIMARY KEY NOT NULL, "version" integer NOT NULL DEFAULT (0), "status" varchar NOT NULL, "uniqueHash" varchar NOT NULL, "scheduleOn" integer NOT NULL, "repeatInSeconds" integer NOT NULL DEFAULT (0), "data" text NOT NULL)`
    );
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_c43e69367a6e8b887609330943" ON "job" ("uniqueHash") `);
    await queryRunner.query(
      `CREATE TABLE "temporary_user" ("id" varchar PRIMARY KEY NOT NULL, "version" integer NOT NULL DEFAULT (0), "externalId" varchar, "email" varchar, "locale" varchar(2) NOT NULL DEFAULT (''), "timeZone" varchar NOT NULL DEFAULT (''), "firstName" varchar NOT NULL DEFAULT (''), "lastName" varchar NOT NULL DEFAULT (''), "avatarImageUrl" varchar NOT NULL DEFAULT (''), "companyId" varchar, CONSTRAINT "UQ_bc97b425592aa51df5da7a440a6" UNIQUE ("externalId"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "FK_86586021a26d1180b0968f98502" FOREIGN KEY ("companyId") REFERENCES "company" ("id") ON DELETE CASCADE ON UPDATE CASCADE)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_user"("id", "version", "externalId", "email", "locale", "timeZone", "firstName", "lastName", "avatarImageUrl", "companyId") SELECT "id", "version", "externalId", "email", "locale", "timeZone", "firstName", "lastName", "avatarImageUrl", "companyId" FROM "user"`
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
    await queryRunner.query(
      `CREATE TABLE "user" ("id" varchar PRIMARY KEY NOT NULL, "version" integer NOT NULL DEFAULT (0), "externalId" varchar, "email" varchar, "locale" varchar(2) NOT NULL DEFAULT (''), "timeZone" varchar NOT NULL DEFAULT (''), "firstName" varchar NOT NULL DEFAULT (''), "lastName" varchar NOT NULL DEFAULT (''), "avatarImageUrl" varchar NOT NULL DEFAULT (''), "companyId" varchar, CONSTRAINT "UQ_bc97b425592aa51df5da7a440a6" UNIQUE ("externalId"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"))`
    );
    await queryRunner.query(
      `INSERT INTO "user"("id", "version", "externalId", "email", "locale", "timeZone", "firstName", "lastName", "avatarImageUrl", "companyId") SELECT "id", "version", "externalId", "email", "locale", "timeZone", "firstName", "lastName", "avatarImageUrl", "companyId" FROM "temporary_user"`
    );
    await queryRunner.query(`DROP TABLE "temporary_user"`);
    await queryRunner.query(`DROP INDEX "IDX_c43e69367a6e8b887609330943"`);
    await queryRunner.query(`DROP TABLE "job"`);
    await queryRunner.query(`DROP TABLE "company"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
