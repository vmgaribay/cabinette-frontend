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

const siteInfo = [{ id: "site1" }, { id: "site2" }, { id: "site3" }];

  const mockStore = configureStore([]);
  const store = mockStore({
      bookmarks: { siteIds: [] },
    });
    store.dispatch = jest.fn();

test("ranking table renders", () => {
  render(
    <Provider store={store}>
    <RankingTable
      scoredSites={scoredSites}
      selectedFeature={null}
      setSelectedFeature={() => {}}
      siteInfo={siteInfo}
      visibleSiteIds={["site1", "site2", "site3"]}
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
      siteInfo={siteInfo}
      visibleSiteIds={["site1", "site2", "site3"]}
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
        visibleSiteIds={["site1", "site2"]}
      />
    </Provider>
  );


  const checkboxes = screen.getAllByRole("checkbox");
  fireEvent.click(checkboxes[0]);
  expect(store.dispatch).toHaveBeenCalledWith(toggleBookmark("site1"));
});
