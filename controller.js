const express = require("express");
const cors = require("cors");
const app = express();
const World = require("./src/World");
const Continent = require("./src/Continent");
const UrbanAreaData = require("./src/UrbanAreaData");

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

const port = process.env.PORT || 8082;
app.listen(port, () => console.log(`Server running on port ${port}`));

const maxAreasToDisplay = 5;
let continentsList = [];
let continentDetailsList = [];

app.get("/", async (req, res) => {
  console.log("Startup fetch for continent List called");
  if (continentsList.length == 0) {
    await addContinents();
    backgroundLoad();
  }
  res.json(continentsList);
});

app.get("/continent", async (req, res) => {
  console.log(`fetch for continent DETAIL called for ${req.query.continentId}`);
  const continentId = req.query.continentId;
  const cachedContinentDetails = continentDetailsList.find(
    (continent) => continent.continentId === continentId
  );
  if (cachedContinentDetails) {
    res.json(cachedContinentDetails.areas);
  } else {
    addContinentDetail(continentId);
    const newContinentDetails = await addContinentDetail(continentId);
    res.json(newContinentDetails.areas);
  }
});

const addContinents = async () => {
  const theWorld = new World();
  await theWorld.fetchContinents();
  continentsList = theWorld.getContinents();
};

const backgroundLoad = async () => {
  continentsList.forEach((continent) => {
    addContinentDetail(continent.continentId);
  });
};

const addContinentDetail = async (continentId) => {
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
  checkPushContinentDetail(newContinentDetails);
  return newContinentDetails;
};

const checkPushContinentDetail = (newContinentDetails) => {
  if (
    continentDetailsList.findIndex(
      (details) => details.continentId === newContinentDetails.continentId
    ) === -1
  ) {
    continentDetailsList.push(newContinentDetails);
  }
};
