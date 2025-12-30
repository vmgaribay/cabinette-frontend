import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FilteredMap from "../filteredmap";

jest.mock("../defaultmap", () => () => <div data-testid="dynamic-map" />);

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
    <FilteredMap
      selectedFeature={null}
      setSelectedFeature={() => {}}
      scoredSites={[]}
      siteInfo={[]}
      visibleSiteIds={[]}
    />,
  );
  expect(
    screen.getByText(/filter site visibility by park/i),
  ).toBeInTheDocument();
  await waitFor(() =>
    expect(screen.getByText("Joshua Tree NP")).toBeInTheDocument(),
  );
});

test("selection value updates", async () => {
  render(
    <FilteredMap
      selectedFeature={null}
      setSelectedFeature={() => {}}
      scoredSites={[]}
      siteInfo={[]}
      visibleSiteIds={[]}
    />,
  );
  await waitFor(() =>
    expect(screen.getByText("Joshua Tree NP")).toBeInTheDocument(),
  );
  const select = screen.getByRole("listbox");
  const option = screen.getByText("Joshua Tree NP") as HTMLOptionElement;
  option.selected = true;
  fireEvent.change(select);
  expect(
    Array.from((select as HTMLSelectElement).selectedOptions).map(
      (o) => o.value,
    ),
  ).toContain("JOTR");
});

test("button clears selection", async () => {
  render(
    <FilteredMap
      selectedFeature={null}
      setSelectedFeature={() => {}}
      scoredSites={[]}
      siteInfo={[]}
      visibleSiteIds={[]}
    />,
  );
  await waitFor(() =>
    expect(screen.getByText("Joshua Tree NP")).toBeInTheDocument(),
  );
  const select = screen.getByRole("listbox");
  const options = screen.getAllByRole("option");
  options[0].selected = true;
  fireEvent.change(select);
  fireEvent.click(screen.getByText(/clear filters/i));
  options.forEach((option) => expect(option.selected).toBe(false));
});
