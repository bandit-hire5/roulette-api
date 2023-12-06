import "reflect-metadata";
import { ERRORS } from "~src/interfaces/app/app";
import AppError from "~src/models/error";
import { VALIDATE_REQUEST_CONTEXT_REFLECT_KEY } from "~api/constants";
import { Context } from "koa";

export enum AuthorizationTypes {
  Bearer = "Bearer",
  Basic = "Basic",
  Server = "Server",
}

export const Authorized =
  (authTypes = [AuthorizationTypes.Bearer]) =>
  (target: unknown, key: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
    const originalMethod = descriptor.value;

    const contextArgIndex = Reflect.getMetadata(VALIDATE_REQUEST_CONTEXT_REFLECT_KEY, target, key);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    descriptor.value = function (...args: any[]): any {
      const {
        context: { user, systemUser },
      } = args[contextArgIndex] as Context;

      if (!authTypes.length) {
        throw new AppError(ERRORS.UNAUTHORIZED, "Unauthorized");
      }

      if (authTypes.includes(AuthorizationTypes.Bearer) && user) {
        return originalMethod.apply(this, args);
      }

      if (authTypes.includes(AuthorizationTypes.Basic) && systemUser) {
        return originalMethod.apply(this, args);
      }

      if (authTypes.includes(AuthorizationTypes.Server) && systemUser) {
        return originalMethod.apply(this, args);
      }

      throw new AppError(ERRORS.UNAUTHORIZED, "Unauthorized");
    };

    return descriptor;
  };
