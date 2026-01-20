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
 */
import { FeatureSelection, SiteInfoRow } from "../types";
import { useDispatch, useSelector } from "react-redux";
import { toggleBookmark } from "../store/bookmarksSlice";
import { useMemo } from "react";
import type { RootState } from "../store/store";
import {
  HiArrowDownTray,
  HiArrowUpTray,
  HiOutlineBookmark,
} from "react-icons/hi2";

/**
 * RankingTable component displaying a ranked list of sites.
 * @param {Object} props
 * @param {Array<SiteInfoRow & {score: number}>} props.scoredSites - Array of site info objects with a score prop.
 * @param {FeatureSelection|null} props.selectedFeature - Currently selected feature.
 * @param {(feature: FeatureSelection|null) => void} props.setSelectedFeature - Callback to update selected feature.
 * @returns {JSX.Element}
 */
export default function RankingTable({
  scoredSites,
  visibleSiteIDs,
  selectedFeature,
  setSelectedFeature,
}: {
  scoredSites: (SiteInfoRow & { score: number })[];
  visibleSiteIDs: string[];
  selectedFeature: FeatureSelection | null;
  setSelectedFeature: (feature: FeatureSelection | null) => void;
}) {
  const dispatch = useDispatch();
  const bookmarkedSiteIds = useSelector(
    (state: RootState) => state.bookmarks.siteIds,
  );
  const showBookmarkedOnly = useSelector(
    (state: RootState) => state.filter.showBookmarkedOnly,
  );

  const visibleScoredSites = useMemo(() => {
    const filtered =
      visibleSiteIDs && visibleSiteIDs.length > 0
        ? scoredSites.filter((site) => visibleSiteIDs.includes(site.id))
        : scoredSites;
    return filtered.sort((a, b) => b.score - a.score).slice(0, 10);
  }, [scoredSites, visibleSiteIDs]);

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Top Sites by Score</h2>

      <table className="ranking-table">
        <thead>
          <tr>
            <th
              className="table-header"
              title="Bookmark"
              style={{ width: "16px", textAlign: "center" }}
            >
              <svg
                width="10"
                height="20"
                viewBox="0 0 20 24"
                fill="none"
                stroke="rgba(var(--xlight))"
                strokeWidth="4"
                style={{ verticalAlign: "middle" }}
              >
                <path d="M3 2h14a1 1 0 0 1 1 1v19l-8-5-8 5V3a1 1 0 0 1 1-1z" />
              </svg>
            </th>
            <th className="table-header">Rank*</th>
            <th className="table-header">Site ID</th>
            <th className="table-header">Score</th>
          </tr>
        </thead>
        <tbody>
          {bookmarkedSiteIds.length == 0 && showBookmarkedOnly ? (
            <tr>
              <td
                colSpan={4}
                style={{ textAlign: "center", color: "var(--accent)" }}
              >
                No known bookmarks. Click the bookmark icon next to sites or
                upload bookmarks with the <HiArrowDownTray />/<HiArrowUpTray />{" "}
                <HiOutlineBookmark /> Utilities button above.
              </td>
            </tr>
          ) : visibleSiteIDs.length == 0 && showBookmarkedOnly ? (
            <tr>
              <td
                colSpan={4}
                style={{ textAlign: "center", color: "var(--accent)" }}
              >
                No bookmarked sites match the current filter.
              </td>
            </tr>
          ) : (
            visibleScoredSites.map((site, idx) => (
              <tr
                key={site.id}
                className="table-row"
                style={{
                  background:
                    selectedFeature?.type === "site" &&
                    selectedFeature.id === site.id
                      ? "rgba(var(--xlight), 0.4)"
                      : undefined,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background =
                    "rgba(var(--accent), 0.08)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background =
                    selectedFeature?.type === "site" &&
                    selectedFeature.id === site.id
                      ? "rgba(var(--xlight), 0.12)"
                      : "transparent")
                }
                onClick={() =>
                  setSelectedFeature({ type: "site", id: site.id })
                }
              >
                <td className="table-cell" style={{ textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={bookmarkedSiteIds.includes(site.id.toString())}
                    onChange={() =>
                      dispatch(toggleBookmark(site.id.toString()))
                    }
                    style={{
                      opacity: bookmarkedSiteIds.includes(site.id.toString())
                        ? 0.9
                        : 0.3,
                      accentColor: "rgba(var(--light))",
                      cursor: "pointer",
                      width: "14px",
                      height: "14px",
                    }}
                    title={
                      bookmarkedSiteIds.includes(site.id.toString())
                        ? "Remove Bookmark"
                        : "Add Bookmark"
                    }
                  />
                </td>
                <td className="table-cell">{idx + 1}</td>
                <td className="table-cell">{site.id}</td>
                <td className="table-cell">{site.score.toFixed(3)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <span style={{ color: "rgb(var(--xlight))" }}>
        {visibleSiteIDs &&
        visibleSiteIDs.length > 0 &&
        visibleSiteIDs.length < scoredSites.length
          ? "*Filtered on Visible Parks"
          : "*Overall"}
      </span>
    </div>
  );
}
