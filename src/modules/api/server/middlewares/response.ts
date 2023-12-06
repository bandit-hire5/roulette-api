import { Context, Next } from "koa";
import { Readable } from "stream";

export default async (ctx: Context, next: Next): Promise<void> => {
  await next();

  const status = ctx.status;

  if (status === 200 || status === 201 || status === 206) {
    if (ctx.body instanceof Readable) {
      return;
    }

    ctx.body = {
      statusCode: status,
      data: ctx.body || {},
    };
  } else {
    ctx.status = status;

    ctx.body = {
      statusCode: status,
      type: ctx.errorType,
      error: ctx.body,
      payload: ctx.payload,
    };
  }
};
