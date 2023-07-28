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
  }
  let totalValue = 0;
  let avgValue = Object.keys(template).reduce((avgMap, slot) => {
    const slotValue =
      Math.round((priceMap[slot] / cardCountMap[slot]) * 100) / 100;
    avgMap[`${template[slot]}x ${slot}`] =
      Math.round(slotValue * template[slot] * 100) / 100;
    totalValue += avgMap[`${template[slot]}x ${slot}`];
    return avgMap;
  }, {});
  totalValue = Math.round(totalValue * 100) / 100;

  for(const avgValueKey in avgValue){
    console.log(` • ${avgValueKey}: $${avgValue[avgValueKey]}`);
  }
  return totalValue;
}

export { calcEv };
