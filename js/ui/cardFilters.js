let selectedCharacterName = "";
let selectedForm = "";

const formSearchArea = document.getElementById("formSearchArea");
const formSearchSelect = document.getElementById("formSearchSelect");

search.addEventListener("input", () => {
  const keyword = search.value.trim();

  selectedCharacterName = "";
  selectedForm = "";

  formSearchSelect.innerHTML = `
    <option value="">形態を選択</option>
  `;

  formSearchArea.hidden = true;

  const forms = [
    ...new Set(
      cards
        .filter((card) => card.name === keyword && card.form)
        .map((card) => card.form),
    ),
  ];

  if (forms.length > 0) {
    selectedCharacterName = keyword;

    formSearchSelect.innerHTML = `
      <option value="">形態を選択</option>
      ${forms
        .map(
          (form) => `
            <option value="${form}">
              ${form}
            </option>
          `,
        )
        .join("")}
    `;

    formSearchArea.hidden = false;
  }

  renderCards();
});

formSearchSelect.addEventListener("change", () => {
  selectedForm = formSearchSelect.value;

  renderCards();
});

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
