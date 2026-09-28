// Gera src/data/paises-mundo.json a partir do pacote world-countries,
// mantendo só os campos que o site usa (o arquivo original tem 1,4 MB).
//
// Para atualizar os dados: npm run gerar:paises
import { writeFileSync } from "node:fs";
import paises from "world-countries";

const resumo = paises
  // Só os países que têm código numérico, o mesmo usado pelo mapa
  .filter((pais) => pais.ccn3)
  .map((pais) => ({
    ccn3: pais.ccn3,
    cca2: pais.cca2,
    nome: pais.translations.por?.common ?? pais.name.common,
    capital: pais.capital ?? [],
    moedas: Object.entries(pais.currencies ?? {}).map(([codigo, moeda]) => ({
      codigo,
      nome: moeda.name,
      simbolo: moeda.symbol ?? codigo,
    })),
    regiao: pais.region,
  }))
  .sort((a, b) => a.ccn3.localeCompare(b.ccn3));

writeFileSync("src/data/paises-mundo.json", JSON.stringify(resumo));
console.log(`paises-mundo.json gerado com ${resumo.length} países.`);