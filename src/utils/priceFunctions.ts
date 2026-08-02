export function formatPrice(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function getDiscountPercent(price: number, originalPrice?: number) {

  if (!originalPrice || originalPrice <= price) return null;
  
  return Math.round(100 - (price / originalPrice) * 100);
}