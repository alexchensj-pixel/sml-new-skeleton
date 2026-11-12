import React, { useEffect, useMemo, useState } from 'react';
import { slotState, reflectDrum, pingMachine } from '../legacy/Experience/Slot/slotState.js';
import { useStore } from '../legacy/App/store.js';
import { existingPlans } from '../legacy/Data/Programs.js';

const QUESTIONS = [
  { id: 'goal', title: '¿QUÉ BUSCAS?', options: [['tecnica','Técnica'],['bienestar','Bienestar'],['competir','Competición']] },
  { id: 'format', title: '¿CÓMO QUIERES ENTRENAR?', options: [['1-1','1:1'],['duo','Parejas'],['grupo','Grupo reducido'],['hibrido','Privado + grupal']] },
  { id: 'frequency', title: '¿CUÁNTO PUEDES ENTRENAR?', options: [['1-dia','1 día'],['2-dias','2 días'],['3-dias','3 días'],['variable','Variable']] },
];
const sessionPlan = (id) => existingPlans.find((p) => p.id === id);
const monthlyPlan = (id) => existingPlans.find((p) => p.id === id);
const frequencyPlan = { '1-dia':'arsenal', '2-dias':'striker', '3-dias':'fight-iq' };
const frequencyCount = { '1-dia':1, '2-dias':2, '3-dias':3 };

export default function RecommendationRoulette() {
  const goal = useStore((s) => s.selectedGoal);
  const format = useStore((s) => s.selectedFormat);
  const frequency = useStore((s) => s.selectedFrequency);
  const selectGoal = useStore((s) => s.selectGoal);
  const selectFormat = useStore((s) => s.selectFormat);
  const selectFrequency = useStore((s) => s.selectFrequency);
  const [spinning, setSpinning] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [result, setResult] = useState(null);
  const ready = !!goal && !!format && !!frequency;

  useEffect(() => () => { slotState.show = false; slotState.freq = null; }, []);
  const rates = useMemo(() => existingPlans.filter((p) => p.tipo === 'formato' || p.tipo === 'mensual'), []);

  const choose = (id, value) => {
    setRevealed(false); setResult(null);
    if (id === 'goal') { selectGoal(value); pingMachine(); }
    if (id === 'format') { selectFormat(value); reflectDrum(value === 'grupo' ? 'grupo' : value === 'duo' ? 'duo' : '1-1'); }
    if (id === 'frequency') {
      selectFrequency(value);
      slotState.freq = frequencyCount[value] ?? null;
      pingMachine();
    }
  };

  const spin = () => {
    if (!ready || spinning) return;
    setSpinning(true); setRevealed(false); setResult(null);
    const count = frequencyCount[frequency] ?? 0;
    const monthlyId = frequencyPlan[frequency] || (goal === 'tecnica' ? 'arsenal' : goal === 'competir' ? 'fight-iq' : null);
    const plan = monthlyId ? monthlyPlan(monthlyId) : null;
    const chosenSession = format === 'duo' ? sessionPlan('duo') : format === 'grupo' ? sessionPlan('grupo') : sessionPlan('1-1');
    const mix = format === 'hibrido' && count > 1
      ? `1 × 1:1 + ${count - 1} × grupo reducido`
      : format === 'hibrido' ? '1 × 1:1' : `${count || 'Frecuencia variable'} × ${chosenSession.nombre}`;
    slotState.show = true;
    slotState.freq = count || null;
    slotState.bays = format === 'hibrido' && count > 1
      ? ['1-1', ...Array(count - 1).fill('grupo'), null].slice(0, 4)
      : Array.from({ length: Math.min(count || 1, 4) }, () => format === 'hibrido' ? '1-1' : format).concat(Array(4).fill(null)).slice(0,4);
    // El tambor refleja el formato elegido; el resultado comercial lo determina la frecuencia/objetivo, nunca el azar.
    reflectDrum(format === 'grupo' ? 'grupo' : format === 'duo' ? 'duo' : '1-1');
    window.setTimeout(() => {
      setResult({ plan, mix, chosenSession, count, goal, format, frequency });
      setSpinning(false); setRevealed(true);
    }, 1250);
  };

  const clear = () => { selectGoal(null); selectFormat(null); selectFrequency(null); setRevealed(false); setResult(null); pingMachine(); };
  const goalText = { tecnica:'Construir una base técnica', bienestar:'Entrenar y sentirte mejor', competir:'Prepararte para competir' };

  return <section className="roulette" aria-labelledby="roulette-title">
    <div className="roulette__head"><p className="eyebrow">ORIENTADOR DE ENTRENAMIENTO</p><h3 id="roulette-title">Encuentra tu combinación.</h3><p>Responde a las tres preguntas. La ruleta gira y se detiene en una recomendación calculada con tus respuestas, nunca al azar.</p></div>
    <div className="roulette__layout">
      <div className="roulette__questions">
        {QUESTIONS.map((q, index) => <fieldset className="roulette__question" key={q.id}>
          <legend><span>0{index + 1}</span>{q.title}</legend>
          <div className="roulette__options">{q.options.map(([id,label]) => <button type="button" key={id} className="roulette__option" data-selected={(q.id === 'goal' ? goal : q.id === 'format' ? format : frequency) === id} aria-pressed={(q.id === 'goal' ? goal : q.id === 'format' ? format : frequency) === id} onClick={() => choose(q.id,id)}>{label}</button>)}</div>
        </fieldset>)}
        <button type="button" className="roulette__spin" disabled={!ready || spinning} onClick={spin}>{spinning ? 'CALCULANDO…' : 'GIRAR LA RULETA'}</button>
        <button type="button" className="roulette__reset" onClick={clear}>Borrar respuestas</button>
      </div>
      <div className="roulette__machine" aria-live="polite">
        <div className={`roulette__wheel ${spinning ? 'is-spinning' : ''} ${revealed ? 'is-stopped' : ''}`}><span className="roulette__wheel-core">S<span>/</span>ML</span><i>01</i><i>02</i><i>03</i><i>04</i><i>05</i><i>06</i></div>
        <span className="roulette__pointer">▼</span>
        <p className="roulette__machine-label">{spinning ? 'LEYENDO TUS RESPUESTAS' : revealed ? 'RESULTADO DETERMINADO' : 'MÁQUINA DE RECOMENDACIÓN'}</p>
        {revealed && result && <div className="roulette__result">
          <small>RECOMENDACIÓN</small>
          <h4>{result.plan ? result.plan.nombre : 'Evaluación inicial'}</h4>
          <strong>{result.plan ? `${result.plan.precio} € / mes` : '30 € · sesión privada'}</strong>
          <p>{goalText[result.goal]}. {result.count ? `${result.count} ${result.count === 1 ? 'día' : 'días'} por semana.` : 'Frecuencia variable.'}</p>
          <p className="roulette__mix">{result.mix}</p>
          <a href="https://wa.me/34603809155?text=Hola%2C%20he%20hecho%20la%20ruleta%20de%20entrenamiento%20y%20quiero%20consultar%20mi%20recomendaci%C3%B3n." target="_blank" rel="noopener noreferrer">Consultar mi recomendación ↗</a>
        </div>}
      </div>
    </div>
    <div className="roulette__rates"><span>PRECIOS SIEMPRE A LA VISTA</span><div>{rates.map((p) => <p key={p.id}><b>{p.nombre}</b><strong>{p.precio} €</strong><small>{p.tipo === 'mensual' ? '/ mes' : p.unidad}</small></p>)}</div></div>
  </section>;
}
