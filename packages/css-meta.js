const userCssMeta = require("usercss-meta");
const fs = require("fs");
const { execSync } = require("child_process");

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
        (file) => file.startsWith(directory) && file.endsWith(".user.css")
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
    const meta = userCssMeta.parse(stdout);
    return meta.version;
  } catch (e) {
    console.error("Failed to get parent version:", e.message);
    return null;
  }
}

function validateValues(path, result) {
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

function checkVersion(path, meta) {
  const baseSha = process.env.BASE_SHA;
  const parentVersion = getParentVersion(baseSha, path);
  const currentVersion = meta.version;

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
  const cssFiles = getCssFiles("./css/");

  const metas = {};

  let errors = 0;
  for (const cssFile of cssFiles) {
    console.log(`Validating ${cssFile}...`);
    const key = cssFile.replace("./", "");
    const path = cssFile.replace("./css/", "");
    try {
      const result = parse(cssFile);
      metas[key] = result;

      validateValues(path, result);
    } catch (e) {
      console.error(`Failed to check ${path}: ${e.message}`);
      errors++;
    }
  }

  const updatedFiles = getUpdatedFiles("css/");
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
