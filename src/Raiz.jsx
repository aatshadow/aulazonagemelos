import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { DataProvider } from './data/store.jsx'

/* El aula, sin puerta: no hay login ni base de datos. El rol se cambia desde la cabecera (o con ?rol=direccion). */
export default function Raiz({ aula, basename }) {
  return <BrowserRouter basename={basename}><DataProvider aula={aula}><App /></DataProvider></BrowserRouter>
}
