import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import { Saudacao, Soma, Divisao,  Multiplicacao, Subtracao } from "../utils/examplesFunctions";

// Vou montar alguns testes simples aqui para explicar
// o funcionamento do jest

describe("Testes de exemplo", () => {
  //Descrevemos o que será testado

  it("soma dois números", () => {
    //Definimos o teste
    //Vou criar um arquivo para criar funções de teste
    expect(Soma(2, 3)).toBe(5);

    expect(Soma(-1, 1)).toBe(0);
    expect(Soma(-1, -1)).toBe(-2);
    expect(Soma(0, 0)).toBe(0);
    expect(Soma(2.5, 2.5)).toBe(5);
    expect(Soma(2, -3)).toBe(-1);
    expect(Soma(1, 1)).not.toBe(3); //Exemplo de negação

    expect(typeof Soma(1, 3)).toBe("number");
    expect(typeof Soma(1, 3)).not.toBe("string");
  });

  it("subtrai dois números", () => {
    expect(Subtracao(5, 3)).toBe(2);
    expect(Subtracao(2, 5)).toBe(-3);
    expect(Subtracao(-1, -1)).toBe(0);
    expect(Subtracao(2.5, 0.5)).toBe(2);
  });

  it("multiplica dois números", () => {
    expect(Multiplicacao(2, 3)).toBe(6);
    expect(Multiplicacao(-2, 3)).toBe(-6);
    expect(Multiplicacao(-2, -3)).toBe(6);
    expect(Multiplicacao(2.5, 2)).toBe(5);
  });

  it("divide dois números", () => {
    expect(Divisao(6, 3)).toBe(2);
    expect(Divisao(-6, 3)).toBe(-2);
    expect(Divisao(-6, -3)).toBe(2);
    expect(Divisao(5, 2)).toBe(2.5);
  });

  it("divide por zero lança erro", () => {
    expect(() => Divisao(5, 0)).toThrow("Divisão por zero não é permitida.");
  });

  it("saúda uma pessoa pelo nome", () => {
    expect(Saudacao("Casemiro")).toBe("Olá, Casemiro!");
    expect(Saudacao("Ana")).toBe("Olá, Ana!");
    expect(typeof Saudacao("Casemiro") === "string").toBe(true);
    expect(typeof Saudacao("Ana") != "string").toBeFalsy();
  });

  //Teste com dados mockados

  it(" Teste com dados mockados ", () => {
    const utils = require("../utils/examplesFunctions");
    // Espiona a função Soma do módulo utils e forçar retorno 3
    const spy = jest.spyOn(utils, "Soma").mockReturnValue(3);

    // Quando a função for chamada via import original (Soma) ela está ligada ao mesmo módulo,
    // portanto chamar utils.Soma garante que o spy seja usado.
    expect(utils.Soma(1, 3)).toBe(3);

    // Restaurar implementação original
    spy.mockRestore();

    expect(utils.Soma(1, 1)).toBe(2);

    // Agora alterar a implementação para subtrair usando mockImplementation no spy novamente
    const spy2 = jest.spyOn(utils, "Soma").mockImplementation((...args: unknown[]) => {
      const [a, b] = args as [number, number];
      return a - b;
    });  // Nesse caso, como estamos alterando a implementação do metodo, passamos o que ele espera e o que ele irá retornar
    expect(utils.Soma(5, 2)).toBe(3); // 5 - 2 tem que ser 3

    // Restaurar implementação original
    spy2.mockRestore();
  });
});
