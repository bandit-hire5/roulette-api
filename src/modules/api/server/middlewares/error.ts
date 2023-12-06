import { Context, Next } from "koa";
import { HTTP_CODES, ERRORS } from "~src/interfaces/app/app";
import { LogLevels } from "~src/interfaces/app/logger";
import { IS_PRODUCTION_MODE } from "~src/constants";
import { MODULE_LOG_KEY } from "~api/constants";

export default async (ctx: Context, next: Next): Promise<void> => {
  try {
    await next();
  } catch (e) {
    //TODO: add logger
    console.error(new Date(), LogLevels.crit, e, {
      key: MODULE_LOG_KEY,
      ctxParams: ctx.params,
      ctxHeaders: ctx.request?.headers,
    });

    ctx.status = HTTP_CODES[e?.type || ERRORS.UNKNOWN] || 500;
    ctx.errorType = e?.type || ERRORS.UNKNOWN;
    ctx.body = IS_PRODUCTION_MODE ? "" : e.toString();
    ctx.payload = e?.payload || {};
  }
};
