# GitHub Copilot Instructions

## プロジェクト概要

- 目的: ブラウザ拡張機能の Stylus や Tampermonkey で利用できるユーザスタイルシート / ユーザスクリプトの置き場
- 主な機能:
  - ユーザスタイルシート (.user.css) の管理と配信
  - ユーザスクリプト (.user.js) の管理と配信
  - メタデータの検証とバージョン管理
  - GitHub Pages によるファイル一覧の公開
- 対象ユーザー: ブラウザカスタマイズを行うユーザー、開発者

## 共通ルール

- 会話は日本語で行う。
- コミットメッセージは Conventional Commits に従う。`<description>` は日本語で記載する。
  - 例: `feat: ユーザー認証機能を追加`
- ブランチ命名は Conventional Branch に従う。`<type>` は短縮形 (feat, fix) を使用する。
  - 例: `feat/add-user-auth`
- 日本語と英数字の間には半角スペースを入れる。

## 技術スタック

- 言語: JavaScript (Node.js)
- パッケージマネージャー: npm
- 依存ライブラリ:
  - `usercss-meta`: ユーザスタイルシートのメタデータパーサー
  - `userscript-parser`: ユーザスクリプトのメタデータパーサー
  - `npm-run-all2`: npm スクリプトの並列実行
- CI/CD: GitHub Actions
- Node.js バージョン: 24.x

## コーディング規約

- フォーマット: JavaScript の標準的なフォーマットに従う
- 命名規則: camelCase を使用する
- コード内コメント: 日本語で記載する
- エラーメッセージ: 英語で記載する
- 関数には docstring (JSDoc など) を日本語で記載する (新規作成時や大規模な変更時)

## 開発コマンド

```bash
# 依存関係のインストール
npm ci

# Lint (CSS と JS のメタデータ検証)
npm run lint

# CSS メタデータ検証
npm run lint-css

# JS メタデータ検証
npm run lint-js

# GitHub Pages 用のページ生成
npm run generate-pages
```

## テスト方針

- テストフレームワーク: なし (メタデータ検証のみ)
- 検証内容:
  - ユーザスタイルシート / ユーザスクリプトのメタデータが正しいこと
  - 必須フィールドが存在すること
  - バージョンが更新されていること (ファイル変更時)

## セキュリティ / 機密情報

- API キーや認証情報を Git にコミットしない
- ログに個人情報や認証情報を出力しない

## ドキュメント更新

- 新しいユーザスタイルシート / ユーザスクリプトを追加した場合:
  - `README.md` を更新する必要はない (GitHub Pages で自動生成される)
  - メタデータに正しい情報を記載する

## リポジトリ固有

- **メタデータ必須フィールド**:
  - CSS: `name`, `namespace`, `version`, `homepageURL`, `supportURL`, `updateURL`, `description`, `author`, `license`
  - JS: 上記に加えて `downloadURL`, `match`, `grant`, `icon`
- **メタデータ固定値**:
  - `namespace`: `tomacheese.com`
  - `author`: `Tomachi <tomachi@tomacheese.com> (https://github.com/book000)`
  - `homepageURL`: `https://github.com/book000/browser-user-customs`
  - `supportURL`: `https://github.com/book000/browser-user-customs/issues`
  - `updateURL` (CSS): `https://raw.githubusercontent.com/book000/browser-user-customs/master/css/<ドメイン>/<ファイル名>`
  - `updateURL` (JS): `https://raw.githubusercontent.com/book000/browser-user-customs/master/js/<ドメイン>/<ファイル名>`
  - `downloadURL` (JS): `updateURL` と同じ
- **バージョン管理**:
  - ファイルを変更した場合は、必ずメタデータの `version` を更新する
  - バージョンが更新されていない場合、CI で検証エラーとなる
- **ディレクトリ構造**:
  - `css/`: ユーザスタイルシート (.user.css) を格納
  - `js/`: ユーザスクリプト (.user.js) を格納
  - `packages/`: メタデータ検証とページ生成のスクリプト
  - `.github/workflows/`: GitHub Actions の設定
