// Estructura de la experiencia + contenido real (procedente de la web anterior, STRIKING_MOTION_LAB_PLANES_v8).
// Lo que la web anterior no tenía no se muestra: nada de texto provisional en pantalla (ver README → Huecos abiertos).
import { video, image, poster } from './Media.js';

// --- Datos de negocio (contacto, enlaces) ---
export const site = {
  nombre: 'Striking Motion Lab',
  claim: '1% Better Everyday',
  ciudad: 'Madrid',
  disciplinas: 'Muay Thai · Boxeo · Kickboxing · K1',
  whatsapp: '34603809155',            // formato internacional, sin +
  whatsappVisible: '603 809 155',
  instagram: { url: 'https://instagram.com/strikingmotionlab', handle: '@strikingmotionlab' },
  maps: 'https://maps.app.goo.gl/ZNfZvn9qgp2F7xiW9?g_st=ic',
  // Calendly (reserva directa de la Sesión Privada). Parámetros de color = los de la web anterior.
  calendlyBase: 'https://calendly.com/alexchensj',
  calendly: 'https://calendly.com/alexchensj?hide_gdpr_banner=1&background_color=0a0a0a&text_color=f2efe8&primary_color=9a1f2d',
  rating: { valor: '5.0', resenas: 18, fuente: 'Google' },
  logro: '3.º en K1 −57 kg — Copa de España 2025 · FEKM / WAKO',
};

// Enlace de WhatsApp con mensaje ya escrito.
export const waLink = (msg) => `https://wa.me/${site.whatsapp}${msg ? `?text=${encodeURIComponent(msg)}` : ''}`;

// Frases ya aprobadas que estaban repetidas en Chen y en la FAQ. Se definen una sola vez para poder usarlas
// en el momento en que el cliente necesita entenderlas (Scene 03, Scene 04, FAQ) sin reescribirlas.
export const evaluacionInicialTexto = 'Empiezas con la Evaluación inicial: sesión presencial y privada (30€). Sirve para analizar tu punto de partida y construir tu plan a medida. Si después contratas Arsenal, Striker o Fight IQ, los 30 € se descuentan del plan (no en parejas ni en grupos).';
// Reseñas: solo el dato documentado (nota media y nº de reseñas en Google). Sin adjetivos ni testimonios.
export const ratingTexto = `${site.rating.valor.replace('.', ',')} ★ · ${site.rating.resenas} reseñas ${site.rating.fuente}`;
export const materialTexto = 'Yo aporto el material necesario para las sesiones: no necesitas comprar nada para empezar.';

// --- 01 Entrada ---
export const hero = {
  claim: 'No elijas tu entreno. Descúbrelo.',
  // El mismo claim, partido en tres líneas para el último momento de la Entrada (Entrada.jsx).
  claimLineas: ['No elijas', 'tu entreno.', 'Descúbrelo.'],
  // Dos caminos principales, con el mismo peso: quien no sabe qué quiere descubre; quien ya lo sabe reserva sin pasar por Descubrir.
  noSe: { pre: 'No sé qué quiero', accion: 'Descubrir', aux: 'Explora el mundo del combate.' },
  yaSe: { pre: 'Ya sé qué quiero', accion: 'Reservar', aux: 'Entrenamiento privado con método propio' },
  // Ruta secundaria (no compite con las dos anteriores).
  ctaB2B: 'Empresas · Hoteles · Eventos →',
  // Recorrido C (prueba): rutas rápidas, modalidades y confianza en el primer pantallazo.
  ctaPrecios: 'Precios →',
  ctaGrupos: 'Parejas y grupos →',
  modalidades: 'Individual · Parejas · Grupos reducidos',
  confianza: `${ratingTexto} · 3.º en K1 −57 kg, Copa de España 2025`,
  // V22 — mensaje principal de HOME (visible desde el primer fotograma; no depende de ninguna animación ni del scroll).
  marca: 'Striking Motion Lab',
  titulo: ['Entrenamiento privado', 'de deportes de combate', 'en Madrid.'],
  disciplinasLinea: 'Boxeo · K1 · Muay Thai',
  ctaReservar: 'Empezar mi entrenamiento',
  ctaExplorar: 'No sé qué necesito → Descubrir',
  contexto: 'Madrid · Sesiones privadas · Grupos reducidos',
  kicker: 'Madrid · Muay Thai · Boxeo · Kickboxing · K1',
  // Sin uso en pantalla. Reescrito: la web no recomienda disciplina automáticamente.
  texto: 'Entrenamiento privado de deportes de contacto en Madrid.',
};

// Secuencia narrativa de la Escena 01 (curiosidad → entrar → descubrir). Nada de info técnica/planes/
// evaluación aquí — eso vive en Escena 03. Se muestra progresivo, nunca junto, scrubeado con el scroll real
// del capítulo (ver Entrada.jsx#build). El último momento es ahora el claim (hero.claimLineas) + los dos CTA;
// `vive` y `apoyo` ya no se muestran (eran explicación del método: pertenecen a escenas posteriores).
export const entradaNarrativa = {
  pregunta: ['¿Alguna vez te has', 'preguntado cómo se sentiría', 'vivir el combate?'],
  entra: 'Entra.',
  entraSub: 'Descubre el mundo del combate.',
  vive: 'Vívelo en primera persona.',
  apoyo: ['Aprende cómo se entrena.', 'Adapta el proceso a ti.', 'Construye tu propia evolución.'],
};

// vh = longitud de scroll del capítulo (incluye la pantalla visible).
// id = nombre técnico interno del módulo (Experience/<Id>). label = lo que ve el usuario.
// p.ej. 'character-select' es el módulo interno; el usuario nunca ve esa palabra, ve "Descubrir".
export const chapters = [
  { id: 'entrada',          n: '01', label: 'Inicio',                vh: 140 },
  { id: 'character-select', n: '02', label: 'Descubrir',             vh: 120 }, // EXPLORE (V22): una sola pantalla de decisión (sin película); 35vh de meseta antes del umbral
  { id: 'asesoria-lab',     n: '03', label: 'Método',                 vh: 160 }, // V22 · paso 4: cinco pasos densos (antes 360vh); en móvil el capítulo fluye (sin pin)
  { id: 'slot',             n: '04', label: 'Entrenamiento',         vh: 280 }, // cuatro pasos (Elección directa · Frecuencia · Combinación · Resultado) sobre las piezas de la máquina 3D: pantalla fija; el primero ya es una elección completa (420 vh era para seis)
  { id: 'proof-chen',       n: '05', label: 'Sobre Alex',            vh: 140 },
  { id: 'reserva',          n: '06', label: 'Reserva',               vh: 140 },
];

export const chapterById = Object.fromEntries(chapters.map((c) => [c.id, c]));

// Umbrales narrativos entre capítulos (tramo de scroll con velo + viaje de cámara).
export const thresholdLabels = {
  'entrada>character-select': 'Entrada al mundo del combate',
  'character-select>asesoria-lab': 'De la selección al protocolo',
  'asesoria-lab>slot': 'Del protocolo a la configuración',
  'slot>proof-chen': 'Resolución · evidencia',
  'proof-chen>reserva': 'Acceso',
};

// Secuencia ordenada de tramos de scroll: capítulo, umbral, capítulo, umbral...
export const segmentKeys = chapters.flatMap((c, i) =>
  i < chapters.length - 1 ? [c.id, `${c.id}>${chapters[i + 1].id}`] : [c.id]
);

// --- EXPLORE · selector visible de disciplinas ---
export const explore = {
  titulo: 'No todo el mundo entrena por lo mismo.',
  intro: 'Descubre qué tipo de experiencia encaja contigo.',
  disciplinasTitulo: 'Después elegimos cómo.',
  // Etiquetas de los bloques de la disciplina elegida.
  bloques: { personaje: 'Personaje y vídeo', que: 'Qué es', como: 'Cómo se entrena', desarrolla: 'Qué desarrolla', glosario: 'Glosario' },
  tuEleccion: 'Tu elección',
  verLas3: 'Ver las tres disciplinas',
  seleccionado: 'Seleccionado',
  profundizar: 'Profundizar',
  cerrar: 'Cerrar',
};

// --- 03 Asesoría + Lab → METHOD (V22 · paso 4) ---
// Estructura V22: «No empezamos por el entrenamiento. Empezamos por ti.» + cinco pasos (01 Te conozco · 02 Te observo ·
// 03 Entrenamos · 04 Adaptamos · 05 Seguimos) + cierre. El copy es el de la especificación V22 y se usa literal.
// id/label = lo que lee el HUD. Los ids de paso son el valor de `substage` (App/store.js); 'apertura' se conserva como id de la
// cabecera porque es el valor inicial de `substage`. Un registro con `n` es un PASO (se pinta en la lista y reparte el scroll).
export const advisorySubstages = [
  {
    id: 'apertura', label: 'Entrada',
    titular: ['No empiezo por el entrenamiento.', 'Empiezo por ti.'],
  },
  {
    id: 'conozco', label: 'Te conozco', num: '01', n: 'TE CONOZCO',
    texto: 'Antes de decidir qué entrenar, necesito saber desde dónde empiezas.',
    elementos: ['Objetivo', 'Experiencia', 'Disponibilidad', 'Contexto'],
  },
  {
    id: 'observo', label: 'Te observo', num: '02', n: 'TE OBSERVO',
    texto: 'Veo cómo te mueves antes de decidir qué necesitas.',
    destacada: 'Aquí entra la evaluación inicial.',
    etiqueta: 'Evaluación inicial · 30 €', // marca que acompaña al paso cuando está plegado
  },
  {
    id: 'entrenamos', label: 'Entrenamos', num: '03', n: 'ENTRENAMOS',
    texto: 'Lo que veo determina qué te propongo trabajar.',
  },
  {
    id: 'adaptamos', label: 'Adaptamos', num: '04', n: 'ADAPTAMOS',
    texto: 'El plan no está cerrado. Evoluciona contigo.',
  },
  {
    id: 'seguimos', label: 'Seguimos', num: '05', n: 'SEGUIMOS',
    texto: 'Lo que necesitas trabajar cambia contigo.',
  },
];

// Cierre de Method (se ve al final del recorrido; no es un paso).
export const metodoCierre = ['No solo entrenas.', 'Entiendes qué estás desarrollando.'];

// EVALUACIÓN INICIAL — producto concreto dentro del paso 02 · TE OBSERVO (aplicación práctica de «te observo»).
// CTA principal → BOOK existente (goToSection('book')). CTA secundario → información contextual en el propio paso (sin página nueva).
export const evaluacionInicial = {
  kicker: 'Primera sesión',
  kickerMetodo: 'Tu primer paso', // rótulo en Método (V27 MAPA · paso 5); Chen sigue usando `kicker`
  titulo: 'Evaluación técnica y análisis de movimiento',
  precio: '30 €',
  texto: 'Observo tu punto de partida, cómo te mueves y cómo ejecutas la técnica. Con ese análisis identifico qué necesitas trabajar y te preparo una recomendación concreta para orientar tu entrenamiento. Es el inicio de un proceso diseñado alrededor de ti, no una clase de prueba.',
  nota: 'Si contratas Arsenal, Striker o Fight IQ, los 30 € se descuentan del plan. No se descuentan en parejas ni en grupos.',
  cta: 'Reservar evaluación',
  ctaMas: 'Quiero saber más',
  // Contexto que se despliega con «Quiero saber más»: los mismos pasos del método aplicados a la primera sesión.
  mas: [
    ['Te conozco', 'Objetivo, experiencia, disponibilidad y contexto.'],
    ['Te observo', 'Cómo te mueves, antes de decidir qué necesitas.'],
    ['Después', 'Lo que veo determina qué te propongo trabajar: de ahí sale tu plan a medida.'],
  ],
};


// --- 05 Chen ---
// Cada apartado puede llevar: texto[], datos[[clave, valor]], pasos[], imagen{src,alt}, enlace{href,label}, resenas[].
// Escena 05 muestra: CHEN → trayectoria → reseñas (prueba B2C: alumnos de sesiones privadas individuales).
// Método, formatos, planes, material y evaluación viven en las escenas 03/04 y NO se repiten aquí.
// Las fotos históricas solo apoyan la trayectoria; nada de galería ni de vídeos repetidos de Descubrir.
export const resenasGoogle = [
  'Alex es un coach excelente, que se adapta a tus necesidades y saca lo mejor de ti en cada sesión.',
  'Excelente profesor. Muy enfocado en la técnica.',
  'Un entrenador con muchas ganas y muy pendiente con el alumno, sacar el mejor de cada uno.',
];

export const dossierItems = [
  {
    id: 'chen', label: 'Alex', titulo: 'Peleador. Entrenador.',
    texto: ['Compito en K1 y Muay Thai (FEKM / WAKO). Cada sesión privada parte de esa misma exigencia.'],
  },
  {
    id: 'trayectoria', label: 'Trayectoria',
    datos: [['Disciplinas', 'K1 y Muay Thai'], ['Resultado', site.logro], ['Campeonatos de España', 'Dos participaciones, representando a Madrid']],
    imagen: { src: image.chenRing, alt: 'Alex, con pantalón corto rojo, de pie en el ring durante una competición federada FEKM de K1/Muay Thai' },
  },
  {
    // Solo lo lee Data/B2B.js (títulos de los 4 pasos). La escena 05 NO lo muestra (ProofChen.jsx lo filtra).
    id: 'metodo', label: 'Método',
    pasos: [
      { titulo: 'Te conozco', texto: 'Objetivo, experiencia, preferencias, necesidades y qué quieres desarrollar.' },
      { titulo: 'Te observo', texto: 'Lo que veo se convierte en decisiones.' },
      { titulo: 'Entrenamos', texto: 'Cada sesión tiene un propósito.' },
      { titulo: 'Seguimos',   texto: 'El proceso cambia contigo.' },
    ],
  },
  {
    id: 'resenas', label: 'Lo que dicen los alumnos',
    datos: [['Google Maps', ratingTexto]],
    resenas: resenasGoogle,
    enlace: { href: site.maps, label: 'Ver en Google Maps' },
  },
];

// --- 06 Reserva ---
export const reserva = {
  titulo: 'Evaluación inicial · 30 €',
  subtitulo: 'Reserva directa',
  texto: 'Elige día y hora. En la propia sesión evalúo tu nivel y tu objetivo, y después te oriento sobre el plan que mejor encaja contigo.',
  // Dos caminos: reservar ya (calendario directo) o descubrir antes de decidir.
  caminos: {
    directo: { titulo: 'YA SÉ LO QUE QUIERO', accion: 'Evaluación inicial · 30 € → elige día y hora.' },
    dudas: { titulo: 'TODAVÍA NO LO TENGO CLARO', accion: 'Descubre las disciplinas antes de decidir.' },
  },
  // Única aclaración que reduce fricción (FAQ «¿Cómo funciona la reserva?»): el resto del proceso ya se explica en 03/04.
  despuesTitulo: 'Antes, durante y después de reservar',
  despues: [
    'Antes: eliges día y hora y confirmas. No hace falta escribirme antes; si tienes dudas, puedes hacerlo por WhatsApp.',
    'Durante: 60 minutos, presencial y privada. Trae ropa deportiva cómoda y agua; el material lo llevo yo. Conozco tu objetivo, observo cómo te mueves y entrenamos.',
    'Después: te oriento sobre el plan que mejor encaja contigo. Si contratas Arsenal, Striker o Fight IQ, los 30 € se descuentan del plan.',
    'Seguimiento: tras la sesión te escribo con mi recomendación, el precio del plan y cómo empezar. Puedes pagar por Bizum, transferencia o efectivo, antes o después de cada sesión.',
  ],
};

// --- Extras (fuera de los 6 capítulos): FAQ, empresas (materia prima del recorrido B2B), cierre ---
export const faq = [
  { q: 'No sé qué disciplina elegir', a: 'No necesitas saberlo. Para eso existe Descubrir: explora Boxeo, K1/Kickboxing y Muay Thai antes de decidir, o pide asesoramiento directo si sigues sin tenerlo claro.' },
  { q: '¿Puedo empezar completamente desde cero?', a: 'Sí. No se presupone ninguna experiencia previa — se empieza desde tu nivel real, priorizando técnica y progresión segura.' },
  { q: '¿Tengo que estar en forma para empezar?', a: 'No. La condición física se construye entrenando, no es un requisito de entrada. La intensidad se adapta a ti desde el primer día.' },
  { q: '¿Tengo que hacer sparring?', a: 'No es obligatorio. No es para el primer día: se introduce poco a poco y se adapta a tu nivel. No es una pelea, es una forma de aprender.' },
  { q: '¿Tengo que comprar material?', a: 'No. Si no tienes material, lo llevo yo. Si prefieres material nuevo y tuyo, puedes adquirir el kit opcional.' },
  { q: '¿Tengo que competir?', a: 'No. El entrenamiento puede orientarse a técnica y bienestar sin ninguna intención de competir.' },
  { q: '¿Qué ocurre en mi primera sesión?', a: 'Evalúo tu nivel y tu objetivo, y empiezas a trabajar fundamentos desde tu punto de partida. Solo necesitas ropa deportiva cómoda y agua. Si no tienes material, lo llevo yo.' },
  { q: '¿Cómo sé qué plan elegir?', a: 'No hace falta decidirlo antes de empezar. Después de tu primera sesión te oriento sobre el plan que mejor encaja contigo, y siempre puedes cambiar de plan más adelante.' },
  { q: '¿Puedo empezar antes de contratar un plan?', a: `Sí. ${evaluacionInicialTexto}` },
  { q: '¿Cómo funciona la reserva?', a: 'Directamente desde la web: eliges día y hora disponible en el calendario y confirmas — sin tener que escribir antes para preguntar disponibilidad. Puedes pagar por Bizum, transferencia o efectivo, antes o después de la sesión.' },
  { q: '¿Dónde entrenamos y tiene coste el desplazamiento?', a: 'Acordamos el lugar según tu zona, con todo el material incluido. En la zona A de Metro de Madrid el desplazamiento está incluido; fuera de ella se añaden 10 € por sesión (en parejas y grupos, una sola vez por sesión compartida, no por persona). Para otras localidades te confirmo la disponibilidad y el suplemento por WhatsApp antes de contratar.' },
  { q: '¿Puedo cambiar o cancelar una sesión?', a: 'Sí, avisándome con al menos 24 horas. Con menos de 24 horas, la sesión se consume. Si soy yo quien necesita aplazarla por motivos organizativos, la recuperamos la semana siguiente, según mi disponibilidad. Los planes son mensuales: las sesiones no se acumulan ni pasan al mes siguiente.' },
  { q: '¿Cuánto cuesta cada sesión dentro de un plan?', a: 'Entre 22,50 € y 27,50 € por sesión de 60 minutos, según el plan, frente a 30 € de la sesión suelta.' },
];

export const empresas = {
  texto: 'El mismo método y la misma exigencia técnica, adaptados a equipos, huéspedes, comunidades y eventos.',
  items: [
    { nombre: 'Empresas', texto: 'Team building y bienestar físico para equipos — sesiones puntuales o programas recurrentes en tu oficina.' },
    { nombre: 'Hoteles', texto: 'Experiencias de combate para huéspedes, como actividad diferencial dentro de tu oferta de bienestar o actividad física.' },
    { nombre: 'Urbanizaciones / residenciales', texto: 'Entrenamientos privados o en grupo reducido para vecinos, dentro de la propia comunidad.' },
    { nombre: 'Eventos', texto: 'Activaciones y experiencias de deportes de combate para eventos puntuales.' },
  ],
  ayuda: 'Cuéntame el tipo de organización, número aproximado de participantes, ubicación y fecha, y te preparo una propuesta.',
  mensaje: 'Hola, estoy interesado/a en una propuesta de entrenamiento para empresa/hotel/evento.',
};

export const cierre = {
  titulo: 'No necesitas saber qué entrenar.',
  texto: 'Descubre tu disciplina — o reserva directamente si ya lo tienes claro.',
  yaSe: 'Ya sé lo que quiero — Reservar →',
  noSe: 'No sé qué elegir — Solicitar asesoramiento →',
  mensajeAsesoria: 'Hola, sigo sin tener claro qué disciplina encaja conmigo. ¿Puedes orientarme?',
};
