import * as cheerio from "cheerio";
import axios from "axios";
import slugify from "slugify";
import fs from "fs";

async function getCards(set, p = 1, foils = false) {
  const cardKingdomUrl = `https://www.cardkingdom.com/mtg/${slugify(
    set
  ).toLowerCase()}/${foils ? "foils" : "singles"}`;
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
    const cardName = $(".productDetailTitle", card).text();
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
    if (cardName.includes("(Borderless)")) {
      borderless = true;
      cardName = cardName.replace("(Borderless)", "").trim();
    }
    let foilEtched = false;
    if (cardName.includes("(Foil Etched)")) {
      foilEtched = true;
      cardName = cardName.replace("(Foil Etched)", "").trim();
    }
    let texturedFoil = false;
    if (cardName.includes("(Tectured Foil)")) {
      texturedFoil = true;
      cardName = cardName.replace("(Tectured Foil)", "").trim();
    }

    if (cardRarity) {
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
      });
    }
  }
  return cards;
}

async function saveJsonFile(name, json) {
  fs.writeFileSync(
    `ck-data/${name}.json`,
    JSON.stringify(json, null, 2),
    function (err) {
      if (err) throw err;
    }
  );
}

async function getAllCards(set) {
  process.stdout.write(`Fetch prices for ${set} Singles | pages: `);
  let cards = [];
  let p = 1;
  while (true) {
    const newCards = await getCards(set, p, false);
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
    const newCards = await getCards(set, p, true);
    if (newCards.length === 0) {
      break;
    }
    process.stdout.write(`${p > 1 ? "," : ""}${p}`);
    cards = cards.concat(newCards);
    p++;
  }
  process.stdout.write(`\n`);
  return cards;
}

async function calcEv(set, boosterTemplate, setLimit) {
  const cards = await getAllCards(set);
  saveJsonFile(slugify(set).toLowerCase(), cards);
  console.log(`Fetched ${cards.length + 1} cards.`);

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
