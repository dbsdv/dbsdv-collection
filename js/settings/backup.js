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
      if (
        key === "cardData" ||
        key === "decks" ||
        key === "unopenedPacks" ||
        key === "avatarSettings"
      ) {
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

function createAutoBackup() {
  const backup = {
    version: 1,
    createdAt: new Date().toISOString(),
    data: {},
  };

  ["cardData", "decks", "unopenedPacks", "avatarSettings"].forEach((key) => {
    const value = localStorage.getItem(key);

    if (value) {
      backup.data[key] = JSON.parse(value);
    }
  });

  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);

  const date = new Date();

  const filename = `DBSDV_AutoBackup_${date.getFullYear()}-${String(
    date.getMonth() + 1,
  ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}_${String(
    date.getHours(),
  ).padStart(2, "0")}-${String(date.getMinutes()).padStart(2, "0")}-${String(
    date.getSeconds(),
  ).padStart(2, "0")}.json`;

  const a = document.createElement("a");

  a.href = url;
  a.download = filename;

  document.body.appendChild(a);
  a.click();
  a.remove();

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);

  console.log("Auto backup downloaded:", filename);
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

document.getElementById("updateButton").addEventListener("click", async () => {
  const versionInfo = await loadVersion();

  localStorage.setItem("appVersion", versionInfo.version);
  sessionStorage.setItem("lastPage", "settings");

  if (window.waitingWorker) {
    window.waitingWorker.postMessage({
      type: "SKIP_WAITING",
    });
  } else {
    location.reload();
  }
});
