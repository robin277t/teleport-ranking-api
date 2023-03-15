import Continent from "../../classes/Continent";
require("jest-fetch-mock").enableMocks();

describe("Block 2: Continent class", () => {
  let testContinentInstance;
  let mockApiAllUrbanAreaList;

  beforeEach(() => {
    testContinentInstance = new Continent("geonames:AF");
    mockApiAllUrbanAreaList = {
      _links: {
        curies: [
          {
            href: "longurlstring",
            name: "randomlongstring",
            templated: true,
          },
        ],
        self: { href: "longurlstring" },
        "ua:items": [
          {
            href: "https://api.teleport.org/api/urban_areas/slug:cairo/",
            name: "Cairo",
          },
          {
            href: "https://api.teleport.org/api/urban_areas/slug:lagos/",
            name: "Lagos",
          },
        ],
      },
      count: 0,
    };
    fetch.resetMocks();
  });

  it("test1 - fetchAPI response 1 adds continent's urban areas to array", async () => {
    fetch.mockResponseOnce(JSON.stringify(mockApiAllUrbanAreaList));
    expect(testContinentInstance.getAllUrbanAreas().length).toBe(0);
    await testContinentInstance.fetchUrbanAreas();
    expect(testContinentInstance.getAllUrbanAreas().length).toBe(2);
  });
  it("test2 - returns error message if api call fails", async () => {
    fetch.mockReject(() => Promise.reject("API not working"));
    const testReturn = await testContinentInstance.fetchUrbanAreas();
    expect(testReturn).toEqual(null);
    expect(fetch).toHaveBeenCalledWith(
      `https://api.teleport.org/api/continents/geonames:AF/urban_areas/`
    );
  });

  it("test3 - allUrbanAreas array filtered to remove un-needed data 1", async () => {
    fetch.mockResponseOnce(JSON.stringify(mockApiAllUrbanAreaList));
    await testContinentInstance.fetchUrbanAreas();
    expect(testContinentInstance.getAllUrbanAreas()[0]).not.toHaveProperty("_links");
    expect(testContinentInstance.getAllUrbanAreas()[0]).not.toHaveProperty("count");
  });

  it("test4 - allUrbanAreas array filtered to remove un-needed data 2", async () => {
    fetch.mockResponseOnce(JSON.stringify(mockApiAllUrbanAreaList));
    await testContinentInstance.fetchUrbanAreas();
    expect(testContinentInstance.getAllUrbanAreas()[0]).not.toHaveProperty("self");
    expect(testContinentInstance.getAllUrbanAreas()[0]).not.toHaveProperty("curies");
  });

  it("test5 - allUrbanAreas turned into array of urban area identifiers", async () => {
    fetch.mockResponseOnce(JSON.stringify(mockApiAllUrbanAreaList));
    await testContinentInstance.fetchUrbanAreas();

    expect(testContinentInstance.getAllUrbanAreas()[0]).toContain(
      "slug:cairo"
    );
    expect(testContinentInstance.getAllUrbanAreas()[1]).toContain(
      "slug:lagos"
    );
    expect(testContinentInstance.getAllUrbanAreas().length).toBe(2);
  });

  it("test6 - getContinentId getter function works", () => {
    expect(testContinentInstance.getContinentId()).toEqual("geonames:AF")
  })
});

