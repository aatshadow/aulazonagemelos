/* DIRECCIÓN · operar el producto: programa (directos, grabaciones, novedades), herramientas (plantillas, formatos, deals y
   solicitudes de enlace), bonus por rapidez y métricas. Solo front: se guarda en el navegador y lo ve el alumno de la demo.
   Los alumnos de ejemplo salen de mock.js; su nicho, comisiones y bonus son EJEMPLO. */
import { useState } from 'react'
import { Plus, Trash2, Pencil, Check, X, Radio, Video, Megaphone, Handshake, MessagesSquare, Film, LifeBuoy } from 'lucide-react'
import { PageHeader, Card, Tag, Btn, Stat, Banner } from '../ui/index.jsx'
import { cn } from '../utils/cn.js'
import { useData, fmtFecha, fmtHora, directosDe, diaActual, accesoDe } from '../data/store.jsx'
import { FASES, NICHOS, faseDe, nichoDe, faseDeDia } from '../data/programa.js'
import { MOMENTOS, BONUS_RAPIDEZ } from '../data/herramientas.js'
import { alumnosDemo } from '../data/mock.js'

/* lo que no está en mock.js de los alumnos de ejemplo (EJEMPLO) */
const EXTRA = { a2: { nicho: 'casinos', comision: 640, bonus: 5 }, a3: { nicho: 'fitness', comision: 0, bonus: 20 }, a4: { nicho: 'trading', comision: 2150, bonus: 10 }, a5: { nicho: 'trading', comision: 0, bonus: null }, a6: { nicho: 'casinos', comision: 0, bonus: 20 } }
const faseAlumno = (dia, rango) => (rango >= 1 ? faseDe('escalar') : faseDeDia(Math.min(dia, 30)))
const ESTADOS_BONUS = ['pendiente', 'reservado', 'contacto', 'hecho']

/* la lista de alumnos que ve dirección: el de la demo (con su estado real) + los de ejemplo */
function alumnos(s) {
  const yo = { id: 'a1', nombre: s.perfil.nombre, dia: diaActual(s), rango: s.rango, nicho: s.nicho, comision: s.comisiones.apuntes.reduce((t, x) => t + (+x.comision || 0), 0), bonus: s.bonusRapidez, activo: true, demo: true }
  return [yo, ...alumnosDemo.filter((a) => a.id !== 'a1').map((a) => ({ ...a, ...EXTRA[a.id], ejemplo: true }))]
}

function Fila({ children, className }) { return <div className={cn('flex flex-wrap items-center gap-3 px-5 py-3.5 border-b border-line-soft last:border-0', className)}>{children}</div> }
const hoyISO = (h = 21) => { const d = new Date(Date.now() + 7 * 864e5); d.setHours(h, 0, 0, 0); return d.toISOString().slice(0, 16) }

/* ---------- Programa: directos, grabaciones, novedades ---------- */
export function DirPrograma() {
  const { state: s, acciones } = useData()
  const prox = directosDe(s).filter((d) => new Date(d.fecha) > Date.now() - 2 * 36e5).slice(0, 8)
  const [nuevo, setNuevo] = useState({ titulo: '', fecha: hoyISO(), fase: '', enlace: '' })
  const [edit, setEdit] = useState(null)
  const [grab, setGrab] = useState({ titulo: '', fase: '', nicho: '', dur: '', video_url: '' })
  const [nov, setNov] = useState({ titulo: '', texto: '', fase: '' })
  return (
    <div>
      <PageHeader kicker="Dirección" title="Programa" sub="Las 2 clases en directo de cada semana, las grabaciones y las novedades del programa." />
      <h2 className="text-[22px] mb-3 flex items-center gap-2"><Radio size={18} className="text-gold" /> Próximas clases en directo</h2>
      <Card className="p-0 overflow-hidden mb-4">
        {prox.map((d) => (
          <Fila key={d.id}>
            <div className="w-[120px] text-[13px] text-dim">{fmtFecha(d.fecha, { weekday: 'short' })} · {fmtHora(d.fecha)}</div>
            {edit?.id === d.id ? <>
              <input className="input flex-1 min-w-[180px]" value={edit.titulo} onChange={(e) => setEdit({ ...edit, titulo: e.target.value })} />
              <input className="input flex-1 min-w-[180px]" placeholder="Enlace del directo (Zoom, YouTube…)" value={edit.enlace || ''} onChange={(e) => setEdit({ ...edit, enlace: e.target.value })} />
              <Btn size="sm" onClick={() => { if (d.id.startsWith('dn')) acciones.guardarEn('directosNuevos', { ...d, titulo: edit.titulo, enlace: edit.enlace }); else acciones.editarDirecto(d.id, { titulo: edit.titulo, enlace: edit.enlace }); setEdit(null) }}><Check size={14} /></Btn>
              <Btn size="sm" tone="ghost" onClick={() => setEdit(null)}><X size={14} /></Btn>
            </> : <>
              <div className="flex-1 min-w-[200px]"><div className="text-[15px]">{d.titulo}</div><div className="text-dimmer text-[12.5px]">{d.tipo}{d.fase && ` · fase ${faseDe(d.fase).n}`}{d.ejemplo && ' · ejemplo'}</div></div>
              {d.enlace ? <Tag tone="green">Con enlace</Tag> : <Tag tone="red">Sin enlace</Tag>}
              <Btn size="sm" tone="ghost" onClick={() => setEdit({ id: d.id, titulo: d.titulo, enlace: d.enlace })}><Pencil size={14} /> Editar</Btn>
              <Btn size="sm" tone="ghost" onClick={() => { if (d.id.startsWith('dn')) acciones.borrarDe('directosNuevos', d.id); else acciones.editarDirecto(d.id, { cancelado: true }) }}><Trash2 size={14} /></Btn>
            </>}
          </Fila>))}
      </Card>
      <Card className="mb-10">
        <b className="text-[15px]">Crear una clase extra</b>
        <div className="grid gap-2 md:grid-cols-[2fr_1fr_1fr_2fr_auto] mt-3">
          <input className="input" placeholder="Título" value={nuevo.titulo} onChange={(e) => setNuevo({ ...nuevo, titulo: e.target.value })} />
          <input className="input" type="datetime-local" value={nuevo.fecha} onChange={(e) => setNuevo({ ...nuevo, fecha: e.target.value })} />
          <select className="input" value={nuevo.fase} onChange={(e) => setNuevo({ ...nuevo, fase: e.target.value })}><option value="">Sin fase</option>{FASES.map((f) => <option key={f.id} value={f.id}>{f.n} · {f.corto}</option>)}</select>
          <input className="input" placeholder="Enlace (opcional)" value={nuevo.enlace} onChange={(e) => setNuevo({ ...nuevo, enlace: e.target.value })} />
          <Btn disabled={!nuevo.titulo.trim()} onClick={() => { acciones.guardarEn('directosNuevos', { id: 'dn' + Date.now(), tipo: 'Clase extra', titulo: nuevo.titulo.trim(), fecha: new Date(nuevo.fecha).toISOString(), fase: nuevo.fase || null, enlace: nuevo.enlace }); setNuevo({ ...nuevo, titulo: '', enlace: '' }) }}><Plus size={14} /> Crear</Btn>
        </div>
      </Card>

      <h2 className="text-[22px] mb-3 flex items-center gap-2"><Video size={18} className="text-gold" /> Grabaciones · {s.grabaciones.length}</h2>
      <Card className="mb-4">
        <b className="text-[15px]">Subir una grabación</b>
        <div className="grid gap-2 md:grid-cols-3 mt-3">
          <input className="input md:col-span-2" placeholder="Título" value={grab.titulo} onChange={(e) => setGrab({ ...grab, titulo: e.target.value })} />
          <input className="input" placeholder="Duración (58:22)" value={grab.dur} onChange={(e) => setGrab({ ...grab, dur: e.target.value })} />
          <select className="input" value={grab.fase} onChange={(e) => setGrab({ ...grab, fase: e.target.value })}><option value="">Sin fase</option>{FASES.map((f) => <option key={f.id} value={f.id}>{f.n} · {f.corto}</option>)}</select>
          <select className="input" value={grab.nicho} onChange={(e) => setGrab({ ...grab, nicho: e.target.value })}><option value="">Todos los nichos</option>{NICHOS.map((n) => <option key={n.id} value={n.id}>{n.nombre}</option>)}</select>
          <input className="input" placeholder="URL del vídeo (embed)" value={grab.video_url} onChange={(e) => setGrab({ ...grab, video_url: e.target.value })} />
        </div>
        <Btn className="mt-3" size="sm" disabled={!grab.titulo.trim()} onClick={() => { acciones.guardarEn('grabaciones', { id: 'g' + Date.now(), ...grab, titulo: grab.titulo.trim(), fase: grab.fase || null, nicho: grab.nicho || null, fecha: new Date().toISOString() }); setGrab({ titulo: '', fase: '', nicho: '', dur: '', video_url: '' }) }}><Plus size={14} /> Publicar grabación</Btn>
      </Card>
      <Card className="p-0 overflow-hidden mb-10">{[...s.grabaciones].sort((a, b) => (a.fecha < b.fecha ? 1 : -1)).slice(0, 6).map((g) => <Fila key={g.id}><div className="flex-1 min-w-[200px] text-[14.5px]">{g.titulo}<div className="text-dimmer text-[12px]">{fmtFecha(g.fecha)} · {g.dur || '—'}{g.ejemplo && ' · ejemplo'}</div></div>{g.video_url ? <Tag tone="green">Con vídeo</Tag> : <Tag tone="grey">Sin vídeo</Tag>}<Btn size="sm" tone="ghost" onClick={() => acciones.borrarDe('grabaciones', g.id)}><Trash2 size={14} /></Btn></Fila>)}</Card>

      <h2 className="text-[22px] mb-3 flex items-center gap-2"><Megaphone size={18} className="text-gold" /> Novedades</h2>
      <Card>
        <div className="grid gap-2 md:grid-cols-[2fr_1fr] ">
          <input className="input" placeholder="Qué se ha añadido o actualizado" value={nov.titulo} onChange={(e) => setNov({ ...nov, titulo: e.target.value })} />
          <select className="input" value={nov.fase} onChange={(e) => setNov({ ...nov, fase: e.target.value })}><option value="">Sin fase</option>{FASES.map((f) => <option key={f.id} value={f.id}>{f.n} · {f.corto}</option>)}</select>
          <textarea className="input md:col-span-2" placeholder="Detalle en una o dos frases" value={nov.texto} onChange={(e) => setNov({ ...nov, texto: e.target.value })} />
        </div>
        <Btn className="mt-3" size="sm" disabled={!nov.titulo.trim()} onClick={() => { acciones.guardarEn('novedades', { id: 'n' + Date.now(), ...nov, fase: nov.fase || null, fecha: new Date().toISOString() }); setNov({ titulo: '', texto: '', fase: '' }) }}><Plus size={14} /> Publicar novedad</Btn>
      </Card>
    </div>
  )
}

/* ---------- Herramientas: plantillas, formatos, deals, solicitudes ---------- */
export function DirHerramientas() {
  const { state: s, acciones } = useData()
  const [tab, setTab] = useState('deals')
  const [p, setP] = useState({ titulo: '', momento: 'contacto', nicho: '', texto: '' })
  const [f, setF] = useState({ titulo: '', tipo: 'Vídeo sin cara', nicho: '', desc: '', estructura: '' })
  const [d, setD] = useState({ plataforma: '', nicho: 'trading', modelo: 'CPA', comision: '', condiciones: '' })
  const [enlaces, setEnlaces] = useState({})
  const sol = s.solicitudesDeal.filter((x) => x.estado === 'pendiente')
  const TABS = [['deals', 'Deals', Handshake, sol.length], ['plantillas', 'Plantillas', MessagesSquare], ['formatos', 'Contenido que vende', Film]]
  return (
    <div>
      <PageHeader kicker="Dirección" title="Herramientas" sub="Lo que el alumno usa a diario: deals con las plataformas, plantillas de mensajes y formatos de contenido." />
      <div className="flex flex-wrap gap-2 mb-6">{TABS.map(([k, t, I, n]) => <button key={k} className={cn('chip', tab === k && 'on')} onClick={() => setTab(k)}><I size={13} /> {t}{n ? ` · ${n}` : ''}</button>)}</div>

      {tab === 'deals' && <>
        <h2 className="text-[20px] mb-3">Solicitudes de enlace · {sol.length}</h2>
        <Card className="p-0 overflow-hidden mb-8">
          {sol.map((x) => { const deal = s.deals.find((k) => k.id === x.deal); return (
            <Fila key={x.deal}><div className="flex-1 min-w-[180px]"><b className="text-[14.5px]">{x.alumno}</b> pide <b>{deal?.plataforma}</b><div className="text-dimmer text-[12px]">{fmtFecha(x.en)} · {nichoDe(deal?.nicho)?.nombre}</div></div>
              <input className="input max-w-[300px]" placeholder="Su enlace de afiliado" value={enlaces[x.deal] || ''} onChange={(e) => setEnlaces({ ...enlaces, [x.deal]: e.target.value })} />
              <Btn size="sm" disabled={!enlaces[x.deal]} onClick={() => acciones.responderDeal(x.deal, 'activo', enlaces[x.deal])}><Check size={14} /> Activar</Btn>
              <Btn size="sm" tone="ghost" onClick={() => acciones.responderDeal(x.deal, 'rechazado')}><X size={14} /> No aprobar</Btn></Fila>) })}
          {!sol.length && <p className="text-dim p-5">No hay solicitudes pendientes.</p>}
        </Card>
        <h2 className="text-[20px] mb-3">Deals · {s.deals.length}</h2>
        <Card className="p-0 overflow-hidden mb-4">{s.deals.map((x) => <Fila key={x.id}><div className="flex-1 min-w-[180px]"><b className="text-[14.5px]">{x.plataforma}</b> <span className="text-dimmer text-[12.5px]">· {nichoDe(x.nicho).nombre} · {x.modelo}</span></div><span className="text-[13.5px]">{x.comision || 'Comisión ⇢ pendiente'}</span>{x.ejemplo && <Tag tone="grey">Ejemplo</Tag>}<Btn size="sm" tone="ghost" onClick={() => acciones.borrarDe('deals', x.id)}><Trash2 size={14} /></Btn></Fila>)}</Card>
        <Card><b className="text-[15px]">Añadir un deal</b>
          <div className="grid gap-2 md:grid-cols-4 mt-3">
            <input className="input" placeholder="Plataforma" value={d.plataforma} onChange={(e) => setD({ ...d, plataforma: e.target.value })} />
            <select className="input" value={d.nicho} onChange={(e) => setD({ ...d, nicho: e.target.value })}>{NICHOS.map((n) => <option key={n.id} value={n.id}>{n.nombre}</option>)}</select>
            <input className="input" placeholder="Modelo (CPA, RevShare…)" value={d.modelo} onChange={(e) => setD({ ...d, modelo: e.target.value })} />
            <input className="input" placeholder="Comisión del deal" value={d.comision} onChange={(e) => setD({ ...d, comision: e.target.value })} />
            <textarea className="input md:col-span-4" placeholder="Condiciones, una por línea (geos, tráfico permitido, pago…)" value={d.condiciones} onChange={(e) => setD({ ...d, condiciones: e.target.value })} />
          </div>
          <Btn className="mt-3" size="sm" disabled={!d.plataforma.trim()} onClick={() => { acciones.guardarEn('deals', { id: 'd' + Date.now(), ...d, plataforma: d.plataforma.trim(), comision: d.comision || null, condiciones: d.condiciones.split('\n').map((x) => x.trim()).filter(Boolean) }); setD({ ...d, plataforma: '', comision: '', condiciones: '' }) }}><Plus size={14} /> Añadir deal</Btn></Card>
      </>}

      {tab === 'plantillas' && <>
        <Card className="mb-4"><b className="text-[15px]">Nueva plantilla</b>
          <div className="grid gap-2 md:grid-cols-3 mt-3">
            <input className="input" placeholder="Título" value={p.titulo} onChange={(e) => setP({ ...p, titulo: e.target.value })} />
            <select className="input" value={p.momento} onChange={(e) => setP({ ...p, momento: e.target.value })}>{MOMENTOS.map((m) => <option key={m.id} value={m.id}>{m.nombre}</option>)}</select>
            <select className="input" value={p.nicho} onChange={(e) => setP({ ...p, nicho: e.target.value })}><option value="">Todos los nichos</option>{NICHOS.map((n) => <option key={n.id} value={n.id}>{n.nombre}</option>)}</select>
            <textarea className="input md:col-span-3" placeholder="Texto. Usa {nombre}, {producto}, {beneficio}, {enlace} y {aviso}." value={p.texto} onChange={(e) => setP({ ...p, texto: e.target.value })} />
          </div>
          <Btn className="mt-3" size="sm" disabled={!p.titulo.trim() || !p.texto.trim()} onClick={() => { acciones.guardarEn('plantillas', { id: 'm' + Date.now(), ...p, nicho: p.nicho || null }); setP({ ...p, titulo: '', texto: '' }) }}><Plus size={14} /> Añadir plantilla</Btn></Card>
        <Card className="p-0 overflow-hidden">{s.plantillas.map((x) => <Fila key={x.id}><div className="flex-1 min-w-[200px]"><b className="text-[14.5px]">{x.titulo}</b><div className="text-dimmer text-[12.5px] line-clamp-1">{x.texto}</div></div><Tag>{MOMENTOS.find((m) => m.id === x.momento)?.nombre}</Tag><Tag tone="grey">{x.nicho ? nichoDe(x.nicho).nombre : 'Todos'}</Tag>{x.ejemplo && <Tag tone="grey">Ejemplo</Tag>}<Btn size="sm" tone="ghost" onClick={() => acciones.borrarDe('plantillas', x.id)}><Trash2 size={14} /></Btn></Fila>)}</Card>
      </>}

      {tab === 'formatos' && <>
        <Card className="mb-4"><b className="text-[15px]">Nuevo formato</b>
          <div className="grid gap-2 md:grid-cols-3 mt-3">
            <input className="input" placeholder="Título" value={f.titulo} onChange={(e) => setF({ ...f, titulo: e.target.value })} />
            <input className="input" placeholder="Tipo (Vídeo sin cara, Carrusel…)" value={f.tipo} onChange={(e) => setF({ ...f, tipo: e.target.value })} />
            <select className="input" value={f.nicho} onChange={(e) => setF({ ...f, nicho: e.target.value })}><option value="">Todos los nichos</option>{NICHOS.map((n) => <option key={n.id} value={n.id}>{n.nombre}</option>)}</select>
            <input className="input md:col-span-3" placeholder="Descripción en una frase" value={f.desc} onChange={(e) => setF({ ...f, desc: e.target.value })} />
            <textarea className="input md:col-span-3" placeholder="Estructura, un paso por línea" value={f.estructura} onChange={(e) => setF({ ...f, estructura: e.target.value })} />
          </div>
          <Btn className="mt-3" size="sm" disabled={!f.titulo.trim()} onClick={() => { acciones.guardarEn('formatos', { id: 'f' + Date.now(), ...f, nicho: f.nicho || null, estructura: f.estructura.split('\n').map((x) => x.trim()).filter(Boolean) }); setF({ ...f, titulo: '', desc: '', estructura: '' }) }}><Plus size={14} /> Añadir formato</Btn></Card>
        <Card className="p-0 overflow-hidden">{s.formatos.map((x) => <Fila key={x.id}><div className="flex-1 min-w-[200px]"><b className="text-[14.5px]">{x.titulo}</b><div className="text-dimmer text-[12.5px]">{x.tipo}{x.nicho && ` · ${nichoDe(x.nicho).nombre}`}</div></div>{x.ejemplo && <Tag tone="grey">Ejemplo</Tag>}<Btn size="sm" tone="ghost" onClick={() => acciones.borrarDe('formatos', x.id)}><Trash2 size={14} /></Btn></Fila>)}</Card>
      </>}
    </div>
  )
}

/* ---------- Bonus por rapidez ---------- */
export function DirBonus() {
  const { state: s, acciones } = useData()
  const lista = alumnos(s).filter((a) => a.bonus)
  const estado = (a, b) => a.demo ? (s.reservasBonus[b.id]?.estado || 'pendiente') : (s.bonusEstados[a.id]?.[b.id] || 'pendiente')
  return (
    <div>
      <PageHeader kicker="Dirección" title="Bonus por rapidez" sub="Quién entró entre los 20, 10 y 5 primeros, y en qué punto está cada bonus. Son acumulativos." />
      <Banner>Alumnos y puestos de ejemplo: se rellenan con el orden real de compra del 10 de noviembre. La clase de los 20 ⇢ pendiente: online o presencial.</Banner>
      <div className="grid gap-3 grid-cols-3 mb-6">{BONUS_RAPIDEZ.map((b) => <Stat key={b.id} label={b.nombre} value={`${lista.filter((a) => a.bonus <= b.hasta).length} / ${b.hasta}`} />)}</div>
      <Card className="p-0 overflow-x-auto">
        <table className="w-full text-[14px] min-w-[640px]"><thead><tr className="text-left text-dimmer text-[12.5px]"><th className="p-4 font-medium">Alumno</th><th className="p-4 font-medium">Entró entre</th>{BONUS_RAPIDEZ.map((b) => <th key={b.id} className="p-4 font-medium">{b.nombre.split(' con ')[0]}</th>)}</tr></thead>
          <tbody>{lista.map((a) => <tr key={a.id} className="border-t border-line-soft"><td className="p-4">{a.nombre}{a.ejemplo && <span className="text-dimmer text-[12px]"> · ejemplo</span>}</td><td className="p-4 text-gold-2">{a.bonus} primeros</td>
            {BONUS_RAPIDEZ.map((b) => <td key={b.id} className="p-4">{a.bonus <= b.hasta
              ? <select className="input" style={{ padding: '5px 8px', fontSize: 13, width: 'auto' }} value={estado(a, b)} onChange={(e) => a.demo ? acciones.reservarBonus(b.id, e.target.value, s.reservasBonus[b.id]?.cuando) : acciones.estadoBonus(a.id, b.id, e.target.value)}>{ESTADOS_BONUS.map((x) => <option key={x}>{x}</option>)}</select>
              : <span className="text-faint">—</span>}</td>)}</tr>)}</tbody></table>
      </Card>
    </div>
  )
}

/* ---------- Métricas del programa ---------- */
export function DirMetricas() {
  const { state: s } = useData()
  const as = alumnos(s)
  const activos = as.filter((a) => a.activo !== false)
  const porFase = FASES.map((f) => ({ f, n: activos.filter((a) => faseAlumno(a.dia, a.rango).id === f.id).length }))
  const porNicho = NICHOS.map((n) => ({ n, k: activos.filter((a) => a.nicho === n.id).length }))
  const sinNicho = activos.filter((a) => !a.nicho).length
  const comision = as.reduce((t, a) => t + (a.comision || 0), 0)
  const abiertos = s.soporte.filter((t) => t.estado !== 'resuelto').length
  const max = Math.max(1, ...porFase.map((x) => x.n))
  const eur = (n) => n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
  return (
    <div>
      <PageHeader kicker="Dirección" title="Métricas del programa" sub={`Cómo va la promoción. Acceso de 12 meses: el alumno de la demo está en el mes ${accesoDe(s).mes}.`} />
      <Banner>Excepto el alumno de la demo, los datos son de ejemplo (mock.js).</Banner>
      <div className="grid gap-3 grid-cols-2 md:grid-cols-4 mb-8">
        <Stat label="Alumnos activos" value={activos.length} tone="gold" />
        <Stat label="Comisiones declaradas" value={eur(comision)} sub="lo que apuntan en Mis comisiones" />
        <Stat label="Tickets abiertos" value={abiertos} sub={<a href="/comunidad/soporte" className="text-gold-2"><LifeBuoy size={11} className="inline" /> ver bandeja</a>} />
        <Stat label="Solicitudes de deal" value={s.solicitudesDeal.filter((x) => x.estado === 'pendiente').length} sub="pendientes" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card><b className="text-[16px]">En qué fase está cada alumno</b>
          <div className="flex flex-col gap-3 mt-4">{porFase.map(({ f, n }) => <div key={f.id}><div className="flex justify-between text-[13.5px]"><span>{f.n} · {f.nombre}</span><b>{n}</b></div><div className="bar mt-1.5"><i style={{ width: (n / max) * 100 + '%' }} /></div></div>)}</div></Card>
        <Card><b className="text-[16px]">Por nicho</b>
          <div className="flex flex-col gap-3 mt-4">{porNicho.map(({ n, k }) => <div key={n.id} className="flex items-center gap-3"><span className="w-2.5 h-2.5 rounded-full" style={{ background: n.color }} /><span className="flex-1 text-[14.5px]">{n.nombre}</span><b>{k}</b><span className="text-dimmer text-[12.5px] w-[44px] text-right">{activos.length ? Math.round((k / activos.length) * 100) : 0}%</span></div>)}
            <div className="flex items-center gap-3 text-dim"><span className="w-2.5 h-2.5 rounded-full bg-sur-top" /><span className="flex-1 text-[14.5px]">Sin elegir</span><b>{sinNicho}</b></div></div></Card>
        <Card className="lg:col-span-2 p-0 overflow-x-auto"><table className="w-full text-[14px] min-w-[620px]"><thead><tr className="text-left text-dimmer text-[12.5px]"><th className="p-4 font-medium">Alumno</th><th className="p-4 font-medium">Bootcamp</th><th className="p-4 font-medium">Fase</th><th className="p-4 font-medium">Nicho</th><th className="p-4 font-medium text-right">Comisiones</th></tr></thead>
          <tbody>{as.map((a) => <tr key={a.id} className="border-t border-line-soft"><td className="p-4">{a.nombre}{a.ejemplo && <span className="text-dimmer text-[12px]"> · ejemplo</span>}</td><td className="p-4 text-dim">{a.rango >= 1 ? 'Completo' : `Día ${a.dia}`}</td><td className="p-4">{faseAlumno(a.dia, a.rango).n} · {faseAlumno(a.dia, a.rango).corto}</td><td className="p-4 text-dim">{a.nicho ? nichoDe(a.nicho).nombre : '—'}</td><td className="p-4 text-right text-gold-2">{eur(a.comision || 0)}</td></tr>)}</tbody></table></Card>
      </div>
    </div>
  )
}
