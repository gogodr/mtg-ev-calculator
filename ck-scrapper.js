import slugify from "slugify";
import { classificationDataMapBySet } from "./setsData.js";
import { betweenRange, needsUpdate, saveJsonFile } from "./utils.js";
import * as Cheerio from "cheerio";
import axios from "axios";
import fs from "fs";

async function getCards(set, setSlug, p = 1, foils = false) {
  const cardKingdomUrl = `https://www.cardkingdom.com/mtg/${setSlug}/${
    foils ? "foils" : "singles"
  }`;
  const cardKingdomResponse = await axios.get(`${cardKingdomUrl}?page=${p}`, {
    headers: {
      Cookie: "limit=100",
    },
  });
  const cardKingdomHtml = cardKingdomResponse.data;
  const $ = Cheerio.load(cardKingdomHtml);
  const cardsRaw = $(".mainListing .itemContentWrapper").toArray();
  const cards = [];
  for (const card of cardsRaw) {
    const cardRarityRaw = $(".productDetailSet", card).text().trim();
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
    if (!cardRarity) {
      continue;
    }
    let cardName = $(".productDetailTitle", card).text();
    const cardPrice = parseFloat(
      $(".amtAndPrice .stylePrice", card).text().trim().replace("$", "")
    );
    const collectorNumber = parseInt(
      $(".collector-number", card).text().trim().replace("Collector #: ", "")
    );
    const legendary = $(".productDetailType", card)
      .text()
      .trim()
      .includes("Legendary");

    cardName = cardName.replace(/\(.*?\)/g, "").trim();

    const classification = Object.keys(classificationDataMapBySet[set]).find(
      (key) => {
        return betweenRange(collectorNumber, classificationDataMapBySet[set][key]);
      }
    );

    cards.push({
      set,
      cardName,
      cardPrice,
      cardRarity,
      collectorNumber,
      legendary,
      foil: foils,
      classification,
    });
  }

  return cards;
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

export default getAllCards;
