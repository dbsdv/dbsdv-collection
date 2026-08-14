let decks = [];

editingDeck = {
  id: null,
  name: "",
  cards: Array(7).fill(null),
  avatarType: "",
};

let isDeckEditing = false;

const deckList = document.getElementById("deckList");
const deckListPage = document.getElementById("deckListPage");
const deckEditorPage = document.getElementById("deckEditorPage");
const backDeckList = document.getElementById("backDeckList");
const saveDeckBtn = document.getElementById("saveDeckBtn");
const deckName = document.getElementById("deckName");

// --------------------
// 新しいデッキ
// --------------------

document.getElementById("newDeckBtn").addEventListener("click", () => {
  deckListPage.hidden = true;
  deckEditorPage.hidden = false;

  isDeckEditing = true;

  editingDeck = {
    id: null,
    name: "",
    cards: Array(7).fill(null),
  };

  // デッキ名を空にする
  document.getElementById("deckName").value = "";

  renderEditorSlots();
  updateDeckStats();
  renderDeckCards();
});

// --------------------
// 一覧へ戻る
// --------------------

backDeckList.addEventListener("click", () => {
  deckEditorPage.hidden = true;
  deckListPage.hidden = false;

  isDeckEditing = false;
});

// --------------------
// デッキ一覧
// --------------------

function renderDecks() {
  deckList.innerHTML = "";

  decks.forEach((deck) => {
    const count = deck.cards.filter((card) => card !== null).length;

    const slots = deck.cards
      .map((card) => {
        if (card) {
          return `
            <div class="deck-slot">

                <img
                    src="images/thumb/${card.id}.webp"
                    class="deck-slot-image">

            </div>
        `;
        }

        return `
        <div class="deck-slot"></div>
    `;
      })
      .join("");

    const avatarType = deck.avatarType || "";

    let avatarClass = "";

    if (avatarType === "R") {
      avatarClass = "avatar-r";
    } else if (avatarType === "B") {
      avatarClass = "avatar-b";
    } else if (avatarType === "I") {
      avatarClass = "avatar-i";
    }

    const avatarSlot = `
  <div class="deck-slot ${avatarClass}">
    ${avatarType}
  </div>
`;

    deckList.innerHTML += `
            <div class="deck-card">

                <h3>${deck.name}</h3>

                <div class="deck-slots">
  ${slots}
  ${avatarSlot}
</div>

                <div class="deck-count">
                    ${count} / 7枚
                </div>

                <div class="deck-actions">

                    <button class="edit-deck">
                        ✏️ 編集
                    </button>

                    <button class="delete-deck">
                        🗑️ 削除
                    </button>

                </div>

            </div>
        `;
  });

  // 編集
  document.querySelectorAll(".edit-deck").forEach((button, index) => {
    button.addEventListener("click", () => {
      deckListPage.hidden = true;
      deckEditorPage.hidden = false;

      isDeckEditing = true;

      editingDeck = structuredClone(decks[index]);

      document.getElementById("deckName").value = editingDeck.name;

      renderEditorSlots();
      updateDeckStats();
      renderDeckCards();
    });
  });

  // 削除
  document.querySelectorAll(".delete-deck").forEach((button, index) => {
    button.addEventListener("click", () => {
      if (!confirm(`「${decks[index].name}」を削除しますか？`)) {
        return;
      }

      decks.splice(index, 1);

      saveDecks();

      renderDecks();
    });
  });
}

// --------------------
// 編集画面の7枠
// --------------------

function renderEditorSlots() {
  const editorSlots = document.getElementById("editorSlots");

  editorSlots.innerHTML = "";

  editingDeck.cards.forEach((card, index) => {
    if (card) {
      editorSlots.innerHTML += `
        <div class="editor-slot" data-index="${index}">

          <button class="remove-card-btn" data-index="${index}">
            ✕
          </button>

          <img
            src="images/thumb/${card.id}.webp"
            class="editor-card-image"
            style="width:100%;border-radius:6px;">

        </div>
      `;
    } else {
      editorSlots.innerHTML += `
        <div class="editor-slot" data-index="${index}"></div>
      `;
    }
  });

  const avatarColor =
    editingDeck.avatarType === "R"
      ? "orange"
      : editingDeck.avatarType === "B"
        ? "green"
        : editingDeck.avatarType === "I"
          ? "blue"
          : "";

  editorSlots.innerHTML += `
  <div
    class="editor-slot avatar-slot"
    id="avatarSlot"
    style="color:${avatarColor};"
  >
    ${editingDeck.avatarType || ""}
  </div>
`;

  const avatarSlot = document.getElementById("avatarSlot");

  if (avatarSlot) {
    avatarSlot.onclick = () => {
      const types = ["R", "B", "I"];

      const currentIndex = types.indexOf(editingDeck.avatarType);

      editingDeck.avatarType = types[(currentIndex + 1) % types.length];

      renderEditorSlots();
      updateDeckStats();
    };
  }

  document.querySelectorAll(".editor-card-image").forEach((img, index) => {
    img.addEventListener("click", (e) => {
      e.stopPropagation();

      showCardDetail(editingDeck.cards[index]);
    });
  });

  document.querySelectorAll(".remove-card-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();

      const index = Number(button.dataset.index);

      removeCardFromEditingDeck(editingDeck.cards[index]);
    });
  });
}

function addCardToEditingDeck(card) {
  if (card.type === "L") {
    const limitedCount = editingDeck.cards.filter(
      (c) => c?.type === "L",
    ).length;

    if (limitedCount >= 1) {
      alert("リミテッドタイプのカードはデッキに1枚までです！");

      return false;
    }
  }

  const index = editingDeck.cards.findIndex((c) => c === null);

  if (index === -1) {
    alert("デッキは7枚までです！");

    return false;
  }

  editingDeck.cards[index] = card;

  renderEditorSlots();
  updateDeckStats();
  renderDeckCards();

  return true;
}

saveDeckBtn.addEventListener("click", () => {
  const deckName = document.getElementById("deckName");

  const name = deckName.value.trim();

  if (!name) {
    alert("デッキ名を入力してください！");

    return;
  }

  editingDeck.name = name;

  const index = decks.findIndex((d) => d.id === editingDeck.id);

  if (index >= 0) {
    // 編集
    decks[index] = structuredClone(editingDeck);
  } else {
    // 新規
    editingDeck.id = Date.now();

    decks.push(structuredClone(editingDeck));
  }

  renderDecks();
  saveDecks();

  deckEditorPage.hidden = true;
  deckListPage.hidden = false;

  isDeckEditing = false;
});

function updateDeckStats() {
  let hp = 0;
  let power = 0;
  let powerAwakened = 0;
  let guard = 0;
  let battlePower = 0;

  const avatarHp = Number(document.getElementById("avatarHp")?.value || 0);

  const avatarPower = Number(
    document.getElementById("avatarPower")?.value || 0,
  );

  const avatarGuard = Number(
    document.getElementById("avatarGuard")?.value || 0,
  );

  const avatarInitialKi = Number(
    document.getElementById("avatarInitialKi")?.value || 0,
  );

  editingDeck.cards.forEach((card) => {
    if (!card) return;

    hp += Number(card.hp || 0);
    power += Number(card.power || 0);

    powerAwakened += Number(card.powerAwakened || card.power || 0);

    guard += Number(card.guard || 0);

    const ki = Number(card.initialKi || 0);

    if (card.type === "B") {
      battlePower += ki * 3750;
    } else {
      battlePower += ki * 2500;
    }
  });

  hp += avatarHp;
  power += avatarPower;
  powerAwakened += avatarPower;
  guard += avatarGuard;

  if (editingDeck.avatarType === "B") {
    battlePower += avatarInitialKi * 3750;
  } else if (editingDeck.avatarType) {
    battlePower += avatarInitialKi * 2500;
  }

  document.getElementById("deckHp").textContent = hp;
  document.getElementById("deckPower").textContent = power;
  document.getElementById("deckPowerAwakened").textContent = powerAwakened;
  document.getElementById("deckGuard").textContent = guard;
  document.getElementById("deckBattlePower").textContent = battlePower;

  const count = editingDeck.cards.filter((card) => card !== null).length;

  document.getElementById("deckCardCount").textContent = `${count} / 7枚`;
}

function renderDeckCards() {
  const series = document.getElementById("deckSeriesFilter").value;

  console.log("選択弾:", series);

  renderCards("editorCardList", "select", series);
}

function removeCardFromEditingDeck(card) {
  const index = editingDeck.cards.findIndex((c) => c?.id === card.id);

  if (index === -1) {
    return;
  }

  editingDeck.cards.splice(index, 1);
  editingDeck.cards.push(null);

  renderEditorSlots();
  updateDeckStats();
  renderDeckCards();
}

function resetEditingDeck() {
  editingDeck.cards = Array(7).fill(null);

  renderEditorSlots();
  updateDeckStats();
  renderDeckCards();
}

document.getElementById("resetDeckBtn").addEventListener("click", () => {
  resetEditingDeck();
});

document.getElementById("deckSeriesFilter").addEventListener("change", () => {
  renderDeckCards();
});

document.getElementById("deckSearch").addEventListener("input", (e) => {
  const seriesFilter = document.getElementById("deckSeriesFilter");

  if (e.target.value.trim() !== "") {
    seriesFilter.value = "";
  }

  renderDeckCards();
});

document.getElementById("deckRarityFilter").addEventListener("change", () => {
  renderDeckCards();
});

document.getElementById("deckTypeFilter").addEventListener("change", () => {
  renderDeckCards();
});

document
  .getElementById("deckActionSkillFilter")
  .addEventListener("change", () => {
    renderDeckCards();
  });

document.getElementById("deckOwnedOnly").addEventListener("change", () => {
  renderDeckCards();
});
