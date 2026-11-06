import React, { useEffect, useRef, useState } from 'react';
import SpatialWorld from './scene/SpatialWorld.jsx';

const sections = [
  { id: 'training', number: '01', eyebrow: 'THE TRAINING FLOOR', title: <>TRAIN<br/><em>WITH INTENT.</em></>, copy: 'Boxeo · Kickboxing · Muay Thai. Entrenamiento personalizado, técnica aplicada y progreso medible.', action: 'Ver disciplinas' },
  { id: 'method', number: '02', eyebrow: 'THE METHOD', title: <>BUILT<br/><em>AROUND YOU.</em></>, copy: 'Te conocemos. Observamos cómo te mueves. Diseñamos cada sesión para tu nivel, tu objetivo y tu evolución.', action: 'Conocer el método' },
  { id: 'about', number: '03', eyebrow: 'COACH / FOUNDER', title: <>COACHING<br/><em>WITH PURPOSE.</em></>, copy: 'Un enfoque técnico y cercano, dirigido por Alex Chen: formación en deportes de contacto, experiencia competitiva y atención individual.', action: 'Entrar en contacto' },
  { id: 'groups', number: '04', eyebrow: 'SMALL GROUPS', title: <>YOUR TEAM.<br/><em>YOUR PACE.</em></>, copy: 'Grupos reducidos de máximo 4 personas. Aprende desde cero, mejora tu técnica y entrena con un equipo cercano.', action: 'Consultar plazas' },
  { id: 'analysis', number: '05', eyebrow: 'MOVEMENT ANALYSIS', title: <>SEE IT.<br/><em>REFINE IT.</em></>, copy: 'Analizamos tu movimiento, técnica, guardia, desplazamientos y combinaciones. Vídeo y observaciones para convertir sensaciones en mejoras concretas.', action: 'Ver mi espacio SML' },
  { id: 'partners', number: '06', eyebrow: 'EVENTS / PARTNERSHIPS', title: <>BRING THE LAB<br/><em>TO YOUR SPACE.</em></>, copy: 'Experiencias de boxeo, kickboxing y Muay Thai para hoteles, empresas, marcas y eventos. SML aporta entrenador, material y gestión.', action: 'Proponer colaboración' },
  { id: 'contact', number: '07', eyebrow: 'ENTER THE LAB', title: <>YOUR MOVE<br/><em>STARTS HERE.</em></>, copy: 'Sesiones 1:1, parejas y grupos reducidos en Madrid. Entrenamos en distintas zonas, en casa, al aire libre o en espacios colaboradores.', action: 'Reservar / preguntar' }
];

const services = [
  ['01 / PRIVATE', 'Entrenamiento 1:1', 'Sesión individual adaptada a tu nivel, objetivo y ritmo.'],
  ['02 / DUO', 'Entrena en pareja', 'Comparte sesión y progreso con otra persona.'],
  ['03 / SMALL GROUP', 'Grupos reducidos', 'Máximo 4 personas. Técnica, aprendizaje y energía de equipo.'],
  ['04 / B2B', 'Experiencias y eventos', 'Activaciones para hoteles, empresas, marcas y eventos.']
];

export default function App() {
  const progress = useRef(0);
  const [active, setActive] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.current = max > 0 ? window.scrollY / max : 0;
      const marker = window.scrollY + window.innerHeight * 0.55;
      let current = 0;
      sections.forEach((section, index) => {
        const node = document.getElementById(section.id);
        if (node && marker >= node.offsetTop) current = index;
      });
      setActive(current);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  const go = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <SpatialWorld progress={progress} />
      <div className="grain" aria-hidden="true" />
      <header className="topbar">
        <a className="brand" href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          <span className="brand-mark">S<span>/</span>ML</span><span className="brand-caption">STRIKING MOTION LAB<br/>MADRID · EST. 2025</span>
        </a>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Abrir navegación"><span/><span/></button>
        <nav className={menuOpen ? 'nav nav-open' : 'nav'}>
          {sections.map((s) => <button key={s.id} onClick={() => go(s.id)}>{s.eyebrow}</button>)}
          <a href="/academia">ACADEMIA ↗</a>
          <a href="/mi-sml">MI SML ↗</a>
        </nav>
        <span className="top-index">SPATIAL EXPERIENCE / 001</span>
      </header>

      <main id="top">
        <section className="hero" aria-label="Striking Motion Lab">
          <div className="hero-kicker"><span className="live-dot"/> PERSONAL COMBAT SPORTS LAB <span>·</span> MADRID</div>
          <div className="hero-title-wrap">
            <p className="hero-overline">MOVE WITH INTENT</p>
            <h1>STRIKING<br/><span>MOTION</span><b>LAB.</b></h1>
          </div>
          <div className="hero-bottom">
            <p>TRAINING IS NOT<br/>ABOUT FIGHTING.<br/><strong>IT'S ABOUT HOW YOU MOVE.</strong></p>
            <button className="round-cta" onClick={() => go('training')} aria-label="Entrar en el laboratorio"><span>ENTER<br/>THE LAB</span><b>↘</b></button>
          </div>
          <div className="hero-coordinate">40°25' N&nbsp; 3°42' W<br/>MADRID / SPAIN</div>
          <div className="scroll-cue"><span/> SCROLL TO EXPLORE</div>
        </section>

        <section className="journey-section section-1" id="training">
          <div className="section-meta"><span>01 / 07</span><span>THE TRAINING FLOOR</span></div>
          <div className="section-content">
            <p className="section-kicker"><i/> TRAINING / DISCIPLINES</p>
            <h2>TRAIN<br/><em>WITH INTENT.</em></h2>
            <p className="section-copy">Boxeo, Kickboxing K1 y Muay Thai. Entrenamiento técnico y personalizado para adultos, desde iniciación hasta objetivos de rendimiento.</p>
            <div className="discipline-list"><span>BOXING</span><span>KICKBOXING / K1</span><span>MUAY THAI</span></div>
            <div className="sml-detail-grid">{services.map((item) => <article className="sml-detail" key={item[0]}><small>{item[0]}</small><h3>{item[1]}</h3><p>{item[2]}</p></article>)}</div>
            <a className="text-cta" href="/academia">Explorar academia <b>↗</b></a>
          </div>
          <div className="section-side-note">STRIKING MOTION LAB <span>—</span> MADRID</div>
        </section>

        <section className="journey-section section-2" id="method">
          <div className="section-meta"><span>02 / 07</span><span>THE METHOD</span></div>
          <div className="section-content">
            <p className="section-kicker"><i/> PERSONAL TRAINING SYSTEM</p>
            <h2>BUILT<br/><em>AROUND YOU.</em></h2>
            <p className="section-copy">No seguimos una plantilla genérica. Cada proceso parte de tu punto de partida y evoluciona contigo.</p>
            <div className="method-steps"><span>01 / TE CONOZCO</span><span>02 / TE OBSERVO</span><span>03 / ENTRENAMOS</span><span>04 / SEGUIMOS</span></div>
            <p className="section-copy">Evaluación inicial, objetivos claros, observación técnica y seguimiento. Trabajamos guardia, biomecánica, desplazamientos, defensa, combinaciones, estrategia y preparación para sparring cuando corresponde.</p>
          </div>
          <div className="section-side-note">OBSERVE <span>—</span> TRAIN <span>—</span> EVOLVE</div>
        </section>

        <section className="journey-section section-3" id="about">
          <div className="section-meta"><span>03 / 07</span><span>COACH / FOUNDER</span></div>
          <div className="section-content">
            <p className="section-kicker"><i/> THE PERSON BEHIND THE LAB</p>
            <h2>COACHING<br/><em>WITH PURPOSE.</em></h2>
            <p className="section-copy">Soy Alex Chen. Competidor y entrenador de deportes de contacto. Mi recorrido combina formación técnica, competición y trabajo individual con alumnos de distintos niveles.</p>
            <div className="discipline-list"><span>FEKM / WAKO</span><span>COMPETITION EXPERIENCE</span><span>MADRID</span></div>
            <p className="section-copy">SML nace para acercar el entrenamiento de combate a personas que quieren aprender bien, ganar confianza y moverse mejor, sin necesitar entrar en un gimnasio de competición.</p>
            <a className="text-cta" href="https://www.instagram.com/strikingmotionlab/" target="_blank" rel="noreferrer">Conocer SML <b>↗</b></a>
          </div>
          <div className="section-side-note">TECHNIQUE <span>—</span> CLARITY <span>—</span> PROGRESS</div>
        </section>

        <section className="journey-section section-1" id="groups">
          <div className="section-meta"><span>04 / 07</span><span>SMALL GROUPS</span></div>
          <div className="section-content">
            <p className="section-kicker"><i/> TRAIN TOGETHER</p>
            <h2>YOUR TEAM.<br/><em>YOUR PACE.</em></h2>
            <p className="section-copy">Grupos de máximo 4 personas. No necesitas experiencia previa: las sesiones se adaptan al nivel del grupo y cada alumno recibe correcciones técnicas.</p>
            <div className="sml-detail-grid">
              <article className="sml-detail"><small>WEEKEND / 10:00–11:00</small><h3>Estadio Metropolitano</h3><p>Sábados y domingos · Metro Estadio Metropolitano.</p></article>
              <article className="sml-detail"><small>WEEKEND / 11:00–12:00</small><h3>Parque de Roma</h3><p>Sábados y domingos · Metro Sainz de Baranda.</p></article>
            </div>
            <div className="discipline-list"><span>DROP-IN €15</span><span>4 CLASSES €55</span><span>8 CLASSES €95</span></div>
            <p className="section-copy">Material de entrenamiento incluido. Consulta disponibilidad por zona y plazas antes de venir.</p>
            <a className="text-cta" href="https://www.instagram.com/strikingmotionlab/" target="_blank" rel="noreferrer">Consultar disponibilidad <b>↗</b></a>
          </div>
          <div className="section-side-note">SMALL GROUPS <span>—</span> MAX 4</div>
        </section>

        <section className="journey-section section-2" id="analysis">
          <div className="section-meta"><span>05 / 07</span><span>MOVEMENT ANALYSIS</span></div>
          <div className="section-content">
            <p className="section-kicker"><i/> TECHNIQUE / VIDEO REVIEW</p>
            <h2>SEE IT.<br/><em>REFINE IT.</em></h2>
            <p className="section-copy">Movement Analysis convierte el vídeo de tus sesiones y ejercicios en observaciones concretas sobre técnica, equilibrio, guardia, desplazamientos, defensa y combinaciones.</p>
            <div className="method-steps"><span>UPLOAD</span><span>ANALYSE</span><span>COACH REVIEW</span><span>IMPROVE</span></div>
            <p className="section-copy">El análisis se prepara para revisión del entrenador antes de publicarse en tu espacio personal.</p>
            <a className="text-cta" href="/mi-sml">Entrar en Mi SML <b>↗</b></a>
          </div>
          <div className="section-side-note">MOVEMENT ANALYSIS <span>—</span> MI SML</div>
        </section>

        <section className="journey-section section-3" id="partners">
          <div className="section-meta"><span>06 / 07</span><span>EVENTS / PARTNERSHIPS</span></div>
          <div className="section-content">
            <p className="section-kicker"><i/> B2B / BRAND EXPERIENCES</p>
            <h2>BRING THE LAB<br/><em>TO YOUR SPACE.</em></h2>
            <p className="section-copy">Diseñamos experiencias de boxeo, kickboxing y Muay Thai para hoteles, empresas, marcas, espacios deportivos y eventos privados.</p>
            <div className="discipline-list"><span>HOTELS</span><span>COMPANIES</span><span>BRANDS</span><span>EVENTS</span></div>
            <p className="section-copy">SML aporta entrenador, material, diseño de actividad y gestión. El partner aporta espacio y audiencia. Formatos individuales, parejas, grupos y activaciones participativas.</p>
            <a className="text-cta" href="mailto:info@strikingmotionlab.com">Proponer colaboración <b>↗</b></a>
          </div>
          <div className="section-side-note">PARTNER <span>—</span> ACTIVATE <span>—</span> EXPERIENCE</div>
        </section>

        <section className="journey-section section-1" id="contact">
          <div className="section-meta"><span>07 / 07</span><span>ENTER THE LAB</span></div>
          <div className="section-content">
            <p className="section-kicker"><i/> START YOUR TRAINING</p>
            <h2>YOUR MOVE<br/><em>STARTS HERE.</em></h2>
            <p className="section-copy">Sesiones 1:1, parejas y grupos reducidos en Madrid. Entrenamos en distintas zonas, en casa, al aire libre o en espacios colaboradores. Material incluido en las sesiones.</p>
            <div className="sml-detail-grid">
              <article className="sml-detail"><small>1:1 / 60 MIN</small><h3>Desde €30</h3><p>Sesión individual. Bonos de 4, 8 y 12 sesiones disponibles.</p></article>
              <article className="sml-detail"><small>COUPLES</small><h3>€20 / persona</h3><p>Entrenamiento compartido en pareja.</p></article>
              <article className="sml-detail"><small>SMALL GROUP</small><h3>Desde €15</h3><p>Clase suelta o bonos de 4 y 8 clases.</p></article>
            </div>
            <div className="method-steps"><span>ESPAÑOL</span><span>ENGLISH</span><span>中文</span></div>
            <a className="text-cta" href="https://www.instagram.com/strikingmotionlab/" target="_blank" rel="noreferrer">Contactar / reservar <b>↗</b></a>
            <a className="text-cta" href="/academia">Ver academia <b>↗</b></a>
            <a className="text-cta" href="/mi-sml">Acceder a Mi SML <b>↗</b></a>
          </div>
          <div className="section-side-note">STRIKING MOTION LAB <span>—</span> MADRID</div>
        </section>
      </main>

      <div className="progress-rail"><span style={{ transform: `scaleY(${progress.current || 0})` }}/></div>
      <div className="chapter-indicator"><span>0{active + 1}</span><i/>{String(sections.length).padStart(2, '0')}</div>
      <footer className="footer"><span>© {new Date().getFullYear()} STRIKING MOTION LAB</span><span>MOVE WITH INTENT / 1% BETTER EVERYDAY</span><span><a href="/academia">ACADEMIA</a> · <a href="/mi-sml">MI SML</a> · <a href="https://www.instagram.com/strikingmotionlab/" target="_blank" rel="noreferrer">INSTAGRAM ↗</a></span></footer>
    </>
  );
}
