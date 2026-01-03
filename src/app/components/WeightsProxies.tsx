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
  {
    label: "Lodging Near Proximate Parks",
    value: "Lodging Near Proximate Parks",
  },
];
const proximityProxies = [
  {
    label: "Avg. Distance to Proximate Parks",
    value: "Avg. Distance to Proximate Parks",
  },
  { label: "Distance to Nearest Park", value: "Distance to Nearest Park" },
];
const accessibilityProxies = [
  { label: "Distance to Nearest Road", value: "Distance to Nearest Road" },
];

export default function WeightsProxies({
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
}: {
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
}) {
  return (
    <div>
      <h2>Adjustable Weights and Proxies</h2>
      <div className="proxy-row">
        <label>Demand Weight: </label>
        <span>{demandWeight}</span>
        <input
          className="slider"
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={demandWeight}
          onChange={(e) => setDemandWeight(Number(e.target.value))}
        />
        <select
          className="drop-down"
          value={demandProxy}
          onChange={(e) => setDemandProxy(e.target.value)}
        >
          {demandProxies.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <select
          className="drop-down"
          value={demandMetric}
          onChange={(e) => setDemandMetric(e.target.value)}
        >
          {demandMetrics.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <div className="proxy-row">
        <label>Competition Weight: </label>
        <span>{competitionWeight}</span>
        <input
          className="slider"
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={competitionWeight}
          onChange={(e) => setCompetitionWeight(Number(e.target.value))}
        />
        <select
          className="drop-down"
          value={competitionProxy}
          onChange={(e) => setCompetitionProxy(e.target.value)}
        >
          {competitionProxies.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <div className="proxy-row">
        <label>Proximity Weight: </label>
        <span>{proximityWeight}</span>
        <input
          className="slider"
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={proximityWeight}
          onChange={(e) => setProximityWeight(Number(e.target.value))}
        />
        <select
          className="drop-down"
          value={proximityProxy}
          onChange={(e) => setProximityProxy(e.target.value)}
        >
          {proximityProxies.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <div className="proxy-row">
        <label>Accessibility Weight: </label>
        <span>{accessibilityWeight}</span>
        <input
          className="slider"
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={accessibilityWeight}
          onChange={(e) => setAccessibilityWeight(Number(e.target.value))}
        />
        <span
          style={{
            marginLeft: 8,
            fontFamily: "Lucida Sans, Perpetua, serif",
            fontSize: 13,
            paddingLeft: 11,
          }}
        >
          {accessibilityProxies[0].label}
        </span>
      </div>
    </div>
  );
}
