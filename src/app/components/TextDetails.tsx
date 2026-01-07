/**
 * TextDetails.tsx
 *
 * React component with detailed information about the selected feature.
 * - Displays visitation, lodging, proximity, and/or score information.
 * - Supports interactive proxies.
 *
 * Props:
 * - selectedFeature: Currently selected feature.
 * - siteInfo: Array of site info objects.
 * - vcInfo: Array of visitor center info objects.
 * - visitation: Array of visitation data objects.
 * - score: Score for a selected site.
 * - competitionProxy: String indicating the active competition proxy.
 * - demandProxy: String indicating the active demand proxy.
 * - demandMetric: String indicating the active demand metric.
 * - proximityProxy: String indicating the active proximity proxy.
 */
"use client";
import {
  FeatureSelection,
  SiteInfoRow,
  VCInfoRow,
  VisitationRow,
} from "../types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { toggleBookmark } from "../store/bookmarksSlice";

/**
 * TextDetails component with details about the selected feature.
 * @param {Object} props
 * @param {FeatureSelection|null} props.selectedFeature - Currently selected feature.
 * @param {SiteInfoRow[]} props.siteInfo - Array of site info objects.
 * @param {VCInfoRow[]} props.vcInfo - Array of visitor center info objects.
 * @param {VisitationRow[]} props.visitation - Array of visitation data objects.
 * @param {number} [props.score] - (Optional) Score for the selected site.
 * @param {string} [props.competitionProxy] - (Optional) Competition proxy.
 * @param {string} [props.demandProxy] - (Optional) Demand proxy.
 * @param {string} [props.demandMetric] - (Optional) Demand metric.
 * @param {string} [props.proximityProxy] - (Optional) Proximity proxy.
 * @returns {JSX.Element}
 */
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
  selectedFeature: FeatureSelection | null;
  siteInfo: SiteInfoRow[];
  vcInfo: VCInfoRow[];
  visitation: VisitationRow[];
  score?: number;
  competitionProxy?: string;
  demandProxy?: string;
  demandMetric?: string;
  proximityProxy?: string;
}) {
  //Fetch bookmarks from Redux
  const dispatch = useDispatch();
  const bookmarkedSiteIds = useSelector(
    (state: RootState) => state.bookmarks.siteIds,
  );

  if (!selectedFeature)
    return <h3>Select a Visitor Center or Candidate Site for More Details.</h3>;

  // Fetch row data
  const siteRow =
    selectedFeature.type === "site"
      ? siteInfo.find((s) => s.id === selectedFeature.id)
      : null;
  const vcRow =
    selectedFeature.type === "vc"
      ? vcInfo.find((vc) => vc.id === selectedFeature.id)
      : null;

  // Visitor Center details
  let unitcode: string | null = null,
    parkname: string | null | undefined = null,
    buildingName: string | null | undefined = null,
    siteCount: number | null | undefined = null;
  if (selectedFeature.type === "vc" && selectedFeature.id) {
    unitcode = selectedFeature.id.toString().split("_")[0];
    parkname = visitation.find((p) => p.unitcode === unitcode)?.parkname;
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
    if (demandMetric === "Minimum")
      visitationValue = siteRow?.nearest_park_min_monthly_visitation;
    else if (demandMetric === "Maximum")
      visitationValue = siteRow?.nearest_park_max_monthly_visitation;
    else visitationValue = siteRow?.nearest_park_overall_avg_monthly_visitation;
  } else {
    if (demandMetric === "Minimum")
      visitationValue = siteRow?.combined_min_monthly_visitation;
    else if (demandMetric === "Maximum")
      visitationValue = siteRow?.combined_max_monthly_visitation;
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
    <div className="detail-card" style={{ position: "relative" }}>
      {selectedFeature.type === "vc" && vcRow && (
        <>
          <h2>
            <b>Visitor Center {selectedFeature.id} Details</b>
          </h2>
          <div>
            <b>Park or Monument Name:</b> {parkname ?? unitcode}
          </div>
          <div>
            <b>NPS Building Name:</b> {buildingName}
          </div>
          <div>
            <b>Number of Viable Sites:</b> {siteCount}
          </div>
        </>
      )}
      {selectedFeature.type === "site" && siteRow && (
        <>
          <div style={{ position: "absolute", top: -1, right: 50 }}>
            <button
              onClick={() =>
                dispatch(toggleBookmark(selectedFeature.id.toString()))
              }
              style={{
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                outline: "none",
              }}
              aria-label={
                bookmarkedSiteIds.includes(selectedFeature.id.toString())
                  ? "Remove Bookmark"
                  : "Add Bookmark"
              }
              title={
                bookmarkedSiteIds.includes(selectedFeature.id.toString())
                  ? "Remove Bookmark"
                  : "Add Bookmark"
              }
            >
              <svg
                width="40"
                height="80"
                viewBox="0 0 40 80"
                fill={
                  bookmarkedSiteIds.includes(selectedFeature.id.toString())
                    ? "rgba(var(--accent))"
                    : "none"
                }
                stroke="rgba(var(--accent))"
                strokeWidth="3"
                style={{ display: "block" }}
              >
                <path
                  d="M6 4h20a2 2 0 0 1 2 2v72l-12-8-12 8V6a2 2 0 0 1 2-2z"
                  transform="translate(0, -5)"
                  fill={
                    bookmarkedSiteIds.includes(selectedFeature.id.toString())
                      ? "rgba(var(--accent))"
                      : "none"
                  }
                  opacity={
                    bookmarkedSiteIds.includes(selectedFeature.id.toString())
                      ? 1
                      : 0.75
                  }
                />
              </svg>
            </button>
          </div>
          <h2>
            <b>Candidate Site {selectedFeature.id} Details</b>
          </h2>
          <div>
            <b>Score:</b> {score !== undefined ? score.toFixed(3) : "N/A"}
          </div>
          <div>
            <b>Proximate Park(s):</b> {siteRow.parks_within_30_mi_names}
          </div>
          <div>
            <b>Distance to Road/Transportation:</b>{" "}
            {siteRow.nearest_road_distance_mi.toFixed(1)} mi |{" "}
            {siteRow.nearest_road_distance_km.toFixed(1)} km <b>Type:</b>{" "}
            {siteRow.nearest_road_type}
          </div>
          <div>
            <b>{lodgingLabel}:</b> {lodgingValue} Alternatives
          </div>
          <div>
            <b>{visitationLabel}:</b>{" "}
            {typeof visitationValue === "number"
              ? visitationValue.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })
              : !isNaN(Number(visitationValue))
                ? Number(visitationValue).toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })
                : "N/A"}{" "}
            (Monthly {demandMetric}){" "}
          </div>
          <div>
            <b>{proximityLabel}:</b>{" "}
            {proximityValueMi !== undefined
              ? proximityValueMi.toFixed(1)
              : "N/A"}{" "}
            mi |{" "}
            {proximityValueKm !== undefined
              ? proximityValueKm.toFixed(1)
              : "N/A"}{" "}
            km
          </div>
        </>
      )}
    </div>
  );
}
