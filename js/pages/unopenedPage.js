const STORAGE_KEY = "unopenedPacks";

let unopenedPacks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

const newPackName = document.getElementById("newPackName");
const addPackButton = document.getElementById("addPackButton");
const unopenedPackList = document.getElementById("unopenedPackList");

function saveUnopenedPacks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(unopenedPacks));
}

function renderUnopenedPacks() {
  unopenedPackList.innerHTML = "";

  unopenedPacks.forEach((pack, index) => {
    const item = document.createElement("div");

    const name = document.createElement("span");
    name.className = "pack-name";
    name.textContent = pack.name;

    const minusButton = document.createElement("button");
    minusButton.textContent = "－";

    const count = document.createElement("span");
    count.textContent = pack.count;

    const plusButton = document.createElement("button");
    plusButton.textContent = "＋";

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "🗑️";
    deleteButton.title = "削除";

    minusButton.addEventListener("click", () => {
      pack.count--;

      if (pack.count <= 0) {
        unopenedPacks.splice(index, 1);
      }

      saveUnopenedPacks();
      renderUnopenedPacks();
    });

    plusButton.addEventListener("click", () => {
      pack.count++;

      saveUnopenedPacks();
      renderUnopenedPacks();
    });

    deleteButton.addEventListener("click", () => {
      const confirmDelete = confirm(`${pack.name}を削除しますか？`);

      if (!confirmDelete) return;

      unopenedPacks.splice(index, 1);

      saveUnopenedPacks();
      renderUnopenedPacks();
    });

    const controls = document.createElement("div");
    controls.className = "pack-controls";

    controls.appendChild(minusButton);
    controls.appendChild(count);
    controls.appendChild(plusButton);
    controls.appendChild(deleteButton);

    item.appendChild(name);
    item.appendChild(controls);

    unopenedPackList.appendChild(item);
  });
}

addPackButton.addEventListener("click", () => {
  const name = newPackName.value.trim();

  if (!name) return;

  const existingPack = unopenedPacks.find((pack) => pack.name === name);

  if (existingPack) {
    existingPack.count++;
  } else {
    unopenedPacks.push({
      name,
      count: 1,
    });
  }

  newPackName.value = "";

  saveUnopenedPacks();
  renderUnopenedPacks();
});

// 初回表示
renderUnopenedPacks();
