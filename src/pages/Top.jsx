import { Link } from 'react-router-dom'
import { Pulsera } from '../ui/camino.jsx'
import { cn } from '../utils/cn.js'
import { RANGOS } from '../data/bootcamp.js'
import { top10 } from '../data/mock.js'
import { useData } from '../data/store.jsx'

/* TOP 10 DEL MES · solo los diez primeros, desde Barra, por conversiones aprobadas con prueba. Se reinicia cada día 1.
   Nadie ve su puesto si no está dentro: el Top 10 empuja, no humilla. */
const PREMIOS = ['Premio del mes · por decidir', 'Segundo premio · por decidir', 'Tercer premio · por decidir']
export default function Top() {
  const { state: s } = useData()
  const mes = new Date().toLocaleDateString('es-ES', { month: 'long' })
  const desde = RANGOS.findIndex((r) => r.k === 'barra')
  return (
    <div>
      <p className="text-dim text-[15px] mb-2">Comunidad</p>
      <h1 className="text-[38px] md:text-[52px]">Top 10 de {mes}.</h1>
      <p className="text-dim text-[16px] mt-3 max-w-[60ch]">Conversiones aprobadas este mes, con captura de la red. Solo salen los diez primeros. Se compite desde {RANGOS[desde].nombre} y el marcador vuelve a cero el día 1.</p>
      {s.rango < desde && <p className="mt-5 text-[15px]">Tú entras cuando subas a <b>{RANGOS[desde].nombre}</b>. <Link to="/perfil" className="text-gold-2">Ver cómo</Link></p>}
      <ol className="mt-10 max-w-[760px]">
        {top10.map((t) => (
          <li key={t.puesto} className={cn('flex items-center gap-5 py-4 border-b border-line-soft', t.puesto <= 3 && 'py-5')}>
            <span className={cn('display w-12 text-right shrink-0 leading-none', t.puesto <= 3 ? 'text-[46px] text-gold-3' : 'text-[30px] text-dim')}>{t.puesto}</span>
            <div className="flex-1 min-w-0">
              <div className={cn('truncate', t.puesto <= 3 ? 'text-[18px]' : 'text-[15.5px]')}>{t.nombre}</div>
              {t.puesto <= 3 && <div className="text-dimmer text-[12.5px] mt-0.5">{PREMIOS[t.puesto - 1]}</div>}
            </div>
            <Pulsera rango={t.rango} chica />
            <span className="num text-[15px] w-[110px] text-right shrink-0"><b className="text-white">{t.conv}</b> <span className="text-dimmer text-[12.5px]">conversiones</span></span>
          </li>))}
      </ol>
    </div>
  )
}
