/////////////////CONSTANTS/////////////////

const initialUnitForce = {
  pikemans: 5,
  archers: 10,
  knights: 20
};

const unitUpgradeOrder = ["pikemans", "archers", "knights"];

const trainValues = {
  pikemans: {
    cost: 10,
    forceToAdd: 3
  },
  archers: {
    cost: 20,
    forceToAdd: 7
  },
  pikemans: {
    cost: 30,
    forceToAdd: 10
  }
};

const upgradeCost = {
  archers: 30,
  knights: 40
};

/////////////////END CONSTANTS/////////////////

/////////////////FUNCTIONS/////////////////

const createArmy = (name, pikemans, archers, knights) => {
  const initializeUnits = (pikemans, archers, knights) => {
    return [].concat(
      generateInitsBulk("pikemans", pikemans),
      generateInitsBulk("archers", archers),
      generateInitsBulk("knights", knights)
    );
  };

  const generateInitsBulk = (type, length) => {
    let units = [];
    for (i = 0; i < length; i++) {
      units.push(createUnit(type));
    }
    return units;
  };

  const createUnit = type => {
    return {
      type: type,
      force: initialUnitForce[type]
    };
  };

  let army = {
    name,
    gold: 1000,
    units: [].concat(initializeUnits(pikemans, archers, knights)),
    totalForce: 0,
    battleHistory: []
  };

  army = calculateTotalForce(army);

  return army;
};

const upgradeUnit = (upgradeType, army, unitIndex) => {
  if (
    upgradeType === "upgradeCategory" &&
    army.units[unitIndex].type === "knights"
  ) {
    console.log("Action Not Valid");
    return false;
  }

  if (
    upgradeType === "upgradeCategory" &&
    army.units[unitIndex].type !== "knights"
  ) {
    const newType =
      unitUpgradeOrder[unitUpgradeOrder.indexOf(army.units[unitIndex].type)++];
    //change type
    army.units[unitIndex].type = newType;
    //incremente unit force
    army.units[unitIndex].force = initialUnitForce[newType];
    //army remove gold
    army.gold = army.gold - upgradeCost[newType];
  }

  if (upgradeType === "TrainUnit") {
    //incremente unit force
    army.units[unitIndex].force =
      army.units[unitIndex].force +
      trainValues[army.units[unitIndex].type].forceToAdd;
    //army remove gold
    army.gold = army.gold - trainValues[army.units[unitIndex].type].cost;
  }

  army.totalForce = calculateTotalForce(army.units);
  return army;
};

const calculateTotalForce = army => {
  army.totalForce = army.units
    .map(u => u.force)
    .reduce((totalForce, currentUnitForce) => totalForce + currentUnitForce, 0);
  return army;
};

const battle = (army1, army2) => {
  const newArmy1 = { ...army1 };
  const newArmy2 = { ...army2 };

  console.log(newArmy1, newArmy2);

  //HELPER FUNCIONS
  const removeMostPowerfullUnits = army => {
    army.units = army.units
      .sort(function(a, b) {
        return b.force - a.force;
      })
      .slice(2);
    army = calculateTotalForce(army);
    return army;
  };

  const removeRandomUnit = (army) => {
    let newArmy = {...army}
    newArmy.units = newArmy.units.splice(randomInt(0, newArmy.units.length - 1), 0);
    newArmy = calculateTotalForce(newArmy);
    return newArmy;
  };

  function randomInt(min, max) {
    return min + Math.floor((max - min) * Math.random());
  }

  const battleConsecuences = (army1, army2) => {
    if (army1.totalForce === army2.totalForce) {
      console.log(army2);
      //remove random from armys
      army1 = removeRandomUnit(army1);
      army2 = removeRandomUnit(army2);
      //add history records
      console.log(army2);
      army1 = addHistoryResult(army1, "Draw", army2.name);
      army2 = addHistoryResult(army2, "Draw", army1.name);

      return [army1, army2];
    }

    if (army1.totalForce > army2.totalForce) {
      army1.gold = army1.gold + 100;
      army2 = removeMostPowerfullUnits(army2);
      //add history records
      army1 = addHistoryResult(army1, "Win", army2.name);
      army2 = addHistoryResult(army2, "Loose", army1.name);
    } else {
      army2.gold = army2.gold + 100;
      army1 = removeMostPowerfullUnits(army1);
      //add history records
      army1 = addHistoryResult(army1, "Loose", army2.name);
      army2 = addHistoryResult(army2, "Win", army1.name);
    }

    return [army1, army2];
  };

  const addHistoryResult = (army, result, enemyName) => {
    army.battleHistory = army.battleHistory.concat({ result, enemyName });
    return army;
  };

  return battleConsecuences(newArmy1, newArmy2);
};

/////////////////END FUNCTIONS/////////////////

/////////////////INSTANCES/////////////////

const Chinese = createArmy("Chinese", 2, 25, 2);
const Englishmen = createArmy("Englishmen", 10, 10, 10);
const Byzantines = createArmy("Byzantines", 2, 25, 2);

// console.log(Chinese);
// console.log(Englishmen);
// console.log(Byzantines);

// console.log(battle(Chinese, Englishmen));
console.log(battle(Chinese, Byzantines));
console.log(battle(Byzantines, Englishmen));
/////////////////END INSTANCES/////////////////
