import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Heart, Pin, Lock, MessageCircle } from 'lucide-react'
import { PageHeader, Avatar, Tag, Btn, Banner } from '../ui/index.jsx'
import { useData, hace, noLeidos } from '../data/store.jsx'
import { cn } from '../utils/cn.js'

/* COMUNIDAD · canales, publicaciones, comentarios y reacciones. Escribir es un permiso por rol y
   canal (plan §4): en el canal de anuncios sólo dirección (lo garantiza un trigger en la base,
   no sólo la pantalla). Sin mensajes directos, a propósito. */
function Publicacion({ p }) {
  const { acciones } = useData()
  const [abierto, setAbierto] = useState(false)
  const [texto, setTexto] = useState('')
  const [error, setError] = useState(null)
  const enviar = async () => { if (!texto.trim()) return; try { await acciones.comentar(p.id, texto.trim()); setTexto('') } catch (e) { setError(e.message) } }
  return (
    <div className="card p-4">
      <div className="flex items-center gap-3"><Avatar name={p.autor} size={36} gold={p.equipo} /><div className="flex-1 min-w-0"><b className="text-[14px]">{p.autor}</b> {p.equipo && <Tag className="ml-1">Dirección</Tag>}<div className="text-xs text-dimmer mono mt-0.5">{hace(p.creado)}</div></div>{p.equipo && <Pin size={14} className="text-dimmer" />}</div>
      <p className="mt-3 text-[15px] leading-relaxed whitespace-pre-line">{p.texto}</p>
      <div className="mt-3 flex gap-2">
        <button className={cn('btn ghost sm', p.mia && 'text-gold-2')} onClick={() => acciones.reaccionar(p.id).catch((e) => setError(e.message))}><Heart size={13} fill={p.mia ? 'currentColor' : 'none'} /> {p.reacciones}</button>
        <button className="btn ghost sm" onClick={() => setAbierto(!abierto)}><MessageCircle size={13} /> {p.comentarios?.length || 'Responder'}</button>
      </div>
      {error && <div className="mt-2"><Banner tone="red">{error}</Banner></div>}
      {(abierto || p.comentarios?.length > 0) && (
        <div className="mt-3 pl-3 border-l border-line-soft flex flex-col gap-2">
          {p.comentarios?.map((c) => <div key={c.id} className="text-[14px]"><b>{c.autor}</b> <span className="text-dimmer text-xs mono">{hace(c.creado)}</span><div className="text-dim">{c.texto}</div></div>)}
          {abierto && <form className="flex gap-2 mt-1" onSubmit={(e) => { e.preventDefault(); enviar() }}><input className="input" style={{ padding: '7px 12px', fontSize: 13 }} placeholder="Responder…" value={texto} onChange={(e) => setTexto(e.target.value)} /><Btn size="sm" type="submit" disabled={!texto.trim()}>Enviar</Btn></form>}
        </div>)}
    </div>
  )
}

export default function Comunidad() {
  const { canal: canalUrl } = useParams()
  const nav = useNavigate()
  const { state, acciones } = useData()
  const { canales } = state
  const canal = canales.some((c) => c.id === canalUrl) ? canalUrl : (canales.find((c) => !c.soloEquipo) || canales[0])?.id
  const [texto, setTexto] = useState('')
  const [error, setError] = useState(null)
  const c = canales.find((x) => x.id === canal)
  const rows = state.posts.filter((p) => p.canal === canal)
  useEffect(() => { if (canal) acciones.canalLeido(canal) }, [canal, rows.length])
  if (!c) return <div><PageHeader kicker="Comunidad" title="Comunidad" /><p className="text-dim">Este aula todavía no tiene canales.</p></div>
  const puede = !c.soloEquipo || state.rol === 'direccion'
  const publicar = async () => { try { await acciones.publicar(canal, texto.trim()); setTexto(''); setError(null) } catch (e) { setError(e.message) } }
  return (
    <div>
      <PageHeader kicker="Comunidad" title="Comunidad" sub="Los avisos de dirección, el general y las dudas del temario. Todo aquí dentro." />
      <div className="grid gap-5 md:grid-cols-[220px_1fr]">
        <div className="card p-2 h-fit">
          {canales.map((k) => { const n = noLeidos(state, k.id); return (
            <button key={k.id} className={cn('nav-item w-full text-left', canal === k.id && 'active')} onClick={() => nav(`/comunidad/${k.id}`)}>
              <span className="opacity-50">#</span><span className="flex-1">{k.nombre}</span>
              {k.soloEquipo ? <Lock size={12} className="opacity-50" /> : n > 0 && <span className="tag gold" style={{ fontSize: 9, padding: '2px 7px' }}>{n}</span>}
            </button>) })}
        </div>
        <div>
          <div className="card p-4 mb-4">
            <textarea className="input" placeholder={puede ? `Escribe en #${c.nombre}…` : `En #${c.nombre} solo publica dirección.`} value={texto} onChange={(e) => setTexto(e.target.value)} disabled={!puede} style={{ minHeight: 70 }} />
            <div className="flex justify-between items-center mt-2"><span className="text-xs text-dimmer">Texto o enlace. Las dudas de acceso y facturación, a soporte.</span><Btn size="sm" disabled={!puede || !texto.trim()} onClick={publicar}>Publicar</Btn></div>
            {error && <div className="mt-2"><Banner tone="red">{error}</Banner></div>}
          </div>
          <div className="flex flex-col gap-3">
            {rows.map((p) => <Publicacion key={p.id} p={p} />)}
            {!rows.length && <p className="text-dim">Nada en #{c.nombre} todavía.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
