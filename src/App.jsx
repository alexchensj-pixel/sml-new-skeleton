import React, { useEffect, useRef, useState } from 'react';
import LegacyWorld from './scene/LegacyWorld.jsx';
import ExploreOverlay from './scene/ExploreOverlay.jsx';
import {
  site, hero, advisorySubstages, evaluacionInicial,
  dossierItems, reserva, faq, empresas, cierre, waLink
} from './legacy/Data/Content.js';
import { image } from './legacy/Data/Media.js';
import { existingPlans, kitInicio } from './legacy/Data/Programs.js';
import { RUTAS } from './legacy/Data/Legal.js';
import RecommendationRoulette from './scene/RecommendationRoulette.jsx';

class SpatialBoundary extends React.Component {
  constructor(props) { super(props); this.state = { failed: false }; }
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error) { console.error('SML spatial scene unavailable:', error); }
  render() { return this.state.failed ? <div className="world-fallback" aria-hidden="true" /> : this.props.children; }
}

const navItems = [
  ['inicio', 'Inicio'], ['metodo', 'Método'],
  ['entrenamiento', 'Precios'], ['alex', 'Sobre Alex'], ['reserva', 'Reservar'],
  ['empresas', 'Empresas'],
];
const money = (value) => `${value} €`;

const monthlyPlanCopy = {
  arsenal: {
    descriptor: 'FUNDAMENTOS',
    identity: 'Ideal si empiezas o quieres construir una buena base técnica.',
    intro: 'INCLUYE',
    highlights: ['Evaluación técnica inicial', 'Análisis técnico en vídeo', 'Comba de entrenamiento de boxeo'],
    cta: 'Empezar con Arsenal',
  },
  striker: {
    descriptor: 'DESARROLLO',
    identity: 'Ideal si quieres progresar con constancia y trabajar tu técnica.',
    intro: 'TODO ARSENAL +',
    highlights: ['Plan de entrenamiento personalizado', 'Biblioteca personalizada de ejercicios', 'Trabajo específico según objetivos'],
    cta: 'Reservar Striker',
    popular: true,
  },
  'fight-iq': {
    descriptor: 'DOMINIO',
    identity: 'Ideal si buscas entrenar con criterio de combate o avanzar hacia la competición.',
    intro: 'TODO STRIKER +',
    highlights: ['Preparación específica para combate', 'Estrategia y táctica', 'Desarrollo del estilo de pelea y sparring supervisado, progresivo y adaptado a tu nivel técnico; no es un requisito para empezar'],
    cta: 'Reservar Fight IQ',
  },
};

const planComparisonRows = [
  { label: 'Técnica y vídeo', arsenal: 'Evaluación + análisis en vídeo', striker: 'Incluido', fightIq: 'Incluido' },
  { label: 'Personalización', arsenal: '—', striker: 'Plan + biblioteca + objetivos', fightIq: 'Incluida' },
  { label: 'Estrategia y combate', arsenal: '—', striker: '—', fightIq: 'Táctica + estilo + sparring supervisado' },
  { label: 'Frecuencia', arsenal: '1 sesión/semana', striker: '2 sesiones/semana', fightIq: '3 sesiones/semana' },
];

function App() {
  const [active, setActive] = useState('inicio');
  const [menuOpen, setMenuOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(-1);
  const [showPlanComparison, setShowPlanComparison] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [activeService, setActiveService] = useState('individual');
  const methodProgress = useRef(0);
  const [activeMethodIndex, setActiveMethodIndex] = useState(0);

  useEffect(() => {
    const ids = navItems.map(([id]) => id);
    const nodes = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!('IntersectionObserver' in window)) return undefined;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    }, { rootMargin: '-25% 0px -55% 0px', threshold: [0, .15, .35, .6] });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const validTabs = new Set(['individual', 'parejas', 'grupos']);
    const syncTabFromHash = () => {
      const requested = window.location.hash.slice(1);
      if (validTabs.has(requested)) setActiveService(requested);
    };
    syncTabFromHash();
    window.addEventListener('hashchange', syncTabFromHash);
    return () => window.removeEventListener('hashchange', syncTabFromHash);
  }, []);

  useEffect(() => {
    const updateProgress = () => {
      const section = document.getElementById('metodo');
      if (section) {
        const rect = section.getBoundingClientRect();
        const travel = Math.max(1, rect.height - window.innerHeight);
        methodProgress.current = Math.max(0, Math.min(1, -rect.top / travel));
        const nextStep = Math.min(4, Math.floor(Math.max(0, Math.min(.999, methodProgress.current)) * 5));
        setActiveMethodIndex((current) => current === nextStep ? current : nextStep);
      }
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    return () => { window.removeEventListener('scroll', updateProgress); window.removeEventListener('resize', updateProgress); };
  }, []);

  const go = (id) => {
    setActive(id);
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const formatPlans = existingPlans.filter((plan) => plan.tipo === 'formato');
  const monthlyPlans = existingPlans.filter((plan) => plan.tipo === 'mensual');
  const individualFormat = formatPlans.find((plan) => plan.id === '1-1');
  const coupleFormat = formatPlans.find((plan) => plan.id === 'duo');
  const groupFormat = formatPlans.find((plan) => plan.id === 'grupo');
  const chooseService = (id) => {
    setActiveService(id);
    window.history.replaceState(null, '', `#${id}`);
  };
  const serviceTabs = [
    { id: 'individual', label: '1:1', detail: 'Seguimiento individual' },
    { id: 'parejas', label: 'Parejas', detail: 'Dos personas' },
    { id: 'grupos', label: 'Grupos reducidos', detail: 'Máximo 4 personas' },
  ];

  return <>
    <a className="skip-link" href="#contenido">Saltar al contenido</a>
    <SpatialBoundary><LegacyWorld /></SpatialBoundary>
    <ExploreOverlay />
    <div className="grain" aria-hidden="true" />
    <header className="topbar">
      <a className="brand" href="#inicio" onClick={(e) => { e.preventDefault(); go('inicio'); }} aria-label="Striking Motion Lab, inicio">
        <span className="brand-mark">S<span>/</span>ML</span>
        <span className="brand-caption">STRIKING MOTION LAB<br/>MADRID</span>
      </a>
      <button className="menu-toggle" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-controls="site-navigation" aria-label={menuOpen ? 'Cerrar navegación' : 'Abrir navegación'}><span/><span/></button>
      <nav id="site-navigation" className={menuOpen ? 'nav nav-open' : 'nav'} aria-label="Navegación principal">
        {navItems.map(([id, label]) => <button key={id} type="button" aria-current={active === id ? 'location' : undefined} onClick={() => go(id)}>{label}</button>)}
        <a href="/academia">Academia ↗</a><a href="/mi-sml">Mi SML ↗</a>
      </nav>
      <span className="top-index">SPATIAL EXPERIENCE / 001</span>
    </header>

    <main id="contenido">
      <section id="inicio" className="hero journey-section">
        <img className="hero-photo" src={image.heroLab} alt="" aria-hidden="true" decoding="async" fetchPriority="high" />
        <p className="hero-overline">{hero.kicker}</p>
        <h1>{hero.titulo.map((line, i) => <React.Fragment key={line}>{line}{i < hero.titulo.length - 1 && <br/>}</React.Fragment>)}</h1>
        <p className="hero-context">{hero.contexto}</p>
        <div className="hero-actions">
          <a className="primary-cta" href={site.calendly} target="_blank" rel="noopener noreferrer"><span>{hero.ctaReservar}</span><svg className="hero-cta-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg></a>
          <button className="secondary-cta" type="button" onClick={() => go('metodo')}>Conocer el método</button>
        </div>
        <div className="hero-proof">{hero.confianza}</div>
        <div className="hero-quicklinks"><button type="button" onClick={() => go('entrenamiento')}>Ver precios</button><button type="button" onClick={() => go('empresas')}>Empresas y eventos</button></div>
        <div className="scroll-cue">SCROLL TO EXPLORE ↓</div>
      </section>



      <section className="explore-dwell" role="region" aria-label="Selección de disciplinas y formas de entrenamiento" />

      <section id="metodo" className="method-section journey-section">
        <div className="method-stage">
          <div className="method-copy">
            <div className="section-meta"><span>02 / 05</span><span>MÉTODO · LABORATORIO</span></div>
            <p className="eyebrow">UN PROCESO PERSONAL</p>
            <h2>{advisorySubstages[0].titular.map((line, i) => <React.Fragment key={line}>{line}{i === 0 && <br/>}</React.Fragment>)}</h2>
            <div className="method-evaluation">
              <span>{evaluacionInicial.kickerMetodo}</span>
              <div className="method-evaluation-title"><h3>{evaluacionInicial.titulo}</h3><strong>{evaluacionInicial.precio}</strong></div>
              <p>{evaluacionInicial.texto}</p>
              <p className="method-evaluation-note">{evaluacionInicial.nota}</p>
              <a className="primary-cta" href={site.calendly} target="_blank" rel="noopener noreferrer">{evaluacionInicial.cta} ↗</a>
              <button className="text-link" type="button" aria-expanded={showMore} onClick={() => setShowMore((value) => !value)}>{showMore ? 'Cerrar información −' : `${evaluacionInicial.ctaMas} +`}</button>
              {showMore && <ul>{evaluacionInicial.mas.map(([a, b]) => <li key={a}><b>{a}:</b> {b}</li>)}</ul>}
            </div>
          </div>
          <div className="method-stations" aria-label="Cinco pasos del método">
            {advisorySubstages.slice(1).map((step, i) => <button type="button" className={activeMethodIndex === i ? 'method-station active' : 'method-station'} key={step.id} aria-current={activeMethodIndex === i ? 'step' : undefined} onClick={() => { const section = document.getElementById('metodo'); if (section) { const travel = section.offsetHeight - window.innerHeight; window.scrollTo({ top: section.offsetTop + travel * ((i + .5) / 5), behavior: 'smooth' }); } }}>
              <span className="station-number">{step.num}</span><span className="station-content"><strong>{step.n}</strong>{activeMethodIndex === i && <><span className="station-description">{step.texto}</span>{step.elementos && <span className="station-tags">{step.elementos.join(' · ')}</span>}{step.destacada && <span className="station-highlight">{step.destacada}</span>}</>}</span>
              {step.etiqueta && activeMethodIndex !== i && <small>{step.etiqueta}</small>}
            </button>)}
            <p className="method-closing">No solo entrenas. <span>Entiendes qué estás desarrollando.</span></p>
          </div>
          <span className="method-coordinate">LAB / 03 — {String(activeMethodIndex + 1).padStart(2, '0')} : 05</span>
        </div>
      </section>

      <section id="entrenamiento" className="journey-section content-section pricing-section">
        <div className="section-meta"><span>03 / 05</span><span>ENTRENAMIENTO · FORMATOS Y PRECIOS</span></div>
        <p className="eyebrow">ELIGE CÓMO ENTRENAR</p><h2 className="pricing-title">Entrenamiento diseñado alrededor de ti.</h2>
        <p className="pricing-social" aria-label="Valoración en Google: 5,0 estrellas y 18 reseñas">{site.rating.valor.replace('.', ',')} ★ · {site.rating.resenas} reseñas</p>
        <p className="lead">Sesiones privadas y grupos reducidos. El material técnico está incluido y cada sesión dura 60 minutos.</p>
        <nav className="pricing-tabs" role="tablist" aria-label="Tipo de entrenamiento">
          {serviceTabs.map((tab) => <a key={tab.id} id={`tab-${tab.id}`} href={`#${tab.id}`} role="tab" aria-selected={activeService === tab.id} aria-controls="service-pricing-panel" className={`pricing-tab ${activeService === tab.id ? 'is-active' : ''}`} onClick={(event) => { event.preventDefault(); chooseService(tab.id); }}>
            <strong>{tab.label}</strong><span>{tab.detail}</span>
          </a>)}
        </nav>
        <div id="service-pricing-panel" className="pricing-tab-panel" role="tabpanel" aria-labelledby={`tab-${activeService}`}>
          {activeService === 'individual' && <>
            <div className="plan-cards-heading">
              <div><p className="eyebrow">PLANES MENSUALES · 1:1</p><h3 className="subsection-title">Elige tu plan de entrenamiento.</h3></div>
              <p>Cada plan incluye el anterior y añade más frecuencia y trabajo específico.</p>
            </div>
            <div className="training-grid monthly-grid plan-grid">
              {monthlyPlans.map((plan) => {
                const card = monthlyPlanCopy[plan.id];
                const monthlySessions = plan.sesionesSemana * 4;
                const perSession = (plan.precio / monthlySessions).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                return <article className={`training-card monthly-card plan-card plan-card-${plan.id} ${card.popular ? 'is-popular' : ''}`} key={plan.id}>
                  <div className="plan-card-top"><span>{card.descriptor}</span>{card.popular && <strong className="plan-popular-badge">MÁS POPULAR</strong>}</div>
                  <h3>{plan.nombre}</h3>
                  <p className="plan-card-identity">{card.identity}</p>
                  <div className="plan-card-price"><strong>{money(plan.precio)}</strong><span>/ mes</span></div>
                  <p className="plan-card-per-session">{perSession} € / sesión</p>
                  <p className="plan-card-frequency">{plan.sesionesSemana} {plan.sesionesSemana === 1 ? 'sesión' : 'sesiones'} / semana <span>·</span> 60 min</p>
                  <div className="plan-card-content">
                    <p className="plan-card-intro">{card.intro}</p>
                    <ul>{card.highlights.map((item) => <li key={item}>{item}</li>)}</ul>
                  </div>
                  <a className="plan-card-action" href={waLink(`Hola, quiero información sobre el plan ${plan.nombre} y consultar disponibilidad.`)} target="_blank" rel="noopener noreferrer"><span>{card.cta} · {money(plan.precio)}/mes</span><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 17 17 7M8 7h9v9" /></svg></a>
                  <p className="plan-card-footnote">Empiezas con la evaluación (30 €), que se descuenta del plan.</p>
                </article>;
              })}
            </div>
            <div className="single-session-card">
              <div><small>SESIÓN INDIVIDUAL · 60 MIN</small><h3>Sesión suelta 1:1</h3><p>{individualFormat.texto}</p></div>
              <strong>{money(individualFormat.precio)} <span>/ sesión</span></strong>
              <a href={waLink('Hola, quiero consultar disponibilidad para una sesión individual 1:1.')} target="_blank" rel="noopener noreferrer">Consultar sesión <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 17 17 7M8 7h9v9" /></svg></a>
            </div>
            <div className="plan-comparison-control">
              <button type="button" className="plan-comparison-toggle" aria-expanded={showPlanComparison} aria-controls="plan-comparison" onClick={() => setShowPlanComparison((value) => !value)}>{showPlanComparison ? 'Ocultar comparación' : 'Comparar qué incluye cada plan'} <span>{showPlanComparison ? '−' : '+'}</span></button>
            </div>
            {showPlanComparison && <div id="plan-comparison" className="plan-comparison-panel">
              <div className="plan-comparison-scroll">
                <table className="plan-comparison-table">
                  <thead><tr><th scope="col">Atributo</th><th scope="col">Arsenal</th><th scope="col">Striker</th><th scope="col">Fight IQ</th></tr></thead>
                  <tbody>{planComparisonRows.map((row) => <tr key={row.label}><th scope="row">{row.label}</th><td>{row.arsenal}</td><td>{row.striker}</td><td>{row.fightIq}</td></tr>)}</tbody>
                </table>
              </div>
            </div>}
            <div className="service-terms"><p>La evaluación inicial cuesta 30 € y se descuenta si después contratas un plan mensual. No hay permanencia. Los cambios de sesión deben avisarse con 24 h de antelación y pueden recuperarse dentro del mismo mes, según disponibilidad.</p></div>
          </>}
          {activeService === 'parejas' && <>
            <div className="plan-cards-heading"><div><p className="eyebrow">ENTRENAMIENTO COMPARTIDO</p><h3 className="subsection-title">Entrenad juntos.</h3></div><p>Una sesión privada para dos personas, adaptada a vuestro nivel y objetivos.</p></div>
            <article className="training-card format-service-card"><small>SESIÓN · 60 MIN · 2 PERSONAS</small><h3>Parejas</h3><div className="format-service-price">{money(coupleFormat.precio)} <span>/ persona / sesión</span></div><p>{coupleFormat.texto}</p><a href={waLink('Hola, quiero consultar disponibilidad para entrenar en pareja.')} target="_blank" rel="noopener noreferrer">Consultar disponibilidad <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 17 17 7M8 7h9v9" /></svg></a></article>
            <div className="service-terms"><p>Tarifa por persona. La evaluación inicial de 30 € no se descuenta de las sesiones en pareja. No hay permanencia; los cambios deben avisarse con 24 h de antelación y la recuperación depende de la disponibilidad.</p></div>
          </>}
          {activeService === 'grupos' && <>
            <div className="plan-cards-heading"><div><p className="eyebrow">ENTRENAMIENTO EN EQUIPO</p><h3 className="subsection-title">Grupo reducido.</h3></div><p>Entrenamiento compartido, con atención técnica y un máximo de cuatro personas.</p></div>
            <article className="training-card format-service-card"><small>SESIÓN · 60 MIN · MÁXIMO 4 PERSONAS</small><h3>Grupos reducidos</h3><div className="format-service-price">{money(groupFormat.precio)} <span>/ persona / sesión</span></div><p>{groupFormat.texto}</p><p className="format-bonuses">{groupFormat.desde}</p><a href={waLink('Hola, quiero consultar si hay grupo reducido compatible con mi zona y disponibilidad.')} target="_blank" rel="noopener noreferrer">Consultar grupos en mi zona <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 17 17 7M8 7h9v9" /></svg></a></article>
            <div className="service-terms"><p>Los grupos se forman por zona, disponibilidad y frecuencia. Si aún no existe uno compatible, puedes dejar tu disponibilidad para ayudar a formarlo. No hay permanencia; los cambios deben avisarse con 24 h de antelación y la recuperación depende de la disponibilidad del grupo.</p></div>
          </>}
        </div>
        <div className="pricing-common-note"><p><strong>{kitInicio.nombre} · {money(kitInicio.precio)}.</strong> {kitInicio.contenido}. Opcional.</p></div>
        <RecommendationRoulette />
        <button type="button" className="text-link section-next" onClick={() => go('reserva')}>Reservar evaluación inicial →</button>
      </section>

      <section id="alex" className="journey-section content-section founder-section">
        <div className="section-meta"><span>04 / 05</span><span>SOBRE ALEX</span></div>
        <p className="eyebrow">COACH / COMPETIDOR</p><h2>Experiencia dentro y fuera del ring.</h2>
        {dossierItems.filter((item) => item.id !== 'metodo').map((item) => <article className="proof-card" key={item.id}><small>{item.label}</small>{item.titulo && <h3>{item.titulo}</h3>}{item.datos?.map(([a, b]) => <p key={a}><b>{a}:</b> {b}</p>)}{item.texto?.map((line, i) => <p key={i}>{line}</p>)}{item.resenas?.map((review, i) => <blockquote key={i}>“{review}”</blockquote>)}{item.enlace && <a href={item.enlace.href} target="_blank" rel="noopener noreferrer">{item.enlace.label} ↗</a>}</article>)}
      </section>

      <section id="reserva" className="journey-section content-section booking-section">
        <div className="section-meta"><span>05 / 05</span><span>RESERVA</span></div>
        <p className="eyebrow">{reserva.subtitulo}</p><h2>{reserva.titulo}</h2><p className="lead">{reserva.texto}</p>
        <div className="booking-grid"><article><h3>{reserva.caminos.directo.titulo}</h3><p>{reserva.caminos.directo.accion}</p><a className="primary-cta" href={site.calendly} target="_blank" rel="noopener noreferrer">Elegir día y hora ↗</a></article><article><h3>{reserva.caminos.dudas.titulo}</h3><p>{reserva.caminos.dudas.accion}</p><a className="secondary-cta" href={waLink(cierre.mensajeAsesoria)} target="_blank" rel="noopener noreferrer">Pedir asesoramiento ↗</a></article></div>
        <h3 className="subsection-title">Antes, durante y después</h3><ol className="booking-steps">{reserva.despues.map((item, i) => <li key={i}>{item}</li>)}</ol>
        <div className="faq"><h3>Preguntas frecuentes</h3>{faq.map((item, i) => <article key={item.q}><button type="button" aria-expanded={faqOpen === i} onClick={() => setFaqOpen(faqOpen === i ? -1 : i)}>{item.q}<span>{faqOpen === i ? '−' : '+'}</span></button>{faqOpen === i && <p>{item.a}</p>}</article>)}</div>
      </section>

      <section id="empresas" className="journey-section content-section business-section">
        <div className="section-meta"><span>EXTRA / B2B</span><span>PARTNERSHIPS</span></div>
        <p className="eyebrow">BRING THE LAB TO YOUR SPACE</p><h2>Experiencias de combate para equipos y espacios.</h2><p className="lead">{empresas.texto}</p>
        <div className="training-grid">{empresas.items.map((item) => <article className="training-card" key={item.nombre}><h3>{item.nombre}</h3><p>{item.texto}</p></article>)}</div>
        <p>{empresas.ayuda}</p><a className="primary-cta" href={waLink(empresas.mensaje)} target="_blank" rel="noopener noreferrer">Hablar de una colaboración ↗</a>
      </section>
    </main>

    <footer className="footer footer-complete">
      <div><strong>{site.nombre}</strong><p>{site.claim} · {site.ciudad}</p><p>{site.disciplinas}</p></div>
      <div><strong>Contacto</strong><a href={waLink('Hola, quiero información sobre los entrenamientos.')} target="_blank" rel="noopener noreferrer">WhatsApp · {site.whatsappVisible}</a><a href={site.instagram.url} target="_blank" rel="noopener noreferrer">Instagram · {site.instagram.handle}</a><a href={site.maps} target="_blank" rel="noopener noreferrer">Google Maps</a></div>
      <div><strong>Acceso</strong><a href="/academia">Academia ↗</a><a href="/mi-sml">Mi SML ↗</a><a href={RUTAS.privacidad}>Política de privacidad</a><a href={RUTAS.aviso}>Aviso legal</a></div>
      <p className="footer-bottom">© {new Date().getFullYear()} Striking Motion Lab · Madrid, España. Los servicios se realizan con reserva previa.</p>
    </footer>
  </>;
}
export default App;
