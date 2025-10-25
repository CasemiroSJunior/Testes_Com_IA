import express, { Request, Response } from "express";

import routes from "./routes/index.routes";

const app = express();

app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send({ mensagem: "API Rodando OK" });
});

app.use("/api", routes);

try {
  const swaggerUi = require("swagger-ui-express");
  const openapi = require("../openapi/openapi.json");
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapi));
} catch (err) {}

export default app;
