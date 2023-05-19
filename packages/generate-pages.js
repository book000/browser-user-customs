const userScriptParser = require("userscript-parser");
const userCssMeta = require("usercss-meta");
const fs = require("fs");

function parseJs(path) {
  const data = fs.readFileSync(path, "utf8");
  const { meta } = userScriptParser(data);
  return meta;
}

function parseCss(path) {
  const data = fs.readFileSync(path, "utf8");
  return userCssMeta.parse(data);
}

function getFiles(path, extension) {
  // recursively get all css files
  const files = fs.readdirSync(path);
  const cssFiles = [];
  for (const file of files) {
    const filePath = path + file;

    if (fs.statSync(filePath).isDirectory()) {
      cssFiles.push(...getFiles(filePath + "/", extension));
    } else if (filePath.endsWith(extension)) {
      cssFiles.push(filePath);
    }
  }
  return cssFiles;
}

function main() {
  const cssFiles = getFiles("./css/", ".user.css");
  const jsFiles = getFiles("./js/", ".user.js");

  const cssMeta = cssFiles.map(parseCss);
  const jsMeta = jsFiles.map(parseJs);

  const cssList = cssMeta.map((meta) => {
    return `<li><a href="${meta.metadata.updateURL}">${meta.metadata.name}</a>: ${meta.metadata.description}</li>`;
  });
  const jsList = jsMeta.map((meta) => {
    return `<li><a href="${meta.downloadURL[0]}">${meta.name[0]}</a>: ${meta.description[0]}</li>`;
  });

  fs.mkdirSync("./dist/", { recursive: true });

  // このファイルと同じディレクトリにある template.html を使う
  // <USER-STYLESHEET-LIST> を cssMeta で置換する
  // <USER-SCRIPT-LIST> を jsMeta で置換する
  const template = fs
    .readFileSync(__dirname + "/template.html", "utf8")
    .replace("<USER-STYLESHEET-LIST>", cssList.join("\n"))
    .replace("<USER-SCRIPT-LIST>", jsList.join("\n"));

  fs.writeFileSync("./dist/index.html", template);
}

main();
