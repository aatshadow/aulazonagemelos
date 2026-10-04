import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Lock, Play, ChevronLeft, ChevronRight, Check, Clock, RotateCcw, Upload, Link2 } from 'lucide-react'
import { Banner } from '../ui/index.jsx'
import { Agujero } from '../ui/camino.jsx'
import { cn } from '../utils/cn.js'
import { DIAS, SEMANAS } from '../data/bootcamp.js'
import { useData, estadoDia, diaActual, fmtFecha } from '../data/store.jsx'

const ESTADO = {
  hecha: ['Entregada', 'text-gold-2'], aprobada: ['Aprobada', 'text-gold-2'], revision: ['En revisión', 'text-gold'],
  devuelta: ['Devuelta: repítela', 'text-[#E58A90]'], hoy: ['Hoy', 'text-white'], manana: ['Se abre a medianoche', 'text-dim'], bienvenida: ['Primero, la bienvenida', 'text-dim'], cerrado: ['', ''],
}

/* BOOTCAMP · los 30 días, por semanas. Lo cerrado se ve (el título), pero no se abre. */
export default function Bootcamp() {
  const { state: s } = useData()
  const actual = diaActual(s)
  return (
    <div>
      <p className="text-dim text-[15px] mb-2">Bootcamp · Fundamentos en 30 píldoras</p>
      <h1 className="text-[38px] md:text-[52px] max-w-[18ch]">Tu primera conversión en 30 días.</h1>
      <p className="text-dim text-[16px] mt-3 max-w-[60ch]">Una píldora de diez minutos como mucho, una tarea y una prueba cada día. El siguiente día se abre cuando entregas y pasa la medianoche.</p>
      <div className="flex flex-col gap-12 mt-10">
        {SEMANAS.map((w) => (
          <section key={w.n}>
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
              <h2 className="text-[26px]">Semana {w.n}: {w.titulo}</h2>
              <span className="text-dimmer text-[13.5px]">{w.meta}</span>
            </div>
            <ol className="regla">
              {DIAS.filter((d) => d.semana === w.n).map((d) => {
                const e = estadoDia(s, d.n); const cerrado = ['cerrado', 'manana', 'bienvenida'].includes(e)
                const fila = (
                  <div className={cn('flex items-center gap-4 py-3.5 px-2 border-b border-line-soft', cerrado ? 'opacity-50' : 'hover:bg-sur-hi', d.n === actual && !cerrado && 'bg-gold/5')}>
                    <span className="display text-[26px] w-10 text-right text-gold-3 shrink-0">{d.n}</span>
                    <Agujero n={d.n} s={s} enlazar={false} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[15.5px] truncate">{d.titulo}{d.hito && <span className="text-gold-2"> · {d.hito}</span>}</div>
                      <div className="text-dimmer text-[12.5px]">{d.dur} · {d.fuente}</div>
                    </div>
                    <span className={cn('text-[13px] shrink-0 hide-mobile', ESTADO[e][1])}>{ESTADO[e][0]}</span>
                    {cerrado && <Lock size={14} className="text-dimmer shrink-0" />}
                  </div>)
                return <li key={d.n}>{cerrado ? fila : <Link to={`/bootcamp/${d.n}`}>{fila}</Link>}</li>
              })}
            </ol>
          </section>
        ))}
      </div>
    </div>
  )
}

/* La prueba del día: escribir, pegar un enlace o subir una captura. */
function Prueba({ d, e }) {
  const { acciones } = useData()
  const [texto, setTexto] = useState('')
  const [enlace, setEnlace] = useState('')
  const [archivo, setArchivo] = useState(null)
  const listo = d.prueba.tipo === 'texto' ? texto.trim().length > 3 : d.prueba.tipo === 'enlace' ? /^https?:\/\/\S+\.\S+/.test(enlace.trim()) : !!archivo
  const entregar = () => acciones.entregar(d.n, { texto: texto.trim(), enlace: enlace.trim(), archivo: archivo?.name })
  const entregada = e && e.estado !== 'devuelta'
  return (
    <section className="card p-6 h-fit lg:sticky lg:top-2">
      <h2 className="text-[24px]">Tu prueba</h2>
      <p className="text-dim text-[14.5px] mt-1">{d.prueba.pide}.{d.prueba.revision && ' La revisa el equipo.'}</p>
      {e?.estado === 'devuelta' && <div className="mt-4"><Banner tone="red"><RotateCcw size={13} className="inline mr-1" /> El equipo te la ha devuelto{e.nota ? `: ${e.nota}` : '.'} Corrígela y vuelve a entregarla.</Banner></div>}
      {entregada ? (
        <div className="mt-5">
          <div className="flex items-center gap-2 text-[15px]">{e.estado === 'revision' ? <Clock size={16} className="text-gold" /> : <Check size={16} className="text-gold-2" />}{e.estado === 'revision' ? 'Entregada. En revisión por el equipo.' : e.estado === 'aprobada' ? 'Aprobada por el equipo.' : 'Entregada.'}</div>
          <div className="text-dimmer text-[13px] mt-1">{fmtFecha(e.en, { weekday: 'long', hour: '2-digit', minute: '2-digit' })}</div>
          {(e.texto || e.enlace || e.archivo) && <div className="mt-4 rounded-[12px] bg-ink border border-line-soft p-3 text-[14px] text-dim whitespace-pre-line">{e.texto || e.enlace || e.archivo}</div>}
        </div>
      ) : (
        <div className="mt-5">
          {d.prueba.tipo === 'texto' && <textarea className="input" style={{ minHeight: 140 }} placeholder="Escríbelo aquí. Va a tu cuaderno." value={texto} onChange={(ev) => setTexto(ev.target.value)} />}
          {d.prueba.tipo === 'enlace' && <div className="relative"><Link2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dimmer" /><input className="input pl-9" placeholder="https://…" value={enlace} onChange={(ev) => setEnlace(ev.target.value)} /></div>}
          {d.prueba.tipo === 'captura' && (
            <label className="flex flex-col items-center justify-center gap-2 rounded-[14px] border border-dashed border-line p-6 text-center cursor-pointer hover:bg-sur-hi">
              <Upload size={20} className="text-gold" />
              <span className="text-[14.5px]">{archivo ? archivo.name : 'Sube la captura'}</span>
              <span className="text-dimmer text-[12.5px]">PNG o JPG. Tapa los datos que no quieras enseñar.</span>
              <input type="file" accept="image/*" className="sr-only" onChange={(ev) => setArchivo(ev.target.files?.[0] || null)} />
            </label>)}
          <button className="btn primary w-full mt-4" disabled={!listo} onClick={entregar}>Entregar prueba</button>
          {d.prueba.tipo === 'captura' && <textarea className="input mt-3" style={{ minHeight: 64 }} placeholder="Una nota para el equipo (opcional)" value={texto} onChange={(ev) => setTexto(ev.target.value)} />}
        </div>
      )}
    </section>
  )
}

export function Dia() {
  const { n: nUrl } = useParams()
  const { state: s } = useData()
  const n = +nUrl
  const d = DIAS[n - 1]
  if (!d) return <Banner tone="red">Ese día no existe. El bootcamp va del 1 al 30.</Banner>
  const e = estadoDia(s, n)
  if (e === 'bienvenida') return (
    <div className="max-w-[560px]">
      <h1 className="text-[34px]">Antes del día 1, la bienvenida.</h1>
      <p className="text-dim mt-3 text-[15.5px]">Los gemelos te explican el método y la escalera en ocho minutos. Al terminar se abre el día 1.</p>
      <Link to="/bienvenida" className="btn primary mt-6">Ver la bienvenida</Link>
    </div>)
  if (e === 'cerrado' || e === 'manana') return (
    <div className="max-w-[560px]">
      <Link to="/bootcamp" className="inline-flex items-center gap-1 text-sm text-dim mb-4"><ChevronLeft size={14} /> Bootcamp</Link>
      <h1 className="text-[34px]">El día {n} aún no se ha abierto.</h1>
      <p className="text-dim mt-3 text-[15.5px]">{e === 'manana' ? 'Ya entregaste la prueba de ayer: se abre a medianoche.' : `Primero entrega la prueba del día ${diaActual(s)}.`}</p>
      <Link to={`/bootcamp/${Math.min(diaActual(s), DIAS.length)}`} className="btn primary mt-6">Ir al día {Math.min(diaActual(s), DIAS.length)}</Link>
    </div>)
  const ant = DIAS[n - 2]; const sig = DIAS[n]
  const sigAbierto = sig && !['cerrado', 'manana', 'bienvenida'].includes(estadoDia(s, sig.n))
  return (
    <div>
      <Link to="/bootcamp" className="inline-flex items-center gap-1 text-sm text-dim mb-4"><ChevronLeft size={14} /> Bootcamp · semana {d.semana}</Link>
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0">
          <div className="card overflow-hidden">
            <div className="grid place-items-center" style={{ aspectRatio: '16 / 9', background: 'radial-gradient(80% 120% at 30% 20%, #1d1a20, #060507)' }}>
              <div className="text-center"><span className="avatar gold" style={{ width: 68, height: 68 }}><Play size={26} fill="currentColor" /></span><div className="text-dim text-[13px] mt-3">Píldora pendiente de grabar · {d.dur}</div></div>
            </div>
          </div>
          <div className="mt-6 flex items-baseline gap-4">
            <span className="display text-[60px] leading-[.8] text-gold-3">{n}</span>
            <div><div className="text-dim text-[14px]">Día {n} de 30{d.hito && <span className="text-gold-2"> · hito: {d.hito}</span>}</div><h1 className="text-[32px] md:text-[40px]">{d.titulo}</h1></div>
          </div>
          <p className="text-[16.5px] leading-relaxed mt-5 max-w-[64ch]">{d.aprende}</p>
          <p className="cita mt-6 max-w-[40ch]">«{d.mentalidad}»</p>
          <div className="regla mt-8 pt-6 max-w-[64ch]">
            <h2 className="text-[24px]">Tu tarea</h2>
            <p className="text-[16px] mt-2">{d.tarea}</p>
            <p className="text-dimmer text-[13px] mt-2">Sale de la clase {d.fuente} de Juane. Te lleva entre 30 y 90 minutos.</p>
            {/[AT]0\d/.test(d.fuente) && n >= 15 && (
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="text-dim text-[14px]">¿Quieres el detalle? La clase completa:</span>
                {/A0\d/.test(d.fuente) && <Link to="/formacion/avatar" className="btn ghost sm">Hazlo con el avatar</Link>}
                {/T0\d/.test(d.fuente) && <Link to="/formacion/tu" className="btn ghost sm">Hazlo tú</Link>}
              </div>)}
          </div>
          <div className="flex gap-3 mt-10">
            {ant && <Link to={`/bootcamp/${ant.n}`} className="btn ghost sm"><ChevronLeft size={14} /> Día {ant.n}</Link>}
            {sig && (sigAbierto ? <Link to={`/bootcamp/${sig.n}`} className="btn ghost sm">Día {sig.n} <ChevronRight size={14} /></Link> : <span className="btn ghost sm opacity-50"><Lock size={13} /> Día {sig.n}</span>)}
          </div>
        </div>
        <Prueba d={d} e={s.entregas[n]} />
      </div>
    </div>
  )
}
