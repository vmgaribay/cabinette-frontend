/**
 * RankingTable.tsx
 *
 * React component displaying a ranked table of sites by score.
 * - Shows site rank, ID, and score.
 * - Allows selection of a site.
 * - Highlights the selected site.
 * - Indicates if the table is filtered by visible parks.
 *
 * Props:
 * - scoredSites: Array of site information objects with scores.
 * - selectedFeature: Currently selected feature.
 * - setSelectedFeature: Callback to update selected feature.
 * - visibleSiteIds: Array of currently visible sites.
 */
import { FeatureSelection, SiteInfoRow } from "../types";

/**
 * RankingTable component displaying a ranked list of sites.
 * @param {Object} props
 * @param {Array<SiteInfoRow & {score: number}>} props.scoredSites - Array of site info objects with a score prop.
 * @param {FeatureSelection|null} props.selectedFeature - Currently selected feature.
 * @param {(feature: FeatureSelection|null) => void} props.setSelectedFeature - Callback to update selected feature.
 * @param {string[]} props.visibleSiteIds - Array of currently visible sites.
 * @returns {JSX.Element}
 */
export default function RankingTable({
  scoredSites,
  selectedFeature,
  setSelectedFeature,
  visibleSiteIds,
}: {
  scoredSites: (SiteInfoRow & { score: number })[];
  selectedFeature: FeatureSelection | null;
  setSelectedFeature: (feature: FeatureSelection | null) => void;
  visibleSiteIds: string[];
}) {
  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Top Sites by Score</h2>

      <table className="ranking-table">
        <thead>
          <tr>
            <th className="table-header">Rank*</th>
            <th className="table-header">Site ID</th>
            <th className="table-header">Score</th>
          </tr>
        </thead>
        <tbody>
          {scoredSites.map((site, idx) => (
            <tr
              key={site.id}
              className="table-row"
              style={{
                background:
                  selectedFeature?.type === "site" &&
                  selectedFeature.id === site.id
                    ? "rgba(215, 218, 223, 0.4)"
                    : undefined,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(143,178,248,0.08)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background =
                  selectedFeature?.type === "site" &&
                  selectedFeature.id === site.id
                    ? "rgba(215, 218, 223, 0.12)"
                    : "transparent")
              }
              onClick={() => setSelectedFeature({ type: "site", id: site.id })}
            >
              <td className="table-cell">{idx + 1}</td>
              <td className="table-cell">{site.id}</td>
              <td className="table-cell">{site.score.toFixed(3)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <span style={{ color: "rgb(215, 218, 223)" }}>
        {visibleSiteIds &&
        visibleSiteIds.length > 0 &&
        visibleSiteIds.length < scoredSites.length
          ? "*Filtered on Visible Parks"
          : "*Overall"}
      </span>
    </div>
  );
}
