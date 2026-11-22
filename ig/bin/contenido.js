/* Biblioteca de contenido de @hwfchile (Community Manager B2B, 22-11-2026).
   Reglas: 100 % B2B (pet shops, veterinarias, almacenes, agroveterinarias), sin precios en público, cobertura Valparaíso–La Araucanía,
   base en Punta de Cortés, Rancagua. Tono: asesor comercial chileno, cercano y resolutivo. CTA: link de la bio (hwf.cl), DM con palabra clave. */
const REGIONES = ["Valparaíso", "Metropolitana", "O'Higgins", "Maule", "Ñuble", "Biobío", "La Araucanía"];

/* hashtags: máximo 8 por pieza, mezcla rubro + B2B + ubicación */
const HASH = {
  base: ["#DistribuidoraMascotas", "#MayoristaMascotas", "#CanalTradicional", "#PetShopChile"],
  venta: ["#AlimentoParaMascotas", "#VeterinariasChile", "#StockParaTuLocal", "#ZonaCentroSur"],
  valor: ["#EmprendedoresPet", "#TipsPetShop", "#NegocioDeMascotas", "#ZonaCentroSur"],
  social: ["#Rancagua", "#LogisticaChile", "#DespachoMayorista", "#ZonaCentroSur"],
  region: { "Valparaíso": "#Valparaiso", "Metropolitana": "#Santiago", "O'Higgins": "#OHiggins", "Maule": "#Maule", "Ñuble": "#Nuble", "Biobío": "#Biobio", "La Araucanía": "#Araucania" }
};

/* ganchos para productos (venta y catálogo) */
const GANCHO_PROD = [
  "Lo que más están rotando los pet shops de {region} este mes",
  "¿Tu cliente pregunta por {marca}? Tenlo en tu estante",
  "Producto que se vende solo: {producto}",
  "Si tienes un local de mascotas, esto no te puede faltar",
  "Rotación alta, reposición segura: {producto}",
  "Tus clientes ya lo buscan: {marca}"
];
const GANCHO_LINEA = [
  "La línea {marca} completa para tu local",
  "Arma tu góndola {marca} con lo que más rota",
  "{marca}: lo que tus clientes ya están pidiendo"
];

/* carruseles de valor para el negocio (30 %): título + 3–4 consejos + cierre */
const VALOR = [
  { t: "3 errores de exhibición que te hacen perder ventas", s: ["Sacos en el suelo y sin precio visible: el cliente no pregunta, se va.", "Mezclar marcas sin orden: agrupa por especie, etapa y tamaño.", "Lo nuevo escondido: pon las novedades a la altura de los ojos, junto a caja."] },
  { t: "Cómo subir tu ticket promedio sin bajar precios", s: ["Ofrece el húmedo junto al seco: \"¿le llevas sus latas para la semana?\"", "Ten snacks y premios al lado de la caja.", "Sugiere el formato grande a clientes frecuentes: compra menos veces y te prefiere."] },
  { t: "Inventario sano: compra lo que rota, no lo que sobra", s: ["Revisa cada semana qué productos se venden más.", "Pide en base a tu venta de las últimas 4 semanas, no a ojo.", "Ten un mínimo de stock de tus 10 productos estrella: un quiebre es un cliente que se va a otro local."] },
  { t: "¿Por qué tener líneas funcionales en tu local?", s: ["Urinary, renal, piel sensible, control de peso: el cliente vuelve todos los meses.", "Margen más alto que la línea tradicional.", "La recomendación del veterinario trae clientes fieles a tu local."] },
  { t: "Gatos: la categoría que más crece en el canal tradicional", s: ["Más hogares con gatos en ciudades y departamentos.", "Arena, húmedo y snacks: tres compras recurrentes por cliente.", "Ten al menos una línea esterilizado y una urinaria."] },
  { t: "Cómo armar un pedido mayorista que no te deje sin stock", s: ["Separa alto, medio y bajo movimiento.", "Coordina tu pedido con el día de ruta de tu comuna.", "Ingresa tus pedidos en el portal hwf.cl/b2b a cualquier hora."] },
  { t: "Húmedos: la venta extra que muchos locales olvidan", s: ["El dueño que compra seco también compra húmedo si lo ve.", "Ponlos en la caja o en un exhibidor pequeño.", "Ideal para gatos mañosos, cachorros y adultos mayores."] },
  { t: "Fideliza a tu cliente con una buena recomendación", s: ["Pregunta especie, edad, tamaño y si tiene alguna condición.", "Recomienda la ración diaria correcta: el saco dura lo que debe.", "Anota qué compra cada cliente frecuente y avísale cuando llegue su marca."] },
  { t: "Temporada de calor: prepárate antes que tu competencia", s: ["Sube stock de arenas y húmedos: más consumo en verano.", "Antiparasitarios y snacks dentales se venden más.", "Cuida el almacenaje: sacos lejos del sol directo."] },
  { t: "Grain free y low grain: qué decirle a tu cliente", s: ["Grain free: sin cereales, para perros y gatos sensibles.", "Low grain: menos cereales, buen equilibrio precio–calidad.", "Ambas líneas fidelizan: el cliente que cambia y le va bien, no vuelve atrás."] }
];

/* rutas, bodega y prueba social (20 %) */
const SOCIAL = [
  { t: "Despachamos de Valparaíso a La Araucanía", s: "Rutas establecidas desde nuestro centro de distribución en Punta de Cortés, Rancagua.", cta: "Escríbenos RUTA por DM y te contamos el día de despacho en tu comuna." },
  { t: "Así salen los pedidos desde Punta de Cortés", s: "Preparamos y revisamos cada pedido para que llegue completo y a tiempo a tu local.", cta: "¿Quieres ser parte de nuestra ruta? Escríbenos RUTA por DM." },
  { t: "Tu proveedor no te puede fallar en la ruta", s: "Abastecimiento confiable para pet shops, veterinarias y almacenes de la zona centro-sur.", cta: "Pide tu acceso al catálogo mayorista en el link de la bio." },
  { t: "Más de 140 productos para tu local", s: "Alimentos secos y húmedos, snacks, arenas y suplementos de marcas que tus clientes ya buscan.", cta: "Revisa el catálogo con tus precios en hwf.cl (link en la bio)." },
  { t: "Pide a cualquier hora, recibe en tu ruta", s: "Con el portal Acceso Clientes de HWF ves tus precios, tus pedidos y lo que tienes por pagar.", cta: "Solicita tu acceso en hwf.cl/b2b." },
  { t: "Atención directa por región", s: "Un ejecutivo de ventas para tu zona, de Valparaíso a La Araucanía.", cta: "Escríbenos CATÁLOGO por DM con el nombre de tu local y tu comuna." }
];

/* historias de interacción (10 %): pregunta para responder por DM (la API no publica stickers de encuesta) */
const HISTORIAS = [
  "¿Desde qué región nos sigues? Respóndenos por DM 📍",
  "¿Qué línea te gustaría sumar a tu local? Seco, húmedo, snacks o arenas 👇",
  "¿Qué marca te piden más tus clientes y no tienes? Cuéntanos por DM",
  "¿Cada cuánto repones stock en tu local? Semanal, quincenal o mensual",
  "¿Tu local vende más para perros o para gatos? 🐶🐱",
  "¿Ya pides por el portal hwf.cl/b2b? Si no, escríbenos ACCESO",
  "¿Qué día te acomoda recibir tu pedido? Te contamos la ruta de tu comuna",
  "¿Te interesan las líneas funcionales (urinary, renal, piel)? Escríbenos FUNCIONAL"
];

/* comentarios: respuesta pública cuando piden precio (nunca precios en comentarios) */
const RESPUESTA_PRECIO = "¡Hola @{usuario}! 🐾 Somos distribuidores mayoristas para pet shops, veterinarias y almacenes. Si tienes un local, escríbenos por DM la palabra CATÁLOGO y te enviamos precios y condiciones. Si buscas para tu mascota, pregúntalo en tu pet shop o veterinaria de confianza 💙";

/* respuestas guardadas sugeridas para los DM (se cargan una vez en Instagram: Configuración → Herramientas para empresas → Respuestas guardadas) */
const RESPUESTAS_DM = [
  { atajo: "/local", texto: "¡Hola! Gracias por escribirnos 🐾 Para darte acceso a nuestro catálogo mayorista necesitamos: nombre de tu local, comuna/región y RUT o correo. Con eso te asignamos tu ejecutivo de zona y tu día de ruta." },
  { atajo: "/portal", texto: "Puedes ver el catálogo con tus precios y hacer pedidos a cualquier hora en hwf.cl/b2b. Solicitas tu acceso con tu RUT en un minuto." },
  { atajo: "/final", texto: "¡Hola! Muchas gracias por tu interés 💙 Somos distribuidores mayoristas y vendemos solo a comercios. Pregunta por nuestras marcas en el pet shop o veterinaria de tu comuna: si no las tienen, cuéntales de nosotros 😉" },
  { atajo: "/fuera", texto: "¡Gracias por escribirnos! Nuestra ruta propia va de Valparaíso a La Araucanía. Para otras zonas evaluamos envío por transporte externo: cuéntanos tu ciudad y el volumen aproximado de tu pedido." },
  { atajo: "/ruta", texto: "Despachamos desde Punta de Cortés, Rancagua, con rutas de Valparaíso a La Araucanía. Dinos tu comuna y te confirmamos tu día de despacho." }
];

module.exports = { REGIONES, HASH, GANCHO_PROD, GANCHO_LINEA, VALOR, SOCIAL, HISTORIAS, RESPUESTA_PRECIO, RESPUESTAS_DM };
