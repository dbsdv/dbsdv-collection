function saveCardData() {
  const cardData = {};

  cards.forEach((card) => {
    cardData[card.id] = {
      count: card.count ?? (card.owned ? 1 : 0),
      unopened: card.unopened ?? false,
      wanted: card.wanted ?? false,
      mistake: card.mistake ?? false,
      memo: card.memo ?? "",
    };
  });

  localStorage.setItem("cardData", JSON.stringify(cardData));
}

function loadCardData() {
  const savedCards = localStorage.getItem("cardData");

  if (!savedCards) return;
  const cardData = JSON.parse(savedCards);

  cards.forEach((card) => {
    if (!cardData[card.id]) return;

    card.count = cardData[card.id].count ?? (cardData[card.id].owned ? 1 : 0);
    card.owned = card.count > 0;
    card.unopened = cardData[card.id].unopened ?? false;
    card.wanted = cardData[card.id].wanted ?? false;
    card.mistake = cardData[card.id].mistake ?? false;
    card.memo = cardData[card.id].memo ?? "";
  });
}

function saveDecks() {
  localStorage.setItem("decks", JSON.stringify(decks));
}

function loadDecks() {
  const savedDecks = localStorage.getItem("decks");

  if (!savedDecks) return;

  decks = JSON.parse(savedDecks);
}

function saveAvatarSettings() {
  const avatarSettings = {
    hp: Number(document.getElementById("avatarHp").value || 0),
    power: Number(document.getElementById("avatarPower").value || 0),
    guard: Number(document.getElementById("avatarGuard").value || 0),
    initialKi: Number(document.getElementById("avatarInitialKi").value || 0),
  };

  localStorage.setItem("avatarSettings", JSON.stringify(avatarSettings));
}

function loadAvatarSettings() {
  const savedSettings = localStorage.getItem("avatarSettings");

  if (!savedSettings) return;

  const settings = JSON.parse(savedSettings);

  document.getElementById("avatarHp").value = settings.hp || 0;
  document.getElementById("avatarPower").value = settings.power || 0;
  document.getElementById("avatarGuard").value = settings.guard || 0;
  document.getElementById("avatarInitialKi").value = settings.initialKi || 0;
}
