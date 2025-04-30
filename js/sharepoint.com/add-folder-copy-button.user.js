// ==UserScript==
// @name         Copy Folder Path in SharePoint Shared Documents
// @namespace    tomacheese.com
// @version      1.2.0
// @description  SharePointでフォルダパスをコピーするボタンを追加する
// @author       Tomachi <tomachi@tomacheese.com> (https://github.com/book000)
// @homepageURL  https://github.com/book000/browser-user-customs
// @supportURL   https://github.com/book000/browser-user-customs/issues
// @updateURL    https://raw.githubusercontent.com/book000/browser-user-customs/master/js/sharepoint.com/add-folder-copy-button.user.js
// @downloadURL  https://raw.githubusercontent.com/book000/browser-user-customs/master/js/sharepoint.com/add-folder-copy-button.user.js
// @match        https://*.sharepoint.com/sites/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sharepoint.com
// @grant        none
// @license      MIT
// ==/UserScript==

(function () {
  "use strict";

  const iconElement = document.createElement("i");
  iconElement.setAttribute("data-icon-name", "Link");
  iconElement.setAttribute("aria-hidden", "true");
  iconElement.setAttribute("class", "ms-Icon ms-Button-icon");
  iconElement.setAttribute("style", "font-family: FabricMDL2Icons;");
  iconElement.textContent = "";

  const buttonElement = document.createElement("button");
  buttonElement.setAttribute("type", "button");
  buttonElement.setAttribute("data-automationid", "copyLinkCommand");
  buttonElement.classList.add("ms-Button", "copy-folder-path-button");
  buttonElement.appendChild(iconElement);

  buttonElement.addEventListener("click", () => {
    const folderElement = document.querySelector(
      'div.Files-content div[data-automationid="appHeader"] ol[data-automationid="breadcrumb-root-id"] li:last-child'
    );

    // フォルダパスの取得
    const folderArray = JSON.parse(
      folderElement.getAttribute("data-item-key")
    );
    const rawFolderPath = folderArray.at(-1);

    // "Shared Documents" よりもあとが本来のパス名なので、これを取得
    const indexKeyword = "Shared Documents";
    const index = rawFolderPath.indexOf(indexKeyword) + indexKeyword.length + 1;
    const folderPath =
      index !== -1 ? rawFolderPath.slice(index) : rawFolderPath;

    const slash2greaterThanSign = folderPath.replaceAll("/", " > ") + " > ";

    navigator.clipboard
      .writeText(slash2greaterThanSign)
      .then(() => {
        alert("パスをコピーしました");
      })
      .catch((error) => {
        alert("パスのコピーに失敗しました");
        console.error("Path copy failed", error);
      });
  });

  setInterval(() => {
    const breadcrumbElement = document.querySelector(
      'div.Files-content div[data-automationid="appHeader"] ol[data-automationid="breadcrumb-root-id"] li'
    );
    if (breadcrumbElement === null) {
      return;
    }
    const isExistButton = document.querySelector(
      'div.Files-content div[data-automationid="appHeader"] button.copy-folder-path-button'
    );
    if (isExistButton !== null) {
      return;
    }
    breadcrumbElement.prepend(buttonElement);
  }, 1000);
})();
