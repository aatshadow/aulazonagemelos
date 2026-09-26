/* DIRECCIÓN · el lado del equipo dentro del aula, sólo para `rol = direccion`: sus alumnos (avance,
   última lección, acceso, y la ficha lección a lección) y su equipo. Sólo front: los alumnos y el
   equipo salen de mock.js; las acciones no persisten. */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Circle, ShieldOff, Search, UserPlus, X } from 'lucide-react'
import { PageHeader, Card, Tag, Bar, Avatar, Btn, Empty } from '../ui/index.jsx'
import { useData, todasLasLecciones, hace, fmtFecha } from '../data/store.jsx'
import { alumnosDemo, equipoDemo } from '../data/mock.js'

export function Prohibido() {
  return (
    <div className="max-w-[560px]">
      <PageHeader kicker="403" title="Esto es sólo para dirección" sub="Estás viendo el aula como alumno. Cambia a «Dirección» en la cabecera para ver esta pantalla." />
      <Link to="/" className="btn outline sm"><ShieldOff size={14} /> Volver al panel</Link>
    </div>
  )
}

/* Las lecciones vistas por un alumno de ejemplo: las N primeras del temario, en orden. */
const vistasDe = (lecciones, a) => new Set(lecciones.slice(0, a.vistasN).map((l) => l.id))

function ProgresoAlumno({ alumno, lecciones, secciones }) {
  const vistas = vistasDe(lecciones, alumno)
  return (
    <div>
      <div className="kicker mb-2">Progreso lección a lección</div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {secciones.map((s) => { const ls = s.modulos.flatMap((m) => m.lecciones); const v = ls.filter((l) => vistas.has(l.id)).length; return (
          <div key={s.id} className="card p-3">
            <div className="flex items-center justify-between gap-2 mb-1"><b className="text-[13.5px]">{s.nombre}</b><span className="num text-xs text-dim">{v}/{ls.length}</span></div>
            {s.modulos.map((m) => (
              <div key={m.id} className="mt-1.5">
                <div className="kicker dim" style={{ fontSize: 8.5 }}>{m.nombre}</div>
                {m.lecciones.map((l) => <div key={l.id} className="flex items-center gap-2 text-[12.5px] py-0.5">{vistas.has(l.id) ? <CheckCircle2 size={12} className="text-gold-2 shrink-0" /> : <Circle size={12} className="text-faint shrink-0" />}<span className={vistas.has(l.id) ? '' : 'text-dim'}>{l.titulo}</span></div>)}
              </div>))}
          </div>) })}
      </div>
    </div>
  )
}

function Alumnos() {
  const { state } = useData()
  const lecciones = todasLasLecciones(state)
  const [q, setQ] = useState('')
  const [abierto, setAbierto] = useState(null)
  const filas = alumnosDemo.map((a) => { const n = Math.min(a.vistasN, lecciones.length); return { ...a, vistas: n, pct: lecciones.length ? Math.round((n / lecciones.length) * 100) : 0, ultima: n ? lecciones[n - 1] : null } })
    .filter((a) => !q || `${a.nombre} ${a.email}`.toLowerCase().includes(q.toLowerCase()))
  const sel = abierto && filas.find((a) => a.id === abierto)
  return (
    <div>
      <PageHeader kicker="Dirección" title="Alumnos" sub="Tus alumnos: avance, última lección y último acceso. Abre la ficha para verlo lección a lección."
        right={<Btn size="sm" tone="outline" onClick={() => alert('En esta vista previa no se crean alumnos.')}><UserPlus size={14} /> Nuevo alumno</Btn>} />
      <div className="relative mb-4 max-w-[380px]"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dimmer" /><input className="input pl-9" placeholder="Buscar por nombre o correo" value={q} onChange={(e) => setQ(e.target.value)} /></div>
      {!filas.length ? <Empty title="Sin resultados" sub="Ningún alumno casa con esa búsqueda." /> : (
        <Card className="p-0 overflow-hidden">
          <table className="w-full text-[13px]">
            <thead><tr className="kicker text-left"><th className="p-3">Alumno</th><th className="p-3 hide-mobile">Avance</th><th className="p-3 hide-mobile">Última lección</th><th className="p-3">Último acceso</th><th className="p-3">Estado</th></tr></thead>
            <tbody>
              {filas.map((a) => (
                <tr key={a.id} className="border-t border-line-soft hover:bg-sur-hi cursor-pointer" onClick={() => setAbierto(a.id === abierto ? null : a.id)}>
                  <td className="p-3"><div className="flex items-center gap-3"><Avatar name={a.nombre} size={30} /><div className="min-w-0"><div className="font-medium truncate">{a.nombre}</div><div className="text-dimmer text-xs mono truncate">{a.email}</div></div></div></td>
                  <td className="p-3 hide-mobile"><div className="flex items-center gap-2"><Bar pct={a.pct} className="w-24" /><span className="num text-xs">{a.pct}%</span><span className="text-dimmer text-xs">{a.vistas}/{lecciones.length}</span></div></td>
                  <td className="p-3 hide-mobile text-dim">{a.ultima ? a.ultima.titulo : '—'}</td>
                  <td className="p-3 text-dim">{hace(a.ultimoAcceso)}</td>
                  <td className="p-3"><Tag tone={a.activo ? 'green' : undefined}>{a.activo ? 'activo' : 'desactivado'}</Tag></td>
                </tr>))}
            </tbody>
          </table>
        </Card>)}
      {sel && (
        <Card className="mt-4">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3"><Avatar name={sel.nombre} size={44} gold /><div><div className="text-[16px] font-semibold">{sel.nombre}</div><div className="text-dimmer text-xs mono">{sel.email} · alumno desde el {fmtFecha(sel.alta, { year: 'numeric' })}</div></div></div>
            <button className="btn ghost sm" onClick={() => setAbierto(null)} aria-label="Cerrar"><X size={14} /></button>
          </div>
          <div className="grid gap-3 md:grid-cols-3 mb-5">
            <div className="card p-3"><div className="kicker">Avance</div><div className="num text-[22px] mt-1">{sel.pct}%</div><div className="text-dimmer text-xs">{sel.vistas} de {lecciones.length} lecciones</div></div>
            <div className="card p-3"><div className="kicker">Acceso</div><div className="text-[14px] mt-1">Zona Gemelos VIP</div><div className="text-dimmer text-xs">acceso completo</div></div>
            <div className="card p-3"><div className="kicker">Acciones</div><div className="flex gap-2 mt-2 flex-wrap"><Btn size="sm" tone="outline" onClick={() => alert('En esta vista previa no se resetean contraseñas.')}>Resetear contraseña</Btn><Btn size="sm" tone="ghost" onClick={() => alert('En esta vista previa no se desactivan alumnos.')}>{sel.activo ? 'Desactivar' : 'Activar'}</Btn></div></div>
          </div>
          <ProgresoAlumno alumno={sel} lecciones={lecciones} secciones={state.secciones} />
        </Card>)}
    </div>
  )
}

function Equipo() {
  return (
    <div>
      <PageHeader kicker="Dirección" title="Equipo" sub="Quién más lleva este aula. En la versión completa se añade un correo y pasa a dirección; a ti mismo no te puedes quitar."
        right={<Btn size="sm" tone="outline" onClick={() => alert('En esta vista previa no se añaden personas al equipo.')}><UserPlus size={14} /> Añadir</Btn>} />
      <Card className="p-0 overflow-hidden">
        <table className="w-full text-[13px]">
          <thead><tr className="kicker text-left"><th className="p-3">Persona</th><th className="p-3 hide-mobile">Desde</th><th className="p-3">Rol</th></tr></thead>
          <tbody>
            {equipoDemo.map((p) => (
              <tr key={p.id} className="border-t border-line-soft">
                <td className="p-3"><div className="flex items-center gap-3"><Avatar name={p.nombre} size={30} gold /><div className="min-w-0"><div className="font-medium truncate">{p.nombre}{p.yo && <span className="text-dimmer text-xs"> · tú</span>}</div><div className="text-dimmer text-xs mono truncate">{p.email}</div></div></div></td>
                <td className="p-3 hide-mobile text-dim">{fmtFecha(p.desde, { year: 'numeric' })}</td>
                <td className="p-3"><Tag tone="gold">dirección</Tag></td>
              </tr>))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

export default function Direccion({ vista = 'alumnos' }) {
  const { state } = useData()
  if (state.rol !== 'direccion') return <Prohibido />
  return vista === 'equipo' ? <Equipo key="equipo" /> : <Alumnos key="alumnos" />
}
