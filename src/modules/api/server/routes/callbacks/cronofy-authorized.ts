import KoaRouter from "koa-router";
import CronofyAuthorizedController from "~api/server/controllers/callbacks/cronofy-authorized";

const cronofyAuthorizedRouter = new KoaRouter({
  prefix: "/cronofy-authorized-callback",
});

cronofyAuthorizedRouter.get("/", CronofyAuthorizedController.process);

export default cronofyAuthorizedRouter;
