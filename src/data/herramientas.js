/* LAS HERRAMIENTAS del producto (LANZAMIENTO-FUENTE-DE-VERDAD.md §3): plantillas de mensajes para convertir, contenido que
   vende, deals con las plataformas, IA que te crea los mensajes, IA que te crea contenido (bonus), y lo que el producto
   necesita para funcionar: mis comisiones y los bonus. TODO el contenido es EJEMPLO hasta que el equipo cargue el real:
   ni plataformas reales, ni comisiones, ni resultados inventados. Cada pieza se abre según DESBLOQUEO (programa.js). */

export const MOMENTOS = [
  { id: 'contacto', nombre: 'Primer contacto' },
  { id: 'valor', nombre: 'Aportar valor' },
  { id: 'objecion', nombre: 'Objeción' },
  { id: 'cierre', nombre: 'Cierre y enlace' },
  { id: 'seguimiento', nombre: 'Seguimiento' },
]
export const CANALES = ['Instagram', 'TikTok', 'WhatsApp', 'Telegram']
export const TONOS = [{ id: 'cercano', nombre: 'Cercano' }, { id: 'directo', nombre: 'Directo' }, { id: 'profesional', nombre: 'Profesional' }]

/* aviso obligatorio por nicho (va al final de todo mensaje y contenido) */
export const AVISO = {
  trading: 'Invertir conlleva riesgo; no es asesoramiento financiero.',
  casinos: 'Solo +18. Juega con responsabilidad.',
  fitness: 'Consulta con un profesional antes de empezar un plan.',
}

/* {nombre} {producto} {enlace} {beneficio} se sustituyen al copiar o en la IA. nicho null = vale para todos. */
const P = (id, momento, nicho, titulo, texto) => ({ id, momento, nicho, titulo, texto, ejemplo: true })
export const PLANTILLAS = [
  P('m1', 'contacto', null, 'Responder a un comentario', 'Hola {nombre}, vi tu comentario en el vídeo. ¿Te mando la info de lo que uso yo? Sin compromiso.'),
  P('m2', 'contacto', 'trading', 'Interés por aprender a operar', 'Hola {nombre}. Me preguntaste por la plataforma que uso para empezar a operar. ¿Ya operas o empiezas de cero?'),
  P('m3', 'contacto', 'casinos', 'Interés por la promoción', 'Hola {nombre}, me pediste el enlace de la promo. Antes de pasártelo: ¿eres mayor de 18 y estás en España?'),
  P('m4', 'contacto', 'fitness', 'Interés por el programa', 'Hola {nombre}. ¿Qué buscas ahora mismo: perder grasa, ganar músculo o tener constancia? Así te digo si te encaja.'),
  P('m5', 'valor', null, 'Dar contexto antes del enlace', 'Te cuento cómo funciona {producto}: {beneficio}. Si quieres, te paso el enlace con el que entré yo.'),
  P('m6', 'objecion', null, '«No tengo tiempo»', 'Te entiendo, {nombre}. Por eso lo uso: {beneficio}. Con unos minutos al día ya ves si te encaja.'),
  P('m7', 'objecion', 'trading', '«Me da miedo perder dinero»', 'Es normal. Puedes empezar en demo, sin dinero real, y ver si te gusta. {aviso}'),
  P('m8', 'objecion', null, '«¿Esto es una estafa?»', 'Haces bien en preguntarlo. Busca opiniones de {producto} antes de nada: yo solo te paso el enlace oficial.'),
  P('m9', 'cierre', null, 'Pasar el enlace', 'Aquí lo tienes, {nombre}: {enlace}. Si te atascas en el registro, escríbeme y te ayudo.'),
  P('m10', 'cierre', 'casinos', 'Pasar el enlace con condiciones', 'Te dejo el enlace: {enlace}. Lee las condiciones de la promoción antes de nada. {aviso}'),
  P('m11', 'seguimiento', null, 'Seguimiento a las 24 h', 'Hola {nombre}, ¿pudiste mirarlo? Si tienes alguna duda, dime y te la resuelvo.'),
  P('m12', 'seguimiento', 'fitness', 'Seguimiento tras el registro', '¿Qué tal los primeros días con {producto}, {nombre}? Si quieres te paso cómo me organicé yo la primera semana.'),
]

export const FORMATOS = [
  { id: 'f1', tipo: 'Vídeo sin cara', titulo: 'Voz en off + pantalla', nicho: null, desc: 'Grabas la pantalla o usas imágenes de recurso y pones tu voz (o una voz de IA).', estructura: ['Hook en 2 s', 'El problema', 'Lo que enseñas', 'Llamada a la acción', 'Aviso'], ejemplo: true },
  { id: 'f2', tipo: 'Vídeo sin cara', titulo: 'Avatar de IA hablando a cámara', nicho: null, desc: 'Un avatar dice tu guion; tú no sales.', estructura: ['Hook', 'Historia corta', 'Puente al producto', 'CTA', 'Aviso'], ejemplo: true },
  { id: 'f3', tipo: 'Carrusel', titulo: 'Carrusel de 7 diapositivas', nicho: null, desc: 'Una idea por diapositiva y la última con la llamada a la acción.', estructura: ['Portada con el gancho', '5 ideas', 'CTA + aviso'], ejemplo: true },
  { id: 'f4', tipo: 'Vídeo sin cara', titulo: 'Análisis del día', nicho: 'trading', desc: 'Captura del gráfico y lectura en 30 segundos.', estructura: ['Qué ha pasado', 'Qué miro yo', 'Dónde lo hago', 'Aviso de riesgo'], ejemplo: true },
  { id: 'f5', tipo: 'Historia', titulo: 'Encuesta + respuesta', nicho: 'casinos', desc: 'Preguntas algo, enseñas el resultado y respondes por privado.', estructura: ['Encuesta', 'Resultado', 'Responde «INFO»', '+18'], ejemplo: true },
  { id: 'f6', tipo: 'Vídeo sin cara', titulo: 'Rutina en pantalla', nicho: 'fitness', desc: 'Ejercicios con texto en pantalla y música, sin cara.', estructura: ['Hook', '3 ejercicios', 'Dónde está el plan completo', 'Aviso'], ejemplo: true },
]

/* DEALS: plataformas EJEMPLO (sin nombres reales ni cifras). Comisión ⇢ pendiente hasta que el equipo cargue los acuerdos. */
export const DEALS = [
  { id: 'd1', plataforma: 'Plataforma A', nicho: 'trading', modelo: 'CPA', comision: null, condiciones: ['Geos: ⇢ pendiente', 'Tráfico permitido: orgánico y anuncios', 'Pago: ⇢ pendiente'], ejemplo: true },
  { id: 'd2', plataforma: 'Plataforma B', nicho: 'trading', modelo: 'RevShare', comision: null, condiciones: ['Geos: ⇢ pendiente', 'Solo tráfico orgánico', 'Pago: ⇢ pendiente'], ejemplo: true },
  { id: 'd3', plataforma: 'Plataforma C', nicho: 'casinos', modelo: 'CPA + RevShare', comision: null, condiciones: ['Solo +18', 'Geos: ⇢ pendiente', 'Pago: ⇢ pendiente'], ejemplo: true },
  { id: 'd4', plataforma: 'Plataforma D', nicho: 'casinos', modelo: 'CPA', comision: null, condiciones: ['Solo +18', 'Sin anuncios de marca', 'Pago: ⇢ pendiente'], ejemplo: true },
  { id: 'd5', plataforma: 'Plataforma E', nicho: 'fitness', modelo: 'Comisión por venta', comision: null, condiciones: ['Todo el mundo', 'Orgánico y anuncios', 'Pago: ⇢ pendiente'], ejemplo: true },
]

/* LA IA (mensajes y contenido). En este front genera con plantillas locales; con `endpoint` llama a la API. */
export const IA_CFG = { endpoint: '', pendiente: true }

const pick = (arr, seed) => arr[Math.abs(seed) % arr.length]
const hash = (s) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 7)
const SALUDO = { cercano: ['Ey {nombre}!', 'Hola {nombre} 🙂', '¡Buenas, {nombre}!'], directo: ['{nombre},', 'Hola {nombre}.'], profesional: ['Hola {nombre}, gracias por escribir.', 'Buenas, {nombre}.'] }
const CIERRE = { cercano: ['Cualquier cosa me dices 🙌', 'Aquí estoy si te atascas.'], directo: ['Me dices.', 'Si te encaja, adelante.'], profesional: ['Quedo atento a tus dudas.', 'Cualquier consulta, me escribes.'] }
export function generarMensaje({ nicho, canal, momento, tono, producto, beneficio, nombre, plantillas = PLANTILLAS }, variante = 0) {
  const base = plantillas.filter((p) => p.momento === momento && (!p.nicho || p.nicho === nicho))
  const seed = hash([nicho, canal, momento, tono, producto, variante].join('|'))
  const p = pick(base.length ? base : plantillas, seed)
  const rellenar = (t) => t.replaceAll('{nombre}', nombre || '{nombre}').replaceAll('{producto}', producto || 'la plataforma').replaceAll('{beneficio}', beneficio || 'te lo explica paso a paso').replaceAll('{enlace}', '{tu enlace}').replaceAll('{aviso}', AVISO[nicho] || '')
  const cuerpo = rellenar(p.texto.replace(/^Hola \{nombre\}[.,]?\s*/, ''))
  return [rellenar(pick(SALUDO[tono], seed)), cuerpo, rellenar(pick(CIERRE[tono], seed >> 2)), momento === 'cierre' && AVISO[nicho] && !cuerpo.includes(AVISO[nicho]) ? AVISO[nicho] : ''].filter(Boolean).join('\n\n')
}

export const TIPOS_CONTENIDO = [
  { id: 'guion', nombre: 'Guion de vídeo (30 s)' },
  { id: 'hooks', nombre: '10 hooks' },
  { id: 'carrusel', nombre: 'Texto de carrusel' },
  { id: 'ideas', nombre: '5 ideas de contenido' },
]
const HOOKS = ['Nadie te cuenta esto de {tema}…', 'Si empiezas en {tema}, mira esto antes.', 'El error que comete casi todo el mundo con {tema}.', '3 cosas que me habría gustado saber de {tema}.', 'Esto es lo que hago yo, sin enseñar la cara.', 'Deja de hacer esto si quieres resultados en {tema}.', '¿Tú también pensabas que {tema} era complicado?', 'En 30 segundos: cómo empezar con {tema}.', 'Lo que hago cada mañana con {tema}.', 'Guarda este vídeo si te interesa {tema}.']
const TEMA = { trading: 'el trading', casinos: 'las promociones de casino', fitness: 'entrenar en casa' }
export function generarContenido({ nicho, canal, tipo, tono, tema }, variante = 0) {
  const t = tema || TEMA[nicho] || 'esto'
  const seed = hash([nicho, canal, tipo, tono, t, variante].join('|'))
  const h = (i) => HOOKS[(Math.abs(seed) + i) % HOOKS.length].replaceAll('{tema}', t)
  const aviso = AVISO[nicho] ? `\n\nAviso: ${AVISO[nicho]}` : ''
  const cta = canal === 'TikTok' || canal === 'Instagram' ? 'Comenta «INFO» y te lo paso por privado.' : 'Escríbeme y te paso el enlace.'
  if (tipo === 'hooks') return Array.from({ length: 10 }, (_, i) => `${i + 1}. ${h(i)}`).join('\n') + aviso
  if (tipo === 'ideas') return [`1. Tu historia: por qué empezaste con ${t}.`, `2. Un error común con ${t} y cómo evitarlo.`, `3. Tu rutina de un día con ${t}, en pantalla.`, `4. Mito vs realidad de ${t}.`, `5. Respuesta a la pregunta que más te hacen.`].join('\n') + aviso
  if (tipo === 'carrusel') return [`Diapositiva 1: ${h(0)}`, `Diapositiva 2: El problema: la mayoría empieza sin un plan.`, `Diapositiva 3: Elige una sola cosa y hazla bien.`, `Diapositiva 4: Usa herramientas que te ahorren tiempo.`, `Diapositiva 5: Mide lo que haces cada semana.`, `Diapositiva 6: Lo que uso yo para empezar.`, `Diapositiva 7: ${cta}`].join('\n') + aviso
  const tonos = { cercano: 'Te cuento lo que me pasó a mí.', directo: 'Vamos al grano.', profesional: 'Te explico cómo funciona.' }
  return [`[0-2 s] HOOK: ${h(0)}`, `[2-8 s] PROBLEMA: Casi todo el mundo empieza con ${t} sin saber por dónde.`, `[8-22 s] PUENTE: ${tonos[tono]} Lo que mejor me funciona es tener un sistema sencillo y repetirlo.`, `[22-28 s] CTA: ${cta}`, `[28-30 s] AVISO: ${AVISO[nicho] || '—'}`].join('\n')
}

/* llamada a la API cuando haya endpoint; si no, motor local */
export async function pedirIA(tipo, params, variante) {
  if (IA_CFG.endpoint) {
    const r = await fetch(IA_CFG.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tipo, ...params }) })
    const j = await r.json(); return j.texto
  }
  await new Promise((ok) => setTimeout(ok, 450))
  return tipo === 'mensaje' ? generarMensaje(params, variante) : generarContenido(params, variante)
}

/* BONUS (LANZAMIENTO-FUENTE-DE-VERDAD.md §3). Por rapidez es acumulativo: los 5 primeros tienen también lo de los 10 y los 20. */
export const BONUS_TODOS = [
  { id: 'iaContenido', nombre: 'IA que te crea contenido', desc: 'Genera guiones, textos y piezas sin cara listos para publicar.', to: '/ia/contenido' },
  { id: 'comunidad', nombre: 'Comunidad de afiliados', desc: 'Grupo privado para compartir resultados, dudas y estrategias.', to: '/comunidad' },
]
export const BONUS_RAPIDEZ = [
  { id: 'clase', hasta: 20, nombre: 'Clase reducida con los gemelos', desc: 'Para los 20 primeros.', pendiente: 'online (tabla de la oferta) o evento presencial en su casa (anuncios 3 y 11)', huecos: true },
  { id: 'sesion', hasta: 10, nombre: 'Sesión 1 a 1 online con los gemelos', desc: 'Para los 10 primeros.', huecos: true },
  { id: 'comida', hasta: 5, nombre: 'Comida con los gemelos', desc: 'Para los 5 primeros. El equipo te contacta para cerrar fecha y sitio.', huecos: false },
]
/* huecos de ejemplo para reservar (⇢ las fechas reales las pone dirección) */
export function huecosEjemplo(id) {
  const base = new Date(); base.setHours(0, 0, 0, 0)
  const d = (n, h) => { const x = new Date(base.getTime() + n * 864e5); x.setHours(h, 0, 0, 0); return x.toISOString() }
  return id === 'clase' ? [d(10, 19), d(17, 19)] : [d(5, 12), d(6, 17), d(8, 11), d(12, 18)]
}
