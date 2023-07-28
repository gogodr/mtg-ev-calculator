import { betweenRange } from "./utils.js";

const classificationMap = {
  "Legendary R/M": (card, setMap) => {
    return (
      ["Mythic", "Rare"].includes(card.cardRarity) &&
      !card.foil &&
      card.legendary &&
      betweenRange(card.collectorNumber, setMap["Regular"])
    );
  },
  "R/M": (card, setMap) => {
    return (
      ["Mythic", "Rare"].includes(card.cardRarity) &&
      !card.foil &&
      betweenRange(card.collectorNumber, setMap["Regular"])
    );
  },
  "Traditional Foil C/U/R/M": (card, setMap) => {
    return card.foil && betweenRange(card.collectorNumber, setMap["Regular"]);
  },
  "U/R/M": (card, setMap) => {
    return (
      ["Mythic", "Rare", "Uncommon"].includes(card.cardRarity) &&
      !card.foil &&
      betweenRange(card.collectorNumber, setMap["Regular"])
    );
  },
  "Legendary U": (card, setMap) => {
    return (
      card.cardRarity === "Uncommon" &&
      !card.foil &&
      card.legendary &&
      betweenRange(card.collectorNumber, setMap["Regular"])
    );
  },
  Uncommon: (card, setMap) => {
    return (
      card.cardRarity === "Uncommon" &&
      !card.foil &&
      betweenRange(card.collectorNumber, setMap["Regular"])
    );
  },
  Common: (card, setMap) => {
    return (
      card.cardRarity === "Common" &&
      !card.foil &&
      betweenRange(card.collectorNumber, setMap["Regular"])
    );
  },
  "Wildcard C/U/R/M": (card, setMap) => {
    return (
      !card.foil &&
      (betweenRange(card.collectorNumber, setMap["Regular"]) ||
        betweenRange(card.collectorNumber, setMap["Borderless"]))
    );
  },
  "Borderless C/U": (card, setMap) => {
    return (
      ["Common", "Uncommon"].includes(card.cardRarity) &&
      !card.foil &&
      betweenRange(card.collectorNumber, setMap["Borderless"])
    );
  },
  "Traditional Foil Borderless or Textured Foil Borderless R/M": (
    card,
    setMap
  ) => {
    return (
      ["Mythic", "Rare"].includes(card.cardRarity) &&
      card.foil &&
      (betweenRange(card.collectorNumber, setMap["Borderless"]) ||
        betweenRange(card.collectorNumber, setMap["Textured Foil"]))
    );
  },
  "Foil-Etched R/M": (card, setMap) => {
    return (
      ["Mythic", "Rare"].includes(card.cardRarity) &&
      card.foil &&
      betweenRange(card.collectorNumber, setMap["Foil-Etched"])
    );
  },
  "Traditional Foil or Nonfoil Extended-Art* R/M": (card, setMap) => {
    return (
      ["Mythic", "Rare"].includes(card.cardRarity) &&
      ((card.foil && betweenRange(card.collectorNumber, setMap["Regular"])) ||
        (!card.foil &&
          betweenRange(card.collectorNumber, setMap["Extended-Art"])))
    );
  },
  "Nonfoil Borderless R/M": (card, setMap) => {
    return (
      ["Mythic", "Rare"].includes(card.cardRarity) &&
      !card.foil &&
      betweenRange(card.collectorNumber, setMap["Borderless"])
    );
  },
  "Traditional Foil R/M": (card, setMap) => {
    return (
      ["Mythic", "Rare"].includes(card.cardRarity) &&
      card.foil &&
      betweenRange(card.collectorNumber, setMap["Regular"])
    );
  },
  "Traditional Foil Borderless C/U": (card, setMap) => {
    return (
      ["Common", "Uncommon"].includes(card.cardRarity) &&
      card.foil &&
      betweenRange(card.collectorNumber, setMap["Borderless"])
    );
  },
  "Nonfoil Borderless C/U": (card, setMap) => {
    return (
      ["Common", "Uncommon"].includes(card.cardRarity) &&
      !card.foil &&
      betweenRange(card.collectorNumber, setMap["Borderless"])
    );
  },
  "Traditional Foil U": (card, setMap) => {
    return (
      card.cardRarity === "Uncommon" &&
      card.foil &&
      betweenRange(card.collectorNumber, setMap["Regular"])
    );
  },
  "Traditional Foil C": (card, setMap) => {
    return (
      card.cardRarity === "Common" &&
      card.foil &&
      betweenRange(card.collectorNumber, setMap["Regular"])
    );
  },
};

export { classificationMap };
