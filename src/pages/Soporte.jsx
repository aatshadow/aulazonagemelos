import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Send, LifeBuoy, ChevronLeft, CheckCircle2 } from 'lucide-react'
import { PageHeader, Btn, Avatar, Card, Field, Tag, Banner } from '../ui/index.jsx'
import { useData, hace } from '../data/store.jsx'
import { cn } from '../utils/cn.js'

/* SOPORTE DIRECTO · una conversación con el equipo, dentro del aula (orden de Alex, 18-09: en vez
   de la IA). En producción cada conversación avisa a Discord y el equipo contesta desde allí o desde
   aquí con `?rol=direccion`. Sin IA por medio. */
const ESTADO = { abierto: ['Esperando al equipo', 'grey'], respondido: ['Respondido', 'gold'], resuelto: ['Resuelto', 'green'] }

export default function Soporte() {
  const { id } = useParams()
  const nav = useNavigate()
  const { state, acciones, aula } = useData()
  const [asunto, setAsunto] = useState('')
  const [texto, setTexto] = useState('')
  const [resp, setResp] = useState('')
  const [error, setError] = useState(null)
  const equipo = state.rol === 'direccion'
  const soporteMail = aula.textos?.soporte
  const conv = state.soporte.find((c) => c.id === id)

  if (conv) {
    const [et, tono] = ESTADO[conv.estado] || ESTADO.abierto
    const enviar = async () => { if (!resp.trim()) return; try { await acciones.soporteMsg(conv.id, resp.trim()); setResp(''); setError(null) } catch (e) { setError(e.message) } }
    return (
      <div className="max-w-[820px]">
        <Link to="/soporte" className="inline-flex items-center gap-1 text-sm text-dim mb-3"><ChevronLeft size={14} /> Soporte directo</Link>
        <PageHeader kicker="Conversación" title={conv.asunto} right={<><Tag tone={tono}>{et}</Tag>{conv.estado !== 'resuelto' && equipo && <Btn tone="ghost" size="sm" onClick={() => acciones.soporteCerrar(conv.id).catch((e) => setError(e.message))}><CheckCircle2 size={14} /> Marcar resuelto</Btn>}</>} />
        {error && <Banner tone="red">{error}</Banner>}
        <Card className="flex flex-col gap-4">
          {conv.mensajes.map((m, i) => (
            <div key={i} className={cn('flex gap-3 max-w-[85%]', m.de === 'tu' && 'self-end flex-row-reverse')}>
              {m.de === 'tu' ? <Avatar name={conv.alumno || state.perfil?.nombre || state.alumno.nombre} size={32} gold /> : <span className="avatar" style={{ width: 32, height: 32 }}><LifeBuoy size={14} /></span>}
              <div>
                <div className={cn('rounded-[18px] px-4 py-3 text-[14.5px] leading-relaxed', m.de === 'tu' ? 'bg-gold text-on-gold' : 'bg-sur-top')}>{m.texto}</div>
                <div className={cn('text-[11px] text-dimmer mono mt-1', m.de === 'tu' && 'text-right')}>{m.de === 'tu' ? 'Tú' : m.autor || 'Equipo'} · {hace(m.en)}</div>
              </div>
            </div>))}
          {conv.estado !== 'resuelto' && (
            <form className="flex gap-2 mt-2 pt-4 border-t border-line-soft" onSubmit={(e) => { e.preventDefault(); enviar() }}>
              <input className="input" placeholder={equipo ? 'Responder como equipo…' : 'Escribe…'} value={resp} onChange={(e) => setResp(e.target.value)} />
              <Btn type="submit" disabled={!resp.trim()}><Send size={15} /></Btn>
            </form>)}
        </Card>
      </div>
    )
  }

  const abrir = async (e) => { e.preventDefault(); if (!asunto.trim() || !texto.trim()) return; try { await acciones.soporteNuevo(asunto.trim(), texto.trim()); setAsunto(''); setTexto(''); setError(null) } catch (err) { setError(err.message) } }
  return (
    <div>
      <PageHeader kicker="Ayuda" title="Soporte directo" sub="Escribe al equipo desde aquí: accesos, vídeos que no van, facturación, lo que sea. Te contestan en el mismo hilo." />
      <div className="grid gap-5 md:grid-cols-[1fr_1.2fr]">
        <Card className="h-fit">
          <div className="kicker mb-3">Nueva conversación</div>
          {error && <Banner tone="red">{error}</Banner>}
          <form onSubmit={abrir}>
            <Field label="Asunto"><input className="input" value={asunto} onChange={(e) => setAsunto(e.target.value)} placeholder="Qué pasa, en una línea" /></Field>
            <Field label="Cuéntanos"><textarea className="input" value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Dónde, desde cuándo, en qué dispositivo…" /></Field>
            <Btn type="submit" disabled={!asunto.trim() || !texto.trim()}><Send size={15} /> Enviar al equipo</Btn>
          </form>
          <p className="text-xs text-dimmer mt-4">{soporteMail && <>También por correo: <a className="text-gold-2" href={`mailto:${soporteMail}`}>{soporteMail}</a>. </>}Las dudas del temario, mejor en <Link to="/comunidad" className="text-gold-2">la comunidad</Link>.</p>
        </Card>
        <div>
          <div className="kicker mb-2">Tus conversaciones</div>
          <div className="flex flex-col gap-3">
            {state.soporte.map((c) => { const [et, tono] = ESTADO[c.estado] || ESTADO.abierto; const u = c.mensajes[c.mensajes.length - 1]; return (
              <button key={c.id} className="card hover p-4 text-left" onClick={() => nav(`/soporte/${c.id}`)}>
                <div className="flex items-center justify-between gap-3"><b className="text-[15px]">{equipo && c.alumno ? `${c.alumno} · ` : ''}{c.asunto}</b><Tag tone={tono}>{et}</Tag></div>
                <div className="text-dim text-[13.5px] mt-1 line-clamp-1">{u.de === 'tu' ? 'Tú: ' : 'Equipo: '}{u.texto}</div>
                <div className="text-dimmer text-[11px] mono mt-1">{c.mensajes.length} mensajes · {hace(u.en)}</div>
              </button>) })}
            {!state.soporte.length && <p className="text-dim">Sin conversaciones. Cuando escribas, aparece aquí.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
