import Koa from "koa";
import IScript from "~src/interfaces/script";
import applyMiddlewares from "~api/server/middlewares";
import { SERVER_PORT } from "~api/constants";
import { injectable } from "inversify";

@injectable()
export default class ServerScript implements IScript {
  protected setupApp(): Koa {
    const app = new Koa();

    applyMiddlewares(app);

    return app;
  }

  protected startApp(app: Koa): Koa {
    app.listen(SERVER_PORT, () => {
      console.info(`API Server was run on port: ${SERVER_PORT}`); // TODO: add logger
    });

    return app;
  }

  public async run(): Promise<void> {
    const app = this.setupApp();
    this.startApp(app);
  }
}
