import { Link, useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { PlayCircle, CheckCircle2, ChevronLeft, ChevronRight, FileText, Lock } from 'lucide-react'
import { PageHeader, Tag, Btn, Bar, Card, Banner } from '../ui/index.jsx'
import { useData, avanceSeccion, leccionesDe } from '../data/store.jsx'
import { cn } from '../utils/cn.js'

/* FORMACIÓN · sección → módulo → lección → entregables. La jerarquía del plan §4, sin renombrar
   nada. El avance se calcula (vistas / lecciones), no se guarda. */
/* Tres pisos (orden de Alex, 18-09): Fundamentos en grande · los dos caminos (avatar / tú) · las
   cuatro verticales debajo. */
const GRUPOS = [
  { k: 'base', kicker: 'Empieza aquí', titulo: 'Fundamentos', grid: 'grid-cols-1' },
  { k: 'camino', kicker: 'Elige cómo hacerlo', titulo: 'Los dos caminos', grid: 'md:grid-cols-2' },
  { k: 'vertical', kicker: 'Y en qué', titulo: 'Las verticales', grid: 'grid-cols-2 xl:grid-cols-4' },
]
function TarjetaSeccion({ s, a, grande }) {
  const estado = a.pct === 100 ? ['Completada', 'green'] : a.pct > 0 ? ['En curso', undefined] : ['Sin empezar', 'grey']
  return (
    <div className={cn('card hover h-full flex flex-col', grande ? 'gold p-6 md:p-8 md:flex-row md:items-center md:gap-10' : 'p-5', !s.comprado && 'opacity-60')}>
      <div className={cn('flex-1 flex flex-col', grande && 'md:flex-none md:w-[46%]')}>
        <div className="flex items-center justify-between"><Tag tone={estado[1]}>{estado[0]}</Tag>{!s.comprado && <Lock size={15} className="text-dimmer" />}</div>
        <b className={cn('block mt-3 tracking-[-0.02em]', grande ? 'text-[28px] md:text-[34px] leading-none' : 'text-[19px]')}>{s.nombre}</b>
        <p className={cn('text-dim mt-2 flex-1', grande ? 'text-[15px]' : 'text-[13.5px]')}>{s.desc}</p>
        <Bar pct={a.pct} className="mt-4" />
        <div className="text-xs text-dim mt-1.5 mono">{s.modulos.length} módulos · {a.vistas}/{a.total} lecciones · {a.pct} %</div>
      </div>
      {grande && (
        <div className="mt-6 md:mt-0 flex-1 grid gap-2">
          {s.modulos.map((m, i) => <div key={m.id} className="flex items-center gap-3 rounded-[14px] px-4 py-3 bg-ink/60 border border-line-soft"><span className="num text-gold-2 font-extrabold">{String(i + 1).padStart(2, '0')}</span><span className="flex-1 text-[14.5px]">{m.nombre}</span><span className="num text-xs text-dimmer">{m.lecciones.length} lecciones</span></div>)}
        </div>
      )}
    </div>
  )
}
export default function Formacion() {
  const { state } = useData()
  const { secciones } = state
  const grupos = new Set(secciones.map((s) => s.grupo))
  const sub = grupos.size > 1 ? 'Primero la base. Después eliges cómo hacerlo —con el avatar o dando la cara— y en qué vertical.' : (state.formaciones?.[0]?.descripcion || 'Sección a sección, en orden.')
  return (
    <div>
      <PageHeader kicker="Formación" title="Tus secciones" sub={sub} />
      <div className="flex flex-col gap-10">
        {GRUPOS.map((g) => { const lista = secciones.filter((s) => s.grupo === g.k); if (!lista.length) return null; return (
          <section key={g.k}>
            <div className="flex items-baseline gap-3 mb-3"><span className="kicker">{g.kicker}</span><span className="text-dimmer text-[13px]">{g.titulo}</span></div>
            <div className={cn('grid gap-4', g.grid)}>
              {lista.map((s) => { const a = avanceSeccion(state, s); const t = <TarjetaSeccion s={s} a={a} grande={g.k === 'base' && grupos.size > 1 || lista.length === 1} />
                return s.comprado ? <Link key={s.id} to={`/formacion/${s.id}`}>{t}</Link> : <div key={s.id}>{t}</div> })}
            </div>
          </section>) })}
      </div>
    </div>
  )
}

export function Seccion() {
  const { sec } = useParams()
  const { state } = useData()
  const s = state.secciones.find((x) => x.id === sec)
  if (!s) return <Banner tone="red">Sección no encontrada.</Banner>
  if (!s.comprado) return <Banner tone="grey"><Lock size={14} className="inline mr-1" /> No tienes acceso a esta sección.</Banner>
  const a = avanceSeccion(state, s)
  return (
    <div>
      <Link to="/formacion" className="inline-flex items-center gap-1 text-sm text-dim mb-3"><ChevronLeft size={14} /> Formación</Link>
      <PageHeader kicker="Sección" title={s.nombre} sub={s.desc} right={<div className="text-right"><div className="num font-extrabold text-[28px] leading-none text-gold-2">{a.pct}%</div><div className="kicker dim mt-1">{a.vistas} de {a.total}</div></div>} />
      <div className="flex flex-col gap-4">
        {s.modulos.map((m, i) => { const vistas = m.lecciones.filter((l) => state.vistas.includes(l.id)).length; return (
          <Card key={m.id} className="p-0 overflow-hidden">
            <div className="p-5 flex flex-wrap items-center gap-4 border-b border-line-soft">
              <span className="num text-gold-2 font-extrabold text-[22px] w-8">{String(i + 1).padStart(2, '0')}</span>
              <div className="flex-1 min-w-[200px]"><b className="text-[17px]">{m.nombre}</b>{m.desc && <div className="text-dim text-[13.5px] mt-0.5">{m.desc}</div>}</div>
              <div className="text-right"><div className="num text-[13px] text-dim">{vistas}/{m.lecciones.length}</div><Bar pct={m.lecciones.length ? Math.round((vistas / m.lecciones.length) * 100) : 0} className="w-[120px] mt-1" /></div>
            </div>
            <div className="p-2">
              {m.lecciones.map((l, j) => { const v = state.vistas.includes(l.id); return (
                <Link key={l.id} to={`/formacion/${s.id}/${l.id}`} className="nav-item">
                  {v ? <CheckCircle2 size={16} className="text-gold-2" /> : <PlayCircle size={16} />}
                  <span className="flex-1 text-[14.5px] text-white">{l.titulo}</span>
                  {l.recursos?.length > 0 && <FileText size={13} className="text-dimmer" />}
                  <span className="num text-xs text-dimmer w-12 text-right">{l.dur || ''}</span>
                </Link>) })}
            </div>
          </Card>) })}
      </div>
    </div>
  )
}

export function Leccion() {
  const { sec, lec } = useParams()
  const { state, acciones } = useData()
  const nav = useNavigate()
  const [error, setError] = useState(null)
  const s = state.secciones.find((x) => x.id === sec)
  const todas = s ? leccionesDe(s) : []
  const i = todas.findIndex((l) => l.id === lec); const l = todas[i]
  const m = s?.modulos.find((mm) => mm.lecciones.some((x) => x.id === lec))
  useEffect(() => { if (l) acciones.abrirLeccion(l.id) }, [lec])
  if (!s || !l) return <Banner tone="red">Lección no encontrada.</Banner>
  if (!s.comprado) return <Banner tone="grey"><Lock size={14} className="inline mr-1" /> No tienes acceso a esta sección.</Banner>
  const vista = state.vistas.includes(l.id)
  const ant = todas[i - 1]; const sig = todas[i + 1]
  const rec = l.recursos || []
  const marcar = async () => { try { if (!vista) await acciones.marcarVista(l.id); if (sig) nav(`/formacion/${s.id}/${sig.id}`); else if (vista) nav(`/formacion/${s.id}`) } catch (e) { setError(e.message) } }
  return (
    <div>
      <Link to={`/formacion/${s.id}`} className="inline-flex items-center gap-1 text-sm text-dim mb-3"><ChevronLeft size={14} /> {s.nombre}</Link>
      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="card overflow-hidden">
            {/* El vídeo: el embed (Bunny u otro iframe) si la lección lo tiene; si no, el hueco 16:9 marcado. */}
            {l.video_url
              ? <div style={{ aspectRatio: '16 / 9', background: '#000' }}><iframe src={l.video_url} title={l.titulo} loading="lazy" allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture" allowFullScreen style={{ width: '100%', height: '100%', border: 0, display: 'block' }} /></div>
              : <div className="ph" style={{ aspectRatio: '16 / 9', borderRadius: 0, border: 0 }}>Vídeo pendiente · {l.titulo}{l.dur ? ` · ${l.dur}` : ''}</div>}
            <div className="p-5">
              {error && <Banner tone="red">{error}</Banner>}
              <div className="kicker mb-2">{m.nombre} · lección {m.lecciones.findIndex((x) => x.id === l.id) + 1} de {m.lecciones.length}</div>
              <h1 className="text-[24px] md:text-[30px]">{l.titulo}</h1>
              {l.desc && <p className="text-dim text-[14.5px] mt-2 max-w-[70ch]">{l.desc}</p>}
              {l.entregable && <div className="mt-3 rounded-[14px] px-4 py-3 border border-line bg-gold/10 text-[14px]"><span className="kicker mr-2">Entregable</span>{l.entregable}</div>}
              <div className="flex flex-wrap items-center gap-3 mt-4">
                <Btn onClick={marcar}>{vista ? (sig ? 'Siguiente lección' : 'Volver a la sección') : 'Marcar como vista y seguir'} <ChevronRight size={16} /></Btn>
                {vista && <Tag tone="green"><CheckCircle2 size={12} /> Vista</Tag>}
                <span className="flex-1" />
                {ant && <Link to={`/formacion/${s.id}/${ant.id}`} className="btn ghost sm"><ChevronLeft size={14} /> Anterior</Link>}
                {sig && <Link to={`/formacion/${s.id}/${sig.id}`} className="btn ghost sm">Siguiente <ChevronRight size={14} /></Link>}
              </div>
            </div>
          </div>
          <Card className="mt-5">
            <div className="kicker mb-3">Entregables de esta lección</div>
            {l.material_url && <div className="flex items-center gap-3 py-2.5"><FileText size={16} className="text-gold-2" /><span className="flex-1 text-[14.5px]">Material de la lección</span><a className="btn outline sm" href={l.material_url} target="_blank" rel="noreferrer">Abrir</a></div>}
            {rec.length ? rec.map((r, k) => <div key={k} className="flex items-center gap-3 py-2.5 border-t border-line-soft first:border-0 first:pt-0"><FileText size={16} className="text-gold-2" /><span className="flex-1 text-[14.5px]">{r.nombre}</span><Tag tone="grey">{r.tipo}</Tag>{r.url ? <a className="btn outline sm" href={r.url} target="_blank" rel="noreferrer">Abrir</a> : <Tag tone="grey">pendiente</Tag>}</div>)
              : !l.material_url && <p className="text-dim text-[14px]">Esta lección no tiene entregables. Lo que se dijo en ella está en el vídeo.</p>}
          </Card>
        </div>
        <Card className="p-3 h-fit lg:sticky lg:top-0">
          <div className="kicker px-2 mb-1">{m.nombre}</div>
          {m.lecciones.map((x, j) => { const v = state.vistas.includes(x.id); return (
            <Link key={x.id} to={`/formacion/${s.id}/${x.id}`} className={cn('nav-item', x.id === l.id && 'active')}>
              {v ? <CheckCircle2 size={15} className={x.id === l.id ? 'text-gold-2' : 'text-gold'} /> : <PlayCircle size={15} />}
              <span className="flex-1 text-[13.5px]">{j + 1} · {x.titulo}</span><span className="num text-[11px] text-dimmer">{x.dur || ''}</span>
            </Link>) })}
          <div className="border-t border-line-soft mt-2 pt-2 px-2 text-xs text-dimmer">Otros módulos de {s.nombre}: <Link to={`/formacion/${s.id}`} className="text-gold-2">ver la sección →</Link></div>
        </Card>
      </div>
    </div>
  )
}
