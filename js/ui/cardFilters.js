function filterCards() {

    const keyword = search.value.toLowerCase();

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

        cardDiv.style.display = visible ? "" : "none";

        if (visible) {
            filteredCards.push(card);
        }

    });

    window.currentFilteredCards = filteredCards;

}