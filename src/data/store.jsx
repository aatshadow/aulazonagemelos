/* El estado del aula y sus acciones. Sólo front: los datos salen de mock.js y lo que el usuario toca
   (lecciones vistas, asistencias, publicaciones, soporte, nombre) se guarda en localStorage. «Reiniciar»
   en la cabecera lo deja como al principio. El avance SE CALCULA (vistas / lecciones), nunca se guarda.
   Forma del estado:
     aula · perfil · rol · secciones[{id,nombre,desc,grupo,comprado,modulos[{id,nombre,desc,lecciones[{id,titulo,dur,vista,video_url,material_url,entregable,recursos}]}]}]
     vistas[] · ultima · directos[] · confirmados[] · grabaciones[] · grabVistas[] · canales[{id,nombre,soloEquipo}]
     posts[{id,canal,autor,autor_id,equipo,texto,creado,reacciones,mia,comentarios[]}] · leidos{} · soporte[] · preguntas[] */
import { createContext, useContext, useEffect, useMemo, useReducer, useRef } from 'react'
import * as M from './mock.js'
import { DIAS, RANGOS } from './bootcamp.js'
import { proximosDirectos, GRABACIONES, NOVEDADES, MESES_ACCESO, DESBLOQUEO } from './programa.js'
import { PLANTILLAS, FORMATOS, DEALS } from './herramientas.js'

/* ------------------------------------------------------------- reducer ---- */
function reducer(s, a) {
  switch (a.type) {
    case 'cargar': return { ...s, ...a.estado, cargando: false }
    case 'error': return { ...s, error: a.error, cargando: false }
    case 'rol': return { ...s, rol: a.rol }
    case 'leccion:vista': return { ...s, vistas: s.vistas.includes(a.id) ? s.vistas : [...s.vistas, a.id], ultima: a.id }
    case 'leccion:abrir': return { ...s, ultima: a.id }
    case 'confirmar': return { ...s, confirmados: s.confirmados.includes(a.id) ? s.confirmados.filter((x) => x !== a.id) : [...s.confirmados, a.id] }
    case 'post': return { ...s, posts: [a.post, ...s.posts] }
    case 'reaccion': return { ...s, posts: s.posts.map((p) => (p.id === a.id ? { ...p, reacciones: p.reacciones + (p.mia ? -1 : 1), mia: !p.mia } : p)) }
    case 'comentario': return { ...s, posts: s.posts.map((p) => (p.id === a.id ? { ...p, comentarios: [...(p.comentarios || []), a.comentario] } : p)) }
    case 'canal:leido': return { ...s, leidos: { ...s.leidos, [a.canal]: new Date().toISOString() } }
    case 'grabacion:vista': return { ...s, grabVistas: s.grabVistas.includes(a.id) ? s.grabVistas : [...s.grabVistas, a.id] }
    case 'soporte:nuevo': return { ...s, soporte: [a.hilo, ...s.soporte] }
    case 'soporte:msg': return { ...s, soporte: s.soporte.map((c) => (c.id === a.id ? { ...c, estado: a.msg.de === 'equipo' ? 'en curso' : c.estado === 'resuelto' ? 'abierto' : c.estado, asignado: c.asignado || (a.msg.de === 'equipo' ? a.msg.autor : null), mensajes: [...c.mensajes, a.msg] } : c)) }
    case 'soporte:asignar': return { ...s, soporte: s.soporte.map((c) => (c.id === a.id ? { ...c, asignado: a.quien, estado: c.estado === 'abierto' ? 'en curso' : c.estado, mensajes: [...c.mensajes, { de: 'sistema', texto: `${a.quien} se ha asignado el ticket.`, en: new Date().toISOString() }] } : c)) }
    case 'soporte:cerrar': return { ...s, soporte: s.soporte.map((c) => (c.id === a.id ? { ...c, estado: 'resuelto', mensajes: [...c.mensajes, { de: 'sistema', texto: `Ticket cerrado por ${a.quien}.`, en: new Date().toISOString() }] } : c)) }
    case 'pregunta': return { ...s, preguntas: [a.pregunta, ...s.preguntas] }
    case 'perfil': return { ...s, perfil: { ...s.perfil, ...a.perfil }, alumno: { ...s.alumno, ...a.perfil } }
    case 'entregar': return { ...s, entregas: { ...s.entregas, [a.n]: a.entrega } }
    case 'bienvenida': return { ...s, bienvenida: true }
    case 'reloj': return { ...s, offset: s.offset + a.dias }
    case 'ascenso:nuevo': return { ...s, ascensos: [a.ascenso, ...s.ascensos] }
    case 'revisar': return revisar(s, a)
    case 'escenario': return { ...s, ...a.parche }
    case 'nicho': return { ...s, nicho: a.nicho }
    case 'col:guardar': { const l = s[a.col] || []; return { ...s, [a.col]: l.some((x) => x.id === a.item.id) ? l.map((x) => (x.id === a.item.id ? { ...x, ...a.item } : x)) : [a.item, ...l] } }
    case 'col:borrar': return { ...s, [a.col]: (s[a.col] || []).filter((x) => x.id !== a.id) }
    case 'directo:editar': return { ...s, directosEdit: { ...s.directosEdit, [a.id]: { ...s.directosEdit[a.id], ...a.cambios } } }
    case 'bonus:estado': return { ...s, bonusEstados: { ...s.bonusEstados, [a.alumno]: { ...s.bonusEstados[a.alumno], [a.id]: a.estado } } }
    case 'enlace:nuevo': return { ...s, comisiones: { ...s.comisiones, enlaces: [...s.comisiones.enlaces, a.enlace] } }
    case 'enlace:borrar': return { ...s, comisiones: { enlaces: s.comisiones.enlaces.filter((e) => e.id !== a.id), apuntes: s.comisiones.apuntes.filter((x) => x.enlace !== a.id) } }
    case 'apunte:nuevo': return { ...s, comisiones: { ...s.comisiones, apuntes: [...s.comisiones.apuntes, a.apunte] } }
    case 'apunte:borrar': return { ...s, comisiones: { ...s.comisiones, apuntes: s.comisiones.apuntes.filter((x) => x.id !== a.id) } }
    case 'deal:solicitar': return { ...s, solicitudesDeal: [...s.solicitudesDeal.filter((x) => x.deal !== a.deal), { deal: a.deal, estado: 'pendiente', en: new Date().toISOString(), alumno: s.perfil.nombre }] }
    case 'deal:responder': return { ...s, solicitudesDeal: s.solicitudesDeal.map((x) => (x.deal === a.deal ? { ...x, estado: a.estado, enlace: a.enlace || x.enlace, respondida: new Date().toISOString() } : x)) }
    case 'bonus:nivel': return { ...s, bonusRapidez: a.nivel }
    case 'bonus:reservar': return { ...s, reservasBonus: { ...s.reservasBonus, [a.id]: { estado: a.estado, cuando: a.cuando || null, en: new Date().toISOString() } } }
    case 'guardar:ia': return { ...s, guardados: [a.item, ...s.guardados] }
    case 'borrar:ia': return { ...s, guardados: s.guardados.filter((g) => g.id !== a.id) }
    case 'novedades:leidas': return { ...s, novLeidas: new Date().toISOString() }
    case 'reset': return a.estado
    default: return s
  }
}

/* La revisión del equipo: una prueba de hito (e-N), un ascenso propio (as-…) o uno de ejemplo de otro alumno (r…).
   Aprobar el día 30 o un ascenso sube el rango y publica en #ascensos, solo. */
function subir(s, a2) {
  const r = RANGOS[a2]; const de = RANGOS[a2 - 1]
  const post = { id: 'p' + Date.now(), canal: 'ascensos', autor: 'Zona Gemelos VIP', equipo: true, texto: `${s.perfil.nombre} pasa de ${de.nombre} a ${r.nombre}. ${r.objeto} en camino.`, creado: new Date().toISOString(), reacciones: 0, mia: false, comentarios: [], ascenso: r.k }
  return { rango: a2, posts: [post, ...s.posts] }
}
function revisar(s, { id, ok, nota }) {
  const en = new Date().toISOString()
  if (id.startsWith('e-')) {
    const n = +id.slice(2); const e = s.entregas[n]; if (!e) return s
    const t = { ...s, entregas: { ...s.entregas, [n]: { ...e, estado: ok ? 'aprobada' : 'devuelta', nota, revisada: en } } }
    return ok && n === DIAS.length && s.rango === 0 ? { ...t, ...subir(t, 1) } : t
  }
  if (id.startsWith('as-')) {
    const as = s.ascensos.find((x) => x.id === id); if (!as) return s
    const t = { ...s, ascensos: s.ascensos.map((x) => (x.id === id ? { ...x, estado: ok ? 'aprobado' : 'devuelto', nota, revisada: en } : x)) }
    return ok ? { ...t, ...subir(t, as.a) } : t
  }
  return { ...s, revisadas: [...s.revisadas, id] }
}

/* ------------------------------------------------- el motor: mock + localStorage ---- */
const DIA = 864e5
const inicioDia = (t) => { const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime() }
/* Escenarios de la vista previa: el alumno el día 17, el día 30 o ya en Pista. */
const entregasHasta = (hasta) => Object.fromEntries(DIAS.filter((d) => d.n <= hasta).map((d) => [d.n, { estado: d.prueba.revision ? 'aprobada' : 'hecha', texto: 'Entregado en la demo.', en: new Date(Date.now() - (hasta - d.n + 1) * DIA).toISOString() }]))
export const ESCENARIOS = {
  nuevo: { nombre: 'Recién llegado (bienvenida)', parche: () => ({ alta: new Date().toISOString(), offset: 0, entregas: {}, rango: 0, ascensos: [], bienvenida: false }) },
  dia17: { nombre: 'Día 17 del bootcamp', parche: () => ({ alta: new Date(Date.now() - 16 * DIA).toISOString(), offset: 0, entregas: entregasHasta(16), rango: 0, ascensos: [], bienvenida: true }) },
  dia30: { nombre: 'Día 30: la conversión', parche: () => ({ alta: new Date(Date.now() - 29 * DIA).toISOString(), offset: 0, entregas: entregasHasta(29), rango: 0, ascensos: [], bienvenida: true }) },
  pista: { nombre: 'Ya en Pista', parche: () => ({ alta: new Date(Date.now() - 34 * DIA).toISOString(), offset: 0, entregas: entregasHasta(30), rango: 1, ascensos: [], bienvenida: true }) },
}

const demoKey = (aula) => `aula:${aula.key}:demo:v7`
const vistasIniciales = () => M.secciones.flatMap((s) => s.modulos.flatMap((m) => m.lecciones.filter((l) => l.vista).map((l) => l.id)))
function estadoDemo(aula) {
  const base = {
    cargando: false, aula, rol: 'alumno',
    perfil: { id: 'a1', nombre: M.alumnoDemo.nombre, email: M.alumnoDemo.email, creado: M.alumnoDemo.alta, rol: 'alumno' },
    alumno: M.alumnoDemo, accesos: [{ nombre: 'Zona Gemelos VIP' }],
    secciones: M.secciones.map((s) => ({ ...s, modulos: s.modulos.map((m) => ({ ...m, lecciones: m.lecciones.map((l) => ({ ...l, recursos: M.recursos[l.id] || [] })) })) })),
    vistas: vistasIniciales(), ultima: 'f22',
    directos: proximosDirectos(10), confirmados: [], grabaciones: GRABACIONES, grabVistas: ['g1'],
    nicho: null, novedades: NOVEDADES, novLeidas: null,
    plantillas: PLANTILLAS, formatos: FORMATOS, deals: DEALS, directosNuevos: [], directosEdit: {}, bonusEstados: {},
    comisiones: { enlaces: [], apuntes: [] }, solicitudesDeal: [], bonusRapidez: 10, reservasBonus: {}, guardados: [],
    canales: M.canales, posts: M.posts.map((p) => ({ ...p, mia: false, comentarios: [] })), leidos: {},
    soporte: M.soporteDemo, preguntas: [],
    ...ESCENARIOS.dia17.parche(), revisadas: [],
  }
  // el temario viene siempre de mock.js, nunca de lo guardado en el navegador
  try { const s = JSON.parse(localStorage.getItem(demoKey(aula))); if (s && s._v === 7) return { ...base, ...s, secciones: base.secciones, directos: proximosDirectos(10) } } catch {}
  return base
}
const accionesDemo = (dispatch, get) => ({
  abrirLeccion: (id) => dispatch({ type: 'leccion:abrir', id }),
  marcarVista: async (id) => dispatch({ type: 'leccion:vista', id }),
  confirmar: async (id) => dispatch({ type: 'confirmar', id }),
  grabacionVista: async (id) => dispatch({ type: 'grabacion:vista', id }),
  publicar: async (canal, texto, extra = {}) => { const s = get(); const eq = esEquipo(s); dispatch({ type: 'post', post: { id: 'p' + Date.now(), canal, autor: eq ? (s.rol === 'direccion' ? 'Dirección' : 'Moderación') : s.perfil.nombre, equipo: eq, rango: s.rango, texto, ...extra, creado: new Date().toISOString(), reacciones: 0, mia: false, comentarios: [] } }) },
  reaccionar: async (id) => dispatch({ type: 'reaccion', id }),
  comentar: async (id, texto) => { const s = get(); dispatch({ type: 'comentario', id, comentario: { id: 'c' + Date.now(), autor: s.perfil.nombre, texto, creado: new Date().toISOString() } }) },
  canalLeido: (canal) => dispatch({ type: 'canal:leido', canal }),
  soporteNuevo: async (asunto, texto, categoria = 'Otro') => { const s = get(); const num = Math.max(40, ...s.soporte.map((t) => t.num || 0)) + 1; const id = 't' + num; const en = new Date().toISOString()
    dispatch({ type: 'soporte:nuevo', hilo: { id, num, alumno: s.perfil.nombre, categoria, asunto, estado: 'abierto', asignado: null, creado: en, mensajes: [{ de: 'alumno', autor: s.perfil.nombre, texto, en }, { de: 'sistema', texto: 'Ticket creado. Lo ve el equipo de moderación y administración; te contestan aquí en menos de 24 horas.', en }] } }); return id },
  soporteMsg: async (id, texto) => { const s = get(); const eq = esEquipo(s); dispatch({ type: 'soporte:msg', id, msg: { de: eq ? 'equipo' : 'alumno', autor: eq ? ROL_NOMBRE[s.rol] : s.perfil.nombre, texto, en: new Date().toISOString() } }) },
  soporteAsignar: async (id) => { const s = get(); dispatch({ type: 'soporte:asignar', id, quien: ROL_NOMBRE[s.rol] }) },
  soporteCerrar: async (id) => { const s = get(); dispatch({ type: 'soporte:cerrar', id, quien: esEquipo(s) ? ROL_NOMBRE[s.rol] : s.perfil.nombre }) },
  preguntar: async (texto) => dispatch({ type: 'pregunta', pregunta: { id: 'q' + Date.now(), pregunta: texto, respuesta: RESPUESTA_CORTESIA, creado: new Date().toISOString() } }),
  cambiarNombre: async (nombre) => dispatch({ type: 'perfil', perfil: { nombre } }),
  cambiarContrasena: async () => ({ ok: true, demo: true }),
  cambiarRol: (rol) => dispatch({ type: 'rol', rol }),
  entregar: async (n, prueba) => dispatch({ type: 'entregar', n, entrega: { ...prueba, estado: DIAS[n - 1].prueba.revision ? 'revision' : 'hecha', en: new Date().toISOString() } }),
  verBienvenida: () => dispatch({ type: 'bienvenida' }),
  pasarDia: () => dispatch({ type: 'reloj', dias: 1 }),
  solicitarAscenso: async (prueba) => { const s = get(); dispatch({ type: 'ascenso:nuevo', ascenso: { id: 'as-' + Date.now(), de: s.rango, a: s.rango + 1, ...prueba, estado: 'revision', en: new Date().toISOString() } }) },
  revisar: async (id, ok, nota = '') => dispatch({ type: 'revisar', id, ok, nota }),
  elegirNicho: (nicho) => dispatch({ type: 'nicho', nicho }),
  guardarEn: (col, item) => dispatch({ type: 'col:guardar', col, item: { id: item.id || col.slice(0, 2) + Date.now(), ...item } }),
  borrarDe: (col, id) => dispatch({ type: 'col:borrar', col, id }),
  editarDirecto: (id, cambios) => dispatch({ type: 'directo:editar', id, cambios }),
  estadoBonus: (alumno, id, estado) => dispatch({ type: 'bonus:estado', alumno, id, estado }),
  nuevoEnlace: (enlace) => dispatch({ type: 'enlace:nuevo', enlace: { id: 'e' + Date.now(), ...enlace } }),
  borrarEnlace: (id) => dispatch({ type: 'enlace:borrar', id }),
  nuevoApunte: (apunte) => dispatch({ type: 'apunte:nuevo', apunte: { id: 'ap' + Date.now(), ...apunte } }),
  borrarApunte: (id) => dispatch({ type: 'apunte:borrar', id }),
  solicitarDeal: (deal) => dispatch({ type: 'deal:solicitar', deal }),
  responderDeal: (deal, estado, enlace) => dispatch({ type: 'deal:responder', deal, estado, enlace }),
  nivelBonus: (nivel) => dispatch({ type: 'bonus:nivel', nivel }),
  reservarBonus: (id, estado, cuando) => dispatch({ type: 'bonus:reservar', id, estado, cuando }),
  guardarIA: (item) => dispatch({ type: 'guardar:ia', item: { id: 'g' + Date.now(), en: new Date().toISOString(), ...item } }),
  borrarIA: (id) => dispatch({ type: 'borrar:ia', id }),
  leerNovedades: () => dispatch({ type: 'novedades:leidas' }),
  escenario: (k) => dispatch({ type: 'escenario', parche: ESCENARIOS[k].parche() }),
  salir: async () => {},
  reiniciarDemo: () => { const s = get(); localStorage.removeItem(demoKey(s.aula)); dispatch({ type: 'reset', estado: estadoDemo(s.aula) }) },
})

/* el equipo: moderación y administración (dirección). Ven todos los tickets y todas las zonas por rango. */
export const ROL_NOMBRE = { alumno: 'Alumno', moderador: 'Moderación', direccion: 'Admin' }
export const esEquipo = (s) => s.rol === 'moderador' || s.rol === 'direccion'
export const puedeVerCanal = (s, c) => c.rangoSolo == null || esEquipo(s) || s.rango === c.rangoSolo
export const misTickets = (s) => esEquipo(s) ? s.soporte : s.soporte.filter((t) => t.alumno === s.perfil.nombre)
export const RESPUESTA_CORTESIA = 'Gracias por tu pregunta. La IA del aula está en construcción: el equipo la verá y, si hace falta, te contesta en Soporte directo o en la comunidad.'
/* ------------------------------------------------------------ provider ---- */
const Ctx = createContext(null)
export function DataProvider({ aula, children }) {
  const [state, dispatch] = useReducer(reducer, null, () => estadoDemo(aula))
  const ref = useRef(state); ref.current = state
  const get = () => ref.current
  const acciones = useMemo(() => accionesDemo(dispatch, get), [])
  useEffect(() => { const k = new URLSearchParams(location.search).get('escenario'); if (k && ESCENARIOS[k]) acciones.escenario(k) }, [])
  useEffect(() => { try { localStorage.setItem(demoKey(aula), JSON.stringify({ ...state, _v: 7 })) } catch {} }, [state])
  const api = useMemo(() => ({ state, dispatch, acciones, aula: state.aula, modulo: (m) => (state.aula?.modulos_activos || []).includes(m) }), [state, acciones])
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}
export const useData = () => useContext(Ctx)

/* helpers de dominio — el avance SE CALCULA, nunca se guarda */
export const leccionesDe = (sec) => sec.modulos.flatMap((m) => m.lecciones)
export const todasLasLecciones = (state) => state.secciones.flatMap((s) => s.modulos.flatMap((m) => m.lecciones.map((l) => ({ ...l, seccion: s, modulo: m }))))
const av = (ls, vistas) => { const v = ls.filter((l) => vistas.includes(l.id)).length; return { vistas: v, total: ls.length, pct: ls.length ? Math.round((v / ls.length) * 100) : 0 } }
export const avanceSeccion = (state, sec) => av(leccionesDe(sec), state.vistas)
export const avanceTotal = (state) => av(todasLasLecciones(state).filter((l) => l.seccion.comprado), state.vistas)
export const buscarLeccion = (state, id) => todasLasLecciones(state).find((l) => l.id === id)
/* la siguiente lección: la última abierta si no está vista; si no, la primera no vista en orden */
export const siguienteLeccion = (state) => {
  const todas = todasLasLecciones(state).filter((l) => l.seccion.comprado)
  const u = todas.find((l) => l.id === state.ultima)
  if (u && !state.vistas.includes(u.id)) return u
  return todas.find((l) => !state.vistas.includes(l.id)) || todas[todas.length - 1]
}
export const modulosPendientes = (state, sec) => sec.modulos.filter((m) => m.lecciones.some((l) => !state.vistas.includes(l.id))).length
export const noLeidos = (state, canal) => { const desde = state.leidos[canal]; return state.posts.filter((p) => p.canal === canal && (!desde || p.creado > desde)).length }
export const fmtFecha = (iso, opts = {}) => new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', ...opts })
export const fmtHora = (iso) => new Date(iso).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
export const hace = (iso) => { const h = (Date.now() - new Date(iso)) / 36e5; if (h < 1) return `hace ${Math.max(1, Math.round(h * 60))} min`; if (h < 24) return `hace ${Math.floor(h)} h`; const d = Math.floor(h / 24); if (d === 1) return 'ayer'; return `hace ${d} días` }
/* ---- el camino: TODO se calcula de las entregas y del reloj; nada de «día actual» guardado ---- */
export const diaReloj = (s) => Math.max(1, Math.floor((inicioDia(Date.now() + s.offset * DIA) - inicioDia(s.alta)) / DIA) + 1)
export const entregado = (s, n) => { const e = s.entregas[n]; return !!e && e.estado !== 'devuelta' }
/* el primer día sin prueba entregada (31 = bootcamp terminado) */
export const diaActual = (s) => (DIAS.find((d) => !entregado(s, d.n)) || { n: DIAS.length + 1 }).n
/* un día se abre cuando el anterior tiene prueba Y ha pasado la medianoche (reloj ≥ n) */
/* el día 1 se abre al ver la bienvenida de los gemelos */
export const diaAbierto = (s, n) => n === 1 ? !!s.bienvenida : (entregado(s, n - 1) && diaReloj(s) >= n)
export const estadoDia = (s, n) => {
  const e = s.entregas[n]
  if (e) return e.estado // hecha · revision · aprobada · devuelta
  if (n === 1 && !s.bienvenida) return 'bienvenida'
  if (n === diaActual(s)) return diaAbierto(s, n) ? 'hoy' : 'manana'
  return 'cerrado'
}
export const retraso = (s) => Math.max(0, Math.min(diaReloj(s), DIAS.length) - diaActual(s))
export const rangoDe = (s) => RANGOS[s.rango]
export const ascensoPendiente = (s) => s.ascensos.find((a) => a.estado === 'revision') || (s.rango === 0 && s.entregas[DIAS.length]?.estado === 'revision' ? { a: 1, estado: 'revision', bootcamp: true } : null)
/* abierta si tienes su rango y, si lleva `desdeDia`, ya has llegado a ese día del bootcamp (o lo has terminado) */
export const seccionAbierta = (s, sec) => s.rango >= (sec.rango || 0) && !sec.pronto && (!sec.desdeDia || s.rango > 0 || diaActual(s) >= sec.desdeDia)
/* la cola de revisión de dirección: lo del alumno demo + los ejemplos sin revisar */
export const colaRevision = (s) => [
  ...Object.entries(s.entregas).filter(([, e]) => e.estado === 'revision').map(([n, e]) => { const d = DIAS[n - 1]; return { id: 'e-' + n, alumno: s.perfil.nombre, tipo: n == DIAS.length ? 'ascenso' : 'prueba', dia: +n, que: n == DIAS.length ? 'Cola → Pista' : d.hito, pide: d.prueba.pide, prueba: e, creado: e.en, propio: true } }),
  ...s.ascensos.filter((a) => a.estado === 'revision').map((a) => ({ id: a.id, alumno: s.perfil.nombre, tipo: 'ascenso', que: `${RANGOS[a.de].nombre} → ${RANGOS[a.a].nombre}`, pide: RANGOS[a.de].prueba, prueba: a, creado: a.en, propio: true })),
  ...M.revisionDemo.filter((r) => !s.revisadas.includes(r.id)),
].sort((a, b) => (a.creado < b.creado ? 1 : -1))
export const hoyLargo = () => new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })

/* ---- el programa de 12 meses: acceso (formación + soporte ilimitado) desde el alta ---- */
export const accesoDe = (s) => {
  const inicio = new Date(s.alta); const fin = new Date(inicio); fin.setMonth(fin.getMonth() + MESES_ACCESO)
  const ahora = Date.now() + (s.offset || 0) * DIA
  const total = fin - inicio; const pasado = Math.min(total, Math.max(0, ahora - inicio))
  const dias = Math.max(0, Math.ceil((fin - ahora) / DIA))
  return { inicio, fin, dias, meses: Math.max(0, Math.round(dias / 30.4)), mes: Math.min(MESES_ACCESO, Math.floor(pasado / (total / MESES_ACCESO)) + 1), pct: Math.round((pasado / total) * 100), activo: dias > 0 }
}
export const novedadesSinLeer = (s) => (s.novedades || []).filter((n) => !s.novLeidas || n.fecha > s.novLeidas).length

/* ---- desbloqueo «a su debido tiempo»: un día del bootcamp y/o un rango. Lo terminado del bootcamp (rango > 0) lo abre todo lo de días. ---- */
export const abiertoDesde = (s, req = {}) => { if (esEquipo(s)) return true; if (typeof req === 'string') req = DESBLOQUEO[req] || {}; return abiertoReq(s, req) }
const abiertoReq = (s, req) => s.rango >= (req.rango || 0) && (!req.dia || s.rango > 0 || diaActual(s) >= req.dia)
export const reqFase = (f) => DESBLOQUEO[f.id] || {}
export const reqLeccion = (f, l) => (l.desbloqueo && DESBLOQUEO[l.desbloqueo]) || reqFase(f)
export const textoReq = (req) => { if (typeof req === 'string') req = DESBLOQUEO[req] || {}; return textoReq2(req) }
const textoReq2 = (req) => req.rango ? `Se abre al llegar a ${RANGOS[req.rango].nombre}` : `Se abre el día ${req.dia} del bootcamp`

/* los directos: los generados (2 por semana) con lo que dirección les ha cambiado + los que ha creado */
export const directosDe = (s) => [...s.directos.map((d) => ({ ...d, ...(s.directosEdit?.[d.id] || {}) })), ...(s.directosNuevos || [])].filter((d) => !d.cancelado).sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
