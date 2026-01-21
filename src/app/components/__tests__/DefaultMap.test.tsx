jest.mock("leaflet", () => {
  const actual = jest.requireActual("leaflet");
  return {
    ...actual,
    control: jest.fn(() => ({
      addTo: jest.fn(),
      remove: jest.fn(),
    })),
    DomUtil: {
      create: jest.fn(() => document.createElement("div")),
    },
  };
});
import { render, waitFor, screen } from "@testing-library/react";

jest.mock("react-leaflet", () => ({
  MapContainer: ({ children }: any) => <div data-testid="map">{children}</div>,
  TileLayer: () => <div data-testid="tile" />,
  GeoJSON: ({ data }: any) => (
<div data-testid="geojson" data-json={JSON.stringify(data)}>
      {JSON.stringify(data)}
    </div>
  ),
  CircleMarker: ({ children }: any) => (
    <div data-testid="circle">{children}</div>
  ),
  Popup: ({ children }: any) => <div data-testid="popup">{children}</div>,
  useMap: () => ({
    fitBounds: jest.fn(),
    options: {},
  }),
}));
import DefaultMap from "../DefaultMap";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";

const sitesGeojsonMock = {
  features: [
    {
      properties: { id: "site_1" , parks_within_30_mi_unitcodes: "JOTR, LOTR"},
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [0, 0],
            [1, 0],
            [1, 1],
            [0, 1],
            [0, 0],
          ],
        ],
      },
    },
    {
      properties: { id: "site_2", parks_within_30_mi_unitcodes: "JOTR, LOTR" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [2, 2],
            [3, 2],
            [3, 3],
            [2, 3],
            [2, 2],
          ],
        ],
      },
    },
  ],

};
const vcsGeojsonMock = {
  features: [
    {
      properties: { id: "VC_1", unitcode: "JOTR" },
      geometry: { type: "Point", coordinates: [0, 0] },
    },
    {
      properties: { id: "VC_2", unitcode: "LOTR" },
      geometry: { type: "Point", coordinates: [1, 1] },
    }
  ],
};

const mockStore = configureStore([]);
const initialState = {
  bookmarks: { siteIds: ["site_1"] },
  filter: {
    filterUnitcodes: ["JOTR"],
    showBookmarkedOnly: true,
    unitcodeFilteredSiteIDs: ["site_1", "site_2"],
  },
  theme: { mode: "default" },
};

beforeEach(() => {
  global.fetch = jest.fn((url) =>
    Promise.resolve({
      json: () =>
        url.includes("site-polygons")
          ? Promise.resolve(sitesGeojsonMock)
          : Promise.resolve(vcsGeojsonMock),
    }),
  ) as jest.Mock;
});

afterEach(() => {
  jest.resetAllMocks();
});

test("container renders", async () => {
  render(
  <Provider store={mockStore(initialState)}>
    <DefaultMap scoreID={{ site_1: 1, site_2: 2}} visibleSiteIDs={[]}/>
  </Provider>
  );
  await waitFor(() => expect(global.fetch).toHaveBeenCalled());
});

test("filters visitor centers", async () => {
  render(
    <Provider store={mockStore(initialState)}>
      <DefaultMap scoreID={{ site_1: 1, site_2: 2 }} 
      visibleSiteIDs={["site_1","site_2"]}/>
    </Provider>
  );
  await waitFor(() => expect(global.fetch).toHaveBeenCalled());

  const circles = screen.getAllByTestId("circle");
  expect(circles).toHaveLength(1);
  const circleContent = circles[0].textContent;
  expect(circleContent).toContain("VC_1");
});

test("filters site polygons", async () => {
  render(
    <Provider store={mockStore(initialState)}>
      <DefaultMap scoreID={{ site_1: 1, site_2: 2 }}
       visibleSiteIDs={["site_1"]}/>
    </Provider>
  );
  await waitFor(() => expect(global.fetch).toHaveBeenCalled());

  const geojsonDiv = screen.getByTestId("geojson");
  const geojsonData = JSON.parse(geojsonDiv.getAttribute("data-json")!);
  const renderedIds = geojsonData.features.map((f: any) => f.properties.id);

  expect(renderedIds).toEqual(["site_1"]);
});
