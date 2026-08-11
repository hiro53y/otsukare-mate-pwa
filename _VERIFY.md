# 検証ログ

- 検証日時: 2026-08-11 12:43 JST
- 検証環境: Windows / Node.js v24.14.0 / PowerShell / Codex内ブラウザ
- 実行コマンド: `npm test`、`npm run build`、`node --check dist/assets/main.js`、`node scripts/serve-dist.mjs`

## 確認結果
- [x] 個人最適化テストと癒し素材検証が成功
- [x] 新規VOICEVOX WAVは412件（主セリフ388件+短音声24件）、manifestと全件一致
- [x] 全新規WAVがRIFF/WAVE・PCM16・0.2〜30秒・非無音・極端なクリップなし
- [x] HealingSceneは各意図4枚、合計12枚、すべて960×1280px WebP・1MB未満
- [x] 12枚を目視し、文字混入なし、人物の顔・手、既存キャラクターとの一貫性を確認
- [x] TypeScript、ビルド、生成JS構文確認が成功
- [x] cache-bustは`20260811-healing-experience`、Service Workerは`otsukare-mate-v20`
- [x] 360pxで疲れ度→意図→セリフ→情景→もうひとこと、低評価時の同一意図再選択、高評価後の二重評価防止、情景と拡大画像の一致を確認
- [x] 360pxで`clientWidth=scrollWidth=360`、console警告・エラーなし。430pxは可変グリッドと横方向抑止を静的確認
- [x] ローカルHTTPで本体、JS/CSS、SW、manifest、3意図WAV、短音声、daily WAV、代表WebPがすべて200応答
- [x] `dist/`の600ファイルと配布物の対応ファイルは全件SHA-256一致
- [x] 配布音声は新規412件+daily 72件。旧mood WAVは0件
- [x] `assets/main.js` SHA-256: `19A327F5DE9471855FEBEA22974D73E410F1D717600004C43F7E51A0A5307BC7`

## 未確認
- Android Chrome実機での実音、BGM、430px表示、ギャラリー音声3秒間隔
- GitHub commit/push、Cloudflare Pages本番反映（今回の作業範囲外）

- 検証者: Codex
