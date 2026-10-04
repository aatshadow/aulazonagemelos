import { Link } from 'react-router-dom'
import { cn } from '../utils/cn.js'
import { DIAS, SEMANAS, RANGOS } from '../data/bootcamp.js'
import { useData, estadoDia, diaActual, diaReloj, retraso } from '../data/store.jsx'

/* La insignia de un rango (índice o clave): papel, tela, tejido, terciopelo, cuero, oro. `chica` para listas;
   `serie` añade el número (VIP y Palco son numeradas). */
export function Pulsera({ rango, chica, apagada, serie, className }) {
  const r = typeof rango === 'number' ? RANGOS[rango] : RANGOS.find((x) => x.k === rango)
  if (!r) return null
  return (
    <span className={cn('ins', r.k, chica && 'chica', apagada && 'apagada', className)} aria-label={`Rango ${r.nombre}`} title={r.objeto}>
      {r.k === 'palco' ? <span className="gema" /> : <span className="cierre" />}<b>{r.nombre}</b>
      {serie && (r.k === 'vip' || r.k === 'palco') && <span className="serie">Nº {String(serie).padStart(3, '0')}</span>}
    </span>
  )
}

/* Un agujero de la entrada. Los días de hito son rombos. */
export function Agujero({ n, s, enlazar = true }) {
  const d = DIAS[n - 1]
  const e = estadoDia(s, n)
  const hoy = n === diaActual(s)
  const tarde = !s.entregas[n] && n < Math.min(diaReloj(s), DIAS.length + 1) && n >= diaActual(s) && !hoy
  const cls = cn('agujero', d.hito && 'hito', (e === 'hecha' || e === 'aprobada') && 'hecho', e === 'revision' && 'revision', hoy && 'hoy', tarde && 'tarde')
  const titulo = `Día ${n} · ${d.titulo}${d.hito ? ` · hito: ${d.hito}` : ''}`
  return enlazar && !['cerrado', 'bienvenida'].includes(e) ? <Link to={`/bootcamp/${n}`} className={cls} title={titulo} aria-label={titulo} /> : <span className={cls} title={titulo} aria-label={titulo} />
}

/* LA ENTRADA: el bootcamp de 30 días como un ticket que se va picando. */
export function Entrada() {
  const { state: s } = useData()
  const n = Math.min(diaActual(s), DIAS.length)
  const d = DIAS[n - 1]
  const fin = diaActual(s) > DIAS.length
  const atraso = retraso(s)
  const quedan = DIAS.length - (diaActual(s) - 1)
  return (
    <div className="entrada">
      <div className="p-6 md:p-8 min-w-0">
        <div className="flex items-baseline gap-4 flex-wrap">
          <span className="display text-[64px] md:text-[88px] leading-[.85] text-gold-3">{fin ? '30' : n}</span>
          <div className="min-w-0 pb-1">
            <div className="text-dim text-[14px]">{fin ? 'Bootcamp completo' : `Día ${n} de ${DIAS.length}`}{d.hito && !fin ? ` · hoy toca un hito` : ''}</div>
            <div className="display text-[24px] md:text-[30px] leading-tight">{fin ? 'Tu entrada está picada entera' : d.titulo}</div>
          </div>
        </div>
        <div className="perfo mt-7">
          {SEMANAS.map((w) => (
            <div key={w.n}>
              <div className="sem">{DIAS.filter((x) => x.semana === w.n).map((x) => <Agujero key={x.n} n={x.n} s={s} />)}</div>
              <div className="text-dimmer text-[11.5px] mt-2">{w.titulo}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="talon">
        <div>
          <div className="text-dimmer text-[12px]">Meta del día 30</div>
          <div className="display text-[21px] leading-tight mt-1">Tu primera conversión</div>
        </div>
        <div className="mt-6">
          {atraso > 0
            ? <><div className="text-[13px]" style={{ color: '#E58A90' }}>Vas {atraso} {atraso === 1 ? 'día' : 'días'} por detrás</div><div className="text-dimmer text-[12px] mt-0.5">Entrega hoy y recuperas el ritmo.</div></>
            : <><div className="text-[13px] text-gold-2">{fin ? 'Pendiente de revisión' : `Quedan ${quedan} días`}</div><div className="text-dimmer text-[12px] mt-0.5">{fin ? 'El equipo mira tu prueba.' : 'Lanzas el día 20.'}</div></>}
        </div>
      </div>
    </div>
  )
}
