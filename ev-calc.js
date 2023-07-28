import getAllCards from "./ck-scrapper.js";
import { classificationMap } from "./classification.js";
import { classificationDataMapBySet } from "./setsData.js";

async function calcEv(set, template) {
  const cards = await getAllCards(set, true);

  let priceMap = Object.keys(template).reduce((priceMap, slot) => {
    priceMap[slot] = 0;
    return priceMap;
  }, {});

  let cardCountMap = Object.keys(template).reduce((cardCountMap, slot) => {
    cardCountMap[slot] = 0;
    return cardCountMap;
  }, {});

  for (const card of cards) {
    for (const slot of Object.keys(template)) {
      if (
        classificationMap[slot] &&
        classificationMap[slot](card, classificationDataMapBySet[set])
      ) {
        priceMap[slot] += card.cardPrice < 1 ? 0 : card.cardPrice;
        cardCountMap[slot]++;
      }
    }
    priceMap[card.cardRarity] += card.cardPrice;
    cardCountMap[card.cardRarity]++;
  }

  let totalValue = 0;
  let avgValue = Object.keys(template).reduce((avgMap, slot) => {
    avgMap[`${template[slot]}x ${slot}`] =
      Math.round((priceMap[slot] / cardCountMap[slot]) * template[slot] * 100) /
      100;
    totalValue += avgMap[`${template[slot]}x ${slot}`];
    return avgMap;
  }, {});
  totalValue = Math.round(totalValue * 100) / 100;
  console.log(JSON.stringify(avgValue, null, 2));
  return totalValue;
}

export { calcEv };
