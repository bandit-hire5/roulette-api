import { ERRORS } from "~src/interfaces/app/app";
import { LogLevels } from "~src/interfaces/app/logger";

export default interface AppErrorData extends Error {
  id?: string;
  level?: LogLevels;
  stack: string;
  type?: ERRORS;
  payload?: object;
  message: string;
}
