// ==============================
// CONFIG (URLs + metas)
// ==============================

// Ranking CSV: 2 colunas (nome,pontos)
const RANKING_CONFIG = {
    captacao: {
      url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQHJ97WjbyXjgGr3MS_OqSzg2lkNzjceRpOWfy5leuu3nSZ7Ol-peDF2TwpkuBrlfNOXnxPwsTXpphM/pub?gid=67876576&single=true&output=csv",
      storageKey: "prev_rank_captacao",
      elRankingId: "ranking_captacao",
      elStatusId: "status_captacao",
      elErroId: "erro_captacao",
    },
    onboarding: {
      url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQHJ97WjbyXjgGr3MS_OqSzg2lkNzjceRpOWfy5leuu3nSZ7Ol-peDF2TwpkuBrlfNOXnxPwsTXpphM/pub?gid=453024427&single=true&output=csv",
      storageKey: "prev_rank_onboarding",
      elRankingId: "ranking_onboarding",
      elStatusId: "status_onboarding",
      elErroId: "erro_onboarding",
    },
  
    // TikTok Shop: ranking a partir do CSV bruto (sem "url" aqui)
    tiktokshop: {
      storageKey: "prev_rank_tiktokshop",
      elRankingId: "ranking_tiktokshop",
      elStatusId: "status_tiktokshop",
      elErroId: "erro_tiktokshop",
    },
  };
  
  // KPI CSV: (para os KPIs que ainda usam CSV pronto)
  const KPI_CONFIG = {
    captacao: {
      url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQHJ97WjbyXjgGr3MS_OqSzg2lkNzjceRpOWfy5leuu3nSZ7Ol-peDF2TwpkuBrlfNOXnxPwsTXpphM/pub?gid=1830633043&single=true&output=csv",
    },
  };
  
  // ⚠️ URL CSV da aba bruta "Influencers" (publicada como CSV)
  const INFLUENCERS_RAW_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQHJ97WjbyXjgGr3MS_OqSzg2lkNzjceRpOWfy5leuu3nSZ7Ol-peDF2TwpkuBrlfNOXnxPwsTXpphM/pub?gid=2031658156&single=true&output=csv";
  
  // ⚠️ URL CSV da aba bruta TikTok Shop (publicada como CSV)
  const TIKTOKSHOP_RAW_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTGnEsT1usFZdnEsNENRR7WzEVikYU2Dm8QGE-j75-DkXAAK72X7WDyhWtt9O_Znj9hplUUWNtqP8Pi/pub?gid=1182443014&single=true&output=csv";
  
  // ⚠️ URL CSV da aba bruta TikTok Shop ONBOARDING
  const TIKTOKSHOP_ONBOARDING_RAW_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTGnEsT1usFZdnEsNENRR7WzEVikYU2Dm8QGE-j75-DkXAAK72X7WDyhWtt9O_Znj9hplUUWNtqP8Pi/pub?gid=2005072206&single=true&output=csv";
  
  // metas
  const GOALS = {
    captacao: { daily: 20, monthly: 400 },
  
    // ✅ FINANCEIRO (USD) – metas intermediárias no arco mensal
    financeiro: {
      daily: 500,
      monthlyTiers: [7200, 8400, 10000], // meta final
    },
  
    tiktokshop: { daily: 20, monthly: 400 },
    tiktokshop_onboarding: { daily: 5, monthly: 135 },
  };
  
  // refresh
  const REFRESH_EVERY_MS = 60000;
  
  // Fotos locais (usado nos rankings)
  const PHOTO_MAP = {
    "ana clara": "./assets/analysts/ana.svg",
    "katheleen beanucci": "./assets/analysts/katheleen.svg",
    "beatriz pelicci": "./assets/analysts/beatriz.svg",
    "giovanna": "./assets/analysts/giovanna.svg",
    "piloto": "./assets/analysts/piloto.svg",
  };
  const DEFAULT_AVATAR = "./assets/analysts/default.svg";
  
  // Setas
  const ARROW_UP_SVG = `
  <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 11L11.0365 1" stroke="#D4EC00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M1 1H11.0365V11" stroke="#D4EC00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  `;
  const ARROW_DOWN_SVG = `
  <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 1L11.0365 11" stroke="#F00304" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M11.0365 1V11H1" stroke="#F00304" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  `;
  
  // ==============================
  // TOPBAR
  // ==============================
  const elGlobalLastUpdate = document.getElementById("globalLastUpdate");
  const btnRefreshGlobal = document.getElementById("btnRefreshGlobal");
  
  function setGlobalLastUpdate() {
    const now = new Date();
    if (elGlobalLastUpdate) {
      elGlobalLastUpdate.textContent = `Última atualização: ${now.toLocaleString("pt-BR")}`;
    }
  }
  
  // ==============================
  // Utils
  // ==============================
  function withCacheBuster(url) {
    const u = new URL(String(url));
    u.searchParams.set("t", String(Date.now()));
    return u.toString();
  }
  
  function parseCSV(text) {
    text = String(text || "").replace(/^\uFEFF/, "");
    text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  
    const firstLine = text.split("\n")[0] || "";
    const commaCount = (firstLine.match(/,/g) || []).length;
    const semiCount = (firstLine.match(/;/g) || []).length;
    const DELIM = semiCount > commaCount ? ";" : ",";
  
    const rows = [];
    let row = [];
    let cell = "";
    let inQuotes = false;
  
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const next = text[i + 1];
  
      if (char === '"' && inQuotes && next === '"') {
        cell += '"';
        i++;
      } else if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === DELIM && !inQuotes) {
        row.push(cell);
        cell = "";
      } else if (char === "\n" && !inQuotes) {
        row.push(cell);
        rows.push(row);
        row = [];
        cell = "";
      } else {
        cell += char;
      }
    }
    if (cell.length || row.length) {
      row.push(cell);
      rows.push(row);
    }
    return rows;
  }
  
  function normalizeKey(nome) {
    return String(nome || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ");
  }
  
  function safeNumber(v) {
    const s = String(v ?? "").trim();
    if (!s) return 0;
  
    const cleaned = s
      .replace(/[^\d,.\-]/g, "")
      .replace(/\.(?=\d{3}(\D|$))/g, "");
  
    if (cleaned.includes(",") && cleaned.includes(".")) {
      const n = Number(cleaned.replace(/\./g, "").replace(",", "."));
      return Number.isFinite(n) ? n : 0;
    }
  
    const n = Number(cleaned.replace(",", "."));
    return Number.isFinite(n) ? n : 0;
  }
  
  function loadPrevRanks(storageKey) {
    try {
      const raw = localStorage.getItem(storageKey);
      const parsed = raw ? JSON.parse(raw) : {};
  
      // Compat: formato antigo (number) -> novo objeto
      const out = {};
      for (const [k, v] of Object.entries(parsed || {})) {
        if (typeof v === "number") {
          out[k] = { rank: v, points: null, indicatorCls: "same" };
        } else if (v && typeof v === "object") {
          out[k] = {
            rank: Number(v.rank) || null,
            points: v.points != null && Number.isFinite(Number(v.points)) ? Number(v.points) : null,
            indicatorCls: v.indicatorCls || "same",
          };
        }
      }
      return out;
    } catch {
      return {};
    }
  }
  
  function savePrevRanks(storageKey, map) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(map));
    } catch {}
  }
  
  function getPhotoFor(nome) {
    const key = normalizeKey(nome);
    return PHOTO_MAP[key] || DEFAULT_AVATAR;
  }
  
  function getIndicatorClassAndHtmlPersistent(prevEntry, newRank, newPoints) {
    // 1º lugar sempre UP
    if (newRank === 1) return { cls: "up", html: ARROW_UP_SVG };
  
    // sem histórico
    if (!prevEntry || !prevEntry.rank) return { cls: "same", html: "-" };
  
    const prevRank = prevEntry.rank;
    const prevPoints =
      prevEntry.points != null && Number.isFinite(prevEntry.points) ? prevEntry.points : null;
  
    // mantém seta se rank e pontos não mudaram
    if (prevRank === newRank && prevPoints === newPoints) {
      const cls = prevEntry.indicatorCls || "same";
      if (cls === "up") return { cls: "up", html: ARROW_UP_SVG };
      if (cls === "down") return { cls: "down", html: ARROW_DOWN_SVG };
      return { cls: "same", html: "-" };
    }
  
    // regra normal por rank
    if (newRank < prevRank) return { cls: "up", html: ARROW_UP_SVG };
    if (newRank > prevRank) return { cls: "down", html: ARROW_DOWN_SVG };
    return { cls: "same", html: "-" };
  }
  
  function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = String(val);
  }
  
  const fmtBR = new Intl.NumberFormat("pt-BR");
  const fmtUSD = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  function moneyUSD(v) {
    const n = Number(v) || 0;
    return `$${fmtUSD.format(n)}`;
  }
  
  // ----- datas -----
  function toYMD(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }
  
  function addDays(d, days) {
    const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    x.setDate(x.getDate() + days);
    return x;
  }
  
  function parseDateCell(v) {
    const raw = String(v ?? "").trim();
    if (!raw) return null;
  
    // serial Sheets
    const asNum = Number(raw.replace(",", "."));
    if (Number.isFinite(asNum) && asNum > 20000 && asNum < 80000) {
      const ms = (asNum - 25569) * 86400 * 1000;
      const dt = new Date(ms + 12 * 60 * 60 * 1000);
      return isNaN(dt) ? null : dt;
    }
  
    // yyyy-mm-dd
    const mIso = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T\s].*)?$/);
    if (mIso) {
      const Y = Number(mIso[1]);
      const M = Number(mIso[2]);
      const D = Number(mIso[3]);
      return new Date(Y, M - 1, D);
    }
  
    // dd/mm/yyyy
    const mBR = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+.*)?$/);
    if (mBR) {
      const D = Number(mBR[1]);
      const M = Number(mBR[2]);
      const Y = Number(mBR[3]);
      return new Date(Y, M - 1, D);
    }
  
    const dt = new Date(raw);
    return isNaN(dt) ? null : dt;
  }
  
  // ==============================
  // Mini-cards (STAT)
  // ==============================
  
  // ✅ Criadores Ativos = total de linhas na aba de onboarding do TikTok Shop
  async function loadStatCriadoresAtivos() {
    const elValue = document.getElementById("statAtivosValue");
    const elStatus = document.getElementById("statAtivosStatus");
    const elErro = document.getElementById("statAtivosErro");
  
    if (elErro) elErro.style.display = "none";
    if (elStatus) elStatus.textContent = "Atualizando…";
  
    try {
      if (!TIKTOKSHOP_ONBOARDING_RAW_URL || !TIKTOKSHOP_ONBOARDING_RAW_URL.includes("output=csv")) {
        throw new Error("TIKTOKSHOP_ONBOARDING_RAW_URL inválida.");
      }
  
      const url = withCacheBuster(TIKTOKSHOP_ONBOARDING_RAW_URL);
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status);
  
      const csvText = await res.text();
      const table = parseCSV(csvText);
  
      const rows = table
        .slice(1)
        .filter(r => Array.isArray(r) && r.some(c => String(c ?? "").trim() !== ""));
  
      if (elValue) elValue.textContent = fmtBR.format(rows.length);
      if (elStatus) elStatus.textContent = " ";
    } catch (err) {
      console.error("Stat(criadores ativos) error:", err);
      if (elStatus) elStatus.textContent = "Falha ao atualizar.";
      if (elErro) elErro.style.display = "block";
    }
  }
  
  // Criadores captados (total) no TIKTOKSHOP_RAW_URL, considerando data na coluna A
  async function loadStatCriadoresCaptados() {
    const elValue = document.getElementById("statCaptadosValue");
    const elStatus = document.getElementById("statCaptadosStatus");
    const elErro = document.getElementById("statCaptadosErro");
  
    if (elErro) elErro.style.display = "none";
    if (elStatus) elStatus.textContent = "Atualizando…";
  
    try {
      if (!TIKTOKSHOP_RAW_URL || !TIKTOKSHOP_RAW_URL.includes("output=csv")) {
        throw new Error("TIKTOKSHOP_RAW_URL inválida.");
      }
  
      const url = withCacheBuster(TIKTOKSHOP_RAW_URL);
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status);
  
      const csvText = await res.text();
      const table = parseCSV(csvText);
      const rows = table.slice(1);
  
      const dateColIndex = 0;
      let total = 0;
  
      for (const r of rows) {
        const dt = parseDateCell(r?.[dateColIndex]);
        if (dt) total++;
      }
  
      if (elValue) elValue.textContent = fmtBR.format(total);
      if (elStatus) elStatus.textContent = " ";
    } catch (err) {
      console.error("Stat(criadores captados) error:", err);
      if (elStatus) elStatus.textContent = "Falha ao atualizar.";
      if (elErro) elErro.style.display = "block";
    }
  }
  
  // ==============================
  // Ranking (genérico: CSV 2 colunas) - seta persistente
  // ==============================
  async function loadRanking(key) {
    const cfg = RANKING_CONFIG[key];
    if (!cfg?.url) return;
  
    const elRanking = document.getElementById(cfg.elRankingId);
    const elStatus = document.getElementById(cfg.elStatusId);
    const elErro = document.getElementById(cfg.elErroId);
  
    if (!elRanking || !elStatus || !elErro) return;
  
    elErro.style.display = "none";
    elStatus.textContent = "Atualizando dados…";
  
    const prevRanks = loadPrevRanks(cfg.storageKey);
    const url = withCacheBuster(cfg.url);
  
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status);
  
      const csvText = await res.text();
      const table = parseCSV(csvText);
  
      const dataRows = table.slice(1).filter(r => r?.some(c => String(c || "").trim() !== ""));
  
      const captadores = dataRows
        .map(r => {
          const nome = (r?.[0] || "").trim();
          const pontos = safeNumber(r?.[1]);
          return { nome, pontos, key: normalizeKey(nome) };
        })
        .filter(c => c.nome);
  
      captadores.sort((a, b) => b.pontos - a.pontos);
  
      elRanking.innerHTML = "";
      const frag = document.createDocumentFragment();
      const newRanksToSave = {};
  
      captadores.forEach((c, index) => {
        const newRank = index + 1;
  
        const prevEntry = prevRanks[c.key];
        const indicator = getIndicatorClassAndHtmlPersistent(prevEntry, newRank, c.pontos);
  
        newRanksToSave[c.key] = {
          rank: newRank,
          points: c.pontos,
          indicatorCls: indicator.cls,
        };
  
        const item = document.createElement("div");
        item.className = "captador";
        item.innerHTML = `
          <div class="posicao">${newRank}</div>
          <div class="info">
            <img class="avatar" src="${getPhotoFor(c.nome)}" alt="${c.nome}"
                 onerror="this.onerror=null;this.src='${DEFAULT_AVATAR}'" />
            <div>
              <div class="nome">${c.nome}</div>
              <div class="pontos">${c.pontos} pontos</div>
            </div>
          </div>
          <div class="indicator ${indicator.cls}">${indicator.html || ""}</div>
        `;
  
        frag.appendChild(item);
      });
  
      elRanking.appendChild(frag);
      savePrevRanks(cfg.storageKey, newRanksToSave);
  
      elStatus.textContent = captadores.length ? " " : "Nenhum dado encontrado.";
    } catch (err) {
      console.error(`Ranking(${key}) error:`, err);
      elStatus.textContent = "Falha na atualização.";
      elErro.style.display = "block";
    }
  }
  
  // ==============================
  // KPI (Gauges)
  // ==============================
  const gauges = {};
  const ROTATION = -90;
  const CIRCUMFERENCE = 180;
  
  // ✅ Plugin: metas intermediárias + ghost da meta dinâmica atual
  const FinanceiroMonthlyMarksPlugin = {
    id: "financeiroMonthlyMarks",
    afterDatasetsDraw(chart) {
      const key = chart?.$key;
      if (key !== "financeiro") return;
  
      const tiers = GOALS.financeiro?.monthlyTiers || [];
      if (!tiers.length) return;
  
      const ctx = chart.ctx;
      const metaFinal = tiers[tiers.length - 1];
      const dynamicGoal = chart?.$financeiroDynamicGoal ?? tiers[0];
  
      const arc = chart.getDatasetMeta(0)?.data?.[0];
      if (!arc) return;
  
      const cx = arc.x;
      const cy = arc.y;
      const outer = arc.outerRadius;
      const inner = arc.innerRadius;
  
      const startRad = (ROTATION * Math.PI) / 180;
      const spanRad = (CIRCUMFERENCE * Math.PI) / 180;
  
      // ticks intermediários (7200 / 8400)
      ctx.save();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(255,255,255,.65)";
      ctx.fillStyle = "rgba(255,255,255,.85)";
      ctx.font = "700 10px Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
  
      for (const t of tiers.slice(0, -1)) {
        const pct = Math.max(0, Math.min(1, t / Math.max(1, metaFinal)));
        const ang = startRad + spanRad * pct;
  
        const x1 = cx + Math.cos(ang) * (outer - 2);
        const y1 = cy + Math.sin(ang) * (outer - 2);
        const x2 = cx + Math.cos(ang) * (outer + 6);
        const y2 = cy + Math.sin(ang) * (outer + 6);
  
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
  
        const xl = cx + Math.cos(ang) * (outer + 16);
        const yl = cy + Math.sin(ang) * (outer + 16);
  
        ctx.fillText(moneyUSD(t), xl, yl);
      }
      ctx.restore();
  
      // ghost mark: meta dinâmica atual
      const pctGoal = Math.max(0, Math.min(1, dynamicGoal / Math.max(1, metaFinal)));
      const angGoal = startRad + spanRad * pctGoal;
  
      const rGhost = (inner + outer) / 2;
      const ghostLen = (outer - inner) * 0.72;
  
      const xg1 = cx + Math.cos(angGoal) * (rGhost - ghostLen / 2);
      const yg1 = cy + Math.sin(angGoal) * (rGhost - ghostLen / 2);
      const xg2 = cx + Math.cos(angGoal) * (rGhost + ghostLen / 2);
      const yg2 = cy + Math.sin(angGoal) * (rGhost + ghostLen / 2);
  
      ctx.save();
      ctx.lineWidth = 3;
      ctx.strokeStyle = "rgba(255,255,255,.95)";
      ctx.shadowColor = "rgba(0,0,0,.35)";
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.moveTo(xg1, yg1);
      ctx.lineTo(xg2, yg2);
      ctx.stroke();
      ctx.restore();
    },
  };
  
  function initGaugeFor(key) {
    const canvas = document.getElementById(`gauge-${key}`);
    if (!canvas || !window.Chart) return;
  
    const ctx = canvas.getContext("2d");
  
    if (gauges[key]) {
      try { gauges[key].destroy(); } catch {}
      delete gauges[key];
    }
  
    // FINANCEIRO: mensal em tiers + diário
    if (key === "financeiro") {
      const tiers = GOALS.financeiro?.monthlyTiers || [7200, 8400, 10000];
      const metaFinal = tiers[tiers.length - 1];
  
      const chart = new Chart(ctx, {
        type: "doughnut",
        data: {
          datasets: [
            {
              label: "Mensal (tiers)",
              data: [0, 0, 0, metaFinal],
              backgroundColor: [
                "#d4ec00",
                "rgba(212,236,0,.55)",
                "rgba(212,236,0,.30)",
                "rgba(255,255,255,.18)",
              ],
              borderWidth: 0,
              borderRadius: 10,
              cutout: "90%",
              radius: "96%",
              rotation: ROTATION,
              circumference: CIRCUMFERENCE,
            },
            {
              label: "Diário",
              data: [0, 100],
              backgroundColor: ["#2f7bff", "rgba(255,255,255,.12)"],
              borderWidth: 0,
              borderRadius: 8,
              cutout: "78%",
              radius: "86%",
              rotation: ROTATION,
              circumference: CIRCUMFERENCE,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { enabled: false } },
        },
        plugins: [FinanceiroMonthlyMarksPlugin],
      });
  
      chart.$key = "financeiro";
      gauges[key] = chart;
      return;
    }
  
    // padrão: mensal + diário (percentuais)
    const chart = new Chart(ctx, {
      type: "doughnut",
      data: {
        datasets: [
          {
            label: "Mensal",
            data: [0, 100],
            backgroundColor: ["#d4ec00", "rgba(255,255,255,.18)"],
            borderWidth: 0,
            borderRadius: 10,
            cutout: "90%",
            radius: "96%",
            rotation: ROTATION,
            circumference: CIRCUMFERENCE,
          },
          {
            label: "Diário",
            data: [0, 100],
            backgroundColor: ["#2f7bff", "rgba(255,255,255,.12)"],
            borderWidth: 0,
            borderRadius: 8,
            cutout: "78%",
            radius: "86%",
            rotation: ROTATION,
            circumference: CIRCUMFERENCE,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
      },
    });
  
    chart.$key = key;
    gauges[key] = chart;
  }
  
  // ==============================
  // KPI - Captação (CSV topo + bruto Influencers)
  // ==============================
  async function getBrutoFromInfluencers({ dateColIndex, statusColIndex = null, statusMatch = null }) {
    if (!INFLUENCERS_RAW_URL || !INFLUENCERS_RAW_URL.includes("output=csv")) {
      throw new Error("INFLUENCERS_RAW_URL inválida.");
    }
  
    const url = withCacheBuster(INFLUENCERS_RAW_URL);
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
  
    const csvText = await res.text();
    const table = parseCSV(csvText);
    const rows = table.slice(1);
  
    const today = new Date();
    const todayYMD = toYMD(today);
    const monthKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  
    let hoje = 0;
    let mes = 0;
  
    for (const r of rows) {
      const dt = parseDateCell(r?.[dateColIndex]);
      if (!dt) continue;
  
      if (statusColIndex != null && statusMatch) {
        const st = String(r?.[statusColIndex] || "").trim().toLowerCase();
        if (st !== String(statusMatch).trim().toLowerCase()) continue;
      }
  
      const ymd = toYMD(dt);
      const mk = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
  
      if (ymd === todayYMD) hoje++;
      if (mk === monthKey) mes++;
    }
  
    return { hoje, mes };
  }
  
  function updateKpiUI(key, { hojeLista = 0, ontem = 0, semana = 0, hojeBruto = 0, mes = 0, metaDia = 0, metaMes = 0 }) {
    const chart = gauges[key];
  
    const pctDia = Math.max(0, Math.min(100, Math.round((hojeBruto / Math.max(1, metaDia)) * 100)));
    const pctMes = Math.max(0, Math.min(100, Math.round((mes / Math.max(1, metaMes)) * 100)));
  
    if (chart) {
      chart.data.datasets[0].data = [pctMes, 100 - pctMes];
      chart.data.datasets[1].data = [pctDia, 100 - pctDia];
      chart.update();
    }
  
    setText(`vHoje-${key}`, hojeLista);
    setText(`vOntem-${key}`, ontem);
    setText(`vSemana-${key}`, semana);
  
    setText(`kpiMonth-${key}`, mes);
    setText(`kpiMonthGoal-${key}`, metaMes);
    setText(`kpiToday-${key}`, hojeBruto);
    setText(`kpiDailyGoal-${key}`, metaDia);
  }
  
  async function loadKpi(key) {
    const cfg = KPI_CONFIG[key];
  
    const elStatus = document.getElementById(`kpiStatus-${key}`);
    const elErro = document.getElementById(`kpiErro-${key}`);
  
    if (elErro) elErro.style.display = "none";
    if (elStatus) elStatus.textContent = "Atualizando KPI…";
  
    try {
      if (!cfg?.url) throw new Error("KPI_CONFIG sem url para " + key);
  
      const url = withCacheBuster(cfg.url);
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status);
  
      const csvText = await res.text();
      const table = parseCSV(csvText);
  
      const map = { hoje: 0, ontem: 0, "semana passada": 0 };
      for (const r of table.slice(1)) {
        const label = String(r?.[0] || "").trim().toLowerCase().replace(/\s+/g, " ");
        const val = safeNumber(r?.[1]);
        if (label in map) map[label] = val;
      }
  
      const listHoje = map["hoje"] ?? 0;
      const listOntem = map["ontem"] ?? 0;
      const listSemana = map["semana passada"] ?? 0;
  
      const bruto = await getBrutoFromInfluencers({ dateColIndex: 0 });
  
      const metaDia = GOALS[key]?.daily ?? 0;
      const metaMes = GOALS[key]?.monthly ?? 0;
  
      updateKpiUI(key, {
        hojeLista: listHoje,
        ontem: listOntem,
        semana: listSemana,
        hojeBruto: bruto.hoje,
        mes: bruto.mes,
        metaDia,
        metaMes,
      });
  
      if (elStatus) elStatus.textContent = " ";
    } catch (err) {
      console.error(`KPI(${key}) error:`, err);
      if (elStatus) elStatus.textContent = "Falha ao atualizar KPI.";
      if (elErro) elErro.style.display = "block";
    }
  }
  
  // ==============================
  // KPI - FINANCEIRO (Topo) - USD
  // ==============================
  async function getFinanceiroFromInfluencers() {
    if (!INFLUENCERS_RAW_URL || !INFLUENCERS_RAW_URL.includes("output=csv")) {
      throw new Error("INFLUENCERS_RAW_URL inválida.");
    }
  
    const url = withCacheBuster(INFLUENCERS_RAW_URL);
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
  
    const csvText = await res.text();
    const table = parseCSV(csvText);
    const rows = table.slice(1);
  
    const USD_COL = 14;  // O
    const DATE_COL = 18; // S
  
    const today = new Date();
    const ymdToday = toYMD(today);
    const ymdYest = toYMD(addDays(today, -1));
    const ymdWeek = toYMD(addDays(today, -7));
  
    const monthKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  
    let vHoje = 0;
    let vOntem = 0;
    let vSemanaPassada = 0;
    let vMes = 0;
  
    for (const r of rows) {
      const dt = parseDateCell(r?.[DATE_COL]);
      if (!dt) continue;
  
      const val = safeNumber(r?.[USD_COL]);
  
      const ymd = toYMD(dt);
      const mk = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
  
      if (ymd === ymdToday) vHoje += val;
      if (ymd === ymdYest) vOntem += val;
      if (ymd === ymdWeek) vSemanaPassada += val;
      if (mk === monthKey) vMes += val;
    }
  
    return { vHoje, vOntem, vSemanaPassada, vMes };
  }
  
  function getFinanceiroMonthlyGoalDynamic(mesValue) {
    const tiers = GOALS.financeiro?.monthlyTiers || [7200, 8400, 10000];
    for (const t of tiers) {
      if (mesValue < t) return t;
    }
    return tiers[tiers.length - 1];
  }
  
  function updateFinanceiroUI({ hoje, ontem, semana, mes, metaDia, metaMesDynamic }) {
    const key = "financeiro";
    const chart = gauges[key];
    const tiers = GOALS.financeiro?.monthlyTiers || [7200, 8400, 10000];
    const metaFinal = tiers[tiers.length - 1];
  
    const pctDia = Math.max(0, Math.min(100, Math.round((hoje / Math.max(1, metaDia)) * 100)));
  
    if (chart) {
      const [t1, t2, t3] = tiers;
  
      const a = Math.max(0, Math.min(t1, mes));
      const b = Math.max(0, Math.min(t2 - t1, mes - t1));
      const c = Math.max(0, Math.min(t3 - t2, mes - t2));
      const rest = Math.max(0, metaFinal - (a + b + c));
  
      chart.data.datasets[0].data = [a, b, c, rest];
      chart.data.datasets[1].data = [pctDia, 100 - pctDia];
  
      chart.$financeiroDynamicGoal = metaMesDynamic;
      chart.update();
    }
  
    setText(`vHoje-${key}`, moneyUSD(hoje));
    setText(`vOntem-${key}`, moneyUSD(ontem));
    setText(`vSemana-${key}`, moneyUSD(semana));
  
    setText(`kpiMonth-${key}`, moneyUSD(mes));
    setText(`kpiMonthGoal-${key}`, moneyUSD(metaMesDynamic));
    setText(`kpiToday-${key}`, moneyUSD(hoje));
    setText(`kpiDailyGoal-${key}`, moneyUSD(metaDia));
  }
  
  async function loadKpiFinanceiro() {
    const key = "financeiro";
    const elStatus = document.getElementById(`kpiStatus-${key}`);
    const elErro = document.getElementById(`kpiErro-${key}`);
  
    const exists =
      document.getElementById(`gauge-${key}`) || document.getElementById(`kpiMonth-${key}`);
    if (!exists) return;
  
    if (elErro) elErro.style.display = "none";
    if (elStatus) elStatus.textContent = "Atualizando KPI…";
  
    try {
      const { vHoje, vOntem, vSemanaPassada, vMes } = await getFinanceiroFromInfluencers();
  
      const metaDia = GOALS.financeiro?.daily ?? 0;
      const metaMesDynamic = getFinanceiroMonthlyGoalDynamic(vMes);
  
      updateFinanceiroUI({
        hoje: vHoje,
        ontem: vOntem,
        semana: vSemanaPassada,
        mes: vMes,
        metaDia,
        metaMesDynamic,
      });
  
      if (elStatus) elStatus.textContent = " ";
    } catch (err) {
      console.error("KPI(financeiro) error:", err);
      if (elStatus) elStatus.textContent = "Falha ao atualizar KPI.";
      if (elErro) elErro.style.display = "block";
    }
  }
  
  // ==============================
  // TikTok Shop - Ranking (Data A, Analista K) - seta persistente
  // ==============================
  function isSameDayBR_onlyDateCell(dt) {
    const today = new Date();
    return toYMD(dt) === toYMD(today);
  }
  
  async function loadRankingTikTokShop() {
    const cfg = RANKING_CONFIG.tiktokshop;
  
    const elRanking = document.getElementById(cfg.elRankingId);
    const elStatus = document.getElementById(cfg.elStatusId);
    const elErro = document.getElementById(cfg.elErroId);
  
    if (!elRanking || !elStatus || !elErro) return;
  
    elErro.style.display = "none";
    elStatus.textContent = "Atualizando dados…";
  
    const prevRanks = loadPrevRanks(cfg.storageKey);
  
    try {
      if (!TIKTOKSHOP_RAW_URL || !TIKTOKSHOP_RAW_URL.includes("output=csv")) {
        elStatus.textContent = "URL do TikTok Shop inválida. Publique como CSV e cole a URL.";
        return;
      }
  
      const url = withCacheBuster(TIKTOKSHOP_RAW_URL);
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status);
  
      const csvText = await res.text();
      const table = parseCSV(csvText);
      const rows = table.slice(1);
  
      const dateColIndex = 0;     // A
      const analystColIndex = 10; // K
  
      const counts = new Map();
  
      for (const r of rows) {
        const dt = parseDateCell(r?.[dateColIndex]);
        if (!dt) continue;
        if (!isSameDayBR_onlyDateCell(dt)) continue;
  
        const analystName = String(r?.[analystColIndex] || "").trim();
        if (!analystName) continue;
  
        const k = normalizeKey(analystName);
        if (!counts.has(k)) counts.set(k, { nome: analystName, pontos: 1, key: k });
        else counts.get(k).pontos += 1;
      }
  
      const captadores = Array.from(counts.values()).sort((a, b) => b.pontos - a.pontos);
  
      elRanking.innerHTML = "";
      const frag = document.createDocumentFragment();
      const newRanksToSave = {};
  
      captadores.forEach((c, index) => {
        const newRank = index + 1;
  
        const prevEntry = prevRanks[c.key];
        const indicator = getIndicatorClassAndHtmlPersistent(prevEntry, newRank, c.pontos);
  
        newRanksToSave[c.key] = {
          rank: newRank,
          points: c.pontos,
          indicatorCls: indicator.cls,
        };
  
        const item = document.createElement("div");
        item.className = "captador";
        item.innerHTML = `
          <div class="posicao">${newRank}</div>
          <div class="info">
            <img class="avatar" src="${getPhotoFor(c.nome)}" alt="${c.nome}"
                 onerror="this.onerror=null;this.src='${DEFAULT_AVATAR}'" />
            <div>
              <div class="nome">${c.nome}</div>
              <div class="pontos">${c.pontos} pontos</div>
            </div>
          </div>
          <div class="indicator ${indicator.cls}">${indicator.html || ""}</div>
        `;
  
        frag.appendChild(item);
      });
  
      elRanking.appendChild(frag);
      savePrevRanks(cfg.storageKey, newRanksToSave);
  
      elStatus.textContent = captadores.length ? " " : "Nenhum dado encontrado hoje.";
    } catch (err) {
      console.error("Ranking(tiktokshop) error:", err);
      elStatus.textContent = "Falha na atualização.";
      elErro.style.display = "block";
    }
  }
  
  // ==============================
  // TikTok Shop - KPI (sem legenda)
  // ==============================
  async function getBrutoFromTikTokShop(urlCsv) {
    if (!urlCsv || !String(urlCsv).includes("output=csv")) {
      throw new Error("URL CSV inválida.");
    }
  
    const url = withCacheBuster(urlCsv);
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
  
    const csvText = await res.text();
    const table = parseCSV(csvText);
    const rows = table.slice(1);
  
    const today = new Date();
    const todayYMD = toYMD(today);
    const monthKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  
    let hoje = 0;
    let mes = 0;
  
    const dateColIndex = 0;
  
    for (const r of rows) {
      const dt = parseDateCell(r?.[dateColIndex]);
      if (!dt) continue;
  
      const ymd = toYMD(dt);
      const mk = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
  
      if (ymd === todayYMD) hoje++;
      if (mk === monthKey) mes++;
    }
  
    return { hoje, mes };
  }
  
  function updateGaugeOnly(key, { hoje, mes, metaDia, metaMes }) {
    setText(`kpiMonth-${key}`, mes);
    setText(`kpiMonthGoal-${key}`, metaMes);
    setText(`kpiToday-${key}`, hoje);
    setText(`kpiDailyGoal-${key}`, metaDia);
  
    const chart = gauges[key];
    const pctDia = Math.max(0, Math.min(100, Math.round((hoje / Math.max(1, metaDia)) * 100)));
    const pctMes = Math.max(0, Math.min(100, Math.round((mes / Math.max(1, metaMes)) * 100)));
  
    if (chart) {
      chart.data.datasets[0].data = [pctMes, 100 - pctMes];
      chart.data.datasets[1].data = [pctDia, 100 - pctDia];
      chart.update();
    }
  }
  
  async function loadKpiTikTokShop() {
    const elStatus = document.getElementById("kpiStatus-tiktokshop");
    const elErro = document.getElementById("kpiErro-tiktokshop");
  
    if (elErro) elErro.style.display = "none";
    if (elStatus) elStatus.textContent = "Atualizando KPI…";
  
    try {
      const bruto = await getBrutoFromTikTokShop(TIKTOKSHOP_RAW_URL);
      const metaDia = GOALS.tiktokshop?.daily ?? 0;
      const metaMes = GOALS.tiktokshop?.monthly ?? 0;
  
      updateGaugeOnly("tiktokshop", { hoje: bruto.hoje, mes: bruto.mes, metaDia, metaMes });
  
      if (elStatus) elStatus.textContent = " ";
    } catch (err) {
      console.error("KPI(tiktokshop) error:", err);
      if (elStatus) elStatus.textContent = "Falha ao atualizar KPI.";
      if (elErro) elErro.style.display = "block";
    }
  }
  
  async function loadKpiTikTokShopOnboarding() {
    const elStatus = document.getElementById("kpiStatus-tiktokshop-onboarding");
    const elErro = document.getElementById("kpiErro-tiktokshop-onboarding");
  
    if (elErro) elErro.style.display = "none";
    if (elStatus) elStatus.textContent = "Atualizando KPI…";
  
    try {
      const bruto = await getBrutoFromTikTokShop(TIKTOKSHOP_ONBOARDING_RAW_URL);
      const metaDia = GOALS.tiktokshop_onboarding?.daily ?? 0;
      const metaMes = GOALS.tiktokshop_onboarding?.monthly ?? 0;
  
      updateGaugeOnly("tiktokshop-onboarding", { hoje: bruto.hoje, mes: bruto.mes, metaDia, metaMes });
  
      if (elStatus) elStatus.textContent = " ";
    } catch (err) {
      console.error("KPI(tiktokshop-onboarding) error:", err);
      if (elStatus) elStatus.textContent = "Falha ao atualizar KPI.";
      if (elErro) elErro.style.display = "block";
    }
  }
  
  // ==============================
  // Refresh All
  // ==============================
  let isRefreshing = false;
  
  async function refreshAll() {
    if (isRefreshing) return;
    isRefreshing = true;
  
    try {
      const rankingKeys = Object.keys(RANKING_CONFIG);
      const kpiKeys = Object.keys(KPI_CONFIG);
  
      await Promise.allSettled([
        ...rankingKeys.map(k => loadRanking(k)),
        ...kpiKeys.map(k => loadKpi(k)),
  
        loadKpiFinanceiro(),
  
        loadRankingTikTokShop(),
        loadKpiTikTokShop(),
        loadKpiTikTokShopOnboarding(),
  
        loadStatCriadoresAtivos(),
        loadStatCriadoresCaptados(),
      ]);
  
      setGlobalLastUpdate();
    } finally {
      isRefreshing = false;
    }
  }
  
  if (btnRefreshGlobal) {
    btnRefreshGlobal.addEventListener("click", async () => {
      btnRefreshGlobal.disabled = true;
      btnRefreshGlobal.textContent = "Atualizando...";
      await refreshAll();
      btnRefreshGlobal.disabled = false;
      btnRefreshGlobal.textContent = "Atualizar";
    });
  }
  
  // ==============================
  // Init
  // ==============================
  ["captacao", "financeiro", "tiktokshop", "tiktokshop-onboarding"].forEach(k => initGaugeFor(k));
  
  refreshAll();
  setInterval(refreshAll, REFRESH_EVERY_MS);