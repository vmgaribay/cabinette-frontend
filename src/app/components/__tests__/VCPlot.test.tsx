import { render, screen } from "@testing-library/react";
import VCVisitationPlot from "../VCPlot";
jest.mock("next/dynamic", () => (loader: any) => {
  const mod = require("react-plotly.js");
  return mod && (mod.default || mod);
});
jest.mock("react-plotly.js", () => (props: any) => (
  <div data-testid="plotly-mock">
    <div>{props.layout?.title}</div>
    <div>{props.data?.map((trace: any) => trace.name).join(", ")}</div>
    <div>
      {props.data?.[0]?.x?.map?.((month: string) => (
        <span key={month}>{month}</span>
      ))}
    </div>
  </div>
));

const mockVisitation = [
  {
    unitcode: "JOTR",
    month: "1",
    min_recreation_visits: 10,
    avg_recreation_visits: 100,
    max_recreation_visits: 1000,
  },
  {
    unitcode: "JOTR",
    month: "2",
    min_recreation_visits: 10,
    avg_recreation_visits: 100,
    max_recreation_visits: 1000,
  },
  {
    unitcode: "JOTR",
    month: "3",
    min_recreation_visits: 10,
    avg_recreation_visits: 100,
    max_recreation_visits: 1000,
  },
  {
    unitcode: "JOTR",
    month: "4",
    min_recreation_visits: 10,
    avg_recreation_visits: 100,
    max_recreation_visits: 1000,
  },
  {
    unitcode: "JOTR",
    month: "5",
    min_recreation_visits: 10,
    avg_recreation_visits: 100,
    max_recreation_visits: 1000,
  },
  {
    unitcode: "JOTR",
    month: "6",
    min_recreation_visits: 10,
    avg_recreation_visits: 100,
    max_recreation_visits: 1000,
  },
  {
    unitcode: "JOTR",
    month: "7",
    min_recreation_visits: 10,
    avg_recreation_visits: 100,
    max_recreation_visits: 1000,
  },
  {
    unitcode: "JOTR",
    month: "8",
    min_recreation_visits: 10,
    avg_recreation_visits: 100,
    max_recreation_visits: 1000,
  },
  {
    unitcode: "JOTR",
    month: "9",
    min_recreation_visits: 10,
    avg_recreation_visits: 100,
    max_recreation_visits: 1000,
  },
  {
    unitcode: "JOTR",
    month: "10",
    min_recreation_visits: 10,
    avg_recreation_visits: 100,
    max_recreation_visits: 1000,
  },
  {
    unitcode: "JOTR",
    month: "11",
    min_recreation_visits: 10,
    avg_recreation_visits: 100,
    max_recreation_visits: 1000,
  },
  {
    unitcode: "JOTR",
    month: "12",
    min_recreation_visits: 10,
    avg_recreation_visits: 100,
    max_recreation_visits: 1000,
  },
  {
    unitcode: "REDW",
    month: "1",
    min_recreation_visits: 5,
    avg_recreation_visits: 50,
    max_recreation_visits: 500,
  },
];

describe("VCVisitationPlot", () => {
  it("plot renders", () => {
    render(<VCVisitationPlot visitation={mockVisitation} unitcode="JOTR" />);
    expect(screen.getByText("Feb")).toBeInTheDocument();
  });

  it("data is filtered", () => {
    render(<VCVisitationPlot visitation={mockVisitation} unitcode="REDW" />);
    expect(screen.queryByText(/Feb/)).not.toBeInTheDocument();
    expect(screen.getByText(/Minimum, Average, Maximum/)).toBeInTheDocument();
  });
});
