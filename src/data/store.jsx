/* El estado del aula y sus acciones. Sólo front: los datos salen de mock.js y lo que el usuario toca
   (lecciones vistas, asistencias, publicaciones, soporte, nombre) se guarda en localStorage. «Reiniciar»
   en la cabecera lo deja como al principio. El avance SE CALCULA (vistas / lecciones), nunca se guarda.
   Forma del estado:
     aula · perfil · rol · secciones[{id,nombre,desc,grupo,comprado,modulos[{id,nombre,desc,lecciones[{id,titulo,dur,vista,video_url,material_url,entregable,recursos}]}]}]
     vistas[] · ultima · directos[] · confirmados[] · grabaciones[] · grabVistas[] · canales[{id,nombre,soloEquipo}]
     posts[{id,canal,autor,autor_id,equipo,texto,creado,reacciones,mia,comentarios[]}] · leidos{} · soporte[] · preguntas[] */
import { createContext, useContext, useEffect, useMemo, useReducer, useRef } from 'react'
import * as M from './mock.js'

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
    case 'soporte:msg': return { ...s, soporte: s.soporte.map((c) => (c.id === a.id ? { ...c, estado: a.msg.de === 'equipo' ? 'respondido' : 'abierto', mensajes: [...c.mensajes, a.msg] } : c)) }
    case 'soporte:cerrar': return { ...s, soporte: s.soporte.map((c) => (c.id === a.id ? { ...c, estado: 'resuelto' } : c)) }
    case 'pregunta': return { ...s, preguntas: [a.pregunta, ...s.preguntas] }
    case 'perfil': return { ...s, perfil: { ...s.perfil, ...a.perfil }, alumno: { ...s.alumno, ...a.perfil } }
    case 'reset': return a.estado
    default: return s
  }
}

/* ------------------------------------------------- el motor: mock + localStorage ---- */
const demoKey = (aula) => `aula:${aula.key}:demo:v2`
const vistasIniciales = () => M.secciones.flatMap((s) => s.modulos.flatMap((m) => m.lecciones.filter((l) => l.vista).map((l) => l.id)))
function estadoDemo(aula) {
  const base = {
    cargando: false, aula, rol: 'alumno',
    perfil: { id: 'a1', nombre: M.alumnoDemo.nombre, email: M.alumnoDemo.email, creado: M.alumnoDemo.alta, rol: 'alumno' },
    alumno: M.alumnoDemo, accesos: [{ nombre: 'Zona Gemelos VIP' }],
    secciones: M.secciones.map((s) => ({ ...s, modulos: s.modulos.map((m) => ({ ...m, lecciones: m.lecciones.map((l) => ({ ...l, recursos: M.recursos[l.id] || [] })) })) })),
    vistas: vistasIniciales(), ultima: 'f22',
    directos: M.directos, confirmados: [], grabaciones: M.grabaciones, grabVistas: M.grabaciones.filter((g) => g.vista).map((g) => g.id),
    canales: M.canales, posts: M.posts.map((p) => ({ ...p, mia: false, comentarios: [] })), leidos: {},
    soporte: M.soporteDemo, preguntas: [],
  }
  try { const s = JSON.parse(localStorage.getItem(demoKey(aula))); if (s && s._v === 2) return { ...base, ...s } } catch {}
  return base
}
const accionesDemo = (dispatch, get) => ({
  abrirLeccion: (id) => dispatch({ type: 'leccion:abrir', id }),
  marcarVista: async (id) => dispatch({ type: 'leccion:vista', id }),
  confirmar: async (id) => dispatch({ type: 'confirmar', id }),
  grabacionVista: async (id) => dispatch({ type: 'grabacion:vista', id }),
  publicar: async (canal, texto) => { const s = get(); dispatch({ type: 'post', post: { id: 'p' + Date.now(), canal, autor: s.rol === 'direccion' ? 'Dirección' : s.perfil.nombre, equipo: s.rol === 'direccion', texto, creado: new Date().toISOString(), reacciones: 0, mia: false, comentarios: [] } }) },
  reaccionar: async (id) => dispatch({ type: 'reaccion', id }),
  comentar: async (id, texto) => { const s = get(); dispatch({ type: 'comentario', id, comentario: { id: 'c' + Date.now(), autor: s.perfil.nombre, texto, creado: new Date().toISOString() } }) },
  canalLeido: (canal) => dispatch({ type: 'canal:leido', canal }),
  soporteNuevo: async (asunto, texto) => dispatch({ type: 'soporte:nuevo', hilo: { id: 's' + Date.now(), asunto, estado: 'abierto', creado: new Date().toISOString(), mensajes: [{ de: 'tu', texto, en: new Date().toISOString() }] } }),
  soporteMsg: async (id, texto) => { const s = get(); dispatch({ type: 'soporte:msg', id, msg: { de: s.rol === 'direccion' ? 'equipo' : 'tu', autor: s.rol === 'direccion' ? 'Soporte' : undefined, texto, en: new Date().toISOString() } }) },
  soporteCerrar: async (id) => dispatch({ type: 'soporte:cerrar', id }),
  preguntar: async (texto) => dispatch({ type: 'pregunta', pregunta: { id: 'q' + Date.now(), pregunta: texto, respuesta: RESPUESTA_CORTESIA, creado: new Date().toISOString() } }),
  cambiarNombre: async (nombre) => dispatch({ type: 'perfil', perfil: { nombre } }),
  cambiarContrasena: async () => ({ ok: true, demo: true }),
  cambiarRol: (rol) => dispatch({ type: 'rol', rol }),
  salir: async () => {},
  reiniciarDemo: () => { const s = get(); localStorage.removeItem(demoKey(s.aula)); dispatch({ type: 'reset', estado: estadoDemo(s.aula) }) },
})

export const RESPUESTA_CORTESIA = 'Gracias por tu pregunta. La IA del aula está en construcción: el equipo la verá y, si hace falta, te contesta en Soporte directo o en la comunidad.'
/* ------------------------------------------------------------ provider ---- */
const Ctx = createContext(null)
export function DataProvider({ aula, children }) {
  const [state, dispatch] = useReducer(reducer, null, () => estadoDemo(aula))
  const ref = useRef(state); ref.current = state
  const get = () => ref.current
  const acciones = useMemo(() => accionesDemo(dispatch, get), [])
  useEffect(() => { try { localStorage.setItem(demoKey(aula), JSON.stringify({ ...state, _v: 2 })) } catch {} }, [state])
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
export const hoyLargo = () => new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
