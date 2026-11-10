import React, { useEffect, useRef, useState } from 'react';
import SpatialWorld from './scene/SpatialWorld.jsx';
import './discover.css';

const sections = [
  { id: 'training', number: '01', eyebrow: 'THE TRAINING FLOOR', title: <>TRAIN<br/><em>WITH INTENT.</em></>, copy: 'Boxeo · Kickboxing · Muay Thai. Entrenamiento personalizado, técnica aplicada y progreso medible.', action: 'Ver disciplinas' },
  { id: 'discover', number: '02', eyebrow: 'FIND YOUR DISCIPLINE', title: <>DISCOVER<br/><em>YOUR STYLE.</em></>, copy: 'Tres disciplinas. Distintas formas de moverte, aprender y desarrollar tu combate.', action: 'Explorar disciplinas' },
  { id: 'method', number: '03', eyebrow: 'THE METHOD', title: <>BUILT<br/><em>AROUND YOU.</em></>, copy: 'Te conocemos. Observamos cómo te mueves. Diseñamos cada sesión para tu nivel, tu objetivo y tu evolución.', action: 'Descubrir el método' },
  { id: 'contact', number: '04', eyebrow: 'ENTER THE LAB', title: <>YOUR MOVE<br/><em>STARTS HERE.</em></>, copy: 'Sesiones 1:1, parejas y grupos reducidos en Madrid. Sin intimidación. Sin fórmulas genéricas.', action: 'Contactar con SML' }
];

const disciplines = [
  { id: 'boxing', name: 'BOXING', sub: 'PRECISION · DISTANCE · TIMING', text: 'Aprende a controlar la distancia, construir combinaciones y moverte con intención. Técnica de manos, defensa y lectura del ritmo.', tags: ['Técnica de golpeo', 'Defensa y esquivas', 'Desplazamientos'] },
  { id: 'kickboxing', name: 'KICKBOXING', sub: 'RHYTHM · COMBINATIONS · FLOW', text: 'Combina puños y patadas en un trabajo dinámico de coordinación, equilibrio y continuidad. Aprende a enlazar acciones con sentido.', tags: ['Puños y patadas', 'Combinaciones', 'Coordinación'] },
  { id: 'muaythai', name: 'MUAY THAI', sub: 'CONTROL · CLINCH · 8 LIMBS', text: 'Explora el uso de puños, codos, rodillas y piernas. Una disciplina completa para desarrollar control corporal, precisión y recursos técnicos.', tags: ['Ocho puntos de contacto', 'Rodillas y codos', 'Clinch y control'] }
];

export default function App() {
  const progress = useRef(0);
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState('boxing');
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

  const chosen = disciplines.find((item) => item.id === selected) || disciplines[0];

  return (
    <>
      <SpatialWorld progress={progress} />
      <div className="grain" aria-hidden="true" />
      <header className="topbar">
        <a className="brand" href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          <span className="brand-mark">S<span>/</span>ML</span>
          <span className="brand-caption">STRIKING MOTION LAB<br/>MADRID · EST. 2025</span>
        </a>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Abrir navegación"><span/><span/></button>
        <nav className={menuOpen ? 'nav nav-open' : 'nav'}>
          {sections.map((section) => <button key={section.id} onClick={() => go(section.id)}>{section.id === 'discover' ? 'DISCIPLINAS' : section.eyebrow}</button>)}
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
            <button className="round-cta" onClick={() => go('discover')} aria-label="Descubrir disciplinas"><span>DISCOVER<br/>DISCIPLINES</span><b>↘</b></button>
          </div>
          <div className="hero-coordinate">40°25′ N&nbsp; 3°42′ W<br/>MADRID / SPAIN</div>
          <div className="scroll-cue"><span/> SCROLL TO EXPLORE</div>
        </section>

        {sections.map((section, index) => (
          <section className={`journey-section section-${index + 1} ${section.id === 'discover' ? 'discover-section' : ''}`} id={section.id} key={section.id}>
            <div className="section-meta"><span>{section.number} / 04</span><span>{section.eyebrow}</span></div>
            {section.id === 'discover' ? (
              <div className="discover-layout">
                <div className="discover-intro">
                  <p className="section-kicker"><i/> CHOOSE YOUR WAY TO MOVE</p>
                  <h2>DISCOVER<br/><em>DISCIPLINES.</em></h2>
                  <p className="section-copy">No tienes que elegir una identidad. Empieza por descubrir qué técnica, ritmo y forma de entrenar encajan contigo.</p>
                  <div className="discipline-selector" role="tablist" aria-label="Selecciona una disciplina">
                    {disciplines.map((item, i) => <button key={item.id} role="tab" aria-selected={selected === item.id} className={selected === item.id ? 'discipline-tab is-selected' : 'discipline-tab'} onClick={() => setSelected(item.id)}><span>0{i + 1}</span>{item.name}<b>↗</b></button>)}
                  </div>
                </div>
                <article className="discipline-detail" aria-live="polite">
                  <div className="detail-topline"><span>DISCIPLINE / 0{disciplines.findIndex((item) => item.id === selected) + 1}</span><span>STRIKING MOTION LAB</span></div>
                  <div className="detail-visual"><div className="detail-orbit orbit-one"/><div className="detail-orbit orbit-two"/><span className="detail-number">0{disciplines.findIndex((item) => item.id === selected) + 1}</span><span className="detail-cross">+</span></div>
                  <p className="detail-sub">{chosen.sub}</p>
                  <h3>{chosen.name}</h3>
                  <p className="detail-copy">{chosen.text}</p>
                  <div className="detail-tags">{chosen.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                  <button className="text-cta" onClick={() => go('contact')}>ENTRENAR {chosen.name} <b>↗</b></button>
                </article>
              </div>
            ) : (
              <div className="section-content">
                <p className="section-kicker"><i/> {section.eyebrow}</p>
                <h2>{section.title}</h2>
                <p className="section-copy">{section.copy}</p>
                {section.id === 'training' && <div className="discipline-list"><span>BOXING</span><span>KICKBOXING</span><span>MUAY THAI</span></div>}
                {section.id === 'method' && <div className="method-steps"><span>01 / OBSERVE</span><span>02 / TRAIN</span><span>03 / EVOLVE</span></div>}
                {section.id === 'contact' ? <a className="text-cta" href="https://wa.me/34603809155" target="_blank" rel="noreferrer">{section.action} <b>↗</b></a> : <button className="text-cta" onClick={() => go(section.id === 'training' ? 'discover' : 'contact')}>{section.action} <b>↗</b></button>}
              </div>
            )}
            <div className="section-side-note">STRIKING MOTION LAB <span>—</span> MADRID</div>
          </section>
        ))}
      </main>

      <div className="progress-rail"><span style={{ transform: `scaleY(${progress.current || 0})` }}/></div>
      <div className="chapter-indicator"><span>0{active + 1}</span><i/>04</div>
      <footer className="footer"><span>© {new Date().getFullYear()} STRIKING MOTION LAB</span><span>MOVE WITH INTENT / 1% BETTER EVERYDAY</span><a href="https://www.instagram.com/strikingmotionlab/" target="_blank" rel="noreferrer">INSTAGRAM ↗</a></footer>
    </>
  );
}
