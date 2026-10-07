import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Menu, X, RotateCcw } from 'lucide-react'
import Sidebar from './Sidebar.jsx'
import { useData, ESCENARIOS } from '../data/store.jsx'
import { Logo } from '../ui/Logo.jsx'

const ROLES = [['alumno', 'Alumno'], ['moderador', 'Moderador'], ['direccion', 'Dirección (admin)']]

export default function Layout() {
  const { state, acciones, aula } = useData()
  const [abierto, setAbierto] = useState(false)
  const loc = useLocation()
  /* Accesos rápidos: `?rol=direccion` en la URL fija el rol (para enseñar el lado del equipo con un enlace). */
  useEffect(() => { const r = new URLSearchParams(location.search).get('rol'); if (r && r !== state.rol) acciones.cambiarRol(r) }, [])
  useEffect(() => { setAbierto(false); document.querySelector('main')?.scrollTo(0, 0) }, [loc.pathname])
  return (
    <div className="h-full flex">
      <div className="hide-mobile h-full"><Sidebar /></div>
      {abierto && (
        <div className="fixed inset-0 z-40 flex" onClick={() => setAbierto(false)}>
          <div className="h-full" onClick={(e) => e.stopPropagation()}><Sidebar onNavigate={() => setAbierto(false)} /></div>
          <div className="flex-1" style={{ background: 'rgba(0,0,0,.6)' }} />
        </div>
      )}
      <div className="flex-1 min-w-0 h-full flex flex-col">
        <div className="flex items-center gap-3 px-4 md:px-8 py-2 text-[13px] border-b border-line-soft bg-ink">
          <button className="md:hidden btn ghost sm" onClick={() => setAbierto(!abierto)} aria-label="Menú">{abierto ? <X size={16} /> : <Menu size={16} />}</button>
          <img src={aula?.logo || '/marca/zonagemelos/G-128.png'} alt="" className="md:hidden rounded-full" width={26} height={26} />
          <span className="tag hide-mobile">vista previa</span>
          <span className="text-dimmer hide-mobile">Viendo como</span>
          <select className="input" style={{ width: 'auto', padding: '4px 10px', fontSize: 13 }} value={state.rol} onChange={(e) => acciones.cambiarRol(e.target.value)}>
            {ROLES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <select className="input hide-mobile" style={{ width: 'auto', padding: '4px 10px', fontSize: 13 }} value="" onChange={(e) => e.target.value && acciones.escenario(e.target.value)} aria-label="Escenario">
            <option value="">Saltar a…</option>
            {Object.entries(ESCENARIOS).map(([k, v]) => <option key={k} value={k}>{v.nombre}</option>)}
          </select>
          <span className="flex-1" />
          <button className="btn ghost sm hide-mobile" onClick={acciones.pasarDia} title="Avanza el reloj un día (solo en la vista previa)">Simular mañana</button>
          <button className="btn outline sm" onClick={acciones.reiniciarDemo} title="Reiniciar la vista previa"><RotateCcw size={14} /><span className="hide-mobile">Reiniciar</span></button>
        </div>
        {/* la comunidad va a sangre (estilo Discord): sin márgenes ni scroll de página; el resto, con su columna */}
        {loc.pathname.startsWith('/comunidad')
          ? <main className="flex-1 min-h-0 overflow-hidden"><Outlet /></main>
          : <main className="flex-1 overflow-auto"><div className="max-w-[1180px] mx-auto px-4 md:px-8 py-6 md:py-8"><Outlet /></div></main>}
      </div>
    </div>
  )
}
