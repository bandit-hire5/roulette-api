import { resolve } from "path";

export const IS_PRODUCTION_MODE = process.env.NODE_ENV === "production";
export const WORKERS_FOLDER = resolve(__dirname, `./workers`);

export const UI_LINK = process.env.UI_LINK;
export const SG_SSO_API_LINK = process.env.SG_SSO_API_LINK;
export const SG_IDP_API_LINK = process.env.SG_IDP_API_LINK;
export const SG_DATA_PRIVACY_LINK = process.env.SG_DATA_PRIVACY_LINK;

export const SG_OAUTH2_CLIENT_ID = process.env.SG_OAUTH2_CLIENT_ID;
export const SG_OAUTH2_CLIENT_SECRET = process.env.SG_OAUTH2_CLIENT_SECRET;

export const CONNECTION_NAME = "default";
export const CONNECTION_TYPE = "sqlite";
export const MYSQL_DATABASE = process.env.MYSQL_DATABASE || "./db/db.sq3";
export const CONNECTION_SYNCHRONIZE = false;

export const MYSQL_LOGGING = process.env.MYSQL_LOGGING || false;
export const CONNECTION_ENTITIES = [resolve(__dirname, `./entities/**/*.js`)];
export const CONNECTION_MIGRATIONS = [resolve(__dirname, `./migrations/**/*.js`)];
export const CONNECTION_SUBSCRIBERS = [resolve(__dirname, `./subscribers/**/*.js`)];

export const DEFAULT_TIMEZONE = "Europe/Berlin";
