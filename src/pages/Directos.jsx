import { Link, useParams } from 'react-router-dom'
import { Video, CalendarPlus, Check, Radio, ChevronLeft, CheckCircle2, Search, ExternalLink } from 'lucide-react'
import { PageHeader, Tag, Btn, Card, Banner } from '../ui/index.jsx'
import { useEffect, useMemo, useState } from 'react'
import { cn } from '../utils/cn.js'
import { useData, fmtFecha, fmtHora, directosDe } from '../data/store.jsx'
import { FASES, NICHOS, DIRECTOS_CFG, faseDe, nichoDe } from '../data/programa.js'

/* DIRECTOS · 2 clases en directo cada semana (unas 100 al año). El próximo con cuenta atrás y «Entrar»; el calendario de
   las próximas semanas; las grabaciones archivadas, con buscador y filtros por fase y nicho.
   Días, hora y plataforma ⇢ pendientes (DIRECTOS_CFG en programa.js). */
const ics = (d, nombre) => {
  const f = (x) => new Date(x).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const fin = new Date(new Date(d.fecha).getTime() + DIRECTOS_CFG.duracionMin * 60000)
  const txt = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT', `DTSTART:${f(d.fecha)}`, `DTEND:${f(fin)}`, `SUMMARY:${nombre} · ${d.titulo}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n')
  const a = document.createElement('a'); a.href = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(txt); a.download = 'directo.ics'; a.click()
}

function CuentaAtras({ fecha }) {
  const [t, setT] = useState(Date.now())
  useEffect(() => { const i = setInterval(() => setT(Date.now()), 1000); return () => clearInterval(i) }, [])
  const s = Math.max(0, Math.floor((new Date(fecha) - t) / 1000))
  const v = [['días', Math.floor(s / 86400)], ['horas', Math.floor(s % 86400 / 3600)], ['min', Math.floor(s % 3600 / 60)], ['seg', s % 60]]
  return <div className="flex gap-2">{v.map(([k, n]) => <div key={k} className="rounded-[14px] bg-black/50 border border-line px-3 py-2 text-center min-w-[62px]"><div className="num font-extrabold text-[26px] leading-none">{String(n).padStart(2, '0')}</div><div className="text-dimmer text-[10.5px] mt-1">{k}</div></div>)}</div>
}

export default function Directos() {
  const { state, acciones, aula } = useData()
  const ahora = Date.now()
  const prox = directosDe(state).filter((d) => new Date(d.fecha).getTime() + DIRECTOS_CFG.duracionMin * 6e4 > ahora).sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
  const p = prox[0]
  const enVivo = p && new Date(p.fecha).getTime() <= ahora
  const [q, setQ] = useState(''); const [fase, setFase] = useState(''); const [nicho, setNicho] = useState(state.nicho || '')
  const grab = useMemo(() => state.grabaciones.filter((g) => (!fase || g.fase === fase) && (!nicho || !g.nicho || g.nicho === nicho) && (!q || g.titulo.toLowerCase().includes(q.toLowerCase()))).sort((a, b) => (a.fecha < b.fecha ? 1 : -1)), [state.grabaciones, q, fase, nicho])
  const semanas = []
  prox.forEach((d) => { const x = new Date(d.fecha); const lunes = new Date(x); lunes.setDate(x.getDate() - ((x.getDay() + 6) % 7)); const k = lunes.toDateString(); let w = semanas.find((s) => s.k === k); if (!w) semanas.push(w = { k, lunes, items: [] }); w.items.push(d) })
  const dias = DIRECTOS_CFG.dias.map((n) => ['domingos', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábados'][n]).join(' y ')
  return (
    <div>
      <PageHeader kicker="Programa" title="Clases en directo" sub={`Dos clases en directo cada semana, unas 100 al año: ${dias} a las ${String(DIRECTOS_CFG.hora).padStart(2, '0')}:00. Se graban y quedan aquí abajo.`} />
      {DIRECTOS_CFG.pendiente && <Banner>Días, hora y plataforma de los directos ⇢ pendientes de confirmar. Lo que ves es un ejemplo.</Banner>}

      {p && <div className="card gold overflow-hidden mb-8" style={{ background: 'radial-gradient(90% 140% at 0% 0%, rgba(199,179,141,.16), transparent 60%), linear-gradient(180deg, var(--color-sur-hi), var(--color-sur))' }}>
        <div className="p-6 md:p-8 flex flex-wrap items-center gap-6">
          <div className="flex-1 min-w-[260px]">
            {enVivo ? <Tag tone="red"><Radio size={11} /> En directo ahora</Tag> : <div className="kicker">Próxima clase · {fmtFecha(p.fecha, { weekday: 'long' })} · {fmtHora(p.fecha)}</div>}
            <h2 className="text-[26px] md:text-[32px] mt-2">{p.titulo}</h2>
            <div className="flex flex-wrap gap-2 mt-3">{p.fase && <Tag>Fase {faseDe(p.fase).n} · {faseDe(p.fase).corto}</Tag>}<Tag tone="grey">{p.tipo}</Tag>{p.ejemplo && <Tag tone="grey">Ejemplo</Tag>}</div>
          </div>
          <div className="flex flex-col gap-3 items-start">
            {!enVivo && <CuentaAtras fecha={p.fecha} />}
            <div className="flex flex-wrap gap-2">
              {p.enlace ? <a href={p.enlace} target="_blank" rel="noreferrer" className="btn primary"><ExternalLink size={15} /> Entrar al directo</a>
                : <span className="btn primary opacity-60 cursor-not-allowed" title="Plataforma pendiente">Entrar al directo · ⇢ plataforma pendiente</span>}
              <Btn tone="ghost" onClick={() => ics(p, aula.nombre)}><CalendarPlus size={15} /> Calendario</Btn>
            </div>
          </div>
        </div>
      </div>}

      <h2 className="text-[22px] mb-3">Calendario</h2>
      <div className="grid gap-3 md:grid-cols-2 mb-10">
        {semanas.slice(0, 4).map((w) => (
          <Card key={w.k}>
            <div className="kicker dim mb-3">Semana del {fmtFecha(w.lunes.toISOString())}</div>
            <div className="flex flex-col gap-2">{w.items.map((d) => { const ok = state.confirmados.includes(d.id); return (
              <div key={d.id} className="flex items-center gap-3">
                <div className="w-[52px] text-center shrink-0"><div className="num font-extrabold text-[22px] text-gold-2 leading-none">{new Date(d.fecha).getDate()}</div><div className="text-dimmer text-[10.5px] mt-0.5">{new Date(d.fecha).toLocaleDateString('es-ES', { weekday: 'short' })} · {fmtHora(d.fecha)}</div></div>
                <div className="flex-1 min-w-0"><div className="text-[14.5px] leading-snug">{d.titulo}</div><div className="text-dimmer text-[12px]">{d.tipo}{d.fase ? ` · fase ${faseDe(d.fase).n}` : ''}</div></div>
                <button onClick={() => acciones.confirmar(d.id)} className={cn('chip', ok && 'on')}>{ok ? <><Check size={12} /> Voy</> : 'Confirmo'}</button>
              </div>) })}</div>
          </Card>))}
      </div>

      <div className="flex flex-wrap items-end justify-between gap-3 mb-3">
        <h2 className="text-[22px]">Grabaciones · {grab.length}</h2>
        <div className="relative w-full sm:w-[320px]"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-dimmer" /><input className="input" style={{ paddingLeft: 36 }} placeholder="Buscar una clase…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
      </div>
      <div className="flex flex-wrap gap-2 mb-2"><button className={cn('chip', !fase && 'on')} onClick={() => setFase('')}>Todas las fases</button>{FASES.map((f) => <button key={f.id} className={cn('chip', fase === f.id && 'on')} onClick={() => setFase(f.id)}>{f.n} · {f.corto}</button>)}</div>
      <div className="flex flex-wrap gap-2 mb-4"><button className={cn('chip', !nicho && 'on')} onClick={() => setNicho('')}>Todos los nichos</button>{NICHOS.map((n) => <button key={n.id} className={cn('chip', nicho === n.id && 'on')} onClick={() => setNicho(n.id)}>{n.nombre}</button>)}</div>
      <div className="flex flex-col gap-2">
        {!grab.length && <p className="text-dim">No hay grabaciones con ese filtro.</p>}
        {grab.map((g) => { const vista = state.grabVistas.includes(g.id); return (
          <Link key={g.id} to={`/directos/${g.id}`} className="card hover flex flex-wrap items-center gap-4 px-5 py-4">
            <Video size={18} className="text-gold-2 shrink-0" />
            <div className="flex-1 min-w-[200px]"><b className="text-[15px]">{g.titulo}</b><div className="text-xs text-dim">{[fmtFecha(g.fecha, { year: 'numeric' }), g.dur, g.fase && `Fase ${faseDe(g.fase).n}`, g.nicho && nichoDe(g.nicho).nombre].filter(Boolean).join(' · ')}</div></div>
            {g.ejemplo && <Tag tone="grey">Ejemplo</Tag>}
            <Tag tone={vista ? 'green' : 'grey'}>{vista ? 'Vista' : 'Sin ver'}</Tag>
          </Link>) })}
      </div>
    </div>
  )
}

export function Grabacion() {
  const { id } = useParams()
  const { state, acciones } = useData()
  const g = state.grabaciones.find((x) => x.id === id)
  if (!g) return <Banner tone="red">Grabación no encontrada.</Banner>
  const vista = state.grabVistas.includes(g.id)
  return (
    <div>
      <Link to="/directos" className="inline-flex items-center gap-1 text-sm text-dim mb-3"><ChevronLeft size={14} /> Clases en directo</Link>
      <div className="card overflow-hidden max-w-[980px]">
        {g.video_url
          ? <div style={{ aspectRatio: '16 / 9', background: '#000' }}><iframe src={g.video_url} title={g.titulo} loading="lazy" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen style={{ width: '100%', height: '100%', border: 0, display: 'block' }} /></div>
          : <div className="ph" style={{ aspectRatio: '16 / 9', borderRadius: 0, border: 0 }}>Grabación pendiente · {g.titulo}{g.dur ? ` · ${g.dur}` : ''}</div>}
        <div className="p-5">
          <div className="flex flex-wrap gap-2"><span className="kicker">Clase grabada · {fmtFecha(g.fecha, { year: 'numeric' })}</span>{g.fase && <Tag>Fase {faseDe(g.fase).n} · {faseDe(g.fase).corto}</Tag>}{g.nicho && <Tag>{nichoDe(g.nicho).nombre}</Tag>}{g.ejemplo && <Tag tone="grey">Ejemplo</Tag>}</div>
          <h1 className="text-[24px] md:text-[30px] mt-2">{g.titulo}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <Btn onClick={() => acciones.grabacionVista(g.id)} disabled={vista}>{vista ? 'Ya la has visto' : 'Marcar como vista'}</Btn>
            {vista && <Tag tone="green"><CheckCircle2 size={12} /> Vista</Tag>}
          </div>
        </div>
      </div>
    </div>
  )
}
