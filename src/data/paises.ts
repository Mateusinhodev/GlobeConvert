export interface Atalho {
  /** Código numérico ISO 3166-1, o mesmo usado no mapa */
  ccn3: string;
  nome: string;
}

// Botões de acesso rápido abaixo do mapa (também servem para quem usa teclado)
export const atalhos: Atalho[] = [
  { ccn3: "076", nome: "Brasil" },
  { ccn3: "840", nome: "Estados Unidos" },
  { ccn3: "392", nome: "Japão" },
  { ccn3: "826", nome: "Reino Unido" },
  { ccn3: "276", nome: "Alemanha" },
];

// Curiosidades por moeda: a do euro aparece em todos os países que o usam
export const curiosidadesPorMoeda: Record<string, string> = {
  BRL: "O real foi lançado em 1994 com o Plano Real, que encerrou um longo período de hiperinflação no país.",
  USD: "O dólar é a principal moeda de reserva do mundo e também é a moeda oficial de países como Equador e El Salvador.",
  JPY: "O iene não tem centavos em circulação: a menor moeda do país vale 1 iene, por isso os preços não têm casas decimais.",
  GBP: "A libra esterlina é considerada a moeda mais antiga ainda em uso contínuo, com mais de 1.200 anos de história.",
  EUR: "O euro circula em mais de 20 países da União Europeia e é a segunda moeda mais usada nas reservas internacionais.",
};