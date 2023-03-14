class World {
  #continents

  constructor() {
    this.#continents = [];
  }

  getContinents() {
    return this.#continents
  }

  async fetchContinents() {
    try {
      const response = await fetch("https://api.teleport.org/api/continents/");
      const data = await response.json();
      this.#formatContinentsList(data);
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  #formatContinentsList(data) {
    this.#continents = []
    data._links["continent:items"].forEach((continent) => {
      const newContinent = {
        continentId: continent.href.slice(-12, -1),
        name: continent.name,
      };
      this.#continents.push(newContinent);
    });
  }

}

module.exports = World;
