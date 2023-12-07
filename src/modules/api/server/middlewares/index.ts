import Koa from "koa";
import cors from "@koa/cors";
import bodyParser from "koa-bodyparser";
import conditional from "koa-conditional-get";
import API from "~api/server/routes";
import swaggerV1 from "~api/server/routes/v1/swagger";
import callbackRouter from "~api/server/routes/callbacks";
import containerMiddleware from "~api/server/middlewares/container";
import contextMiddleware from "~api/server/middlewares/context";
import responseMiddleware from "~api/server/middlewares/response";
import errorMiddleware from "~api/server/middlewares/error";
import authMiddleware from "~api/server/middlewares/auth";

export default (app: Koa): void => {
  app.use(swaggerV1);
  app.use(containerMiddleware);

  app.use(callbackRouter.routes());

  app.use(cors());
  app.use(conditional());
  app.use(bodyParser({ enableTypes: ["json"] }));
  app.use(contextMiddleware);
  app.use(responseMiddleware);
  app.use(errorMiddleware);
  app.use(authMiddleware);

  app.use(API.allowedMethods()).use(API.routes());
};
