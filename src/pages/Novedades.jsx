import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { PageHeader, Tag } from '../ui/index.jsx'
import { faseDe } from '../data/programa.js'
import { useData, fmtFecha } from '../data/store.jsx'

/* NOVEDADES · las actualizaciones del programa (la formación incluye 12 meses de acceso y sus actualizaciones). */
export default function Novedades() {
  const { state: s, acciones } = useData()
  const desde = s.novLeidas
  useEffect(() => { acciones.leerNovedades() }, [])
  const lista = [...(s.novedades || [])].sort((a, b) => (a.fecha < b.fecha ? 1 : -1))
  return (
    <div className="max-w-[860px]">
      <PageHeader kicker="Programa" title="Novedades" sub="Lo que se añade y se actualiza en el programa durante tus 12 meses." />
      <div className="flex flex-col gap-3">
        {lista.map((n) => { const f = faseDe(n.fase); const nueva = !desde || n.fecha > desde; return (
          <div key={n.id} className="card p-5 flex gap-4">
            <span className="avatar gold shrink-0" style={{ width: 40, height: 40 }}><Sparkles size={17} /></span>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-[12.5px] text-dimmer">{fmtFecha(n.fecha, { year: 'numeric' })}{f && <Link to={`/sistema/${f.id}`} className="tag">Fase {f.n} · {f.corto}</Link>}{nueva && <Tag tone="gold">Nuevo</Tag>}{n.ejemplo && <Tag tone="grey">Ejemplo</Tag>}</div>
              <b className="block text-[16.5px] mt-1.5">{n.titulo}</b>
              <p className="text-dim text-[14.5px] mt-1">{n.texto}</p>
            </div>
          </div>) })}
        {!lista.length && <p className="text-dim">Aún no hay novedades.</p>}
      </div>
    </div>
  )
}
