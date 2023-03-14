const express = require("express");
const app = express();
const World = require("./src/World");
const Continent = require("./src/Continent");
const UrbanAreaData = require("./src/UrbanAreaData");

app.use(express.json());
const port = process.env.PORT || 8082;
app.listen(port, () => console.log(`Server running on port ${port}`));

const maxAreasToDisplay = 5;
let continentsList = [];
let continentDetailsList = [];

app.get("/", async (req, res) => {
  if (continentsList.length == 0) {
    const theWorld = new World();
    await theWorld.fetchContinents();
    continentsList = theWorld.getContinents();
  }
  res.json(continentsList);
});

app.get("/continent", async (req, res) => {
  const continentId = req.query.continentId;
  const cachedContinentDetails = continentDetailsList.find(
    (continent) => continent.continentId === continentId
  );
  if (cachedContinentDetails) {
    res.json(cachedContinentDetails.areas);
  } else {
    const aContinent = new Continent(continentId);
    await aContinent.fetchUrbanAreas();
    const continentCities = aContinent.getAllUrbanAreas();
    const someContinentDetails = new UrbanAreaData(
      continentId,
      continentCities,
      maxAreasToDisplay
    );
    await someContinentDetails.fetchAllUrbanAreaDetails();
    const continentTopAreas = someContinentDetails.getTopUrbanAreas();
    const newContinentDetails = {
      continentId: continentId,
      areas: continentTopAreas,
    };
    if (
      continentDetailsList.findIndex(
        (details) => details.continentId === continentId
      ) === -1
    ) {
      continentDetailsList.push(newContinentDetails);
    }
    res.json(newContinentDetails.areas);
  }
});
