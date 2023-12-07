import { Context } from "koa";
import { Container } from "inversify";
import ICronofyClient from "~api/interfaces/providers/cronofy";
import IUserRepository from "~api/interfaces/user-repository";
import IDENTIFIERS from "~api/di/identifiers";
import { UI_LINK } from "~src/constants";

export default class CronofyAuthorizedController {
  public static async process(ctx: Context): Promise<void> {
    const { code, state } = ctx.request.query;

    const cronofyClient = (ctx.container as Container).get<ICronofyClient>(IDENTIFIERS.CRONOFY_CLIENT);
    const userRepository = (ctx.container as Container).get<IUserRepository>(IDENTIFIERS.USER_REPOSITORY);

    try {
      const { userId } = JSON.parse(state as string);

      const data = await cronofyClient.getToken(code as string);

      console.log(userId, data);

      await userRepository.connectWithCronofy(userId, {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        scope: data.scope,
        sub: data.sub,
      });

      ctx.set("Cache-Control", "no-store");

      ctx.status = 303;
      ctx.redirect(UI_LINK);
    } catch (e) {
      return ctx.throw(500, e);
    }
  }
}
