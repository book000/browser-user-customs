// ==UserScript==
// @name         Show actual price in Yodobashi
// @namespace    tomacheese.com
// @version      1.0.0
// @description  ヨドバシの商品ページで販売価格からポイントを引いた実質価格を表示する
// @author       Tomachi <tomachi@tomacheese.com> (https://github.com/book000)
// @homepageURL  https://github.com/book000/browser-user-customs
// @supportURL   https://github.com/book000/browser-user-customs/issues
// @updateURL    https://raw.githubusercontent.com/book000/browser-user-customs/master/js/yodobashi.co.jp/show-actual-price.user.js
// @downloadURL  https://raw.githubusercontent.com/book000/browser-user-customs/master/js/yodobashi.co.jp/show-actual-price.user.js
// @match        https://www.yodobashi.com/product/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yodobashi.com
// @grant        none
// @license      MIT
// ==/UserScript==

(function () {
  "use strict";

  setInterval(() => {
    const unitPriceElement = document.querySelector("#js_scl_unitPrice");
    const pointValueElement = document.querySelector("#js_scl_pointValue");
    const actualPriceElement = document.querySelector(".actual-price");
    if (!unitPriceElement || !pointValueElement || actualPriceElement) {
      return;
    }

    const price = unitPriceElement.innerText.replace("￥", "").replace(",", "");
    const point = pointValueElement.innerText
      .replace("ポイント", "")
      .replace(",", "");

    const actualPrice = price - point;
    const newActualPriceElement = document.createElement("span");
    newActualPriceElement.classList.add("actual-price");
    newActualPriceElement.innerText = `：実質 ${actualPrice} 円`;

    unitPriceElement.parentNode.appendChild(newActualPriceElement);
  }, 300);
})();
