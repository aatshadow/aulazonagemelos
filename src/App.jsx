import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './shell/Layout.jsx'
import Panel from './pages/Panel.jsx'
import Formacion, { Seccion, Leccion } from './pages/Formacion.jsx'
import Directos, { Grabacion } from './pages/Directos.jsx'
import Comunidad from './pages/Comunidad.jsx'
import Soporte from './pages/Soporte.jsx'
import Pregunta from './pages/Pregunta.jsx'
import Ficha from './pages/Ficha.jsx'
import Ajustes from './pages/Ajustes.jsx'
const Direccion = lazy(() => import('./pages/Direccion.jsx')) // sólo la dirección lo carga
const D = (p) => <Suspense fallback={<div className="text-dimmer mono text-xs">cargando…</div>}><Direccion {...p} /></Suspense>
import { useData } from './data/store.jsx'

/* Las rutas del aula. Sólo existen las de los módulos activos del aula (`aulas.modulos_activos`):
   un módulo apagado no tiene ruta, no sólo no sale en la barra. */
export default function App() {
  const { modulo } = useData()
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Panel />} />
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
        {modulo('soporte') && <>
          <Route path="soporte" element={<Soporte />} />
          <Route path="soporte/:id" element={<Soporte />} />
        </>}
        {modulo('pregunta') && <Route path="pregunta" element={<Pregunta />} />}
        {modulo('ficha') && <Route path="ficha" element={<Ficha />} />}
        <Route path="ajustes" element={<Ajustes />} />
        <Route path="direccion" element={<D vista="alumnos" />} />
        <Route path="direccion/equipo" element={<D vista="equipo" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
