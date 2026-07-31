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

  // saveCardData();
  updateSettingsInfo();
})();

async function loadVersion() {
  const response = await fetch("version.json");

  return await response.json();
}

async function updateSettingsInfo() {
  const versionInfo = await loadVersion();

  const currentVersion = document.getElementById("currentVersion");
  const latestVersion = document.getElementById("latestVersion");

  const lastUpdatedInfo = document.getElementById("lastUpdatedInfo");
  const lastAddedCardsInfo = document.getElementById("lastAddedCardsInfo");
  const cardCountInfo = document.getElementById("cardCountInfo");
  const ownedCountInfo = document.getElementById("ownedCountInfo");

  const savedVersion = localStorage.getItem("appVersion") || "-";

  if (currentVersion) {
    currentVersion.textContent = savedVersion;
  }

  if (latestVersion) {
    latestVersion.textContent = versionInfo.version;
  }

  const updateStatus = document.getElementById("updateStatus");
  const updateButton = document.getElementById("updateButton");

  if (updateStatus && updateButton) {
    if (savedVersion === versionInfo.version) {
      updateStatus.textContent = "✅ 最新版です";
      updateButton.style.display = "none";
    } else {
      updateStatus.textContent = "🟠 更新があります";
      updateButton.style.display = "block";
    }
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
