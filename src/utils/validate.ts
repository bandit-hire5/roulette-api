import { validate, ValidationError } from "class-validator";
import { ERRORS } from "~src/interfaces/app/app";
import AppError from "~src/models/error";

export function getAppErrorFromValidationError(validationError: ValidationError): AppError {
  let targetError = validationError;

  while (targetError.children.length) {
    targetError = targetError.children[0];
  }

  const message = Object.values(targetError.constraints)[0];

  return new AppError(ERRORS.VALIDATION_FAILED, `${message} on data ${JSON.stringify(targetError.target)}`);
}

export async function assert(object: object): Promise<void> {
  const errors = await validate(object);

  if (!errors.length) {
    return;
  }

  throw getAppErrorFromValidationError(errors[0]);
}
