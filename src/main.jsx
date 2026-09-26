import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { resolverAula } from './data/aula.js'
import { aplicarTema } from './data/tema.js'
import Raiz from './Raiz.jsx'

/* Primero se resuelve QUIÉN eres (demo · aula por dominio o ruta · admin · portada · sin aula)
   y se aplica su marca; sólo entonces se pinta. Así nunca se ve la marca de otro cliente. */
resolverAula().then((r) => {
  if (r.aula) aplicarTema(r.aula)
  ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><Raiz {...r} /></React.StrictMode>)
})
