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
        visibleSiteIds.length < siteInfo.length
          ? "*Filtered on Visible Parks"
          : "*Overall"}
      </span>
    </div>
  );
}
