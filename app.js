const templates = {
  cleaning: "Termelés előtti frissítő takarítás",
  startup: "Műszakindítási üzemnapló",
  temperature: "Tárolás és maghőmérséklet ellenőrzés",
};

const PASSWORD_HASH = "48e67ab8284c0ec1b126e67644f0a90212e03019e2676d887a8c25b3a69865f4";
const AUTH_KEY = "kebproGeneratorAuthenticated";

const people = {
  leader: ["Fekete Roland"],
  quality: ["Gazdag Pálma"],
  operator: ["Fekete Roland"],
};

const cleaningAreas = [
  ["Betároló", "Megfelelő", "---------"],
  ["Alapanyag hűtő", "Megfelelő", "---------"],
  ["Üzemi folyosó", "Megfelelő", "---------"],
  ["Sütő helység", "Megfelelő", "---------"],
  ["Elősütött termék hűtőtároló", "Megfelelő", "---------"],
  ["Csomagoló", "Megfelelő", "---------"],
  ["Szennyes rekesztároló", "Megfelelő", "--------"],
  ["Rekeszmosó", "Megfelelő", "--------"],
  ["Tiszta rekesztároló", "Megfelelő", "---------"],
  ["Gyorsfagyasztó", "Megfelelő", "----------"],
  ["Fagyasztva tároló", "Megfelelő", "--------"],
  ["Kitároló", "Megfelelő", "-------"],
  ["Csomagolóanyag raktár", "Megfelelő", "--------"],
  ["Karton hajtogató", "Megfelelő", "--------"],
  ["Papírkarton tároló", "Megfelelő", "-------"],
  ["Szociális rész", "Megfelelő", "--------"],
  ["", "", ""],
  ["Rekeszmosás", "--------", "---------"],
];

const startupChecks = [
  ["Személyzet", ["Létszám rendelkezésre állása,", "Személyi higiénia, különös tekintettel a védőruházat patentjaira és a kiadott gumikesztyűkre."]],
  ["Alap- és csomagolóanyag", ["Mennyiség rendelkezésre állása,", "Minősége megfelelősége."]],
  ["Gépek, berendezések, eszközök állapota", ["Műszaki állapota,", "Csereeszközök megléte,", "Kések, ollók megléte, épsége."]],
  ["Üzemi külső környezet", ["Hulladék tárolás megfelelősége,", "Udvar tisztasága megfelelősége."]],
  ["Mérőeszközök", ["Mennyisége rendelkezésre állása,", "Műszerek kalibráltsága,", "Műszerek tisztasága."]],
  ["Higiéniai állapot", ["Termelőterület állapota,", "Gépek, berendezések állapota,", "Ládák, rekeszek, eszközök állapota."]],
  ["Üveg és kemény műanyag ellenőrzés", ["Üveg és kemény műanyag tárgyak, eszközök megléte,", "védelme, épsége"]],
];

const coldRooms = [
  ["Folyosó", "12 °C és alacsonyabb hőmérséklet", 8.4, 12.0],
  ["C-os alapanyag", "-2 °C - 4 °C", 0.2, 3.8],
  ["C-os elősütött kebab", "-2 °C - 4 °C", 0.1, 3.9],
  ["Csomagoló", "12 °C és alacsonyabb hőmérséklet", 8.5, 12.0],
  ["Gyorsfagyasztó tároló", "-20 °C és alacsonyabb hőmérséklet", -28.0, -20.0],
  ["Fagyasztó tároló", "-18 °C és alacsonyabb hőmérséklet", -24.0, -18.0],
];

const coreTemps = [
  ["Alapanyag", "Húsok: -2 °C - 4 °C", 0.0, 3.9],
  ["Elősütött termék", "Min. 72 °C", 72.0, 78.5],
  ["Csomagolás előtti elősütött termék", "12 °C alatti hőmérséklet", 7.0, 11.8],
  ["Fagyasztott termékek", "-18 °C és alacsonyabb hőmérséklet", -24.0, -18.0],
];

let currentData = null;

const els = {
  app: document.querySelector(".app-shell"),
  loginScreen: document.querySelector("#loginScreen"),
  loginForm: document.querySelector("#loginForm"),
  password: document.querySelector("#passwordInput"),
  loginError: document.querySelector("#loginError"),
  template: document.querySelector("#templateSelect"),
  date: document.querySelector("#dateInput"),
  preview: document.querySelector("#documentPreview"),
  generate: document.querySelector("#generateBtn"),
  print: document.querySelector("#printBtn"),
  downloadDoc: document.querySelector("#downloadDocBtn"),
};

function pad(value) {
  return String(value).padStart(2, "0");
}

function todayInputValue() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function formatHuDate(value) {
  const d = new Date(`${value}T00:00:00`);
  return `${d.getFullYear()}. ${pad(d.getMonth() + 1)}. ${pad(d.getDate())}.`;
}

function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function numberHu(value, decimals = 1) {
  return value.toFixed(decimals).replace(".", ",");
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function commonMeta() {
  return {
    template: els.template.value,
    templateName: templates[els.template.value],
    date: els.date.value,
    dateHu: formatHuDate(els.date.value),
    leader: randomItem(people.leader),
    quality: randomItem(people.quality),
    operator: randomItem(people.operator),
    generatedAt: new Date().toISOString(),
  };
}

function generateCleaning() {
  const data = commonMeta();
  data.conditionsReady = "igen";
  data.rows = cleaningAreas.map(([area, result, note]) => {
    return {
      area,
      result,
      note,
    };
  });
  data.noteLabel = "Megjegyzés : az ellenőrzés során feltárt nem – megfelelőség javítási módjának leírása.";
  return data;
}

function generateStartup() {
  const data = commonMeta();
  data.rows = startupChecks.map(([area, description]) => {
    return {
      area,
      description,
      first: "M",
      firstNote: "------",
      second: "M",
      secondNote: "------",
    };
  });
  data.bandage = {
    firstIssue: "-------",
    firstEnd: "",
    secondIssue: "--------",
    secondEnd: "",
  };
  data.legend = "M=megfelelt - Az ellenőrzés során nem került feltárásra nem-megfelelőség, akkor az „M”-et pirossal kell jelölni\nN= nem megfelelőség - Az ellenőrzés során nemmegfelelőségvan, akkor az „N”-et pirossal kell jelölni";
  data.note = "Megjegyzés : az ellenőrzés során feltárt nem – megfelelőség javítási módjának leírása:";
  return data;
}

function generateTemperature() {
  const data = commonMeta();
  data.coldRows = coldRooms.map(([area, requirement, min, max]) => ({
    area,
    requirement,
    morning: numberHu(randomBetween(min, max)),
    afternoon: numberHu(randomBetween(min, max)),
    action: "Megfelelő érték, intézkedés nem szükséges.",
  }));
  data.disinfectant = {
    morning: numberHu(randomBetween(82, 88)),
    afternoon: numberHu(randomBetween(82, 88)),
    action: "Követelmény teljesült.",
  };
  data.coreRows = coreTemps.map(([product, requirement, min, max]) => ({
    product,
    requirement,
    time1: randomItem(["8:00", "9:00", "10:00"]),
    value1: numberHu(randomBetween(min, max)),
    time2: randomItem(["12:00", "13:00", "15:00"]),
    value2: numberHu(randomBetween(min, max)),
    action: "Határértéken belüli eredmény.",
  }));

  data.maintenance = "Karbantartás, helyesbítő tevékenység nem vált szükségessé.";
  return data;
}

function renderHeader(title) {
  return `
    <div class="doc-header">
      <div>Halasi Kebpro Kft.</div>
      <div>${escapeHtml(title)}</div>
      <div>HU 1439 EK</div>
    </div>
  `;
}

function renderLines(lines) {
  return lines.map((line) => `<br><span class="small-text">${escapeHtml(line)}</span>`).join("");
}

function renderChoice(selected) {
  return `
    <div class="choice-stack">
      <span class="${selected === "M" ? "status-ok" : ""}">M</span>
      <span class="${selected === "N" ? "status-bad" : ""}">N</span>
    </div>
  `;
}

function renderLegend(text) {
  return escapeHtml(text).replaceAll("\n", "<br>");
}

function renderCleaning(data) {
  return `
    <div class="title-block source-like">
      <p><strong>Dátum:</strong> ${data.dateHu}</p>
      <p><strong>Takarítás megkezdéséhez szükséges feltételek biztosítottak:</strong> ${data.conditionsReady}/nem</p>
      <p><strong>Ellenőrzést végezte:</strong> üzemvezető (${escapeHtml(data.leader)})</p>
      <p><strong>Validálás (hetente egyszer):</strong> minőségirányítási vezető (${escapeHtml(data.quality)})</p>
    </div>
    <p class="source-note">${escapeHtml(data.noteLabel)}</p>
    <h2 class="doc-title cleaning-title">Termelés megkezdése előtti frissítő takarítás.</h2>
    <table>
      <thead>
        <tr>
          <th>Takarítandó terület</th>
          <th class="medium">Takarítás, öblítés hatékonyságának ellenőrzése</th>
          <th>Megjegyzés</th>
        </tr>
      </thead>
      <tbody>
        ${data.rows.map((row) => `
          <tr>
            <td>${escapeHtml(row.area)}</td>
            <td class="center ${row.result === "Megfelelő" ? "status-ok" : "muted-cell"}">${escapeHtml(row.result)}</td>
            <td class="${row.note.includes("-") ? "muted-cell" : ""}">${escapeHtml(row.note)}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function renderStartup(data) {
  return `
    ${renderHeader("Műszakindítási üzemnapló")}
    <div class="title-block">
      <p><strong>Műszaki indítás ideje:</strong> ${data.dateHu}</p>
      <p><strong>Műszak indítást ellenőrizte:</strong> üzemvezető (${escapeHtml(data.leader)})</p>
      <p><strong>Validálás (hetente egyszer):</strong> minőségirányítási vezető (${escapeHtml(data.quality)})</p>
    </div>
    <table>
      <thead>
        <tr>
          <th>Ellenőrizendő területek</th>
          <th class="narrow">I. műszak</th>
          <th>Nem-megfelelőség</th>
          <th class="narrow">II. műszak</th>
          <th>Nem-megfelelőség</th>
        </tr>
      </thead>
      <tbody>
        ${data.rows.map((row) => `
          <tr>
            <td><strong>${escapeHtml(row.area)}</strong>${renderLines(row.description)}</td>
            <td class="center">${renderChoice(row.first)}</td>
            <td>${escapeHtml(row.firstNote)}</td>
            <td class="center">${renderChoice(row.second)}</td>
            <td>${escapeHtml(row.secondNote)}</td>
          </tr>
        `).join("")}
        <tr class="subhead-row">
          <td>/</td>
          <td>Kiadás</td>
          <td>Műszakvégén ellenőrzés</td>
          <td>Kiadás</td>
          <td>Műszakvégén ellenőrzés</td>
        </tr>
        <tr>
          <td><strong>Ragtapasz, kötszer felhasználás</strong></td>
          <td class="center muted-cell">${escapeHtml(data.bandage.firstIssue)}</td>
          <td>${escapeHtml(data.bandage.firstEnd)}</td>
          <td class="center muted-cell">${escapeHtml(data.bandage.secondIssue)}</td>
          <td>${escapeHtml(data.bandage.secondEnd)}</td>
        </tr>
        <tr class="legend-row">
          <td>${renderLegend(data.legend)}</td>
          <td>${renderLegend(data.legend)}</td>
          <td>${renderLegend(data.legend)}</td>
          <td>${renderLegend(data.legend)}</td>
          <td>${renderLegend(data.legend)}</td>
        </tr>
        <tr class="large-note-row">
          <td>${escapeHtml(data.note)}<br><br><br><br><br><br></td>
          <td>${escapeHtml(data.note)}<br><br><br><br><br><br></td>
          <td>${escapeHtml(data.note)}<br><br><br><br><br><br></td>
          <td>${escapeHtml(data.note)}<br><br><br><br><br><br></td>
          <td>${escapeHtml(data.note)}<br><br><br><br><br><br></td>
        </tr>
      </tbody>
    </table>
  `;
}

function renderTemperature(data) {
  return `
    ${renderHeader("Alapanyag, elősütött és késztermék tárolás ellenőrzés")}
    <h2 class="doc-title">Alapanyag, elősütött és késztermék tárolás ellenőrzés</h2>
    <div class="title-block">
      <p><strong>Dátum:</strong> ${data.dateHu}</p>
      <p><strong>Ellenőrzést végezte:</strong> ${escapeHtml(data.operator)}</p>
      <p><strong>Üzemvezető:</strong> ${escapeHtml(data.leader)}</p>
    </div>

    <div class="section-title">Hűtött terek hőmérséklete</div>
    <table class="temperature-matrix">
      <thead>
        <tr>
          <th>Hűtött terek hőmérséklete</th>
          <th>Ellenőrzés ideje</th>
          ${data.coldRows.map((row) => `<th>${escapeHtml(row.area)}</th>`).join("")}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Követelmény</td>
          <td></td>
          ${data.coldRows.map((row) => `<td>${escapeHtml(row.requirement)}</td>`).join("")}
        </tr>
        <tr>
          <td></td>
          <td class="center">8:00</td>
          ${data.coldRows.map((row) => `<td class="center">${escapeHtml(row.morning)} °C</td>`).join("")}
        </tr>
        <tr>
          <td></td>
          <td class="center">15:00</td>
          ${data.coldRows.map((row) => `<td class="center">${escapeHtml(row.afternoon)} °C</td>`).join("")}
        </tr>
        <tr>
          <td colspan="${data.coldRows.length + 2}">Intézkedés, helyesbítő tevékenység nem megfelelőség esetében: gépház ellenőrzése / karbantartó értesítése</td>
        </tr>
      </tbody>
    </table>

    <div class="section-title">Eszközfertőtlenítő hőmérséklet</div>
    <table>
      <thead>
        <tr>
          <th>Követelmény</th>
          <th class="narrow">8:00</th>
          <th class="narrow">15:00</th>
          <th>Intézkedés</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Min. 82 °C</td>
          <td class="center">${data.disinfectant.morning} °C</td>
          <td class="center">${data.disinfectant.afternoon} °C</td>
          <td>Intézkedés, helyesbítő tevékenység nem megfelelőség esetében. Karbantartó értesítése, hőfok beállítása.</td>
        </tr>
      </tbody>
    </table>

    <div class="section-title">Késztermék és alapanyag maghőmérsékletek</div>
    <table>
      <thead>
        <tr>
          <th>Termék</th>
          <th>Követelmény</th>
          <th class="narrow">Ellenőrzés ideje</th>
          <th class="narrow">Maghőmérséklet</th>
          <th class="narrow">Ellenőrzés ideje</th>
          <th class="narrow">Maghőmérséklet</th>
          <th>Intézkedés, helyesbítő tevékenység</th>
        </tr>
      </thead>
      <tbody>
        ${data.coreRows.map((row) => `
          <tr>
            <td>${escapeHtml(row.product)}</td>
            <td>${escapeHtml(row.requirement)}</td>
            <td class="center">${escapeHtml(row.time1)}</td>
            <td class="center">${escapeHtml(row.value1)} °C</td>
            <td class="center">${escapeHtml(row.time2)}</td>
            <td class="center">${escapeHtml(row.value2)} °C</td>
            <td>${escapeHtml(row.action)}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>

    <div class="note-box"><strong>Karbantartás, helyesbítő tevékenység leírása:</strong> ${escapeHtml(data.maintenance)}</div>
    <p class="title-block right"><strong>${data.dateHu}</strong><br>Üzemvezető<br>${escapeHtml(data.leader)}</p>
  `;
}

function generate() {
  const selected = els.template.value;
  if (selected === "cleaning") currentData = generateCleaning();
  if (selected === "startup") currentData = generateStartup();
  if (selected === "temperature") currentData = generateTemperature();
  render();
}

function render() {
  if (!currentData) return;
  els.preview.dataset.template = currentData.template;
  if (currentData.template === "cleaning") els.preview.innerHTML = renderCleaning(currentData);
  if (currentData.template === "startup") els.preview.innerHTML = renderStartup(currentData);
  if (currentData.template === "temperature") els.preview.innerHTML = renderTemperature(currentData);
}

function downloadBlob(filename, type, content) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function safeFileBase() {
  return currentData.date.replaceAll("-", ".");
}

function downloadDoc() {
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
    @page{size:A4 landscape;margin:5mm}
    body{font-family:Arial,Helvetica,sans-serif;color:#161616;margin:0}
    .paper{width:287mm;height:200mm;padding:4mm;overflow:hidden}
    table{width:100%;border-collapse:collapse;table-layout:fixed;margin:1mm 0 2mm}
    th,td{border:1px solid #2c2c2c;padding:.75mm 1mm;font-size:7px;line-height:1.05;vertical-align:middle}
    th{background:#eef1f4;text-align:center;font-weight:700}
    .doc-header{display:grid;grid-template-columns:1fr 2fr 1fr;border:2px solid #2c2c2c;margin-bottom:2mm}
    .doc-header>div{display:flex;min-height:9mm;align-items:center;justify-content:center;padding:1.5mm;text-align:center;font-weight:700;border-right:1px solid #2c2c2c;font-size:8px}
    .doc-header>div:last-child{border-right:0}
    .doc-title{text-align:center;margin:1mm 0 2mm;font-size:10px;text-transform:uppercase}
    .cleaning-title{text-transform:none;font-size:9px}.source-like{margin-top:8px}.source-note{margin:8mm 0 5mm;font-size:8px}
    .title-block{margin-bottom:2mm;line-height:1.12;font-size:8px}.title-block p{margin:0 0 1mm}
    .center{text-align:center}.narrow{width:10%;text-align:center}.medium{width:18%}
    .status-ok,.status-bad{color:#9b1c1f;font-weight:800}.muted-cell{color:#777;letter-spacing:1px}
    .note-box{min-height:9mm;border:1px solid #2c2c2c;padding:1.5mm;margin-top:1mm;font-size:7px}
    .section-title{margin:2mm 0 1mm;padding:1mm;background:#eef1f4;border:1px solid #2c2c2c;font-weight:800;font-size:7px}
    .small-text{font-size:6.2px}.choice-stack{display:grid;gap:.5mm;justify-items:center;font-weight:800}
    .subhead-row td{text-align:center;font-weight:700}.legend-row td{font-size:5.1px;line-height:1.05}
    .large-note-row td{height:11mm;min-height:0;vertical-align:top;font-size:5.6px;line-height:1.05}.large-note-row br{display:none}
    .temperature-matrix th,.temperature-matrix td{font-size:6.1px;padding:.55mm .75mm;line-height:1.02}
  </style></head><body><article class="paper">${els.preview.innerHTML}</article></body></html>`;
  downloadBlob(`${safeFileBase()}.doc`, "application/msword;charset=utf-8", html);
}

els.generate.addEventListener("click", generate);
els.template.addEventListener("change", generate);
els.date.addEventListener("change", generate);
els.print.addEventListener("click", () => window.print());
els.downloadDoc.addEventListener("click", downloadDoc);

els.date.value = todayInputValue();
function unlockApp() {
  els.loginScreen.classList.add("hidden");
  els.app.classList.remove("locked");
  els.loginError.hidden = true;
}

function isAuthenticated() {
  try {
    return window.localStorage?.getItem(AUTH_KEY) === "yes";
  } catch {
    return false;
  }
}

function rememberAuthentication() {
  try {
    window.localStorage?.setItem(AUTH_KEY, "yes");
  } catch {
    // If browser storage is unavailable, the page still works for the current load.
  }
}

async function sha256Hex(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

if (isAuthenticated()) {
  unlockApp();
} else {
  els.app.classList.add("locked");
}

els.loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const passwordHash = await sha256Hex(els.password.value);
  if (passwordHash === PASSWORD_HASH) {
    rememberAuthentication();
    unlockApp();
    return;
  }
  els.loginError.hidden = false;
  els.password.select();
});
generate();
