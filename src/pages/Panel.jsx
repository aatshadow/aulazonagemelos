import { Link } from 'react-router-dom'
import { ArrowRight, Play, Radio, LifeBuoy } from 'lucide-react'
import { PageHeader, Stat, Card, Anillo, Bar, Tag } from '../ui/index.jsx'
import { useData, siguienteLeccion, avanceTotal, avanceSeccion, modulosPendientes, fmtFecha, fmtHora, hace, hoyLargo, noLeidos } from '../data/store.jsx'

/* El panel: el mismo contenido que la rejilla del prototipo, ordenado como el «Panel» de Amira:
   saludo con el titular calculado, cuatro cifras, UN siguiente paso, y los bloques secundarios. */
export default function Panel() {
  const { state, modulo } = useData()
  const { secciones, directos, canales } = state
  const sig = siguienteLeccion(state)
  const total = avanceTotal(state)
  const prox = directos.filter((d) => new Date(d.fecha) > Date.now()).sort((a, b) => new Date(a.fecha) - new Date(b.fecha))[0]
  const anunciosSlug = canales.find((c) => c.soloEquipo)?.id || 'anuncios'
  const anuncio = state.posts.find((p) => p.canal === anunciosSlug)
  const sinLeer = canales.reduce((a, c) => a + noLeidos(state, c.id), 0)
  /* el titular: la sección más avanzada que aún no está cerrada */
  const abierta = secciones.map((s) => ({ s, a: avanceSeccion(state, s) })).filter((x) => x.a.pct < 100).sort((x, y) => y.a.pct - x.a.pct)[0]
  const pend = abierta ? modulosPendientes(state, abierta.s) : 0
  const titular = abierta ? <>Te queda{pend === 1 ? '' : 'n'} <span className="text-gold-2">{pend === 1 ? 'un módulo' : `${pend} módulos`}</span> para cerrar {abierta.s.nombre}.</> : <>Lo tienes <span className="text-gold-2">todo visto</span>.</>
  const vistasSig = sig ? state.vistas.includes(sig.id) : false
  const ultimo = state.posts.filter((p) => p.canal !== anunciosSlug)[0]
  return (
    <div>
      <div className="kicker mb-3">{hoyLargo()}</div>
      <h1 className="text-[30px] md:text-[42px] mb-6">Buenas, {(state.perfil?.nombre || state.alumno.nombre).split(' ')[0]}.<br />{titular}</h1>

      {sig && (
        <Link to={`/formacion/${sig.seccion.id}/${sig.id}`} className="block card gold hover p-5 md:p-6 mb-5">
          <div className="flex flex-wrap items-center gap-4">
            <span className="avatar gold" style={{ width: 52, height: 52 }}><Play size={20} fill="currentColor" /></span>
            <div className="flex-1 min-w-[220px]">
              <div className="kicker mb-1">{vistasSig ? 'Vuelve a verla' : 'Continuar donde lo dejaste'}</div>
              <div className="text-[19px] md:text-[22px] font-extrabold tracking-[-0.02em] leading-tight">{sig.titulo}</div>
              <div className="text-dim text-[13px] mt-1 mono">{sig.seccion.nombre} · {sig.modulo.nombre}{sig.dur ? ` · ${sig.dur}` : ''}</div>
            </div>
            <span className="btn primary">Seguir viendo <ArrowRight size={16} /></span>
          </div>
        </Link>
      )}

      <div className="grid gap-3 grid-cols-2 md:grid-cols-4 mb-6">
        <Stat label="Tu avance" value={total.pct + '%'} sub={`${total.vistas} de ${total.total} lecciones`} tone="gold" />
        {modulo('directos') ? <Stat label="Próximo directo" value={prox ? fmtFecha(prox.fecha, { weekday: 'short' }) : '—'} sub={prox ? `${fmtHora(prox.fecha)} · ${prox.tipo}` : 'Sin fecha'} /> : <Stat label="Secciones" value={secciones.length} sub="en tu formación" />}
        {modulo('comunidad') ? <Stat label="Comunidad" value={sinLeer} sub={sinLeer === 1 ? 'mensaje sin leer' : 'mensajes sin leer'} /> : <Stat label="Módulos" value={secciones.reduce((a, s) => a + s.modulos.length, 0)} sub="en total" />}
        <Stat label="Alumno desde" value={state.alumno.alta ? fmtFecha(state.alumno.alta) : '—'} sub={state.alumno.acceso} />
      </div>

      <div className="grid gap-5 md:grid-cols-[1.2fr_1fr]">
        <Card>
          <div className="flex items-center justify-between mb-4"><div className="kicker">Tus secciones</div><Link to="/formacion" className="text-sm text-gold-2">Ver todas →</Link></div>
          {secciones.map((s) => { const a = avanceSeccion(state, s); return (
            <Link key={s.id} to={`/formacion/${s.id}`} className="block py-3 border-t border-line-soft first:border-0 first:pt-0">
              <div className="flex items-center justify-between gap-3"><b className="text-[15px]">{s.nombre}</b><span className="num text-dim text-[12px]">{a.vistas}/{a.total}</span></div>
              <Bar pct={a.pct} className="mt-2" />
            </Link>) })}
        </Card>
        <div className="flex flex-col gap-5">
          <Card className="flex items-center gap-5"><Anillo pct={total.pct} size={112} /><div><div className="kicker mb-1">Tu avance</div><div className="text-[15px]">{total.vistas} de {total.total} lecciones vistas en {secciones.length} secciones.</div><Link to="/ficha" className="text-sm text-gold-2 mt-2 inline-block">Mi ficha →</Link></div></Card>
          {modulo('directos') && prox && (
            <Card className="gold">
              <div className="flex items-center gap-2 mb-2"><Tag tone="red"><span className="inline-block w-1.5 h-1.5 rounded-full bg-red" /> Directo · {fmtFecha(prox.fecha, { weekday: 'long' })} {fmtHora(prox.fecha)}</Tag></div>
              <div className="text-[15.5px] leading-snug">{prox.titulo}.{prox.nota && <span className="text-dim"> {prox.nota}</span>}</div>
              <Link to="/directos" className="btn outline sm mt-3"><Radio size={14} /> Ver directos</Link>
            </Card>
          )}
        </div>
      </div>

      {(modulo('comunidad') || modulo('soporte')) && <div className="grid gap-5 md:grid-cols-3 mt-5">
        {modulo('comunidad') && <Card>
          <div className="flex items-center justify-between mb-3"><div className="kicker">Último aviso</div><Link to={`/comunidad/${anunciosSlug}`} className="text-sm text-gold-2">Anuncios →</Link></div>
          {anuncio ? <><p className="text-[14.5px] leading-relaxed">{anuncio.texto}</p><div className="text-dimmer text-xs mt-2 mono">{anuncio.autor} · {hace(anuncio.creado)}</div></> : <p className="text-dim">Sin avisos.</p>}
        </Card>}
        {modulo('comunidad') && <Card>
          <div className="flex items-center justify-between mb-3"><div className="kicker">Comunidad</div><Link to="/comunidad" className="text-sm text-gold-2">Entrar →</Link></div>
          {ultimo ? <><div className="text-[13px] mono text-dim mb-1">{ultimo.autor}, en <span className="text-gold-2">#{ultimo.canal}</span></div><p className="text-[14.5px] leading-relaxed">«{ultimo.texto}»</p></> : <p className="text-dim">Nada todavía.</p>}
        </Card>}
        {modulo('soporte') && <Link to="/soporte" className="card hover p-5 flex flex-col items-center text-center justify-center">
          <span className="avatar gold mb-3" style={{ width: 56, height: 56 }}><LifeBuoy size={22} /></span>
          <div className="kicker mb-1">Soporte directo</div>
          <div className="text-dim text-[13px]">{state.soporte.some((c) => c.estado === 'respondido') ? 'Tienes una respuesta del equipo' : 'Escríbenos y te contesta el equipo'}</div>
          <span className="btn outline sm mt-3">Abrir soporte</span>
        </Link>}
      </div>}
    </div>
  )
}
