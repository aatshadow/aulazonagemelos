import { Link, useParams } from 'react-router-dom'
import { Video, CalendarPlus, Check, Radio, ChevronLeft, CheckCircle2 } from 'lucide-react'
import { PageHeader, Tag, Btn, Stat, Card, Banner } from '../ui/index.jsx'
import { useState } from 'react'
import { useData, fmtFecha, fmtHora } from '../data/store.jsx'
import { Banner as Aviso } from '../ui/index.jsx'

/* DIRECTOS · lo que viene (con confirmar asistencia y calendario) y las grabaciones. */
export default function Directos() {
  const { state, acciones, aula } = useData()
  const { directos, grabaciones } = state
  const [error, setError] = useState(null)
  const confirmar = (id) => acciones.confirmar(id).catch((e) => setError(e.message))
  const prox = directos.filter((d) => new Date(d.fecha) > Date.now()).sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
  const ics = (d) => {
    const f = (x) => new Date(x).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
    const fin = new Date(new Date(d.fecha).getTime() + 90 * 60000)
    const txt = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT', `DTSTART:${f(d.fecha)}`, `DTEND:${f(fin)}`, `SUMMARY:${aula.nombre} · ${d.titulo}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n')
    const a = document.createElement('a'); a.href = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(txt); a.download = 'directo.ics'; a.click()
  }
  return (
    <div>
      <PageHeader kicker="Comunidad" title="Directos" sub="Las sesiones en vivo. Se graban y quedan aquí abajo a la mañana siguiente." />
      {error && <Aviso tone="red">{error}</Aviso>}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-3 mb-6">
        <Stat label="Próximo directo" value={prox[0] ? fmtFecha(prox[0].fecha, { weekday: 'short' }) : '—'} sub={prox[0] ? `${fmtHora(prox[0].fecha)} · ${prox[0].tipo}` : ''} tone="gold" />
        <Stat label="Confirmados" value={state.confirmados.length} sub="asistencias confirmadas" />
        <Stat label="Grabaciones" value={grabaciones.length} sub="disponibles" />
      </div>
      <div className="kicker mb-2">Próximos</div>
      <div className="flex flex-col gap-3 mb-8">
        {prox.map((d) => { const ok = state.confirmados.includes(d.id); return (
          <Card key={d.id} className="flex flex-wrap items-center gap-4">
            <div className="w-[64px] text-center"><div className="num font-extrabold text-[28px] text-gold-2 leading-none">{new Date(d.fecha).getDate()}</div><div className="kicker dim mt-1" style={{ fontSize: 9 }}>{new Date(d.fecha).toLocaleDateString('es-ES', { month: 'short' })}</div></div>
            <div className="flex-1 min-w-[200px]"><Tag tone="red"><Radio size={11} /> {d.tipo}</Tag><b className="block mt-1.5 text-[16px]">{d.titulo}</b><div className="text-xs text-dim mt-0.5 mono">{fmtFecha(d.fecha, { weekday: 'long' })} · {fmtHora(d.fecha)}{d.enlace ? ' · ' : ''}{d.enlace && <a href={d.enlace} target="_blank" rel="noreferrer" className="text-gold-2">Enlace del directo</a>}</div>{d.nota && <div className="text-xs text-dimmer mt-1">{d.nota}</div>}</div>
            <div className="flex gap-2"><Btn tone="ghost" size="sm" onClick={() => ics(d)}><CalendarPlus size={14} /> Calendario</Btn><Btn tone={ok ? 'outline' : 'primary'} size="sm" onClick={() => confirmar(d.id)}>{ok ? <><Check size={14} /> Confirmado</> : 'Confirmo que voy'}</Btn></div>
          </Card>) })}
        {!prox.length && <p className="text-dim">No hay directos programados.</p>}
      </div>
      <div className="kicker mb-2">Grabaciones</div>
      <div className="flex flex-col gap-3">
        {!grabaciones.length && <p className="text-dim">Todavía no hay grabaciones.</p>}
        {grabaciones.map((g) => (
          <Card key={g.id} className="flex flex-wrap items-center gap-4 py-4">
            <Video size={18} className="text-gold-2" />
            <div className="flex-1 min-w-[200px]"><b className="text-[15px]">{g.titulo}</b><div className="text-xs text-dim mono">{[g.mes, g.dur].filter(Boolean).join(' · ')}</div></div>
            <Tag tone={state.grabVistas.includes(g.id) ? 'green' : 'grey'}>{state.grabVistas.includes(g.id) ? 'Vista' : 'Sin ver'}</Tag>
            <Link to={`/directos/${g.id}`} className="btn outline sm">Ver grabación</Link>
          </Card>))}
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
      <Link to="/directos" className="inline-flex items-center gap-1 text-sm text-dim mb-3"><ChevronLeft size={14} /> Directos</Link>
      <div className="card overflow-hidden max-w-[980px]">
        {g.video_url
          ? <div style={{ aspectRatio: '16 / 9', background: '#000' }}><iframe src={g.video_url} title={g.titulo} loading="lazy" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen style={{ width: '100%', height: '100%', border: 0, display: 'block' }} /></div>
          : <div className="ph" style={{ aspectRatio: '16 / 9', borderRadius: 0, border: 0 }}>Grabación pendiente · {g.titulo}{g.dur ? ` · ${g.dur}` : ''}</div>}
        <div className="p-5">
          <div className="kicker mb-2">Directo grabado · {g.mes}</div>
          <h1 className="text-[24px] md:text-[30px]">{g.titulo}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <Btn onClick={() => acciones.grabacionVista(g.id)} disabled={vista}>{vista ? 'Ya la has visto' : 'Marcar como vista'}</Btn>
            {vista && <Tag tone="green"><CheckCircle2 size={12} /> Vista</Tag>}
          </div>
        </div>
      </div>
    </div>
  )
}
