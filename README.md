# 🌎 GlobeConvert

Conversor de moedas com mapa mundial interativo e conteúdo de educação financeira, feito com React, TypeScript e Vite.

O GlobeConvert reúne três formas de explorar as moedas do mundo: converter valores entre 20 moedas com cotações atualizadas diariamente, descobrir a moeda de cada país clicando no mapa e aprender os conceitos básicos do mercado de câmbio.

## Funcionalidades

### Conversor de moedas
- Conversão entre 20 moedas, com bandeira em cada opção.
- Seletor de moedas próprio, acessível pelo teclado: setas, Enter, Esc e busca digitando ("br" leva ao BRL).
- Botão para inverter as moedas de origem e destino.
- Resultado no formato brasileiro, com símbolo da moeda e a taxa usada (`US$ 100,00 = R$ 532,10`).
- Enter no campo de valor já converte.

### Mapa mundial interativo
- Mapa em SVG com todos os países, sem necessidade de chave de API.
- Ao passar o mouse, uma etiqueta mostra a bandeira, o nome e a moeda do país.
- Ao clicar ou tocar, um painel mostra moedas, símbolo, capital, região, cotação em reais e uma curiosidade, quando houver.
- Atalhos para países populares, que também permitem escolher pelo teclado.

### Aprenda sobre moedas
- Cards sobre câmbio, taxa comercial e turismo, história das moedas e um glossário.
- Perguntas frequentes sobre spread, IOF, variação do dólar e limites de viagem.

### Visual
- Tema escuro com gradiente azul e verde-água e efeito de vidro nos cards.
- Layout responsivo, do celular ao desktop.
- Foco visível em todos os elementos interativos e respeito à preferência de movimento reduzido do sistema.

## Tecnologias

- [React 19](https://react.dev) e [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vite.dev) para desenvolvimento e build
- CSS Modules para estilos isolados por componente
- [d3-geo](https://github.com/d3/d3-geo) e [topojson-client](https://github.com/topojson/topojson-client) para desenhar o mapa
- ESLint para a análise do código

## Como rodar

Pré-requisito: [Node.js](https://nodejs.org) 20 ou superior (recomendado usar a versão LTS mais recente).

```bash
# Clone o repositório
git clone https://github.com/douglassousa6-design/GlobeConvert.git
cd GlobeConvert

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Depois, abra o endereço mostrado no terminal (normalmente `http://localhost:5173`).

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Verifica os tipos com o TypeScript e gera a versão de produção em `dist/` |
| `npm run preview` | Abre localmente a versão gerada pelo `build` |
| `npm run lint` | Analisa o código com o ESLint |
| `npm run gerar:paises` | Recria `src/data/paises-mundo.json` a partir do pacote `world-countries` |

## Estrutura do projeto

```
GlobeConvert/
├── scripts/
│   └── gerar-paises.mjs        # Gera os dados enxutos dos países
├── src/
│   ├── components/             # Cada componente com seu .module.css
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── CurrencyConverter.tsx
│   │   ├── CurrencySelect.tsx  # Seletor de moedas com bandeiras
│   │   ├── WorldMap.tsx
│   │   ├── Learn.tsx
│   │   ├── SectionHeader.tsx   # Cabeçalho reaproveitado nas seções
│   │   └── Footer.tsx
│   ├── data/
│   │   ├── moedas.ts           # Moedas do conversor
│   │   ├── paises.ts           # Atalhos do mapa e curiosidades
│   │   ├── paises-mundo.json   # Dados dos países (gerado pelo script)
│   │   └── conteudos.ts        # Textos da seção Aprenda e perguntas frequentes
│   ├── services/
│   │   ├── exchangeApi.ts      # Busca as cotações
│   │   └── countries.ts        # Carrega os dados dos países
│   ├── App.tsx
│   ├── index.css               # Variáveis de cor, reset e estilos globais
│   └── main.tsx
└── package.json
```

## Como editar o conteúdo

A maior parte do conteúdo fica em arquivos de dados, sem precisar mexer nos componentes:

- **Adicionar uma moeda ao conversor:** inclua um item em `src/data/moedas.ts`, com o código da moeda e o código do país da bandeira.
- **Adicionar um atalho ou uma curiosidade ao mapa:** edite `src/data/paises.ts`. As curiosidades são organizadas por moeda, então a do euro aparece em todos os países que o usam.
- **Adicionar um card ou uma pergunta frequente:** edite `src/data/conteudos.ts`.
- **Mudar as cores do site:** altere as variáveis em `:root`, no início de `src/index.css`.

## Fontes de dados

| Dado | Fonte | Observação |
|---|---|---|
| Cotações | [ExchangeRate-API](https://www.exchangerate-api.com) (`open.er-api.com`) | Gratuita e sem chave. Atualizada uma vez por dia. |
| Dados dos países | [mledoze/countries](https://github.com/mledoze/countries), via pacote [`world-countries`](https://www.npmjs.com/package/world-countries) | Guardados no projeto, sem depender de API. Licença [ODbL](https://opendatacommons.org/licenses/odbl/1-0/). |
| Contornos do mapa | [Natural Earth](https://www.naturalearthdata.com), via pacote [`world-atlas`](https://github.com/topojson/world-atlas) | Domínio público. |
| Bandeiras | [Flagpedia](https://flagpedia.net) (`flagcdn.com`) | Carregadas pela internet. |

As cotações são uma referência de mercado. Bancos e casas de câmbio cobram valores maiores, porque somam o spread e impostos como o IOF.

## Limitações conhecidas

- As cotações dependem de internet e são atualizadas uma vez por dia, não em tempo real.
- As bandeiras também vêm da internet e não aparecem offline.
- No celular, o mapa fica pequeno e os países menores são difíceis de tocar. Os atalhos abaixo do mapa ajudam nesses casos.
- Algumas capitais aparecem com o nome em inglês (por exemplo, "Berlin"), porque a base de dados traduz só o nome dos países.
- No celular, os links da navbar ficam ocultos. A navegação entre as seções é feita rolando a página.

## Próximos passos

- Menu para celular (hambúrguer) com os links das seções.
- Zoom e arraste no mapa, para facilitar o uso em telas pequenas.
- Campo de busca de países no mapa.
- Mais moedas no conversor.

## Contribuindo

1. Faça um fork do repositório.
2. Crie uma branch para a sua mudança: `git checkout -b feat/minha-melhoria`.
3. Rode `npm run lint` e `npm run build` antes de commitar.
4. Envie a branch para o seu fork e abra um pull request explicando o que mudou.