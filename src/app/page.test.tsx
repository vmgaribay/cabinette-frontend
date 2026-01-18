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

  test("renders heading and components", async () => {
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

  test("fetches data on mount", async () => {
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
});