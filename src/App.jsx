import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './shell/Layout.jsx'
import Camino from './pages/Camino.jsx'
import Bootcamp, { Dia } from './pages/Bootcamp.jsx'
import Rango from './pages/Rango.jsx'
import Top from './pages/Top.jsx'
import Bienvenida from './pages/Bienvenida.jsx'
import Formacion, { Seccion, Leccion } from './pages/Formacion.jsx'
import Directos, { Grabacion } from './pages/Directos.jsx'
import Comunidad from './pages/Comunidad.jsx'
import Pregunta from './pages/Pregunta.jsx'
import Sistema, { Fase, LeccionPrograma } from './pages/Sistema.jsx'
import Novedades from './pages/Novedades.jsx'
import { Plantillas, ContenidoVende, Deals, IAMensajes, IAContenido, Comisiones, Bonus } from './pages/Herramientas.jsx'
import Ajustes from './pages/Ajustes.jsx'
const Direccion = lazy(() => import('./pages/Direccion.jsx')) // sólo la dirección lo carga
const D = (p) => <Suspense fallback={<div className="text-dimmer mono text-xs">cargando…</div>}><Direccion {...p} /></Suspense>
import { useData } from './data/store.jsx'
import { DirPrograma, DirHerramientas, DirBonus, DirMetricas } from './pages/DireccionProducto.jsx'
const DIRP = { DirPrograma, DirHerramientas, DirBonus, DirMetricas }
const DirP = ({ v }) => { const { state } = useData(); const C = DIRP[v]; return state.rol === 'direccion' ? <C /> : <div className="card p-8 max-w-[560px]"><h1 className="text-[26px]">Esto es solo para dirección</h1><p className="text-dim mt-2">Cambia a «Dirección» en la cabecera para verlo.</p></div> }

/* Las rutas del aula. Sólo existen las de los módulos activos del aula (`aulas.modulos_activos`):
   un módulo apagado no tiene ruta, no sólo no sale en la barra. */
export default function App() {
  const { modulo } = useData()
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Camino />} />
        <Route path="bienvenida" element={<Bienvenida />} />
        <Route path="bootcamp" element={<Bootcamp />} />
        <Route path="bootcamp/:n" element={<Dia />} />
        <Route path="perfil" element={<Rango />} />
        <Route path="rango" element={<Navigate to="/perfil" replace />} />
        <Route path="top" element={<Top />} />
        <Route path="sistema" element={<Sistema />} />
        <Route path="sistema/:fase" element={<Fase />} />
        <Route path="sistema/:fase/:lec" element={<LeccionPrograma />} />
        <Route path="novedades" element={<Novedades />} />
        <Route path="plantillas" element={<Plantillas />} />
        <Route path="contenido" element={<ContenidoVende />} />
        <Route path="deals" element={<Deals />} />
        <Route path="ia/mensajes" element={<IAMensajes />} />
        <Route path="ia/contenido" element={<IAContenido />} />
        <Route path="comisiones" element={<Comisiones />} />
        <Route path="bonus" element={<Bonus />} />
        {modulo('formacion') && <>
          <Route path="formacion" element={<Formacion />} />
          <Route path="formacion/:sec" element={<Seccion />} />
          <Route path="formacion/:sec/:lec" element={<Leccion />} />
        </>}
        {modulo('directos') && <>
          <Route path="directos" element={<Directos />} />
          <Route path="directos/:id" element={<Grabacion />} />
        </>}
        {modulo('comunidad') && <>
          <Route path="comunidad" element={<Comunidad />} />
          <Route path="comunidad/:canal" element={<Comunidad />} />
        </>}
        {/* el soporte vive en la comunidad, por tickets */}
        <Route path="soporte" element={<Navigate to="/comunidad/soporte" replace />} />
        <Route path="soporte/:id" element={<Navigate to="/comunidad/soporte" replace />} />
        {modulo('pregunta') && <Route path="pregunta" element={<Pregunta />} />}
        <Route path="ficha" element={<Navigate to="/perfil" replace />} />
        <Route path="ajustes" element={<Ajustes />} />
        <Route path="direccion" element={<D vista="alumnos" />} />
        <Route path="direccion/revision" element={<D vista="revision" />} />
        <Route path="direccion/equipo" element={<D vista="equipo" />} />
        <Route path="direccion/programa" element={<DirP v="DirPrograma" />} />
        <Route path="direccion/herramientas" element={<DirP v="DirHerramientas" />} />
        <Route path="direccion/bonus" element={<DirP v="DirBonus" />} />
        <Route path="direccion/metricas" element={<DirP v="DirMetricas" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
