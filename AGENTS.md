# AGENTS.md

## 目的

このファイルは AI エージェント共通の作業方針を定義します。

## 基本方針

- **会話言語**: 日本語
- **コード内コメント**: 日本語
- **エラーメッセージ**: 英語
- **コミット規約**: Conventional Commits に従う
  - `<type>(<scope>): <description>` 形式
  - `<description>` は日本語で記載
  - 例: `feat: ユーザー認証機能を追加`
- **ブランチ命名**: Conventional Branch に従う
  - `<type>/<description>` 形式
  - `<type>` は短縮形 (feat, fix) を使用
  - 例: `feat/add-user-auth`
- **日本語と英数字の間**: 半角スペースを挿入

## 判断記録のルール

判断を行う際は、以下の内容を記録します：

1. **判断内容の要約**: 何を決定したか
2. **検討した代替案**: どのような選択肢があったか
3. **採用しなかった案とその理由**: なぜその案を選ばなかったか
4. **前提条件・仮定・不確実性**: 判断の根拠となる条件や仮定

前提・仮定・不確実性を明示し、仮定を事実のように扱わない。

## 開発手順（概要）

1. **プロジェクト理解**:
   - `README.md`, `package.json`, 関連ドキュメントを読み、プロジェクトの目的と構造を理解する
   - 技術スタック、開発コマンド、テスト方針を把握する

2. **依存関係インストール**:
   - `npm ci` で依存関係をインストールする

3. **変更実装**:
   - プロジェクトのコーディング規約に従って実装する
   - 日本語と英数字の間に半角スペースを入れる
   - コード内コメントは日本語で記載する
   - エラーメッセージは英語で記載する

4. **テストと Lint/Format 実行**:
   - `npm run lint` でメタデータ検証を実行する
   - エラーがある場合は修正する

## セキュリティ / 機密情報

- API キーや認証情報を Git にコミットしない
- ログに個人情報や認証情報を出力しない

## リポジトリ固有

### プロジェクト概要

- **目的**: ブラウザ拡張機能の Stylus や Tampermonkey で利用できるユーザスタイルシート / ユーザスクリプトの置き場
- **技術スタック**:
  - 言語: JavaScript (Node.js 24.x)
  - パッケージマネージャー: npm
  - CI/CD: GitHub Actions

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

### 開発コマンド

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

### ディレクトリ構造

- `css/`: ユーザスタイルシート (.user.css) を格納
- `js/`: ユーザスクリプト (.user.js) を格納
- `packages/`: メタデータ検証とページ生成のスクリプト
- `.github/workflows/`: GitHub Actions の設定

### 注意事項

- メタデータの固定値は、CI で検証される。変更してはならない。
- 新しいユーザスタイルシート / ユーザスクリプトを追加する場合は、対象ドメインのディレクトリを作成する。
- GitHub Pages は自動的にファイル一覧を生成するため、手動でドキュメントを更新する必要はない。
