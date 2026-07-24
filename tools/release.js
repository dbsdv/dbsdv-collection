const fs = require("fs");
const path = require("path");

const versionPath = path.join(__dirname, "../version.json");
const swPath = path.join(__dirname, "../service-worker.js");

// version.json を読み込み
const version = JSON.parse(fs.readFileSync(versionPath, "utf8"));

// build を +1
version.build = (version.build ?? 0) + 1;

// 保存
fs.writeFileSync(versionPath, JSON.stringify(version, null, 2) + "\n", "utf8");

// service-worker.js 更新
let sw = fs.readFileSync(swPath, "utf8");

sw = sw.replace(
  /const CACHE_NAME = ".*?";/,
  `const CACHE_NAME = "dbsdv-build-${version.build}";`,
);

fs.writeFileSync(swPath, sw, "utf8");

console.log(`✅ Build: ${version.build}`);
console.log(`✅ CACHE_NAME: dbsdv-build-${version.build}`);
