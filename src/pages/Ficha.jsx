import { Link } from 'react-router-dom'
import { PageHeader, Card, Anillo, Bar, Tag } from '../ui/index.jsx'
import { useData, avanceTotal, avanceSeccion, fmtFecha } from '../data/store.jsx'

/* MI FICHA · el «módulo personal» del plan: quién soy, desde cuándo, a qué tengo acceso y el
   avance por sección. Todo calculado con lo que hay; nada se guarda aparte. */
export default function Ficha() {
  const { state, aula } = useData()
  const total = avanceTotal(state)
  const a = state.alumno
  const nombre = state.perfil?.nombre || a.nombre
  return (
    <div>
      <PageHeader kicker="Cuenta" title="Mi ficha" sub="Tu progreso y a qué tienes acceso." />
      <div className="grid gap-5 md:grid-cols-[1fr_1.4fr]">
        <div className="flex flex-col gap-5">
          <Card className="flex items-center gap-4">
            <span className="avatar gold" style={{ width: 64, height: 64, fontSize: 22 }}>{nombre.split(' ').map((w) => w[0]).join('').slice(0, 2)}</span>
            <div><div className="text-[20px] font-extrabold tracking-[-0.02em]">{nombre}</div><div className="text-dim text-[13px] mono">{a.email}</div>{a.alta && <div className="text-dim text-[13px] mt-1">Alumno desde el <span className="num">{fmtFecha(a.alta, { year: 'numeric' })}</span></div>}</div>
          </Card>
          <Card className="flex items-center gap-5"><Anillo pct={total.pct} size={120} /><div><div className="kicker mb-1">Tu avance</div><div className="text-[15px]">{total.vistas} de {total.total} lecciones.</div><div className="text-dim text-[13px] mt-1">Se calcula con lo que has visto; si se añaden lecciones, baja solo.</div></div></Card>
          <Card>
            <div className="kicker mb-3">Tu acceso</div>
            {(state.accesos || []).map((f) => <div key={f.id || f.nombre} className="flex items-center justify-between gap-3 py-2 border-t border-line-soft first:border-0 first:pt-0"><b className="text-[15px]">{f.nombre}</b><Tag tone="green">Acceso</Tag></div>)}
            {(state.formaciones || []).filter((f) => !f.acceso).map((f) => <div key={f.id} className="flex items-center justify-between gap-3 py-2 border-t border-line-soft"><span className="text-dim text-[15px]">{f.nombre}</span><Tag tone="grey">Sin acceso</Tag></div>)}
            <div className="text-dim text-[13px] mt-2">Para ampliar tu acceso, escribe a {aula.textos?.soporte || 'soporte'}.</div>
          </Card>
        </div>
        <Card>
          <div className="kicker mb-4">Avance por sección</div>
          {state.secciones.filter((s) => s.comprado).map((s) => { const av = avanceSeccion(state, s); return (
            <div key={s.id} className="py-3 border-t border-line-soft first:border-0 first:pt-0">
              <div className="flex items-center justify-between gap-3"><Link to={`/formacion/${s.id}`} className="font-semibold text-[15px]">{s.nombre}</Link><Tag tone={av.pct === 100 ? 'green' : av.pct ? undefined : 'grey'}>{av.pct}%</Tag></div>
              <Bar pct={av.pct} className="mt-2" />
              <div className="text-xs text-dimmer mt-1 mono">{av.vistas} de {av.total} lecciones</div>
              <div className="mt-2 flex flex-wrap gap-1.5">{s.modulos.map((m) => { const v = m.lecciones.filter((l) => state.vistas.includes(l.id)).length; const done = m.lecciones.length && v === m.lecciones.length; return <span key={m.id} className={done ? 'tag green' : v ? 'tag' : 'tag grey'} style={{ fontSize: 9 }}>{m.nombre}</span> })}</div>
            </div>) })}
        </Card>
      </div>
    </div>
  )
}
