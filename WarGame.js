///////////////// CLASSES /////////////////

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
  knights: {
    cost: 30,
    forceToAdd: 10
  }
};

const upgradeCost = {
  archers: 30,
  knights: 40
};

/////////////////END CONSTANTS/////////////////

/////////////////CLASSES/////////////////

class Army {
  constructor(name, pikemans, archers, knights) {
    this.name = name;
    this.gold = 1000;
    this.units = [].concat(this.initializeUnits(pikemans, archers, knights));
    this.totalForce = 0;
    this.battleHistory = [];

    this.calculateTotalForce();
  }

  initializeUnits(pikemans, archers, knights) {
    return [].concat(
      this.generateInitsBulk("pikemans", pikemans),
      this.generateInitsBulk("archers", archers),
      this.generateInitsBulk("knights", knights)
    );
  }

  generateInitsBulk(type, length) {
    let units = [];
    for (let i = 0; i < length; i++) {
      units.push(new Unit(type));
    }
    return units;
  }

  calculateTotalForce() {
    this.totalForce = this.units
      .map(u => u.force)
      .reduce(
        (totalForce, currentUnitForce) => totalForce + currentUnitForce,
        0
      );
    return this;
  }

  removeGold(amount) {
    this.gold = this.gold - amount;
  }

  addGold(amount) {
    this.gold = this.gold + amount;
  }

  upgradeUnit(index) {
    return this.units[index]
      .upgrade("upgrade")
      .then(result => {
        this.removeGold(upgradeCost[result.type]);
        this.calculateTotalForce();
        return Promise.resolve(this)
      })
      .catch(reason => console.log(reason));
  }

  trainUnit(index) {
    return this.units[index]
      .upgrade("train")
      .then(result => {
        this.removeGold(trainValues[result.type].cost);
        this.calculateTotalForce();
        return Promise.resolve(this)
      })
      .catch(reason => console.log(reason));
  }

  removeMostPowerfullUnits() {
    this.units = this.units
      .sort(function(a, b) {
        return b.force - a.force;
      })
      .slice(2);
    this.calculateTotalForce();
    return this;
  }

  removeRandomUnit() {
    const randomInt =
      0 + Math.floor((this.units.length - 1 - 0) * Math.random());
    this.units = this.units.splice(randomInt, 0);
    this.calculateTotalForce();
    return this;
  }

  addHistoryResult(result, enemyName) {
    this.battleHistory = this.battleHistory.concat({ result, enemyName });
    return this;
  }
}

class Unit {
  constructor(type) {
    this.type = type;
    this.baseForce = initialUnitForce[type];
    this.gainedForce = 0;
  }

  get force() {
    return this.baseForce + this.gainedForce;
  }

  upgrade(changeType) {
    if (changeType === "upgrade" && this.type === "knights") {
      return Promise.reject("Invalid Upgrade");
    }

    if (changeType === "upgrade" && this.type !== "knights") {
      //get new type
      const newType = unitUpgradeOrder[unitUpgradeOrder.indexOf(this.type) + 1];
      //set new type
      this.type = newType;
      //incremente unit force
      this.baseForce = initialUnitForce[newType];

      return Promise.resolve({ status: "valid", type: newType });
    }

    if (changeType === "train") {
      //incremente unit force
      console.log(trainValues[this.type], trainValues, this.type)
      this.gainedForce = this.gainedForce + trainValues[this.type].forceToAdd;

      return Promise.resolve({ status: "valid", type: this.type });
    }
  }
}

/////////////////END CLASSES/////////////////

/////////////////FUNCTIONS/////////////////

const battle = (army1, army2) => {
  if (army1.totalForce === army2.totalForce) {
    //remove random from armys
    army1.removeRandomUnit(army1);
    army2.removeRandomUnit(army2);
    //add history records
    army1.addHistoryResult(army1, "Draw", army2.name);
    army2.addHistoryResult(army2, "Draw", army1.name);

    return [army1, army2];
  }

  if (army1.totalForce > army2.totalForce) {
    army1.gold = army1.gold + 100;
    army2.removeMostPowerfullUnits(army2);
    //add history records
    army1.addHistoryResult(army1, "Win", army2.name);
    army2.addHistoryResult(army2, "Loose", army1.name);
  } else {
    army2.gold = army2.gold + 100;
    army1.removeMostPowerfullUnits(army1);
    //add history records
    army1.addHistoryResult(army1, "Loose", army2.name);
    army2.addHistoryResult(army2, "Win", army1.name);
  }

  return [army1, army2];
};

/////////////////END FUNCTIONS/////////////////

/////////////////INSTANCES/////////////////

// const Chinese = new Army("Chinese", 2, 25, 2);
// const Englishmen = new Army("Englishmen", 10, 10, 10);
// const Byzantines = new Army("Byzantines", 2, 25, 2);

// console.log(Chinese);
// console.log(Englishmen);
// console.log(Byzantines);

// console.log(battle(Chinese, Englishmen));
// console.log(battle(Chinese, Byzantines));
// console.log(battle(Byzantines, Englishmen));

// console.log(Chinese.upgradeUnit(1).then(r => console.log(r)));
// console.log(Chinese.trainUnit(1).then(r => console.log(r)));
// console.log(Chinese.units[1].force)

/////////////////END INSTANCES/////////////////
