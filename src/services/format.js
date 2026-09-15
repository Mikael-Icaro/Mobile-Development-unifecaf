export function formatBRL(value) {
  return `R$ ${value.toFixed(2).replace('.', ',')}`;
}

export function calculateFinalPrice(price, discountPercentage) {
  return price * (1 - (discountPercentage || 0) / 100);
}
