import KoaRouter from "koa-router";

import apiV1Router from "./v1";

const APIRouter = new KoaRouter({
  prefix: "/api",
});

APIRouter.use(apiV1Router.routes());

export default APIRouter;
