/* EL PROGRAMA · 12 meses. Fuente del producto: lanzamiento-nov/LANZAMIENTO-FUENTE-DE-VERDAD.md §3 «La oferta»
   (07-10-2026) y el plan PORTAL-PLAN-v2.md. El sistema de 5 fases es la columna vertebral; el bootcamp de 30 días es el
   arranque (mes 1) y cada día lleva su fase. Lo que aún no está grabado o decidido va marcado: `ejemplo: true` (contenido
   de muestra) o `pendiente` (falta un dato). Nada de cifras de comisiones ni acuerdos reales inventados. */

export const PROMESA = 'Aprende a hacerte rico con el marketing de afiliados igual que hemos hecho nosotros, usando la IA y sin necesidad de mostrar tu cara.'
export const QUE_APRENDEN = 'Cómo alguien que empieza de cero puede generar comisiones como afiliado en trading, casinos y plataformas fitness, aplicando un mismo sistema: elegir oferta, crear contenido sin cara con IA, captar tráfico, convertir y escalar.'
export const MESES_ACCESO = 12

/* DESBLOQUEO «a su debido tiempo» (Alex 07-10: «todo a su debido tiempo dentro del bootcamp, se les desbloquea»).
   Cada pieza se abre el día del bootcamp en que se empieza a necesitar (src/data/bootcamp.js) o con un rango.
   Terminar el bootcamp (rango ≥ 1, Pista) lo abre todo lo que va por días. Directos, comunidad, soporte y bonus: día 1. */
export const DESBLOQUEO = {
  oferta: { dia: 1, por: 'Semana 1: el juego y tu oferta' },
  bonus: { dia: 1, por: 'Desde que entras' },
  deals: { dia: 3, por: 'Día 3 «Cómo te pagan»: empiezas a buscar ofertas' },
  trafico: { dia: 8, por: 'Semana 2: montas la cadena (tracking, cuenta de anuncios)' },
  contenido: { dia: 15, por: 'Día 15 «Cara o avatar»: empiezas a crear contenido' },
  iaContenido: { dia: 15, por: 'Día 15: empiezas a crear contenido' },
  contenidoVende: { dia: 15, por: 'Día 15: empiezas a crear contenido' },
  comisiones: { dia: 21, por: 'Día 21 «No toques nada»: primera anotación en la hoja de dinero' },
  convertir: { dia: 22, por: 'Semana 4: hasta tu primera conversión' },
  plantillas: { dia: 22, por: 'Semana 4: convertir' },
  iaMensajes: { dia: 22, por: 'Semana 4: convertir' },
  escalar: { rango: 1, por: 'Al llegar a Pista (bootcamp completo con tu primera conversión)' },
}

export const NICHOS = [
  { id: 'trading', nombre: 'Trading', desc: 'Brokers, plataformas y formaciones de trading.', color: '#8FBF9F' },
  { id: 'casinos', nombre: 'Casinos', desc: 'Casinos y apuestas online.', color: '#E8B04B' },
  { id: 'fitness', nombre: 'Plataformas fitness', desc: 'Apps, programas y plataformas de entrenamiento.', color: '#7DA7E8' },
]
export const nichoDe = (id) => NICHOS.find((n) => n.id === id)

/* L = lección del programa. `nicho`: solo sale en esa ruta. `ejemplo`: título provisional hasta grabarla. */
const L = (id, titulo, dur, extra = {}) => ({ id, titulo, dur, ...extra })

export const FASES = [
  {
    id: 'oferta', n: 1, nombre: 'Elegir oferta', corto: 'Oferta',
    consigues: 'Una oferta elegida con criterio, en tu nicho, que paga buenas comisiones.',
    dias: [1, 7],
    modulos: [
      { id: 'oferta-base', nombre: 'Cómo funciona el negocio', lecciones: [
        L('p-of-1', 'Qué es el marketing de afiliados y por qué tiene menos barreras de entrada', '12 min'),
        L('p-of-2', 'Cómo te pagan: CPA, CPL, RevShare e híbridos', '14 min'),
        L('p-of-3', 'Cómo elegir productos que pagan buenas comisiones', '16 min'),
      ] },
      { id: 'oferta-nicho', nombre: 'Tu nicho', lecciones: [
        L('p-of-t', 'Las ofertas de trading: qué mirar antes de promocionar', '15 min', { nicho: 'trading', ejemplo: true }),
        L('p-of-c', 'Las ofertas de casinos: qué mirar antes de promocionar', '15 min', { nicho: 'casinos', ejemplo: true }),
        L('p-of-f', 'Las ofertas fitness: qué mirar antes de promocionar', '15 min', { nicho: 'fitness', ejemplo: true }),
        L('p-of-d', 'Los deals con las plataformas: cómo pedir tu enlace', '8 min', { desbloqueo: 'deals' }),
      ] },
    ],
  },
  {
    id: 'contenido', n: 2, nombre: 'Crear contenido sin cara con IA', corto: 'Contenido',
    consigues: 'Contenido que vende, hecho con IA y sin enseñar tu cara.',
    dias: [15, 19],
    secciones: ['avatar', 'tu'],
    modulos: [
      { id: 'cont-ia', nombre: 'Contenido sin cara con IA', lecciones: [
        L('p-co-1', 'Cómo crear contenido sin cara usando IA', '18 min'),
        L('p-co-2', 'Guiones, hooks y textos con la IA de contenido', '15 min'),
        L('p-co-3', 'Formatos que ya están generando comisiones', '12 min'),
      ] },
      { id: 'cont-nicho', nombre: 'Contenido para tu nicho', lecciones: [
        L('p-co-t', 'Contenido para trading', '14 min', { nicho: 'trading', ejemplo: true }),
        L('p-co-c', 'Contenido para casinos', '14 min', { nicho: 'casinos', ejemplo: true }),
        L('p-co-f', 'Contenido para fitness', '14 min', { nicho: 'fitness', ejemplo: true }),
      ] },
    ],
  },
  {
    id: 'trafico', n: 3, nombre: 'Captar tráfico', corto: 'Tráfico',
    consigues: 'Gente llegando a tu contenido y a tu enlace, por orgánico o por anuncios.',
    dias: [8, 14], diasExtra: [20, 21],
    modulos: [
      { id: 'traf-org', nombre: 'Tráfico orgánico', lecciones: [
        L('p-tr-1', 'Dónde publicar y con qué ritmo', '13 min', { ejemplo: true }),
        L('p-tr-2', 'Llevar a la gente de tu contenido a tu enlace de afiliado', '11 min'),
      ] },
      { id: 'traf-ads', nombre: 'Tráfico pagado', lecciones: [
        L('p-tr-3', 'Tracking que no te engaña', '12 min'),
        L('p-tr-4', 'Tu primera campaña con tope de gasto', '15 min'),
      ] },
    ],
  },
  {
    id: 'convertir', n: 4, nombre: 'Convertir', corto: 'Convertir',
    consigues: 'Mensajes que cierran ventas y llevan a la gente a tu enlace: tus primeras comisiones.',
    dias: [22, 30],
    modulos: [
      { id: 'conv-msg', nombre: 'Mensajes que convierten', lecciones: [
        L('p-cv-1', 'Cómo usar las plantillas y la IA para crear mensajes que convierten', '16 min', { desbloqueo: 'plantillas' }),
        L('p-cv-2', 'Primer contacto, seguimiento y objeciones', '14 min', { ejemplo: true }),
        L('p-cv-3', 'Los errores que hacen que el 90 % de afiliados nunca cobre su primera comisión', '12 min'),
      ] },
    ],
  },
  {
    id: 'escalar', n: 5, nombre: 'Escalar', corto: 'Escalar',
    consigues: 'Hacer más grande lo que ya te funciona.',
    dias: null,
    secciones: ['escala'],
    modulos: [
      { id: 'esc-base', nombre: 'Escalar lo que funciona', lecciones: [
        L('p-es-1', 'Cómo escalar lo que ya te está funcionando', '15 min'),
        L('p-es-2', 'Más ofertas, más nichos, más tráfico', '13 min', { ejemplo: true }),
      ] },
    ],
  },
]

/* la fase de cada día del bootcamp: así el alumno ve que el arranque ya es el sistema */
export const faseDeDia = (n) => FASES.find((f) => (f.dias && n >= f.dias[0] && n <= f.dias[1]) || (f.diasExtra && n >= f.diasExtra[0] && n <= f.diasExtra[1])) || FASES[0]
export const leccionesDeFase = (f, nicho) => f.modulos.flatMap((m) => m.lecciones.filter((l) => !l.nicho || !nicho || l.nicho === nicho))
export const todasLecciones = () => FASES.flatMap((f) => f.modulos.flatMap((m) => m.lecciones.map((l) => ({ ...l, fase: f, modulo: m }))))

/* NOVEDADES del programa (las actualizaciones que incluye la formación). EJEMPLO hasta que dirección publique las reales. */
const dia = (d) => new Date(Date.now() - d * 864e5).toISOString()
export const NOVEDADES = [
  { id: 'n1', fecha: dia(2), fase: 'contenido', titulo: 'Nuevas plantillas de guion para vídeos sin cara', texto: 'Tres formatos nuevos en Contenido que vende, listos para la IA de contenido.', ejemplo: true },
  { id: 'n2', fecha: dia(9), fase: 'oferta', titulo: 'Actualizada la lección «Cómo elegir productos que pagan buenas comisiones»', texto: 'Con los criterios revisados para los tres nichos.', ejemplo: true },
  { id: 'n3', fecha: dia(20), fase: 'convertir', titulo: 'Plantillas de seguimiento y objeciones', texto: 'La biblioteca de mensajes suma el momento «objeción».', ejemplo: true },
]

/* DIRECTOS · 2 clases en directo cada semana (unas 100 al año). Días y hora ⇢ pendientes: ejemplo martes y jueves a las 21:00. */
export const DIRECTOS_CFG = { dias: [2, 4], hora: 21, min: 0, duracionMin: 90, plataforma: '', pendiente: true }
const TEMAS = [
  ['Clase en directo', 'Elegir oferta: revisamos vuestras ofertas', 'oferta'],
  ['Clase en directo', 'Contenido sin cara: guiones en directo con la IA', 'contenido'],
  ['Clase en directo', 'Tráfico: dónde está la gente esta semana', 'trafico'],
  ['Clase en directo', 'Convertir: mensajes que cierran, con casos reales', 'convertir'],
  ['Clase en directo', 'Escalar: qué duplicar y qué apagar', 'escalar'],
  ['Q&A', 'Preguntas y respuestas con los gemelos', null],
]
export function proximosDirectos(n = 8, desde = Date.now()) {
  const out = []; const d = new Date(desde); d.setHours(0, 0, 0, 0)
  for (let i = 0; out.length < n && i < 60; i++) {
    const x = new Date(d.getTime() + i * 864e5)
    if (DIRECTOS_CFG.dias.includes(x.getDay())) {
      x.setHours(DIRECTOS_CFG.hora, DIRECTOS_CFG.min, 0, 0)
      if (x.getTime() + DIRECTOS_CFG.duracionMin * 6e4 > desde) {
        const k = Math.floor(x.getTime() / 864e5)
        const [tipo, titulo, fase] = TEMAS[k % TEMAS.length]
        out.push({ id: 'dv-' + k, fecha: x.toISOString(), tipo, titulo, fase, ejemplo: true })
      }
    }
  }
  return out
}

/* GRABACIONES archivadas y buscables (EJEMPLO). Las de verdad las sube dirección. */
export const GRABACIONES = [
  ['g1', 'Elegir oferta: cómo leer una ficha de oferta', 'oferta', null, '58:22', 6],
  ['g2', 'Contenido sin cara: 10 hooks en 10 minutos con la IA', 'contenido', null, '1:04:11', 9],
  ['g3', 'Trading: qué ofertas pagan mejor este trimestre', 'oferta', 'trading', '52:40', 13],
  ['g4', 'Casinos: contenido que funciona sin enseñar la cara', 'contenido', 'casinos', '47:05', 16],
  ['g5', 'Fitness: de un vídeo a tu enlace de afiliado', 'trafico', 'fitness', '55:18', 20],
  ['g6', 'Convertir: los mensajes que mejor cierran', 'convertir', null, '1:01:33', 23],
  ['g7', 'Q&A con los gemelos', null, null, '1:12:09', 27],
  ['g8', 'Escalar: duplicar lo que funciona', 'escalar', null, '49:51', 30],
].map(([id, titulo, fase, nicho, dur, hace]) => ({ id, titulo, fase, nicho, dur, fecha: dia(hace), ejemplo: true }))

export const faseDe = (id) => FASES.find((f) => f.id === id)
