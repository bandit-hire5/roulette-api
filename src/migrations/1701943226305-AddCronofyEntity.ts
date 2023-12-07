import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCronofyEntity1701943226305 implements MigrationInterface {
  name = "AddCronofyEntity1701943226305";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "cronofy" ("id" varchar PRIMARY KEY NOT NULL, "version" integer NOT NULL DEFAULT (0), "accessToken" varchar NOT NULL, "refreshToken" varchar NOT NULL, "scope" varchar NOT NULL, "sub" varchar NOT NULL, "userId" varchar, CONSTRAINT "REL_09c49d96198b08228139db1add" UNIQUE ("userId"))`
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_cronofy" ("id" varchar PRIMARY KEY NOT NULL, "version" integer NOT NULL DEFAULT (0), "accessToken" varchar NOT NULL, "refreshToken" varchar NOT NULL, "scope" varchar NOT NULL, "sub" varchar NOT NULL, "userId" varchar, CONSTRAINT "REL_09c49d96198b08228139db1add" UNIQUE ("userId"), CONSTRAINT "FK_09c49d96198b08228139db1add5" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_cronofy"("id", "version", "accessToken", "refreshToken", "scope", "sub", "userId") SELECT "id", "version", "accessToken", "refreshToken", "scope", "sub", "userId" FROM "cronofy"`
    );
    await queryRunner.query(`DROP TABLE "cronofy"`);
    await queryRunner.query(`ALTER TABLE "temporary_cronofy" RENAME TO "cronofy"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "cronofy" RENAME TO "temporary_cronofy"`);
    await queryRunner.query(
      `CREATE TABLE "cronofy" ("id" varchar PRIMARY KEY NOT NULL, "version" integer NOT NULL DEFAULT (0), "accessToken" varchar NOT NULL, "refreshToken" varchar NOT NULL, "scope" varchar NOT NULL, "sub" varchar NOT NULL, "userId" varchar, CONSTRAINT "REL_09c49d96198b08228139db1add" UNIQUE ("userId"))`
    );
    await queryRunner.query(
      `INSERT INTO "cronofy"("id", "version", "accessToken", "refreshToken", "scope", "sub", "userId") SELECT "id", "version", "accessToken", "refreshToken", "scope", "sub", "userId" FROM "temporary_cronofy"`
    );
    await queryRunner.query(`DROP TABLE "temporary_cronofy"`);
    await queryRunner.query(`DROP TABLE "cronofy"`);
  }
}
