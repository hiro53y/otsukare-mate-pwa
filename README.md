# おつかれさまメイト（UI刷新版）

疲れたあなたに、女の子キャラが寄り添って癒しの言葉をかけてくれるスマホ向けPWAです。
BGM・VOICEVOX（春日部つむぎ）音声・360件のセリフはこれまで通り同梱しています。

## スマホでの使い方（本番：GitHub → Cloudflare Pages）
このリポジトリ（`hiro53y/otsukare-mate-pwa`）の `main` に push すると、
Cloudflare Pages が自動でビルド・デプロイします。

1. スマホのブラウザで公開URLを開く： https://otsukare-mate-pwa.pages.dev/
2. ブラウザメニューから「ホーム画面に追加」→ アプリとして起動
3. 初回タップ後に BGM が小音量で再生。音声ボタンで VOICEVOX 音声の読み上げをON
   （対応していない端末ではブラウザ読み上げに自動でフォールバック）

> HTTPS で配信されるため、BGM・音声・オフライン動作（Service Worker）がすべて有効です。

## デプロイ構成（Cloudflare Pages）
- Production URL: https://otsukare-mate-pwa.pages.dev/
- Build command: `npm run build`
- Build output directory: `dist`
- ビルドの実体は `scripts/cloudflare-build-static.mjs`。配布物
  （`index.html` / `manifest.webmanifest` / `sw.js` / `README.md` / `assets/`）を
  `dist/` にコピーするだけの静的ビルドです。
- 更新手順：このフォルダの内容を変更 → `git add` → `git commit` → `git push origin main`
  → Cloudflare が自動デプロイ。

## 機能
- **きもち選択**（4種）でキャラと言葉が切り替わる（セリフは全360件、同日重複しにくい制御つき）
- **今日のひとこと**：日替わりメッセージ
- **音声ON**：VOICEVOX（春日部つむぎ）の同梱音声を優先再生／無い端末はブラウザ読み上げへ自動切替
- **BGM ON/OFF**：ヘッダーから切替（最初のタップ後に小音量でループ再生）
- **ふりかえり**・**ごほうびリスト**：記録はこの端末のブラウザ内に保存

## ファイル構成
- `index.html` … エントリ（`assets/main.js` / `main.css` を読み込む）
- `assets/` … アプリ本体・キャラ画像・BGM(mp3)・VOICEVOX音声(wav×360)・各種アイコン
- `sw.js` … オフライン用 Service Worker
- `manifest.webmanifest` … PWA設定
- `package.json` / `scripts/cloudflare-build-static.mjs` … Cloudflare Pages 用ビルド

## ローカルで確認したい場合
このフォルダで簡易サーバーを起動して `http://127.0.0.1:8000/` を開いてください。
（`file://` で直接開くと BGM・音声・SW が動きません）

```
python -m http.server 8000
```

## 音声クレジット
同梱音声は VOICEVOX：春日部つむぎ を想定しています。再配布時は各利用規約に従ってください。
