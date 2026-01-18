import { render, screen, fireEvent } from "@testing-library/react";
import RankingTable from "../RankingTable";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { toggleBookmark } from "../../store/bookmarksSlice";

const scoredSites = [
  { id: "site1", score: 0.95 },
  { id: "site2", score: 0.85 },
  { id: "site3", score: 1.5 },
];

  const mockStore = configureStore([]);
  const store = mockStore({
      bookmarks: { siteIds: [] },
      filter: { showBookmarkedOnly: false, unitcodeFilteredSiteIDs: [] },
    });
    store.dispatch = jest.fn();

test("ranking table renders", () => {
  render(
    <Provider store={store}>
    <RankingTable
      scoredSites={scoredSites}
      selectedFeature={null}
      setSelectedFeature={() => {}}
    />
    </Provider>
  );
  expect(screen.getByText("Top Sites by Score")).toBeInTheDocument();
  expect(screen.getByText("1")).toBeInTheDocument();
  expect(screen.getByText("2")).toBeInTheDocument();
  expect(screen.getByText("3")).toBeInTheDocument();
  expect(screen.getByText("0.950")).toBeInTheDocument();
  expect(screen.getByText("0.850")).toBeInTheDocument();
  expect(screen.getByText("1.500")).toBeInTheDocument();
  expect(screen.getByText("*Overall")).toBeInTheDocument();
});

test("reaction to row click", () => {
  const setSelectedFeature = jest.fn();
  render(
    <Provider store={store}>

    <RankingTable
      scoredSites={scoredSites}
      selectedFeature={{ type: "site", id: "site2" }}
      setSelectedFeature={setSelectedFeature}
    />
    </Provider>
  );
  const selectedRow = screen.getByText("site2").closest("tr");
  expect(selectedRow).toHaveStyle("background: rgba(var(--xlight), 0.4)");
  const firstRow = screen.getByText("site1").closest("tr");
  fireEvent.click(firstRow!);
  expect(setSelectedFeature).toHaveBeenCalledWith({
    type: "site",
    id: "site1",
  });
});

test("checkbox dispatches toggleBookmark", () => {
  render(
    <Provider store={store}>
      <RankingTable
        scoredSites= {scoredSites}
        selectedFeature={null}
        setSelectedFeature={() => {}}
      />
    </Provider>
  );


  const checkboxes = screen.getAllByRole("checkbox");
  fireEvent.click(checkboxes[1]);
  expect(store.dispatch).toHaveBeenCalledWith(toggleBookmark("site1"));
});

test("rendered sites sorted by score descending", () => {
  render(
    <Provider store={store}>
      <RankingTable
        scoredSites={scoredSites}
        selectedFeature={null}
        setSelectedFeature={() => {}}
      />
    </Provider>
  );
  const rows = screen.getAllByRole("row");
  expect(rows[1]).toHaveTextContent("site3");
  expect(rows[2]).toHaveTextContent("site1");
  expect(rows[3]).toHaveTextContent("site2");
});

test("sites filtered based on visibleSiteIDs", () => {
  const store = mockStore({
    bookmarks: { siteIds: [] },
    filter: { showBookmarkedOnly: false, unitcodeFilteredSiteIDs: ["site2"] },
  });

  render(
    <Provider store={store}>
      <RankingTable
        scoredSites={scoredSites}
        selectedFeature={null}
        setSelectedFeature={() => {}}
      />
    </Provider>
  );

  expect(screen.queryByText("site1")).not.toBeInTheDocument();
  expect(screen.getByText("site2")).toBeInTheDocument();
  expect(screen.queryByText("site3")).not.toBeInTheDocument();
});