import { memo, useEffect, useId, useMemo, useRef, useState, type MouseEvent, type PointerEvent } from "react";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import mapaUrl from "world-atlas/countries-110m.json?url";
import { getRates } from "../services/exchangeApi";
import { getCountries, type InfoPais } from "../services/countriesApi";
import { atalhos, curiosidadesPorMoeda } from "../data/paises";
import SectionHeader from "./SectionHeader";
import styles from "./WorldMap.module.css";

const LARGURA = 960;
const MARGEM = 8;

interface FormaPais {
  id: string;
  nomeIngles: string;
  d: string;
}

type Cotacao =
  | { status: "carregando" }
  | { status: "ok"; valor: number }
  | { status: "erro" };

interface Dica {
  id: string;
  x: number;
  y: number;
  /** Perto do topo do mapa, a etiqueta aparece abaixo do mouse */
  abaixo: boolean;
}

type TopologiaMundo = Topology<{ countries: GeometryCollection<{ name: string }> }>;

interface DadosMapa {
  formas: FormaPais[];
  altura: number;
}

// Baixa os contornos dos países e transforma cada um em um caminho SVG
async function carregarFormas(): Promise<DadosMapa> {
  const resposta = await fetch(mapaUrl);
  const topologia = (await resposta.json()) as TopologiaMundo;
  const colecao = feature(topologia, topologia.objects.countries);

  // A Antártida (010) fica de fora para o mapa aproveitar melhor o espaço
  const paises = colecao.features.filter((f) => f.id !== "010");

  // Ajusta o mapa à largura e calcula a altura que ele realmente ocupa
  const colecaoVisivel = { type: "FeatureCollection" as const, features: paises };
  const projecao = geoNaturalEarth1().fitWidth(LARGURA - MARGEM * 2, colecaoVisivel);
  projecao.translate([projecao.translate()[0] + MARGEM, projecao.translate()[1]]);
  const caminho = geoPath(projecao);
  const [[, topo], [, base]] = caminho.bounds(colecaoVisivel);
  projecao.translate([projecao.translate()[0], projecao.translate()[1] - topo + MARGEM]);

  return {
    altura: Math.ceil(base - topo + MARGEM * 2),
    formas: paises.map((f, indice) => ({
      // Kosovo, Chipre do Norte e Somalilândia não têm código ISO
      id: f.id ? String(f.id) : `sem-codigo-${indice}`,
      nomeIngles: f.properties?.name ?? "",
      d: caminho(f) ?? "",
    })),
  };
}

// Só redesenha os países quando a seleção muda, e não a cada movimento do mouse
const Paises = memo(function Paises({
  formas,
  selecionado,
  gradienteId,
}: {
  formas: FormaPais[];
  selecionado: string | null;
  gradienteId: string;
}) {
  return (
    <g>
      {formas.map((forma) => (
        <path
          key={forma.id}
          d={forma.d}
          data-id={forma.id}
          className={styles.country}
          style={forma.id === selecionado ? { fill: `url(#${gradienteId})` } : undefined}
        />
      ))}
    </g>
  );
});

function IconeGlobo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21.54 15H17a2 2 0 0 0-2 2v4.54" />
      <path d="M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17" />
      <path d="M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

function IconePino({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 10c0 4.99-5.54 10.19-7.4 11.8a1 1 0 0 1-1.2 0C9.54 20.19 4 14.99 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

// Até 4 casas decimais, para moedas que valem centavos de real (1 JPY = R$ 0,0362)
const formatarReal = (valor: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(valor);

const formatarPopulacao = (valor: number) =>
  new Intl.NumberFormat("pt-BR").format(valor);

function WorldMap() {
  const [mapa, setMapa] = useState<DadosMapa | null>(null);
  const [erroMapa, setErroMapa] = useState(false);
  const [paises, setPaises] = useState<Map<string, InfoPais> | null>(null);
  const [erroPaises, setErroPaises] = useState(false);
  const [selecionado, setSelecionado] = useState<string | null>(null);
  const [cotacao, setCotacao] = useState<Cotacao | null>(null);
  const [dica, setDica] = useState<Dica | null>(null);

  const molduraRef = useRef<HTMLDivElement>(null);
  const ultimoPedido = useRef("");
  const gradienteId = useId();

  // Carrega o mapa e os dados dos países ao abrir a página
  useEffect(() => {
    let ativo = true;

    carregarFormas()
      .then((resultado) => ativo && setMapa(resultado))
      .catch((error) => {
        console.error(error);
        if (ativo) setErroMapa(true);
      });

    getCountries()
      .then((resultado) => ativo && setPaises(resultado))
      .catch((error) => {
        console.error(error);
        if (ativo) setErroPaises(true);
      });

    return () => {
      ativo = false;
    };
  }, []);

  const formasPorId = useMemo(
    () => new Map((mapa?.formas ?? []).map((forma) => [forma.id, forma])),
    [mapa]
  );

  const nomeDoPais = (id: string) =>
    paises?.get(id)?.nome ?? formasPorId.get(id)?.nomeIngles ?? "";

  const selecionarPais = async (id: string) => {
    setSelecionado(id);
    setCotacao(null);
    ultimoPedido.current = id;

    // Se os dados dos países ainda estiverem carregando, espera por eles
    // (depois da primeira vez, a resposta vem do cache na hora)
    let moeda: string | undefined;
    try {
      moeda = (await getCountries()).get(id)?.moedas[0]?.codigo;
    } catch {
      return; // o painel já mostra a mensagem de erro de carregamento
    }

    if (ultimoPedido.current !== id) return;

    // Sem moeda conhecida, ou o próprio real: não há cotação para buscar
    if (!moeda || moeda === "BRL") return;

    setCotacao({ status: "carregando" });

    try {
      const rates = await getRates(moeda);
      if (ultimoPedido.current !== id) return;

      const valor = rates.BRL;
      setCotacao(valor ? { status: "ok", valor } : { status: "erro" });
    } catch (error) {
      console.error(error);
      if (ultimoPedido.current === id) setCotacao({ status: "erro" });
    }
  };

  // Descobre qual país está sob o ponteiro pelo atributo data-id do <path>
  const idDoAlvo = (alvo: EventTarget) =>
    (alvo as Element).closest("[data-id]")?.getAttribute("data-id") ?? null;

  const aoMoverPonteiro = (e: PointerEvent<SVGSVGElement>) => {
    // No toque não existe "passar por cima", então a dica é só para o mouse
    if (e.pointerType !== "mouse") return;

    const id = idDoAlvo(e.target);
    const moldura = molduraRef.current;

    if (!id || !moldura) {
      setDica(null);
      return;
    }

    // A posição é calculada aqui, no evento, porque refs não podem ser
    // lidas durante a renderização. A etiqueta fica presa nas laterais.
    const retangulo = moldura.getBoundingClientRect();
    const x = e.clientX - retangulo.left;
    const y = e.clientY - retangulo.top;

    setDica({
      id,
      x: Math.min(Math.max(x, 110), retangulo.width - 110),
      y,
      abaixo: y < 70,
    });
  };

  const aoClicarNoMapa = (e: MouseEvent<SVGSVGElement>) => {
    const id = idDoAlvo(e.target);
    if (id) selecionarPais(id);
  };

  const infoSelecionado = selecionado ? paises?.get(selecionado) : undefined;
  const moedaPrincipal = infoSelecionado?.moedas[0];

  const textoCotacao = () => {
    if (!moedaPrincipal) return "—";
    if (moedaPrincipal.codigo === "BRL") return "Moeda de referência";
    if (!cotacao || cotacao.status === "carregando") return "Buscando cotação...";
    if (cotacao.status === "erro") return "Cotação indisponível no momento";
    return `1 ${moedaPrincipal.codigo} = ${formatarReal(cotacao.valor)}`;
  };

  const infoDica = dica ? paises?.get(dica.id) : undefined;

  return (
    <section id="mapa" className={styles.worldMap}>
      <SectionHeader
        icone={<IconeGlobo />}
        selo="Exploração interativa"
        titulo="Mapa Mundial"
        subtitulo="Escolha um país para descobrir sua moeda e curiosidades"
      />

      <div className={styles.layout}>
        {/* Área do mapa */}
        <div className={styles.mapCard}>
          <div>
            <h3 className={styles.mapTitle}>Mapa interativo</h3>
            <p className={styles.mapText}>
              Passe o mouse sobre um país para ver o nome e a moeda. Clique ou
              toque para ver todos os detalhes.
            </p>
          </div>

          <div
            className={styles.mapFrame}
            ref={molduraRef}
            style={mapa ? { aspectRatio: `${LARGURA} / ${mapa.altura}` } : undefined}
          >
            {mapa ? (
              <svg
                className={styles.map}
                viewBox={`0 0 ${LARGURA} ${mapa.altura}`}
                role="img"
                aria-label="Mapa mundial. Use os botões abaixo do mapa para escolher um país pelo teclado."
                onPointerMove={aoMoverPonteiro}
                onPointerLeave={() => setDica(null)}
                onClick={aoClicarNoMapa}
              >
                <defs>
                  <linearGradient id={gradienteId} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#14b8a6" />
                  </linearGradient>
                </defs>
                <Paises formas={mapa.formas} selecionado={selecionado} gradienteId={gradienteId} />
              </svg>
            ) : (
              <p className={styles.mapStatus}>
                {erroMapa ? "Não foi possível carregar o mapa." : "Carregando mapa..."}
              </p>
            )}

            {/* Etiqueta que acompanha o mouse */}
            {dica && (
              <div
                className={styles.tooltip}
                style={{
                  left: dica.x,
                  top: dica.y,
                  transform: dica.abaixo ? "translate(-50%, 18px)" : undefined,
                }}
                aria-hidden="true"
              >
                {infoDica && (
                  <img className={styles.tooltipFlag} src={infoDica.bandeira} alt="" width={24} height={18} />
                )}
                <div>
                  <p className={styles.tooltipName}>{nomeDoPais(dica.id)}</p>
                  {infoDica?.moedas[0] && (
                    <p className={styles.tooltipCurrency}>
                      {infoDica.moedas[0].nome} ({infoDica.moedas[0].codigo})
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className={styles.shortcuts}>
            <p className={styles.shortcutsLabel}>Ou escolha um país:</p>
            <ul className={styles.chips}>
              {atalhos.map((atalho) => (
                <li key={atalho.ccn3}>
                  <button
                    type="button"
                    className={styles.chip}
                    aria-pressed={selecionado === atalho.ccn3}
                    onClick={() => selecionarPais(atalho.ccn3)}
                  >
                    <IconePino className={styles.chipIcon} />
                    {atalho.nome}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Painel de informações */}
        <aside className={styles.infoCard} aria-labelledby="info-pais-titulo">
          <div>
            <h3 id="info-pais-titulo" className={styles.infoTitle}>
              <IconePino className={styles.infoTitleIcon} />
              Informações do país
            </h3>
            <p className={styles.infoDescription}>Clique em um país para ver os detalhes</p>
          </div>

          <div className={styles.infoBody} aria-live="polite">
            {!selecionado ? (
              <div className={styles.empty}>
                <IconeGlobo className={styles.emptyIcon} />
                <p>Nenhum país selecionado ainda</p>
              </div>
            ) : !infoSelecionado ? (
              <div className={styles.empty}>
                <IconeGlobo className={styles.emptyIcon} />
                <p>
                  {!paises && !erroPaises
                    ? "Carregando informações..."
                    : erroPaises
                      ? "Não foi possível carregar os dados dos países. Tente novamente mais tarde."
                      : `Não há informações disponíveis para ${nomeDoPais(selecionado) || "este território"}.`}
                </p>
              </div>
            ) : (
              <div className={styles.details}>
                <div className={styles.countryHeader}>
                  <img className={styles.flag} src={infoSelecionado.bandeira} alt="" width={56} height={42} />
                  <div>
                    <p className={styles.countryName}>{infoSelecionado.nome}</p>
                    <p className={styles.currencyName}>
                      {infoSelecionado.moedas.map((m) => m.nome).join(" e ") || "Sem moeda oficial própria"}
                    </p>
                  </div>
                </div>

                <dl className={styles.facts}>
                  <div className={styles.fact}>
                    <dt>Moeda</dt>
                    <dd>{infoSelecionado.moedas.map((m) => m.codigo).join(", ") || "—"}</dd>
                  </div>
                  <div className={styles.fact}>
                    <dt>Símbolo</dt>
                    <dd>{moedaPrincipal?.simbolo ?? "—"}</dd>
                  </div>
                  <div className={styles.fact}>
                    <dt>Capital</dt>
                    <dd>{infoSelecionado.capital || "—"}</dd>
                  </div>
                  <div className={styles.fact}>
                    <dt>Região</dt>
                    <dd>{infoSelecionado.regiao}</dd>
                  </div>
                  <div className={`${styles.fact} ${styles.factWide}`}>
                    <dt>População</dt>
                    <dd>{formatarPopulacao(infoSelecionado.populacao)} habitantes</dd>
                  </div>
                  <div className={`${styles.fact} ${styles.factWide}`}>
                    <dt>Cotação</dt>
                    <dd>{textoCotacao()}</dd>
                  </div>
                </dl>

                {moedaPrincipal && curiosidadesPorMoeda[moedaPrincipal.codigo] && (
                  <div className={styles.curiosity}>
                    <p className={styles.curiosityLabel}>Você sabia?</p>
                    <p className={styles.curiosityText}>
                      {curiosidadesPorMoeda[moedaPrincipal.codigo]}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}

export default WorldMap;