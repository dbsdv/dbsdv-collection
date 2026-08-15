let latestSeries = "";
let previousSeries = "";

const typeNames = {
  B: "ブースト",
  L: "リミテッド",
  I: "インパクト",
  R: "ラッシュ",
};

async function loadCards() {
  const response = await fetch("cards.json");

  cards = await response.json();

  cards.forEach((card) => {
    card.searchText = normalize(`
    ${card.id}
    ${card.displayId ?? ""}
    ${card.name ?? ""}
    ${card.skillName ?? ""}
    ${card.skillEffect ?? ""}
    ${card.actionName ?? ""}
    ${card.actionEffect ?? ""}
    ${card.unitName ?? ""}
    ${card.unitCharacters ?? ""}
    ${card.unitEffect ?? ""}
    ${card.buppaName ?? ""}
    ${card.buppaEffect ?? ""}
    ${card.specialRule ?? ""}
  `);

    card.nameSearchText = normalize(`
    ${card.id}
    ${card.displayId ?? ""}
    ${card.name ?? ""}
  `);

    card.unitSearchText = normalize(`
    ${card.unitCharacters ?? ""}
  `);
  });

  window.cards = cards;

  const seriesFilter = document.getElementById("seriesFilter");
  const promoFilter = document.getElementById("promoFilter");
  const rarityFilter = document.getElementById("rarityFilter");
  const typeFilter = document.getElementById("typeFilter");
  const actionSkillFilter = document.getElementById("actionSkillFilter");

  const seriesList = [...new Set(cards.map((card) => card.series))];
  const rarityList = [...new Set(cards.map((card) => card.rarity))];
  const typeList = [...new Set(cards.map((card) => card.type))];
  const actionSkillList = [
    ...new Set(cards.map((card) => card.actionSkill).filter(Boolean)),
  ];

  const promoList = promoCategories
    .map((item) => item.category)
    .filter((category) =>
      cards.some(
        (card) =>
          card.series === "プロモーションカード" &&
          getPromoCategory(card.acquisition) === category,
      ),
    );

  if (
    cards.some(
      (card) =>
        card.series === "プロモーションカード" &&
        getPromoCategory(card.acquisition) === "その他",
    )
  ) {
    promoList.push("その他");
  }

  seriesList.sort((a, b) => {
    const order = {
      "11弾": 11,
      "10弾": 10,
      "9弾": 9,
      "8弾": 8,
      "7弾": 7,
      "6弾": 6,
      "5弾": 5,
      "4弾": 4,
      "3弾": 3,
      "2弾": 2,
      "1弾": 1,
      ロケーションテスト: 0,
      プロモーションカード: -1,
    };

    return order[b] - order[a];
  });

  const displayRarity = [
    "SEC",
    "PUR",
    "EXR",
    "GDR",
    "SR",
    "CP",
    "PR",
    "R",
    "N",
  ];

  for (const series of seriesList) {
    const option = document.createElement("option");
    option.value = series;
    option.textContent = series;
    seriesFilter.appendChild(option);
  }

  rarityList.sort();

  for (const rarity of displayRarity) {
    const option = document.createElement("option");
    option.value = rarity;
    option.textContent = rarity;
    rarityFilter.appendChild(option);
  }

  actionSkillList.sort();

  for (const actionSkill of actionSkillList) {
    const option = document.createElement("option");
    option.value = actionSkill;
    option.textContent = actionSkill;
    actionSkillFilter.appendChild(option);
  }

  // promoList.sort();

  for (const promo of promoList) {
    const option = document.createElement("option");
    option.value = promo;
    option.textContent = promo;
    promoFilter.appendChild(option);
  }

  loadCardData();

  latestSeries = seriesList[0];
  document.getElementById("seriesFilter").value = latestSeries;

  renderCards();

  renderCollection();

  seriesFilter.addEventListener("change", () => {
    latestSeries = seriesFilter.value;

    renderCards();
  });

  rarityFilter.addEventListener("change", () => {
    renderCards();
  });

  typeFilter.addEventListener("change", () => {
    renderCards();
  });

  actionSkillFilter.addEventListener("change", () => {
    renderCards();
  });

  promoFilter.addEventListener("change", () => {
    renderCards();
  });

  document.getElementById("parallelOnly").addEventListener("change", (e) => {
    const seriesFilter = document.getElementById("seriesFilter");

    if (e.target.checked) {
      previousSeries = seriesFilter.value;
      document.getElementById("ownedOnly").checked = false;

      seriesFilter.value = "";
      rarityFilter.value = "";
      typeFilter.value = "";
      actionSkillFilter.value = "";
      promoFilter.value = "";
    } else {
      seriesFilter.value = previousSeries;
    }

    renderCards();
  });

  document.getElementById("ownedOnly").addEventListener("change", (e) => {
    const seriesFilter = document.getElementById("seriesFilter");

    if (e.target.checked) {
      previousSeries = seriesFilter.value;
      document.getElementById("wantedOnly").checked = false;

      seriesFilter.value = "";
      rarityFilter.value = "";
      typeFilter.value = "";
      actionSkillFilter.value = "";
      promoFilter.value = "";
    } else {
      seriesFilter.value = previousSeries;
    }

    renderCards();
  });

  document.getElementById("wantedOnly").addEventListener("change", (e) => {
    const seriesFilter = document.getElementById("seriesFilter");

    if (e.target.checked) {
      previousSeries = seriesFilter.value;

      document.getElementById("ownedOnly").checked = false;

      seriesFilter.value = "";
      rarityFilter.value = "";
      typeFilter.value = "";
      actionSkillFilter.value = "";
      promoFilter.value = "";
    } else {
      seriesFilter.value = previousSeries;
    }

    renderCards();
  });

  document.getElementById("search").addEventListener("input", (e) => {
    if (e.target.value.trim() !== "") {
      document.getElementById("seriesFilter").value = "";
    }

    renderCards();
  });

  document.getElementById("searchName").addEventListener("change", () => {
    renderCards();
  });

  document.getElementById("searchUnit").addEventListener("change", () => {
    renderCards();
  });

  document.getElementById("resetFilter").addEventListener("click", () => {
    document.getElementById("seriesFilter").value = "";
    document.getElementById("rarityFilter").value = "";
    document.getElementById("parallelOnly").checked = false;
    document.getElementById("ownedOnly").checked = false;
    document.getElementById("wantedOnly").checked = false;
    document.getElementById("search").value = "";
    document.getElementById("typeFilter").value = "";
    document.getElementById("actionSkillFilter").value = "";
    document.getElementById("promoFilter").value = "";

    previousSeries = "";

    renderCards();
  });

  document.getElementById("resetCollection").addEventListener("click", () => {
    const ok = confirm(
      `図鑑を初期化しますか？

所持カード・「探している」・メモ・デッキの情報がすべて削除されます。

この操作は元に戻せません。`,
    );

    if (!ok) return;

    for (const card of cards) {
      card.owned = false;
      card.count = 0;
      card.wanted = false;
      card.memo = "";
    }

    document.getElementById("seriesFilter").value = latestSeries;
    document.getElementById("rarityFilter").value = "";
    document.getElementById("parallelOnly").checked = false;
    document.getElementById("ownedOnly").checked = false;
    document.getElementById("wantedOnly").checked = false;
    document.getElementById("search").value = "";

    decks = [];
    saveDecks();

    localStorage.removeItem("unopenedPacks");
    unopenedPacks = [];
    renderUnopenedPacks();

    localStorage.removeItem("avatarSettings");

    document.getElementById("avatarHp").value = 0;
    document.getElementById("avatarPower").value = 0;
    document.getElementById("avatarGuard").value = 0;
    document.getElementById("avatarInitialKi").value = 0;

    saveCardData();

    renderCards();

    renderCollection();
    renderDecks();
  });
}

function normalize(text) {
  return text.toLowerCase().normalize("NFKC");
}

const promoCategories = [
  {
    keyword: "アドバンスパック バトルオブサイヤン",
    category: "バトルオブサイヤン",
  },
  { keyword: "アドバンスパック2", category: "アドバンスパック2" },
  { keyword: "40th Anniversary", category: "アドバンスパック40周年" },
  { keyword: "アドバンスパック", category: "アドバンスパック" },

  { keyword: "プロモーションパック", category: "プロモーションパック" },

  { keyword: "大会", category: "大会" },

  { keyword: "Vジャンプ", category: "Vジャンプ" },
  { keyword: "最強ジャンプ", category: "最強ジャンプ" },

  { keyword: "店頭", category: "店頭配布" },
  { keyword: "キャンペーン", category: "キャンペーン" },
  { keyword: "イベント", category: "イベント" },
];

function getPromoCategory(acquisition = "") {
  for (const item of promoCategories) {
    if (acquisition.includes(item.keyword)) {
      return item.category;
    }
  }

  return "その他";
}

function renderCards(targetId = "cards", mode = "detail", deckSeries = "") {
  console.log(cards.find((c) => c.unopened));

  const container = document.getElementById(targetId);
  container.innerHTML = "";

  let visibleCount = 0;
  let visibleCards = [];

  const seriesFilter =
    mode === "select"
      ? document.getElementById("deckSeriesFilter").value
      : document.getElementById("seriesFilter").value;

  const rarityFilter =
    mode === "select"
      ? document.getElementById("deckRarityFilter").value
      : document.getElementById("rarityFilter").value;

  const typeFilter =
    mode === "select"
      ? document.getElementById("deckTypeFilter").value
      : document.getElementById("typeFilter").value;

  const actionSkillFilter =
    mode === "select"
      ? document.getElementById("deckActionSkillFilter").value
      : document.getElementById("actionSkillFilter").value;

  const promoFilter = document.getElementById("promoFilter");
  console.log("promo:", promoFilter.value);
  promoFilter.hidden = seriesFilter !== "プロモーションカード";

  const parallelOnly = document.getElementById("parallelOnly").checked;

  const ownedOnly =
    mode === "select"
      ? document.getElementById("deckOwnedOnly").checked
      : document.getElementById("ownedOnly").checked;

  const wantedOnly = document.getElementById("wantedOnly").checked;

  const searchInput =
    mode === "select"
      ? document.getElementById("deckSearch")
      : document.getElementById("search");

  const keywords = normalize(searchInput.value).split(/\s+/).filter(Boolean);

  const searchName = document.getElementById("searchName")?.checked ?? true;

  const searchUnit = document.getElementById("searchUnit")?.checked ?? false;

  if (
    mode !== "select" &&
    !seriesFilter &&
    !rarityFilter &&
    !typeFilter &&
    !actionSkillFilter &&
    !parallelOnly &&
    !ownedOnly &&
    !wantedOnly &&
    keywords.length === 0
  ) {
    const cardsElement = document.getElementById("cards");

    document.getElementById("resultCount").textContent =
      `表示中：0枚（全${cards.length}枚）`;

    cardsElement.innerHTML = `
        <div class="empty-message">

    <h3>🔍 条件を指定してください</h3>

    <p>
        全カードは件数が多いため表示できません。<br><br>

        弾・レアリティ・タイプ・<br>
        アクションスキル・検索ワードの<br>
        いずれかを指定してください。
    </p>

</div>
    `;

    return;
  }

  cards.forEach((card) => {
    if (seriesFilter && card.series !== seriesFilter) {
      return;
    }

    const selectedPromo = promoFilter.value;

    if (
      selectedPromo &&
      card.series === "プロモーションカード" &&
      getPromoCategory(card.acquisition) !== selectedPromo
    ) {
      return;
    }

    if (typeFilter && card.type !== typeFilter) {
      return;
    }

    if (actionSkillFilter && card.actionSkill !== actionSkillFilter) {
      return;
    }

    if (rarityFilter && card.rarity !== rarityFilter) {
      return;
    }

    if (parallelOnly && !card.parallel) {
      return;
    }

    if (ownedOnly && !card.owned) {
      return;
    }

    if (mode === "detail" && wantedOnly && !card.wanted) {
      return;
    }

    if (keywords.length) {
      let searchText = "";

      if (!searchName && !searchUnit) {
        searchText = card.searchText ?? "";
      } else {
        if (searchName) {
          searchText += ` ${card.nameSearchText ?? ""}`;
        }

        if (searchUnit) {
          searchText += ` ${card.unitSearchText ?? ""}`;
        }
      }

      if (!keywords.every((word) => searchText.includes(word))) {
        return;
      }
    }

    const cardDiv = document.createElement("div");

    cardDiv.className =
      mode === "select"
        ? `card card-select ${card.owned ? "owned-card" : ""}`
        : "card";

    cardDiv.innerHTML = `
            <div class="card-header">

    <div class="card-left">

    ${
      mode === "select"
        ? `<input
                    type="checkbox"
                    class="deck-check">`
        : `
                <span class="owned-btn">
                    ${card.owned ? "●" : "○"}
                </span>

                ${
                  card.count > 1
                    ? `<span class="count-tag">×${card.count}</span>`
                    : ""
                }
            `
    }

<span class="card-id">
    ${card.displayId ?? card.id}${card.unopened ? " 📦" : ""}
</span>

    </div>

    <span class="rarity-badge rarity-${card.rarity}">
        ${card.parallel ? "★" : ""}${card.rarity ?? ""}
    </span>

            </div>

    <img
    loading="lazy"
    src="images/thumb/${card.id}.webp"
    class="${mode === "detail" && card.owned ? "gray" : ""}"
    onerror="this.src='images/noimage.jpg'"
>

<div class="card-name">
    ${card.name}
</div>
        `;

    const img = cardDiv.querySelector("img");
    const ownedBtn = cardDiv.querySelector(".owned-btn");
    const deckCheck = cardDiv.querySelector(".deck-check");

    if (ownedBtn) {
      ownedBtn.addEventListener("click", () => {
        if (card.count > 0) {
          card.count = 0;
        } else {
          card.count = 1;
        }

        card.owned = card.count > 0;

        // 所持したら「探してる」は自動で解除✨
        if (card.owned) {
          card.wanted = false;
        }

        saveCardData();

        renderCards();
        //filterCards();
        //
        renderCollection();

        if (isDeckEditing) {
          renderDeckCards();
        }
      });
    }

    if (deckCheck) {
      // デッキに入っているカードはチェックON
      deckCheck.checked = editingDeck.cards.some((c) => c?.id === card.id);

      deckCheck.addEventListener("change", () => {
        if (deckCheck.checked) {
          const result = addCardToEditingDeck(card);

          if (result === false) {
            deckCheck.checked = false;
          }
        } else {
          removeCardFromEditingDeck(card);
        }
      });
    }

    img.addEventListener("click", () => {
      showCardDetail(card);
    });

    container.appendChild(cardDiv);

    visibleCards.push(card);

    visibleCount++;
  });

  window.currentVisibleCards = visibleCards;

  document.getElementById("resultCount").textContent =
    `表示中：${visibleCount}枚（全${cards.length}枚）`;
}

function renderDeckCards() {
  const series = document.getElementById("deckSeriesFilter").value;

  console.log("series=", JSON.stringify(series));

  renderCards("editorCardList", "select", series);
}
