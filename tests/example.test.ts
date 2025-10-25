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
    const spy = jest.spyOn(utils, "Soma").mockReturnValue(3); // Nesse caso, estamos falando que o valor da função será 3
    expect(Soma(1, 3)).toBe(3); //Aqui comprova que veio 3

    spy.mockRestore(); //Limpamos os dados mockados

    expect(Soma(1, 1)).toBe(2);

    utils.mockImplementation((a: number, b: number) => a - b); //Aqui mockamos a função Soma para que ela subtraia
    utils(Soma(5, 2)); //Aqui a função soma na verdade está subtraindo
    expect(Soma(5, 2)).toBe(3);

    utils.mockRestore();
  });
});
