## フォルダ構成

```
js/
├─ core/
│  ├─ app.js
│  ├─ navigation.js
│  ├─ settings.js
│  └─ storage.js
│
├─ pages/
│  ├─ cardsPage.js
│  ├─ collectionPage.js
│  └─ decksPage.js
│
├─ ui/
│  ├─ cardDetailModal.js
│  └─ cardFilters.js
│
└─ utils/
```

### core
アプリ全体の管理

- app.js … アプリ起動
- navigation.js … ページ切り替え
- settings.js … 設定管理
- storage.js … LocalStorage管理

### pages
各画面の表示処理

- cardsPage.js … カード一覧
- collectionPage.js … コレクション
- decksPage.js … デッキ

### ui
共通UI

- cardDetailModal.js
- cardFilters.js

### utils
共通関数