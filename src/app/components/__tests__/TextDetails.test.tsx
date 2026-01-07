import { render, screen,fire, fireEvent } from "@testing-library/react";
import TextDetails from "../TextDetails";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { toggleBookmark } from "../../store/bookmarksSlice";

const mockStore = configureStore([]);
 const store = mockStore({
      bookmarks: { siteIds: [] },
    });


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
      <Provider store={store}>
      <TextDetails
        selectedFeature={null}
        siteInfo={mockSiteInfo}
        vcInfo={mockVCInfo}
        visitation={mockVisitation}
      />
      </Provider>
    );
    expect(
      screen.getByText(/select a visitor center or candidate site/i),
    ).toBeInTheDocument();
  });

  it("VC details render", () => {
    render(
     <Provider store={store}>
      <TextDetails
        selectedFeature={{ type: "vc", id: "JOTR_1" }}
        siteInfo={mockSiteInfo}
        vcInfo={mockVCInfo}
        visitation={mockVisitation}
      />
      </Provider>
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
      <Provider store={store}>
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
      />
      </Provider>
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

it("toggleBookmark dispatches when bookmark button is clicked", () => {
    render(
      <Provider store={store}>
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
        />
      </Provider>
    );

    const bookmarkButton = screen.getByLabelText(/Add Bookmark/i);
    fireEvent.click(bookmarkButton);

    const actions = store.getActions();
    expect(actions).toContainEqual(toggleBookmark("111"));  });
});