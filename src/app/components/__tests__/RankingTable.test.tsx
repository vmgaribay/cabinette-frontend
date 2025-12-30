import { render, screen, fireEvent } from "@testing-library/react";
import RankingTable from "../RankingTable";

const scoredSites = [
  { id: "site1", score: 0.95 },
  { id: "site2", score: 0.85 },
  { id: "site3", score: 1.5 }
];

const siteInfo = [
  { id: "site1" },
  { id: "site2" },
  { id: "site3" },
];

test("ranking table renders", () => {
  render(
    <RankingTable
      scoredSites={scoredSites}
      selectedFeature={null}
      setSelectedFeature={() => {}}
      siteInfo={siteInfo}
      visibleSiteIds={["site1", "site2", "site3"]}
    />
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
    <RankingTable
      scoredSites={scoredSites}
      selectedFeature={{ type: "site", id: "site2" }}
      setSelectedFeature={setSelectedFeature}
      siteInfo={siteInfo}
      visibleSiteIds={["site1", "site2", "site3"]}
    />
  );
  const selectedRow = screen.getByText("site2").closest("tr");
  expect(selectedRow).toHaveStyle("background: rgba(215, 218, 223, 0.4)");
  const firstRow = screen.getByText("site1").closest("tr");
  fireEvent.click(firstRow!);
  expect(setSelectedFeature).toHaveBeenCalledWith({ type: "site", id: "site1" });
});