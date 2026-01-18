import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FilteredMap from "../FilteredMap";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { createRef } from "react";

const mockStore = configureStore([]);
const store = mockStore({
  bookmarks: { siteIds: [] },
  theme: { mode: "default" },
    filter: {
    filterUnitcodes: [],
    showBookmarkedOnly: false,
    unitcodeFilteredSiteIDs: []
  }
});

jest.mock("../DefaultMap", () => () => <div data-testid="dynamic-map" />);

const themeRef = createRef<HTMLDivElement>();

const parksMock = [
  { unitcode: "JOTR", parkname: "Joshua Tree NP" },
  { unitcode: "MEVE", parkname: "Mesa Verde NP" },
];

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(parksMock),
    }),
  ) as jest.Mock;
});

afterEach(() => {
  jest.resetAllMocks();
});

test("filter labels render", async () => {
  render(
    <Provider store={store}>
    <FilteredMap
      selectedFeature={null}
      setSelectedFeature={() => {}}
      scoredSites={[]}
      themeRef={themeRef}
    />
    </Provider>
  );
  expect(
    screen.getByText(/filter site visibility/i),
  ).toBeInTheDocument();
  await waitFor(() =>
    expect(screen.getByText("Joshua Tree NP")).toBeInTheDocument(),
  );
});

test("filter value updates", async () => {
  render(
    <Provider store={store}>
    <FilteredMap
      selectedFeature={null}
      setSelectedFeature={() => {}}
      scoredSites={[]}
      themeRef={themeRef}
    />
    </Provider>
  );
  await waitFor(() =>
    expect(screen.getByText("Joshua Tree NP")).toBeInTheDocument(),
  );
  const select = screen.getByRole("listbox");
  const option = screen.getByText("Joshua Tree NP") as HTMLOptionElement;
  option.selected = true;
  fireEvent.change(select);
await waitFor(() => {
  expect(store.getActions()).toContainEqual({
    type: "filter/setFilterUnitcodes",
    payload: ["JOTR"],
  });
});
});

test("button clears filters", async () => {
  render(
    <Provider store={store}>
    <FilteredMap
      selectedFeature={null}
      setSelectedFeature={() => {}}
      scoredSites={[]}
      themeRef={themeRef}
    />
    </Provider>
  );
  await waitFor(() =>
    expect(screen.getByText("Joshua Tree NP")).toBeInTheDocument(),
  );
  const select = screen.getByRole("listbox");
  const options = screen.getAllByRole("option");
  options[0].selected = true;
  fireEvent.change(select);
fireEvent.click(screen.getByText(/clear filters/i));
expect(store.getActions()).toContainEqual({
  type: "filter/setFilterUnitcodes",
  payload: [],
});
expect(store.getActions()).toContainEqual({
  type: "filter/setShowBookmarkedOnly",
  payload: false,
});
});