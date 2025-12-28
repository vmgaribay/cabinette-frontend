"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import TopSites from "./components/topsites";
import FilteredMap from "./components/filteredmap";
import TextDetails from "./components/textdetails";
import VCVisitationPlot from "./components/vcplot";
import SiteGauges from "./components/sitegauges";
import { FeatureSelection } from "./types";


export default function Home() {
  const [siteInfo, setSiteInfo] = useState<any[]>([]);
  const [vcInfo, setVCInfo] = useState<any[]>([]);
  const [visitation, setVisitation] = useState<any[]>([]);
  const [visibleSiteIds, setVisibleSiteIds] = useState<string[]>([]);
  const [selectedFeature, setSelectedFeature] = useState<FeatureSelection | null>(null);

  // Weights
  const [demandWeight, setDemandWeight] = useState(0.5);
  const [competitionWeight, setCompetitionWeight] = useState(0.5);
  const [proximityWeight, setProximityWeight] = useState(0.5);
  const [accessibilityWeight, setAccessibilityWeight] = useState(0.5);

  // Proxies/Metrics
  const [demandProxy, setDemandProxy] = useState("Proximate Parks");
  const [demandMetric, setDemandMetric] = useState("Average");
  const [competitionProxy, setCompetitionProxy] = useState("Lodging Near Site");
  const [proximityProxy, setProximityProxy] = useState("Avg. Distance to Proximate Parks");


  useEffect(() => {
    fetch("/api/details/site_info")
      .then(res => res.json())
      .then(data => setSiteInfo(Array.isArray(data) ? data : []));  }, []);
  useEffect(() => {
    fetch("/api/details/vc_info")
      .then(res => res.json())
      .then(data => setVCInfo(Array.isArray(data) ? data : []));
  }, []);
  useEffect(() => {
    fetch("/api/details/visitation")
      .then(res => res.json())
      .then(data => setVisitation(Array.isArray(data) ? data : []));
  }, []);


  function getDemandCol(site) {
    if (demandProxy === "Proximate Parks") {
      if (demandMetric === "Minimum") return site["combined_min_monthly_visitation_norm"];
      if (demandMetric === "Maximum") return site["combined_max_monthly_visitation_norm"];
      if (demandMetric === "Average") return site["combined_overall_avg_monthly_visitation_norm"];
    }
    if (demandProxy === "Nearest Park") {
      if (demandMetric === "Minimum") return site["nearest_park_min_monthly_visitation_norm"];
      if (demandMetric === "Maximum") return site["nearest_park_max_monthly_visitation_norm"];
      if (demandMetric === "Average") return site["nearest_park_overall_avg_monthly_visitation_norm"];
    }
    return 0;
  }

  function getCompetitionCol(site) {
    if (competitionProxy === "Lodging Near Site") return site["lodging_for_site_norm"];
    if (competitionProxy === "Lodging Near Proximate Parks") return site["combined_lodging_norm"];
    return 0;
  }

  function getProximityCol(site) {
    if (proximityProxy === "Avg. Distance to Proximate Parks") return site["combined_vc_distance_norm"];
    if (proximityProxy === "Distance to Nearest Park") return site["nearest_vc_distance_norm"];
    return 0;
  }

  function getAccessibilityCol(site) {
    return site["nearest_road_distance_norm"];
  }

  const computeScore = useCallback((site: any) => {
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
  }, [
    demandWeight, competitionWeight, proximityWeight, accessibilityWeight,
    getDemandCol, getCompetitionCol, getProximityCol, getAccessibilityCol
  ]);
  
// Compute site scores, filter to match visibility/selection
  const scoredSites = useMemo(() =>
  siteInfo.map(site => ({ ...site, score: computeScore(site) })),
  [siteInfo, computeScore]
);
  const filteredScoredSites = useMemo(() => {
    const filtered = visibleSiteIds && visibleSiteIds.length > 0
      ? siteInfo.filter(site => visibleSiteIds.includes(site.id))
      : siteInfo;
    return filtered
      .map(site => ({ ...site, score: computeScore(site) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }, [siteInfo, visibleSiteIds, computeScore]);

  const selectedSiteScore = useMemo(() => {
    if (selectedFeature?.type === "site") {
      const site = siteInfo.find(s => s.id === selectedFeature.id);
      return site ? computeScore(site) : undefined;
    }
    return undefined;
  }, [selectedFeature, siteInfo, computeScore]);

  return (
    <main style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h1>Cabinette Map</h1>
      <div style={{ width: "80vw", maxWidth: 1200, height: 600 }}>
        <FilteredMap 
          sitesVisible={setVisibleSiteIds} 
          selectedFeature={selectedFeature} 
          setSelectedFeature={setSelectedFeature} />
      </div>
      <div style={{ width: "80vw", maxWidth: 1200, marginTop: 32 }}>
        <TopSites siteInfo={siteInfo}
          visibleSiteIds={visibleSiteIds} 
          selectedFeature={selectedFeature} 
          setSelectedFeature={setSelectedFeature}
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
          scoredSites={filteredScoredSites}
        />
      </div>
      <div style={{ width: "80vw", maxWidth: 1200, marginTop: 32, marginBottom: 32 }}>
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
    </div>
    <div style={{ width: "80vw", maxWidth: 1200, marginTop: 32 }}>
      {selectedFeature?.type === "vc" && (
        <VCVisitationPlot  
          visitation={visitation}
          unitcode={selectedFeature.id.split("_")[0]}
        />
      )}
      {selectedFeature?.type === "site" && (
        <SiteGauges
         siteRow={siteInfo.find(s => s.id === selectedFeature.id)}
         siteInfo={siteInfo}
         demandProxy={demandProxy}
        />
      )}
    </div>
  </main>
  );
}