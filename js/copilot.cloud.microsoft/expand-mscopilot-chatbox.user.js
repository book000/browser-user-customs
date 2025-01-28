// ==UserScript==
// @name         Remove max-height and max-width from chat input in Microsoft Copilot
// @namespace    https://tomacheese.com
// @version      1.0.0
// @description  Remove max-height and max-width from chat input in Microsoft Copilot to make it easier to read and write code in the chat input box
// @author       Tomachi <tomachi@tomacheese.com> (https://github.com/book000)
// @homepageURL  https://github.com/book000/browser-user-customs
// @supportURL   https://github.com/book000/browser-user-customs/issues
// @updateURL    https://raw.githubusercontent.com/book000/browser-user-customs/master/js/copilot.cloud.microsoft/remove-amazon-ads.user.js
// @downloadURL  https://raw.githubusercontent.com/book000/browser-user-customs/master/js/copilot.cloud.microsoft/remove-amazon-ads.user.js
// @match        https://outlook.office.com/hosted/semanticoverview/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=copilot.cloud.microsoft
// @grant        none
// @license      MIT
// ==/UserScript==

(function () {
  "use strict";

  function removeMaxHeightAndWidth() {
    const selectors = [
      "#m365-chat-input-shared-container",
      "#m365-chat-input-shared-container > div.___sdnw1k0.f14hp5dx.f14h9hh7.f10pi13n.f1hu3pq6.f1ujusj6.f19f4twv.fcgxt0o",
      "#m365-chat-input-shared-container > div.___sdnw1k0.f14hp5dx.f14h9hh7.f10pi13n.f1hu3pq6.f1ujusj6.f19f4twv.fcgxt0o > div.fai-ChatInput.r1v3870x.___3cowme0.f1xxuklu > div",
      "#m365-chat-editor-target-element",
    ];

    // remove max-height and max-width
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        element.style.maxHeight = "none";
        element.style.maxWidth = "none";
      }
    }
  }

  setInterval(removeMaxHeightAndWidth, 1000);
})();
