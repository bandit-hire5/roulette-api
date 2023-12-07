import KoaRouter from "koa-router";
import { Context } from "koa";
import UserController from "~api/server/controllers/user";
import { transformUserResponseDecorator, transformUserListResponseDecorator } from "~api/utils/transform";

const userRouter = new KoaRouter({
  prefix: "/users",
});

userRouter.get(
  "/",
  transformUserListResponseDecorator(async (ctx: Context) => UserController.getList.call(null, ctx))
);
userRouter.get(
  "/me",
  transformUserResponseDecorator(async (ctx: Context) => UserController.getMe.call(null, ctx))
);
userRouter.put(
  "/me",
  transformUserResponseDecorator(async (ctx: Context) => UserController.updateMe.call(null, ctx))
);
userRouter.put(
  "/pause-me",
  transformUserResponseDecorator(async (ctx: Context) => UserController.pauseMe.call(null, ctx))
);
userRouter.put(
  "/unpause-me",
  transformUserResponseDecorator(async (ctx: Context) => UserController.unpauseMe.call(null, ctx))
);

export default userRouter;
