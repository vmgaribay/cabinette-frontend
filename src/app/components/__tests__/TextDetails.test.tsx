import { render, screen } from "@testing-library/react";
import TextDetails from "../textdetails";

const mockSiteInfo = [
  {
    id: "111",
    parks_within_30_mi_names: "Joshua Tree NP",
    nearest_road_distance_mi: 1,
    nearest_road_distance_km: 1.85,
    nearest_road_type: "Highway",
    lodging_for_site: 3,
    combined_lodging: 5,
    combined_overall_avg_monthly_visitation: 900,
    combined_min_monthly_visitation: 800,
    combined_max_monthly_visitation: 1000,
    nearest_park_overall_avg_monthly_visitation: 900,
    nearest_park_min_monthly_visitation: 800,
    nearest_park_max_monthly_visitation: 1000,
    combined_vc_distance_mi: 2,
    combined_vc_distance_km: 3.7,
    nearest_vc_distance_mi: 1.5,
    nearest_vc_distance_km: 2.8,
  },
];

const mockVCInfo = [
  {
    id: "JOTR_1",
    visitor_center_name: "Visitor Center 1",
    vc_site_count: 2,
  },
];

const mockVisitation = [{ unitcode: "JOTR", parkname: "Joshua Tree NP" }];

describe("TextDetails", () => {
  it("selection prompt renders", () => {
    render(
      <TextDetails
        selectedFeature={null}
        siteInfo={mockSiteInfo}
        vcInfo={mockVCInfo}
        visitation={mockVisitation}
      />,
    );
    expect(
      screen.getByText(/select a visitor center or candidate site/i),
    ).toBeInTheDocument();
  });

  it("VC details render", () => {
    render(
      <TextDetails
        selectedFeature={{ type: "vc", id: "JOTR_1" }}
        siteInfo={mockSiteInfo}
        vcInfo={mockVCInfo}
        visitation={mockVisitation}
      />,
    );
    expect(
      screen.getByText(/Visitor Center JOTR_1 Details/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Visitor Center 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Joshua Tree NP/i)).toBeInTheDocument();
    expect(screen.getByText(/Number of Viable Sites:/i)).toBeInTheDocument();
    expect(screen.getByText(/2/i)).toBeInTheDocument();
  });

  it("site details render", () => {
    render(
      <TextDetails
        selectedFeature={{ type: "site", id: "111" }}
        siteInfo={mockSiteInfo}
        vcInfo={mockVCInfo}
        visitation={mockVisitation}
        score={0.5}
        competitionProxy="Lodging Near Site"
        demandProxy="Proximate Parks"
        demandMetric="Average"
        proximityProxy="Average Distance to Proximate Parks"
      />,
    );
    expect(screen.getByText(/Candidate Site 111 Details/i)).toBeInTheDocument();
    expect(screen.getByText(/Score:/i)).toBeInTheDocument();
    expect(screen.getByText(/0.5/i)).toBeInTheDocument();
    expect(screen.getByText(/Joshua Tree NP/)).toBeInTheDocument();
    expect(screen.getByText(/Lodging near Site:/i)).toBeInTheDocument();
    expect(screen.getByText(/5/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Visitors to All Proximate Parks:/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Monthly Average/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Average Distance to Proximate Parks:/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/3.7 km/i)).toBeInTheDocument();
  });
});
