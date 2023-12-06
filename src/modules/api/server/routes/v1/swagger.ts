import { koaSwagger } from "koa2-swagger-ui";
import swaggerJsDoc from "swagger-jsdoc";
import { API_LINK } from "~api/constants";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Open API",
      version: "1.0.0",
      description: "A simple backend API",
    },
    servers: [
      {
        url: `${API_LINK}/api/v1`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          name: "Authorization",
          in: "header",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["src/modules/api/server/routes/v1/**/*.ts", "src/modules/api/server/controllers/**/*.ts"],
};

const spec = swaggerJsDoc(options);

export default koaSwagger({
  routePrefix: "/swagger/v1",
  swaggerOptions: {
    spec: spec as unknown as Record<string, unknown>,
  },
  exposeSpec: true,
  specPrefix: "/swagger/v1/openapi.json",
});
