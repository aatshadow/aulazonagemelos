import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Upload, Clock, Check } from 'lucide-react'
import { Pulsera } from '../ui/camino.jsx'
import { Banner } from '../ui/index.jsx'
import { cn } from '../utils/cn.js'
import { DIAS, RANGOS } from '../data/bootcamp.js'
import { useData, ascensoPendiente, diaActual, fmtFecha, entregado } from '../data/store.jsx'

/* MI PERFIL · quién eres + tu rango, en una sola página (Alex 02-10: «mi rango y mi perfil pueden ser la misma sección»).
   Arriba los datos, la insignia y el avance del bootcamp; debajo la escalera entera (Palco arriba, Cola abajo) y la
   solicitud de subida: un hito y una prueba, que revisa el equipo. */
function Solicitar() {
  const { state: s, acciones } = useData()
  const [archivo, setArchivo] = useState(null)
  const [nota, setNota] = useState('')
  const r = RANGOS[s.rango]; const sig = RANGOS[s.rango + 1]
  const pend = ascensoPendiente(s)
  const ultimo = s.ascensos[0]
  if (!sig) return null
  if (pend) return <div className="card p-6"><div className="flex items-center gap-2 text-[15.5px]"><Clock size={16} className="text-gold" /> Tu subida a {RANGOS[pend.a].nombre} está en revisión.</div><p className="text-dim text-[14px] mt-1">El equipo la mira en menos de 24 horas. Si la aprueba, sale sola en #ascensos.</p></div>
  if (s.rango === 0) {
    const n = Math.min(diaActual(s), DIAS.length)
    return <div className="card p-6"><h2 className="text-[24px]">Cómo sales de la Cola</h2><p className="text-dim text-[15px] mt-2">Completando el bootcamp. El día 30 entregas la captura de tu primera conversión aprobada; cuando el equipo la valida, cambias la entrada por la pulsera blanca.</p><Link to={`/bootcamp/${n}`} className="btn primary mt-4">Ir al día {n}</Link></div>
  }
  return (
    <div className="card p-6">
      <h2 className="text-[24px]">Solicita tu subida a {sig.nombre}</h2>
      <p className="text-dim text-[15px] mt-1">Hito: {r.hito.charAt(0).toLowerCase() + r.hito.slice(1)}. Prueba: {r.prueba.charAt(0).toLowerCase() + r.prueba.slice(1)}.</p>
      {ultimo?.estado === 'devuelto' && <div className="mt-4"><Banner tone="red">La última solicitud volvió{ultimo.nota ? `: ${ultimo.nota}` : '.'}</Banner></div>}
      <label className="mt-5 flex flex-col items-center justify-center gap-2 rounded-[14px] border border-dashed border-line p-6 text-center cursor-pointer hover:bg-sur-hi">
        <Upload size={20} className="text-gold" /><span className="text-[14.5px]">{archivo ? archivo.name : 'Sube la captura'}</span>
        <input type="file" accept="image/*" className="sr-only" onChange={(e) => setArchivo(e.target.files?.[0] || null)} />
      </label>
      <textarea className="input mt-3" style={{ minHeight: 70 }} placeholder="Explícale al equipo qué enseña la captura" value={nota} onChange={(e) => setNota(e.target.value)} />
      <button className="btn primary w-full mt-4" disabled={!archivo} onClick={() => acciones.solicitarAscenso({ archivo: archivo.name, texto: nota.trim() })}>Solicitar la subida</button>
    </div>
  )
}

export default function Rango() {
  const { state: s } = useData()
  const desde = s.ascensos.filter((a) => a.estado === 'aprobado')
  const a = s.alumno
  const nombre = s.perfil?.nombre || a.nombre
  const hechas = DIAS.filter((d) => entregado(s, d.n)).length
  return (
    <div>
      <p className="text-dim text-[15px] mb-2">Mi perfil</p>
      <div className="flex flex-wrap items-center gap-5">
        <span className="avatar gold" style={{ width: 72, height: 72, fontSize: 24 }}>{nombre.split(' ').map((w) => w[0]).join('').slice(0, 2)}</span>
        <div className="min-w-0">
          <h1 className="text-[34px] md:text-[44px]">{nombre}</h1>
          <div className="text-dim text-[14px] mt-1">{a.email}{a.alta && <> · alumno desde el {fmtFecha(a.alta, { year: 'numeric' })}</>}</div>
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-3 mt-8">
        <div className="regla pt-4"><div className="text-dimmer text-[12.5px]">Tu rango</div><div className="mt-2"><Pulsera rango={s.rango} /></div></div>
        <div className="regla pt-4"><div className="text-dimmer text-[12.5px]">Bootcamp</div><div className="display text-[30px] mt-1">{hechas}<span className="text-dim text-[18px]"> de {DIAS.length} pruebas</span></div></div>
        <div className="regla pt-4"><div className="text-dimmer text-[12.5px]">Tu acceso</div><div className="text-[16px] mt-2">{(s.accesos || [])[0]?.nombre || 'Zona Gemelos VIP'}</div><div className="text-dimmer text-[12.5px] mt-0.5">Para cualquier cambio, escribe a soporte.</div></div>
      </div>
      <h2 className="text-[30px] mt-14">La escalera</h2>
      <p className="text-dim text-[16px] mt-2 max-w-[60ch]">Estás en {RANGOS[s.rango].nombre}. Cada rango se gana con un hito y se demuestra con una prueba. El equipo la revisa y, si está bien, la insignia nueva te llega a casa.</p>
      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] mt-8">
        <ol className="relative">
          <span className="absolute left-[23px] top-4 bottom-4 border-l border-line" aria-hidden />
          {[...RANGOS].map((r, i) => ({ r, i })).reverse().map(({ r, i }) => {
            const hecho = i < s.rango; const aqui = i === s.rango
            return (
              <li key={r.k} className={cn('relative pl-16 pb-9 last:pb-0', i > s.rango && 'opacity-55')}>
                <span className={cn('absolute left-[14px] top-2 w-[19px] h-[19px] rounded-full border-2 grid place-items-center', aqui ? 'border-gold bg-gold' : hecho ? 'border-gold bg-black' : 'border-faint bg-black')}>{hecho && <Check size={11} className="text-gold" />}</span>
                <div className="flex flex-wrap items-center gap-3"><Pulsera rango={i} apagada={i > s.rango} serie={i >= 4 ? 1 : undefined} />{aqui && <span className="text-gold-2 text-[13.5px]">Estás aquí</span>}
                  <span className="text-dimmer text-[13px]">{r.miembros === 1 ? 'Una sola persona' : `${r.miembros} personas`}{i >= 4 ? ' · numerada' : ''}</span></div>
                <div className="text-[15px] mt-3"><span className="text-dimmer">{r.objeto}. </span>Desbloquea: {r.desbloquea.charAt(0).toLowerCase() + r.desbloquea.slice(1)}.</div>
                {RANGOS[i + 1] && <div className="text-dim text-[14px] mt-1">Para subir a {RANGOS[i + 1].nombre}: {r.hito.charAt(0).toLowerCase() + r.hito.slice(1)}.</div>}
                {hecho && desde.find((a) => a.a === i) && <div className="text-dimmer text-[12.5px] mt-1">Conseguido el {fmtFecha(desde.find((a) => a.a === i).revisada)}</div>}
              </li>)
          })}
        </ol>
        <div className="lg:sticky lg:top-2 h-fit"><Solicitar /></div>
      </div>
    </div>
  )
}
