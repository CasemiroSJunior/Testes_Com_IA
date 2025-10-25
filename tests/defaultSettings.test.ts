import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import http from "http";
import app from "../src/app";

describe("De funcionamento API", () => {
  let server: http.Server;
  let port: number;

  beforeAll(async () => {
    server = http.createServer(app);
    await new Promise<void>((resolve) => server.listen(0, resolve));
    const address = server.address();
    port = typeof address === "string" || address === null ? 0 : address.port;
  });

  afterAll(async () => {
    server.close();
  });

  it('A rota deve voltar um "API Rodando OK" com status 200', async () => {
    const res = await fetch(`http://127.0.0.1:${port}/`);
    const body: { mensagem: string } = await res.json();
    expect(res.status).toBe(200);
    expect(body.mensagem).toBe("API Rodando OK");
  });
});