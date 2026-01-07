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
import ThemeToggle from "./components/ThemeToggle";
import WeightsProxies from "./components/WeightsProxies";
import FilteredMap from "./components/FilteredMap";
import TextDetails from "./components/TextDetails";
import VCVisitationPlot from "./components/VCPlot";
import SiteGauges from "./components/SiteGauges";
import {
  FeatureSelection,
  SiteInfoRow,
  VCInfoRow,
  VisitationRow,
} from "./types";

export default function Home() {
  const themeRef = useRef<HTMLDivElement>(null);

  const [siteInfo, setSiteInfo] = useState<SiteInfoRow[]>([]);
  const [vcInfo, setVCInfo] = useState<VCInfoRow[]>([]);
  const [visitation, setVisitation] = useState<VisitationRow[]>([]);
  const [visibleSiteIds, setVisibleSiteIds] = useState<string[]>([]);
  const [selectedFeature, setSelectedFeature] =
    useState<FeatureSelection | null>(null);

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
  const filteredScoredSites = useMemo(() => {
    const filtered =
      visibleSiteIds && visibleSiteIds.length > 0
        ? scoredSites.filter((site) => visibleSiteIds.includes(site.id))
        : scoredSites;
    return filtered.sort((a, b) => b.score - a.score).slice(0, 10);
  }, [scoredSites, visibleSiteIds]);

  const selectedSiteScore = useMemo(() => {
    if (selectedFeature?.type === "site") {
      const site = siteInfo.find((s) => s.id === selectedFeature.id);
      return site ? computeScore(site) : undefined;
    }
    return undefined;
  }, [selectedFeature, siteInfo, computeScore]);
  return (
    <>
      {<ThemeToggle />}
      <main
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
              sitesVisible={setVisibleSiteIds}
              selectedFeature={selectedFeature}
              setSelectedFeature={setSelectedFeature}
              scoredSites={filteredScoredSites}
              visibleSiteIds={visibleSiteIds}
              themeRef={themeRef}
            />
          </div>
          <div style={{ width: "80vw", maxWidth: 1200, marginTop: 32 }}>
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
      </main>
    </>
  );
}
