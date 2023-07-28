import { betweenRange } from "./utils.js";

const classificationMap = {
  "Legendary R(86.49%) / M(13.51%)": {
    distribution: {
      Common: 0,
      Uncommon: 0,
      Rare: 0.8649,
      Mythic: 0.1351,
    },
    classify: (card, setMap) => {
      return (
        ["Mythic", "Rare"].includes(card.cardRarity) &&
        !card.foil &&
        card.legendary &&
        betweenRange(card.collectorNumber, setMap["Regular"])
      );
    },
  },
  "Non Legendary R(86.49%) / M(13.51%)": {
    distribution: {
      Common: 0,
      Uncommon: 0,
      Rare: 0.8649,
      Mythic: 0.1351,
    },
    classify: (card, setMap) => {
      return (
        ["Mythic", "Rare"].includes(card.cardRarity) &&
        !card.foil &&
        !card.legendary &&
        betweenRange(card.collectorNumber, setMap["Regular"])
      );
    },
  },
  "Legendary(42.5%) or Non Legendary(57.5%) Traditional Foil C(70%) / U(17.5%) / R(12.5%) / M(1.69%)":
    {
      distribution: {
        Common: 0.7,
        Uncommon: 0.175,
        Rare: 0.1081,
        Mythic: 0.0169,
      },
      extraDistribution: {
        attr: "legendary",
        distribution: {
          [true]: 0.425,
          [false]: 0.575,
        },
      },
      classify: (card, setMap) => {
        return (
          card.foil &&
          (betweenRange(card.collectorNumber, setMap["Regular"]) ||
            betweenRange(card.collectorNumber, setMap["Borderless"]))
        );
      },
    },
  "Non Legendary U(66.6%) / R(34.59%) / M(5.41%)": {
    distribution: {
      Common: 0,
      Uncommon: 0.6666,
      Rare: 0.3459,
      Mythic: 0.0541,
    },
    classify: (card, setMap) => {
      return (
        ["Mythic", "Rare", "Uncommon"].includes(card.cardRarity) &&
        !card.legendary &&
        !card.foil &&
        betweenRange(card.collectorNumber, setMap["Regular"])
      );
    },
  },
  "Legendary U": {
    distribution: {
      Common: 0,
      Uncommon: 1,
      Rare: 0,
      Mythic: 0,
    },
    classify: (card, setMap) => {
      return (
        card.cardRarity === "Uncommon" &&
        !card.foil &&
        card.legendary &&
        betweenRange(card.collectorNumber, setMap["Regular"])
      );
    },
  },
  "Non Legendary U": {
    distribution: {
      Common: 0,
      Uncommon: 1,
      Rare: 0,
      Mythic: 0,
    },
    classify: (card, setMap) => {
      return (
        card.cardRarity === "Uncommon" &&
        !card.foil &&
        !card.legendary &&
        betweenRange(card.collectorNumber, setMap["Regular"])
      );
    },
  },
  Common: {
    distribution: {
      Common: 1,
      Uncommon: 0,
      Rare: 0,
      Mythic: 0,
    },
    classify: (card, setMap) => {
      return (
        card.cardRarity === "Common" &&
        !card.foil &&
        betweenRange(card.collectorNumber, setMap["Regular"])
      );
    },
  },
  "Traditional Foil(20%) or Non Foil(80%) Retro Basic Land": {
    distribution: {
      Common: 1,
      Uncommon: 0,
      Rare: 0,
      Mythic: 0,
    },
    extraDistribution: {
      attr: "foil",
      distribution: {
        [true]: 0.2,
        [false]: 0.8,
      },
    },
    classify: (card, setMap) => {
      return (
        card.cardRarity === "Common" &&
        betweenRange(card.collectorNumber, setMap["Retro Lands"])
      );
    },
  },
  "Traditional Foil C(70%) / U(17.5%) / R(12.5%) / M(1.69%)": {
    distribution: {
      Common: 0.7,
      Uncommon: 0.175,
      Rare: 0.1081,
      Mythic: 0.0169,
    },
    classify: (card, setMap) => {
      return (
        card.foil &&
        (betweenRange(card.collectorNumber, setMap["Regular"]) ||
          betweenRange(card.collectorNumber, setMap["Borderless"]))
      );
    },
  },
  "Wildcard C(70%) / U(17.5%) / R(12.5%) / M(1.69%)": {
    distribution: {
      Common: 0.7,
      Uncommon: 0.175,
      Rare: 0.1081,
      Mythic: 0.0169,
    },
    classify: (card, setMap) => {
      return (
        !card.foil &&
        (betweenRange(card.collectorNumber, setMap["Regular"]) ||
          betweenRange(card.collectorNumber, setMap["Borderless"]))
      );
    },
  },
  "Legendary U(50%) / Non Legendary R(43.24%) / Non Legendary M(6.76%)": {
    distribution: {
      Common: 0,
      Uncommon: 0.5,
      Rare: 0.4324,
      Mythic: 0.0676,
    },
    classify: (card, setMap) => {
      return (
        ((card.cardRarity === "Uncommon" && card.legendary) ||
          (["Mythic", "Rare"].includes(card.cardRarity) && !card.legendary)) &&
        !card.foil &&
        betweenRange(card.collectorNumber, setMap["Regular"])
      );
    },
  },
  "Borderless C(65.25%) / U(34.75%)": {
    distribution: {
      Common: 0.6525,
      Uncommon: 0.3475,
      Rare: 0,
      Mythic: 0,
    },
    classify: (card, setMap) => {
      return (
        ["Common", "Uncommon"].includes(card.cardRarity) &&
        !card.foil &&
        betweenRange(card.collectorNumber, setMap["Borderless"])
      );
    },
  },
  "Traditional Foil(96%) Borderless or Textured Foil(4%) Borderless R(86.49%) / M(13.51%)":
    {
      distribution: {
        Common: 0,
        Uncommon: 0,
        Rare: 0.8649,
        Mythic: 0.1351,
      },
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
  "Foil-Etched R(86.49%) / M(13.51%)": {
    distribution: {
      Common: 0,
      Uncommon: 0,
      Rare: 0.8649,
      Mythic: 0.1351,
    },
    classify: (card, setMap) => {
      return (
        ["Mythic", "Rare"].includes(card.cardRarity) &&
        card.foil &&
        betweenRange(card.collectorNumber, setMap["Foil-Etched"])
      );
    },
  },
  "Traditional Foil(20%) or Nonfoil(80%) Extended-Art* R(86.49%) / M(13.51%)": {
    distribution: {
      Common: 0,
      Uncommon: 0,
      Rare: 0.8649,
      Mythic: 0.1351,
    },
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
  "Nonfoil Borderless R(86.49%) / M(13.51%)": {
    distribution: {
      Common: 0,
      Uncommon: 0,
      Rare: 0.8649,
      Mythic: 0.1351,
    },
    classify: (card, setMap) => {
      return (
        ["Mythic", "Rare"].includes(card.cardRarity) &&
        !card.foil &&
        betweenRange(card.collectorNumber, setMap["Borderless"])
      );
    },
  },
  "Traditional Foil R(86.49%) / M(13.51%)": {
    distribution: {
      Common: 0,
      Uncommon: 0,
      Rare: 0.8649,
      Mythic: 0.1351,
    },
    classify: (card, setMap) => {
      return (
        ["Mythic", "Rare"].includes(card.cardRarity) &&
        card.foil &&
        betweenRange(card.collectorNumber, setMap["Regular"])
      );
    },
  },
  "Traditional Foil Borderless C(65.25%) / U(34.75%)": {
    distribution: {
      Common: 0.6525,
      Uncommon: 0.3475,
      Rare: 0,
      Mythic: 0,
    },
    classify: (card, setMap) => {
      return (
        ["Common", "Uncommon"].includes(card.cardRarity) &&
        card.foil &&
        betweenRange(card.collectorNumber, setMap["Borderless"])
      );
    },
  },
  "Nonfoil Borderless C(65.25%) / U(34.75%)": {
    distribution: {
      Common: 0.6525,
      Uncommon: 0.3475,
      Rare: 0,
      Mythic: 0,
    },
    classify: (card, setMap) => {
      return (
        ["Common", "Uncommon"].includes(card.cardRarity) &&
        !card.foil &&
        betweenRange(card.collectorNumber, setMap["Borderless"])
      );
    },
  },
  "Traditional Foil U": {
    distribution: {
      Common: 0,
      Uncommon: 1,
      Rare: 0,
      Mythic: 0,
    },
    classify: (card, setMap) => {
      return (
        card.cardRarity === "Uncommon" &&
        card.foil &&
        betweenRange(card.collectorNumber, setMap["Regular"])
      );
    },
  },
  "Traditional Foil C": {
    distribution: {
      Common: 1,
      Uncommon: 0,
      Rare: 0,
      Mythic: 0,
    },
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
