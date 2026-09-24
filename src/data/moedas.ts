export interface Moeda {
  codigo: string;
  nome: string;
  /** Código ISO 3166-1 alpha-2 do país (ou "eu" para a União Europeia) */
  pais: string;
}

export const moedas: Moeda[] = [
  { codigo: "USD", nome: "Dólar Americano", pais: "us" },
  { codigo: "BRL", nome: "Real", pais: "br" },
  { codigo: "EUR", nome: "Euro", pais: "eu" },
  { codigo: "GBP", nome: "Libra Esterlina", pais: "gb" },
  { codigo: "JPY", nome: "Iene", pais: "jp" },
  { codigo: "AUD", nome: "Dólar Australiano", pais: "au" },
  { codigo: "CAD", nome: "Dólar Canadense", pais: "ca" },
  { codigo: "CHF", nome: "Franco Suíço", pais: "ch" },
  { codigo: "CNY", nome: "Yuan Chinês", pais: "cn" },
  { codigo: "HKD", nome: "Dólar de Hong Kong", pais: "hk" },
  { codigo: "INR", nome: "Rúpia Indiana", pais: "in" },
  { codigo: "KRW", nome: "Won Sul-Coreano", pais: "kr" },
  { codigo: "MXN", nome: "Peso Mexicano", pais: "mx" },
  { codigo: "NOK", nome: "Coroa Norueguesa", pais: "no" },
  { codigo: "NZD", nome: "Dólar Neozelandês", pais: "nz" },
  { codigo: "PLN", nome: "Złoty Polonês", pais: "pl" },
  { codigo: "SEK", nome: "Coroa Sueca", pais: "se" },
  { codigo: "SGD", nome: "Dólar de Singapura", pais: "sg" },
  { codigo: "TRY", nome: "Lira Turca", pais: "tr" },
  { codigo: "ZAR", nome: "Rand Sul-Africano", pais: "za" },
];

/** Retorna a URL da bandeira da moeda (imagens do flagcdn.com). */
export function urlBandeira(codigoMoeda: string, largura: 20 | 40 | 80 = 40): string {
  const moeda = moedas.find((m) => m.codigo === codigoMoeda);
  return moeda ? `https://flagcdn.com/w${largura}/${moeda.pais}.png` : "";
}