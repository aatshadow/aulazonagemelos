# Aula Zona Gemelos VIP · sólo el front

El aula privada de **Zona Gemelos VIP** como front independiente: sin servidor, sin base de datos, sin login.
Los datos (temario, directos, grabaciones, comunidad, soporte, alumnos de dirección) viven en `src/data/mock.js`
y lo que se toca en pantalla se guarda en `localStorage` del navegador. Sirve para ver, enseñar y retocar el aula
sin depender de nada.

Nace de **Aula Core** (`aatshadow/Aula-Core`, commit `f1c66f1`, 27-09-2026), que es la máquina completa
(varias aulas, Supabase, Admin Core, api). Aquí sólo está la pantalla del alumno y de la dirección de los Gemelos.

- **Repo:** https://github.com/aatshadow/aulazonagemelos
- **Stack:** Vite + React 19 + Tailwind v4 + lucide-react

## Levantarlo

```
npm install
npm run dev        # http://localhost:5610
npm run build      # dist/ (estático; vercel.json lleva el rewrite de SPA)
npm run lint
```

## Accesos rápidos

| Qué | Cómo |
|---|---|
| Ver el aula como alumno | abrir `/` (entra directo, sin login) |
| Ver el lado de la dirección | selector **Viendo como → Dirección** en la cabecera, o `/?rol=direccion` |
| Alumnos y equipo (dirección) | `/direccion` · `/direccion/equipo` |
| Volver al estado inicial | botón **Reiniciar** en la cabecera (borra lo guardado en `localStorage`) |

Con el rol de dirección, además: se puede publicar en `#anuncios`, los posts salen con la etiqueta del equipo,
y en Soporte se responde y se cierran hilos como equipo.

## Dónde está cada cosa

| Qué | Dónde |
|---|---|
| Marca (nombre, logo, soporte) | `src/data/marca.js` · logo en `public/marca/zonagemelos/` |
| Datos de ejemplo | `src/data/mock.js` (temario, directos, grabaciones, canales, posts, soporte, alumnos y equipo de dirección) |
| Estado y acciones (mock + localStorage) | `src/data/store.jsx` |
| Colores y tema | `src/index.css` (tokens) · `src/data/tema.js` |
| Shell (barra lateral, cabecera) | `src/shell/` |
| Pantallas | `src/pages/` (Panel · Formación · Directos · Comunidad · Soporte · Pregunta · Ficha · Ajustes · Dirección) |
| Rutas | `src/App.jsx` (sólo existen las de los módulos activos en `src/data/aula.js`) |

## Lo que NO hace (a propósito)

No guarda nada fuera del navegador, no crea alumnos, no resetea contraseñas, no manda correos y la «IA» contesta
con un texto de cortesía. Para todo eso está Aula Core con su base.

---

## v2 · el producto del lanzamiento (07-10-2026)
Fuente: `operator/portfolio/growthinfo/clients/zona-gemelos/lanzamiento-nov/LANZAMIENTO-FUENTE-DE-VERDAD.md` §3 y
`producto/PORTAL-PLAN-v2.md`. Todo se desbloquea **a su debido tiempo dentro del bootcamp** (`DESBLOQUEO` en `src/data/programa.js`,
helper `abiertoDesde` en `store.jsx`, componente `<Candado>` en `ui/acceso.jsx`).

| Alumno | Ruta | Se abre |
|---|---|---|
| El sistema (5 fases × 3 nichos, 12 meses) | `/sistema`, `/sistema/:fase/:lec` | fase 1 día 1 · tráfico día 8 · contenido día 15 · convertir día 22 · escalar en Pista |
| Clases en directo (2/semana, cuenta atrás, grabaciones con buscador) | `/directos` | día 1 |
| Novedades del programa | `/novedades` | día 1 |
| Deals con las plataformas (solicitar enlace) | `/deals` | día 3 |
| Contenido que vende · IA de contenido (bonus) | `/contenido`, `/ia/contenido` | día 15 |
| Mis comisiones (hoja de dinero) | `/comisiones` | día 21 |
| Plantillas de mensajes · IA de mensajes | `/plantillas`, `/ia/mensajes` | día 22 |
| Mis bonus (para todos + por rapidez 20/10/5) | `/bonus` | día 1 |

Dirección: `/direccion/metricas` · `/direccion/programa` (directos, grabaciones, novedades) · `/direccion/herramientas`
(solicitudes de enlace, deals, plantillas, formatos) · `/direccion/bonus`. El equipo lo ve todo abierto.

Vista previa: `?escenario=nuevo|dia17|dia30|pista` y `?rol=direccion` en la URL (sirven también en móvil).

### Pendiente (marcado en la app como EJEMPLO / ⇢ pendiente)
Vídeos de las lecciones del programa · días, hora y plataforma de los directos (`DIRECTOS_CFG`) · grabaciones reales ·
plataformas y comisiones reales de los deals · plantillas y formatos reales · endpoint de la IA (`IA_CFG.endpoint`) ·
huecos reales de los bonus · bonus de los 20 (online o presencial) · fase 2 real (Supabase en Aula Core).
