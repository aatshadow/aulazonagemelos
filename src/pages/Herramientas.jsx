import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Copy, Check, Sparkles, MessageSquare, RefreshCw, Bookmark, Trash2, Handshake, Link2, Plus, Gift, CalendarCheck, Clock, Users } from 'lucide-react'
import { PageHeader, Tag, Btn, Card, Banner, Stat, Field } from '../ui/index.jsx'
import { Candado } from '../ui/acceso.jsx'
import { cn } from '../utils/cn.js'
import { useData, fmtFecha, fmtHora } from '../data/store.jsx'
import { NICHOS, nichoDe } from '../data/programa.js'
import { MOMENTOS, CANALES, TONOS, AVISO, IA_CFG, pedirIA, TIPOS_CONTENIDO, BONUS_TODOS, BONUS_RAPIDEZ, huecosEjemplo } from '../data/herramientas.js'

/* LAS HERRAMIENTAS · cada una se abre a su debido tiempo (DESBLOQUEO en programa.js) y enlaza con la comunidad de afiliados. */

function Copiar({ texto, className }) {
  const [ok, setOk] = useState(false)
  return <button className={cn('btn ghost sm', className)} onClick={() => { navigator.clipboard?.writeText(texto).catch(() => {}); setOk(true); setTimeout(() => setOk(false), 1600) }}>{ok ? <><Check size={14} /> Copiado</> : <><Copy size={14} /> Copiar</>}</button>
}
function Comunidad({ canal = 'wins', texto }) {
  return <Link to={`/comunidad/${canal}`} className="card hover p-4 flex items-center gap-3 mt-8"><span className="avatar gold" style={{ width: 36, height: 36 }}><MessageSquare size={16} /></span><div className="flex-1 text-[14.5px]">{texto}</div><span className="text-gold-2 text-[13.5px]">#{canal} →</span></Link>
}
function Chips({ valor, set, opciones, todos }) {
  return <div className="flex flex-wrap gap-2">{todos && <button className={cn('chip', !valor && 'on')} onClick={() => set('')}>{todos}</button>}{opciones.map((o) => <button key={o.id} className={cn('chip', valor === o.id && 'on')} onClick={() => set(o.id)}>{o.nombre}</button>)}</div>
}
const ejemplo = <Tag tone="grey">Ejemplo</Tag>

/* ---------- 1 · Plantillas de mensajes ---------- */
export function Plantillas() {
  const { state: s } = useData()
  const [nicho, setNicho] = useState(s.nicho || ''); const [momento, setMomento] = useState('')
  const lista = s.plantillas.filter((p) => (!nicho || !p.nicho || p.nicho === nicho) && (!momento || p.momento === momento))
  return (
    <div>
      <PageHeader kicker="Herramientas" title="Plantillas de mensajes" sub="Mensajes probados para cerrar ventas y llevar a la gente a tu enlace de afiliado. Cópialos, cambia lo que va entre llaves y mándalos." right={<Link to="/ia/mensajes" className="btn primary"><Sparkles size={15} /> Crear con la IA</Link>} />
      <Candado req="plantillas">
        <Banner>Estas plantillas son de ejemplo hasta que el equipo cargue las reales.</Banner>
        <div className="flex flex-col gap-2 mb-5"><Chips valor={nicho} set={setNicho} opciones={NICHOS} todos="Todos los nichos" /><Chips valor={momento} set={setMomento} opciones={MOMENTOS} todos="Todos los momentos" /></div>
        <div className="grid gap-3 md:grid-cols-2">
          {lista.map((p) => { const txt = p.texto.replaceAll('{aviso}', AVISO[p.nicho || nicho] || ''); return (
            <Card key={p.id} className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2"><Tag>{MOMENTOS.find((m) => m.id === p.momento).nombre}</Tag>{p.nicho ? <Tag tone="grey">{nichoDe(p.nicho).nombre}</Tag> : <Tag tone="grey">Todos los nichos</Tag>}{p.ejemplo && ejemplo}</div>
              <b className="text-[16px]">{p.titulo}</b>
              <p className="text-[14.5px] text-dim whitespace-pre-line bg-black/40 rounded-[12px] p-3 border border-line-soft">{txt}</p>
              <div className="flex gap-2 mt-auto"><Copiar texto={txt} /><Link to={`/ia/mensajes?momento=${p.momento}`} className="btn ghost sm"><Sparkles size={14} /> Adaptar con la IA</Link></div>
            </Card>) })}
          {!lista.length && <p className="text-dim">No hay plantillas con ese filtro.</p>}
        </div>
        <Comunidad canal="wins" texto="¿Un mensaje te ha cerrado una venta? Compártelo (sin datos de nadie) para que lo usen los demás." />
      </Candado>
    </div>
  )
}

/* ---------- 2 · Contenido que vende ---------- */
export function ContenidoVende() {
  const { state: s } = useData()
  const [nicho, setNicho] = useState(s.nicho || '')
  const lista = s.formatos.filter((f) => !nicho || !f.nicho || f.nicho === nicho)
  return (
    <div>
      <PageHeader kicker="Herramientas" title="Contenido que vende" sub="Formatos y ejemplos de contenido que ya está generando comisiones. Elige uno y créalo sin cara con la IA de contenido." right={<Link to="/ia/contenido" className="btn primary"><Sparkles size={15} /> IA de contenido</Link>} />
      <Candado req="contenidoVende">
        <Banner>Formatos de ejemplo: los ejemplos reales que ya están generando comisiones los sube el equipo.</Banner>
        <div className="mb-5"><Chips valor={nicho} set={setNicho} opciones={NICHOS} todos="Todos los nichos" /></div>
        <div className="grid gap-3 md:grid-cols-3">
          {lista.map((f) => (
            <Card key={f.id} className="flex flex-col gap-3 p-0 overflow-hidden">
              <div className="ph" style={{ aspectRatio: '16 / 10', borderRadius: 0, border: 0, borderBottom: '1px solid var(--color-line-soft)' }}>{f.tipo}<br />ejemplo por subir</div>
              <div className="px-5 pb-5 flex flex-col gap-2">
                <div className="flex flex-wrap gap-2"><Tag>{f.tipo}</Tag>{f.nicho && <Tag tone="grey">{nichoDe(f.nicho).nombre}</Tag>}{f.ejemplo && ejemplo}</div>
                <b className="text-[16px]">{f.titulo}</b>
                <p className="text-dim text-[14px]">{f.desc}</p>
                <ol className="text-[13.5px] text-dim list-decimal pl-5">{f.estructura.map((e) => <li key={e}>{e}</li>)}</ol>
                <Link to={`/ia/contenido?formato=${encodeURIComponent(f.titulo)}`} className="btn outline sm mt-2 self-start"><Sparkles size={14} /> Crear este formato</Link>
              </div>
            </Card>))}
        </div>
        <Comunidad canal="wins" texto="Publica tu contenido y enséñalo: lo que funciona en un nicho sirve a los demás." />
      </Candado>
    </div>
  )
}

/* ---------- 3 · Deals con las plataformas ---------- */
export function Deals() {
  const { state: s, acciones } = useData()
  const [nicho, setNicho] = useState(s.nicho || '')
  const lista = s.deals.filter((d) => !nicho || d.nicho === nicho)
  const sol = (id) => s.solicitudesDeal.find((x) => x.deal === id)
  return (
    <div>
      <PageHeader kicker="Herramientas" title="Deals con las plataformas" sub="Acuerdos negociados por los gemelos, con mejores comisiones que las estándar. Pide tu enlace y el equipo te lo activa." />
      <Candado req="deals">
        <Banner>Plataformas y condiciones de ejemplo: las comisiones de cada acuerdo ⇢ pendientes hasta que el equipo cargue los reales.</Banner>
        <div className="mb-5"><Chips valor={nicho} set={setNicho} opciones={NICHOS} todos="Todos los nichos" /></div>
        <div className="grid gap-3 md:grid-cols-2">
          {lista.map((d) => { const x = sol(d.id); return (
            <Card key={d.id} className="flex flex-col gap-3">
              <div className="flex items-center gap-3"><span className="avatar gold" style={{ width: 42, height: 42 }}><Handshake size={18} /></span><div className="flex-1"><b className="text-[17px]">{d.plataforma}</b><div className="text-dimmer text-[13px]">{nichoDe(d.nicho).nombre} · {d.modelo}</div></div>{d.ejemplo && ejemplo}</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-[12px] bg-black/40 border border-line-soft p-3"><div className="text-dimmer text-[11.5px]">Comisión del deal</div><div className="text-[15px] mt-0.5">{d.comision || '⇢ pendiente'}</div></div>
                <div className="rounded-[12px] bg-black/40 border border-line-soft p-3"><div className="text-dimmer text-[11.5px]">Comisión estándar</div><div className="text-[15px] mt-0.5">⇢ pendiente</div></div>
              </div>
              <ul className="text-[13.5px] text-dim flex flex-col gap-1">{d.condiciones.map((c) => <li key={c}>· {c}</li>)}</ul>
              <div className="mt-auto flex flex-wrap items-center gap-2">
                {!x && <Btn size="sm" onClick={() => acciones.solicitarDeal(d.id)}><Link2 size={14} /> Solicitar mi enlace</Btn>}
                {x?.estado === 'pendiente' && <Tag><Clock size={11} /> Solicitado · el equipo te lo activa</Tag>}
                {x?.estado === 'activo' && <><Tag tone="green"><Check size={11} /> Activo</Tag><code className="text-[12.5px] text-gold-2 break-all">{x.enlace}</code>{x.enlace && <Copiar texto={x.enlace} />}</>}
                {x?.estado === 'rechazado' && <><Tag tone="red">No aprobado</Tag><Btn size="sm" tone="ghost" onClick={() => acciones.solicitarDeal(d.id)}>Volver a pedir</Btn></>}
              </div>
            </Card>) })}
        </div>
        <Comunidad canal="dudas" texto="¿Dudas con las condiciones de un deal? Pregunta en la comunidad o abre un ticket." />
      </Candado>
    </div>
  )
}

/* ---------- 4 y 5 · La IA (mensajes y contenido) ---------- */
function Generador({ tipo }) {
  const { state: s, acciones } = useData()
  const q = new URLSearchParams(location.search)
  const [p, setP] = useState({ nicho: s.nicho || 'trading', canal: 'Instagram', tono: 'cercano', momento: q.get('momento') || 'contacto', tipo: 'guion', producto: '', beneficio: '', nombre: '', tema: q.get('formato') || '' })
  const [res, setRes] = useState(''); const [cargando, setCargando] = useState(false); const [v, setV] = useState(0); const [guardado, setGuardado] = useState(false)
  const set = (k) => (e) => setP({ ...p, [k]: e.target ? e.target.value : e })
  const generar = async (n = v) => { setCargando(true); setGuardado(false); try { setRes(await pedirIA(tipo, { ...p, plantillas: s.plantillas }, n)) } finally { setCargando(false) } }
  const mios = s.guardados.filter((g) => g.tipo === tipo)
  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <Card className="flex flex-col gap-1 self-start">
        <Field label="Nicho"><Chips valor={p.nicho} set={set('nicho')} opciones={NICHOS} /></Field>
        <Field label="Dónde lo vas a usar"><select className="input" value={p.canal} onChange={set('canal')}>{CANALES.map((c) => <option key={c}>{c}</option>)}</select></Field>
        {tipo === 'mensaje'
          ? <Field label="Momento"><select className="input" value={p.momento} onChange={set('momento')}>{MOMENTOS.map((m) => <option key={m.id} value={m.id}>{m.nombre}</option>)}</select></Field>
          : <Field label="Formato"><select className="input" value={p.tipo} onChange={set('tipo')}>{TIPOS_CONTENIDO.map((m) => <option key={m.id} value={m.id}>{m.nombre}</option>)}</select></Field>}
        <Field label="Tono"><Chips valor={p.tono} set={set('tono')} opciones={TONOS} /></Field>
        {tipo === 'mensaje'
          ? <><Field label="Producto o plataforma"><input className="input" value={p.producto} onChange={set('producto')} placeholder="p. ej. el nombre de la plataforma" /></Field>
              <Field label="Qué le aporta (en una frase)"><input className="input" value={p.beneficio} onChange={set('beneficio')} placeholder="p. ej. te enseña paso a paso" /></Field>
              <Field label="Nombre de la persona (opcional)"><input className="input" value={p.nombre} onChange={set('nombre')} placeholder="Laura" /></Field></>
          : <Field label="Tema (opcional)"><input className="input" value={p.tema} onChange={set('tema')} placeholder="p. ej. empezar a operar con poco" /></Field>}
        <Btn className="mt-2" onClick={() => { setV(0); generar(0) }} disabled={cargando}><Sparkles size={15} /> {cargando ? 'Creando…' : res ? 'Crear de nuevo' : 'Crear'}</Btn>
        <p className="text-dimmer text-[12px] mt-2">{IA_CFG.endpoint ? 'Conectada a la IA.' : 'Vista previa: genera con plantillas locales. ⇢ Pendiente: conectar la API de la IA.'}</p>
      </Card>
      <div className="flex flex-col gap-4 min-w-0">
        <Card className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2"><b className="text-[16px]">Resultado</b>{res && <Tag tone="grey">Edítalo antes de usarlo</Tag>}</div>
          {res ? <textarea className="input" style={{ minHeight: 260, fontSize: 15, lineHeight: 1.55 }} value={res} onChange={(e) => setRes(e.target.value)} />
            : <div className="ph" style={{ minHeight: 260 }}>{cargando ? 'Creando…' : 'Rellena el formulario y pulsa «Crear».'}</div>}
          {res && <div className="flex flex-wrap gap-2"><Copiar texto={res} /><button className="btn ghost sm" onClick={() => { const n = v + 1; setV(n); generar(n) }}><RefreshCw size={14} /> Otra versión</button><button className="btn ghost sm" disabled={guardado} onClick={() => { acciones.guardarIA({ tipo, texto: res, nicho: p.nicho }); setGuardado(true) }}><Bookmark size={14} /> {guardado ? 'Guardado' : 'Guardar'}</button></div>}
        </Card>
        {mios.length > 0 && <div><h2 className="text-[20px] mb-3">Guardados · {mios.length}</h2><div className="flex flex-col gap-2">{mios.map((g) => (
          <Card key={g.id} className="py-4"><div className="flex items-center gap-2 mb-2 text-dimmer text-[12.5px]">{fmtFecha(g.en)} · {nichoDe(g.nicho)?.nombre}<span className="ml-auto flex gap-1"><Copiar texto={g.texto} /><button className="btn ghost sm" onClick={() => acciones.borrarIA(g.id)}><Trash2 size={14} /></button></span></div><p className="text-[14px] text-dim whitespace-pre-line line-clamp-4">{g.texto}</p></Card>))}</div></div>}
      </div>
    </div>
  )
}
export function IAMensajes() {
  return (
    <div>
      <PageHeader kicker="Herramientas · IA" title="IA que te crea los mensajes" sub="Herramienta que redacta tus mensajes de venta por ti: eliges nicho, canal, momento y tono, y la ajustas a tu caso." right={<Link to="/plantillas" className="btn ghost">Ver plantillas</Link>} />
      <Candado req="iaMensajes"><Generador tipo="mensaje" /><Comunidad canal="dudas" texto="¿No te convence un mensaje? Pide ayuda en la comunidad o tráelo al directo." /></Candado>
    </div>
  )
}
export function IAContenido() {
  return (
    <div>
      <PageHeader kicker="Bonus · IA" title="IA que te crea contenido" sub="Genera guiones, textos y piezas sin cara listos para publicar." right={<Link to="/contenido" className="btn ghost">Ver formatos</Link>} />
      <Candado req="iaContenido"><Generador tipo="contenido" /><Comunidad canal="wins" texto="Cuando lo publiques, enséñalo en #wins." /></Candado>
    </div>
  )
}

/* ---------- 6 · Mis comisiones ---------- */
const eur = (n) => (+n || 0).toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
export function Comisiones() {
  const { state: s, acciones } = useData()
  const { enlaces, apuntes } = s.comisiones
  const [e, setE] = useState({ plataforma: '', nicho: s.nicho || 'trading', url: '' })
  const mesHoy = new Date().toISOString().slice(0, 7)
  const [a, setA] = useState({ enlace: '', mes: mesHoy, clics: '', conversiones: '', comision: '' })
  const tot = apuntes.reduce((t, x) => ({ clics: t.clics + (+x.clics || 0), conv: t.conv + (+x.conversiones || 0), com: t.com + (+x.comision || 0) }), { clics: 0, conv: 0, com: 0 })
  const meses = useMemo(() => { const m = {}; apuntes.forEach((x) => { m[x.mes] = (m[x.mes] || 0) + (+x.comision || 0) }); return Object.entries(m).sort() }, [apuntes])
  const max = Math.max(1, ...meses.map(([, v]) => v))
  const deals = s.solicitudesDeal.filter((x) => x.estado === 'activo')
  return (
    <div>
      <PageHeader kicker="Herramientas" title="Mis comisiones" sub="Apunta tus enlaces de afiliado y lo que te dan cada mes. Es tu hoja de dinero: lo que no se mide no se puede escalar." />
      <Candado req="comisiones">
        <div className="grid gap-3 grid-cols-2 md:grid-cols-4 mb-6">
          <Stat label="Comisiones apuntadas" value={eur(tot.com)} tone="gold" />
          <Stat label="Conversiones" value={tot.conv} />
          <Stat label="Clics" value={tot.clics} />
          <Stat label="Conversión" value={tot.clics ? ((tot.conv / tot.clics) * 100).toFixed(1) + ' %' : '—'} />
        </div>
        {meses.length > 0 && <Card className="mb-6"><b className="text-[15px]">Por mes</b><div className="flex items-end gap-3 h-[150px] mt-4">{meses.map(([m, v]) => <div key={m} className="flex-1 flex flex-col items-center gap-1.5 min-w-0"><span className="text-[12px] text-dim">{eur(v)}</span><div className="w-full rounded-t-[8px]" style={{ height: `${(v / max) * 100}px`, background: 'linear-gradient(180deg, var(--color-gold-2), var(--color-gold-deep))' }} /><span className="text-[11.5px] text-dimmer">{new Date(m + '-01').toLocaleDateString('es-ES', { month: 'short', year: '2-digit' })}</span></div>)}</div></Card>}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <b className="text-[16px]">Mis enlaces · {enlaces.length}</b>
            <div className="flex flex-col gap-2 mt-3">
              {enlaces.map((x) => <div key={x.id} className="flex items-center gap-3 rounded-[12px] bg-black/40 border border-line-soft p-3"><Link2 size={15} className="text-gold" /><div className="flex-1 min-w-0"><div className="text-[14.5px]">{x.plataforma} <span className="text-dimmer text-[12.5px]">· {nichoDe(x.nicho).nombre}</span></div><div className="text-dimmer text-[12px] truncate">{x.url || 'sin URL'}</div></div><button className="btn ghost sm" onClick={() => acciones.borrarEnlace(x.id)}><Trash2 size={14} /></button></div>)}
              {!enlaces.length && <p className="text-dim text-[14px]">Aún no has apuntado ningún enlace.</p>}
            </div>
            {deals.length > 0 && <p className="text-dimmer text-[12.5px] mt-3">Tienes {deals.length} deal(s) activos en <Link to="/deals" className="text-gold-2">Deals</Link>: apúntalos aquí.</p>}
            <div className="regla mt-4 pt-4 grid gap-2 sm:grid-cols-2">
              <input className="input" placeholder="Plataforma" value={e.plataforma} onChange={(x) => setE({ ...e, plataforma: x.target.value })} />
              <select className="input" value={e.nicho} onChange={(x) => setE({ ...e, nicho: x.target.value })}>{NICHOS.map((n) => <option key={n.id} value={n.id}>{n.nombre}</option>)}</select>
              <input className="input sm:col-span-2" placeholder="Tu enlace de afiliado (opcional)" value={e.url} onChange={(x) => setE({ ...e, url: x.target.value })} />
              <Btn size="sm" className="sm:col-span-2" disabled={!e.plataforma.trim()} onClick={() => { acciones.nuevoEnlace({ ...e, plataforma: e.plataforma.trim() }); setE({ ...e, plataforma: '', url: '' }) }}><Plus size={14} /> Añadir enlace</Btn>
            </div>
          </Card>
          <Card>
            <b className="text-[16px]">Apuntar resultados</b>
            {enlaces.length ? <div className="grid gap-2 sm:grid-cols-2 mt-3">
              <select className="input sm:col-span-2" value={a.enlace} onChange={(x) => setA({ ...a, enlace: x.target.value })}><option value="">Elige el enlace…</option>{enlaces.map((x) => <option key={x.id} value={x.id}>{x.plataforma}</option>)}</select>
              <input className="input" type="month" value={a.mes} onChange={(x) => setA({ ...a, mes: x.target.value })} />
              <input className="input" type="number" min="0" placeholder="Clics" value={a.clics} onChange={(x) => setA({ ...a, clics: x.target.value })} />
              <input className="input" type="number" min="0" placeholder="Conversiones" value={a.conversiones} onChange={(x) => setA({ ...a, conversiones: x.target.value })} />
              <input className="input" type="number" min="0" placeholder="Comisión (€)" value={a.comision} onChange={(x) => setA({ ...a, comision: x.target.value })} />
              <Btn size="sm" className="sm:col-span-2" disabled={!a.enlace} onClick={() => { acciones.nuevoApunte(a); setA({ ...a, clics: '', conversiones: '', comision: '' }) }}><Plus size={14} /> Apuntar</Btn>
            </div> : <p className="text-dim text-[14px] mt-3">Primero añade un enlace.</p>}
            <div className="flex flex-col gap-1.5 mt-4">{[...apuntes].reverse().map((x) => { const en = enlaces.find((k) => k.id === x.enlace); return <div key={x.id} className="flex items-center gap-3 text-[13.5px] border-b border-line-soft py-2"><span className="text-dimmer w-[64px]">{x.mes}</span><span className="flex-1 truncate">{en?.plataforma}</span><span className="text-dim">{x.clics || 0} clics · {x.conversiones || 0} conv.</span><b className="text-gold-2">{eur(x.comision)}</b><button className="text-dimmer" onClick={() => acciones.borrarApunte(x.id)}><Trash2 size={13} /></button></div> })}</div>
          </Card>
        </div>
        <Comunidad canal="wins" texto="¿Primera comisión? Súbela a #wins con la captura: es la prueba para subir de rango." />
      </Candado>
    </div>
  )
}

/* ---------- 7 · Mis bonus ---------- */
export function Bonus() {
  const { state: s, acciones } = useData()
  const nivel = s.bonusRapidez
  const tiene = BONUS_RAPIDEZ.filter((b) => nivel && nivel <= b.hasta)
  const [abierto, setAbierto] = useState(null)
  return (
    <div>
      <PageHeader kicker="Tu compra" title="Mis bonus" sub="Lo que te llevas además de la formación." />
      <div className="flex flex-wrap items-center gap-2 mb-6 text-[13px] text-dim"><span className="tag grey">vista previa</span> Simular que entró entre los primeros:
        {[[null, 'Sin bonus por rapidez'], [20, '20 primeros'], [10, '10 primeros'], [5, '5 primeros']].map(([n, t]) => <button key={t} className={cn('chip', nivel === n && 'on')} onClick={() => acciones.nivelBonus(n)}>{t}</button>)}</div>

      <h2 className="text-[22px] mb-3">Bonus para todos</h2>
      <div className="grid gap-3 md:grid-cols-2 mb-10">
        {BONUS_TODOS.map((b) => <Link key={b.id} to={b.to} className="card hover p-5 flex items-center gap-4"><span className="avatar gold" style={{ width: 44, height: 44 }}>{b.id === 'comunidad' ? <Users size={18} /> : <Sparkles size={18} />}</span><div><b className="text-[16.5px]">{b.nombre}</b><p className="text-dim text-[14px]">{b.desc}</p></div></Link>)}
      </div>

      <h2 className="text-[22px] mb-1">Bonus por rapidez</h2>
      <p className="text-dim text-[14px] mb-4">Solo para los primeros en entrar. {tiene.length ? `Tienes ${tiene.length}.` : 'Esta vez no entraste entre los primeros.'}</p>
      <div className="grid gap-3 md:grid-cols-3">
        {BONUS_RAPIDEZ.map((b) => { const ok = tiene.includes(b); const r = s.reservasBonus[b.id]; return (
          <Card key={b.id} className={cn('flex flex-col gap-3', ok ? 'gold' : 'opacity-50')}>
            <div className="flex items-center gap-2"><span className="num font-extrabold text-[30px] text-gold-2 leading-none">{b.hasta}</span><span className="text-dimmer text-[13px]">primeros</span>{ok ? <Tag tone="gold" className="ml-auto"><Gift size={11} /> Lo tienes</Tag> : <Tag tone="grey" className="ml-auto">No incluido</Tag>}</div>
            <b className="text-[16.5px]">{b.nombre}</b>
            <p className="text-dim text-[13.5px]">{b.desc}</p>
            {b.pendiente && <span className="text-[12px] text-dimmer">⇢ pendiente: {b.pendiente}</span>}
            {ok && <div className="mt-auto">
              {!r && b.huecos && (abierto === b.id
                ? <div className="flex flex-col gap-2">{huecosEjemplo(b.id).map((h) => <button key={h} className="chip" onClick={() => { acciones.reservarBonus(b.id, 'reservado', h); setAbierto(null) }}>{fmtFecha(h, { weekday: 'short' })} · {fmtHora(h)}</button>)}<span className="text-dimmer text-[11.5px]">Huecos de ejemplo ⇢ los pone el equipo.</span></div>
                : <Btn size="sm" onClick={() => setAbierto(b.id)}><CalendarCheck size={14} /> Reservar</Btn>)}
              {!r && !b.huecos && <Btn size="sm" onClick={() => acciones.reservarBonus(b.id, 'contacto')}>Quiero que me contactéis</Btn>}
              {r?.estado === 'reservado' && <Tag tone="green"><Check size={11} /> Reservado · {fmtFecha(r.cuando, { weekday: 'short' })} {fmtHora(r.cuando)}</Tag>}
              {r?.estado === 'contacto' && <Tag><Clock size={11} /> El equipo te contacta</Tag>}
              {r?.estado === 'hecho' && <Tag tone="green"><Check size={11} /> Hecho</Tag>}
            </div>}
          </Card>) })}
      </div>
    </div>
  )
}
