/* Dibuja las imágenes de ig/plan.json con la marca HWF (Playwright + Chromium, en GitHub Actions).
   Feed 1080×1350 (4:5) e historias 1080×1920. Solo dibuja lo que falta. Uso: node ig/bin/render.js */
const fs = require("fs"), path = require("path"), { chromium } = require("playwright");
const RAIZ = process.cwd(), PLAN = path.join(RAIZ, "ig/plan.json"), DIR = path.join(RAIZ, "ig/img");
const LOGO = fs.readFileSync(path.join(__dirname, "logo.svg"), "utf8");
const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const foto = i => { try { return "data:image/webp;base64," + fs.readFileSync(path.join(RAIZ, "fotos", i + ".webp")).toString("base64"); } catch (e) { return ""; } };   /* incrustada: Chromium no carga file:// desde setContent */
const CSS = `*{box-sizing:border-box;margin:0}body{width:1080px;height:var(--h);font-family:Nunito,Arial,sans-serif;color:#fff;overflow:hidden}
.f{position:relative;width:1080px;height:var(--h);background:linear-gradient(150deg,#0B3146 0%,#164560 60%,#1D5A78 100%);padding:70px}
.f.cl{background:#F4F8FA;color:#0B3146}.circ{position:absolute;border-radius:50%;background:#80C6C9;opacity:.16}
.logo{position:absolute;top:60px;left:70px;width:150px}.logo svg{width:100%;height:auto}.f.cl .logo svg *{fill:#0B3146}
.pie{position:absolute;left:0;right:0;bottom:0;height:110px;background:#80C6C9;color:#0B3146;display:flex;align-items:center;justify-content:space-between;padding:0 70px;font-weight:800;font-size:30px}
.pie b{font-size:40px;font-weight:900}.chip{display:inline-block;background:#26A69A;color:#fff;border-radius:999px;padding:12px 28px;font-weight:900;font-size:28px;letter-spacing:2px}
.card{background:#fff;border-radius:44px;display:flex;align-items:center;justify-content:center;box-shadow:0 30px 60px rgba(0,0,0,.25)}
.card img{max-width:88%;max-height:88%;object-fit:contain}h1{font-weight:900;line-height:1.05}.marca{color:#80C6C9;font-weight:900;letter-spacing:4px;font-size:34px}
.num{position:absolute;top:66px;right:70px;font-weight:900;font-size:30px;opacity:.8}`;
const pie = `<div class="pie"><span>Distribución mayorista · Valparaíso a La Araucanía</span><b>hwf.cl</b></div>`;
const marco = (h, cl, body) => `<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap" rel="stylesheet"><style>${CSS}</style></head><body style="--h:${h}px"><div class="f ${cl || ""}" style="--h:${h}px"><div class="circ" style="width:520px;height:520px;right:-180px;top:-160px"></div><div class="circ" style="width:380px;height:380px;left:-160px;bottom:40px;opacity:.09"></div><div class="logo">${LOGO}</div>${body}</div></body></html>`;

function html(s, H) {
  if (s.k === "prod") return marco(H, "", `${s.n ? `<div class="num">${esc(s.n)}</div>` : ""}<div style="position:absolute;top:190px;left:70px;right:70px"><span class="chip">${esc(s.chip || "")}</span></div>
    <div class="card" style="position:absolute;top:280px;left:150px;width:780px;height:640px"><img src="${foto(s.i)}"></div>
    <div style="position:absolute;left:70px;right:70px;top:960px"><div class="marca">${esc(s.marca)}</div><h1 style="font-size:${s.nombre.length > 34 ? 56 : 68}px;margin-top:10px">${esc(s.nombre)}</h1>
    <p style="font-size:32px;margin-top:14px;opacity:.9;font-weight:700">${esc(s.gancho ? "Disponible para tu local · pídelo en tu ruta" : "Disponible para tu local")}</p></div>${pie}`);
  if (s.k === "portada") return marco(H, "", `<div style="position:absolute;top:200px;left:70px;right:70px"><h1 style="font-size:76px">${esc(s.titulo)}</h1></div>
    <div style="position:absolute;top:520px;left:70px;right:70px;display:grid;grid-template-columns:1fr 1fr;gap:28px">${s.fotos.map(i => `<div class="card" style="height:300px;border-radius:32px"><img src="${foto(i)}"></div>`).join("")}</div>
    <p style="position:absolute;bottom:150px;left:70px;font-size:34px;font-weight:800">Desliza →</p>${pie}`);
  if (s.k === "titulo") return marco(H, "", `<div style="position:absolute;top:300px;left:70px;right:70px"><span class="chip">PARA TU NEGOCIO</span><h1 style="font-size:92px;margin-top:40px">${esc(s.titulo)}</h1>
    <p style="font-size:38px;margin-top:40px;font-weight:800;color:#80C6C9">Desliza y guárdalo →</p></div>${pie}`);
  if (s.k === "tip") return marco(H, "cl", `<div style="position:absolute;top:260px;left:70px;right:70px"><div style="width:150px;height:150px;border-radius:50%;background:#0B3146;color:#fff;display:flex;align-items:center;justify-content:center;font-size:84px;font-weight:900">${s.n}</div>
    <p style="font-size:${s.texto.length > 110 ? 56 : 64}px;font-weight:900;line-height:1.2;margin-top:60px">${esc(s.texto)}</p></div>${pie}`);
  if (s.k === "cta") return marco(H, "", `<div style="position:absolute;top:340px;left:70px;right:70px;text-align:center"><h1 style="font-size:92px">${esc(s.titulo)}</h1>
    <p style="font-size:44px;margin-top:40px;font-weight:800;line-height:1.3">${esc(s.texto)}</p><p style="margin-top:60px"><span class="chip" style="font-size:40px;padding:20px 44px">Escríbenos CATÁLOGO</span></p></div>${pie}`);
  if (s.k === "ruta") return marco(H, "", `<div style="position:absolute;top:200px;left:70px;right:70px"><span class="chip">RUTAS HWF</span><h1 style="font-size:78px;margin-top:30px">${esc(s.titulo)}</h1>
    <p style="font-size:36px;margin-top:24px;font-weight:700;line-height:1.3;opacity:.95">${esc(s.texto)}</p>
    <div style="margin-top:46px;display:grid;gap:14px">${s.regiones.map((r, i) => `<div style="display:flex;align-items:center;gap:20px;font-size:38px;font-weight:900"><span style="width:26px;height:26px;border-radius:50%;background:${r === "O'Higgins" ? "#FFB547" : "#80C6C9"}"></span>${esc(r)}${r === "O'Higgins" ? '<span style="font-size:26px;font-weight:800;opacity:.85">· centro de distribución Punta de Cortés</span>' : ""}</div>`).join("")}</div>
    <p style="font-size:32px;margin-top:40px;font-weight:800;color:#80C6C9">${esc(s.cta)}</p></div>${pie}`);
  if (s.k === "historia") return marco(H, "", `<div style="position:absolute;top:560px;left:80px;right:80px;text-align:center"><h1 style="font-size:96px;line-height:1.12">${esc(s.texto)}</h1>
    <p style="margin-top:80px"><span class="chip" style="font-size:44px;padding:22px 50px">Respóndenos por DM 📩</span></p></div>
    <div style="position:absolute;bottom:140px;left:0;right:0;text-align:center;font-size:36px;font-weight:800;opacity:.9">Distribución mayorista · Valparaíso a La Araucanía · hwf.cl</div>`);
  return marco(H, "", "");
}

(async () => {
  const P = JSON.parse(fs.readFileSync(PLAN, "utf8")); fs.mkdirSync(DIR, { recursive: true });
  const b = await chromium.launch(); let n = 0;
  for (const it of P.items) {
    if (it.estado === "publicado") continue;
    const H = it.tipo === "historia" ? 1920 : 1350, imgs = it.slides.map((s, j) => `ig/img/${it.id}-${j + 1}.jpg`);
    if (it.imgs && it.imgs.length === imgs.length && imgs.every(f => fs.existsSync(path.join(RAIZ, f)))) continue;
    const pg = await b.newPage({ viewport: { width: 1080, height: H } });
    for (let j = 0; j < it.slides.length; j++) { await pg.setContent(html(it.slides[j], H), { waitUntil: "networkidle" }).catch(() => {}); await pg.waitForTimeout(300);
      await pg.screenshot({ path: path.join(RAIZ, imgs[j]), type: "jpeg", quality: 88 }); n++; }
    await pg.close(); it.imgs = imgs;
  }
  await b.close();
  /* borra imágenes de piezas que ya no están en el plan */
  const vivas = new Set(P.items.flatMap(x => x.imgs || []).map(f => path.basename(f)));
  fs.readdirSync(DIR).forEach(f => { if (!vivas.has(f)) fs.unlinkSync(path.join(DIR, f)); });
  fs.writeFileSync(PLAN, JSON.stringify(P, null, 1)); console.log("imágenes nuevas:", n);
})();
