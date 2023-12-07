import KoaRouter from "koa-router";
import RouletteController from "~api/server/controllers/roulette";
import { transformStartRouletteResponseDecorator } from "~api/utils/transform";
import { Context } from "koa";

const rouletteRouter = new KoaRouter({
  prefix: "/roulette",
});

rouletteRouter.post(
  "/trigger",
  transformStartRouletteResponseDecorator(async (ctx: Context) => RouletteController.start.call(null, ctx))
);

export default rouletteRouter;
