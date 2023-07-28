const templates = {
  CMMDraftBoosterPack: {
    "Legendary R(86.49%) / M(13.51%)": 1,
    "Non Legendary R(86.49%) / M(13.51%)": 1,
    "Legendary(42.5%) or Non Legendary(57.5%) Traditional Foil C(70%) / U(17.5%) / R(12.5%) / M(1.69%)": 1,
    "Non Legendary U(66.6%) / R(34.59%) / M(5.41%)": 1,
    "Legendary U": 2,
    "Non Legendary U": 3,
    Common: 11,
    "Double-Sided Token": 1,
  },
  CMMSetBoosterPack: {
    "Traditional Foil(20%) or Non Foil(80%) Retro Basic Land": 1,
    "Legendary R(86.49%) / M(13.51%)": 1,
    "Non Legendary R(86.49%) / M(13.51%)": 1,
    "Traditional Foil C(70%) / U(17.5%) / R(12.5%) / M(1.69%)": 1,
    "Wildcard C(70%) / U(17.5%) / R(12.5%) / M(1.69%)": 2,
    "Legendary U(50%) / Non Legendary R(43.24%) / Non Legendary M(6.76%)": 1,
    "Borderless C(65.25%) / U(34.75%)": 1,
    "Legendary U": 1,
    "Non Legendary U": 2,
    Common: 4,
    "Token / The List": 1,
    Art: 1,
  },
  CMMCollectorBoosterPack: {
    "Traditional Foil(96%) Borderless or Textured Foil(4%) Borderless R(86.49%) / M(13.51%)": 1,
    "Foil-Etched R(86.49%) / M(13.51%)": 1,
    "Traditional Foil(20%) or Nonfoil(80%) Extended-Art* R(86.49%) / M(13.51%)": 1,
    "Nonfoil Borderless R(86.49%) / M(13.51%)": 1,
    "Traditional Foil R(86.49%) / M(13.51%)": 1,
    "Traditional Foil Borderless C(65.25%) / U(34.75%)": 1,
    "Nonfoil Borderless C(65.25%) / U(34.75%)": 2,
    "Traditional Foil U": 2,
    "Traditional Foil C": 4,
    "Traditional Foil Retro Basic Land": 1,
    "Traditional Foil Double-Sided Token": 1,
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
