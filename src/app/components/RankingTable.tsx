import { FeatureSelection, SiteInfoRow } from "../types";

export default function RankingTable({
  scoredSites,
  selectedFeature,
  setSelectedFeature,
  siteInfo,
  visibleSiteIds,
}: {
  scoredSites: (SiteInfoRow & { score: number })[];
  selectedFeature: FeatureSelection | null;
  setSelectedFeature: (feature: FeatureSelection | null) => void;
  siteInfo: SiteInfoRow[];
  visibleSiteIds: string[];
}) {
  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Top Sites by Score</h2>

      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: -5 }}
      >
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
              style={{
                background:
                  selectedFeature?.type === "site" &&
                  selectedFeature.id === site.id
                    ? "rgba(215, 218, 223, 0.4)"
                    : undefined,
                cursor: "pointer",
              }}
              onClick={() => setSelectedFeature({ type: "site", id: site.id })}
            >
              <td style={{ border: "1px solid #ccc", padding: 4 }}>
                {idx + 1}
              </td>
              <td style={{ border: "1px solid #ccc", padding: 4 }}>
                {site.id}
              </td>
              <td style={{ border: "1px solid #ccc", padding: 4 }}>
                {site.score.toFixed(3)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <span style={{ color: "rgb(215, 218, 223)" }}>
        {visibleSiteIds &&
        visibleSiteIds.length > 0 &&
        visibleSiteIds.length < siteInfo.length
          ? "*Filtered on Visible Parks"
          : "*Overall"}
      </span>
    </div>
  );
}
