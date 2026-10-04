/* DATOS DE EJEMPLO · modo demo. Son los mismos del prototipo del 09-09: alumno, secciones,
   lecciones y mensajes inventados para enseñar la app. La marca sí es la real. Cuando haya
   Supabase, este fichero deja de cargarse. */

const hace = (d) => new Date(Date.now() - d * 864e5).toISOString()
const proximo = (diaSemana, hora, semanas = 0) => {
  const d = new Date(); const diff = (diaSemana + 7 - d.getDay()) % 7
  d.setDate(d.getDate() + diff + semanas * 7); d.setHours(hora, 0, 0, 0); return d.toISOString()
}
const L = (id, titulo, dur, vista = false) => ({ id, titulo, dur, vista })

/* Sección → módulo → lección. Desde el 02-10 Fundamentos NO es una sección: se da en el bootcamp de 30 días
   (bootcamp.js). Aquí queda lo que se abre por RANGO (`rango` = índice en RANGOS) o por DÍA del bootcamp (`desdeDia`):
   los dos caminos completos de Juane (A01–A04 · T01–T04) se abren el DÍA 15, cuando el alumno elige cara o avatar —sin
   ellos no puede producir ni lanzar, y no hay conversión el día 30 (Alex, 02-10)—. Testing y escala en Pista; las
   cuatro verticales (aún sin grabar: `pronto`) en Reservado. */
const mod = (id, nombre, desc, lecs) => ({ id, nombre, desc, lecciones: lecs.map(([t, d, v], k) => L(`${id}-${k + 1}`, t, d, !!v)) })

export const secciones = [
  { id: 'avatar', grupo: 'camino', rango: 0, desdeDia: 15, nombre: 'Hazlo con el avatar', desc: 'El camino sin dar la cara, completo: personaje, guion y voz, lotes, landings, ads, testing y SOPs para delegar.', comprado: true,
    modulos: [
      mod('av-0', 'Por qué avatar y tu personaje', 'Cuándo sí, cuándo no, y el one-pager del personaje.', [['Por qué avatar + personaje y mundo', '16 min']]),
      mod('av-1', 'Stack, guion, voz y hooks', 'Las herramientas por categorías y escribir para el oído.', [['Stack + guion/voz + hooks', '18 min']]),
      mod('av-2', 'Lotes y landings sin cara', 'De un vídeo a veinte y páginas que no rompen la confianza.', [['Batching + landings sin cara', '16 min']]),
      mod('av-3', 'Ads, testing y SOPs', 'Meta y TikTok, reglas de test y delegar el pipeline.', [['Ads Meta/TikTok + testing + SOPs', '18 min']]),
    ] },
  { id: 'tu', grupo: 'camino', rango: 0, desdeDia: 15, nombre: 'Hazlo tú', desc: 'El camino dando la cara, completo: set, presencia, hooks con cara, orgánico y ads, y un ritmo que no te queme.', comprado: true,
    modulos: [
      mod('tu-0', 'Por qué cara y tu set', 'La decisión y el set: audio, luz y cámara, en ese orden.', [['Por qué cara + setup cámara/luz/audio', '16 min']]),
      mod('tu-1', 'Talking head y confianza', 'Mirada, voz y ritmo sin teatro de gurú.', [['Talking head + confianza', '14 min']]),
      mod('tu-2', 'Hooks con cara, orgánico y ads', 'Los primeros tres segundos y el mismo mensaje en dos trajes.', [['Hooks con cara + orgánico/ads', '16 min']]),
      mod('tu-3', 'Marca personal y ritmo', 'Tu marca no es la oferta. Y cómo grabar sin quemarte.', [['Marca personal vs afiliados + ritmo', '16 min']]),
    ] },
  { id: 'escala', grupo: 'escala', rango: 1, nombre: 'Testing y escala', desc: 'Cuando ya no pierdes: lotes más grandes, reglas finas, segunda plataforma y delegar.', comprado: true,
    modulos: [
      mod('es-0', 'Testing a escala', 'Hipótesis, diseño del test y sesgos que te tumban.', [['Hipótesis antes que MP4', '12 min'], ['Matar, iterar, escalar', '14 min']]),
      mod('es-1', 'La segunda plataforma', 'Cuándo abrir TikTok o nativas y cuándo no.', [['Cuándo abrir la segunda', '11 min']]),
      mod('es-2', 'Delegar con SOPs', 'Roles, accesos y lo que no se delega aún.', [['Tu primer SOP', '13 min'], ['Qué no delegar todavía', '9 min']]),
    ] },
  ...[['trading', 'Trading', 'Brókers, compliance exigente y creatives de educación.'], ['apuestas', 'Apuestas deportivas', 'Casas, juego responsable y geos donde se puede anunciar.'],
      ['fitness', 'Fitness', 'Apps y programas, UGC y claims de salud con cuidado.'], ['software', 'Software', 'Trials y suscripciones: demostrar, no prometer.']]
    .map(([id, nombre, desc]) => ({ id, grupo: 'vertical', rango: 3, pronto: true, nombre, desc, comprado: true, modulos: [] })),
]

/* Las grabaciones de los directos viven aquí, no como sección de formación. */
export const grabaciones = [
  { id: 'g-q1', titulo: 'Q&A semanal · cómo leer una ficha de oferta', mes: 'Septiembre', dur: '58:22', vista: true },
  { id: 'g-i1', titulo: 'Invitado de septiembre · un manager de red cuenta cómo aprueba', mes: 'Septiembre', dur: '1:04:11' },
  { id: 'g-r1', titulo: 'Resultados en directo · tres alumnos enseñan su panel', mes: 'Septiembre', dur: '52:40' },
]

export const recursos = {}

export const directos = [
  { id: 'dq1', titulo: 'Q&A semanal · trae tus números y tu duda', fecha: proximo(4, 21), tipo: 'Q&A semanal', nota: 'Se graba y queda en Directos a la mañana siguiente.' },
  { id: 'dr1', titulo: 'Resultados en directo · enseña tu panel', fecha: proximo(5, 20), tipo: 'Resultados' },
  { id: 'di1', titulo: 'Invitado de octubre · media buyer que escala en Meta', fecha: proximo(2, 21, 2), tipo: 'Invitado del mes' },
]

/* Canales estilo Discord: `cat` = la categoría en la que salen, `tema` = la línea de la cabecera. */
export const canales = [
  { id: 'anuncios', nombre: 'anuncios', cat: 'Información', tema: 'Lo importante del equipo. Solo publica dirección.', soloEquipo: true },
  { id: 'ascensos', nombre: 'ascensos', cat: 'Información', tema: 'Cada subida de rango sale aquí sola.', soloEquipo: true },
  { id: 'wins', nombre: 'wins', cat: 'Comunidad', tema: 'Tus victorias, con captura. Una conversión, un postback que cuadra, un test que por fin tira.' },
  { id: 'general', nombre: 'general', cat: 'Comunidad', tema: 'De todo un poco. Respeto y cero spam.' },
  { id: 'dudas', nombre: 'dudas', cat: 'Comunidad', tema: 'Dudas del temario y del bootcamp. Di en qué día estás.' },
  /* Zonas por rango: cada una solo para los de ese rango (y el equipo). `rangoSolo` = índice en RANGOS. */
  ...[['cola', 'La sala de espera: los que estáis en el bootcamp. Aquí se empuja a diario.'], ['pista', 'Los que ya han convertido. Del primer CPA a escalar el segundo.'],
      ['barra', 'Los que pelean el Top 10. Números de verdad, sin vergüenza.'], ['reservado', 'Break-even o mejor. Ofertas, managers y payouts que no se cuentan fuera.'],
      ['vip', 'Tres meses en positivo. Mesa pequeña.'], ['palco', 'Lo más alto. Quien llega, se sienta aquí.']]
    .map(([k, tema], i) => ({ id: 'z-' + k, nombre: k, cat: 'Zonas por rango', tema, rangoSolo: i })),
]

/* `rango` = índice en RANGOS del autor (el color del nombre, como un rol de Discord). `captura` = adjunto. */
export const posts = [
  { id: 'p1', canal: 'anuncios', autor: 'Dirección', equipo: true, texto: 'Q&A el jueves a las 21:00. Trae tu número de clics, de conversiones y la duda concreta: así se resuelve en cinco minutos.', creado: hace(0.9), reacciones: 14 },
  { id: 'p1b', canal: 'anuncios', autor: 'Dirección', equipo: true, texto: 'Invitado de octubre confirmado: un media buyer que mueve presupuesto serio en Meta. Martes que viene, 21:00. Pregunta lo que quieras en #dudas y se la pasamos.', creado: hace(0.2), reacciones: 22 },
  { id: 'p4', canal: 'ascensos', autor: 'Zona Gemelos VIP', equipo: true, texto: 'Sara Molina sube a Barra: 10 conversiones aprobadas.', creado: hace(3), reacciones: 27, ascenso: 'barra' },
  { id: 'p5', canal: 'ascensos', autor: 'Zona Gemelos VIP', equipo: true, texto: 'Lucía Ferrer pasa de Cola a Pista. Pulsera de tela blanca en camino.', creado: hace(0.09), reacciones: 40, ascenso: 'pista' },
  { id: 'w1', canal: 'wins', autor: 'Dani Ortega', rango: 0, texto: 'Postback verificado a la primera. El día 14 asusta menos de lo que parece.', creado: hace(0.6), reacciones: 12, captura: 'tracker-postback.png' },
  { id: 'w2', canal: 'wins', autor: 'Sara Molina', rango: 2, texto: 'Semana cerrada en verde por primera vez. No es mucho, pero es verde.', creado: hace(0.35), reacciones: 19 },
  { id: 'w3', canal: 'wins', autor: 'Lucía Ferrer', rango: 1, texto: 'Primera conversión aprobada 🥂 Día 27 del bootcamp. Me la rechazaron dos veces por el geo hasta que lo arreglé en la campaña.', creado: hace(0.1), reacciones: 31, captura: 'red-conversion-aprobada.png' },
  { id: 'w4', canal: 'wins', autor: 'Lucía Ferrer', rango: 1, texto: 'Y ya tengo la pulsera pedida 😅', creado: hace(0.098), reacciones: 9 },
  { id: 'g1', canal: 'general', autor: 'Iván Castro', rango: 0, texto: '¿Alguien con la red X sabe cuánto tardan en aprobar el alta? Llevo dos días.', creado: hace(0.3), reacciones: 2 },
  { id: 'g2', canal: 'general', autor: 'Héctor Vidal', rango: 3, texto: 'A mí tres días. Escríbele al manager con tu fuente de tráfico y el geo, que es lo que miran.', creado: hace(0.28), reacciones: 6, respondeA: { autor: 'Iván Castro', texto: '¿Alguien con la red X sabe cuánto tardan en aprobar el alta?' } },
  { id: 'g3', canal: 'general', autor: 'Iván Castro', rango: 0, texto: 'Perfecto, gracias. Se lo mando ahora.', creado: hace(0.27), reacciones: 1 },
  { id: 'd0', canal: 'dudas', autor: 'Dirección', equipo: true, texto: 'Aquí las dudas del temario. Di en qué día del bootcamp estás. Las de acceso y facturación, a soporte.', creado: hace(9), reacciones: 5 },
  { id: 'd1', canal: 'dudas', autor: 'Dani Ortega', rango: 0, texto: 'Día 15: ¿el avatar tiene que llevar disclaimer en el propio vídeo o vale con el texto del anuncio?', creado: hace(0.5), reacciones: 3 },
  { id: 'z1', canal: 'z-cola', autor: 'Dirección', equipo: true, texto: 'Esto es solo para los que estáis en el bootcamp. Cada noche: qué día habéis entregado. El que va por detrás, que lo diga y le empujamos.', creado: hace(1.5), reacciones: 18 },
  { id: 'z2', canal: 'z-cola', autor: 'Iván Castro', rango: 0, texto: 'Día 9 entregado. Voy dos por detrás pero el finde recupero.', creado: hace(0.2), reacciones: 4 },
  { id: 'z3', canal: 'z-pista', autor: 'Lucía Ferrer', rango: 1, texto: 'Primera noche en Pista 🥂 ¿Cuánto tardasteis de la primera a la décima?', creado: hace(0.08), reacciones: 6 },
  { id: 'z4', canal: 'z-reservado', autor: 'Héctor Vidal', rango: 3, texto: 'El manager de la red Y me ha subido el payout a 140 en ES. Os paso el contacto por aquí, no fuera.', creado: hace(0.6), reacciones: 11 },
  { id: 'd2', canal: 'dudas', autor: 'Dirección', equipo: true, texto: 'Si la vertical es sensible, en el vídeo también: texto en pantalla al final. Lo tienes en A02, minuto 9.', creado: hace(0.45), reacciones: 7, respondeA: { autor: 'Dani Ortega', texto: 'Día 15: ¿el avatar tiene que llevar disclaimer en el propio vídeo…' } },
]

/* Miembros (la columna derecha de la comunidad), agrupados por rango como los roles de Discord. */
export const miembros = [
  ['Héctor Vidal', 3, true], ['Marta Soler', 3, false], ['Sara Molina', 2, true], ['Nerea Gil', 2, false], ['Álvaro Peña', 2, true],
  ['Lucía Ferrer', 1, true], ['Rubén Lago', 1, false], ['Dani Ortega', 0, true], ['Iván Castro', 0, true], ['Paula Núñez', 0, false], ['Ana Ruiz', 0, false],
].map(([nombre, rango, enLinea]) => ({ nombre, rango, enLinea }))

/* El Top 10 del mes (desde Barra): conversiones aprobadas en el mes, con prueba. Se reinicia cada día 1. */
export const top10 = [
  ['Sara Molina', 'barra', 64], ['Héctor Vidal', 'reservado', 58], ['Nerea Gil', 'barra', 41], ['Álvaro Peña', 'barra', 37], ['Marta Soler', 'reservado', 33],
  ['Rubén Lago', 'barra', 29], ['Inés Prado', 'barra', 24], ['Pablo Rey', 'barra', 21], ['Clara Ibáñez', 'barra', 18], ['Óscar Méndez', 'barra', 15],
].map(([nombre, rango, conv], i) => ({ puesto: i + 1, nombre, rango, conv }))

export const alumnoDemo = {
  id: 'a1', nombre: 'Marcos R.', email: 'marcos@ejemplo.es', alta: '2026-09-16', acceso: 'Zona Gemelos VIP',
  compra: { producto: 'Zona Gemelos VIP', fecha: '2026-08-21', importe: '2.997 €', metodo: 'Tarjeta' },
}

/* Conversaciones de soporte de ejemplo. En producción: tabla propia + aviso a Discord (plan §2, /webhook/aula-eventos). */
/* TICKETS de soporte (estilo Discord): cada uno es un canal privado entre el alumno y el equipo (moderación y
   administración). `de`: alumno · equipo · sistema. El alumno ve los suyos; el equipo, todos. */
const T = (id, num, alumno, categoria, asunto, estado, asignado, d, mensajes) => ({ id, num, alumno, categoria, asunto, estado, asignado, creado: hace(d), mensajes })
export const soporteDemo = [
  T('t41', 41, 'Marcos R.', 'Bootcamp', 'No me carga el vídeo del día 12', 'resuelto', 'Moderación', 4, [
    { de: 'alumno', autor: 'Marcos R.', texto: 'Se queda en negro en el minuto 3, en el móvil y en el portátil.', en: hace(4) },
    { de: 'equipo', autor: 'Moderación', texto: 'Era el vídeo, no tú: lo hemos vuelto a subir. Ya va. Gracias por avisar.', en: hace(3.8) },
    { de: 'sistema', texto: 'Ticket cerrado por Moderación.', en: hace(3.8) }]),
  T('t44', 44, 'Paula Núñez', 'Acceso', 'No me llega el código para entrar', 'abierto', null, 0.15, [
    { de: 'alumno', autor: 'Paula Núñez', texto: 'Pongo mi correo y no me llega nada, ni en spam.', en: hace(0.15) }]),
  T('t43', 43, 'Dani Ortega', 'Pagos', 'Me han cobrado dos veces el plazo', 'en curso', 'Admin', 0.6, [
    { de: 'alumno', autor: 'Dani Ortega', texto: 'En el extracto salen dos cargos del mismo día.', en: hace(0.6) },
    { de: 'equipo', autor: 'Admin', texto: 'Lo estamos mirando con la pasarela. Si es un duplicado, se devuelve solo en 3-5 días; te confirmo hoy.', en: hace(0.5) }]),
]
export const CATEGORIAS_TICKET = ['Acceso', 'Pagos', 'Bootcamp', 'Técnico', 'Otro']

/* Dirección · alumnos y equipo de ejemplo. `vistasN` = cuántas lecciones lleva vistas, en orden del temario. */
/* `dia` = día del bootcamp en el que está · `sinEntregar` = días seguidos sin prueba · `rango` = índice en RANGOS. */
export const alumnosDemo = [
  { id: 'a1', nombre: 'Marcos R.', email: 'marcos@ejemplo.es', alta: '2026-09-16', ultimoAcceso: '2026-10-02T09:12:00', dia: 17, sinEntregar: 0, rango: 0, activo: true },
  { id: 'a2', nombre: 'Lucía Ferrer', email: 'lucia@ejemplo.es', alta: '2026-09-04', ultimoAcceso: '2026-10-02T08:40:00', dia: 30, sinEntregar: 0, rango: 1, activo: true },
  { id: 'a3', nombre: 'Dani Ortega', email: 'dani@ejemplo.es', alta: '2026-09-18', ultimoAcceso: '2026-10-01T19:05:00', dia: 15, sinEntregar: 1, rango: 0, activo: true },
  { id: 'a4', nombre: 'Sara Molina', email: 'sara@ejemplo.es', alta: '2026-07-10', ultimoAcceso: '2026-10-02T07:50:00', dia: 30, sinEntregar: 0, rango: 2, activo: true },
  { id: 'a5', nombre: 'Iván Castro', email: 'ivan@ejemplo.es', alta: '2026-09-20', ultimoAcceso: '2026-09-28T11:20:00', dia: 9, sinEntregar: 4, rango: 0, activo: true },
  { id: 'a6', nombre: 'Paula Núñez', email: 'paula@ejemplo.es', alta: '2026-09-12', ultimoAcceso: '2026-09-24T16:30:00', dia: 6, sinEntregar: 8, rango: 0, activo: true },
]

/* La cola de revisión de dirección: pruebas de hito y ascensos de otros alumnos (las del alumno demo se suman solas). */
export const revisionDemo = [
  { id: 'r1', alumno: 'Dani Ortega', tipo: 'prueba', dia: 14, que: 'Postback verificado', pide: 'Captura del tracker y de la red', creado: hace(0.4) },
  { id: 'r2', alumno: 'Lucía Ferrer', tipo: 'ascenso', rango: 1, que: 'Cola → Pista', pide: 'Captura de la conversión aprobada', creado: hace(0.12) },
]
export const equipoDemo = [
  { id: 'd1', nombre: 'Dirección · Zona Gemelos VIP', email: 'direccion@zonagemelosvip.com', desde: '2026-08-01', yo: true },
  { id: 'd2', nombre: 'Soporte', email: 'soporte@zonagemelosvip.com', desde: '2026-08-15', yo: false },
]
