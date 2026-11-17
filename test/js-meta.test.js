const assert = require("node:assert/strict");
const { execFileSync, spawnSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { test } = require("node:test");

const validator = path.resolve(__dirname, "../packages/js-meta.js");
const original = fs.readFileSync(path.resolve(__dirname, "../js/yodobashi.co.jp/show-actual-price.user.js"), "utf8");

function fixture(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "js-meta-test-"));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const file = path.join(directory, "js/yodobashi.co.jp/show-actual-price.user.js");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, original);
  return { directory, file };
}

function validate(directory, baseSha = "") {
  return spawnSync(process.execPath, [validator], {
    cwd: directory,
    encoding: "utf8",
    env: { ...process.env, BASE_SHA: baseSha },
  });
}

test("rejects invalid JavaScript even with valid metadata", (t) => {
  const { directory, file } = fixture(t);
  fs.appendFileSync(file, "\nconst broken = ;\n");
  const result = validate(directory);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /syntax check failed/);
});

test("requires a version change for a modified userscript", (t) => {
  const { directory, file } = fixture(t);
  const git = (...args) => execFileSync("git", args, { cwd: directory, encoding: "utf8" });
  git("init", "--quiet");
  git("config", "user.name", "Test");
  git("config", "user.email", "test@example.com");
  git("add", "js");
  git("commit", "--quiet", "-m", "initial");
  const base = git("rev-parse", "HEAD").trim();
  fs.appendFileSync(file, "\nvoid 0;\n");
  git("add", "js");
  git("commit", "--quiet", "-m", "change");
  const unchanged = validate(directory, base);
  assert.notEqual(unchanged.status, 0);
  assert.match(unchanged.stderr, /version must be updated/);
  fs.writeFileSync(file, fs.readFileSync(file, "utf8").replace("@version      1.0.2", "@version      1.0.3"));
  assert.equal(validate(directory, base).status, 0);
});
