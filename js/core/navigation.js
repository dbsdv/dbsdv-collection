const cardsPage = document.getElementById("cardsPage");
const deckPage = document.getElementById("deckPage");
const collectionPage = document.getElementById("collectionPage");
const unopenedPage = document.getElementById("unopenedPage");
const settingsPage = document.getElementById("settingsPage");

const tabCards = document.getElementById("tabCards");
const tabDeck = document.getElementById("tabDeck");
const tabCollection = document.getElementById("tabCollection");
const tabUnopened = document.getElementById("tabUnopened");
const tabSettings = document.getElementById("tabSettings");

function showPage(page) {
  cardsPage.hidden = true;
  deckPage.hidden = true;
  collectionPage.hidden = true;
  unopenedPage.hidden = true;
  settingsPage.hidden = true;

  tabCards.classList.remove("active");
  tabDeck.classList.remove("active");
  tabCollection.classList.remove("active");
  tabUnopened.classList.remove("active");
  tabSettings.classList.remove("active");

  if (page === "cards") {
    cardsPage.hidden = false;
    tabCards.classList.add("active");
  } else if (page === "deck") {
    deckPage.hidden = false;
    tabDeck.classList.add("active");
  } else if (page === "collection") {
    collectionPage.hidden = false;
    tabCollection.classList.add("active");
  } else if (page === "unopened") {
    unopenedPage.hidden = false;
    tabUnopened.classList.add("active");
  } else if (page === "settings") {
    settingsPage.hidden = false;
    tabSettings.classList.add("active");
  }
}

console.log("tabCards =", tabCards);
console.log("tabDeck =", tabDeck);
console.log("tabCollection =", tabCollection);

tabCards.addEventListener("click", () => {
  console.log("図鑑クリック");

  showPage("cards");
});

tabDeck.addEventListener("click", () => {
  console.log("デッキクリック");

  showPage("deck");
});

tabCollection.addEventListener("click", () => {
  console.log("コレクションクリック");

  showPage("collection");
});

tabSettings.addEventListener("click", () => {
  console.log("設定クリック");

  showPage("settings");
});

tabUnopened.addEventListener("click", () => {
  console.log("未開封クリック");
  showPage("unopened");
});
