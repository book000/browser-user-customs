// ==UserScript==
// @name         Auto open all checks on github.com
// @namespace    tomacheese.com
// @version      1.0.0
// @description  GitHub.com にてプルリクエストの全てのチェックを自動で開くようにする。
// @author       Tomachi <tomachi@tomacheese.com> (https://github.com/book000)
// @homepageURL  https://github.com/book000/browser-user-customs
// @supportURL   https://github.com/book000/browser-user-customs/issues
// @updateURL    https://raw.githubusercontent.com/book000/browser-user-customs/master/js/github.com/auto-open-all-checks.user.js
// @downloadURL  https://raw.githubusercontent.com/book000/browser-user-customs/master/js/github.com/auto-open-all-checks.user.js
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @license      MIT
// ==/UserScript==

(function () {
  "use strict";

  setInterval(() => {
    const element = document.querySelector(
      "div.branch-action-item span.statuses-toggle-closed"
    );
    if (!element) {
      return;
    }
    const display = window
      .getComputedStyle(element)
      .getPropertyValue("display");
    if (display != "none") {
      element.click();
    }
  }, 1000);
})();
