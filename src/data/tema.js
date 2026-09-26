/* La marca del aula, aplicada en caliente sobre los tokens de src/index.css.
   La fila `aulas.colores` trae unos pocos colores (fondo, superficie, acento, texto, apagado,
   línea, fuente, radio, tema claro/oscuro); de ahí se derivan los tonos que el CSS espera
   (gold-2/3/deep/dark, sur-hi/top, dimmer/faint). Sin `colores` se queda la marca de Zona
   Gemelos que está en el CSS. */

const hex = (c) => { const m = String(c || '').trim().match(/^#?([0-9a-f]{6})$/i); return m ? m[1] : null }
const rgb = (c) => { const h = hex(c); return h ? [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) : null }
const toHex = ([r, g, b]) => '#' + [r, g, b].map((x) => Math.round(Math.max(0, Math.min(255, x))).toString(16).padStart(2, '0')).join('')
/* mezcla c con blanco (t>0) o negro (t<0) en proporción |t| */
const mix = (c, t) => { const v = rgb(c); if (!v) return c; const o = t > 0 ? 255 : 0; const k = Math.abs(t); return toHex(v.map((x) => x + (o - x) * k)) }
const alpha = (c, a) => { const v = rgb(c); return v ? `rgba(${v.join(',')},${a})` : c }

export function tokensDe(colores = {}) {
  const claro = colores.tema === 'claro'
  const fondo = colores.fondo, sur = colores.superficie, sur2 = colores.superficie2
  const acento = colores.acento
  /* En tema oscuro acento2 es el tono CLARO del acento (texto sobre fondo negro). En tema claro el
     texto de acento tiene que ser oscuro, así que acento2 (p. ej. el lima de Amira) pasa a ser el
     tono de relleno secundario (barras, degradados) y el texto sale del propio acento. */
  const acento2 = claro ? (acento && mix(acento, 0.12)) : (colores.acento2 || (acento && mix(acento, 0.25)))
  const texto = colores.texto, apagado = colores.apagado
  const t = {}
  if (fondo) { t['--color-black'] = claro ? mix(fondo, -0.03) : mix(fondo, -0.4); t['--color-ink'] = fondo }
  if (sur) { t['--color-sur'] = sur; t['--color-sur-hi'] = sur2 || mix(sur, claro ? 0.4 : 0.06); t['--color-sur-top'] = mix(sur2 || sur, claro ? -0.06 : 0.12) }
  if (acento) {
    t['--color-gold'] = acento; t['--color-gold-2'] = acento2; t['--color-gold-3'] = claro ? mix(acento, -0.25) : mix(acento2, 0.35)
    t['--color-gold-deep'] = claro ? (colores.acento2 || mix(acento, 0.35)) : mix(acento, -0.3); t['--color-gold-dark'] = mix(acento, claro ? -0.5 : -0.6)
    t['--color-on-gold'] = colores.sobre_acento || (claro ? '#FFFFFF' : mix(acento, -0.85))
    t['--color-line'] = colores.linea || alpha(acento, 0.22)
  }
  if (texto) { t['--color-white'] = texto; t['--color-line-soft'] = claro ? alpha(texto, 0.1) : alpha(texto, 0.07) }
  if (apagado) { t['--color-dim'] = apagado; t['--color-dimmer'] = mix(apagado, claro ? 0.2 : -0.25); t['--color-faint'] = mix(apagado, claro ? 0.4 : -0.45) }
  if (colores.fuente) t['--font-sans'] = `"${colores.fuente}", "Geist", system-ui, sans-serif`
  if (colores.radio) { t['--radius-card'] = colores.radio + 'px'; t['--radius-piece'] = Math.max(8, Math.round(colores.radio * 0.64)) + 'px'; t['--radius-chip'] = Math.max(6, Math.round(colores.radio * 0.45)) + 'px' }
  return t
}

const FUENTES = { Geist: 'Geist:wght@400;500;600;700;800', Poppins: 'Poppins:wght@400;500;600;700;800', Jost: 'Jost:wght@400;500;600;700;800', 'Playfair Display': 'Playfair+Display:wght@600;700;800', 'Inter Tight': 'Inter+Tight:wght@400;500;600;700;800' }

export function aplicarTema(aula) {
  const root = document.documentElement
  const t = tokensDe(aula?.colores)
  for (const [k, v] of Object.entries(t)) root.style.setProperty(k, v)
  root.dataset.tema = aula?.colores?.tema === 'claro' ? 'claro' : 'oscuro'
  root.lang = aula?.textos?.idioma || 'es'
  const f = aula?.colores?.fuente
  if (f && FUENTES[f] && !document.getElementById('fuente-aula')) {
    const l = document.createElement('link'); l.id = 'fuente-aula'; l.rel = 'stylesheet'
    l.href = `https://fonts.googleapis.com/css2?family=${FUENTES[f]}&display=swap`; document.head.appendChild(l)
  }
  if (aula?.nombre) document.title = `Aula · ${aula.nombre}`
  if (aula?.logo) { const i = document.querySelector('link[rel="icon"]'); if (i) i.href = aula.logo }
  const meta = document.querySelector('meta[name="theme-color"]'); if (meta && t['--color-black']) meta.content = t['--color-black']
}
