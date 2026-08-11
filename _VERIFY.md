# 検証ログ

- 検証日時: 2026-08-09 21:08 (JST)
- 最終文書確認: 2026-08-11 (JST)
- 検証環境: Windows / Node.js v24.14.0 / PowerShell / Codex内ブラウザ
- 起動コマンド: `npm test`、`npm run build`、`node ./scripts/serve-dist.mjs`
- 確認した動作:
  - [x] `npm test`が成功し、388件の意味ベース3意図分類、重み式、履歴一巡、直前除外、破損ストレージを確認
  - [x] `npm run build`と`node --check dist/assets/main.js`が成功
  - [x] 360pxで疲れ度→声かけ種別→セリフ→評価が動作し、低評価で別セリフ、高評価後は二重評価不可になることを確認
  - [x] 設定画面で評価2件・適合率50%を確認
  - [x] 360px/430pxで横スクロールなし、430pxで3種類の声かけボタン、console警告/エラーなしを確認
  - [x] ローカルHTTPでホーム、JS、CSS、service worker、manifest、代表WAVが200応答
  - [x] `dist/assets/main.js`と配布物のSHA-256が一致（`86B1EA4CBC7E0FF9E6A05DD1DC643C5EA34DFE77818C9EC44BFBA62866F9B3A7`）
  - [x] 配布物に`node_modules`、`__pycache__`、`.env`が含まれない
- 既知の問題: Android Chrome実機での操作と、継続利用後の主観的な適合率改善は未確認
- 検証者: Codex
