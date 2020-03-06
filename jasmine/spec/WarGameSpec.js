const filterUnitsByType = (units, type) => {
  return units.filter(u => u.type === type)
} 

describe("Army", () => {
  let army;

  beforeEach(() => {
    army = new Army("Chinese", 2, 25, 2);
  });

  it("should be begin with 1000 of gold", () => {
    expect(army.gold).toEqual(1000);
  });

  it("should be calculate the total force", () => {
    expect(army.totalForce).toEqual(300);
  });

  it("should be begin with 29 units", () => {
    expect(army.units.length).toEqual(29);
  });

  it("should be begin with 2 pikemans units", () => {
    expect(filterUnitsByType(army.units, "pikemans").length).toEqual(2);
  });

  it("should be begin with 25 archers units", () => {
    expect(filterUnitsByType(army.units, "archers").length).toEqual(25);
  });

  it("should be begin with 2 knights units", () => {
    expect(filterUnitsByType(army.units, "knights").length).toEqual(2);
  });

  // demonstrates use of spies to intercept and test method calls
  // it("tells the current song if the user has made it a favorite", () => {
  //   spyOn(song, 'persistFavoriteStatus');

  //   player.play(song);
  //   player.makeFavorite();

  //   expect(song.persistFavoriteStatus).toHaveBeenCalledWith(true);
  // });

});
