const templates = {
  CMMDraftBoosterPack: {
    "Legendary R/M": 1,
    "R/M": 1,
    "Traditional Foil C/U/R/M": 1,
    "U/R/M": 1,
    "Legendary U": 2,
    Uncommon: 3,
    Common: 11,
  },
  CMMSetBoosterPack: {
    "Legendary R/M": 1,
    "R/M": 1,
    "Traditional Foil C/U/R/M": 1,
    "Wildcard C/U/R/M": 2,
    "U/R/M": 1,
    "Borderless C/U": 1,
    "Legendary U": 1,
    Uncommon: 2,
    Common: 4,
  },
  CMMCollectorBoosterPack: {
    "Traditional Foil Borderless or Textured Foil Borderless R/M": 1,
    "Foil-Etched R/M": 1,
    "Traditional Foil or Nonfoil Extended-Art* R/M": 1,
    "Nonfoil Borderless R/M": 1,
    "Traditional Foil R/M": 1,
    "Traditional Foil Borderless C/U": 1,
    "Nonfoil Borderless C/U": 2,
    "Traditional Foil U": 2,
    "Traditional Foil C": 4,
  },
};

const productsMapBySet = {
  "Commander Masters": {
    "Commander Masters Draft Booster Display": {
      template: templates.CMMDraftBoosterPack,
      amount: 24,
    },
    "Commander Masters Set Booster Display": {
      template: templates.CMMSetBoosterPack,
      amount: 24,
    },
    "Commander Masters Collector Booster Display": {
      template: templates.CMMCollectorBoosterPack,
      amount: 4,
    },
  },
};

const classificationDataMapBySet = {
  "Commander Masters": {
    Regular: [1, 436],
    "Retro Lands": [437, 451],
    "Foil-Etched": [452, 621],
    Borderless: [622, 703],
    Commanders: [704, 707],
    "New Commander Cards": [708, 743],
    "Extended-Art": [744, 778],
    "Display Commanders": [779, 782],
    "Commander Reprints": [783, 1056],
    "Textured Foil": [1057, 1067],
  },
};

export { productsMapBySet, classificationDataMapBySet };
