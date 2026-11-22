/* Publica en Instagram lo que toca hoy y responde comentarios que piden precio (API oficial de Meta, gratuita).
   Necesita el secreto IG_TOKEN en GitHub (token de usuario del sistema de Meta Business, sin vencimiento). IG_USER_ID es opcional:
   si falta, se busca con el token (página de Facebook vinculada). Sin token no hace nada (el plan y las imágenes siguen generándose).
   Uso: node ig/bin/publicar.js publicar | comentarios */
const fs = require("fs"), path = require("path"), C = require("./contenido.js");
const RAIZ = process.cwd(), PLAN = path.join(RAIZ, "ig/plan.json"), EST = path.join(RAIZ, "ig/estado.json");
const G = "https://graph.facebook.com/v21.0", TOKEN = process.env.IG_TOKEN || "";
const BASE = process.env.IG_IMG_BASE || "https://raw.githubusercontent.com/jmunozcea-hwf/hwf-apps/main/";
const leer = (f, d) => { try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch (e) { return d; } };
const est = leer(EST, {}); est.publicados = est.publicados || {}; est.respondidos = est.respondidos || []; est.errores = est.errores || [];
const guardar = () => { est.ultima = new Date().toISOString(); fs.writeFileSync(EST, JSON.stringify(est, null, 1)); };
const ahoraCL = () => { const d = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Santiago" })); return { f: d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"), h: String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0") }; };
const espera = ms => new Promise(r => setTimeout(r, ms));
async function api(ruta, params, metodo) {
  const u = new URL(G + ruta), body = new URLSearchParams(Object.assign({}, params, { access_token: TOKEN }));
  const r = metodo === "POST" ? await fetch(u, { method: "POST", body }) : await fetch(u + "?" + body);
  const j = await r.json().catch(() => ({})); if (!r.ok || j.error) throw new Error((j.error && j.error.message) || ("HTTP " + r.status)); return j;
}
async function cuenta() {
  if (process.env.IG_USER_ID) return process.env.IG_USER_ID;
  const j = await api("/me/accounts", { fields: "name,instagram_business_account{id,username}" });
  const p = (j.data || []).find(x => x.instagram_business_account); if (!p) throw new Error("El token no tiene una página de Facebook con cuenta de Instagram profesional vinculada.");
  est.cuenta = "@" + p.instagram_business_account.username; return p.instagram_business_account.id;
}
async function listo(id) { for (let k = 0; k < 20; k++) { const j = await api("/" + id, { fields: "status_code" }); if (j.status_code === "FINISHED") return; if (j.status_code === "ERROR") throw new Error("Meta no pudo procesar la imagen."); await espera(3000); } }
async function publicar() {
  const P = leer(PLAN, { items: [] }), { f, h } = ahoraCL(), ig = await cuenta(); est.conectado = true;
  for (const it of P.items) {
    if (it.fecha !== f || it.hora > h || est.publicados[it.id] || !(it.imgs || []).length) continue;
    try {
      const url = x => BASE + x, cap = [it.copy, (it.hashtags || []).join(" ")].filter(Boolean).join("\n\n");
      let cont;
      if (it.tipo === "historia") cont = (await api("/" + ig + "/media", { media_type: "STORIES", image_url: url(it.imgs[0]) }, "POST")).id;
      else if (it.imgs.length === 1) cont = (await api("/" + ig + "/media", { image_url: url(it.imgs[0]), caption: cap }, "POST")).id;
      else { const hijos = []; for (const x of it.imgs.slice(0, 10)) { const c = (await api("/" + ig + "/media", { image_url: url(x), is_carousel_item: "true" }, "POST")).id; await listo(c); hijos.push(c); }
        cont = (await api("/" + ig + "/media", { media_type: "CAROUSEL", children: hijos.join(","), caption: cap }, "POST")).id; }
      await listo(cont); const m = await api("/" + ig + "/media_publish", { creation_id: cont }, "POST");
      est.publicados[it.id] = { media: m.id, fecha: new Date().toISOString() }; console.log("publicado", it.id, m.id);
    } catch (e) { est.errores.unshift({ id: it.id, fecha: new Date().toISOString(), error: String(e.message).slice(0, 300) }); est.errores = est.errores.slice(0, 15); console.error("error", it.id, e.message); }
  }
}
/* comentarios que piden precio → respuesta pública estándar (una vez por comentario); nunca se dan precios en público */
const PIDE_PRECIO = /\b(precio|precios|valor|cu[aá]nto|vale|cuesta|costo|\$|mayorista|venden|despachan)\b/i;
async function comentarios() {
  const ig = await cuenta(); est.conectado = true; const yo = (await api("/" + ig, { fields: "username" })).username;
  const media = (await api("/" + ig + "/media", { fields: "id,timestamp", limit: "12" })).data || [];
  for (const m of media) {
    const cs = (await api("/" + m.id + "/comments", { fields: "id,text,username", limit: "50" })).data || [];
    for (const c of cs) {
      if (est.respondidos.includes(c.id) || c.username === yo || !PIDE_PRECIO.test(c.text || "")) continue;
      try { await api("/" + c.id + "/replies", { message: C.RESPUESTA_PRECIO.replace("{usuario}", c.username || "") }, "POST"); est.respondidos.push(c.id); console.log("respondido", c.id); }
      catch (e) { est.errores.unshift({ id: "comentario", fecha: new Date().toISOString(), error: String(e.message).slice(0, 300) }); }
    }
  }
  est.respondidos = est.respondidos.slice(-500);
}
(async () => {
  if (!TOKEN) { est.conectado = false; guardar(); console.log("Sin IG_TOKEN: no se publica (el plan y las imágenes quedan listos en ig/)."); return; }
  try { await (process.argv[2] === "comentarios" ? comentarios() : publicar()); }
  catch (e) { est.conectado = false; est.errores.unshift({ id: "conexión", fecha: new Date().toISOString(), error: String(e.message).slice(0, 300) }); est.errores = est.errores.slice(0, 15); console.error(e.message); }
  guardar();
})();
