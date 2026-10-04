/* DIRECCIÓN · el lado del equipo dentro del aula, sólo para `rol = direccion`: sus alumnos (avance,
   última lección, acceso, y la ficha lección a lección) y su equipo. Sólo front: los alumnos y el
   equipo salen de mock.js; las acciones no persisten. */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShieldOff, Search, UserPlus } from 'lucide-react'
import { PageHeader, Card, Tag, Avatar, Btn, Empty } from '../ui/index.jsx'
import { useData, hace, fmtFecha, colaRevision } from '../data/store.jsx'
import { Pulsera } from '../ui/camino.jsx'
import { alumnosDemo, equipoDemo } from '../data/mock.js'

export function Prohibido() {
  return (
    <div className="max-w-[560px]">
      <PageHeader kicker="403" title="Esto es sólo para dirección" sub="Estás viendo el aula como alumno. Cambia a «Dirección» en la cabecera para ver esta pantalla." />
      <Link to="/" className="btn outline sm"><ShieldOff size={14} /> Volver al panel</Link>
    </div>
  )
}

/* LA ESCALERA DE RESCATE (SOP-51/52): días seguidos sin prueba → qué toca hacer. */
const rescate = (n) => n <= 1 ? { tono: '#8FBF9F', txt: 'Al día', paso: '' } : n <= 3 ? { tono: '#D9B45A', txt: `${n} días sin entregar`, paso: 'Mensaje automático enviado' }
  : n <= 6 ? { tono: '#E39A4F', txt: `${n} días sin entregar`, paso: 'Toca DM del equipo' } : { tono: '#E5545E', txt: `${n} días sin entregar`, paso: 'Toca llamada de 30 min' }

function Alumnos() {
  const [q, setQ] = useState('')
  const filas = alumnosDemo.filter((a) => !q || `${a.nombre} ${a.email}`.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => b.sinEntregar - a.sinEntregar)
  const enRiesgo = alumnosDemo.filter((a) => a.sinEntregar >= 2).length
  return (
    <div>
      <p className="text-dim text-[15px] mb-2">Dirección</p>
      <h1 className="text-[38px] md:text-[48px]">Alumnos</h1>
      <p className="text-dim text-[16px] mt-3 max-w-[62ch]">{enRiesgo ? `${enRiesgo} ${enRiesgo === 1 ? 'alumno lleva' : 'alumnos llevan'} dos días o más sin entregar. Arriba del todo, con lo que toca hacer.` : 'Todos al día.'}</p>
      <div className="flex flex-wrap items-center gap-3 mt-6 mb-4">
        <div className="relative max-w-[380px] flex-1"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dimmer" /><input className="input pl-9" placeholder="Buscar por nombre o correo" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <Btn size="sm" tone="outline" onClick={() => alert('En esta vista previa no se crean alumnos.')}><UserPlus size={14} /> Nuevo alumno</Btn>
      </div>
      {!filas.length ? <Empty title="Sin resultados" sub="Ningún alumno casa con esa búsqueda." /> : (
        <Card className="p-0 overflow-hidden">
          <table className="w-full text-[14px]">
            <thead><tr className="text-dimmer text-[12.5px] text-left"><th className="p-3 font-normal">Alumno</th><th className="p-3 font-normal">Rango</th><th className="p-3 font-normal hide-mobile">Bootcamp</th><th className="p-3 font-normal">Ritmo</th><th className="p-3 font-normal hide-mobile">Último acceso</th></tr></thead>
            <tbody>
              {filas.map((a) => { const r = rescate(a.sinEntregar); return (
                <tr key={a.id} className="border-t border-line-soft">
                  <td className="p-3"><div className="flex items-center gap-3"><Avatar name={a.nombre} size={30} /><div className="min-w-0"><div className="font-medium truncate">{a.nombre}</div><div className="text-dimmer text-xs truncate">{a.email}</div></div></div></td>
                  <td className="p-3"><Pulsera rango={a.rango} chica /></td>
                  <td className="p-3 hide-mobile">{a.rango > 0 ? <span className="text-dim">Completo</span> : <span>Día <b>{a.dia}</b> <span className="text-dimmer">de 30</span></span>}</td>
                  <td className="p-3"><div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full shrink-0" style={{ background: r.tono }} /><span>{r.txt}</span></div>{r.paso && <div className="text-dimmer text-xs mt-0.5 pl-4">{r.paso}</div>}</td>
                  <td className="p-3 hide-mobile text-dim">{hace(a.ultimoAcceso)}</td>
                </tr>) })}
            </tbody>
          </table>
        </Card>)}
    </div>
  )
}

/* LA COLA DE REVISIÓN: pruebas de hito (días 14, 20 y 30) y solicitudes de subida. Aprobar el día 30 o una subida
   sube el rango del alumno y lo publica en #ascensos. */
function Revision() {
  const { state, acciones } = useData()
  const cola = colaRevision(state)
  const [nota, setNota] = useState({})
  return (
    <div>
      <p className="text-dim text-[15px] mb-2">Dirección</p>
      <h1 className="text-[38px] md:text-[48px]">Revisión</h1>
      <p className="text-dim text-[16px] mt-3 max-w-[62ch]">Pruebas de hito y subidas de rango. El alumno espera: el objetivo es contestar en menos de 24 horas.</p>
      {!cola.length ? <div className="mt-8"><Empty title="Nada pendiente" sub="Cuando un alumno entregue un hito o pida subir, aparece aquí." /></div> : (
        <div className="flex flex-col gap-4 mt-8 max-w-[820px]">
          {cola.map((r) => (
            <Card key={r.id} className="p-5">
              <div className="flex flex-wrap items-start gap-4">
                <Avatar name={r.alumno} size={40} />
                <div className="flex-1 min-w-[240px]">
                  <div className="text-[16px]"><b>{r.alumno}</b> · {r.tipo === 'ascenso' ? <>pide subir: <span className="text-gold-2">{r.que}</span></> : <>día {r.dia}: <span className="text-gold-2">{r.que}</span></>}</div>
                  <div className="text-dimmer text-[13px] mt-0.5">Prueba que se pide: {r.pide.charAt(0).toLowerCase() + r.pide.slice(1)} · {hace(r.creado)}</div>
                  <div className="ph mt-3" style={{ height: 92 }}>{r.prueba?.archivo || 'captura.png'}{r.prueba?.texto ? ` · «${r.prueba.texto}»` : ''}</div>
                  <input className="input mt-3" placeholder="Comentario para el alumno (obligatorio si la devuelves)" value={nota[r.id] || ''} onChange={(e) => setNota({ ...nota, [r.id]: e.target.value })} />
                </div>
              </div>
              <div className="flex gap-2 justify-end mt-4">
                <Btn size="sm" tone="ghost" disabled={!nota[r.id]?.trim()} onClick={() => acciones.revisar(r.id, false, nota[r.id].trim())}>Devolver</Btn>
                <Btn size="sm" onClick={() => acciones.revisar(r.id, true, nota[r.id]?.trim() || '')}>{r.tipo === 'ascenso' ? 'Aprobar y subir de rango' : 'Aprobar prueba'}</Btn>
              </div>
            </Card>))}
        </div>)}
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
  return vista === 'equipo' ? <Equipo key="equipo" /> : vista === 'revision' ? <Revision key="revision" /> : <Alumnos key="alumnos" />
}
