const userCssMeta = require("usercss-meta");
const fs = require("fs");

function parse(path) {
  const data = fs.readFileSync(path, "utf8");
  return userCssMeta.parse(data);
}

function getCssFiles(path) {
  // recursively get all css files
  const files = fs.readdirSync(path);
  const cssFiles = [];
  for (const file of files) {
    const filePath = path + file;

    if (fs.statSync(filePath).isDirectory()) {
      cssFiles.push(...getCssFiles(filePath + "/"));
    } else if (filePath.endsWith(".user.css")) {
      cssFiles.push(filePath);
    }
  }
  return cssFiles;
}

function check(path, result) {
  const metadata = result.metadata;
  // 必須要件
  const required = [
    "name",
    "namespace",
    "version",
    "homepageURL",
    "supportURL",
    "updateURL",
    "description",
    "author",
    "license",
  ];
  const missing = required.filter((key) => !(key in metadata));
  if (missing.length > 0) {
    throw new Error(`missing required keys: ${missing.join(", ")}`);
  }

  // namespace は tomacheese.com であること
  const validNamespace = "tomacheese.com";
  if (metadata.namespace !== validNamespace) {
    throw new Error(`namespace must be "${validNamespace}"`);
  }

  // homepageURL は https://github.com/book000/browser-user-customs であること
  const validHomepageURL = "https://github.com/book000/browser-user-customs";
  if (metadata.homepageURL !== validHomepageURL) {
    throw new Error(`homepageURL must be "${validHomepageURL}"`);
  }

  // supportURL は https://github.com/book000/browser-user-customs/issues であること
  const validSupportURL =
    "https://github.com/book000/browser-user-customs/issues";
  if (metadata.supportURL !== validSupportURL) {
    throw new Error(`supportURL must be "${validSupportURL}"`);
  }

  // updateURL は https://raw.githubusercontent.com/book000/browser-user-customs/master/css/ から始まる正しいパスであること
  const validUpdateURL = `https://raw.githubusercontent.com/book000/browser-user-customs/master/css/${path}`;
  if (metadata.updateURL !== validUpdateURL) {
    throw new Error(`updateURL must be ${validUpdateURL}`);
  }

  // author は Tomachi <tomachi@tomacheese.com> (https://github.com/book000) であること
  const validAuthor =
    "Tomachi <tomachi@tomacheese.com> (https://github.com/book000)";
  if (metadata.author !== validAuthor) {
    throw new Error(`author must be "${validAuthor}"`);
  }
}

function main() {
  const cssFiles = getCssFiles("./css/");

  let errors = 0;
  for (const cssFile of cssFiles) {
    const path = cssFile.replace("./css/", "");
    try {
      console.log(`Parsing ${path}...`);
      const result = parse(cssFile);
      console.log(`Checking ${path}...`);
      check(path, result);
    } catch (e) {
      console.error(`Failed to check ${path}: ${e.message}`);
      errors++;
    }
  }

  process.exitCode = errors;
}

main();
