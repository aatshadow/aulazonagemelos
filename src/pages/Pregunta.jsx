import { useState } from 'react'
import { Sparkles, Send } from 'lucide-react'
import { PageHeader, Card, Btn, Banner } from '../ui/index.jsx'
import { useData, hace } from '../data/store.jsx'

/* PREGUNTA A LA IA · cada pregunta se guarda en `preguntas_ia`. Hoy contesta con una respuesta de
   cortesía (la cuenta de Anthropic no tiene saldo); cuando la tenga, la respuesta la dará
   `api/pregunta` con el temario del aula como contexto. */
export default function Pregunta() {
  const { state, acciones } = useData()
  const [texto, setTexto] = useState('')
  const [error, setError] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const enviar = async (e) => { e.preventDefault(); if (!texto.trim()) return; setEnviando(true); try { await acciones.preguntar(texto.trim()); setTexto(''); setError(null) } catch (err) { setError(err.message) } setEnviando(false) }
  return (
    <div className="max-w-[820px]">
      <PageHeader kicker="Ayuda" title="Pregunta a la IA" sub="Pregunta sobre el temario. Las respuestas se quedan aquí, en tu historial." />
      <Card className="mb-4">
        {error && <Banner tone="red">{error}</Banner>}
        <form onSubmit={enviar} className="flex gap-2">
          <input className="input" placeholder="¿Qué quieres saber?" value={texto} onChange={(e) => setTexto(e.target.value)} />
          <Btn type="submit" disabled={!texto.trim() || enviando}><Send size={15} /></Btn>
        </form>
      </Card>
      <div className="flex flex-col gap-3">
        {state.preguntas.map((q) => (
          <Card key={q.id}>
            <div className="text-[15px] font-semibold">{q.pregunta}</div>
            <div className="text-dimmer text-xs mono mt-1">{hace(q.creado)}</div>
            <div className="mt-3 flex gap-3 items-start"><span className="avatar gold" style={{ width: 28, height: 28 }}><Sparkles size={13} /></span><p className="text-dim text-[14.5px] leading-relaxed">{q.respuesta || 'Sin respuesta todavía.'}</p></div>
          </Card>))}
        {!state.preguntas.length && <p className="text-dim">Todavía no has preguntado nada.</p>}
      </div>
    </div>
  )
}
