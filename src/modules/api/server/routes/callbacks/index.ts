import KoaRouter from "koa-router";

import cronofyAuthorizedBuilder from "./cronofy-authorized";

const CallbackRouter = new KoaRouter();

CallbackRouter.use(cronofyAuthorizedBuilder.routes());

export default CallbackRouter;
