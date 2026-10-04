import { Link, useNavigate } from 'react-router-dom'
import { Play } from 'lucide-react'
import { Pulsera } from '../ui/camino.jsx'
import { RANGOS } from '../data/bootcamp.js'
import { useData, diaActual } from '../data/store.jsx'

/* BIENVENIDA · lo primero que se abre. Los gemelos explican el método y la escalera; al terminar, se abre el día 1. */
const PASOS = [
  ['Una píldora al día', 'Un vídeo de diez minutos como mucho. Nunca más.'],
  ['Una tarea', 'Lo que tienes que hacer hoy con lo que acabas de ver. Entre 30 y 90 minutos.'],
  ['Una prueba', 'Lo subes al aula. Cuando entregas y pasa la medianoche, se abre el día siguiente.'],
]
const SIEMPRE = [
  ['Q&A cada semana', 'En directo, con tus números delante.'],
  ['Un invitado al mes', 'Gente que hace esto a lo grande, contándolo sin filtro.'],
  ['La comunidad', 'Comparte tus victorias en #wins y mira cómo suben los demás.'],
  ['Soporte directo', 'Si algo no te funciona, te contesta el equipo.'],
]

export default function Bienvenida() {
  const { state: s, acciones } = useData()
  const nav = useNavigate()
  const empezar = () => { acciones.verBienvenida(); nav('/bootcamp/1') }
  return (
    <div className="max-w-[920px]">
      <p className="text-dim text-[15px] mb-2">Bienvenida</p>
      <h1 className="text-[40px] md:text-[60px] max-w-[16ch]">Esto no es un curso. Es una escalera.</h1>
      <div className="card overflow-hidden mt-8">
        <div className="grid place-items-center" style={{ aspectRatio: '16 / 9', background: 'radial-gradient(80% 120% at 30% 20%, #1d1a20, #060507)' }}>
          <div className="text-center"><span className="avatar gold" style={{ width: 76, height: 76 }}><Play size={28} fill="currentColor" /></span><div className="text-dim text-[14px] mt-3">Los gemelos te explican el método · vídeo pendiente de grabar · 8 min</div></div>
        </div>
      </div>

      <section className="mt-14">
        <h2 className="text-[30px]">Cómo funciona</h2>
        <p className="text-dim text-[16px] mt-2 max-w-[60ch]">Treinta días. Cada día, tres cosas y en este orden. La meta del día 30 es tu primera conversión aprobada: solo depende de que hagas cada día lo que toca.</p>
        <ol className="grid gap-6 md:grid-cols-3 mt-7">
          {PASOS.map(([t, d], i) => (
            <li key={t} className="regla pt-4"><span className="display text-[44px] leading-none text-gold-3">{i + 1}</span><div className="text-[17px] mt-2">{t}</div><p className="text-dim text-[14.5px] mt-1">{d}</p></li>))}
        </ol>
      </section>

      <section className="mt-14">
        <h2 className="text-[30px]">La escalera</h2>
        <p className="text-dim text-[16px] mt-2 max-w-[60ch]">Empiezas con una entrada de papel. Con tu primera conversión la cambias por la pulsera de Pista, y desde ahí cada rango se gana con un hito y una prueba. Cada uno es más difícil de tener que el anterior.</p>
        <ol className="mt-7 flex flex-col">
          {RANGOS.map((r, i) => (
            <li key={r.k} className="flex flex-wrap items-center gap-4 py-3.5 border-b border-line-soft">
              <span className="w-[176px] shrink-0"><Pulsera rango={i} serie={i >= 4 ? 1 : undefined} /></span>
              <span className="flex-1 min-w-[200px] text-[15px]">{r.desbloquea}</span>
              <span className="text-dimmer text-[13px] w-[130px] text-right">{r.miembros === 1 ? 'Una sola persona' : `${r.miembros} personas`}</span>
            </li>))}
        </ol>
      </section>

      <section className="mt-14">
        <h2 className="text-[30px]">Lo que tienes siempre</h2>
        <div className="grid gap-6 md:grid-cols-2 mt-6">
          {SIEMPRE.map(([t, d]) => <div key={t} className="regla pt-4"><div className="text-[17px]">{t}</div><p className="text-dim text-[14.5px] mt-1">{d}</p></div>)}
        </div>
      </section>

      <div className="mt-14 mb-6 flex flex-wrap items-center gap-4">
        {s.bienvenida
          ? <Link to={`/bootcamp/${Math.min(diaActual(s), 30)}`} className="btn primary">Ir a tu día {Math.min(diaActual(s), 30)}</Link>
          : <><button className="btn primary" onClick={empezar}>He visto la bienvenida: empezar el día 1</button><span className="text-dimmer text-[13.5px]">El día 1 se abre al pulsar.</span></>}
      </div>
    </div>
  )
}
