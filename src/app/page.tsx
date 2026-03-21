/**
 * page.tsx
 *
 * Main page for the Cabinette Map application.
 * - Fetches and manages site, visitor center, and visitation data.
 * - Allows users to rank candidate cabin sites.
 * - Integrates map, ranking, weights/proxies controls, and info/plots.
 * - Handles user selection and dynamic scoring of sites.
 * - Allows theme toggling between light and default modes.
 */
"use client";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { TourProvider, useTour } from "@reactour/tour";
import ThemeToggle from "./components/ThemeToggle";
import WeightsProxies from "./components/WeightsProxies";
import FilteredMap from "./components/FilteredMap";
import TextDetails from "./components/TextDetails";
import VCVisitationPlot from "./components/VCPlot";
import SiteGauges from "./components/SiteGauges";
import { useSelector } from "react-redux";
import { getCSSVar } from "./utils/retrieveVar";
import type { RootState } from "./store/store";
import {
  FeatureSelection,
  SiteInfoRow,
  VCInfoRow,
  VisitationRow,
} from "./types";

export function TourButton() {
  const tour = useTour();
  return (
    <button
      className="highlight-button"
      style={{ fontSize: 24, color: "rgb(var(--xlight))" }}
      onClick={() => tour?.setIsOpen?.(true)}
    >
      Take a tour to get started!
    </button>
  );
}

export default function Home() {
  const themeRef = useRef<HTMLDivElement>(null);
  const [siteInfo, setSiteInfo] = useState<SiteInfoRow[]>([]);
  const [vcInfo, setVCInfo] = useState<VCInfoRow[]>([]);
  const [visitation, setVisitation] = useState<VisitationRow[]>([]);
  const [selectedFeature, setSelectedFeature] =
    useState<FeatureSelection | null>(null);
  const currentTheme = useSelector((state: RootState) => state.theme.mode);

  const [colors, setColors] = useState({
    accent: "",
    light: "",
    dark: "",
    xlight: "",
  });

  useEffect(() => {
    if (themeRef.current) {
      setColors({
        accent: getCSSVar("--accent", themeRef.current),
        light: getCSSVar("--light", themeRef.current),
        dark: getCSSVar("--dark", themeRef.current),
        xlight: getCSSVar("--xlight", themeRef.current),
      });
    }
  }, [currentTheme, themeRef]);

  const tourStyles: Record<
    string,
    (
      base: React.CSSProperties,
      state?: { active?: boolean },
    ) => React.CSSProperties
  > = {
    maskWrapper: (base: React.CSSProperties) => ({
      ...base,
      backgroundColor: `rgba(${colors.dark}, 0.7)`,
    }),
    popover: (base: React.CSSProperties) => ({
      ...base,
      background: `rgba(${colors.dark}, 0.97)`,
      color: `rgb(${colors.xlight})`,
      border: `2px solid rgb(${colors.accent})`,
      borderRadius: "16px",
      boxShadow: `0 4px 24px rgba(${colors.accent}, 0.15)`,
      fontFamily: '"Lucida Sans", "Perpetua", serif',
      fontSize: "1.05rem",
      padding: "2rem",
      maxWidth: 425,
      margin: "1rem",
    }),
    badge: (base: React.CSSProperties) => ({
      ...base,
      background: `rgb(${colors.accent})`,
      color: `rgb(${colors.dark})`,
      fontWeight: "bold",
    }),
    close: (base: React.CSSProperties) => ({
      ...base,
      color: `rgb(${colors.accent})`,
    }),
    controls: (base: React.CSSProperties) => ({
      ...base,
      color: `rgb(${colors.accent})`,
    }),
    dot: (base: React.CSSProperties, state?: { active?: boolean }) => ({
      ...base,
      background:
        state && state.active
          ? `rgb(${colors.accent})`
          : `rgba(${colors.accent}, 0.3)`,
    }),
  };

  const tourStops = useMemo(
    () => [
      {
        selector: '[data-tour="welcome"]',
        content: (
          <>
            <span
              style={{
                display: "block",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Welcome to Cabinette!
            </span>
            <br />
            This app helps you narrow down candidate locations for a small cabin
            rental business near U.S. National Parks and Monuments based on your
            own decision reasoning and real, publicly available data. A
            site&apos;s suitability is scored based on demand, competition,
            proximity, and accessibility. You can control the basis (proxy) for
            each of these criteria and how much importance (weight) they are
            given in scoring. Please click the right arrow for a quick
            walkthrough of the main features or{" "}
            <span style={{ color: `rgb(${colors.accent || "143, 178, 248"})` }}>
              x
            </span>{" "}
            to exit the tour at any time.
          </>
        ),
        action: () => {
          setSelectedFeature(null);
        },
      },
      {
        selector: '[data-tour="map"]',
        content:
          "The interactive map shows National Park Service Visitor Centers (red points) and candidate Sites (blue polygons) for potential cabin accommodations. Scoring is only applied to candidate Sites; the more intense the color, the higher the score.",
        action: () => {
          setSelectedFeature(null);
        },
      },
      {
        selector: '[data-tour="map"]',
        content:
          "Selecting either a candidate Site or Visitor Center on the map will reveal relevant details and plots below.",
        action: () => {
          setSelectedFeature(null);
        },
      },
      {
        selector: '[data-tour="details"]',
        content:
          "For Sites, this includes their score as well as the raw score components. The lower panel shows gages indicating how its visitation statistics compare to those of all other sites.",
        action: () => {
          setSelectedFeature({ type: "site", id: "2114" });
        },
      },
      {
        selector: '[data-tour="details"]',
        content:
          "For Visitor Centers, there are general details and a plot showing a 5-year aggregation of the center's monthly visitation statistics.",
        action: () => {
          setSelectedFeature({ type: "vc", id: "MORA_2" });
        },
      },
      {
        selector: '[data-tour="rankings"]',
        content:
          "A Site's ranking is determined by its suitability score, which is calculated based on the selected proxies and their weights.",
        action: () => {
          setSelectedFeature(null);
        },
      },
      {
        selector: '[data-tour="weights"]',
        content:
          "You can use these controls to adjust the weights and proxies used in the Site scoring algorithm to match your priorities. The scores, ranks, and details will update in response.",
      },
      {
        selector: '[data-tour="filter-select"]',
        content:
          "You can filter the sites displayed in the map and ranking table by selecting one or more parks/monuments from this list.",
      },
      {
        selector: '[data-tour="bookmark-ranking-toggle"]',
        content:
          "You can bookmark your favorite sites for easy access later by clicking either its checkbox in the ranking table...",
        action: () => {
          setSelectedFeature({ type: "site", id: "3647" });
        },
      },
      {
        selector: '[data-tour="bookmark-detail-toggle"]',
        content: "... or the bookmark on its detail card.",
        action: () => {
          setSelectedFeature({ type: "site", id: "3647" });
        },
      },
      {
        selector: '[data-tour="bookmark-filter"]',
        content:
          "If you only want to see your bookmarked sites, check this box.",
        action: () => {
          setSelectedFeature(null);
        },
      },
      {
        selector: '[data-tour="bookmark-utilities"]',
        content:
          "Your bookmarks are stored in your browser data, however the tools in the Utilities menu can be used to export or import them for added security and flexibility.",
        action: () => {
          setSelectedFeature(null);
        },
      },

      {
        selector: '[data-tour="theme"]',
        content: "You can toggle between dark and light themes here.",
        action: () => {
          setSelectedFeature(null);
        },
      },
      {
        selector: "body",
        content: (
          <>
            Thanks for joining on the tour! You can close it by clicking the{" "}
            <span style={{ color: `rgb(${colors.accent || "143, 178, 248"})` }}>
              x
            </span>
            . Feel welcome to take a look at <br />
            <a
              href="https://github.com/vmgaribay/cabinette-frontend"
              style={{ textDecoration: "underline" }}
              target="_blank"
            >
              Cabinette Frontend
            </a>
            : the source for this web application built with Next.js, React,
            Redux, and TypeScript (including Node.js API routes), <br />
            <a
              href="https://github.com/vmgaribay/cabinette"
              style={{ textDecoration: "underline" }}
              target="_blank"
            >
              Cabinette
            </a>
            : the original project repository containing the dataset metadata,
            data processing scripts, PostgreSQL database setup, and Power BI
            dashboard, and
            <br />
            <a
              href="https://vmgaribay.github.io/portfolio/cabinette_log.html"
              style={{ textDecoration: "underline" }}
              target="_blank"
            >
              Cabinette Log
            </a>
            : the details on the Agile workflow, data engineering, and dashboard
            development progress.
          </>
        ),
        action: () => {
          setSelectedFeature(null);
        },
      },
    ],
    [colors],
  );

  // Weights
  const [demandWeight, setDemandWeight] = useState(0.5);
  const [competitionWeight, setCompetitionWeight] = useState(0.5);
  const [proximityWeight, setProximityWeight] = useState(0.5);
  const [accessibilityWeight, setAccessibilityWeight] = useState(0.5);

  // Proxies/Metrics
  const [demandProxy, setDemandProxy] = useState("Proximate Parks");
  const [demandMetric, setDemandMetric] = useState("Average");
  const [competitionProxy, setCompetitionProxy] = useState("Lodging Near Site");
  const [proximityProxy, setProximityProxy] = useState(
    "Avg. Distance to Proximate Parks",
  );

  useEffect(() => {
    fetch("/api/details/site_info")
      .then((res) => res.json())
      .then((data) => setSiteInfo(Array.isArray(data) ? data : []));
  }, []);
  useEffect(() => {
    fetch("/api/details/vc_info")
      .then((res) => res.json())
      .then((data) => setVCInfo(Array.isArray(data) ? data : []));
  }, []);
  useEffect(() => {
    fetch("/api/details/visitation")
      .then((res) => res.json())
      .then((data) => setVisitation(Array.isArray(data) ? data : []));
  }, []);

  const getDemandCol = useCallback(
    (site: SiteInfoRow) => {
      if (demandProxy === "Proximate Parks") {
        if (demandMetric === "Minimum")
          return site["combined_min_monthly_visitation_norm"];
        if (demandMetric === "Maximum")
          return site["combined_max_monthly_visitation_norm"];
        if (demandMetric === "Average")
          return site["combined_overall_avg_monthly_visitation_norm"];
      }
      if (demandProxy === "Nearest Park") {
        if (demandMetric === "Minimum")
          return site["nearest_park_min_monthly_visitation_norm"];
        if (demandMetric === "Maximum")
          return site["nearest_park_max_monthly_visitation_norm"];
        if (demandMetric === "Average")
          return site["nearest_park_overall_avg_monthly_visitation_norm"];
      }
      return 0;
    },
    [demandProxy, demandMetric],
  );

  const getCompetitionCol = useCallback(
    (site: SiteInfoRow) => {
      if (competitionProxy === "Lodging Near Site")
        return site["lodging_for_site_norm"];
      if (competitionProxy === "Lodging Near Proximate Parks")
        return site["combined_lodging_norm"];
      return 0;
    },
    [competitionProxy],
  );

  const getProximityCol = useCallback(
    (site: SiteInfoRow) => {
      if (proximityProxy === "Avg. Distance to Proximate Parks")
        return site["combined_vc_distance_norm"];
      if (proximityProxy === "Distance to Nearest Park")
        return site["nearest_vc_distance_norm"];
      return 0;
    },
    [proximityProxy],
  );

  const getAccessibilityCol = useCallback((site: SiteInfoRow) => {
    return site["nearest_road_distance_norm"];
  }, []);

  const computeScore = useCallback(
    (site: SiteInfoRow) => {
      const demandCol = getDemandCol(site);
      const competitionCol = getCompetitionCol(site);
      const proximityCol = getProximityCol(site);
      const accessibilityCol = getAccessibilityCol(site);

      return (
        demandWeight * demandCol -
        competitionWeight * competitionCol +
        proximityWeight * proximityCol +
        accessibilityWeight * accessibilityCol
      );
    },
    [
      demandWeight,
      competitionWeight,
      proximityWeight,
      accessibilityWeight,
      getDemandCol,
      getCompetitionCol,
      getProximityCol,
      getAccessibilityCol,
    ],
  );
  // Compute site scores, filter to match visibility/selection
  const scoredSites = useMemo(
    () => siteInfo.map((site) => ({ ...site, score: computeScore(site) })),
    [siteInfo, computeScore],
  );

  const selectedSiteScore = useMemo(() => {
    if (selectedFeature?.type === "site") {
      const site = siteInfo.find((s) => s.id === selectedFeature.id);
      return site ? computeScore(site) : undefined;
    }
    return undefined;
  }, [selectedFeature, siteInfo, computeScore]);

  return (
    <>
      <TourProvider steps={tourStops} styles={tourStyles}>
        {<ThemeToggle />}
        <main
          data-tour="welcome"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h1
            style={{
              textAlign: "center",
              fontSize: "2.5rem",
              marginTop: "2rem",
              marginBottom: "0.5rem",
              color: "rgb(var(--accent))",
              textShadow: "0 2px 8px rgba(var(--accent), 0.25)",
            }}
          >
            Cabinette Map
          </h1>
          <p
            style={{
              textAlign: "center",
              color: "rgb(215, 218, 223)",
              fontSize: "1.15rem",
              marginBottom: "1.5rem",
            }}
          >
            Explore and rank candidate cabin sites near U.S. National Parks &
            Monuments
          </p>
          <hr
            style={{
              border: "none",
              borderTop: "2px solid rgb(var(--accent))",
              width: "60%",
              margin: "0 auto 1.5rem auto",
            }}
          />
          <TourButton />

          <div
            style={{
              background:
                "linear-gradient(135deg, rgba(var(--dark),0.92) 60%, rgba(var(--accent),0.10) 100%)",
              borderRadius: "24px",
              boxShadow: "0 8px 32px 0 rgba(31,38,135,0.25)",
              border: "1.5px solid rgba(var(--accent),0.18)",
              padding: "2rem 2rem 2rem 2rem",
              width: "80vw",
              maxWidth: "1280px",
              margin: "3rem auto",
              backdropFilter: "blur(2px)",
            }}
          >
            <div style={{ width: "100%", maxWidth: "80vw", height: 600 }}>
              <FilteredMap
                scoredSites={scoredSites}
                selectedFeature={selectedFeature}
                setSelectedFeature={setSelectedFeature}
                themeRef={themeRef}
              />
            </div>
            <div
              data-tour="weights"
              style={{ width: "80vw", maxWidth: 1200, marginTop: 32 }}
            >
              <WeightsProxies
                demandWeight={demandWeight}
                setDemandWeight={setDemandWeight}
                competitionWeight={competitionWeight}
                setCompetitionWeight={setCompetitionWeight}
                proximityWeight={proximityWeight}
                setProximityWeight={setProximityWeight}
                accessibilityWeight={accessibilityWeight}
                setAccessibilityWeight={setAccessibilityWeight}
                demandProxy={demandProxy}
                setDemandProxy={setDemandProxy}
                demandMetric={demandMetric}
                setDemandMetric={setDemandMetric}
                competitionProxy={competitionProxy}
                setCompetitionProxy={setCompetitionProxy}
                proximityProxy={proximityProxy}
                setProximityProxy={setProximityProxy}
              />
            </div>
            <div data-tour="details">
              <div style={{ width: "80vw", maxWidth: 1200 }}>
                {
                  <TextDetails
                    selectedFeature={selectedFeature}
                    siteInfo={siteInfo}
                    vcInfo={vcInfo}
                    visitation={visitation}
                    score={selectedSiteScore}
                    competitionProxy={competitionProxy}
                    demandProxy={demandProxy}
                    demandMetric={demandMetric}
                    proximityProxy={proximityProxy}
                  />
                }
              </div>
              <div
                data-tour="details"
                ref={themeRef}
                className="plot-card"
                style={{ width: "80vw", maxWidth: 1200, height: 350 }}
              >
                <h2>
                  {selectedFeature?.type === "vc" &&
                    `Monthly Visitation for ${visitation.find((p) => p.unitcode === selectedFeature.id.toString().split("_")[0])?.parkname}`}
                  {selectedFeature?.type === "site" &&
                    `Candidate Site ${selectedFeature.id} Monthly Visitation for ${demandProxy}`}
                </h2>
                {selectedFeature?.type === "vc" && (
                  <VCVisitationPlot
                    visitation={visitation}
                    unitcode={selectedFeature.id.toString().split("_")[0]}
                    themeRef={themeRef}
                  />
                )}
                {selectedFeature?.type === "site" && (
                  <SiteGauges
                    siteRow={siteInfo.find((s) => s.id === selectedFeature.id)}
                    siteInfo={siteInfo}
                    demandProxy={demandProxy}
                    themeRef={themeRef}
                  />
                )}
              </div>
            </div>
          </div>
        </main>
      </TourProvider>
    </>
  );
}
