///////////////// FACTORY PATTERN /////////////////

/////////////////CONSTANTS/////////////////

const initialUnitForce = {
  pikemans: 5,
  archers: 10,
  knights: 20
}

const unitUpgradeOrder = ['pikemans', 'archers', 'knights']

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
}

const upgradeCost = {
  archers: 30,
  knights: 40
}

/////////////////END CONSTANTS/////////////////

/////////////////FUNCTIONS/////////////////

const createArmy = (name, pikemans, archers, knights) => {
  return {
    name,
    gold: 1000,
    units: [].concat(initializeUnits(pikemans, archers, knights)),
    totalForce: calculateTotalForce(this.units),
    battleHistory: []
  }
}

const generateInitsBulk = (type, length) => {
  let units = [];
  for (i = 0; i < length; i++) {
    units.push(createUnit(type))
  }
  return units;
}

const initializeUnits = (pikemans, archers, knights) => {
  return [].concat(generateInitsBulk('pikemans', pikemans), generateInitsBulk('archers', archers), generateInitsBulk('knights', knights))
}

const createUnit = (type) => {
  return {
    type: type,
    force: initialUnitForce[type]
  }
}

const upgradeUnit = (upgradeType, army, unitIndex) => {
  if (upgradeType === "upgradeCategory" && army.units[unitIndex].type === "knights") {
    console.log("Action Not Valid")
    return false;
  }

  if (upgradeType === "upgradeCategory" && army.units[unitIndex].type !== "knights") {

    const newType = unitUpgradeOrder[unitUpgradeOrder.indexOf(army.units[unitIndex].type)++]
    //change type
    army.units[unitIndex].type = newType;
    //incremente unit force
    army.units[unitIndex].force = initialUnitForce[newType]
    //army remove gold
    army.gold = army.gold - upgradeCost[newType]
  }

  if (upgradeType === "TrainUnit") {
    //incremente unit force
    army.units[unitIndex].force = army.units[unitIndex].force + trainValues[army.units[unitIndex].type].forceToAdd
    //army remove gold
    army.gold = army.gold - trainValues[army.units[unitIndex].type].cost
  }

  army.totalForce = calculateTotalForce(army.units);
  return army;
}
const calculateTotalForce = (units) => {
  return 200
}

const removeMostPowerfullUnits = (army) => {
  army.units = army.units.sortBy(function (a, b) { return a.totalForce - b.totalForce }).shift().shift()
  return army;
}

function randomInt(min, max) {
  return min + Math.floor((max - min) * Math.random());
}

const battleConsecuences = (army1, army2, isArmy1Win) => {
  if (isArmy1Win) {
    army1.gold = army1.gold + 100
    army2 = removeMostPowerfullUnits(army2)
  } else {
    army2.gold = army2.gold + 100
    army1 = removeMostPowerfullUnits(army1)
  }
  return [army1, army2]
}

const battle = (army1, army2) => {
  if (army1.totalForce === army2.totalForce) {
    //remove unit from army1
    army1.units = army1.units.splice(randomInt(0, army1.units.length - 1), 0)
    //remove unit from army2
    army2.units = army2.units.splice(randomInt(0, army2.units.length - 1), 0)
  }

  return (army1.totalForce > army2.totalForce) ? battleConsecuences(army1, army2, true) : battleConsecuences(army1, army2, false)
}

/////////////////END FUNCTIONS/////////////////

/////////////////INSTANCES/////////////////

const Chinese = createArmy("Chinese", 2, 25, 2)
const Englishmen = createArmy("Englishmen", 10, 10, 10)
const Byzantines = createArmy("Byzantines", 2, 25, 2)

console.log(Chinese)
console.log(Englishmen)
console.log(Byzantines)

/////////////////END INSTANCES/////////////////

