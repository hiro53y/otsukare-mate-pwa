# おつかれさまメイト

仕事や作業で疲れた時に、女の子キャラクターが明るく労ってくれるスマホ向けPWAです。

## 起動方法
```bash
npm install
npm run dev
```

## ビルド方法
```bash
npm run build
```

生成物は `dist/` に出力されます。

## 春日部つむぎ音声の生成
VOICEVOXまたはVOICEVOX Engineを起動し、`http://127.0.0.1:50021` が応答する状態で実行します。

```bash
npm run generate:voice
```

生成先は `public/assets/voice/tsumugi/` です。現在は疲れ度メッセージ388件と日替わりメッセージ72件、合計460件のWAVを同梱します。アプリは同梱WAVを優先再生し、音声ファイルが無い場合は端末のWeb Speech APIへフォールバックします。

## BGMの生成と差し替え
初期BGMは以下で生成できます。

```bash
npm run generate:bgm
```

差し替えたい場合は、同名MP3を次の場所に上書きしてください。コード変更は不要です。

- 開発用: `public/assets/bgm/otsukare_bgm.mp3`
- 配布物: `assets/bgm/otsukare_bgm.mp3`

BGMはスマホブラウザの自動再生制限に合わせ、初回タップ後に通常音量でループ再生します。音声再生中もBGM音量は下げません。設定モーダルからON/OFFできます。

## プレビュー方法
```bash
npm run preview
```

標準では `http://127.0.0.1:4173/` で `dist/` を配信します。

## Cloudflare Pagesへのデプロイ方法
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `otsukare-mate-pwa`

## Android Chromeでホーム画面に追加する方法
1. Cloudflare PagesなどHTTPSで配信されたURLをAndroid Chromeで開く
2. Chromeメニューから「ホーム画面に追加」または「アプリをインストール」を選ぶ
3. ホーム画面から起動し、単独アプリ表示になることを確認する

## PWAとして追加できない場合の確認点
- HTTPSで配信されているか
- `/manifest.webmanifest` が200で取得できるか
- `/assets/icon-192.png` と `/assets/icon-512.png` が200で取得できるか
- `/sw.js` が200で取得でき、service worker登録が成功しているか
- ブラウザのキャッシュに古いservice workerが残っていないか

## 音声読み上げが動かない場合の注意点
- 初期状態は音声OFFです。右上の音声ボタンでONにしてください。
- スマホブラウザの制限により、起動直後の自動再生は行いません。音声ONまたはボタン操作後に再生します。
- `public/assets/voice/tsumugi/*.wav` が未生成の場合は、端末のWeb Speech APIへフォールバックします。
- 端末やブラウザ設定で音声再生が無効化されている場合があります。

## 音声クレジット
このアプリの同梱音声は `VOICEVOX:春日部つむぎ` を想定しています。音声を生成して配布する場合は、VOICEVOXおよび春日部つむぎの利用規約に従ってください。

## 画像素材の配置場所
基本画像は `public/assets/` に配置しています。実装内では `/assets/ファイル名` で参照します。

追加のキャラクター差分12枚は `public/assets/characters/` に、褒め・癒し用の追加イラスト24枚は `public/assets/characters/praise/` に配置しています。ビルド後の配布物では `assets/characters/` 以下にコピーされます。これらは既存キャラ素材と参考イラストの雰囲気を参照して生成した画像生成素材で、発話中・押下直後・今日のひとこと表示時の切り替えに使います。

## セリフの重複制御
セリフは `src/data/messages.ts` で管理します。`light / tired / cheer / rest` を各97件、`daily` を72件、合計460件用意しています。

同じ日付内では、各プールの全件を出し切るまで同じセリフが再表示されないよう、`localStorage` の `otsukare-mate:message-history:<date>` に表示履歴を保存します。
