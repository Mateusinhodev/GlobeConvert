export interface MoedaPais {
  codigo: string;
  nome: string;
  simbolo: string;
}

export interface InfoPais {
  /** Código numérico ISO 3166-1, o mesmo usado pelo world-atlas (ex.: "076") */
  ccn3: string;
  cca2: string;
  nome: string;
  capital: string;
  moedas: MoedaPais[];
  bandeira: string;
  populacao: number;
  regiao: string;
}

// Formato da resposta da REST Countries (só os campos que pedimos)
interface PaisApi {
  ccn3?: string;
  cca2: string;
  name: { common: string };
  translations?: { por?: { common: string } };
  capital?: string[];
  currencies?: Record<string, { name: string; symbol?: string }>;
  flags: { svg: string; png: string };
  population: number;
  region: string;
}

// A rota /all exige o parâmetro fields, com no máximo 10 campos
const CAMPOS = "ccn3,cca2,name,translations,capital,currencies,flags,population,region";

const REGIOES: Record<string, string> = {
  Africa: "África",
  Americas: "Américas",
  Antarctic: "Antártida",
  Asia: "Ásia",
  Europe: "Europa",
  Oceania: "Oceania",
};

const nomesDeMoedas = new Intl.DisplayNames(["pt-BR"], { type: "currency" });

// Nome da moeda em português (ex.: "Real brasileiro"), com o nome da API como reserva
function nomeDaMoeda(codigo: string, reserva: string) {
  try {
    const nome = nomesDeMoedas.of(codigo);
    return nome ? nome.charAt(0).toUpperCase() + nome.slice(1) : reserva;
  } catch {
    return reserva;
  }
}

async function buscarPaises(): Promise<Map<string, InfoPais>> {
  const response = await fetch(`https://restcountries.com/v3.1/all?fields=${CAMPOS}`);

  if (!response.ok) {
    throw new Error("Erro ao buscar os dados dos países");
  }

  const dados: PaisApi[] = await response.json();
  const paises = new Map<string, InfoPais>();

  for (const pais of dados) {
    if (!pais.ccn3) continue;

    paises.set(pais.ccn3, {
      ccn3: pais.ccn3,
      cca2: pais.cca2,
      nome: pais.translations?.por?.common ?? pais.name.common,
      capital: pais.capital?.join(", ") ?? "",
      moedas: Object.entries(pais.currencies ?? {}).map(([codigo, moeda]) => ({
        codigo,
        nome: nomeDaMoeda(codigo, moeda.name),
        simbolo: moeda.symbol ?? codigo,
      })),
      bandeira: pais.flags.svg,
      populacao: pais.population,
      regiao: REGIOES[pais.region] ?? pais.region,
    });
  }

  return paises;
}

// Guarda a requisição para buscar os países uma única vez por visita
let cache: Promise<Map<string, InfoPais>> | null = null;

export function getCountries() {
  cache ??= buscarPaises().catch((error) => {
    cache = null; // permite tentar de novo depois de um erro
    throw error;
  });
  return cache;
}