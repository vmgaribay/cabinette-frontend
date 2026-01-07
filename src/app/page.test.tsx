import { render, screen, waitFor, act } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

// (Tests for components can be found in app/components/__tests__/)
const mockFilteredMap = jest.fn(() => <div data-testid="filtered-map" />);
const mockWeightsProxies = jest.fn(() => <div data-testid="weights-proxies" />);
jest.doMock("./components/FilteredMap", () => ({
  __esModule: true,
  default: mockFilteredMap,
}));
jest.doMock("./components/WeightsProxies", () => ({
  __esModule: true,
  default: mockWeightsProxies,
}));
jest.mock("./components/TextDetails", () => ({
  __esModule: true,
  default: () => <div data-testid="text-details" />,
}));
jest.mock("./components/VCPlot", () => ({
  __esModule: true,
  default: () => <div data-testid="vc-plot" />,
}));
jest.mock("./components/SiteGauges", () => ({
  __esModule: true,
  default: () => <div data-testid="site-gauges" />,
}));
const mockStore = configureStore([]);
const store = mockStore({
  bookmarks: { siteIds: [] },
  theme: { mode: "default" },
});

import Home from "./page";

global.fetch = jest.fn(() =>
  Promise.resolve({ json: () => Promise.resolve([]) }),
) as jest.Mock;

describe("Main Page", () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
    mockFilteredMap.mockClear();
    mockWeightsProxies.mockClear();
  });

  it("renders heading and components", async () => {
    render(
      <Provider store={store}>
        <Home />
      </Provider>
    );
    expect(screen.getByText("Cabinette Map")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByTestId("filtered-map")).toBeInTheDocument();
      expect(screen.getByTestId("weights-proxies")).toBeInTheDocument();
      expect(screen.getByTestId("text-details")).toBeInTheDocument();
    });
  });

  it("fetches data on mount", async () => {
    render(
      <Provider store={store}>
        <Home />
      </Provider>
    );
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/details/site_info");
      expect(global.fetch).toHaveBeenCalledWith("/api/details/vc_info");
      expect(global.fetch).toHaveBeenCalledWith("/api/details/visitation");
    });
  });

  it("filters and sorts scoredSites", async () => {
    (global.fetch as jest.Mock)
      .mockClear()
      .mockResolvedValueOnce({
        json: async () => [
          {
            id: "a",
            combined_overall_avg_monthly_visitation_norm: 1,
            combined_min_monthly_visitation_norm: 0,
            combined_max_monthly_visitation_norm: 0,
            nearest_park_min_monthly_visitation_norm: 0,
            nearest_park_max_monthly_visitation_norm: 0,
            nearest_park_overall_avg_monthly_visitation_norm: 0,
            lodging_for_site_norm: 0,
            combined_lodging_norm: 0,
            combined_vc_distance_norm: 0,
            nearest_vc_distance_norm: 0,
            nearest_road_distance_norm: 0,
          },
          {
            id: "b",
            combined_overall_avg_monthly_visitation_norm: 2,
            combined_min_monthly_visitation_norm: 0,
            combined_max_monthly_visitation_norm: 0,
            nearest_park_min_monthly_visitation_norm: 0,
            nearest_park_max_monthly_visitation_norm: 0,
            nearest_park_overall_avg_monthly_visitation_norm: 0,
            lodging_for_site_norm: 0,
            combined_lodging_norm: 0,
            combined_vc_distance_norm: 0,
            nearest_vc_distance_norm: 0,
            nearest_road_distance_norm: 0,
          },
          {
            id: "c",
            combined_overall_avg_monthly_visitation_norm: 3,
            combined_min_monthly_visitation_norm: 0,
            combined_max_monthly_visitation_norm: 0,
            nearest_park_min_monthly_visitation_norm: 0,
            nearest_park_max_monthly_visitation_norm: 0,
            nearest_park_overall_avg_monthly_visitation_norm: 0,
            lodging_for_site_norm: 0,
            combined_lodging_norm: 0,
            combined_vc_distance_norm: 0,
            nearest_vc_distance_norm: 0,
            nearest_road_distance_norm: 0,
          },
        ],
      })
      .mockResolvedValueOnce({ json: async () => [] })
      .mockResolvedValueOnce({ json: async () => [] });

    render(
      <Provider store={store}>
        <Home />
      </Provider>
    );
await waitFor(() => {
  const filteredMapCalls = mockFilteredMap.mock.calls;
  const initialCall = filteredMapCalls.find(
    ([props]) => props.scoredSites && props.scoredSites.length === 3
  );
  expect(initialCall).toBeDefined();
  const initialProps = initialCall[0];
  expect(initialProps.scoredSites).toHaveLength(3);
  expect(initialProps.scoredSites[0].id).toBe("c");
  expect(initialProps.scoredSites[1].id).toBe("b");
  expect(initialProps.scoredSites[2].id).toBe("a");



    const sitesVisibleCallback = initialProps.sitesVisible;
    act(() => sitesVisibleCallback(["a", "c"]));


const filteredCall = filteredMapCalls.find(
  ([props]) =>
    props.scoredSites &&
    props.scoredSites.length === 2 &&
    props.scoredSites[0].id === "c" &&
    props.scoredSites[1].id === "a"
);
expect(filteredCall).toBeDefined();
});

  });
});