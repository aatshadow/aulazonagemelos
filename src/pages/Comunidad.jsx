import { Acceso } from '../ui/acceso.jsx'
import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Hash, Lock, Plus, SendHorizontal, Reply, SmilePlus, X, Users, ImageIcon, Ticket, LifeBuoy, CheckCircle2, UserCheck, Info } from 'lucide-react'
import { cn } from '../utils/cn.js'
import { RANGOS } from '../data/bootcamp.js'
import { miembros, CATEGORIAS_TICKET } from '../data/mock.js'
import { Pulsera } from '../ui/camino.jsx'
import { useData, noLeidos, esEquipo, puedeVerCanal, misTickets } from '../data/store.jsx'

/* COMUNIDAD · calcada de un servidor de Discord (Alex 02-10): sin márgenes, canales a la izquierda por categorías, chat en
   orden de llegada con la caja de escribir fija abajo y miembros a la derecha agrupados por rango (como roles).
   · ZONAS POR RANGO: un canal por rango, solo para los de ese rango (y el equipo). Los demás se ven con candado.
   · SOPORTE POR TICKETS: «Abrir ticket» crea un canal privado ticket-00NN entre el alumno y el equipo (moderación y
     administración), que se lo asigna, responde y cierra. Sustituye a la antigua página de soporte. */
const COLOR = ['#B9AE98', '#ECE6DA', '#8197FF', '#E3687C', '#E6CF8E', '#F2D27A']
const EQUIPO = '#C7B38D'
const ESTADO = { abierto: ['Abierto', '#E5545E'], 'en curso': ['En curso', '#E3A34F'], resuelto: ['Resuelto', '#3BA55D'] }
const iniciales = (n) => n.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
const numTicket = (t) => `ticket-${String(t.num).padStart(4, '0')}`
function cuando(iso) {
  const d = new Date(iso); const h = d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  const hoy = new Date(); hoy.setHours(0, 0, 0, 0)
  if (d >= hoy) return `hoy a las ${h}`
  if (d >= new Date(hoy - 864e5)) return `ayer a las ${h}`
  return `${d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} a las ${h}`
}
const colorDe = (p) => (p.equipo ? EQUIPO : COLOR[p.rango ?? 0])

function Avatar({ p, size = 40 }) {
  return <span className="shrink-0 grid place-items-center rounded-full font-bold" style={{ width: size, height: size, fontSize: size * 0.36, background: p.equipo ? 'linear-gradient(135deg,#D9C7A6,#8C724C)' : '#1E1C21', color: p.equipo ? '#0B0906' : colorDe(p), boxShadow: `inset 0 0 0 1.5px ${p.equipo ? 'transparent' : colorDe(p) + '55'}` }}>{iniciales(p.autor)}</span>
}

/* Un mensaje. `p` = { id, autor, texto, creado, equipo, rango, captura, respondeA, reacciones, mia }. */
function Mensaje({ p, compacto, onResponder, onReaccionar }) {
  return (
    <div className={cn('group relative flex gap-4 px-4 hover:bg-white/[.025]', compacto ? 'py-0.5' : 'pt-3.5 pb-0.5')}>
      {compacto
        ? <span className="w-10 shrink-0 text-right text-[10.5px] text-faint leading-[22px] opacity-0 group-hover:opacity-100">{new Date(p.creado).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
        : <Avatar p={p} />}
      <div className="min-w-0 flex-1">
        {p.respondeA && <div className="flex items-center gap-1.5 text-[12.5px] text-dimmer -mt-0.5 mb-0.5 truncate"><Reply size={12} className="scale-x-[-1] shrink-0" /><b className="font-semibold text-dim">@{p.respondeA.autor}</b><span className="truncate">{p.respondeA.texto}</span></div>}
        {!compacto && <div className="flex items-baseline gap-2"><b className="font-semibold text-[15px]" style={{ color: colorDe(p) }}>{p.autor}</b>{p.equipo && <span className="text-[10px] font-bold px-1.5 py-[1px] rounded bg-gold text-on-gold">EQUIPO</span>}<span className="text-faint text-[11.5px]">{cuando(p.creado)}</span></div>}
        <p className="text-[15px] leading-[1.45] text-white/90 whitespace-pre-line break-words">{p.texto}</p>
        {p.captura && <div className="mt-2 w-[320px] max-w-full rounded-[8px] overflow-hidden border border-line-soft"><div className="grid place-items-center gap-1 text-dimmer text-[12.5px]" style={{ height: 172, background: 'linear-gradient(135deg,#17151a,#0c0b0e)' }}><ImageIcon size={22} />{p.captura}</div></div>}
        {p.reacciones > 0 && <button onClick={() => onReaccionar?.(p.id)} className={cn('mt-1.5 inline-flex items-center gap-1.5 rounded-[8px] px-2 py-0.5 text-[13px] border', p.mia ? 'bg-gold/15 border-gold/60 text-gold-2' : 'bg-white/[.04] border-transparent hover:border-line-soft text-dim')}>🔥 <span className="num">{p.reacciones}</span></button>}
      </div>
      {(onResponder || onReaccionar) && <div className="absolute right-4 -top-3 hidden group-hover:flex rounded-[8px] border border-line-soft bg-[#141216] shadow-lg">
        {onReaccionar && <button className="p-1.5 hover:bg-white/5 text-dim" title="Reaccionar" onClick={() => onReaccionar(p.id)}><SmilePlus size={17} /></button>}
        {onResponder && <button className="p-1.5 hover:bg-white/5 text-dim" title="Responder" onClick={() => onResponder(p)}><Reply size={17} /></button>}
      </div>}
    </div>
  )
}
const Sistema = ({ m }) => <div className="flex items-center gap-3 px-4 py-2 text-[13px] text-dimmer"><span className="w-10 grid place-items-center shrink-0"><Info size={15} /></span><span>{m.texto}</span><span className="text-faint text-[11.5px]">{cuando(m.en)}</span></div>

/* La caja de escribir, fija abajo. `adjuntar` = permite captura. */
function Caja({ placeholder, onEnviar, adjuntar = true, respondiendo, onCancelarRespuesta, campo, pie }) {
  const [texto, setTexto] = useState('')
  const [captura, setCaptura] = useState(null)
  const enviar = async () => { if (!texto.trim() && !captura) return; await onEnviar(texto.trim(), captura); setTexto(''); setCaptura(null) }
  return (
    <div className="shrink-0 px-4 pb-5">
      {respondiendo && <div className="flex items-center gap-2 rounded-t-[10px] bg-[#141216] px-4 py-2 text-[13px] text-dim">Respondiendo a <b style={{ color: colorDe(respondiendo) }}>{respondiendo.autor}</b><span className="flex-1" /><button onClick={onCancelarRespuesta} className="text-dimmer hover:text-white"><X size={15} /></button></div>}
      {captura && <div className={cn('flex items-center gap-2 bg-[#141216] px-4 py-2 text-[13px] text-dim', !respondiendo && 'rounded-t-[10px]')}><ImageIcon size={15} /> {captura.name}<span className="flex-1" /><button onClick={() => setCaptura(null)} className="text-dimmer hover:text-white"><X size={15} /></button></div>}
      <div className={cn('flex items-center gap-2 bg-[#1A181D] px-3', respondiendo || captura ? 'rounded-b-[10px]' : 'rounded-[10px]')}>
        {adjuntar ? <label className="p-1.5 rounded-full text-dim hover:text-white cursor-pointer" title="Adjuntar captura"><Plus size={20} /><input type="file" accept="image/*" className="sr-only" onChange={(e) => setCaptura(e.target.files?.[0] || null)} /></label> : <span className="w-2" />}
        <input ref={campo} className="flex-1 bg-transparent outline-none py-3 text-[15px] placeholder:text-faint" placeholder={placeholder} value={texto} onChange={(e) => setTexto(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviar() } }} />
        <button className={cn('p-1.5', texto.trim() || captura ? 'text-gold-2' : 'text-faint')} onClick={enviar} title="Enviar"><SendHorizontal size={19} /></button>
      </div>
      {pie && <div className="text-faint text-[12px] mt-1.5 px-1">{pie}</div>}
    </div>
  )
}
const Cabecera = ({ icon: I = Hash, titulo, tema, children }) => (
  <header className="h-12 shrink-0 px-4 flex items-center gap-2 border-b border-line-soft">
    <I size={20} className="text-dimmer shrink-0" /><b className="text-[15.5px] truncate">{titulo}</b>
    {tema && <><span className="w-px h-5 bg-line-soft mx-2 hide-mobile" /><span className="text-dimmer text-[13.5px] truncate hide-mobile">{tema}</span></>}
    <span className="flex-1" />{children}
  </header>)

/* --- un canal normal o una zona por rango --- */
function Canal({ c, verMiembros, setVerMiembros }) {
  const { state, acciones } = useData()
  const rows = state.posts.filter((p) => p.canal === c.id).sort((a, b) => (a.creado < b.creado ? -1 : 1))
  const [respondiendo, setRespondiendo] = useState(null)
  const fin = useRef(null); const campo = useRef(null)
  useEffect(() => { acciones.canalLeido(c.id) }, [c.id, rows.length])
  useEffect(() => { fin.current?.scrollIntoView({ block: 'end' }) }, [c.id, rows.length])
  useEffect(() => { setRespondiendo(null) }, [c.id])
  const puede = !c.soloEquipo || esEquipo(state)
  return (
    <section className="flex-1 min-w-0 flex flex-col bg-black">
      <Cabecera titulo={c.nombre} tema={c.tema}><button className={cn('hide-mobile p-1.5 rounded', verMiembros ? 'text-white' : 'text-dimmer')} title="Miembros" onClick={() => setVerMiembros(!verMiembros)}><Users size={19} /></button></Cabecera>
      <div className="flex-1 overflow-auto min-h-0">
        <div className="px-4 pt-8 pb-4">
          {c.rangoSolo != null ? <div className="mb-3"><Pulsera rango={c.rangoSolo} /></div> : <span className="grid place-items-center w-16 h-16 rounded-full bg-white/[.06] mb-3"><Hash size={34} className="text-dim" /></span>}
          <h1 className="text-[28px]">Te damos la bienvenida a #{c.nombre}</h1>
          <p className="text-dimmer text-[14.5px] mt-1">{c.tema}{c.rangoSolo != null && ` Solo lo ven los de ${RANGOS[c.rangoSolo].nombre} y el equipo.`}</p>
        </div>
        {rows.map((p, i) => { const a = rows[i - 1]; const compacto = a && a.autor === p.autor && !p.respondeA && (new Date(p.creado) - new Date(a.creado)) < 7 * 60e3
          return <Mensaje key={p.id} p={p} compacto={compacto} onReaccionar={acciones.reaccionar} onResponder={(x) => { setRespondiendo(x); campo.current?.focus() }} /> })}
        <div ref={fin} className="h-5" />
      </div>
      {puede
        ? <Caja campo={campo} placeholder={`Enviar mensaje a #${c.nombre}`} respondiendo={respondiendo} onCancelarRespuesta={() => setRespondiendo(null)}
            pie={c.id === 'wins' ? 'En #wins, con captura: así cuenta para el Top 10.' : null}
            onEnviar={async (texto, captura) => { await acciones.publicar(c.id, texto, { ...(captura ? { captura: captura.name } : {}), ...(respondiendo ? { respondeA: { autor: respondiendo.autor, texto: respondiendo.texto.slice(0, 90) } } : {}) }); setRespondiendo(null) }} />
        : <div className="shrink-0 px-4 pb-5"><div className="rounded-[10px] bg-[#121014] px-4 py-3 text-[14px] text-dimmer flex items-center gap-2"><Lock size={14} /> En #{c.nombre} solo publica el equipo.</div></div>}
    </section>
  )
}

function Bloqueado({ c }) {
  const nav = useNavigate()
  return (
    <section className="flex-1 min-w-0 flex flex-col bg-black">
      <Cabecera icon={Lock} titulo={c.nombre} />
      <div className="flex-1 grid place-items-center p-8 text-center">
        <div className="max-w-[420px]">
          <Pulsera rango={c.rangoSolo} />
          <h1 className="text-[28px] mt-5">#{c.nombre} es solo para {RANGOS[c.rangoSolo].nombre}.</h1>
          <p className="text-dim text-[15px] mt-2">{c.tema}</p>
          <button className="btn primary mt-6" onClick={() => nav('/perfil')}>Ver cómo se llega</button>
        </div>
      </div>
    </section>
  )
}

/* --- soporte: abrir un ticket (alumno) o la bandeja de tickets (equipo) --- */
function Soporte() {
  const { state, acciones } = useData()
  const nav = useNavigate()
  const [categoria, setCategoria] = useState('Bootcamp')
  const [asunto, setAsunto] = useState('')
  const [texto, setTexto] = useState('')
  const eq = esEquipo(state)
  const tickets = misTickets(state)
  const abrir = async () => { const id = await acciones.soporteNuevo(asunto.trim(), texto.trim(), categoria); nav(`/comunidad/${id}`) }
  return (
    <section className="flex-1 min-w-0 flex flex-col bg-black">
      <Cabecera icon={LifeBuoy} titulo={eq ? 'Tickets' : 'Soporte'} tema={eq ? 'Todo lo que han abierto los alumnos. Asígnatelo, responde y ciérralo.' : 'Abre un ticket y te contesta el equipo, en privado.'} />
      <div className="flex-1 overflow-auto min-h-0 p-6 md:p-8">
        {!eq && <div className="max-w-[860px] mb-8"><Acceso soporte /></div>}
        {!eq && (
          <div className="max-w-[560px]">
            <h1 className="text-[28px]">Abre un ticket</h1>
            <p className="text-dim text-[15px] mt-1">Se crea un canal privado entre tú y el equipo de moderación y administración. Te contestan ahí en menos de 24 horas.</p>
            <div className="flex flex-wrap gap-2 mt-5">{CATEGORIAS_TICKET.map((k) => <button key={k} onClick={() => setCategoria(k)} className={cn('chip', categoria === k && 'on')}>{k}</button>)}</div>
            <input className="input mt-4" placeholder="Asunto: qué pasa, en una línea" value={asunto} onChange={(e) => setAsunto(e.target.value)} />
            <textarea className="input mt-3" style={{ minHeight: 120 }} placeholder="Cuéntalo con detalle: qué hiciste, qué esperabas y qué ha pasado." value={texto} onChange={(e) => setTexto(e.target.value)} />
            <button className="btn primary mt-4" disabled={!asunto.trim() || !texto.trim()} onClick={abrir}><Ticket size={16} /> Abrir ticket</button>
          </div>)}
        <h2 className={cn('text-[22px]', !eq && 'mt-12')}>{eq ? `Bandeja · ${tickets.filter((t) => t.estado !== 'resuelto').length} sin cerrar` : 'Tus tickets'}</h2>
        <div className="mt-3 max-w-[860px] border-t border-line-soft">
          {tickets.length ? [...tickets].sort((a, b) => (a.estado === 'resuelto') - (b.estado === 'resuelto') || b.num - a.num).map((t) => (
            <button key={t.id} onClick={() => nav(`/comunidad/${t.id}`)} className="w-full flex flex-wrap items-center gap-x-4 gap-y-1 py-3 px-2 border-b border-line-soft text-left hover:bg-white/[.03]">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: ESTADO[t.estado][1] }} />
              <span className="text-dimmer text-[13px] w-[96px] shrink-0">{numTicket(t)}</span>
              <span className="flex-1 min-w-[180px] text-[15px] truncate">{t.asunto}</span>
              {eq && <span className="text-dim text-[13px]">{t.alumno}</span>}
              <span className="text-dimmer text-[13px] w-[70px]">{t.categoria}</span>
              <span className="text-[13px] w-[150px] text-right" style={{ color: ESTADO[t.estado][1] }}>{ESTADO[t.estado][0]}{t.asignado ? <span className="text-dimmer"> · {t.asignado}</span> : eq ? <span className="text-dimmer"> · sin asignar</span> : ''}</span>
            </button>)) : <p className="text-dimmer text-[14px] py-4">Aún no has abierto ninguno.</p>}
        </div>
      </div>
    </section>
  )
}

/* --- un ticket: el canal privado --- */
function TicketVista({ t }) {
  const { state, acciones } = useData()
  const fin = useRef(null)
  const eq = esEquipo(state)
  useEffect(() => { fin.current?.scrollIntoView({ block: 'end' }) }, [t.id, t.mensajes.length])
  const comoMensaje = (m, i) => ({ id: t.id + i, autor: m.autor, texto: m.texto, creado: m.en, equipo: m.de === 'equipo', rango: m.autor === state.perfil.nombre ? state.rango : (miembros.find((x) => x.nombre === m.autor)?.rango ?? 0) })
  return (
    <section className="flex-1 min-w-0 flex flex-col bg-black">
      <Cabecera icon={Ticket} titulo={numTicket(t)} tema={t.asunto}>
        <span className="text-[13px] mr-2 hide-mobile" style={{ color: ESTADO[t.estado][1] }}>{ESTADO[t.estado][0]}{t.asignado && <span className="text-dimmer"> · {t.asignado}</span>}</span>
        {eq && !t.asignado && t.estado !== 'resuelto' && <button className="btn ghost sm" onClick={() => acciones.soporteAsignar(t.id)}><UserCheck size={14} /> Asignármelo</button>}
        {t.estado !== 'resuelto' && <button className="btn outline sm" onClick={() => acciones.soporteCerrar(t.id)}><CheckCircle2 size={14} /> {eq ? 'Cerrar ticket' : 'Ya está resuelto'}</button>}
      </Cabecera>
      <div className="flex-1 overflow-auto min-h-0">
        <div className="px-4 pt-8 pb-4">
          <span className="grid place-items-center w-16 h-16 rounded-full bg-white/[.06] mb-3"><Ticket size={30} className="text-dim" /></span>
          <h1 className="text-[28px]">{t.asunto}</h1>
          <p className="text-dimmer text-[14.5px] mt-1">{t.categoria} · abierto por {t.alumno} · {cuando(t.creado)}. Solo lo ven {eq ? t.alumno : 'tú'} y el equipo de moderación y administración.</p>
        </div>
        {t.mensajes.map((m, i) => { if (m.de === 'sistema') return <Sistema key={i} m={m} />
          const a = t.mensajes[i - 1]; const compacto = a && a.de !== 'sistema' && a.autor === m.autor && (new Date(m.en) - new Date(a.en)) < 7 * 60e3
          return <Mensaje key={i} p={comoMensaje(m, i)} compacto={compacto} /> })}
        <div ref={fin} className="h-5" />
      </div>
      {t.estado === 'resuelto' && !eq
        ? <div className="shrink-0 px-4 pb-5"><div className="rounded-[10px] bg-[#121014] px-4 py-3 text-[14px] text-dimmer">Este ticket está cerrado. Si vuelve a pasar, escríbelo aquí y se reabre.</div></div>
        : null}
      <Caja placeholder={`Responder en ${numTicket(t)}`} adjuntar={false} onEnviar={(texto) => acciones.soporteMsg(t.id, texto)} />
    </section>
  )
}

export default function Comunidad() {
  const { canal: sel } = useParams()
  const nav = useNavigate()
  const { state, aula } = useData()
  const [verMiembros, setVerMiembros] = useState(true)
  const eq = esEquipo(state)
  const { canales } = state
  const tickets = misTickets(state)
  const ticket = tickets.find((t) => t.id === sel)
  const c = canales.find((k) => k.id === sel) || (!ticket && sel !== 'soporte' && canales.find((k) => k.id === 'wins'))
  const cats = [...new Set(canales.map((k) => k.cat || 'Canales'))]
  const grupos = [...RANGOS.keys()].reverse().map((i) => ({ i, gente: miembros.filter((m) => m.rango === i) })).filter((g) => g.gente.length)
  const pendientes = eq ? tickets.filter((t) => t.estado === 'abierto').length : tickets.filter((t) => t.estado === 'en curso' && t.mensajes.at(-1)?.de === 'equipo').length
  const fila = (activo, extra) => cn('w-full flex items-center gap-1.5 rounded-[6px] px-2 py-[7px] text-[15px] text-left', activo ? 'bg-white/[.07] text-white' : extra || 'text-dimmer hover:bg-white/[.04] hover:text-dim')
  return (
    <div className="h-full flex min-h-0">
      <aside className="hide-mobile w-[240px] shrink-0 flex flex-col bg-[#0B0A0D] border-r border-line-soft">
        <div className="h-12 shrink-0 px-4 flex items-center border-b border-line-soft font-bold text-[15px] truncate">{aula.nombre}</div>
        <nav className="flex-1 overflow-auto px-2 py-3">
          {cats.map((cat) => (
            <div key={cat} className="mb-4">
              <div className="px-2 mb-1 text-[11.5px] font-semibold text-dimmer">{cat}</div>
              {canales.filter((k) => (k.cat || 'Canales') === cat).map((k) => { const ve = puedeVerCanal(state, k); const n = !ve || k.id === sel ? 0 : noLeidos(state, k.id); return (
                <button key={k.id} onClick={() => nav(`/comunidad/${k.id}`)} className={fila(c?.id === k.id, !ve ? 'text-faint hover:bg-white/[.03]' : n ? 'text-white font-semibold hover:bg-white/[.04]' : null)}>
                  {ve ? <Hash size={17} className="shrink-0 opacity-70" /> : <Lock size={15} className="shrink-0 opacity-60" />}<span className="flex-1 truncate">{k.nombre}</span>
                  {k.rangoSolo != null && !ve && <Pulsera rango={k.rangoSolo} chica apagada />}
                  {k.soloEquipo && <Lock size={12} className="opacity-50" />}
                  {n > 0 && <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[#E5545E] text-white text-[11px] font-bold grid place-items-center">{n}</span>}
                </button>) })}
            </div>))}
          <div className="mb-4">
            <div className="px-2 mb-1 text-[11.5px] font-semibold text-dimmer">Soporte</div>
            <button onClick={() => nav('/comunidad/soporte')} className={fila(sel === 'soporte')}>
              {eq ? <LifeBuoy size={17} className="shrink-0 opacity-70" /> : <Plus size={17} className="shrink-0 opacity-70" />}<span className="flex-1 truncate">{eq ? 'Bandeja de tickets' : 'Abrir ticket'}</span>
              {pendientes > 0 && <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[#E5545E] text-white text-[11px] font-bold grid place-items-center">{pendientes}</span>}
            </button>
            {tickets.filter((t) => t.estado !== 'resuelto').map((t) => (
              <button key={t.id} onClick={() => nav(`/comunidad/${t.id}`)} className={fila(ticket?.id === t.id)}>
                <Ticket size={15} className="shrink-0 opacity-70" /><span className="flex-1 truncate">{numTicket(t)}</span>
                <span className="w-2 h-2 rounded-full" style={{ background: ESTADO[t.estado][1] }} />
              </button>))}
          </div>
        </nav>
      </aside>

      {ticket ? <TicketVista t={ticket} />
        : sel === 'soporte' ? <Soporte />
        : c && !puedeVerCanal(state, c) ? <Bloqueado c={c} />
        : c ? <Canal c={c} verMiembros={verMiembros} setVerMiembros={setVerMiembros} /> : null}

      {verMiembros && c && !ticket && sel !== 'soporte' && puedeVerCanal(state, c) && <aside className="hide-mobile w-[232px] shrink-0 bg-[#0B0A0D] border-l border-line-soft overflow-auto px-2 py-4">
        {<div className="mb-5"><div className="px-2 mb-1 text-[11.5px] font-semibold text-dimmer">Equipo · 2</div>
          {['Admin', 'Moderación'].map((n) => <div key={n} className="flex items-center gap-2.5 rounded-[6px] px-2 py-1.5"><span className="relative"><Avatar p={{ autor: n, equipo: true }} size={32} /><span className="absolute -right-0.5 -bottom-0.5 w-3 h-3 rounded-full bg-[#3BA55D] border-[2.5px] border-[#0B0A0D]" /></span><span className="truncate text-[14.5px] font-medium" style={{ color: EQUIPO }}>{n}</span></div>)}</div>}
        {grupos.filter((g) => c.rangoSolo == null || g.i === c.rangoSolo).map((g) => (
          <div key={g.i} className="mb-5">
            <div className="px-2 mb-1 text-[11.5px] font-semibold text-dimmer">{RANGOS[g.i].nombre} · {g.gente.length}</div>
            {g.gente.map((m) => (
              <div key={m.nombre} className={cn('flex items-center gap-2.5 rounded-[6px] px-2 py-1.5 hover:bg-white/[.04]', !m.enLinea && 'opacity-40')}>
                <span className="relative"><Avatar p={{ autor: m.nombre, rango: m.rango }} size={32} />{m.enLinea && <span className="absolute -right-0.5 -bottom-0.5 w-3 h-3 rounded-full bg-[#3BA55D] border-[2.5px] border-[#0B0A0D]" />}</span>
                <span className="truncate text-[14.5px] font-medium" style={{ color: COLOR[m.rango] }}>{m.nombre}</span>
              </div>))}
          </div>))}
      </aside>}
    </div>
  )
}

