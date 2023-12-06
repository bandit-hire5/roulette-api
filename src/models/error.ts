import { ERRORS } from "~src/interfaces/app/app";
import { LogLevels } from "~src/interfaces/app/logger";
import { v4 as generateId } from "uuid";
import IAppErrorData from "~src/interfaces/app/error";

export default class AppError extends Error {
  public readonly type: ERRORS;
  public readonly level: LogLevels;
  public readonly payload: object;
  public readonly id: string;

  constructor(type: ERRORS, message: string, level = LogLevels.crit, payload?: object, id = generateId()) {
    super(message);

    this.type = type;
    this.level = level;
    this.payload = payload;
    this.id = id;
  }

  public static from(errorData: IAppErrorData): AppError {
    const appError = new AppError(
      errorData.type || ERRORS.UNKNOWN,
      errorData.message,
      errorData.level,
      errorData.payload,
      errorData.id
    );

    appError.stack = errorData.stack;

    return appError;
  }

  toJSON(): object {
    return {
      message: this.message,
      type: this.type,
      id: this.id,
      level: this.level,
      stack: this.stack,
      payload: this.payload,
    };
  }
}
