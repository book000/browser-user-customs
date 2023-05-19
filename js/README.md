# browser-user-customs/js

Tampermonkey ([Chrome](https://chrome.google.com/webstore/detail/dhdgffkkebhmkfjojejmpbldmpobfkfo) / [Firefox](https://addons.mozilla.org/ja/firefox/addon/tampermonkey/)) などを用いてブラウザページにカスタムスタイルシートを適用する。

JavaScript のヘッダーは以下がテンプレート

```js
// ==UserScript==
// @name         タイトル
// @namespace    tomacheese.com
// @version      1.0.0
// @description  説明文
// @author       Tomachi <tomachi@tomacheese.com> (https://github.com/book000)
// @homepageURL  https://github.com/book000/browser-user-customs
// @supportURL   https://github.com/book000/browser-user-customs/issues
// @updateURL    https://raw.githubusercontent.com/book000/browser-user-customs/master/<ファイルパス>
// @downloadURL  https://raw.githubusercontent.com/book000/browser-user-customs/master/<ファイルパス>
// @match        ページURLの正規表現
// @icon         https://www.google.com/s2/favicons?sz=64&domain=<ドメイン>
// @grant        none
// @license      MIT
// ==/UserScript==
```
