import React, { useEffect, useRef, useState } from 'react';
import SpatialWorld from './scene/SpatialWorld.jsx';
import {
  site, hero, chapters, seleccion, advisorySubstages, evaluacionInicial,
  dossierItems, reserva, faq, empresas, cierre, waLink
} from './legacy/Data/Content.js';
import { disciplines } from './legacy/Data/Disciplines.js';
import { existingPlans, kitInicio } from './legacy/Data/Programs.js';
import { RUTAS } from './legacy/Data/Legal.js';

class SpatialBoundary extends React.Component {
  constructor(props) { super(props); this.state = { failed: false }; }
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error) { console.error('SML spatial scene unavailable:', error); }
  render() { return this.state.failed ? <div className="world-fallback" aria-hidden="true" /> : this.props.children; }
}

const navItems = [
  ['inicio', 'Inicio'], ['descubrir', 'Descubrir'], ['metodo', 'Método'],
  ['entrenamiento', 'Precios'], ['alex', 'Sobre Alex'], ['reserva', 'Reservar'],
  ['empresas', 'Empresas'],
];
const money = (value) => `${value} €`;

function App() {
  const [active, setActive] = useState('inicio');
  const [menuOpen, setMenuOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(-1);
  const [mode, setMode] = useState(null);
  const [discipline, setDiscipline] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const scrollProgress = useRef(0);
  const methodProgress = useRef(0);
  const methodActive = useRef(false);
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
    const updateProgress = () => {
      const range = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress.current = range > 0 ? window.scrollY / range : 0;
      const section = document.getElementById('metodo');
      if (section) {
        const rect = section.getBoundingClientRect();
        const travel = Math.max(1, rect.height - window.innerHeight);
        methodProgress.current = Math.max(0, Math.min(1, -rect.top / travel));
        methodActive.current = rect.top <= 0 && rect.bottom >= window.innerHeight;
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
  const selectedDiscipline = disciplines.find((item) => item.id === discipline);
  const formatPlans = existingPlans.filter((plan) => plan.tipo === 'formato');
  const monthlyPlans = existingPlans.filter((plan) => plan.tipo === 'mensual');

  return <>
    <a className="skip-link" href="#contenido">Saltar al contenido</a>
    <SpatialBoundary><SpatialWorld progress={scrollProgress} methodProgress={methodProgress} methodActive={methodActive} /></SpatialBoundary>
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
        <div className="hero-kicker">PERSONAL COMBAT SPORTS LAB · {site.ciudad.toUpperCase()}</div>
        <p className="hero-overline">{hero.kicker}</p>
        <h1>{hero.titulo.map((line, i) => <React.Fragment key={line}>{line}{i < hero.titulo.length - 1 && <br/>}</React.Fragment>)}</h1>
        <p className="hero-disciplines">{hero.disciplinasLinea}</p>
        <p className="hero-context">{hero.contexto}</p>
        <div className="hero-actions">
          <a className="primary-cta" href={site.calendly} target="_blank" rel="noopener noreferrer">Reservar evaluación · 30 € ↗</a>
          <button className="secondary-cta" type="button" onClick={() => go('descubrir')}>No sé qué necesito · Descubrir</button>
        </div>
        <div className="hero-proof">{hero.confianza}</div>
        <div className="hero-quicklinks"><button type="button" onClick={() => go('entrenamiento')}>Ver precios</button><button type="button" onClick={() => go('empresas')}>Empresas y eventos</button></div>
        <div className="scroll-cue">SCROLL TO EXPLORE ↓</div>
      </section>

      <section id="descubrir" className="journey-section content-section">
        <div className="section-meta"><span>{chapters[1]?.n} / 06</span><span>DESCUBRIR</span></div>
        <p className="eyebrow">ANTES DE ELEGIR</p><h2>{seleccion.pregunta}</h2>
        {seleccion.lead && <p className="lead">{seleccion.lead}</p>}
        <p className="section-note">{seleccion.formasNota}</p>
        <div className="choice-grid">
          {seleccion.formas.map((item, i) => <button type="button" className={mode === item.id ? 'choice-card selected' : 'choice-card'} key={item.id} aria-expanded={mode === item.id} onClick={() => setMode(mode === item.id ? null : item.id)}>
            <small>0{i + 1}</small><h3>{item.titulo}</h3><strong>{item.concepto}</strong>
            {mode === item.id && <><p>{item.texto}</p>{item.destacada && <p className="choice-highlight">{item.destacada.join(' ')}</p>}<ul>{item.etiquetas?.map((tag) => <li key={tag}>{tag}</li>)}</ul>{item.cierre && <p className="choice-close">{item.cierre}</p>}</>}
            <span>{mode === item.id ? 'CERRAR −' : 'EXPLORAR +'}</span>
          </button>)}
        </div>
        <div className="discipline-intro"><h3>{seleccion.puente.titulo}</h3><p>{seleccion.puente.forma.etiqueta} · {seleccion.puente.disciplina.etiqueta}</p></div>
        <p className="eyebrow">{seleccion.disciplinasIntro[0]}</p><p className="lead">{seleccion.disciplinasIntro[1]}</p>
        <div className="discipline-grid">
          {disciplines.map((item) => <button type="button" key={item.id} className={discipline === item.id ? 'discipline-card selected' : 'discipline-card'} aria-expanded={discipline === item.id} onClick={() => setDiscipline(discipline === item.id ? null : item.id)}><span>DISCIPLINA</span><h3>{item.name}</h3><p>{item.linea}</p><b>{discipline === item.id ? 'CERRAR −' : 'DESCUBRIR ↗'}</b></button>)}
        </div>
        {selectedDiscipline && <article className="discipline-detail" aria-live="polite">
          <p className="eyebrow">{selectedDiscipline.tagline}</p>
          {selectedDiscipline.descripcion.map((line) => <p key={line}>{line}</p>)}
          <h4>Cómo se entrena</h4><p>{selectedDiscipline.entrenamiento}</p>
          <div className="discipline-attributes">{selectedDiscipline.atributos.map((item) => <span key={item}>{item}</span>)}</div>
          <dl>{selectedDiscipline.glosario.map((item) => <div key={item.t}><dt>{item.t}</dt><dd>{item.d}</dd></div>)}</dl>
        </article>}
        <div className="service-copy"><strong>{seleccion.servicio.linea1}</strong><br/>{seleccion.servicio.linea2}<br/>{seleccion.servicio.linea3}</div>
        <button type="button" className="text-link section-next" onClick={() => go('metodo')}>Conoce cómo trabajamos →</button>
      </section>

      <section id="metodo" className="method-section journey-section">
        <div className="method-stage">
          <div className="method-copy">
            <div className="section-meta"><span>03 / 06</span><span>MÉTODO · LABORATORIO</span></div>
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
        <div className="section-meta"><span>04 / 06</span><span>ENTRENAMIENTO · FORMATOS Y PRECIOS</span></div>
        <p className="eyebrow">ELIGE CÓMO ENTRENAR</p><h2>Entrenamiento diseñado alrededor de ti.</h2>
        <p className="lead">Sesiones privadas y grupos reducidos. El material técnico está incluido y cada sesión dura 60 minutos.</p>
        <h3 className="subsection-title">Sesiones sueltas y formatos</h3>
        <div className="training-grid">
          {formatPlans.map((plan) => <article className="training-card" key={plan.id}><small>SESIÓN · 60 MIN</small><h3>{plan.nombre}</h3><strong className="plan-price">{money(plan.precio)}</strong><p className="plan-unit">{plan.unidad}</p><p>{plan.texto}</p>{plan.desde && <p className="plan-extra">{plan.desde}</p>}<a href={site.calendly} target="_blank" rel="noopener noreferrer">Consultar / reservar ↗</a></article>)}
        </div>
        <h3 className="subsection-title">Planes mensuales</h3>
        <div className="training-grid monthly-grid">
          {monthlyPlans.map((plan) => <article className="training-card monthly-card" key={plan.id}><small>{plan.sesionesSemana} {plan.sesionesSemana === 1 ? 'DÍA' : 'DÍAS'} / SEMANA</small><h3>{plan.nombre}</h3><strong className="plan-price">{money(plan.precio)}</strong><p className="plan-unit">{plan.unidad} · {plan.sesionesSemana * 4} sesiones de 60 min</p><p>{plan.lema}</p><ul>{plan.incluye.map((item) => <li key={item}>{item}</li>)}</ul><p className="plan-goal">{plan.objetivo}</p><a href={site.calendly} target="_blank" rel="noopener noreferrer">Empezar con evaluación ↗</a></article>)}
        </div>
        <div className="pricing-notes"><p><strong>Evaluación inicial · 30 €.</strong> Si después contratas Arsenal, Striker o Fight IQ, se descuentan del plan. No se descuentan en parejas ni en grupos.</p><p><strong>{kitInicio.nombre} · {money(kitInicio.precio)}.</strong> {kitInicio.contenido}. Opcional.</p><p>Los grupos se forman por zona, disponibilidad y frecuencia. Máximo 4 personas; si aún no existe uno compatible, puedes dejar tu disponibilidad para ayudar a formarlo.</p></div>
        <button type="button" className="text-link section-next" onClick={() => go('reserva')}>Reservar evaluación inicial →</button>
      </section>

      <section id="alex" className="journey-section content-section founder-section">
        <div className="section-meta"><span>05 / 06</span><span>SOBRE ALEX</span></div>
        <p className="eyebrow">COACH / COMPETIDOR</p><h2>Experiencia dentro y fuera del ring.</h2>
        {dossierItems.filter((item) => item.id !== 'metodo').map((item) => <article className="proof-card" key={item.id}><small>{item.label}</small>{item.titulo && <h3>{item.titulo}</h3>}{item.datos?.map(([a, b]) => <p key={a}><b>{a}:</b> {b}</p>)}{item.texto?.map((line, i) => <p key={i}>{line}</p>)}{item.resenas?.map((review, i) => <blockquote key={i}>“{review}”</blockquote>)}{item.enlace && <a href={item.enlace.href} target="_blank" rel="noopener noreferrer">{item.enlace.label} ↗</a>}</article>)}
      </section>

      <section id="reserva" className="journey-section content-section booking-section">
        <div className="section-meta"><span>06 / 06</span><span>RESERVA</span></div>
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
