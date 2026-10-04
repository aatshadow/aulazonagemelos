import { Link } from 'react-router-dom'
import { Play, Radio, Trophy, Lock, Check } from 'lucide-react'
import { Entrada, Pulsera } from '../ui/camino.jsx'
import { DIAS, RANGOS } from '../data/bootcamp.js'
import { useData, diaActual, estadoDia, rangoDe, ascensoPendiente, fmtFecha, fmtHora, hace, seccionAbierta } from '../data/store.jsx'

/* MI CAMINO · la pantalla de inicio. No pregunta «qué quieres ver»: dice qué te toca hoy.
   En el bootcamp manda la ENTRADA; a partir de Pista, la PULSERA y el siguiente hito. */
function Hoy() {
  const { state: s } = useData()
  const n = diaActual(s)
  if (n > DIAS.length) return null
  const d = DIAS[n - 1]
  const e = estadoDia(s, n)
  const ayer = DIAS[n - 2]
  return (
    <section>
      <h2 className="text-[26px] mb-4">{e === 'manana' ? 'Hoy ya has cumplido' : 'Lo de hoy'}</h2>
      {e === 'manana' ? (
        <div className="card p-6">
          <div className="flex items-center gap-3"><span className="avatar gold" style={{ width: 38, height: 38 }}><Check size={18} /></span><div><div className="text-[16px]">Prueba del día {n - 1} entregada: {ayer?.titulo}.</div><div className="text-dim text-[14px] mt-0.5">El día {n}, «{d.titulo}», se abre a medianoche.</div></div></div>
        </div>
      ) : (
        <Link to={`/bootcamp/${n}`} className="block card overflow-hidden group">
          <div className="relative grid place-items-center" style={{ aspectRatio: '16 / 7', background: 'radial-gradient(80% 120% at 30% 20%, #1d1a20, #060507)' }}>
            <span className="avatar gold transition-transform group-hover:scale-105" style={{ width: 64, height: 64 }}><Play size={24} fill="currentColor" /></span>
            <span className="absolute left-5 bottom-4 text-[13px] text-dim">Píldora del día {n} · {d.dur}</span>
          </div>
          <div className="p-6">
            <div className="display text-[26px] leading-tight">{d.titulo}</div>
            <p className="text-dim text-[15px] mt-2 max-w-[62ch]">{d.aprende}</p>
            <p className="cita mt-5">«{d.mentalidad}»</p>
            <div className="regla mt-5 pt-5 flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[240px]"><div className="text-dimmer text-[12.5px]">Tu tarea de hoy</div><div className="text-[15.5px] mt-1">{d.tarea}</div></div>
              <span className="btn primary">Ver la píldora y entregar</span>
            </div>
          </div>
        </Link>
      )}
    </section>
  )
}

function Lateral() {
  const { state: s } = useData()
  const r = rangoDe(s)
  const sig = RANGOS[s.rango + 1]
  const pend = ascensoPendiente(s)
  const prox = s.directos.filter((d) => new Date(d.fecha) > Date.now()).sort((a, b) => new Date(a.fecha) - new Date(b.fecha))[0]
  const win = s.posts.find((p) => p.canal === 'wins')
  return (
    <aside className="flex flex-col gap-8">
      <section>
        <h2 className="text-[22px] mb-3">Tu rango</h2>
        <Pulsera rango={s.rango} />
        {sig && <p className="text-dim text-[14.5px] mt-3">{pend ? <>Tu subida a <b className="text-white">{RANGOS[pend.a].nombre}</b> está en revisión.</> : <>Para pasar a <b className="text-white">{sig.nombre}</b>: {r.hito.charAt(0).toLowerCase() + r.hito.slice(1)}.</>}</p>}
        <Link to="/perfil" className="text-gold-2 text-[14px] mt-2 inline-block">Ver la escalera</Link>
      </section>
      {prox && <section className="regla pt-6">
        <h2 className="text-[22px] mb-2">Próximo directo</h2>
        <div className="flex items-center gap-2 text-[13px] text-dim"><Radio size={14} className="text-gold" /> {prox.tipo} · {fmtFecha(prox.fecha, { weekday: 'long' })}, {fmtHora(prox.fecha)}</div>
        <div className="text-[15px] mt-1.5">{prox.titulo}</div>
        <Link to="/directos" className="text-gold-2 text-[14px] mt-2 inline-block">Ver directos</Link>
      </section>}
      {win && <section className="regla pt-6">
        <h2 className="text-[22px] mb-2">En #wins</h2>
        <p className="text-[15px] leading-relaxed">«{win.texto}»</p>
        <div className="text-dimmer text-[12.5px] mt-1.5">{win.autor}, {hace(win.creado)}</div>
        <Link to="/comunidad/wins" className="text-gold-2 text-[14px] mt-2 inline-block">Comparte el tuyo</Link>
      </section>}
    </aside>
  )
}

/* A partir de Pista: la pulsera grande, el siguiente hito y lo que se ha abierto. */
function DespuesDelBootcamp() {
  const { state: s } = useData()
  const r = rangoDe(s); const sig = RANGOS[s.rango + 1]
  const abiertas = s.secciones.filter((x) => seccionAbierta(s, x))
  const proximas = s.secciones.filter((x) => !seccionAbierta(s, x) && !x.pronto)
  return (
    <section>
      <div className="entrada" style={{ gridTemplateColumns: '1fr', WebkitMask: 'none', mask: 'none' }}>
        <div className="p-6 md:p-8">
          <Pulsera rango={s.rango} />
          <h1 className="text-[38px] md:text-[52px] mt-5">Estás en {r.nombre}.</h1>
          {sig && <p className="text-dim text-[16px] mt-3 max-w-[60ch]">Siguiente: <b className="text-white">{sig.nombre}</b>. El hito es {r.hito.charAt(0).toLowerCase() + r.hito.slice(1)}; la prueba, {r.prueba.charAt(0).toLowerCase() + r.prueba.slice(1)}.</p>}
          <div className="flex flex-wrap gap-3 mt-6"><Link to="/perfil" className="btn primary">Solicitar subida a {sig?.nombre}</Link><Link to="/top" className="btn ghost"><Trophy size={15} /> Top 10 del mes</Link></div>
        </div>
      </div>
      <h2 className="text-[26px] mt-10 mb-4">Lo que tienes abierto</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {abiertas.map((x) => <Link key={x.id} to={`/formacion/${x.id}`} className="card hover p-5"><div className="display text-[22px]">{x.nombre}</div><p className="text-dim text-[14px] mt-1">{x.desc}</p></Link>)}
        {proximas.slice(0, 2).map((x) => <div key={x.id} className="card p-5 opacity-60"><div className="flex items-center gap-2"><Lock size={14} className="text-dimmer" /><span className="text-dimmer text-[12.5px]">Se abre en {RANGOS[x.rango].nombre}</span></div><div className="display text-[22px] mt-1">{x.nombre}</div></div>)}
      </div>
    </section>
  )
}

export default function Camino() {
  const { state: s } = useData()
  const nombre = (s.perfil?.nombre || s.alumno.nombre).split(' ')[0]
  const enBootcamp = s.rango === 0
  return (
    <div>
      <p className="text-dim text-[15px] mb-4">Buenas, {nombre}.</p>
      {enBootcamp && !s.bienvenida ? (
        <>
          <Entrada />
          <div className="grid gap-10 lg:grid-cols-[1.55fr_1fr] mt-10">
            <section>
              <h2 className="text-[26px] mb-4">Empieza por aquí</h2>
              <Link to="/bienvenida" className="block card overflow-hidden group">
                <div className="grid place-items-center" style={{ aspectRatio: '16 / 7', background: 'radial-gradient(80% 120% at 30% 20%, #1d1a20, #060507)' }}><span className="avatar gold transition-transform group-hover:scale-105" style={{ width: 64, height: 64 }}><Play size={24} fill="currentColor" /></span></div>
                <div className="p-6"><div className="display text-[26px] leading-tight">Los gemelos te explican el método</div><p className="text-dim text-[15px] mt-2">Cómo funcionan los 30 días, la escalera de rangos y lo que tienes cada semana. Ocho minutos. Al terminar, se abre el día 1.</p><span className="btn primary mt-5">Ver la bienvenida</span></div>
              </Link>
            </section>
            <Lateral />
          </div>
        </>
      ) : enBootcamp ? (
        <>
          <Entrada />
          <div className="grid gap-10 lg:grid-cols-[1.55fr_1fr] mt-10"><Hoy />{diaActual(s) > DIAS.length && <BootcampEnRevision />}<Lateral /></div>
        </>
      ) : (
        <div className="grid gap-10 lg:grid-cols-[1.55fr_1fr]"><DespuesDelBootcamp /><Lateral /></div>
      )}
    </div>
  )
}

function BootcampEnRevision() {
  const { state: s } = useData()
  const e = s.entregas[DIAS.length]
  return (
    <section>
      <h2 className="text-[26px] mb-4">Tu conversión, en revisión</h2>
      <div className="card p-6"><p className="text-[15.5px]">Has entregado las 30 pruebas{e?.estado === 'revision' ? ' y el equipo está revisando tu primera conversión' : ''}. Cuando la apruebe, cambias la entrada por la pulsera de Pista.</p><Link to="/perfil" className="btn outline sm mt-4">Ver la escalera</Link></div>
    </section>
  )
}
