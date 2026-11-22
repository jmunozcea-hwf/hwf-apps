/* Genera el plan de Instagram de @hwfchile para los próximos 14 días (se ejecuta en GitHub Actions, gratis).
   Pilares cada 2 semanas (10 piezas): 40 % venta y catálogo, 30 % valor para el negocio, 20 % rutas y bodega, 10 % historias.
   Semana A: lun venta · mié valor · jue historia · vie venta · sáb rutas/bodega
   Semana B: lun venta · mié valor · jue valor · vie línea de marca (carrusel) · sáb rutas/bodega
   Uso (desde la raíz de hwf-apps): node ig/bin/generar.js   → escribe ig/plan.json (las imágenes las crea render.js) */
const fs = require("fs"), path = require("path");
const C = require("./contenido.js");
const RAIZ = process.cwd(), PLAN = path.join(RAIZ, "ig/plan.json"), EST = path.join(RAIZ, "ig/estado.json");
const leer = (f, d) => { try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch (e) { return d; } };

/* fecha de Chile */
const hoyCL = () => new Date(new Date().toLocaleString("en-US", { timeZone: "America/Santiago" }));
const iso = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
const DIA = 864e5, semana = d => Math.floor((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / DIA + 3) / 7);   /* semanas desde un lunes */

const pub = leer(path.join(RAIZ, "datos/publicos.json"), { prods: [] });
const conFoto = (pub.prods || []).filter(p => fs.existsSync(path.join(RAIZ, "fotos", p.i + ".webp")));
/* prioridad: funcionales y marcas con más productos primero; nunca precios */
const orden = conFoto.slice().sort((a, b) => (b.tp === "Funcional") - (a.tp === "Funcional") || String(a.m).localeCompare(String(b.m)) || String(a.d).localeCompare(String(b.d)));
const marcas = Object.entries(conFoto.reduce((o, p) => { (o[p.m] = o[p.m] || []).push(p); return o; }, {})).filter(([m, L]) => m && L.length >= 4).sort((a, b) => b[1].length - a[1].length);
const tc = s => String(s || "").toLowerCase().replace(/(^|\s)\S/g, x => x.toUpperCase());
const chip = p => p.tp === "Funcional" ? "LÍNEA FUNCIONAL" : /Húmedo/i.test(p.g) ? "HÚMEDOS" : /Snack|Premio/i.test(p.g) ? "SNACKS Y PREMIOS" : /Arena/i.test(p.g) ? "ARENAS" : /Suplement/i.test(p.g) ? "SUPLEMENTOS" : String(p.g || "").toUpperCase();
const hashtags = (pilar, extra) => [...new Set(C.HASH.base.concat(C.HASH[pilar] || [], extra || []))].slice(0, 8);
const fill = (t, o) => t.replace(/\{(\w+)\}/g, (m, k) => o[k] || "");

function itemVenta(fecha, n, w) {
  if (!orden.length) return null;
  const p = orden[n % orden.length], region = C.REGIONES[w % C.REGIONES.length], g = fill(C.GANCHO_PROD[n % C.GANCHO_PROD.length], { region, marca: p.m, producto: p.d });
  return { tipo: "imagen", pilar: "Venta y catálogo", titulo: p.d, gancho: g,
    slides: [{ k: "prod", i: p.i, nombre: p.d, marca: p.m, chip: chip(p), gancho: g }],
    copy: `${g} 🐾\n\n${p.d} (${tc(p.m)}) ya está en nuestro catálogo mayorista para pet shops, veterinarias y almacenes. Lo despachamos en ruta desde Punta de Cortés, Rancagua, de Valparaíso a La Araucanía.\n\n👉 ¿Tienes un local? Escríbenos CATÁLOGO por DM o pide tu acceso en hwf.cl (link en la bio).`,
    hashtags: hashtags("venta", [C.HASH.region[region]]) };
}
function itemLinea(fecha, w) {
  if (!marcas.length) return null;
  const [m, L] = marcas[w % marcas.length], ps = L.slice(0, 4), g = fill(C.GANCHO_LINEA[w % C.GANCHO_LINEA.length], { marca: m });
  return { tipo: "carrusel", pilar: "Venta y catálogo", titulo: "Línea " + m, gancho: g,
    slides: [{ k: "portada", titulo: g, fotos: ps.map(p => p.i) }].concat(ps.map((p, i) => ({ k: "prod", i: p.i, nombre: p.d, marca: p.m, chip: chip(p), n: (i + 1) + "/" + ps.length })), [{ k: "cta", titulo: "Súmala a tu local", texto: "Pide tu acceso al catálogo con tus precios en hwf.cl o escríbenos CATÁLOGO por DM." }]),
    copy: `${g} 🐾\n\n${ps.map(p => "• " + p.d).join("\n")}\n\nRotación constante y reposición segura en tu día de ruta, de Valparaíso a La Araucanía.\n\n👉 Escríbenos CATÁLOGO por DM o entra a hwf.cl (link en la bio).`,
    hashtags: hashtags("venta", ["#" + String(m).replace(/[^A-Za-z0-9]/g, "")]) };
}
function itemValor(fecha, n) {
  const v = C.VALOR[n % C.VALOR.length];
  return { tipo: "carrusel", pilar: "Valor para tu negocio", titulo: v.t, gancho: v.t,
    slides: [{ k: "titulo", titulo: v.t }].concat(v.s.map((t, i) => ({ k: "tip", n: i + 1, texto: t })), [{ k: "cta", titulo: "¿Te sirvió?", texto: "Guárdalo y compártelo con tu equipo. Más herramientas para tu local en hwf.cl" }]),
    copy: `${v.t} 💡\n\n${v.s.map((t, i) => (i + 1) + ". " + t).join("\n")}\n\nEn HWF acompañamos a los pet shops y veterinarias de la zona centro-sur con abastecimiento confiable y asesoría.\n\n👉 Guarda este post y escríbenos CATÁLOGO por DM para conocer nuestras condiciones para comercios.`,
    hashtags: hashtags("valor") };
}
function itemSocial(fecha, n) {
  const s = C.SOCIAL[n % C.SOCIAL.length];
  return { tipo: "imagen", pilar: "Rutas y bodega", titulo: s.t, gancho: s.t,
    slides: [{ k: "ruta", titulo: s.t, texto: s.s, cta: s.cta, regiones: C.REGIONES }],
    copy: `${s.t} 🚚\n\n${s.s}\n\nRegiones: ${C.REGIONES.join(" · ")}.\n\n👉 ${s.cta}`, hashtags: hashtags("social", [C.HASH.region[C.REGIONES[n % C.REGIONES.length]]]) };
}
function itemHistoria(fecha, n) {
  const q = C.HISTORIAS[n % C.HISTORIAS.length];
  return { tipo: "historia", pilar: "Interacción", titulo: q, gancho: q, slides: [{ k: "historia", texto: q }], copy: "", hashtags: [] };
}

function plan() {
  const hoy = hoyCL(), ant = leer(PLAN, { items: [] }), est = leer(EST, { publicados: {} }), porId = {};
  (ant.items || []).forEach(x => { porId[x.id] = x; });
  const items = [], corte = iso(new Date(hoy.getTime() - 30 * DIA));
  (ant.items || []).forEach(x => { if (x.fecha >= corte && x.fecha <= iso(hoy)) items.push(x); });   /* historial reciente */
  for (let k = 1; k <= 14; k++) {
    const d = new Date(hoy.getTime() + k * DIA), f = iso(d), dow = d.getDay(), w = semana(d), B = w % 2 === 1;
    const piezas = [];
    if (dow === 1) piezas.push(["v", "12:30", () => itemVenta(f, w * 2, w)]);
    if (dow === 3) piezas.push(["a", "19:00", () => itemValor(f, w * 3)]);
    if (dow === 4) piezas.push(B ? ["a2", "19:00", () => itemValor(f, w * 3 + 1)] : ["h", "13:00", () => itemHistoria(f, w)]);
    if (dow === 5) piezas.push(B ? ["l", "12:30", () => itemLinea(f, w)] : ["v2", "12:30", () => itemVenta(f, w * 2 + 1, w + 3)]);
    if (dow === 6) piezas.push(["s", "11:00", () => itemSocial(f, w)]);
    piezas.forEach(([suf, hora, fn]) => { const id = f + "-" + suf;
      if (porId[id] && porId[id].fecha > iso(hoy)) { items.push(porId[id]); return; }   /* ya planificado: se mantiene (y su imagen) */
      const it = fn(); if (it) items.push(Object.assign({ id, fecha: f, hora }, it, { imgs: [] })); });
  }
  items.forEach(x => { if (est.publicados && est.publicados[x.id]) x.estado = "publicado"; else if (!x.estado || x.estado !== "publicado") x.estado = x.fecha < iso(hoy) ? "no publicado" : "pendiente"; });
  const out = { generado: new Date().toISOString(), zona: "America/Santiago", cuenta: "@hwfchile", items: items.sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora)),
    respuestasDM: C.RESPUESTAS_DM };
  fs.mkdirSync(path.dirname(PLAN), { recursive: true }); fs.writeFileSync(PLAN, JSON.stringify(out, null, 1));
  console.log("plan:", out.items.length, "piezas ·", out.items.filter(x => x.estado === "pendiente").length, "pendientes");
}
plan();
