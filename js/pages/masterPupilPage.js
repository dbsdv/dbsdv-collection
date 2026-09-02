function getMasterPupilData() {
  const characters = {};

  window.cards.forEach((card) => {
    // formが未登録のカードは師弟一覧に表示しない
    if (!card.form) return;

    // キャラクターを作成
    if (!characters[card.name]) {
      characters[card.name] = {
        name: card.name,
        forms: {},
      };
    }

    // 形態を作成
    if (!characters[card.name].forms[card.form]) {
      characters[card.name].forms[card.form] = {
        form: card.form,
        cards: [],
      };
    }

    // カード番号を追加
    characters[card.name].forms[card.form].cards.push(card.id);
  });

  // formsをオブジェクトから配列に変換
  return Object.values(characters).map((character) => ({
    name: character.name,
    forms: Object.values(character.forms),
  }));
}

function getMasterPupilLevels() {
  return JSON.parse(localStorage.getItem("masterPupilLevels")) || {};
}

function saveMasterPupilLevels(levels) {
  localStorage.setItem("masterPupilLevels", JSON.stringify(levels));
}

function renderMasterPupil() {
  const container = document.getElementById("masterPupilList");

  const searchInput = document.getElementById("masterPupilSearch");

  const keyword = searchInput.value.trim();

  const levels = getMasterPupilLevels();

  container.innerHTML = getMasterPupilData()
    .filter((character) => character.name.includes(keyword))
    .map((character) => {
      return `
        <div class="master-pupil-character">

          <div class="master-pupil-character-header">
            <button
              class="master-pupil-character-toggle"
              type="button"
            >
              ▶
            </button>

            <span class="master-pupil-character-name">
              ${character.name}
            </span>
          </div>


          <div
            class="master-pupil-character-detail"
            hidden
          >

            ${character.forms
              .map((formItem) => {
                const key = `${character.name}（${formItem.form}）`;

                const level = levels[key] ?? 0;

                return `
                  <div
                    class="master-pupil-item"
                    data-key="${key}"
                  >

                    <div class="master-pupil-header">

                      <button
                        class="master-pupil-toggle"
                        type="button"
                      >
                        ▶
                      </button>

                      <span class="master-pupil-name">
                        ${formItem.form}
                      </span>


                      <div class="master-pupil-level">

                        <button
                          class="master-pupil-minus"
                          type="button"
                        >
                          −
                        </button>
<div class="master-pupil-gauge">
  <div
    class="master-pupil-gauge-fill"
    style="width: ${level * 10}%"
  ></div>

  <span class="master-pupil-level-text">
    ${level >= 10 ? "MAX" : level}
  </span>
</div>

                        <button
                          class="master-pupil-plus ${
                            level >= 10 ? "is-hidden" : ""
                          }"
                          type="button"
                        >
                          ＋
                        </button>

                      </div>

                    </div>


                    <div
                      class="master-pupil-detail"
                      hidden
                    >

                      ${formItem.cards
                        .map(
                          (cardNumber) => `
                            <div class="master-pupil-card">
                              ${cardNumber}
                            </div>
                          `,
                        )
                        .join("")}

                    </div>

                  </div>
                `;
              })
              .join("")}

          </div>

        </div>
      `;
    })
    .join("");
}

/* =========================
   クリック処理
========================= */

document.addEventListener("click", (e) => {
  // キャラクターの開閉
  const characterHeader = e.target.closest(".master-pupil-character-header");

  if (characterHeader) {
    const characterItem = characterHeader.closest(".master-pupil-character");

    const detail = characterItem.querySelector(
      ".master-pupil-character-detail",
    );

    const toggle = characterItem.querySelector(
      ".master-pupil-character-toggle",
    );

    const isOpen = !detail.hidden;

    detail.hidden = isOpen;

    toggle.textContent = isOpen ? "▶" : "▼";

    return;
  }

  const item = e.target.closest(".master-pupil-item");

  if (!item) return;

  // ＋
  if (e.target.closest(".master-pupil-plus")) {
    const key = item.dataset.key;

    const levels = getMasterPupilLevels();

    levels[key] = Math.min(10, (levels[key] ?? 0) + 1);

    saveMasterPupilLevels(levels);

    const level = levels[key];

    const gaugeFill = item.querySelector(".master-pupil-gauge-fill");
    gaugeFill.style.width = `${level * 10}%`;

    const levelText = item.querySelector(".master-pupil-level-text");

    levelText.textContent = level >= 10 ? "Lv.MAX" : `Lv.${level}`;

    const plusButton = item.querySelector(".master-pupil-plus");

    if (level >= 10) {
      plusButton.classList.add("is-hidden");
    }

    return;
  }

  // −
  if (e.target.closest(".master-pupil-minus")) {
    const key = item.dataset.key;

    const levels = getMasterPupilLevels();

    levels[key] = Math.max(0, (levels[key] ?? 0) - 1);

    saveMasterPupilLevels(levels);

    const level = levels[key];

    const gaugeFill = item.querySelector(".master-pupil-gauge-fill");
    gaugeFill.style.width = `${level * 10}%`;

    const levelText = item.querySelector(".master-pupil-level-text");

    levelText.textContent = level >= 10 ? "Lv.MAX" : `Lv.${level}`;

    const plusButton = item.querySelector(".master-pupil-plus");

    if (level < 10) {
      plusButton.classList.remove("is-hidden");
    }

    return;
  }

  // 形態の開閉
  if (e.target.closest(".master-pupil-header")) {
    const detail = item.querySelector(".master-pupil-detail");

    const toggle = item.querySelector(".master-pupil-toggle");

    const isOpen = !detail.hidden;

    detail.hidden = isOpen;

    toggle.textContent = isOpen ? "▶" : "▼";
  }
});

document.getElementById("masterPupilSearch").addEventListener("input", () => {
  renderMasterPupil();
});
