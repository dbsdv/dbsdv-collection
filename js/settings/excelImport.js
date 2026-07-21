console.log("excelImport.js loaded");

let excelImportCards = [];
let cardMap = new Map();

function hideExcelImportModal() {
  document.getElementById("excelImportModal").hidden = true;
}

function createImportCard(importCard) {
  const card = cardMap.get(importCard.id);

  const div = document.createElement("div");
  div.className = "excel-import-card";

  div.innerHTML = `
    <div class="excel-import-info">
      <div class="excel-import-id">${importCard.id}</div>
      <div class="excel-import-name">${card.name}</div>
    </div>

    <div class="excel-import-count">
      ×${importCard.count}
    </div>
  `;

  return div;
}

function createUnknownCard(card) {
  const div = document.createElement("div");

  div.className = "excel-import-card excel-import-unknown";

  div.innerHTML = `
    <div class="excel-import-info">
      <div class="excel-import-id">${card.id}</div>
      <div class="excel-import-name">未登録カード</div>
    </div>

    <div class="excel-import-count">
      ×${card.count}
    </div>
  `;

  return div;
}

function createSummary(importCards, unknownCards) {
  const totalTypes = importCards.length;

  const totalCount = importCards.reduce((sum, card) => sum + card.count, 0);

  const div = document.createElement("div");

  div.className = "excel-import-summary";

  div.innerHTML = `
    <div>追加対象　　　${totalTypes}種類</div>
    <div>追加枚数　　　${totalCount}枚</div>
    <div>未登録カード　${unknownCards.length}種類</div>
  `;

  return div;
}

function normalizeCell(value) {
  return String(value).normalize("NFKC").replace(/\s+/g, "").toUpperCase();
}

function showExcelImportModal(importCards, unknownCards) {
  excelImportCards = importCards;

  const modal = document.getElementById("excelImportModal");
  const list = document.getElementById("excelImportList");

  list.innerHTML = "";

  // 追加対象カード
  importCards.forEach((importCard) => {
    list.appendChild(createImportCard(importCard));
  });

  // 未登録カード
  if (unknownCards.length > 0) {
    const hr = document.createElement("hr");
    list.appendChild(hr);

    const title = document.createElement("div");
    title.innerHTML = "<strong>⚠ 追加されないカード</strong>";
    list.appendChild(title);

    unknownCards.forEach((card) => {
      list.appendChild(createUnknownCard(card));
    });
  }

  const hr = document.createElement("hr");
  list.appendChild(hr);

  list.appendChild(createSummary(importCards, unknownCards));

  modal.hidden = false;
}

document
  .getElementById("excelImportCancelButton")
  .addEventListener("click", hideExcelImportModal);

document.getElementById("excelFile").addEventListener("change", (e) => {
  const file = e.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = (event) => {
    const data = new Uint8Array(event.target.result);

    const workbook = XLSX.read(data, {
      type: "array",
    });

    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const rows = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
    });

    cardMap = new Map(cards.map((card) => [card.id, card]));

    const dataRows =
      rows.length > 0 && String(rows[0][0]).trim() === "弾"
        ? rows.slice(1)
        : rows;

    const ids = dataRows
      .map(([series, number, count]) => {
        if (series == null || number == null) return null;

        series = normalizeCell(series);
        number = normalizeCell(number);

        // 数字シリーズ
        if (/^\d+$/.test(series)) {
          if (/^\d+$/.test(number)) {
            return {
              id: `SDV${series}-${number.padStart(3, "0")}`,
              count: count ? Number(count) : 1,
            };
          }

          return {
            id: `SDV${series}-${number}`,
            count: count ? Number(count) : 1,
          };
        }

        // SDVP / SDVPJ など
        if (/^[A-Z0-9]+$/.test(series)) {
          if (/^\d+$/.test(number)) {
            return {
              id: `${series}-${number.padStart(3, "0")}`,
              count: count ? Number(count) : 1,
            };
          }

          return `${series}-${number}`;
        }

        return null;
      })
      .filter(Boolean);

    const counts = {};

    ids.forEach(({ id, count }) => {
      counts[id] = (counts[id] || 0) + count;
    });

    const importCards = [];
    const unknownCards = [];

    Object.entries(counts).forEach(([id, count]) => {
      const card = cardMap.get(id);

      if (card) {
        importCards.push({
          id,
          count,
        });
      } else {
        unknownCards.push({
          id,
          count,
        });
      }
    });

    showExcelImportModal(importCards, unknownCards);
  };

  reader.readAsArrayBuffer(file);
});

document
  .getElementById("excelImportAddButton")
  .addEventListener("click", (e) => {
    const button = e.currentTarget;

    if (button.disabled) return;

    button.disabled = true;

    excelImportCards.forEach((importCard) => {
      const card = cardMap.get(importCard.id);

      if (!card) {
        console.warn("カードが見つかりません:", importCard.id);
        return;
      }

      card.count = (card.count || 0) + importCard.count;
      card.owned = card.count > 0;
    });

    saveCardData();

    renderCards();
    updateSettingsInfo();

    hideExcelImportModal();

    alert("Excelから所持枚数を追加しました。");

    button.disabled = false;
  });
