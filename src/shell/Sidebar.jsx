import { NavLink } from 'react-router-dom'
import { LayoutDashboard, GraduationCap, Radio, MessageSquare, LifeBuoy, Sparkles, UserRound, Settings, Users, ShieldCheck } from 'lucide-react'
import { useData, noLeidos } from '../data/store.jsx'
import { cn } from '../utils/cn.js'
import { Logo } from '../ui/Logo.jsx'

/* La barra lateral de Amira Girls (calcada de She Sells). Sólo enseña los módulos activos del
   aula; FORMACIÓN lista las secciones agrupadas (base · camino · vertical) cuando hay más de un grupo. */
const SUB = { camino: 'Cómo hacerlo', vertical: 'Verticales' }
export default function Sidebar({ onNavigate }) {
  const { state, modulo, aula } = useData()
  const sinLeer = state.canales.reduce((a, c) => a + noLeidos(state, c.id), 0)
  const grupos = [...new Set(state.secciones.map((s) => s.grupo))]
  const secciones = grupos.flatMap((g, i) => [...(i > 0 && SUB[g] ? [{ sub: SUB[g] }] : []), ...state.secciones.filter((s) => s.grupo === g).map((s) => ({ to: `/formacion/${s.id}`, icon: null, label: s.nombre }))])
  const GRUPOS = [
    { nombre: 'Principal', items: [{ to: '/', icon: LayoutDashboard, label: 'Panel', end: true }] },
    modulo('formacion') && { nombre: 'Formación', items: [{ to: '/formacion', icon: GraduationCap, label: 'Todas las secciones', end: true }, ...secciones] },
    (modulo('comunidad') || modulo('directos')) && { nombre: 'Comunidad', items: [
      modulo('comunidad') && { to: '/comunidad', icon: MessageSquare, label: 'Comunidad', badge: sinLeer || null },
      modulo('directos') && { to: '/directos', icon: Radio, label: 'Directos' },
    ].filter(Boolean) },
    (modulo('soporte') || modulo('pregunta')) && { nombre: 'Ayuda', items: [
      modulo('soporte') && { to: '/soporte', icon: LifeBuoy, label: 'Soporte directo', badge: state.soporte.filter((c) => c.estado === 'respondido').length || null },
      modulo('pregunta') && { to: '/pregunta', icon: Sparkles, label: 'Pregunta a la IA' },
    ].filter(Boolean) },
    state.rol === 'direccion' && { nombre: 'Dirección', items: [{ to: '/direccion', icon: Users, label: 'Alumnos', end: true }, { to: '/direccion/equipo', icon: ShieldCheck, label: 'Equipo' }] },
    { nombre: 'Cuenta', items: [modulo('ficha') && { to: '/ficha', icon: UserRound, label: 'Mi ficha' }, { to: '/ajustes', icon: Settings, label: 'Ajustes' }].filter(Boolean) },
  ].filter(Boolean)
  const nombre = state.perfil?.nombre || state.alumno?.nombre || ''
  return (
    <aside className="w-[272px] shrink-0 h-full bg-ink border-r border-line-soft flex flex-col">
      <div className="px-5 pt-6 pb-3"><Logo size={36} /></div>
      <nav className="flex-1 overflow-auto px-3 pb-4">
        {GRUPOS.map((g) => (
          <div key={g.nombre} className="mt-4">
            <div className="kicker dim px-3 mb-1.5" style={{ fontSize: 9.5 }}>{g.nombre}</div>
            {g.items.map((it, idx) => it.sub ? <div key={'sub' + idx} className="kicker dim pl-[38px] pr-3 pt-2.5 pb-1" style={{ fontSize: 8.5, letterSpacing: '.22em' }}>{it.sub}</div> : (
              <NavLink key={it.to} to={it.to} end={it.end} onClick={onNavigate} className={({ isActive }) => cn('nav-item', isActive && 'active', !it.icon && 'pl-[38px] text-[13.5px]')}>
                {it.icon && <it.icon size={17} strokeWidth={1.8} />}
                <span className="flex-1 truncate">{it.label}</span>
                {it.badge && <span className="tag gold" style={{ fontSize: 9, padding: '2px 7px' }}>{it.badge}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
      <div className="px-4 py-4 border-t border-line-soft flex items-center gap-3">
        <span className="avatar gold" style={{ width: 36, height: 36, fontSize: 12 }}>{nombre.split(' ').map((w) => w[0]).join('').slice(0, 2)}</span>
        <div className="min-w-0"><div className="text-[14px] font-medium truncate">{nombre}</div><div className="text-dimmer text-xs truncate mono">{state.rol === 'direccion' ? 'Dirección · ' : ''}{aula.nombre}</div></div>
      </div>
    </aside>
  )
}
