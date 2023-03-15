import UrbanAreaData from "../../classes/UrbanAreaData";
require("jest-fetch-mock").enableMocks();

describe("Block 3: UrbanAreaData class", () => {
  let testUrbanAreaDataInstance;
  let mockApiAllUrbanAreaDetails;

  beforeEach(() => {
    testUrbanAreaDataInstance = new UrbanAreaData(
      "geonames:AF",
      ["url1", "url2", "url3"],
      5
    );
    mockApiAllUrbanAreaDetails = {
      _links: {
        curies: [
          {
            href: "longurlstring",
            name: "randomlongstring",
            templated: true,
          },
        ],
        self: {
          href: "https://api.teleport.org/api/urban_areas/slug:lagos/scores/",
        },
      },
      categories: [{ something: "something" }],
      summary: "A long string",
      teleport_city_score: 7.5,
    };
    fetch.resetMocks();
    fetch.mockResponses(
      JSON.stringify(mockApiAllUrbanAreaDetails),
      JSON.stringify(mockApiAllUrbanAreaDetails),
      JSON.stringify(mockApiAllUrbanAreaDetails)
    );
  });

  it("test1 - fetchAPI called 3x times on loop of 3x urban area urls", async () => {
    await testUrbanAreaDataInstance.fetchAllUrbanAreaDetails();
    expect(fetch).toHaveBeenCalledTimes(3);
  });

  it("test2 - urban area details data added to topUrbanArea array", async () => {
    await testUrbanAreaDataInstance.fetchAllUrbanAreaDetails();
    expect(testUrbanAreaDataInstance.getTopUrbanAreas().length).toBe(3);
  });

  it("test3 - api responses are formatted to remove excess data not given by params", async () => {
    const expectedFields = ["name", "teleport_city_score", "summary"];
    await testUrbanAreaDataInstance.fetchAllUrbanAreaDetails();
    const actualFields = Object.keys(
      testUrbanAreaDataInstance.getTopUrbanAreas()[0]
    );
    expect(actualFields).toEqual(expectedFields);
  });

  it("test4 - urban areas are sprted by teleport score desc in array", async () => {
    fetch.resetMocks();
    fetch.mockResponses(
      JSON.stringify(mockApiAllUrbanAreaDetails),
      JSON.stringify({
        _links: {
          curies: [{}],
          self: {
            href: "https://api.teleport.org/api/urban_areas/slug:lagos/scores/",
          },
        },
        categories: [{}],
        summary: "A long string",
        teleport_city_score: 10.4,
      }),
      JSON.stringify({
        _links: {
          curies: [{}],
          self: {
            href: "https://api.teleport.org/api/urban_areas/slug:lagos/scores/",
          },
        },
        categories: [{}],
        summary: "A long string",
        teleport_city_score: 8.8,
      })
    );
    await testUrbanAreaDataInstance.fetchAllUrbanAreaDetails();
    expect(
      testUrbanAreaDataInstance.getTopUrbanAreas()[0].teleport_city_score
    ).toBe(10.4);
    expect(
      testUrbanAreaDataInstance.getTopUrbanAreas()[1].teleport_city_score
    ).toBe(8.8);
    expect(
      testUrbanAreaDataInstance.getTopUrbanAreas()[2].teleport_city_score
    ).toBe(7.5);
  });

  it("test5 - only X urban areas added to new array based on maxDisplay param", async () => {
    fetch.resetMocks();
    const testUrbanAreasInstance2 = new UrbanAreaData(
      "geonames:AF",
      ["url1", "url2", "url3", "url4", "url5", "url6", "url7"],
      5
    );
    fetch.mockResponses(
      JSON.stringify(mockApiAllUrbanAreaDetails),
      JSON.stringify({
        _links: {
          curies: [{}],
          self: {
            href: "https://api.teleport.org/api/urban_areas/slug:lagos/scores/",
          },
        },
        categories: [{}],
        summary: "lagos 2",
        teleport_city_score: 10.4,
      }),
      JSON.stringify({
        _links: {
          curies: [{}],
          self: {
            href: "https://api.teleport.org/api/urban_areas/slug:lagos/scores/",
          },
        },
        categories: [{}],
        summary: "lagos 3",
        teleport_city_score: 10.1,
      }),
      JSON.stringify({
        _links: {
          curies: [{}],
          self: {
            href: "https://api.teleport.org/api/urban_areas/slug:lagos/scores/",
          },
        },
        categories: [{}],
        summary: "lagos 4",
        teleport_city_score: 0.2,
      }),
      JSON.stringify({
        _links: {
          curies: [{}],
          self: {
            href: "https://api.teleport.org/api/urban_areas/slug:lagos/scores/",
          },
        },
        categories: [{}],
        summary: "lagos 5",
        teleport_city_score: 4.4,
      }),
      JSON.stringify({
        _links: {
          curies: [{}],
          self: {
            href: "https://api.teleport.org/api/urban_areas/slug:lagos/scores/",
          },
        },
        categories: [{}],
        summary: "lagos 6",
        teleport_city_score: 8.8,
      }),
      JSON.stringify({
        _links: {
          curies: [{}],
          self: {
            href: "https://api.teleport.org/api/urban_areas/slug:lagos/scores/",
          },
        },
        categories: [{}],
        summary: "lagos 7",
        teleport_city_score: 5.5,
      })
    );
    await testUrbanAreasInstance2.fetchAllUrbanAreaDetails();
    expect(testUrbanAreasInstance2.getTopUrbanAreas().length).toBe(5);
  });

  it("test6- getContinentId getter function works", () => {
    expect(testUrbanAreaDataInstance.getContinentId()).toEqual("geonames:AF");
  });

});
