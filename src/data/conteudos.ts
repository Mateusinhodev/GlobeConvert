export type IconeConteudo = "globo" | "grafico" | "carteira" | "livro";

export interface Termo {
  termo: string;
  definicao: string;
}

export interface Conteudo {
  id: string;
  icone: IconeConteudo;
  titulo: string;
  descricao: string;
  /** Texto corrido do card */
  texto?: string;
  /** Lista de termos, para cards no formato de glossário */
  termos?: Termo[];
}

export const conteudos: Conteudo[] = [
  {
    id: "o-que-e-cambio",
    icone: "globo",
    titulo: "O que é câmbio?",
    descricao: "Entenda os fundamentos das taxas de câmbio",
    texto:
      "Câmbio é a troca da moeda de um país pela de outro. A taxa de câmbio diz quanto de uma moeda é preciso para comprar outra, e ela muda o tempo todo conforme a oferta e a demanda, a política econômica, a inflação e os acontecimentos no mundo.",
  },
  {
    id: "comercial-vs-turismo",
    icone: "grafico",
    titulo: "Taxa comercial vs turismo",
    descricao: "Conheça as diferenças entre os tipos de câmbio",
    texto:
      "A taxa comercial é usada em grandes operações entre empresas e instituições financeiras, e costuma ser a mais barata. A taxa turismo vale para quem compra moeda estrangeira como pessoa física, em casas de câmbio e bancos, e inclui custos de operação e a margem de lucro dessas empresas.",
  },
  {
    id: "historia-das-moedas",
    icone: "carteira",
    titulo: "História das moedas",
    descricao: "Uma jornada pelas principais moedas mundiais",
    texto:
      "O dólar americano virou a moeda de referência mundial depois da Segunda Guerra. O euro foi criado em 1999 para integrar as economias europeias, e suas notas começaram a circular em 2002. A libra esterlina é considerada a moeda mais antiga ainda em uso, e o real surgiu em 1994 para estabilizar a economia brasileira depois de décadas de inflação alta.",
  },
  {
    id: "glossario",
    icone: "livro",
    titulo: "Glossário econômico",
    descricao: "Termos essenciais do mercado de câmbio",
    termos: [
      { termo: "PIB", definicao: "valor total dos bens e serviços produzidos por um país." },
      { termo: "Inflação", definicao: "aumento generalizado dos preços." },
      { termo: "Deflação", definicao: "queda generalizada dos preços." },
      { termo: "Balança comercial", definicao: "diferença entre o que um país exporta e importa." },
      { termo: "Reservas cambiais", definicao: "moedas estrangeiras guardadas pelo país." },
    ],
  },
];

export interface Pergunta {
  id: string;
  pergunta: string;
  resposta: string;
}

export const perguntasFrequentes: Pergunta[] = [
  {
    id: "cotacao-diferente",
    pergunta: "Por que a cotação do conversor é diferente da que o banco me oferece?",
    resposta:
      "O conversor mostra a cotação de referência do mercado. Bancos e casas de câmbio vendem a moeda por um valor maior, porque somam a própria margem de lucro (o spread) e os impostos da operação, como o IOF. Por isso, use o conversor como referência e sempre confira o valor final antes de fechar a compra.",
  },
  {
    id: "origem-cotacoes",
    pergunta: "De onde vêm as cotações do GlobeConvert?",
    resposta:
      "As cotações vêm da ExchangeRate-API, um serviço público de taxas de câmbio. Na versão gratuita usada pelo site, os valores são atualizados uma vez por dia, então podem ter pequenas diferenças em relação ao mercado no mesmo instante.",
  },
  {
    id: "spread",
    pergunta: "O que é spread?",
    resposta:
      "Spread é a diferença entre o preço que a instituição paga pela moeda e o preço pelo qual ela vende para você. É a principal forma de lucro das casas de câmbio e dos bancos, e varia bastante de uma empresa para outra. Comparar o valor final em mais de um lugar ajuda a pagar menos.",
  },
  {
    id: "iof",
    pergunta: "O que é IOF e quando ele é cobrado?",
    resposta:
      "IOF é o Imposto sobre Operações Financeiras. Ele é cobrado na compra de moeda estrangeira em espécie, em compras com cartão no exterior e em recargas de cartões pré-pagos, entre outras operações. A alíquota muda conforme o tipo de operação e pode ser alterada pelo governo, então vale conferir o valor atual antes de viajar.",
  },
  {
    id: "variacao-diaria",
    pergunta: "Por que o valor do dólar muda todos os dias?",
    resposta:
      "Porque o câmbio no Brasil é flutuante: o preço é definido pela oferta e procura de moeda no mercado. Juros, inflação, contas públicas, eleições e notícias internacionais mudam a disposição de investidores e empresas para comprar ou vender dólares, e isso mexe na cotação ao longo do dia.",
  },
  {
    id: "limite-viagem",
    pergunta: "Quanto dinheiro em espécie posso levar numa viagem internacional?",
    resposta:
      "Não há um limite máximo, mas valores acima de US$ 10 mil, ou o equivalente em outras moedas, precisam ser declarados à Receita Federal na saída ou na chegada ao Brasil. Levar valores altos sem declarar pode resultar na retenção do dinheiro.",
  },
];