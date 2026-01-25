# GEMINI.md

## 目的

このファイルは Gemini CLI 向けのコンテキストと作業方針を定義します。

## 出力スタイル

- **言語**: 日本語
- **トーン**: 技術的、明確、簡潔
- **形式**: Markdown 形式で構造化された出力

## 共通ルール

- **会話言語**: 日本語
- **コミット規約**: Conventional Commits に従う
  - `<type>(<scope>): <description>` 形式
  - `<description>` は日本語で記載
  - 例: `feat: ユーザー認証機能を追加`
- **ブランチ命名**: Conventional Branch に従う
  - `<type>/<description>` 形式
  - `<type>` は短縮形 (feat, fix) を使用
  - 例: `feat/add-user-auth`
- **日本語と英数字の間**: 半角スペースを挿入

## プロジェクト概要

- **目的**: ブラウザ拡張機能の Stylus や Tampermonkey で利用できるユーザスタイルシート / ユーザスクリプトの置き場
- **主な機能**:
  - ユーザスタイルシート (.user.css) の管理と配信
  - ユーザスクリプト (.user.js) の管理と配信
  - メタデータの検証とバージョン管理
  - GitHub Pages によるファイル一覧の公開

## コーディング規約

- **フォーマット**: JavaScript の標準的なフォーマットに従う
- **命名規則**: camelCase を使用する
- **コード内コメント**: 日本語で記載する
- **エラーメッセージ**: 英語で記載する
- **関数やインターフェースには docstring (JSDoc など) を日本語で記載する**

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

## 注意事項

### セキュリティ / 機密情報

- API キーや認証情報を Git にコミットしない
- ログに個人情報や認証情報を出力しない

### 既存ルールの優先

- このプロジェクトには既存のコーディング規約が存在する
- 既存のコードスタイルやパターンに従う
- 新しいパターンを導入する場合は、既存のコードとの一貫性を保つ

### 既知の制約

- メタデータの固定値は変更してはならない (CI で検証される)
- ファイル変更時は必ずバージョンを更新する必要がある
- バージョンが更新されていない場合、CI で検証エラーとなる

## リポジトリ固有

### メタデータ必須フィールド

- **CSS**: `name`, `namespace`, `version`, `homepageURL`, `supportURL`, `updateURL`, `description`, `author`, `license`
- **JS**: 上記に加えて `downloadURL`, `match`, `grant`, `icon`

### メタデータ固定値

以下の値は固定で、変更してはならない：

- `namespace`: `tomacheese.com`
- `author`: `Tomachi <tomachi@tomacheese.com> (https://github.com/book000)`
- `homepageURL`: `https://github.com/book000/browser-user-customs`
- `supportURL`: `https://github.com/book000/browser-user-customs/issues`
- `updateURL` (CSS): `https://raw.githubusercontent.com/book000/browser-user-customs/master/css/<ドメイン>/<ファイル名>`
- `updateURL` (JS): `https://raw.githubusercontent.com/book000/browser-user-customs/master/js/<ドメイン>/<ファイル名>`
- `downloadURL` (JS): `updateURL` と同じ

### バージョン管理

- ファイルを変更した場合は、必ずメタデータの `version` を更新する
- バージョンが更新されていない場合、CI で検証エラーとなる
- バージョンの形式: `major.minor.patch` (セマンティックバージョニングに従う)

### ディレクトリ構造

- `css/`: ユーザスタイルシート (.user.css) を格納
- `js/`: ユーザスクリプト (.user.js) を格納
- `packages/`: メタデータ検証とページ生成のスクリプト
  - `css-meta.js`: CSS メタデータ検証
  - `js-meta.js`: JS メタデータ検証
  - `generate-pages.js`: GitHub Pages 用のページ生成
- `.github/workflows/`: GitHub Actions の設定

### 技術スタック

- **言語**: JavaScript (Node.js 24.x)
- **パッケージマネージャー**: npm
- **依存ライブラリ**:
  - `usercss-meta`: ユーザスタイルシートのメタデータパーサー
  - `userscript-parser`: ユーザスクリプトのメタデータパーサー
  - `npm-run-all2`: npm スクリプトの並列実行
- **CI/CD**: GitHub Actions

### 特記事項

- メタデータの固定値は、CI で検証される。変更してはならない。
- 新しいユーザスタイルシート / ユーザスクリプトを追加する場合は、対象ドメインのディレクトリを作成する。
- GitHub Pages は自動的にファイル一覧を生成するため、手動でドキュメントを更新する必要はない。
