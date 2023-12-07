import { Context } from "koa";
import { UserFlat as IUserFlat, UserFull as IUserFull } from "~src/interfaces/entity/user";

export const transformFullUserToFlat = ({ cronofy, externalId, ...rest }: IUserFull): IUserFlat => ({
  ...rest,
  connectedWithCronofy: !!cronofy,
});

const transformUserResponse = async (handler: (ctx: Context) => Promise<void>, ctx: Context): Promise<void> => {
  await handler.call(this, ctx);

  ctx.body = transformFullUserToFlat(ctx.body as IUserFull);
};

const transformUserListResponse = async (handler: (ctx: Context) => Promise<void>, ctx: Context): Promise<void> => {
  await handler.call(this, ctx);

  const response = ctx.body as { totalCount: number; items: IUserFull[] };

  ctx.body = {
    ...response,
    items: (response.items as IUserFull[]).map((user) => transformFullUserToFlat(user)),
  };
};

export const transformUserResponseDecorator = (handler: (ctx: Context) => Promise<void>) => {
  return (ctx: Context) => {
    return transformUserResponse(handler, ctx);
  };
};

export const transformUserListResponseDecorator = (handler: (ctx: Context) => Promise<void>) => {
  return (ctx: Context) => {
    return transformUserListResponse(handler, ctx);
  };
};

const transformStartRouletteResponse = async (
  handler: (ctx: Context) => Promise<void>,
  ctx: Context
): Promise<void> => {
  await handler.call(this, ctx);

  const response = ctx.body as { event: object; participants: IUserFull[] };

  ctx.body = { ...response, participants: response.participants.map((user) => transformFullUserToFlat(user)) };
};

export const transformStartRouletteResponseDecorator = (handler: (ctx: Context) => Promise<void>) => {
  return (ctx: Context) => {
    return transformStartRouletteResponse(handler, ctx);
  };
};
