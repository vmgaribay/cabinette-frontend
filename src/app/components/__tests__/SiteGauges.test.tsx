import { render, screen } from "@testing-library/react";
jest.mock("next/dynamic", () => (loader: any) => {
  const mod = require("react-plotly.js");
  return mod && (mod.default || mod);
});
let plotProps: any = null;
jest.mock("react-plotly.js", () => (props: any) => {
  plotProps = props;
  return <div data-testid="plotly-gauge" />;
});
import SiteGauges from "../SiteGauges";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { createRef } from "react";

const mockStore = configureStore([]);
const store = mockStore({
  bookmarks: { siteIds: [] },
  theme: { mode: "default" },
});

const themeRef = createRef<HTMLDivElement>();


const siteRow = {
  combined_min_monthly_visitation: 20,
  combined_overall_avg_monthly_visitation: 40,
  combined_max_monthly_visitation: 60,
  nearest_park_min_monthly_visitation: 10,
  nearest_park_overall_avg_monthly_visitation: 20,
  nearest_park_max_monthly_visitation: 30,
};

const siteInfo = [
  {
    combined_min_monthly_visitation: 20,
    combined_overall_avg_monthly_visitation: 40,
    combined_max_monthly_visitation: 60,
    nearest_park_min_monthly_visitation: 10,
    nearest_park_overall_avg_monthly_visitation: 20,
    nearest_park_max_monthly_visitation: 30,
  },
  {
    combined_min_monthly_visitation: 5,
    combined_overall_avg_monthly_visitation: 10,
    combined_max_monthly_visitation: 20,
    nearest_park_min_monthly_visitation: 5,
    nearest_park_overall_avg_monthly_visitation: 10,
    nearest_park_max_monthly_visitation: 20,
  },
];

test("renders gauges with data", () => {
  render(
    <Provider store={store}>
    <SiteGauges
      siteRow={siteRow}
      siteInfo={siteInfo}
      demandProxy="Proximate Parks"
      themeRef={themeRef}
    />
    </Provider>
  );
  expect(screen.getByTestId("plotly-gauge")).toBeInTheDocument();
  expect(plotProps.data[0].value).toBe(20);
  expect(plotProps.data[0].gauge.axis.range).toEqual([5, 20]);
  expect(plotProps.data[1].value).toBe(40);
  expect(plotProps.data[1].gauge.axis.range).toEqual([10, 40]);
  expect(plotProps.data[2].value).toBe(60);
  expect(plotProps.data[2].gauge.axis.range).toEqual([20, 60]);
});
