// ==UserScript==
// @name         Advertising items semi-transparent on amazon.co.jp
// @namespace    tomacheese.com
// @version      1.0.0
// @description  Amazonで広告系アイテムを半透明化する。
// @author       Tomachi <tomachi@tomacheese.com> (https://github.com/book000)
// @homepageURL  https://github.com/book000/browser-user-customs
// @supportURL   https://github.com/book000/browser-user-customs/issues
// @updateURL    https://raw.githubusercontent.com/book000/browser-user-customs/master/js/amazon.co.jp/remove-amazon-ads.user.js
// @downloadURL  https://raw.githubusercontent.com/book000/browser-user-customs/master/js/amazon.co.jp/remove-amazon-ads.user.js
// @match        https://www.amazon.co.jp/s?k=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.co.jp
// @grant        none
// @license      MIT
// ==/UserScript==

(function () {
  "use strict";

  function run() {
    const opacity = 0; // .5で半透明、0で透明(消す)

    // 「スポンサー」がついたアイテムを半透明にする
    document
      .querySelectorAll("a.puis-sponsored-label-text")
      .forEach((element) => {
        const target =
          element.parentNode.parentNode.parentNode.parentNode.parentNode
            .parentNode.parentNode.parentNode.parentNode.parentNode;
        if (opacity === 0) {
          target.style.display = "none";
        }

        target.style.opacity = opacity;
      });
    // 独自広告系アイテム群を半透明にする
    document.querySelectorAll(".AdHolder").forEach((element) => {
      if (opacity === 0) {
        element.style.display = "none";
      }

      element.style.opacity = opacity;
    });

    // 動画系広告を半透明にする
    document
      .querySelectorAll('span[data-component-type="sbv-video-single-product"]')
      .forEach((element) => {
        if (opacity === 0) {
          element.style.display = "none";
        }

        element.style.opacity = opacity;
      });
  }

  setInterval(() => {
    run();
  }, 100);
  run();
})();
