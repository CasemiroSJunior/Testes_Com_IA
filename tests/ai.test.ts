import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import http from "http";
import app from "../src/app";
import prisma from "../src/prisma";

type GeminiApiResponse = {
   response: {
      sdkHttpResponse: {
         headers: Record<string, string>;
      };
      candidates: Array<{
         content: {
            parts: Array<{ text: string }>;
            role: string;
         };
         finishReason: string;
         index: number;
      }>;
      modelVersion: string;
      responseId: string;
      usageMetadata: {
         promptTokenCount: number;
         candidatesTokenCount: number;
         totalTokenCount: number;
         promptTokensDetails: Array<{
            modality: string;
            tokenCount: number;
         }>;
      };
   };
};

describe("Rota AI - /api/ai", () => {
  let server: http.Server;
  let port: number;
  let ENDPOINT: string;
  let testUserId: number;

  beforeAll(async () => {
    const user = await prisma.user.create({
      data: { name: "AI Test User", email: "ai@test.local" },
    });
    testUserId = user.id;

    server = http.createServer(app);
    await new Promise<void>((resolve) => server.listen(0, resolve));
    const address = server.address();
    port = typeof address === "string" || address === null ? 0 : address.port;
    ENDPOINT = `http://127.0.0.1:${port}/api/ai`;
  });

  afterAll(async () => {
    server.close();
  });

it("integração: cria um prompt real e salva no banco", async () => {
   const payload = { prompt: "Olá, tudo bem?" };
   const response = await fetch(`${ENDPOINT}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
   });

   expect(response.status).toBe(200);
   expect(response.headers.get("content-type")).toMatch(/application\/json/);

   const res = (await response.json()) as GeminiApiResponse;

   expect(res.response).toBeDefined();
   expect(res.response.usageMetadata.totalTokenCount).toBeDefined();
   expect(res.response.responseId).toBeDefined();
   expect(typeof res.response.responseId).toBe("string");

   const prompts = await prisma.prompt.findMany({
      where: { prompt: payload.prompt },
   });

   expect(prompts.length).toBeGreaterThanOrEqual(1);
});

  it("Criação de prompt falha sem prompt", async () => {
    const res = await fetch(`${ENDPOINT}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: testUserId }),
    });
    expect(res.status).toBe(400);
  });

  //Explicação do mock no sistema
   // Nesse caso, estamos simulando que a função generateContent lança um erro quando a chave da API está incorreta.
  
  it("Criação de prompt com API_KEY ERRADA | 500", async () => {
   //O import abaixo é necessário para evitar problemas com o cache do jest
   // Assim, garantimos que estamos testando o comportamento correto da função em caso de erro de autenticação.
   const ai = (await import("../src/gemini")).default;
 
   /* 
      Explicação do mock:
      Usamos jest.spyOn para "espionar" a função generateContent do objeto ai.models.
      Em seguida, usamos mockRejectedValueOnce para fazer com que essa função
      retorne uma Promise rejeitada com um erro específico ("Invalid API key") 
      na próxima vez que for chamada. Isso simula o comportamento de falha
      devido a uma chave de API inválida, permitindo que testemos como nossa
      rota lida com esse tipo de erro sem realmente fazer uma chamada real à API.

      Explicando os comandos:
      jest.spyOn(objeto, "metodo") - Cria um "espião" na função especificada do objeto.
      Nesse caso, colocamos o "espião" na função generateContent do ai.models.
      
      mockRejectedValueOnce(valor) - Faz com que a função espiada retorne uma Promise
      rejeitada com o valor especificado na próxima vez que for chamada.
      Aqui, estamos simulando que a função lança um erro quando chamada.

      spy.mockRestore() - Restaura a função espiada ao seu comportamento original,
      removendo o mock. Isso é importante para evitar que o mock afete outros testes.
   */
      const spy = jest
      .spyOn(ai.models, "generateContent")
      .mockRejectedValueOnce(new Error("Invalid API key"));

      

    const res = await fetch(`${ENDPOINT}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: "Teste com chave errada",
        userId: testUserId,
      }),
    });
    expect(res.status).toBe(500);

    spy.mockRestore();
  });

  it("mock: falha quando geração lança erro", async () => {
    const ai = (await import("../src/gemini")).default;
    const spy = jest
      .spyOn(ai.models, "generateContent")
      .mockRejectedValueOnce(new Error("fail"));

    const res = await fetch(`${ENDPOINT}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: "x", userId: testUserId }),
    });
    expect(res.status).toBe(500);

    spy.mockRestore();
  });

  it(" Traz todos os prompts ", async () => {
    const res = await fetch(`${ENDPOINT}/prompts`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
  });

  it("GET /prompts/:id retorna 404 para id inexistente", async () => {
    const res = await fetch(`${ENDPOINT}/prompts/999999`);
    expect(res.status).toBe(404);
  });

  it("GET /user/:userId/prompts traz prompts do usuário", async () => {
    const res = await fetch(`${ENDPOINT}/user/${testUserId}/prompts`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
  });
});
