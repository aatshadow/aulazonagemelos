import { useData } from '../data/store.jsx'

/* El logo del aula: su imagen + su nombre en la fuente del aula. Viene de `aulas` (o de marca.js
   en demo). `aula` opcional para usarlo fuera del DataProvider (login, puertas). */
export function Logo({ size = 34, sub = true, aula: aulaProp }) {
  const ctx = useData()
  const aula = aulaProp || ctx?.aula
  if (!aula) return null
  /* «Zona Gemelos VIP» con apellido «VIP» → ZONA GEMELOS + VIP en el acento */
  const ap = aula.textos?.apellido || ''
  const apellido = ap && aula.nombre.endsWith(ap) ? ap : ''
  const nombre = apellido ? aula.nombre.slice(0, -apellido.length).trim() : aula.nombre
  const esSvg = /\.svg$/i.test(aula.logo || '')
  return (
    <span className="flex items-center gap-3" aria-label={aula.nombre}>
      {aula.logo && (esSvg
        ? <img src={aula.logo} alt="" style={{ height: size * 0.8, width: 'auto' }} />
        : <img src={aula.logo} alt="" width={size} height={size} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', boxShadow: '0 0 0 1px var(--color-line), 0 8px 24px -10px var(--color-gold)' }} />)}
      {!esSvg && (
        <span className="leading-none">
          <span className="block font-extrabold tracking-[-0.02em]" style={{ fontSize: size * 0.5 }}>{nombre.toUpperCase()}{apellido && <span className="text-gold-2"> {apellido.toUpperCase()}</span>}</span>
          {sub && aula.textos?.subtitulo && <span className="kicker block mt-1" style={{ fontSize: 8.5 }}>{aula.textos.subtitulo}</span>}
        </span>)}
    </span>
  )
}
