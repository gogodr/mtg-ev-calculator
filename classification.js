import { betweenRange } from "./utils.js";

const distributionMap = {
  "C/U": {
    Common: 0.6525,
    Uncommon: 0.3475,
    Rare: 0,
    Mythic: 0,
  },
  "C/U/R": {
    Common: 0.7,
    Uncommon: 0.175,
    Rare: 0.125,
    Mythic: 0,
  },
  "C/U/R/M": {
    Common: 0.7,
    Uncommon: 0.175,
    Rare: 0.1081,
    Mythic: 0.0169,
  },
  "R/M": {
    Common: 0,
    Uncommon: 0,
    Rare: 0.8649,
    Mythic: 0.1351,
  },
  "U/R/M": {
    Common: 0,
    Uncommon: 0.5,
    Rare: 0.4324,
    Mythic: 0.0676,
  },
  U: {
    Common: 0,
    Uncommon: 1,
    Rare: 0,
    Mythic: 0,
  },
  C: {
    Common: 1,
    Uncommon: 0,
    Rare: 0,
    Mythic: 0,
  },
};

const classificationMap = {
  "Legendary R/M": {
    distribution: distributionMap["R/M"],
    classify: (card, setMap) => {
      return (
        ["Mythic", "Rare"].includes(card.cardRarity) &&
        !card.foil &&
        card.legendary &&
        betweenRange(card.collectorNumber, setMap["Regular"])
      );
    },
  },
  "R/M": {
    distribution: distributionMap["R/M"],
    classify: (card, setMap) => {
      return (
        ["Mythic", "Rare"].includes(card.cardRarity) &&
        !card.foil &&
        betweenRange(card.collectorNumber, setMap["Regular"])
      );
    },
  },
  "Traditional Foil C/U/R/M": {
    distribution: distributionMap["C/U/R/M"],
    classify: (card, setMap) => {
      return (
        card.foil &&
        (betweenRange(card.collectorNumber, setMap["Regular"]) ||
          betweenRange(card.collectorNumber, setMap["Borderless"]))
      );
    },
  },
  "U/R/M": {
    distribution: distributionMap["U/R/M"],
    classify: (card, setMap) => {
      return (
        ["Mythic", "Rare", "Uncommon"].includes(card.cardRarity) &&
        !card.foil &&
        betweenRange(card.collectorNumber, setMap["Regular"])
      );
    },
  },
  "Legendary U": {
    distribution: distributionMap["U"],
    classify: (card, setMap) => {
      return (
        card.cardRarity === "Uncommon" &&
        !card.foil &&
        card.legendary &&
        betweenRange(card.collectorNumber, setMap["Regular"])
      );
    },
  },
  Uncommon: {
    distribution: distributionMap["U"],
    classify: (card, setMap) => {
      return (
        card.cardRarity === "Uncommon" &&
        !card.foil &&
        betweenRange(card.collectorNumber, setMap["Regular"])
      );
    },
  },
  Common: {
    distribution: distributionMap["C"],
    classify: (card, setMap) => {
      return (
        card.cardRarity === "Common" &&
        !card.foil &&
        betweenRange(card.collectorNumber, setMap["Regular"])
      );
    },
  },
  "Wildcard C/U/R/M": {
    distribution: distributionMap["C/U/R/M"],
    classify: (card, setMap) => {
      return (
        !card.foil &&
        (betweenRange(card.collectorNumber, setMap["Regular"]) ||
          betweenRange(card.collectorNumber, setMap["Borderless"]))
      );
    },
  },
  "Borderless C/U": {
    distribution: distributionMap["C/U"],
    classify: (card, setMap) => {
      return (
        ["Common", "Uncommon"].includes(card.cardRarity) &&
        !card.foil &&
        betweenRange(card.collectorNumber, setMap["Borderless"])
      );
    },
  },
  "Traditional Foil Borderless or Textured Foil Borderless R/M": {
    distribution: distributionMap["R/M"],
    extraDistribution: {
      attr: "classification",
      distribution: {
        Borderless: 0.96,
        "Textured Foil": 0.04,
      },
    },
    classify: (card, setMap) => {
      return (
        ["Mythic", "Rare"].includes(card.cardRarity) &&
        card.foil &&
        (betweenRange(card.collectorNumber, setMap["Borderless"]) ||
          betweenRange(card.collectorNumber, setMap["Textured Foil"]))
      );
    },
  },
  "Foil-Etched R/M": {
    distribution: distributionMap["R/M"],
    classify: (card, setMap) => {
      return (
        ["Mythic", "Rare"].includes(card.cardRarity) &&
        card.foil &&
        betweenRange(card.collectorNumber, setMap["Foil-Etched"])
      );
    },
  },
  "Traditional Foil or Nonfoil Extended-Art* R/M": {
    distribution: distributionMap["R/M"],
    extraDistribution: {
      attr: "foil",
      distribution: {
        [true]: 0.2,
        [false]: 0.8,
      },
    },
    classify: (card, setMap) => {
      return (
        ["Mythic", "Rare"].includes(card.cardRarity) &&
        betweenRange(card.collectorNumber, setMap["Extended-Art"])
      );
    },
  },
  "Nonfoil Borderless R/M": {
    distribution: distributionMap["R/M"],
    classify: (card, setMap) => {
      return (
        ["Mythic", "Rare"].includes(card.cardRarity) &&
        !card.foil &&
        betweenRange(card.collectorNumber, setMap["Borderless"])
      );
    },
  },
  "Traditional Foil R/M": {
    distribution: distributionMap["R/M"],
    classify: (card, setMap) => {
      return (
        ["Mythic", "Rare"].includes(card.cardRarity) &&
        card.foil &&
        betweenRange(card.collectorNumber, setMap["Regular"])
      );
    },
  },
  "Traditional Foil Borderless C/U": {
    distribution: distributionMap["C/U"],
    classify: (card, setMap) => {
      return (
        ["Common", "Uncommon"].includes(card.cardRarity) &&
        card.foil &&
        betweenRange(card.collectorNumber, setMap["Borderless"])
      );
    },
  },
  "Nonfoil Borderless C/U": {
    distribution: distributionMap["C/U"],
    classify: (card, setMap) => {
      return (
        ["Common", "Uncommon"].includes(card.cardRarity) &&
        !card.foil &&
        betweenRange(card.collectorNumber, setMap["Borderless"])
      );
    },
  },
  "Traditional Foil U": {
    distribution: distributionMap["U"],
    classify: (card, setMap) => {
      return (
        card.cardRarity === "Uncommon" &&
        card.foil &&
        betweenRange(card.collectorNumber, setMap["Regular"])
      );
    },
  },
  "Traditional Foil C": {
    distribution: distributionMap["C"],
    classify: (card, setMap) => {
      return (
        card.cardRarity === "Common" &&
        card.foil &&
        betweenRange(card.collectorNumber, setMap["Regular"])
      );
    },
  },
};

export { classificationMap };
