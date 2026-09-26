/* El aula. Sólo hay una (Zona Gemelos VIP) y su marca vive en marca.js; no hay base de datos que consultar.
   Se resuelve antes de pintar para que main.jsx aplique la marca y monte la app. */
import { MARCA } from './marca.js'

export const aula = () => ({
  key: MARCA.key, nombre: `${MARCA.nombre} ${MARCA.apellido}`.trim(), logo: MARCA.logo,
  colores: { tema: 'oscuro' },
  modulos_activos: ['panel', 'formacion', 'directos', 'comunidad', 'soporte', 'pregunta', 'ficha', 'ajustes'],
  textos: { idioma: 'es', apellido: MARCA.apellido, subtitulo: MARCA.subtitulo, claim: MARCA.claim, soporte: MARCA.soporte, producto: `${MARCA.nombre} ${MARCA.apellido}` },
})

export async function resolverAula() { return { aula: aula(), basename: '' } }
