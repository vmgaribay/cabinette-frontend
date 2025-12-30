import { SiteInfoRow, VCInfoRow, VisitationRow } from "../types";

export default function TextDetails({
  selectedFeature,
  siteInfo,
  vcInfo,
  visitation,
  score,
  competitionProxy,
  demandProxy,
  demandMetric,
  proximityProxy,
}: {
  selectedFeature: { type: "site" | "vc"; id: string } | null;
  siteInfo: SiteInfoRow[];
  vcInfo: VCInfoRow[];
  visitation: VisitationRow[];
  score?: number;
  competitionProxy?: string;
  demandProxy?: string;
  demandMetric?: string;
  proximityProxy?: string;
}) {
  if (!selectedFeature) return <h3>Select a Visitor Center or Candidate Site for More Details.</h3>;

  // Fetch row data
  const siteRow = selectedFeature.type === "site"
    ? siteInfo.find(s => s.id === selectedFeature.id)
    : null;
  const vcRow = selectedFeature.type === "vc"
    ? vcInfo.find(vc => vc.id === selectedFeature.id)
    : null;

  // Visitor Center details
  let unitcode = null, parkname = null, buildingName= null, siteCount = null;
  if (selectedFeature.type === "vc" && selectedFeature.id) {
    unitcode = selectedFeature.id.split("_")[0];
    parkname = visitation.find(p => p.unitcode === unitcode)?.parkname;
    buildingName = vcRow?.visitor_center_name;
    siteCount = vcRow?.vc_site_count;
  }

  // Site details
  let lodgingLabel = "Lodging near Site";
  let lodgingValue = siteRow?.lodging_for_site;
  if (competitionProxy === "Lodging Near Proximate Parks") {
    lodgingLabel = "Lodging near Proximate Parks";
    lodgingValue = siteRow?.combined_lodging;
  }

  let visitationLabel = "Visitors to All Proximate Parks";
  let visitationValue = siteRow?.combined_overall_avg_monthly_visitation;
  if (demandProxy === "Nearest Park") {
    visitationLabel = "Visitors to Nearest Park";
    if (demandMetric === "Minimum") visitationValue = siteRow?.nearest_park_min_monthly_visitation;
    else if (demandMetric === "Maximum") visitationValue = siteRow?.nearest_park_max_monthly_visitation;
    else visitationValue = siteRow?.nearest_park_overall_avg_monthly_visitation;
  } else {
    if (demandMetric === "Minimum") visitationValue = siteRow?.combined_min_monthly_visitation;
    else if (demandMetric === "Maximum") visitationValue = siteRow?.combined_max_monthly_visitation;
    else visitationValue = siteRow?.combined_overall_avg_monthly_visitation;
  }

  let proximityLabel = "Average Distance to Proximate Parks";
  let proximityValueMi = siteRow?.combined_vc_distance_mi;
  let proximityValueKm = siteRow?.combined_vc_distance_km;
  if (proximityProxy === "Distance to Nearest Park") {
    proximityLabel = "Distance to Nearest Park";
    proximityValueMi = siteRow?.nearest_vc_distance_mi;
    proximityValueKm = siteRow?.nearest_vc_distance_km;
  }

  return (
    <div className="detail-card">
      {selectedFeature.type === "vc" && vcRow && (
        <>
          <h2><b>Visitor Center {selectedFeature.id} Details</b></h2>
          <div><b>Park or Monument Name:</b> {parkname ?? unitcode}</div>
          <div><b>NPS Building Name:</b> {buildingName}</div>
          <div><b>Number of Viable Sites:</b> {siteCount}</div>
        </>
      )}
      {selectedFeature.type === "site" && siteRow && (
        <>
          <h2><b>Candidate Site {selectedFeature.id} Details</b></h2>
          <div><b>Score:</b> {score !== undefined ? score.toFixed(3) : "N/A"}</div>
          <div><b>Proximate Park(s):</b> {siteRow.parks_within_30_mi_names}</div>
          <div><b>Distance to Road/Transportation:</b> {siteRow.nearest_road_distance_mi.toFixed(1)} mi | {siteRow.nearest_road_distance_km.toFixed(1)} km   <b>Type:</b> {siteRow.nearest_road_type}</div>
          <div><b>{lodgingLabel}:</b> {lodgingValue} Alternatives</div>
          <div><b>{visitationLabel}:</b>   {typeof visitationValue === "number"
    ? visitationValue.toLocaleString(undefined, { maximumFractionDigits: 0 })
    : !isNaN(Number(visitationValue))
      ? Number(visitationValue).toLocaleString(undefined, { maximumFractionDigits: 0 })
      : "N/A"}{" "} (Monthly {demandMetric}) </div>
          <div><b>{proximityLabel}:</b> {proximityValueMi.toFixed(1)} mi | {proximityValueKm.toFixed(1)} km</div>
        </>
      )}
    </div>
  );
}