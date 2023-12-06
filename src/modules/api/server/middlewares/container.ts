import { Context, Next } from "koa";
import container from "~src/di";

export default async (ctx: Context, next: Next): Promise<void> => {
  ctx.container = container;

  await next();
};
