export async function getRates(base: string) {
  const response = await fetch(
    `https://open.er-api.com/v6/latest/${base}`
  );

  if (!response.ok) {
    throw new Error("Erro ao buscar cotação");
  }

  const data = await response.json();

  if (data.result !== "success") {
    throw new Error("API retornou um erro");
  }

  return data.rates;
}