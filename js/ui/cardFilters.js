function filterCards() {
  const keyword = search.value.toLowerCase();
  const energyFilter = document.getElementById("energyFilter").value;

  filteredCards = [];

  document.querySelectorAll(".card").forEach((cardDiv, index) => {
    const card = cards[index];

    let visible = true;

    // 検索
    if (
      !card.name.toLowerCase().includes(keyword) &&
      !card.id.toLowerCase().includes(keyword)
    ) {
      visible = false;
    }

    // 所持のみ
    if (ownedOnly.checked && !card.owned) {
      visible = false;
    }

    // 気力
    if (energyFilter && Number(card.initialKi) < Number(energyFilter)) {
      visible = false;
    }

    cardDiv.style.display = visible ? "" : "none";

    if (visible) {
      filteredCards.push(card);
    }
  });

  window.currentFilteredCards = filteredCards;

  document.getElementById("resultCount").textContent =
    `表示中：${filteredCards.length}枚（全${cards.length}枚）`;
}
