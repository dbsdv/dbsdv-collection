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

  document.getElementById("appVersion").textContent = versionInfo.version;

  document.getElementById("lastUpdatedInfo").textContent =
    versionInfo.updated || "-";

  document.getElementById("lastAddedCardsInfo").textContent =
    `${versionInfo.addedCards ?? 0}枚`;

  document.getElementById("cardCountInfo").textContent = `${cards.length}枚`;

  const ownedCount = cards.filter((card) => card.owned).length;

  document.getElementById("ownedCountInfo").textContent = `${ownedCount}枚`;
}
