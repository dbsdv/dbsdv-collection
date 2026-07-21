console.log("backup.js loaded");

function backupData() {
  try {
    const backup = {
      version: 1,
      createdAt: new Date().toISOString(),
      data: {},
    };

    // DBSDV関連だけ保存
    Object.keys(localStorage).forEach((key) => {
      if (key === "cardData" || key === "decks") {
        backup.data[key] = JSON.parse(localStorage.getItem(key));
      }
    });

    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;

    const date = new Date().toISOString().split("T")[0];

    a.download = `DBSDV-Collection-${date}.json`;

    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}

function restoreData(file) {
  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const backup = JSON.parse(e.target.result);

      if (!backup.data) {
        alert("バックアップファイルではありません。");
        return;
      }

      if (!confirm("現在のデータは上書きされます。\n復元しますか？")) {
        return;
      }

      Object.entries(backup.data).forEach(([key, value]) => {
        localStorage.setItem(key, JSON.stringify(value));
      });

      alert("復元しました！");
      location.reload();
    } catch (error) {
      console.error(error);
      alert("読み込みに失敗しました。");
    }
  };

  reader.readAsText(file);
}

document.getElementById("backupButton").addEventListener("click", backupData);

document.getElementById("restoreButton").addEventListener("click", () => {
  document.getElementById("restoreFile").click();
});

document.getElementById("restoreFile").addEventListener("change", (e) => {
  const file = e.target.files[0];

  if (file) {
    restoreData(file);
  }
});

document.getElementById("importExcelButton").addEventListener("click", () => {
  document.getElementById("excelFile").click();
});

document.getElementById("excelFile").addEventListener("change", (e) => {
  const file = e.target.files[0];

  if (!file) return;

  console.log(file);
});
