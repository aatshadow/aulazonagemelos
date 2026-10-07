import { Link } from 'react-router-dom'
import { CalendarClock, LifeBuoy, Lock } from 'lucide-react'
import { useData, accesoDe, abiertoDesde, textoReq } from '../data/store.jsx'
import { DESBLOQUEO } from '../data/programa.js'
import { cn } from '../utils/cn.js'

const fmt = (d) => d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })

/* El acceso de 12 meses: formación completa + soporte ilimitado durante todo ese tiempo. */
export function Acceso({ compacto, soporte }) {
  const { state: s } = useData()
  const a = accesoDe(s)
  if (compacto) return (
    <div className="flex items-center gap-2 text-[13px] text-dim"><CalendarClock size={14} className="text-gold" /> Mes {a.mes} de 12 · acceso hasta el {fmt(a.fin)}</div>
  )
  return (
    <div className="card gold p-5 flex flex-wrap items-center gap-x-6 gap-y-3">
      <div className="flex items-center gap-3 min-w-[220px] flex-1">
        <span className="avatar gold" style={{ width: 40, height: 40 }}>{soporte ? <LifeBuoy size={18} /> : <CalendarClock size={18} />}</span>
        <div>
          <div className="text-[15px] font-semibold">{soporte ? 'Soporte ilimitado durante los 12 meses' : `Mes ${a.mes} de 12 del programa`}</div>
          <div className="text-dim text-[13.5px]">Activo hasta el {fmt(a.fin)} · {a.meses > 1 ? `te quedan ${a.meses} meses` : `te quedan ${a.dias} días`}</div>
        </div>
      </div>
      <div className="w-full sm:w-[220px]"><div className="bar"><i style={{ width: a.pct + '%' }} /></div><div className="text-dimmer text-[12px] mt-1.5">{a.pct}% del año recorrido</div></div>
    </div>
  )
}

/* Candado «a su debido tiempo»: enseña qué viene y cuándo. */
export function Candado({ req, children, className }) {
  const { state: s } = useData()
  if (abiertoDesde(s, req)) return children
  return (
    <div className={cn('card p-8 text-center', className)}>
      <span className="avatar" style={{ width: 52, height: 52, margin: '0 auto' }}><Lock size={20} /></span>
      <h2 className="text-[24px] mt-4">{textoReq(req)}</h2>
      <p className="text-dim mt-2 max-w-[52ch] mx-auto">Todo llega a su debido tiempo{typeof req === 'string' && DESBLOQUEO[req]?.por ? `: ${DESBLOQUEO[req].por}` : ''}. Sigue el bootcamp: cuando toque, se abre aquí solo.</p>
      <Link to="/bootcamp" className="btn outline sm mt-5">Ir al bootcamp</Link>
    </div>
  )
}
