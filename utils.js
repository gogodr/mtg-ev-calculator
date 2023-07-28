import fs from "fs";

function needsUpdate(setSlug) {
  if (!fs.existsSync("ck-data")) {
    console.log("No data folder found, updating...");
    return true;
  }
  if (fs.existsSync(`ck-data/${setSlug}.json`)) {
    const metadata = fs.statSync(`ck-data/${setSlug}.json`);
    const now = new Date();
    const diff = (now - metadata.mtime) / 60000;
    if (diff > 60) {
      console.log(`Set data for ${setSlug} older than 1h, updating...`);
      return true;
    }
  } else {
    console.log(`No set data found for ${setSlug}, updating...`);
    return true;
  }
  return false;
}

function saveJsonFile(setSlug, json) {
  if (!fs.existsSync("ck-data")) {
    fs.mkdirSync("ck-data");
  }
  fs.writeFileSync(
    `ck-data/${setSlug}.json`,
    JSON.stringify(json, null, 2),
    function (err) {
      if (err) throw err;
    }
  );
}

function betweenRange(x, range) {
  return x >= range[0] && x <= range[1];
}

export { needsUpdate, saveJsonFile, betweenRange };
