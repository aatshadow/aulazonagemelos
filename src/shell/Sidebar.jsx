import { NavLink } from 'react-router-dom'
import { Ticket, CalendarDays, GraduationCap, Radio, MessageSquare, LifeBuoy, Sparkles, UserRound, Settings, Users, ShieldCheck, Trophy, Lock, Stamp, Clapperboard, Layers, Megaphone, MessagesSquare, Clapperboard as Film, Handshake, Wand2, PenTool, Wallet, Gift, BarChart3, Wrench } from 'lucide-react'
import { useData, noLeidos, diaActual, colaRevision, esEquipo, misTickets, puedeVerCanal, novedadesSinLeer, abiertoDesde } from '../data/store.jsx'
import { Pulsera } from '../ui/camino.jsx'
import { RANGOS } from '../data/bootcamp.js'
import { cn } from '../utils/cn.js'
import { Logo } from '../ui/Logo.jsx'

/* La barra lateral. Arriba el CAMINO (lo de hoy, el bootcamp, el rango); la formación es UN botón («Temario») que
   lleva a la página con los módulos abiertos y cerrados (Alex 02-10: listarlos aquí era ruido). */
export default function Sidebar({ onNavigate }) {
  const { state, modulo, aula } = useData()
  const sinLeer = state.canales.filter((c) => puedeVerCanal(state, c)).reduce((a, c) => a + noLeidos(state, c.id), 0)
  const dia = diaActual(state)
  const revisar = state.rol === 'direccion' ? colaRevision(state).length : 0
  const GRUPOS = [
    { nombre: 'Tu camino', items: [
      { to: '/', icon: Ticket, label: 'Mi camino', end: true },
      { to: '/bienvenida', icon: Clapperboard, label: 'Bienvenida', badge: state.bienvenida ? null : 'Empieza aquí' },
      { to: '/bootcamp', icon: CalendarDays, label: 'Bootcamp', badge: state.rango === 0 && state.bienvenida && dia <= 30 ? `Día ${dia}` : null },
      { to: '/perfil', icon: UserRound, label: 'Mi perfil' },
    ] },
    { nombre: 'Programa · 12 meses', items: [
      { to: '/sistema', icon: Layers, label: 'El sistema', badge: state.nicho ? null : 'Elige nicho' },
      modulo('directos') && { to: '/directos', icon: Radio, label: 'Clases en directo' },
      modulo('formacion') && { to: '/formacion', icon: GraduationCap, label: 'Módulos completos' },
      { to: '/novedades', icon: Megaphone, label: 'Novedades', badge: novedadesSinLeer(state) || null },
    ].filter(Boolean) },
    { nombre: 'Herramientas', items: [
      { to: '/deals', icon: Handshake, label: 'Deals con plataformas', req: 'deals' },
      { to: '/contenido', icon: Film, label: 'Contenido que vende', req: 'contenidoVende' },
      { to: '/ia/contenido', icon: PenTool, label: 'IA de contenido', req: 'iaContenido' },
      { to: '/plantillas', icon: MessagesSquare, label: 'Plantillas de mensajes', req: 'plantillas' },
      { to: '/ia/mensajes', icon: Wand2, label: 'IA de mensajes', req: 'iaMensajes' },
      { to: '/comisiones', icon: Wallet, label: 'Mis comisiones', req: 'comisiones' },
    ].map((it) => ({ ...it, lock: !esEquipo(state) && !abiertoDesde(state, it.req) })) },
    (modulo('comunidad') || modulo('directos')) && { nombre: 'Comunidad', items: [
      { to: '/bonus', icon: Gift, label: 'Mis bonus' },
      modulo('comunidad') && { to: '/comunidad', icon: MessageSquare, label: 'Comunidad', badge: sinLeer || null },
      { to: '/top', icon: Trophy, label: 'Top 10 del mes' },
    ].filter(Boolean) },
    (modulo('soporte') || modulo('pregunta')) && { nombre: 'Ayuda', items: [
      modulo('soporte') && { to: '/comunidad/soporte', icon: LifeBuoy, label: esEquipo(state) ? 'Tickets' : 'Soporte directo', badge: (esEquipo(state) ? misTickets(state).filter((t) => t.estado === 'abierto') : misTickets(state).filter((t) => t.estado === 'en curso' && t.mensajes.at(-1)?.de === 'equipo')).length || null },
      modulo('pregunta') && { to: '/pregunta', icon: Sparkles, label: 'Pregunta a la IA' },
    ].filter(Boolean) },
    state.rol === 'direccion' && { nombre: 'Dirección', items: [{ to: '/direccion', icon: Users, label: 'Alumnos', end: true }, { to: '/direccion/revision', icon: Stamp, label: 'Revisión', badge: revisar || null }, { to: '/direccion/metricas', icon: BarChart3, label: 'Métricas' }, { to: '/direccion/programa', icon: Radio, label: 'Programa' }, { to: '/direccion/herramientas', icon: Wrench, label: 'Herramientas', badge: state.solicitudesDeal.filter((x) => x.estado === 'pendiente').length || null }, { to: '/direccion/bonus', icon: Gift, label: 'Bonus' }, { to: '/direccion/equipo', icon: ShieldCheck, label: 'Equipo' }] },
    { nombre: 'Cuenta', items: [{ to: '/ajustes', icon: Settings, label: 'Ajustes' }] },
  ].filter(Boolean)
  const nombre = state.perfil?.nombre || state.alumno?.nombre || ''
  return (
    <aside className="w-[272px] shrink-0 h-full bg-ink border-r border-line-soft flex flex-col">
      <div className="px-5 pt-6 pb-3"><Logo size={36} /></div>
      <nav className="flex-1 overflow-auto px-3 pb-4">
        {GRUPOS.map((g) => (
          <div key={g.nombre} className="mt-4">
            <div className="text-dimmer px-3 mb-1.5 text-[12px]">{g.nombre}</div>
            {g.items.map((it, idx) => it.sub ? <div key={'sub' + idx} className="text-faint pl-[38px] pr-3 pt-2.5 pb-1 text-[11.5px]">{it.sub}</div> : (
              <NavLink key={it.to} to={it.to} end={it.end} onClick={onNavigate} className={({ isActive }) => cn('nav-item', isActive && 'active', !it.icon && 'pl-[38px] text-[13.5px]')}>
                {it.icon && <it.icon size={17} strokeWidth={1.8} />}
                <span className={cn('flex-1 truncate', it.lock && 'text-dimmer')}>{it.label}</span>
                {it.lock && <Lock size={12} className="text-faint" />}
                {it.badge && <span className="tag gold" style={{ fontSize: 10.5, padding: '2px 8px' }}>{it.badge}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
      <div className="px-4 py-4 border-t border-line-soft flex items-center gap-3">
        <span className="avatar gold" style={{ width: 36, height: 36, fontSize: 12 }}>{nombre.split(' ').map((w) => w[0]).join('').slice(0, 2)}</span>
        <div className="min-w-0 flex-1"><div className="text-[14px] font-medium truncate">{nombre}</div><div className="text-dimmer text-xs truncate">{state.rol === 'direccion' ? 'Admin' : state.rol === 'moderador' ? 'Moderación' : RANGOS[state.rango].objeto}</div></div>
        {!esEquipo(state) && <Pulsera rango={state.rango} chica />}
      </div>
    </aside>
  )
}
