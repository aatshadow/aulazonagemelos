/* DATOS DE EJEMPLO · modo demo. Son los mismos del prototipo del 09-09: alumno, secciones,
   lecciones y mensajes inventados para enseñar la app. La marca sí es la real. Cuando haya
   Supabase, este fichero deja de cargarse. */

const hace = (d) => new Date(Date.now() - d * 864e5).toISOString()
const proximo = (diaSemana, hora, semanas = 0) => {
  const d = new Date(); const diff = (diaSemana + 7 - d.getDay()) % 7
  d.setDate(d.getDate() + diff + semanas * 7); d.setHours(hora, 0, 0, 0); return d.toISOString()
}
const L = (id, titulo, dur, vista = false) => ({ id, titulo, dur, vista })

/* Sección → módulo → lección. `grupo` ordena la pantalla en tres pisos (base · camino · vertical).
   Las siete secciones las dictó Alex el 18-09 y son cosas SEPARADAS:
   Fundamentos principales · Hazlo con el avatar (cómo hacerlo con un avatar) · Hazlo tú (cómo hacerlo
   tú, dando la cara) · y una sección por vertical: Trading · Apuestas deportivas · Fitness · Software.
   Los nombres de módulos y lecciones son de ejemplo hasta que llegue el contenido real. */
const mod = (id, nombre, desc, lecs) => ({ id, nombre, desc, lecciones: lecs.map(([t, d, v], k) => L(`${id}-${k + 1}`, t, d, !!v)) })

export const secciones = [
  { id: 'fund', grupo: 'base', nombre: 'Fundamentos principales', desc: 'La base que hace que todo lo demás se sostenga cuando no hay nadie mirando.', comprado: true,
    modulos: [
      mod('fund-0', 'Gestión de banca', 'Cuánto arriesgas, por qué esa cifra y no otra.', [['Qué es una unidad', '9:48', 1], ['Tamaño de apuesta', '15:22', 1], ['La banca que no se toca', '12:05', 1]]),
      mod('fund-1', 'Disciplina', 'La parte aburrida, que es la que separa a los que siguen aquí en un año.', [['Reglas escritas antes de jugar', '11:36', 1], ['Qué hacer en racha mala', '17:50', 1]]),
      { id: 'fund-2', nombre: 'Registro y revisión', desc: 'Si no lo apuntas, no ha pasado.', lecciones: [
        L('f21', 'Qué se apunta de cada sesión', '10:14', true), L('f22', 'Cómo se registra una sesión sin engañarse', '14:32'),
        L('f23', 'La revisión de los domingos', '16:08'), L('f24', 'Leer tus propios números', '21:45'), L('f25', 'Cuándo cambiar el plan', '13:20')] },
    ] },
  { id: 'avatar', grupo: 'camino', nombre: 'Hazlo con el avatar', desc: 'Cómo montarlo sin dar la cara: un avatar que habla por ti, de la voz al vídeo publicado.', comprado: true,
    modulos: [
      mod('av-0', 'Crear tu avatar', 'Voz, imagen y la herramienta con la que se genera.', [['Qué avatar te conviene', '12:40', 1], ['Voz y acento', '9:15', 1], ['Generar el primer vídeo', '18:22']]),
      mod('av-1', 'Guiones para el avatar', 'Lo que funciona dicho por un avatar y lo que no.', [['La estructura de un guion', '14:05'], ['Ganchos que aguantan', '11:30'], ['Errores que delatan al avatar', '8:50']]),
      mod('av-2', 'Producir y publicar', 'De un guion a diez vídeos a la semana.', [['El flujo de producción', '16:10'], ['Publicar en tres redes', '13:45']]),
      mod('av-3', 'Escalar sin salir en cámara', 'Más cuentas, más nichos, mismo avatar.', [['Cuándo abrir la segunda cuenta', '10:20'], ['Delegar la producción', '12:00']]),
    ] },
  { id: 'tu', grupo: 'camino', nombre: 'Hazlo tú', desc: 'Cómo montarlo dando la cara: tu marca, tu cámara, tu rutina.', comprado: true,
    modulos: [
      mod('tu-0', 'Tu marca personal', 'Qué cuentas, a quién y por qué te van a creer.', [['Tu historia en 30 segundos', '11:12'], ['El personaje y sus límites', '13:40']]),
      mod('tu-1', 'Grabar y editar', 'Con el móvil, en una hora a la semana.', [['El set de 50 euros', '9:30'], ['Grabar diez vídeos de una vez', '17:25'], ['Editar sin editor', '14:10']]),
      mod('tu-2', 'Publicar y medir', 'Qué mirar cada domingo.', [['Calendario de publicación', '8:45'], ['Los tres números que importan', '12:30']]),
      mod('tu-3', 'Rutina semanal', 'Para que no dependa de las ganas.', [['La semana tipo', '10:05'], ['Qué hacer cuando no sale', '9:40']]),
    ] },
  { id: 'trading', grupo: 'vertical', nombre: 'Trading', desc: 'La vertical de trading: el sistema, el canal y cómo se monetiza.', comprado: true,
    modulos: [
      mod('tr-0', 'El sistema', 'Qué se opera, cuándo y con qué regla.', [['El sistema en una página', '19:30'], ['El plan de operativa', '15:22'], ['Gestión del riesgo', '13:48']]),
      mod('tr-1', 'El canal', 'Cómo se construye la audiencia que luego paga.', [['El canal de señales', '14:20'], ['Contenido que trae gente', '12:15']]),
      mod('tr-2', 'Monetizar', 'Afiliación de broker, comunidad de pago, formación.', [['Afiliación de broker', '16:40'], ['La comunidad de pago', '11:55']]),
    ] },
  { id: 'apuestas', grupo: 'vertical', nombre: 'Apuestas deportivas', desc: 'La vertical de apuestas: picks, grupo y monetización.', comprado: true,
    modulos: [
      mod('ap-0', 'Picks y tipster', 'De dónde salen los picks y cómo se validan.', [['Valor y cuota', '13:10'], ['Elegir al tipster', '10:45'], ['Registro de picks', '9:20']]),
      mod('ap-1', 'El grupo', 'Telegram: gratuito, VIP y lo que se dice en cada uno.', [['El grupo gratuito', '12:30'], ['El grupo VIP', '14:05']]),
      mod('ap-2', 'Monetizar', 'Casas, afiliación y el VIP.', [['Afiliación de casas', '15:15'], ['Cobrar el VIP', '10:40']]),
    ] },
  { id: 'fitness', grupo: 'vertical', nombre: 'Fitness', desc: 'La vertical de fitness: la oferta, el contenido y cerrar clientes.', comprado: true,
    modulos: [
      mod('fi-0', 'La oferta', 'Qué vendes y a cuánto.', [['La transformación que vendes', '12:20'], ['Precio y formato', '10:10']]),
      mod('fi-1', 'Contenido', 'Antes/después, rutinas y comida sin aburrir.', [['Los cinco tipos de vídeo', '13:35'], ['Calendario de contenido', '9:50']]),
      mod('fi-2', 'Cerrar clientes', 'Del DM a la llamada y al pago.', [['El DM que abre', '11:25'], ['La llamada de 20 minutos', '16:00']]),
    ] },
  { id: 'software', grupo: 'vertical', nombre: 'Software', desc: 'La vertical de software: la idea, montarlo sin programar y venderlo.', comprado: true,
    modulos: [
      mod('sw-0', 'La idea', 'Un problema pequeño que alguien paga por quitarse.', [['Encontrar el problema', '14:00'], ['Validar antes de montar', '11:30']]),
      mod('sw-1', 'Montarlo sin programar', 'Con las herramientas que ya existen.', [['El stack sin código', '18:20'], ['La primera versión en un fin de semana', '20:15']]),
      mod('sw-2', 'Vender', 'Primeros clientes y precio.', [['Los diez primeros clientes', '13:45'], ['Precio y suscripción', '10:30']]),
    ] },
]

/* Las grabaciones de los directos viven aquí, no como sección de formación. */
export const grabaciones = [
  { id: 'g-s1', titulo: 'Repaso semana 1', mes: 'Septiembre', dur: '58:22', vista: true },
  { id: 'g-s2', titulo: 'Repaso semana 2', mes: 'Septiembre', dur: '1:04:11' },
  { id: 'g-a3', titulo: 'Repaso semana 3', mes: 'Agosto', dur: '52:40' },
  { id: 'g-a4', titulo: 'Repaso semana 4', mes: 'Agosto', dur: '1:11:03' },
]

export const recursos = {
  f22: [{ nombre: 'Plantilla de registro de sesión', tipo: 'Hoja' }],
  f23: [{ nombre: 'Guion de la revisión del domingo', tipo: 'PDF' }],
  'tr-0-2': [{ nombre: 'Plantilla del plan de operativa', tipo: 'Hoja' }],
  'ap-0-3': [{ nombre: 'Plantilla de registro de picks', tipo: 'Hoja' }],
  'av-1-1': [{ nombre: 'Plantilla de guion para el avatar', tipo: 'Doc' }],
  'tu-1-2': [{ nombre: 'Lista de equipo (el set de 50 €)', tipo: 'PDF' }],
}

export const directos = [
  { id: 'dv3', titulo: 'Repaso semana 3 y dudas de registro', fecha: proximo(4, 21), tipo: 'Repaso', nota: 'Se graba y queda en Directos y repasos a la mañana siguiente.' },
  { id: 'dv4', titulo: 'Repaso semana 4', fecha: proximo(4, 21, 1), tipo: 'Repaso' },
  { id: 'dq1', titulo: 'Sesión de preguntas · banca y disciplina', fecha: proximo(2, 21, 1), tipo: 'Preguntas' },
]

export const canales = [
  { id: 'anuncios', nombre: 'anuncios', soloEquipo: true },
  { id: 'general', nombre: 'general' },
  { id: 'dudas', nombre: 'dudas' },
  { id: 'registros', nombre: 'registros' },
]

export const posts = [
  { id: 'p1', canal: 'anuncios', autor: 'Dirección', equipo: true, texto: 'Directo el jueves a las 21:00: repaso de la semana 3 y dudas de registro. Se graba y queda en Directos y repasos a la mañana siguiente.', creado: hace(0.08), reacciones: 14 },
  { id: 'p2', canal: 'anuncios', autor: 'Dirección', equipo: true, texto: 'Ya está arriba «Generar el primer vídeo» en Hazlo con el avatar. Con el proceso entero, sin cortar.', creado: hace(1), reacciones: 22 },
  { id: 'p3', canal: 'general', autor: 'Naiara', texto: 'Subo el registro de la semana esta noche, con las tres sesiones enteras.', creado: hace(0.03), reacciones: 3 },
  { id: 'p4', canal: 'general', autor: 'Diego', texto: 'La plantilla del plan de operativa la tenéis en los entregables de la lección (Trading · El sistema), no en el canal.', creado: hace(0.08), reacciones: 6 },
  { id: 'p5', canal: 'general', autor: 'Marcos', texto: 'Duda de Gestión de banca: cuando dice «el error caro», ¿se refiere al tamaño o al momento?', creado: hace(0.12), reacciones: 2 },
  { id: 'p6', canal: 'dudas', autor: 'Dirección', equipo: true, texto: 'Aquí las dudas del temario. Las de acceso y facturación, al correo de soporte.', creado: hace(3), reacciones: 5 },
  { id: 'p7', canal: 'registros', autor: 'Ana', texto: 'Semana 2 registrada: 14 sesiones, dos fuera de plan. Las dos, domingos.', creado: hace(0.5), reacciones: 9 },
]

export const alumnoDemo = {
  id: 'a1', nombre: 'Marcos R.', email: 'marcos@ejemplo.es', alta: '2026-08-21', acceso: 'Acceso completo · 7 secciones',
  compra: { producto: 'Zona Gemelos VIP', fecha: '2026-08-21', importe: '2.997 €', metodo: 'Tarjeta' },
}

/* Conversaciones de soporte de ejemplo. En producción: tabla propia + aviso a Discord (plan §2, /webhook/aula-eventos). */
export const soporteDemo = [
  { id: 's1', asunto: 'No me carga el vídeo de la sesión 2', estado: 'resuelto', creado: hace(4), mensajes: [
    { de: 'tu', texto: 'Se queda en negro en el minuto 3, en el móvil y en el portátil.', en: hace(4) },
    { de: 'equipo', autor: 'Soporte', texto: 'Era el vídeo, no tú: lo hemos vuelto a subir. Ya va. Gracias por avisar.', en: hace(3.8) },
  ] },
]

/* Dirección · alumnos y equipo de ejemplo. `vistasN` = cuántas lecciones lleva vistas, en orden del temario. */
export const alumnosDemo = [
  { id: 'a1', nombre: 'Marcos R.', email: 'marcos@ejemplo.es', alta: '2026-08-21', ultimoAcceso: '2026-09-27T09:12:00', vistasN: 8, activo: true },
  { id: 'a2', nombre: 'Lucía Ferrer', email: 'lucia@ejemplo.es', alta: '2026-08-23', ultimoAcceso: '2026-09-26T22:40:00', vistasN: 31, activo: true },
  { id: 'a3', nombre: 'Dani Ortega', email: 'dani@ejemplo.es', alta: '2026-09-02', ultimoAcceso: '2026-09-25T19:05:00', vistasN: 17, activo: true },
  { id: 'a4', nombre: 'Sara Molina', email: 'sara@ejemplo.es', alta: '2026-09-04', ultimoAcceso: '2026-09-27T07:50:00', vistasN: 55, activo: true },
  { id: 'a5', nombre: 'Iván Castro', email: 'ivan@ejemplo.es', alta: '2026-09-10', ultimoAcceso: '2026-09-14T11:20:00', vistasN: 3, activo: true },
  { id: 'a6', nombre: 'Paula Núñez', email: 'paula@ejemplo.es', alta: '2026-09-12', ultimoAcceso: '2026-09-21T16:30:00', vistasN: 12, activo: false },
]
export const equipoDemo = [
  { id: 'd1', nombre: 'Dirección · Zona Gemelos VIP', email: 'direccion@zonagemelosvip.com', desde: '2026-08-01', yo: true },
  { id: 'd2', nombre: 'Soporte', email: 'soporte@zonagemelosvip.com', desde: '2026-08-15', yo: false },
]
