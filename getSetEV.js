import * as cheerio from "cheerio";
import axios from "axios";
import slugify from "slugify";
import fs from "fs";

async function getCards(set, setSlug, p = 1, foils = false, variants = false) {
  const cardKingdomUrl = `https://www.cardkingdom.com/mtg/${setSlug}/${
    foils ? "foils" : "singles"
  }`;
  const cardKingdomResponse = await axios.get(`${cardKingdomUrl}?page=${p}`, {
    headers: {
      Cookie: "limit=100",
    },
  });
  const cardKingdomHtml = cardKingdomResponse.data;
  const $ = cheerio.load(cardKingdomHtml);
  const cardsRaw = $(".mainListing .itemContentWrapper").toArray();
  const cards = [];
  for (const card of cardsRaw) {
    let cardName = $(".productDetailTitle", card).text();
    const cardPrice = parseFloat(
      $(".amtAndPrice .stylePrice", card).text().trim().replace("$", "")
    );
    const cardRarityRaw = $(".productDetailSet", card).text().trim();
    const collectorNumber = parseInt(
      $(".collector-number", card).text().trim().replace("Collector #: ", "")
    );
    const legendary = $(".productDetailType", card)
      .text()
      .trim()
      .includes("Legendary");
    let cardRarity = "";
    if (cardRarityRaw.includes("(M)")) {
      cardRarity = "Mythic";
    } else if (cardRarityRaw.includes("(R)")) {
      cardRarity = "Rare";
    } else if (cardRarityRaw.includes("(U)")) {
      cardRarity = "Uncommon";
    } else if (cardRarityRaw.includes("(C)")) {
      cardRarity = "Common";
    }

    let borderless = false;
    let foilEtched = false;
    let texturedFoil = false;
    let extendedArt = false;
    let skip = false;

    if (cardName.includes("(Borderless)")) {
      borderless = true;
      cardName = cardName.replace("(Borderless)", "").trim();
    }
    if (cardName.includes("(Foil Etched)")) {
      foilEtched = true;
      cardName = cardName.replace("(Foil Etched)", "").trim();
    }
    if (cardName.includes("(Textured Foil)")) {
      texturedFoil = true;
      cardName = cardName.replace("(Textured Foil)", "").trim();
    }
    if (cardName.includes("(Textured Foil Borderless)")) {
      texturedFoil = true;
      borderless = true;
      cardName = cardName.replace("(Textured Foil Borderless)", "").trim();
    }
    if (cardName.includes("(Extended Art)")) {
      extendedArt = true;
      cardName = cardName.replace("(Extended Art)", "").trim();
    }
    if (cardName.includes(`(${collectorNumber})`)) {
      cardName = cardName.replace(`(${collectorNumber})`, "").trim();
    }
    if (
      cardName.includes(
        "(Foil Etched Display Commander - Not Tournament Legal)"
      )
    ) {
      skip = true;
    }
    if (!cardRarity) {
      skip = true;
    }

    if (!skip) {
      cards.push({
        set,
        cardName,
        cardPrice,
        cardRarity,
        collectorNumber,
        legendary,
        borderless,
        foil: foils,
        foilEtched,
        texturedFoil,
        extendedArt,
        variant: variants,
      });
    }
  }

  return cards;
}

function needsUpdate(setSlug) {
  if (!fs.existsSync("ck-data")) {
    console.log('No data folder found, updating...');
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
  console.log(`Set data for ${setSlug} up to date, using local data...`)
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

async function getAllCards(set, variants = false) {
  const setSlug = slugify(set).toLowerCase();
  if (!needsUpdate(setSlug)) {
    return JSON.parse(fs.readFileSync(`ck-data/${setSlug}.json`));
  }

  process.stdout.write(`Fetch prices for ${set} Singles | pages: `);
  let cards = [];
  let p = 1;
  while (true) {
    const newCards = await getCards(set, setSlug, p, false);
    if (newCards.length === 0) {
      break;
    }
    process.stdout.write(`${p > 1 ? "," : ""}${p}`);
    cards = cards.concat(newCards);
    p++;
  }
  process.stdout.write(`\n`);
  process.stdout.write(`Fetch prices for ${set} Foils | pages: `);
  p = 1;
  while (true) {
    const newCards = await getCards(set, setSlug, p, true);
    if (newCards.length === 0) {
      break;
    }
    process.stdout.write(`${p > 1 ? "," : ""}${p}`);
    cards = cards.concat(newCards);
    p++;
  }
  process.stdout.write(`\n`);
  if (variants) {
    process.stdout.write(`Fetch prices for ${set} Variant Singles | pages: `);
    p = 1;
    while (true) {
      const newCards = await getCards(
        set,
        setSlug + "-variants",
        p,
        false,
        true
      );
      if (newCards.length === 0) {
        break;
      }
      process.stdout.write(`${p > 1 ? "," : ""}${p}`);
      cards = cards.concat(newCards);
      p++;
    }
    process.stdout.write(`\n`);
    process.stdout.write(`Fetch prices for ${set} Variant Foils | pages: `);
    p = 1;
    while (true) {
      const newCards = await getCards(
        set,
        setSlug + "-variants",
        p,
        true,
        true
      );
      if (newCards.length === 0) {
        break;
      }
      process.stdout.write(`${p > 1 ? "," : ""}${p}`);
      cards = cards.concat(newCards);
      p++;
    }
    process.stdout.write(`\n`);
  }
  console.log(`Fetched ${cards.length + 1} cards.`);
  saveJsonFile(setSlug, cards);
  return cards;
}

async function calcEv(set, boosterTemplate, setLimit) {
  const cards = await getAllCards(set, true);
  let priceMap = Object.keys(boosterTemplate).reduce((priceMap, slot) => {
    priceMap[slot] = 0;
    return priceMap;
  }, {});
  let cardCountMap = Object.keys(boosterTemplate).reduce(
    (cardCountMap, slot) => {
      cardCountMap[slot] = 0;
      return cardCountMap;
    },
    {}
  );
  for (const card of cards) {
    if (setLimit) {
      if (card.collectorNumber > setLimit) {
        continue;
      }
    }
    for (const slot of Object.keys(boosterTemplate)) {
      switch (slot) {
        case "Legendary R/M":
          if (["Mythic", "Rare"].includes(card.cardRarity) && card.legendary) {
            priceMap[slot] += card.cardPrice;
            cardCountMap[slot]++;
          }
        case "R/M":
          if (["Mythic", "Rare"].includes(card.cardRarity)) {
            priceMap[slot] += card.cardPrice;
            cardCountMap[slot]++;
          }
        case "Traditional Foil C/U/R/M":
          if (card.foil && !card.foilEtched && !card.borderless) {
            priceMap[slot] += card.cardPrice;
            cardCountMap[slot]++;
          }
        case "U/R/M":
          if (["Mythic", "Rare", "Uncommon"].includes(card.cardRarity)) {
            priceMap[slot] += card.cardPrice;
            cardCountMap[slot]++;
          }
        case "Legendary U":
          if (card.cardRarity == "Uncommon" && card.legendary) {
            priceMap[slot] += card.cardPrice;
            cardCountMap[slot]++;
          }
        case "Uncommon":
          if (card.cardRarity == "Uncommon") {
            priceMap[slot] += card.cardPrice;
            cardCountMap[slot]++;
          }
        case "Common":
          if (card.cardRarity == "Common") {
            priceMap[slot] += card.cardPrice;
            cardCountMap[slot]++;
          }
      }
    }
    priceMap[card.cardRarity] += card.cardPrice;
    cardCountMap[card.cardRarity]++;
  }
  let totalValue = 0;
  let avgValue = Object.keys(boosterTemplate).reduce((avgMap, slot) => {
    avgMap[`${boosterTemplate[slot]}x ${slot}`] =
      Math.round(
        (priceMap[slot] / cardCountMap[slot]) * boosterTemplate[slot] * 100
      ) / 100;
    totalValue += avgMap[`${boosterTemplate[slot]}x ${slot}`];
    return avgMap;
  }, {});
  totalValue = Math.round(totalValue * 100) / 100;
  console.log(JSON.stringify(avgValue, null, 2));
  console.log(`Total value: ${totalValue}`);
}

async function main() {
  const set = "Commander Masters";
  const setLimit = 436;
  const boosterTemplate = {
    "Legendary R/M": 1,
    "R/M": 1,
    "Traditional Foil C/U/R/M": 1,
    "U/R/M": 1,
    "Legendary U": 2,
    Uncommon: 3,
    Common: 11,
  };
  await calcEv(set, boosterTemplate, setLimit);
}
main();
