import { Context, Next } from "koa";
import IRequestContext from "~api/interfaces/request";

export default async (ctx: Context, next: Next): Promise<void> => {
  ctx.context = {} as IRequestContext;

  await next();
};
