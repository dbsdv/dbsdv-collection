function saveCardData() {

    const cardData = {};

    cards.forEach(card => {

        cardData[card.id] = {

            count: card.count ?? (card.owned ? 1 : 0),
            wanted: card.wanted ?? false,
            memo: card.memo ?? ""

        };

    });

    localStorage.setItem(
        "cardData",
        JSON.stringify(cardData)
    );

}

function loadCardData() {

    const savedCards = localStorage.getItem("cardData");

    if (!savedCards) return;
    const cardData = JSON.parse(savedCards);

    cards.forEach(card => {

        if (!cardData[card.id]) return;

        card.count = cardData[card.id].count ?? (cardData[card.id].owned ? 1 : 0);
card.owned = card.count > 0;
        card.wanted = cardData[card.id].wanted ?? false;
        card.memo = cardData[card.id].memo ?? "";

    });

}

function saveDecks() {

    localStorage.setItem(
        "decks",
        JSON.stringify(decks)
    );

}

function loadDecks() {

    const savedDecks = localStorage.getItem("decks");

    if (!savedDecks) return;

    decks = JSON.parse(savedDecks);

}

