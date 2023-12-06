import { injectable } from "inversify";
import IScript from "~src/interfaces/script";
import { establishConnection } from "~src/api-providers/provider";

@injectable()
export default class MigrationScript implements IScript {
  public async run(): Promise<void> {
    const connection = await establishConnection();

    await connection.runMigrations({
      transaction: "all",
    });

    await connection.close();
  }
}
