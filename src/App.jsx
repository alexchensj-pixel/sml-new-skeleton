import React, { useEffect, useMemo, useState } from 'react';
import SpatialWorld from './scene/SpatialWorld.jsx';
import {
  site, hero, chapters, seleccion, advisorySubstages, evaluacionInicial,
  dossierItems, reserva, faq, empresas, cierre, waLink
} from './legacy/Data/Content.js';

class SpatialBoundary extends React.Component {
  constructor(props) { super(props); this.state = { failed: false }; }
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error) { console.error('SML spatial scene unavailable:', error); }
  render() { return this.state.failed ? <div className="world-fallback" aria-hidden="true" /> : this.props.children; }
}

const navItems = [
  ['inicio', 'Inicio'], ['descubrir', 'Descubrir'], ['metodo', 'Método'],
  ['entrenamiento', 'Entrenamiento'], ['alex', 'Sobre Alex'], ['reserva', 'Reserva'],
  ['empresas', 'Empresas']
];

function App() {
  const [active, setActive] = useState('inicio');
  const [menuOpen, setMenuOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(-1);
  const [mode, setMode] = useState(null);
  const [discipline, setDiscipline] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [methodProgress, setMethodProgress] = useState(0);
  const [methodActive, setMethodActive] = useState(false);

  useEffect(() => {
    const updateProgress = () => {
      const range = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(range > 0 ? window.scrollY / range : 0);
      const section = document.getElementById('metodo');
      if (section) { const rect = section.getBoundingClientRect(); const travel = Math.max(1, rect.height - window.innerHeight); setMethodProgress(Math.max(0, Math.min(1, -rect.top / travel))); setMethodActive(rect.top <= 0 && rect.bottom >= window.innerHeight); }
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    return () => { window.removeEventListener('scroll', updateProgress); window.removeEventListener('resize', updateProgress); };
  }, []);

  const activeMethodIndex = Math.min(4, Math.floor(Math.max(0, Math.min(.999, methodProgress)) * 5));

  const progress = useMemo(() => {
    const ids = navItems.map(([id]) => id);
    const index = Math.max(0, ids.indexOf(active));
    return index / (ids.length - 1);
  }, [active]);

  const go = (id) => {
    setActive(id);
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return <>
    <SpatialBoundary><SpatialWorld progress={{ current: scrollProgress }} methodProgress={{ current: methodProgress }} methodActive={{ current: methodActive }} /></SpatialBoundary>
    <div className="grain" aria-hidden="true" />
    <header className="topbar">
      <a className="brand" href="#inicio" onClick={e => { e.preventDefault(); go('inicio'); }}>
        <span className="brand-mark">S<span>/</span>ML</span>
        <span className="brand-caption">STRIKING MOTION LAB<br/>MADRID</span>
      </a>
      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Abrir navegación"><span/><span/></button>
      <nav className={menuOpen ? 'nav nav-open' : 'nav'}>
        {navItems.map(([id, label]) => <button key={id} onClick={() => go(id)}>{label}</button>)}
        <a href="/academia">ACADEMIA ↗</a><a href="/mi-sml">MI SML ↗</a>
      </nav>
      <span className="top-index">SPATIAL EXPERIENCE / 001</span>
    </header>

    <main id="inicio">
      <section className="hero journey-section">
        <div className="hero-kicker">PERSONAL COMBAT SPORTS LAB · {site.ciudad.toUpperCase()}</div>
        <p className="hero-overline">{hero.kicker}</p>
        <h1>{hero.titulo.map((line, i) => <React.Fragment key={line}>{line}{i < hero.titulo.length - 1 && <br/>}</React.Fragment>)}</h1>
        <p className="hero-disciplines">{hero.disciplinasLinea}</p>
        <p className="hero-context">{hero.contexto}</p>
        <div className="hero-actions">
          <a className="primary-cta" href={site.calendly}> {hero.ctaReservar} ↗</a>
          <button className="secondary-cta" onClick={() => go('descubrir')}>{hero.ctaExplorar}</button>
        </div>
        <div className="hero-proof">{hero.confianza}</div>
        <div className="scroll-cue">SCROLL TO EXPLORE ↓</div>
      </section>

      <section id="descubrir" className="journey-section content-section">
        <div className="section-meta"><span>{chapters[1]?.n} / 06</span><span>DESCUBRIR</span></div>
        <p className="eyebrow">ANTES DE ELEGIR</p><h2>{seleccion.pregunta}</h2><p className="lead">{seleccion.lead}</p>
        <p className="section-note">{seleccion.formasNota}</p>
        <div className="choice-grid">
          {seleccion.formas.map((item, i) => <button className={mode === item.id ? 'choice-card selected' : 'choice-card'} key={item.id} onClick={() => setMode(mode === item.id ? null : item.id)}>
            <small>0{i + 1}</small><h3>{item.titulo}</h3><strong>{item.concepto}</strong>
            {mode === item.id && <><p>{item.texto}</p><ul>{item.etiquetas?.map(tag => <li key={tag}>{tag}</li>)}</ul>{item.cierre && <p className="choice-close">{item.cierre}</p>}</>}
            <span>{mode === item.id ? 'CERRAR −' : 'EXPLORAR +'}</span>
          </button>)}
        </div>
        <div className="discipline-intro"><h3>{seleccion.puente.titulo}</h3><p>{seleccion.puente.forma.texto} · {seleccion.puente.disciplina.texto}</p></div>
        <p className="eyebrow">{seleccion.disciplinasIntro[0]}</p><p className="lead">{seleccion.disciplinasIntro[1]}</p>
        <div className="discipline-grid">
          {['Boxeo', 'K1 / Kickboxing', 'Muay Thai'].map(name => <button key={name} className={discipline === name ? 'discipline-card selected' : 'discipline-card'} onClick={() => setDiscipline(discipline === name ? null : name)}><span>DISCIPLINA</span><h3>{name}</h3><b>{discipline === name ? 'SELECCIONADO ✓' : 'DESCUBRIR ↗'}</b></button>)}
        </div>
        <p className="service-copy">{seleccion.servicio.linea1}<br/>{seleccion.servicio.linea2}<br/>{seleccion.servicio.linea3}</p>
      </section>

      <section id="metodo" className="method-section journey-section">
        <div className="method-stage">
          <div className="method-copy">
            <div className="section-meta"><span>03 / 06</span><span>MÉTODO · PROTOCOLO PERSONAL</span></div>
            <p className="eyebrow">UN PROCESO PERSONAL</p>
            <h2>{advisorySubstages[0].titular.map((line, i) => <React.Fragment key={line}>{line}{i === 0 && <br/>}</React.Fragment>)}</h2>
            <div className="method-evaluation">
              <span>{evaluacionInicial.kickerMetodo}</span>
              <div className="method-evaluation-title"><h3>{evaluacionInicial.titulo}</h3><strong>{evaluacionInicial.precio}</strong></div>
              <p>{evaluacionInicial.texto}</p>
              <p className="method-evaluation-note">{evaluacionInicial.nota}</p>
              <a className="primary-cta" href={site.calendly}>{evaluacionInicial.cta} ↗</a>
              <button className="text-link" onClick={() => setShowMore(!showMore)}>{showMore ? 'Cerrar información −' : evaluacionInicial.ctaMas + ' +'}</button>
              {showMore && <ul>{evaluacionInicial.mas.map(([a,b]) => <li key={a}><b>{a}:</b> {b}</li>)}</ul>}
            </div>
          </div>
          <div className="method-stations" aria-label="Cinco pasos del método">
            {advisorySubstages.slice(1).map((step, i) => <button className={activeMethodIndex === i ? 'method-station active' : 'method-station'} key={step.id} aria-current={activeMethodIndex === i ? 'step' : undefined} onClick={() => { const section=document.getElementById('metodo'); if(section){ const travel=section.offsetHeight-window.innerHeight; window.scrollTo({top:section.offsetTop+travel*((i+.5)/5),behavior:'smooth'}); } }}>
              <span className="station-number">{step.num}</span><span className="station-content"><strong>{step.n}</strong>{activeMethodIndex === i && <><span className="station-description">{step.texto}</span>{step.elementos && <span className="station-tags">{step.elementos.join(' · ')}</span>}{step.destacada && <span className="station-highlight">{step.destacada}</span>}</>}</span>
              {step.etiqueta && activeMethodIndex !== i && <small>{step.etiqueta}</small>}
            </button>)}
            <p className="method-closing">No solo entrenas. <span>Entiendes qué estás desarrollando.</span></p>
          </div>
          <span className="method-coordinate">LAB / 03 — {String(activeMethodIndex + 1).padStart(2,'0')} : 05</span>
        </div>
      </section>

      <section id="entrenamiento" className="journey-section content-section">
        <div className="section-meta"><span>04 / 06</span><span>ENTRENAMIENTO</span></div>
        <p className="eyebrow">FORMATO Y PROGRESIÓN</p><h2>Entrenamiento diseñado alrededor de ti.</h2>
        <div className="training-grid">{[
          ['01 / PRIVATE','Entrenamiento 1:1','Sesión individual adaptada a tu nivel y objetivo.'],
          ['02 / DUO','Entrena en pareja','Comparte sesión y progreso con otra persona.'],
          ['03 / SMALL GROUP','Grupos reducidos','Máximo cuatro personas, con correcciones técnicas.'],
          ['04 / B2B','Experiencias y eventos','Activaciones para hoteles, empresas y marcas.']
        ].map(([n,t,d]) => <article className="training-card" key={n}><small>{n}</small><h3>{t}</h3><p>{d}</p></article>)}</div>
        <div className="pricing-line"><span>1:1 · DESDE 30 €</span><span>PAREJAS · 20 € / PERSONA</span><span>GRUPOS · DESDE 15 €</span></div>
        <p className="material-note">Material incluido · 60 minutos · Madrid</p>
      </section>

      <section id="alex" className="journey-section content-section">
        <div className="section-meta"><span>05 / 06</span><span>SOBRE ALEX</span></div>
        <p className="eyebrow">COACH / FOUNDER</p><h2>Experiencia dentro y fuera del ring.</h2>
        {dossierItems.filter(item => item.id !== 'metodo').map(item => <article className="proof-card" key={item.id}><small>{item.label}</small>{item.titulo && <h3>{item.titulo}</h3>}{item.datos?.map(([a,b]) => <p key={a}><b>{a}:</b> {b}</p>)}{item.texto?.map((line,i) => <p key={i}>{line}</p>)}{item.enlace && <a href={item.enlace.href} target="_blank" rel="noreferrer">{item.enlace.label} ↗</a>}</article>)}
      </section>

      <section id="reserva" className="journey-section content-section booking-section">
        <div className="section-meta"><span>06 / 06</span><span>RESERVA</span></div>
        <p className="eyebrow">{reserva.subtitulo}</p><h2>{reserva.titulo}</h2><p className="lead">{reserva.texto}</p>
        <div className="booking-grid"><article><h3>{reserva.caminos.directo.titulo}</h3><p>{reserva.caminos.directo.accion}</p><a className="primary-cta" href={site.calendly}>Elegir día y hora ↗</a></article><article><h3>{reserva.caminos.dudas.titulo}</h3><p>{reserva.caminos.dudas.accion}</p><a className="secondary-cta" href={waLink(cierre.mensajeAsesoria)} target="_blank" rel="noreferrer">Pedir asesoramiento ↗</a></article></div>
        <h3>{reserva.despuesTitulo}</h3><ol className="booking-steps">{reserva.despues.map((item,i) => <li key={i}>{item}</li>)}</ol>
        <div className="faq"><h3>Preguntas frecuentes</h3>{faq.map((item,i) => <article key={item.q}><button onClick={() => setFaqOpen(faqOpen === i ? -1 : i)}>{item.q}<span>{faqOpen === i ? '−' : '+'}</span></button>{faqOpen === i && <p>{item.a}</p>}</article>)}</div>
      </section>

      <section id="empresas" className="journey-section content-section">
        <div className="section-meta"><span>EXTRA / B2B</span><span>PARTNERSHIPS</span></div>
        <p className="eyebrow">BRING THE LAB TO YOUR SPACE</p><h2>Experiencias de combate para equipos y espacios.</h2><p className="lead">{empresas.texto}</p>
        <div className="training-grid">{empresas.items.map(item => <article className="training-card" key={item.nombre}><h3>{item.nombre}</h3><p>{item.texto}</p></article>)}</div>
        <p>{empresas.ayuda}</p><a className="primary-cta" href={waLink(empresas.mensaje)} target="_blank" rel="noreferrer">Hablar de una colaboración ↗</a>
      </section>
    </main>
    <footer className="footer"><span>© {new Date().getFullYear()} {site.nombre}</span><span>{site.claim}</span><span><a href={site.instagram.url} target="_blank" rel="noreferrer">{site.instagram.handle}</a> · <a href="/academia">ACADEMIA</a> · <a href="/mi-sml">MI SML</a></span></footer>
  </>;
}
export default App;
