export function Soma(a: number, b: number): number {
  return a + b;
}

export function Subtracao(a: number, b: number): number {
  return a - b;
}

export function Multiplicacao(a: number, b: number): number {
  return a * b;
}

export function Divisao(a: number, b: number): number {
  if (b === 0) {
    throw new Error("Divisão por zero não é permitida.");
  }
  return a / b;
}

export function Saudacao(nome: string): string {
  return `Olá, ${nome}!`;
}
