import "reflect-metadata";
import {
  CONNECTION_NAME,
  CONNECTION_TYPE,
  CONNECTION_ENTITIES,
  CONNECTION_MIGRATIONS,
  CONNECTION_SUBSCRIBERS,
  CONNECTION_SYNCHRONIZE,
  MYSQL_DATABASE,
  MYSQL_LOGGING,
} from "~src/constants";
import { createConnection, Connection, ConnectionOptions } from "typeorm";
import { SqliteConnectionOptions } from "typeorm/driver/sqlite/SqliteConnectionOptions";

export async function establishConnection(overrideOptions?: Partial<ConnectionOptions>): Promise<Connection> {
  const defaultOptions: SqliteConnectionOptions = {
    name: CONNECTION_NAME,
    type: CONNECTION_TYPE,
    database: MYSQL_DATABASE,
    synchronize: CONNECTION_SYNCHRONIZE,
    logging: MYSQL_LOGGING,
    entities: CONNECTION_ENTITIES,
    migrations: CONNECTION_MIGRATIONS,
    subscribers: CONNECTION_SUBSCRIBERS,
    cache: true,
  } as SqliteConnectionOptions;

  const options = {
    ...defaultOptions,
    ...overrideOptions,
  } as SqliteConnectionOptions;

  return createConnection(options);
}
