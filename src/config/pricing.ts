export const SALE_CURRENCY = "EUR";
export const MARKUP = 1.3; // margem de 30%
export const FX_RATE = 1; // câmbio EUR -> moeda de venda (se vender em BRL, muda aqui)

// Recebe o custo em cêntimos e devolve o preço de venda em decimal
export function computeSalePrice(costCents: number): number {
  return Math.round(costCents * FX_RATE * MARKUP) / 100;
}