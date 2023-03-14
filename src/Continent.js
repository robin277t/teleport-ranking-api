class Continent {
  #continentId;
  #allUrbanAreaURLs;

  constructor(continentId) {
    this.#continentId = continentId;
    this.#allUrbanAreaURLs = [];
  }

  getContinentId() {
    return this.#continentId;
  }

  getAllUrbanAreas() {
    return this.#allUrbanAreaURLs;
  }

  async fetchUrbanAreas() {
    try {
      const response = await fetch(
        `https://api.teleport.org/api/continents/${
          this.#continentId
        }/urban_areas/`
      );
      const data = await response.json();
      this.#formatAllUrbanAreasListAsURLs(data);
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  #formatAllUrbanAreasListAsURLs(data) {
    this.#allUrbanAreaURLs = [];
    data._links["ua:items"].forEach((urbanArea) => {
      const newUrbanArea = urbanArea.href.split("/")[5];
      this.#allUrbanAreaURLs.push(
        `https://api.teleport.org/api/urban_areas/${newUrbanArea}/scores/`
      );
    });
  }
}

module.exports = Continent;
