const userScriptParser = require("userscript-parser");
const fs = require("fs");

function parse(path) {
  const data = fs.readFileSync(path, "utf8");
  const { meta } = userScriptParser(data);
  return meta;
}

function getJsFiles(path) {
  // recursively get all js files
  const files = fs.readdirSync(path);
  const jsFiles = [];
  for (const file of files) {
    const filePath = path + file;

    if (fs.statSync(filePath).isDirectory()) {
      jsFiles.push(...getJsFiles(filePath + "/"));
    } else if (filePath.endsWith(".user.js")) {
      jsFiles.push(filePath);
    }
  }
  return jsFiles;
}

function check(path, metadata) {
  // 必須要件
  const required = [
    "name",
    "namespace",
    "version",
    "description",
    "author",
    "homepageURL",
    "supportURL",
    "updateURL",
    "downloadURL",
    "match",
    "grant",
    "icon",
    "license",
  ];
  const missing = required.filter((key) => !(key in metadata));
  if (missing.length > 0) {
    throw new Error(`missing required keys: ${missing.join(", ")}`);
  }

  // namespace は tomacheese.com であること
  const validNamespace = "tomacheese.com";
  if (metadata.namespace[0] !== validNamespace) {
    throw new Error(
      `namespace must be "${validNamespace}" (got "${metadata.namespace}")`
    );
  }

  // homepageURL は https://github.com/book000/browser-user-customs であること
  const validHomepageURL = "https://github.com/book000/browser-user-customs";
  if (metadata.homepageURL[0] !== validHomepageURL) {
    throw new Error(`homepageURL must be "${validHomepageURL}"`);
  }

  // supportURL は https://github.com/book000/browser-user-customs/issues であること
  const validSupportURL =
    "https://github.com/book000/browser-user-customs/issues";
  if (metadata.supportURL[0] !== validSupportURL) {
    throw new Error(`supportURL must be "${validSupportURL}"`);
  }

  // updateURL と downloadURL は https://raw.githubusercontent.com/book000/browser-user-customs/master/js/ から始まる正しいパスであること
  const validUpdateURL = `https://raw.githubusercontent.com/book000/browser-user-customs/master/js/${path}`;
  if (metadata.updateURL[0] !== validUpdateURL) {
    throw new Error(`updateURL must be ${validUpdateURL}`);
  }
  if (metadata.downloadURL[0] !== validUpdateURL) {
    throw new Error(`downloadURL must be ${validUpdateURL}`);
  }

  // author は Tomachi <tomachi@tomacheese.com> (https://github.com/book000) であること
  const validAuthor =
    "Tomachi <tomachi@tomacheese.com> (https://github.com/book000)";
  if (metadata.author[0] !== validAuthor) {
    throw new Error(`author must be "${validAuthor}"`);
  }
}

function main() {
  const jsFiles = getJsFiles("./js/");

  let errors = 0;
  for (const jsFile of jsFiles) {
    const path = jsFile.replace("./js/", "");
    try {
      console.log(`Parsing ${path}...`);
      const meta = parse(jsFile);
      console.log(`Checking ${path}...`);
      check(path, meta);
    } catch (e) {
      console.error(`Failed to check ${path}: ${e.message}`);
      errors++;
    }
  }

  process.exitCode = errors;
}

main();
