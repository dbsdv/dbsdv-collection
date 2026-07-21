// DBSDV Collection サーバー
// ※ express.static(__dirname) は削除しない。
// これがないと index.html が開けなくなる。

const express = require("express");

const path = require("path");

const multer = require("multer");

const fs = require("fs");

const { readCardNumbers } = require("./tools/ocrClient");

const storage = multer.diskStorage({
  destination: path.join(__dirname, "temp"),

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage });

const app = express();

app.use(express.json());

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Server OK",
  });
});

app.post("/api/cardnumbers", upload.single("image"), async (req, res) => {
  console.log("カード画像API開始");

  try {
    console.log("/api/cardnumbers にアクセス");
    console.log(req.file);

    console.log("OCR開始");
    const response = await readCardNumbers(req.file.path);
    console.log("OCR終了");

    // OCR後に一時画像を削除
    if (fs.existsSync(req.file.path)) {
      console.log("削除:", req.file.path);
      fs.unlinkSync(req.file.path);
    }

    console.log("OCR結果");
    console.log(response);

    const { result } = response;

    const counts = {};

    for (const id of result) {
      counts[id] = (counts[id] ?? 0) + 1;
    }

    console.log("レスポンス返却");
    res.json(counts);
  } catch (error) {
    console.error("APIエラー:", error);

    res.status(500).json({
      error: error.message,
    });
  }
});

app.use(express.static(__dirname));

app.listen(3000, "0.0.0.0", () => {
  console.log("Server started");
  console.log("http://localhost:3000");
});
