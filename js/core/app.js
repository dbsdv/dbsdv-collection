window.cards = [];

let cards = window.cards;
let filteredCards = [];

const search = document.getElementById("search");
const ownedOnly = document.getElementById("ownedOnly");

search.addEventListener("input", filterCards);
ownedOnly.addEventListener("change", filterCards);

(async () => {
  await loadCards();

  loadDecks();

  renderDecks();

  const savedVersion = localStorage.getItem("appVersion");

  const versionInfo = await loadVersion();

  if (savedVersion && savedVersion !== versionInfo.version) {
    console.log("自動バックアップ実行");
    createAutoBackup();

    alert(`新しいバージョンがあります。\nバックアップを作成しました。`);
  }

  localStorage.setItem("appVersion", versionInfo.version);

  // saveCardData();
  updateSettingsInfo();
})();

async function loadVersion() {
  const response = await fetch("version.json");

  return await response.json();
}

async function updateSettingsInfo() {
  const versionInfo = await loadVersion();

  const appVersion = document.getElementById("appVersion");
  const lastUpdatedInfo = document.getElementById("lastUpdatedInfo");
  const lastAddedCardsInfo = document.getElementById("lastAddedCardsInfo");
  const cardCountInfo = document.getElementById("cardCountInfo");
  const ownedCountInfo = document.getElementById("ownedCountInfo");

  if (appVersion) {
    appVersion.textContent = versionInfo.version;
  }

  if (lastUpdatedInfo) {
    lastUpdatedInfo.textContent = versionInfo.updated || "-";
  }

  if (lastAddedCardsInfo) {
    lastAddedCardsInfo.textContent = `${versionInfo.addedCards ?? 0}枚`;
  }

  if (cardCountInfo) {
    cardCountInfo.textContent = `${cards.length}枚`;
  }

  if (ownedCountInfo) {
    const ownedCount = cards.filter((card) => card.owned).length;
    ownedCountInfo.textContent = `${ownedCount}枚`;
  }
}
