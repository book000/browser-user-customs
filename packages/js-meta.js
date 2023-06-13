const userScriptParser = require("userscript-parser");
const fs = require("fs");
const { execSync } = require("child_process");

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

function getUpdatedFiles(directory) {
  try {
    const baseSha = process.env.BASE_SHA;
    if (!baseSha || baseSha.length === 0) {
      return [];
    }

    const cmd = `git diff --name-only ${baseSha} HEAD`;
    const stdout = execSync(cmd, { encoding: "utf8" });
    return stdout
      .split("\n")
      .filter(
        (file) => file.startsWith(directory) && file.endsWith(".user.js")
      );
  } catch (e) {
    console.error("Failed to get updated files:", e);
    return [];
  }
}

function getParentVersion(baseSha, path) {
  try {
    const cmd = `git --no-pager show ${baseSha}:${path}`;
    const stdout = execSync(cmd, { encoding: "utf8" });
    const { meta } = userScriptParser(stdout);
    return meta.version[0];
  } catch (e) {
    console.error("Failed to get parent version:", e.message);
    return null;
  }
}

function validateValues(path, metadata) {
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

function checkVersion(path, meta) {
  const baseSha = process.env.BASE_SHA;
  const parentVersion = getParentVersion(baseSha, path);
  const currentVersion = meta.version[0];

  if (!parentVersion || !currentVersion) {
    return;
  }

  if (parentVersion !== currentVersion) {
    console.log(
      `${path}: version updated (${currentVersion} -> ${parentVersion})`
    );
    return;
  }

  throw new Error(`version must be updated (current: ${currentVersion})`);
}

function main() {
  const jsFiles = getJsFiles("./js/");

  const metas = {};

  let errors = 0;
  for (const jsFile of jsFiles) {
    console.log(`Validating ${jsFile}...`);
    const key = jsFile.replace("./", "");
    const path = jsFile.replace("./js/", "");
    try {
      const meta = parse(jsFile);
      metas[key] = meta;

      validateValues(path, meta);
    } catch (e) {
      console.error(`Failed to validate ${path}: ${e.message}`);
      errors++;
    }
  }

  const updatedFiles = getUpdatedFiles("js/");
  for (const updatedFile of updatedFiles) {
    console.log(`Check versioning ${updatedFile}...`);
    try {
      const meta = metas[updatedFile];
      if (!meta) {
        throw new Error("meta not found");
      }

      checkVersion(updatedFile, meta);
    } catch (e) {
      console.error(`Failed to check ${updatedFile}: ${e.message}`);
      errors++;
    }
  }

  process.exitCode = errors;
}

main();
