import { FeatureSelection } from "../types";

const demandProxies = [
  { label: "Proximate Parks", value: "Proximate Parks" },
  { label: "Nearest Park", value: "Nearest Park" },
];
const demandMetrics = [
  { label: "Minimum", value: "Minimum" },
  { label: "Maximum", value: "Maximum" },
  { label: "Average", value: "Average" },
];
const competitionProxies = [
  { label: "Lodging Near Site", value: "Lodging Near Site" },
  { label: "Lodging Near Proximate Parks", value: "Lodging Near Proximate Parks" },
];
const proximityProxies = [
  { label: "Avg. Distance to Proximate Parks", value: "Avg. Distance to Proximate Parks" },
  { label: "Distance to Nearest Park", value: "Distance to Nearest Park" },
];
const accessibilityProxies = [
  { label: "Distance to Nearest Road", value: "Distance to Nearest Road" },
];

export default function TopSites({
  scoredSites,
  selectedFeature,
  setSelectedFeature,
  demandWeight,
  setDemandWeight,
  competitionWeight,
  setCompetitionWeight,
  proximityWeight,
  setProximityWeight,
  accessibilityWeight,
  setAccessibilityWeight,
  demandProxy,
  setDemandProxy,
  demandMetric,
  setDemandMetric,
  competitionProxy,
  setCompetitionProxy,
  proximityProxy,
  setProximityProxy,
  siteInfo,
  visibleSiteIds,
}: {
  scoredSites: any[];
  selectedFeature: FeatureSelection | null;
  setSelectedFeature: (feature: FeatureSelection | null) => void;
  demandWeight: number;
  setDemandWeight: (v: number) => void;
  competitionWeight: number;
  setCompetitionWeight: (v: number) => void;
  proximityWeight: number;
  setProximityWeight: (v: number) => void;
  accessibilityWeight: number;
  setAccessibilityWeight: (v: number) => void;
  demandProxy: string;
  setDemandProxy: (v: string) => void;
  demandMetric: string;
  setDemandMetric: (v: string) => void;
  competitionProxy: string;
  setCompetitionProxy: (v: string) => void;
  proximityProxy: string;
  setProximityProxy: (v: string) => void;
  siteInfo: any[];
  visibleSiteIds: string[];
}) {

    

  return (
    <div>
    <h2>Adjustable Weights and Proxies</h2>
      <div>
        <label>Demand Weight: {demandWeight}</label>
        <input type="range" min={0} max={1} step={0.05} value={demandWeight} onChange={e => setDemandWeight(Number(e.target.value))} />
        <select value={demandProxy} onChange={e => setDemandProxy(e.target.value)}>
          {demandProxies.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        <select value={demandMetric} onChange={e => setDemandMetric(e.target.value)}>
          {demandMetrics.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>
      <div>
        <label>Competition Weight: {competitionWeight}</label>
        <input type="range" min={0} max={1} step={0.05} value={competitionWeight} onChange={e => setCompetitionWeight(Number(e.target.value))} />
        <select value={competitionProxy} onChange={e => setCompetitionProxy(e.target.value)}>
          {competitionProxies.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>
      <div>
        <label>Proximity Weight: {proximityWeight}</label>
        <input type="range" min={0} max={1} step={0.05} value={proximityWeight} onChange={e => setProximityWeight(Number(e.target.value))} />
        <select value={proximityProxy} onChange={e => setProximityProxy(e.target.value)}>
          {proximityProxies.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>
<div>
  <label>Accessibility Weight: {accessibilityWeight}</label>
  <input
    type="range"
    min={0}
    max={1}
    step={0.05}
    value={accessibilityWeight}
    onChange={e => setAccessibilityWeight(Number(e.target.value))}
  />
  <span style={{ marginLeft: 8 }}>
    {accessibilityProxies[0].label}
  </span>
</div>
<h1>
Top Sites by Score:{" "}
{visibleSiteIds && visibleSiteIds.length > 0 && visibleSiteIds.length < siteInfo.length
? "Filtered on Site Visibility": "Overall"}
</h1>
<table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
  <thead>
    <tr>
      <th style={{ border: "1px solid #ccc", padding: 4 }}>Rank</th>
      <th style={{ border: "1px solid #ccc", padding: 4 }}>Site ID</th>
      <th style={{ border: "1px solid #ccc", padding: 4 }}>Score</th>
    </tr>
  </thead>
  <tbody>
    {scoredSites.map((site, idx) => (
      <tr
  key={site.id}
  style={{
    background: selectedFeature?.type === "site" && selectedFeature.id === site.id ? "#ffe0b2" : undefined,
    cursor: "pointer"
  }}
    onClick={() => setSelectedFeature({ type: "site", id: site.id })}>
        <td style={{ border: "1px solid #ccc", padding: 4 }}>{idx + 1}</td>
        <td style={{ border: "1px solid #ccc", padding: 4 }}>{site.id}</td>
        <td style={{ border: "1px solid #ccc", padding: 4 }}>{site.score.toFixed(3)}</td>
      </tr>
    ))}
  </tbody>
</table>
    </div>
  );
}
