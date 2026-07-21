const modal = document.getElementById("cardModal");

const countMinus = document.getElementById("countMinus");
const modalOwnedCount = document.getElementById("modalOwnedCount");
const countPlus = document.getElementById("countPlus");

const modalImage = document.getElementById("modalImage");
const modalName = document.getElementById("modalName");
const modalNumber = document.getElementById("modalNumber");
const modalRarity = document.getElementById("modalRarity");

const modalAttackType = document.getElementById("modalAttackType");
const modalHp = document.getElementById("modalHp");
const modalPower = document.getElementById("modalPower");
const modalGuard = document.getElementById("modalGuard");
const modalInitialKi = document.getElementById("modalInitialKi");
const modalEnergy = document.getElementById("modalEnergy");

const modalActionSkill = document.getElementById("modalActionSkill");
const modalSpecialMove = document.getElementById("modalSpecialMove");
const modalSkill = document.getElementById("modalSkill");

const modalAcquisition = document.getElementById("modalAcquisition");
const modalAcquisitionSection = document.getElementById(
  "modalAcquisitionSection",
);

const modalWanted = document.getElementById("modalWanted");
const modalMemo = document.getElementById("modalMemo");

const closeModal = document.getElementById("closeModal");
const prevCardBtn = document.getElementById("prevCard");
const nextCardBtn = document.getElementById("nextCard");

let selectedCard = null;

let currentCard = null;

let currentCards = [];
let currentIndex = -1;

let showingFront = true;

const showFrontBtn = document.getElementById("showFront");
const showBackBtn = document.getElementById("showBack");

/* -------------------------
   モーダルを開く
------------------------- */

function showCardDetail(card, list = cards) {
  selectedCard = card;

  currentCard = card;

  currentIndex = window.currentVisibleCards
    ? window.currentVisibleCards.findIndex((c) => c.id === card.id)
    : cards.findIndex((c) => c.id === card.id);

  modalImage.src = showingFront
    ? `images/front/${currentCard.id}.webp`
    : `images/back/${currentCard.id}_b.webp`;

  showFrontBtn.disabled = showingFront;
  showBackBtn.disabled = !showingFront;

  modalName.textContent = card.name || "-";

  document.getElementById("modalNumberMobile").textContent = card.id || "-";

  document.getElementById("modalOwnedCount").textContent = card.count ?? 0;

  modalRarity.textContent = `${card.parallel ? "★" : ""}${card.rarity || "-"}`;

  const attackTypes = {
    I: {
      name: "インパクト：打撃",
      color: "#2196f3",
    },
    B: {
      name: "ブースト：気弾",
      color: "#43a047",
    },
    R: {
      name: "ラッシュ：打撃",
      color: "#fb8c00",
    },
    L: {
      name: "リミテッド",
      color: "#b0b0b0",
    },
  };

  const attack = attackTypes[card.type];

  if (attack) {
    modalAttackType.textContent = attack.name;
    modalAttackType.style.color = attack.color;
  } else {
    modalAttackType.textContent = "-";
    modalAttackType.style.color = "";
  }

  modalHp.textContent = card.hp || "-";
  modalPower.textContent = card.power || "-";
  modalGuard.textContent = card.guard || "-";
  modalInitialKi.textContent = card.initialKi || "-";
  modalEnergy.textContent = card.energy || "-";

  modalActionSkill.textContent = card.actionSkill || "-";
  modalSpecialMove.textContent = card.specialMove || "-";
  modalSkill.textContent = card.skill || "-";
  modalWanted.checked = card.wanted ?? false;

  if (card.rarity === "CP" || card.rarity === "PR") {
    modalAcquisitionSection.style.display = "";
    modalAcquisition.textContent = card.acquisition || "-";
  } else {
    modalAcquisitionSection.style.display = "none";
  }

  modalMemo.value = card.memo ?? "";

  // レアリティ色
  modalRarity.className = "";

  if (card.rarity) {
    modalRarity.classList.add(`rarity-${card.rarity}`);
  }

  console.log("isDeckEditing =", isDeckEditing);

  modal.style.display = "flex";

  document.body.style.overflow = "hidden";

  modal.scrollTop = 0;

  modal.querySelector(".modal-content").scrollTop = 0;

  document.getElementById("cardCount").textContent =
    `${currentIndex + 1} / ${window.currentVisibleCards.length}枚`;
}

/* -------------------------
   モーダルを閉じる
------------------------- */

function closeCardDetail() {
  modal.style.display = "none";

  document.body.style.overflow = "";
}

/* -------------------------
   イベント
------------------------- */

closeModal.addEventListener("click", closeCardDetail);

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeCardDetail();
  }
});

document.addEventListener("keydown", (e) => {
  // モーダルが閉じていたら何もしない
  if (modal.style.display !== "flex") return;

  switch (e.key) {
    case "Escape":
      closeCardDetail();

      break;

    case "ArrowLeft":
      prevCardBtn.click();

      break;

    case "ArrowRight":
      nextCardBtn.click();

      break;
  }
});

/* -------------------------
   表示切り替え
------------------------- */

showFrontBtn.addEventListener("click", () => {
  if (!currentCard) return;

  showingFront = true;

  modalImage.src = `images/front/${currentCard.id}.webp`;

  showFrontBtn.disabled = true;
  showBackBtn.disabled = false;
});

showBackBtn.addEventListener("click", () => {
  if (!currentCard) return;

  showingFront = false;

  modalImage.src = `images/back/${currentCard.id}_b.webp`;

  showFrontBtn.disabled = false;
  showBackBtn.disabled = true;
});

countPlus.addEventListener("click", () => {
  if (!currentCard) return;

  currentCard.count++;

  currentCard.owned = currentCard.count > 0;

  modalOwnedCount.textContent = currentCard.count;

  if (currentCard.owned) {
    modalWanted.checked = false;
    currentCard.wanted = false;
  }

  saveCardData();

  renderCards();
  renderCollection();
});

countMinus.addEventListener("click", () => {
  if (!currentCard) return;

  if (currentCard.count <= 0) return;

  currentCard.count--;

  currentCard.owned = currentCard.count > 0;

  modalOwnedCount.textContent = currentCard.count;

  saveCardData();

  renderCards();
  renderCollection();
});

/* -------------------------
   前のカード
------------------------- */

prevCardBtn.addEventListener("click", () => {
  if (currentIndex <= 0) {
    currentIndex = window.currentVisibleCards.length - 1;
  } else {
    currentIndex--;
  }

  showCardDetail(
    window.currentVisibleCards[currentIndex],
    window.currentVisibleCards,
  );
});

/* -------------------------
   次のカード
------------------------- */

nextCardBtn.addEventListener("click", () => {
  if (currentIndex >= window.currentVisibleCards.length - 1) {
    currentIndex = 0;
  } else {
    currentIndex++;
  }

  showCardDetail(
    window.currentVisibleCards[currentIndex],
    window.currentVisibleCards,
  );
});

modalWanted.addEventListener("change", () => {
  if (!currentCard) return;

  // 所持中は「探している」にできない
  if (currentCard.owned && modalWanted.checked) {
    modalWanted.checked = false;
    return;
  }

  currentCard.wanted = modalWanted.checked;

  saveCardData();
});

modalMemo.addEventListener("input", () => {
  if (!currentCard) return;

  currentCard.memo = modalMemo.value;

  saveCardData();
});
