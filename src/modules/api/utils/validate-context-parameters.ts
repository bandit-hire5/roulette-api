import "reflect-metadata";
import AppError from "~src/models/error";
import { VALIDATE_REQUEST_CONTEXT_REFLECT_KEY } from "~api/constants";
import { ERRORS } from "~src/interfaces/app/app";
import { Context } from "koa";

export const ValidateContextParams =
  (names: string[]) =>
  (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    target: any,
    key: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor => {
    const originalMethod = descriptor.value;

    const contextArgIndex = Reflect.getMetadata(VALIDATE_REQUEST_CONTEXT_REFLECT_KEY, target, key);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    descriptor.value = function (...args: any[]): any {
      const { context } = args[contextArgIndex] as Context;

      for (const name of names) {
        if (!context[name]) {
          throw new AppError(ERRORS.VALIDATION_FAILED, `Parameter ${name} is required for context`);
        }
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };

export const SetContextParam = (target: unknown, propertyKey: string | symbol, parameterIndex: number): void => {
  Reflect.defineMetadata(VALIDATE_REQUEST_CONTEXT_REFLECT_KEY, parameterIndex, target, propertyKey);
};
