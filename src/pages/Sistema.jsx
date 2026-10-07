import { Link, useParams } from 'react-router-dom'
import { Lock, Check, Play, ChevronLeft, CalendarDays, CheckCircle2 } from 'lucide-react'
import { PageHeader, Tag, Btn, Banner } from '../ui/index.jsx'
import { Acceso, Candado } from '../ui/acceso.jsx'
import { cn } from '../utils/cn.js'
import { FASES, NICHOS, PROMESA, QUE_APRENDEN, faseDe, leccionesDeFase, nichoDe } from '../data/programa.js'
import { DIAS } from '../data/bootcamp.js'
import { useData, abiertoDesde, reqFase, reqLeccion, textoReq, diaActual, entregado, estadoDia } from '../data/store.jsx'

/* EL SISTEMA · el programa de 12 meses. Cinco fases (elegir oferta → contenido sin cara con IA → tráfico → convertir →
   escalar) con ruta por nicho. El bootcamp es el arranque: cada día lleva su fase. Todo se abre a su debido tiempo. */
export function avanceFase(s, f) {
  const ls = leccionesDeFase(f, s.nicho)
  const dias = f.dias ? DIAS.filter((d) => d.n >= f.dias[0] && d.n <= f.dias[1]) : []
  const hechos = ls.filter((l) => s.vistas.includes(l.id)).length + dias.filter((d) => entregado(s, d.n)).length
  const total = ls.length + dias.length
  return { hechos, total, pct: total ? Math.round((hechos / total) * 100) : 0 }
}

export function ElegirNicho({ grande }) {
  const { state: s, acciones } = useData()
  return (
    <div className={cn('grid gap-3', grande ? 'md:grid-cols-3' : 'grid-cols-3')}>
      {NICHOS.map((n) => (
        <button key={n.id} onClick={() => acciones.elegirNicho(n.id)} className={cn('card hover text-left', grande ? 'p-5' : 'px-4 py-3', s.nicho === n.id && 'gold')} style={s.nicho === n.id ? { boxShadow: `inset 0 0 0 1px ${n.color}55` } : undefined}>
          <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ background: n.color }} /><b className={grande ? 'text-[18px]' : 'text-[14.5px]'}>{n.nombre}</b>{s.nicho === n.id && <Check size={15} className="text-gold ml-auto" />}</div>
          {grande && <p className="text-dim text-[13.5px] mt-1.5">{n.desc}</p>}
        </button>))}
    </div>
  )
}

export default function Sistema() {
  const { state: s } = useData()
  const hoy = Math.min(diaActual(s), DIAS.length)
  return (
    <div>
      <PageHeader kicker="Programa · 12 meses" title="El sistema" sub={PROMESA} />
      <Acceso />
      <section className="mt-8">
        <h2 className="text-[24px]">{s.nicho ? <>Tu nicho: <span className="text-gold-2">{nichoDe(s.nicho).nombre}</span></> : 'Elige tu nicho'}</h2>
        <p className="text-dim text-[14.5px] mt-1 mb-4 max-w-[70ch]">{QUE_APRENDEN} {s.nicho ? 'Puedes cambiarlo cuando quieras: cambian los ejemplos de cada fase.' : 'Elige uno para ver los ejemplos de tu ruta.'}</p>
        <ElegirNicho grande={!s.nicho} />
      </section>

      <section className="mt-10">
        <h2 className="text-[24px] mb-4">Las 5 fases</h2>
        <div className="grid gap-3 md:grid-cols-5">
          {FASES.map((f) => { const ok = abiertoDesde(s, reqFase(f)); const av = avanceFase(s, f); return (
            <Link key={f.id} to={`/sistema/${f.id}`} className={cn('card hover p-5 flex flex-col gap-2 relative', !ok && 'opacity-60')}>
              <div className="flex items-center justify-between"><span className="num font-extrabold text-[32px] leading-none text-gold-2">{f.n}</span>{ok ? (av.pct === 100 ? <Tag tone="green"><Check size={11} /> Hecha</Tag> : <span className="text-dimmer text-[12px]">{av.pct}%</span>) : <Lock size={15} className="text-dimmer" />}</div>
              <b className="text-[16px] leading-tight">{f.nombre}</b>
              <p className="text-dim text-[13px] leading-snug">{f.consigues}</p>
              <div className="mt-auto pt-2">{ok ? <div className="bar"><i style={{ width: av.pct + '%' }} /></div> : <div className="text-dimmer text-[12px]">{textoReq(reqFase(f))}</div>}</div>
            </Link>) })}
        </div>
      </section>

      <section className="mt-10 grid gap-3 md:grid-cols-2">
        <Link to="/bootcamp" className="card hover p-5 flex items-center gap-4">
          <span className="avatar gold" style={{ width: 46, height: 46 }}><CalendarDays size={20} /></span>
          <div className="flex-1"><div className="kicker">Mes 1 · el arranque</div><b className="text-[17px]">Bootcamp de 30 días</b><div className="text-dim text-[13.5px]">Recorre las fases en pequeño hasta tu primera conversión. Hoy: día {hoy}.</div></div>
        </Link>
        <Link to="/formacion" className="card hover p-5 flex items-center gap-4">
          <span className="avatar" style={{ width: 46, height: 46 }}><Play size={18} /></span>
          <div className="flex-1"><div className="kicker">Más a fondo</div><b className="text-[17px]">Módulos completos</b><div className="text-dim text-[13.5px]">Hazlo con el avatar, Hazlo tú, Testing y escala y verticales, por rango.</div></div>
        </Link>
      </section>
    </div>
  )
}

export function Fase() {
  const { fase } = useParams()
  const { state: s } = useData()
  const f = faseDe(fase)
  if (!f) return <Banner tone="red">Fase no encontrada.</Banner>
  const av = avanceFase(s, f)
  const dias = f.dias ? [...DIAS.filter((d) => d.n >= f.dias[0] && d.n <= f.dias[1]), ...(f.diasExtra ? DIAS.filter((d) => d.n >= f.diasExtra[0] && d.n <= f.diasExtra[1]) : [])] : []
  return (
    <div>
      <Link to="/sistema" className="inline-flex items-center gap-1 text-sm text-dim mb-3"><ChevronLeft size={14} /> El sistema</Link>
      <PageHeader kicker={`Fase ${f.n} de 5`} title={f.nombre} sub={f.consigues} right={abiertoDesde(s, reqFase(f)) && <span className="text-dim text-[14px]">{av.hechos} de {av.total} · {av.pct}%</span>} />
      <Candado req={reqFase(f)}>
        {!s.nicho && <Banner>Elige tu nicho en <Link to="/sistema" className="underline">El sistema</Link> para ver solo las lecciones de tu ruta.</Banner>}
        {dias.length > 0 && <section className="mb-8">
          <h2 className="text-[20px] mb-3">En el bootcamp</h2>
          <div className="flex flex-wrap gap-2">{dias.map((d) => { const hecho = entregado(s, d.n); const abierto = hecho || !['cerrado', 'manana', 'bienvenida'].includes(estadoDia(s, d.n)); return (
            abierto ? <Link key={d.n} to={`/bootcamp/${d.n}`} className={cn('chip', hecho && 'on')}>{hecho && <Check size={12} />} Día {d.n} · {d.titulo}</Link>
              : <span key={d.n} className="chip opacity-50"><Lock size={11} /> Día {d.n} · {d.titulo}</span>) })}</div>
        </section>}
        {f.modulos.map((m) => { const ls = m.lecciones.filter((l) => !l.nicho || !s.nicho || l.nicho === s.nicho); if (!ls.length) return null; return (
          <section key={m.id} className="mb-8">
            <h2 className="text-[20px] mb-3">{m.nombre}</h2>
            <div className="card divide-y divide-white/5">
              {ls.map((l) => { const vista = s.vistas.includes(l.id); const ok = abiertoDesde(s, reqLeccion(f, l)); return (
                <Link key={l.id} to={`/sistema/${f.id}/${l.id}`} className={cn('flex items-center gap-4 px-5 py-4 hover:bg-white/[.03]', !ok && 'opacity-55')}>
                  <span className={cn('avatar shrink-0', vista && 'gold')} style={{ width: 34, height: 34 }}>{!ok ? <Lock size={13} /> : vista ? <Check size={15} /> : <Play size={13} />}</span>
                  <div className="flex-1 min-w-0"><div className="text-[15px] leading-snug line-clamp-2">{l.titulo}</div><div className="text-dimmer text-[12.5px]">{ok ? l.dur : textoReq(reqLeccion(f, l))}{l.nicho && ` · ${nichoDe(l.nicho).nombre}`}</div></div>
                  {l.ejemplo && <Tag tone="grey">Ejemplo</Tag>}
                </Link>) })}
            </div>
          </section>) })}
      </Candado>
    </div>
  )
}

export function LeccionPrograma() {
  const { fase, lec } = useParams()
  const { state: s, acciones } = useData()
  const f = faseDe(fase); const l = f && f.modulos.flatMap((m) => m.lecciones).find((x) => x.id === lec)
  if (!l) return <Banner tone="red">Lección no encontrada.</Banner>
  const vista = s.vistas.includes(l.id)
  return (
    <div>
      <Link to={`/sistema/${f.id}`} className="inline-flex items-center gap-1 text-sm text-dim mb-3"><ChevronLeft size={14} /> Fase {f.n} · {f.nombre}</Link>
      <Candado req={reqLeccion(f, l)}>
        <div className="card overflow-hidden max-w-[980px]">
          <div className="ph" style={{ aspectRatio: '16 / 9', borderRadius: 0, border: 0 }}>Vídeo por grabar · {l.titulo} · {l.dur}</div>
          <div className="p-6">
            <div className="flex flex-wrap items-center gap-2"><span className="kicker">Fase {f.n} · {f.nombre}</span>{l.nicho && <Tag>{nichoDe(l.nicho).nombre}</Tag>}{l.ejemplo && <Tag tone="grey">Ejemplo · título provisional</Tag>}</div>
            <h1 className="text-[26px] md:text-[32px] mt-2">{l.titulo}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-5">
              <Btn onClick={() => acciones.marcarVista(l.id)} disabled={vista}>{vista ? 'Ya la has visto' : 'Marcar como vista'}</Btn>
              {vista && <Tag tone="green"><CheckCircle2 size={12} /> Vista</Tag>}
            </div>
          </div>
        </div>
      </Candado>
    </div>
  )
}
