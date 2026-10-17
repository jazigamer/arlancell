export const formatBRL = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
// Mudei para 21x conforme a regra da loja
export const parcelas = (v, n = 21) => `Em até ${n}x de ${formatBRL(v / n)} no cartão`; 

