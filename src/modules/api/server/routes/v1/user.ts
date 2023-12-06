import KoaRouter from "koa-router";
import UserController from "~api/server/controllers/user";

const userRouter = new KoaRouter({
  prefix: "/users",
});

userRouter.get("/", UserController.getList);
userRouter.get("/me", UserController.getMe);
userRouter.put("/me", UserController.updateMe);

export default userRouter;
