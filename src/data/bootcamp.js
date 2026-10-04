/* EL CAMINO · bootcamp de 30 días + rangos. Fuente: operator/portfolio/growthinfo/clients/zona-gemelos/producto/
   PILDORAS-BOOTCAMP.md (v2, 02-10-2026). Fundamentos se da en 30 píldoras de ≤10 min, una al día; la meta del día 30 es la
   PRIMERA CONVERSIÓN aprobada por la red. Después, rangos: cada subida = un hito + una prueba, revisada por el equipo.
   Los nombres de rango son el tema «discoteca» (provisional: el de «mafia» está en el .md); cambiarlos es cambiar RANGOS. */

/* prueba.tipo: 'texto' (escribe), 'enlace' (pega un enlace), 'captura' (sube una imagen). `revision`: la mira el equipo. */
const D = (n, semana, titulo, dur, aprende, fuente, mentalidad, tarea, prueba, extra = {}) =>
  ({ n, semana, titulo, dur, aprende, fuente, mentalidad, tarea, prueba, ...extra })

export const SEMANAS = [
  { n: 1, titulo: 'El juego y tu oferta', desde: 1, hasta: 7, meta: 'Saber cómo se gana aquí y elegir tu oferta.' },
  { n: 2, titulo: 'Monta la cadena', desde: 8, hasta: 14, meta: 'Que un clic de prueba llegue hasta tu tracker.' },
  { n: 3, titulo: 'Creatives y lanzamiento', desde: 15, hasta: 21, meta: 'Cinco anuncios hechos y la campaña en marcha.' },
  { n: 4, titulo: 'Hasta tu primera conversión', desde: 22, hasta: 30, meta: 'Leer, ajustar y conseguir la primera conversión aprobada.' },
]

export const DIAS = [
  D(1, 1, 'Tu reloj empieza hoy', '6 min', 'Cómo funciona el bootcamp: un vídeo, una tarea y una prueba al día. La meta es tu primera conversión el día 30.', 'Bienvenida', 'Has comprado acceso. El resultado se ejecuta.', 'Escribe tu compromiso: cuántas horas al día vas a dar y qué presupuesto de test puedes perder sin hundirte.', { tipo: 'texto', pide: 'Tu compromiso' }),
  D(2, 1, 'Qué es afiliados (y qué no)', '9 min', 'Los cuatro actores, cómo fluye el dinero y las piezas reales del negocio.', 'F01', 'Eres operador, no influencer.', 'Escribe tu definición de afiliados en una frase.', { tipo: 'texto', pide: 'Tu definición' }),
  D(3, 1, 'Cómo te pagan', '9 min', 'CPA, CPL, RevShare e híbridos: qué paga cada uno y cuándo cobras.', 'F02', 'Te pagan por resultados, no por esfuerzo.', 'Busca tres ofertas y apunta de cada una el modelo y la acción que pagan.', { tipo: 'texto', pide: 'Tus tres ofertas' }),
  D(4, 1, 'Cómo leer una oferta', '8 min', 'Aprobación, hold, geo, fuentes permitidas y las señales de alerta de una ficha.', 'F02', 'El número grande del banner miente.', 'Completa la tabla de ayer con geo, hold y «me conviene porque…».', { tipo: 'texto', pide: 'La tabla completa' }),
  D(5, 1, 'El embudo en una página', '10 min', 'Los siete bloques, de la fuente de tráfico al pago, y la métrica de cada uno.', 'F03', 'Piensa en sistema, no en anuncios.', 'Dibuja tu embudo con la herramienta y la métrica de cada bloque.', { tipo: 'captura', pide: 'Foto de tu embudo' }),
  D(6, 1, 'Elige vertical', '9 min', 'El scorecard de seis criterios. Un bloqueante descalifica aunque la media salga bonita.', 'F04', 'Criterio en frío, no pantallazos de Telegram.', 'Puntúa de dos a cuatro verticales en los seis criterios.', { tipo: 'texto', pide: 'Tu scorecard' }),
  D(7, 1, 'Elige tu oferta', '7 min', 'Una vertical, una oferta. Cómo pedir el alta en una red o usar una oferta de la casa.', 'F04', 'Foco: una, no tres.', 'Elige tu oferta y pide el alta.', { tipo: 'captura', pide: 'Captura de la solicitud o del enlace de la oferta' }),

  D(8, 2, 'Tracking que no te engaña', '10 min', 'Click ID, UTM, píxel, postback y pending, sin pedantería.', 'F05', 'Creer no es un KPI.', 'Escribe tu convención de nombres y los parámetros que llevará cada enlace.', { tipo: 'texto', pide: 'Tu convención' }),
  D(9, 2, 'Monta tu tracker', '9 min', 'El tracker mínimo y cómo sacar el enlace de seguimiento de tu oferta.', 'F05 · F07', 'Hecho al 80 % gana a perfecto en el cajón.', 'Crea el tracker y genera el enlace de tu oferta.', { tipo: 'captura', pide: 'Captura del tracker con tu enlace' }),
  D(10, 2, 'Tu cuenta de anuncios', '10 min', 'Business Manager, método de pago, píxel y cómo nombrar las campañas.', 'F07 · A04', 'Una plataforma bien antes que cinco mal.', 'Deja la cuenta lista y el píxel instalado.', { tipo: 'captura', pide: 'Captura de la cuenta y el píxel' }),
  D(11, 2, 'Legal en diez minutos', '10 min', 'Publicidad identificable, disclaimers y las frases que te queman la cuenta.', 'F06', 'Cumplir es lo que te deja seguir operando.', 'Escribe tu disclaimer y cinco frases que no vas a usar nunca.', { tipo: 'texto', pide: 'Disclaimer y lista negra' }),
  D(12, 2, '¿Landing o directo?', '9 min', 'Cuándo hace falta una página propia y la estructura mínima que convierte.', 'F03 · A03', 'Tu página es una promesa.', 'Monta una landing simple o decide ir directo a la oferta, y explica por qué.', { tipo: 'enlace', pide: 'Enlace a tu landing (o tu decisión)' }),
  D(13, 2, 'Prueba la cadena', '8 min', 'El protocolo: clic de prueba, conversión de prueba y postback.', 'F05', 'Comprueba antes de confiar.', 'Haz el clic y la conversión de prueba.', { tipo: 'captura', pide: 'Capturas de la prueba' }),
  D(14, 2, 'La cadena vive', '7 min', 'Repaso de la semana y qué hacer si los números no cuadran.', 'F05', 'La mayoría nunca llega aquí.', 'Deja el postback verificado: el mismo click ID en el tracker y en la red.', { tipo: 'captura', pide: 'Captura del tracker y de la red', revision: true }, { hito: 'Postback verificado' }),

  D(15, 3, 'Cara o avatar, en diez minutos', '10 min', 'El camino que puedes sostener: el set mínimo para grabarte o el avatar mínimo.', 'A01 · T01', 'Gana la constancia, no la valentía.', 'Elige tu camino y graba una toma de prueba de veinte segundos.', { tipo: 'enlace', pide: 'Enlace a tu toma de prueba' }),
  D(16, 3, 'Ángulos y hooks', '9 min', 'Ángulo no es lo mismo que hook. Los siete tipos de hook que paran el dedo.', 'A02 · T03', 'Si abres con «hola», pagas para que te ignoren.', 'Escribe diez hooks: cinco de cada ángulo.', { tipo: 'texto', pide: 'Tus diez hooks' }),
  D(17, 3, 'El guion de 30 segundos', '8 min', 'Hook, problema, puente, llamada a la acción y disclaimer. Escribir para el oído.', 'A02', 'Publicado gana a perfecto.', 'Escribe el cuerpo de un guion de 30 segundos y pásale la checklist.', { tipo: 'texto', pide: 'Tu guion' }),
  D(18, 3, 'Produce tu lote', '10 min', 'Un lote es un cuerpo fijo con hooks que cambian. La plantilla del editor.', 'A03 · T03', 'Producir es repetir un proceso.', 'Produce cinco creatives.', { tipo: 'enlace', pide: 'Enlace a la carpeta con los cinco' }),
  D(19, 3, 'Control y reglas', '9 min', 'Revisión en móvil, reglas para matar, iterar o escalar, y el tope de gasto.', 'A03 · A04', 'Las reglas se escriben en frío.', 'Revisa los cinco en el móvil y escribe tus reglas y tu tope.', { tipo: 'texto', pide: 'Tus reglas y tu tope' }),
  D(20, 3, 'Lanza', '8 min', 'Cómo montar el test, subirlo y la checklist exprés antes de gastar.', 'A04', 'El dinero del test ya lo diste por gastado el día 1.', 'Lanza la campaña con el tope puesto.', { tipo: 'captura', pide: 'Captura de la campaña activa con el tope', revision: true }, { hito: 'Campaña lanzada' }),
  D(21, 3, 'No toques nada', '6 min', 'Qué mirar en las primeras 72 horas y qué no tocar.', 'A04', 'Mirar el panel cada diez minutos es ansiedad.', 'Haz tu primera anotación en la hoja de dinero.', { tipo: 'captura', pide: 'Captura de la hoja' }),

  D(22, 4, 'Lee tus números', '9 min', 'CPC, CTR, conversión de la landing, conversión de la oferta y EPC.', 'F03', 'Datos, no sensaciones.', 'Apunta tus métricas en la tabla.', { tipo: 'captura', pide: 'Captura de tus métricas' }),
  D(23, 4, '¿Dónde se cae la gente?', '9 min', 'Diagnóstico por bloque: los tres escenarios que vas a vivir.', 'F03', 'Si sabes por qué pierdes, has comprado un dato.', 'Escribe en qué bloque se cae la gente y qué vas a cambiar.', { tipo: 'texto', pide: 'Tu diagnóstico' }),
  D(24, 4, 'Itera el hook', '8 min', 'Mismo ángulo, hooks nuevos. Una variable por cambio.', 'A04', 'Itera el mensaje, no el ego.', 'Produce un segundo lote de tres a cinco hooks.', { tipo: 'enlace', pide: 'Enlace al lote 2' }),
  D(25, 4, 'Arregla la página', '8 min', 'Coherencia entre anuncio, página y oferta. Los cinco casos de rotura.', 'A03', 'Si no convierte, mira el cable antes que el algoritmo.', 'Aplica el cambio o justifica por qué todo cuadra.', { tipo: 'texto', pide: 'Qué cambiaste' }),
  D(26, 4, 'Habla con tu manager', '7 min', 'Qué preguntarle y cómo, siempre con datos.', 'F02 · F06', 'Pregunta con números, no con enfado.', 'Envía el mensaje a tu manager.', { tipo: 'captura', pide: 'Captura del mensaje' }),
  D(27, 4, 'Pending no es dinero', '7 min', 'Pending, aprobada y rechazada. Las ventanas de atribución.', 'F05', 'No celebres lo que aún no está aprobado.', 'Revisa el estado de tus conversiones.', { tipo: 'captura', pide: 'Captura del panel de la red' }),
  D(28, 4, 'La semana que la mayoría abandona', '8 min', 'Por qué los primeros tests pierden y qué hacen los que siguen.', 'F08', 'Aquí empieza a haber menos competencia.', 'Escribe tu plan para los dos últimos días.', { tipo: 'texto', pide: 'Tu plan' }),
  D(29, 4, 'Empuja lo que funciona', '7 min', 'Subir poco a poco lo que tiene señal y matar lo que está muerto.', 'A04', 'Disciplina con las reglas, no con el impulso.', 'Haz el ajuste que dicen tus reglas.', { tipo: 'captura', pide: 'Captura del ajuste' }),
  D(30, 4, 'Tu primera conversión', '9 min', 'Balance de los 30 días y lo que viene después.', 'F08', 'Hace 30 días no sabías qué era un postback.', 'Sube tu primera conversión aprobada y tu informe de 30 días.', { tipo: 'captura', pide: 'Captura de la conversión aprobada en la red', revision: true }, { hito: 'Primera conversión' }),
]

export const HITOS = DIAS.filter((d) => d.hito).map((d) => d.n)

/* LOS RANGOS. `miembros` = cuántos lo tienen hoy (demo): se enseña para que se vea lo escaso que es cada uno.
   El aspecto de cada insignia vive en index.css (.ins.<k>). `color` = el tono base (para listas). `abre` = secciones de formación que se desbloquean al llegar. */
export const RANGOS = [
  { k: 'cola', nombre: 'Cola', color: '#2A2730', tinta: '#C7B38D', objeto: 'Entrada de papel', miembros: 214, hito: 'Completar el bootcamp con tu primera conversión aprobada', prueba: 'Las 30 pruebas entregadas y la captura de la conversión en la red', desbloquea: 'El bootcamp de 30 días y, desde el día 15, Hazlo con el avatar y Hazlo tú completos', abre: ['avatar', 'tu'] },
  { k: 'pista', nombre: 'Pista', color: '#ECE6DA', tinta: '#1A1712', objeto: 'Pulsera de tela blanca', miembros: 63, hito: '10 conversiones aprobadas', prueba: 'Captura del panel de la red con el acumulado', desbloquea: 'Testing y escala, y la grupal técnica semanal', abre: ['escala'] },
  { k: 'barra', nombre: 'Barra', color: '#3E5BE0', tinta: '#F4F6FF', objeto: 'Pulsera tejida azul', miembros: 22, hito: 'Un mes en break-even', prueba: 'Tu hoja de dinero, el panel de la red y el gasto del mismo mes', desbloquea: 'Entras en el Top 10 del mes y compites por los premios', abre: [] },
  { k: 'reservado', nombre: 'Reservado', color: '#9E2A3E', tinta: '#FBEFF1', objeto: 'Pulsera de terciopelo rojo', miembros: 9, hito: 'Tres meses seguidos en positivo', prueba: 'La hoja de dinero de los tres meses', desbloquea: 'Las verticales y la Q&A privada con el invitado del mes', abre: ['trading', 'apuestas', 'fitness', 'software'] },
  { k: 'vip', nombre: 'VIP', color: '#151417', tinta: '#E6D9BE', objeto: 'Pulsera de cuero negro', miembros: 3, hito: 'Margen mensual sostenido (cifra por fijar)', prueba: 'La hoja de dinero y el panel de la red', desbloquea: 'Un 1:1 trimestral con los gemelos', abre: [] },
  { k: 'palco', nombre: 'Palco', color: '#D9B45A', tinta: '#1C1608', objeto: 'Brazalete de oro numerado', miembros: 1, hito: 'Lo más alto', prueba: '—', desbloquea: 'El evento anual y el Hall of Fame', abre: [] },
]
