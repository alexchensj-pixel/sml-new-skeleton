import React, { useEffect, useRef, useState } from 'react';
import SpatialWorld from './scene/SpatialWorld.jsx';

const sections = [
  { id: 'training', number: '01', eyebrow: 'THE TRAINING FLOOR', title: <>TRAIN<br/><em>WITH INTENT.</em></>, copy: 'Boxeo · Kickboxing · Muay Thai. Entrenamiento personalizado, técnica aplicada y progreso medible.', action: 'Explorar entrenamiento' },
  { id: 'discover', number: '02', eyebrow: 'DISCOVER / DISCIPLINES', title: <>DISCOVER<br/><em>YOUR STYLE.</em></>, copy: 'Tres disciplinas. Distintas formas de moverte, golpear y construir tu técnica. Explora cuál conecta contigo.', action: 'Continuar al método' },
  { id: 'method', number: '03', eyebrow: 'THE METHOD', title: <>BUILT<br/><em>AROUND YOU.</em></>, copy: 'Te conocemos. Observamos cómo te mueves. Diseñamos cada sesión para tu nivel, tu objetivo y tu evolución.', action: 'Descubrir el método' },
  { id: 'contact', number: '04', eyebrow: 'ENTER THE LAB', title: <>YOUR MOVE<br/><em>STARTS HERE.</em></>, copy: 'Sesiones 1:1, parejas y grupos reducidos en Madrid. Sin intimidación. Sin fórmulas genéricas.', action: 'Contactar con SML' }
];

const disciplines = [
  { id: 'boxing', name: 'BOXEO', short: 'Precisión · distancia · defensa', detail: 'Aprende a moverte, controlar la distancia, combinar golpes de puño y defenderte con criterio. Una base técnica y física que se construye paso a paso.' },
  { id: 'kickboxing', name: 'KICKBOXING / K1', short: 'Puños · piernas · ritmo', detail: 'Combina boxeo con patadas y, en K1, trabajo de rodilla y recursos de corta distancia. Coordinación, ritmo y lectura del intercambio.' },
  { id: 'muaythai', name: 'MUAY THAI', short: 'Ocho armas · equilibrio · control', detail: 'Integra puños, codos, rodillas y patadas, además del trabajo de clinch. Técnica, equilibrio y control de la distancia en una disciplina completa.' }
];

export default function App() {
  const progress = useRef(0);
  const [active, setActive] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedDiscipline, setSelectedDiscipline] = useState('muaythai');

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

        {sections.map((section, index) => (
          <section className={`journey-section section-${index + 1}`} id={section.id} key={section.id}>
            <div className="section-meta"><span>{section.number} / 04</span><span>{section.eyebrow}</span></div>
            <div className="section-content">
              <p className="section-kicker"><i/> {section.eyebrow}</p>
              <h2>{section.title}</h2>
              <p className="section-copy">{section.copy}</p>
              {index === 0 && <div className="discipline-list"><span>BOXING</span><span>KICKBOXING</span><span>MUAY THAI</span></div>}
              {index === 1 && (() => {
                const selected = disciplines.find((item) => item.id === selectedDiscipline) || disciplines[2];
                return <div className="discover-panel">
                  <div className="discover-options" role="group" aria-label="Selecciona una disciplina">
                    {disciplines.map((item, i) => <button key={item.id} type="button" className={selectedDiscipline === item.id ? 'discover-option is-selected' : 'discover-option'} aria-pressed={selectedDiscipline === item.id} onClick={() => setSelectedDiscipline(item.id)}>
                      <span className="discover-number">0{i + 1}</span><strong>{item.name}</strong><small>{item.short}</small><i aria-hidden="true">↗</i>
                    </button>)}
                  </div>
                  <div className="discover-detail" aria-live="polite">
                    <span>DISCIPLINE / {String(disciplines.findIndex((item) => item.id === selected.id) + 1).padStart(2, '0')}</span>
                    <h3>{selected.name}</h3>
                    <p>{selected.detail}</p>
                  </div>
                </div>;
              })()}
              {index === 2 && <div className="method-steps"><span>01 / OBSERVE</span><span>02 / TRAIN</span><span>03 / EVOLVE</span></div>}
              {index === 3 ? <a className="text-cta" href="https://www.instagram.com/strikingmotionlab/" target="_blank" rel="noreferrer">{section.action}<b>↗</b></a> : <button className="text-cta" onClick={() => go(sections[index + 1].id)}>{section.action}<b>↘</b></button>}
            </div>
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