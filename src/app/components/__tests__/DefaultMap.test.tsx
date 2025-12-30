import { render, waitFor } from "@testing-library/react";
jest.mock("react-leaflet", () => ({
  MapContainer: ({ children }: any) => <div data-testid="map">{children}</div>,
  TileLayer: () => <div data-testid="tile" />,
  GeoJSON: () => <div data-testid="geojson" />,
  CircleMarker: ({ children }: any) => (
    <div data-testid="circle">{children}</div>
  ),
  Popup: ({ children }: any) => <div data-testid="popup">{children}</div>,
  useMap: () => ({ fitBounds: jest.fn() }),
}));
import DefaultMap from "../DefaultMap";

const sitesGeojsonMock = {
  features: [
    {
      properties: { id: "site_1" },
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
  ],
};
const vcsGeojsonMock = {
  features: [
    {
      properties: { id: "VC_1" },
      geometry: { type: "Point", coordinates: [0, 0] },
    },
  ],
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
  render(<DefaultMap unitcodes={["JOTR"]} />);
  await waitFor(() => expect(global.fetch).toHaveBeenCalled());
});

test("sitesVisible is called", async () => {
  const sitesVisible = jest.fn();
  render(<DefaultMap unitcodes={["JOTR"]} sitesVisible={sitesVisible} />);
  await waitFor(() => expect(sitesVisible).toHaveBeenCalledWith(["site_1"]));
});
