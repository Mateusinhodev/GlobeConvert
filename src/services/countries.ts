import paisesUrl from "../data/paises-mundo.json?url";

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
  regiao: string;
}

// Formato do arquivo gerado por scripts/gerar-paises.mjs
interface PaisResumo {
  ccn3: string;
  cca2: string;
  nome: string;
  capital: string[];
  moedas: MoedaPais[];
  regiao: string;
}

const REGIOES: Record<string, string> = {
  Africa: "África",
  Americas: "Américas",
  Antarctic: "Antártida",
  Asia: "Ásia",
  Europe: "Europa",
  Oceania: "Oceania",
};

const nomesDeMoedas = new Intl.DisplayNames(["pt-BR"], { type: "currency" });

// Nome da moeda em português (ex.: "Real brasileiro"), com o nome original como reserva
function nomeDaMoeda(codigo: string, reserva: string) {
  try {
    const nome = nomesDeMoedas.of(codigo);
    return nome ? nome.charAt(0).toUpperCase() + nome.slice(1) : reserva;
  } catch {
    return reserva;
  }
}

async function carregarPaises(): Promise<Map<string, InfoPais>> {
  // O arquivo é baixado só quando o mapa é exibido, como o do world-atlas
  const resposta = await fetch(paisesUrl);

  if (!resposta.ok) {
    throw new Error("Erro ao carregar os dados dos países");
  }

  const dados = (await resposta.json()) as PaisResumo[];

  return new Map(
    dados.map((pais) => [
      pais.ccn3,
      {
        ccn3: pais.ccn3,
        cca2: pais.cca2,
        nome: pais.nome,
        capital: pais.capital.join(", "),
        moedas: pais.moedas.map((moeda) => ({
          ...moeda,
          nome: nomeDaMoeda(moeda.codigo, moeda.nome),
        })),
        bandeira: `https://flagcdn.com/${pais.cca2.toLowerCase()}.svg`,
        regiao: REGIOES[pais.regiao] ?? pais.regiao,
      },
    ])
  );
}

// Guarda o carregamento para montar a lista uma única vez por visita
let cache: Promise<Map<string, InfoPais>> | null = null;

export function getCountries() {
  cache ??= carregarPaises().catch((error) => {
    cache = null; // permite tentar de novo depois de um erro
    throw error;
  });
  return cache;
}