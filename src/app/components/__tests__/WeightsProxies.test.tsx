import { render, screen, fireEvent } from "@testing-library/react";
import WeightsProxies from "../WeightsProxies";

describe("WeightsProxies", () => {
  const mockSet = jest.fn();
  const defaultProps = {
    scoredSites: [],
    selectedFeature: null,
    setSelectedFeature: jest.fn(),
    demandWeight: 0.5,
    setDemandWeight: mockSet,
    competitionWeight: 0.5,
    setCompetitionWeight: mockSet,
    proximityWeight: 0.5,
    setProximityWeight: mockSet,
    accessibilityWeight: 0.5,
    setAccessibilityWeight: mockSet,
    demandProxy: "Proximate Parks",
    setDemandProxy: mockSet,
    demandMetric: "Average",
    setDemandMetric: mockSet,
    competitionProxy: "Lodging Near Site",
    setCompetitionProxy: mockSet,
    proximityProxy: "Avg. Distance to Proximate Parks",
    setProximityProxy: mockSet,
  };

  it("renders sliders/menus", () => {
    render(<WeightsProxies {...defaultProps} />);
    expect(screen.getByText(/^Demand Weight/)).toBeInTheDocument();
    expect(screen.getByText(/^Competition Weight/)).toBeInTheDocument();
    expect(screen.getByText(/^Proximity Weight/)).toBeInTheDocument();
    expect(screen.getByText(/^Accessibility Weight/)).toBeInTheDocument();
    expect(screen.getAllByRole("slider")).toHaveLength(4);
    expect(screen.getAllByRole("combobox")).toHaveLength(4);
  });

  it("calls setDemandWeight", () => {
    render(<WeightsProxies {...defaultProps} />);
    const slider = screen.getAllByRole("slider")[0];
    fireEvent.change(slider, { target: { value: 0.7 } });
    expect(mockSet).toHaveBeenCalled();
  });

  it("calls setDemandProxy", () => {
    render(<WeightsProxies {...defaultProps} />);
    const select = screen.getAllByRole("combobox")[0];
    fireEvent.change(select, { target: { value: "Nearest Park" } });
    expect(mockSet).toHaveBeenCalled();
  });
});