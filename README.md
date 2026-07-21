# DBSDV Collection

ドラゴンボールスーパーダイバーズのカードコレクション管理ツールです。

## 主な機能

- カード一覧取得
- 画像ダウンロード
- OCRでステータス読み取り
- cards_raw.json 作成
- cards_new.json 作成
- コレクション管理

## 動作環境

- Node.js
- Python 3.13
- PaddleOCR
- Playwright
- Sharp

## インストール

```bash
npm install
playwright install
```

## 更新方法

```bash
npm run update
```

更新フロー

```
公式サイト
    ↓
カード一覧取得
    ↓
cards_raw.json
    ↓
画像ダウンロード
    ↓
OCR
    ↓
cards_new.json
```

## フォルダ構成

```
images/
├─ front/
└─ back/

js/
├─ core/
├─ pages/
├─ ui/
└─ utils/

tools/
├─ buildCardsJson.js
├─ downloadCardImages.js
├─ energyReader.js
├─ ocrAreas.js
├─ ocrClient.js
├─ readCardData.js
├─ scrapeCards.js
├─ statusReader.js
├─ typeReader.js
└─ update.js
```

## データ

- cards_raw.json
  - スクレイピング結果

- cards_new.json
  - OCR後のデータ

## ライセンス

MIT