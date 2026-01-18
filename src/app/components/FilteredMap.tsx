/**
 * FilteredMap.tsx
 *
 * React component for filtering and features on an interactive map, also houses ranking table.
 * - Enables filtering site visibility by park/monument.
 * - Displays a multi-select dropdown for park selection.
 * - Renders a table of ranked sites.
 * - Renders a dynamic map with filtered features.
 *
 * Props:
 * - selectedFeature: Currently selected feature.
 * - setSelectedFeature: Callback to update selected feature.
 * - scoredSites: Array of site information objects with scores.
 */
"use client";
import { useEffect, useState, useCallback, useMemo, use } from "react";
import dynamic from "next/dynamic";
import RankingTable from "./RankingTable";
import BookmarksFilter from "./BookmarksFilter";
import { setShowBookmarkedOnly } from "../store/filterSlice";
import { setFilterUnitcodes } from "../store/filterSlice";
import { setUnitcodeFilteredSiteIDs } from "../store/filterSlice";

import { FeatureSelection, SiteInfoRow } from "../types";
const DynamicMap = dynamic(() => import("./DefaultMap"), { ssr: false });
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store/store";
import { getCSSVar } from "../utils/retrieveVar";

type Park = { unitcode: string; parkname: string };

/**
 * FilteredMap component for filtering the default map.
 * @param {Object} props
 * @param {FeatureSelection|null} props.selectedFeature - Currently selected feature.
 * @param {(feature: FeatureSelection|null) => void} props.setSelectedFeature - Callback to update selected feature.
 * @param {Array<SiteInfoRow & {score: number}>} props.scoredSites - Array of site info objects with score prop.
 * @param {React.RefObject<HTMLDivElement|null>} props.themeRef - Reference to themed div.
 * @returns {JSX.Element}
 */
export default function FilteredMap({
  selectedFeature,
  setSelectedFeature,
  scoredSites,
  themeRef,
}: {
  selectedFeature: FeatureSelection | null;
  setSelectedFeature: (feature: FeatureSelection | null) => void;
  scoredSites: (SiteInfoRow & { score: number })[];
  themeRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [parks, setParks] = useState<Park[]>([]);
  const filterUnitcodes = useSelector((state: RootState) => state.filter.filterUnitcodes);

  const scoreID = useMemo(() => {
    const map: Record<string, number> = {};
    scoredSites.forEach((site) => {
      map[site.id] = site.score;
    });
    return map;
  }, [scoredSites]);

  useEffect(() => {
    fetch("/api/map/unitcodes_names")
      .then((r) => r.json())
      .then(setParks);
  }, []);

  const dispatch = useDispatch();

  useEffect(() => {
  dispatch(setUnitcodeFilteredSiteIDs(
    scoredSites
      .filter(site => {
        if (filterUnitcodes.length === 0) return true;
        const siteUnitcodes = site.parks_within_30_mi_unitcodes
          ? site.parks_within_30_mi_unitcodes.split(",").map(s => s.trim())
          : [];
        return filterUnitcodes.some(code => siteUnitcodes.includes(code));
      })
      .map(site => site.id)
  ));
}, [filterUnitcodes, scoredSites, dispatch]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedOptions = Array.from(e.target.selectedOptions).map(
        (opt) => opt.value,
      );
      dispatch(setFilterUnitcodes(selectedOptions));
    }
  , [dispatch]);


  const currentTheme = useSelector((state: RootState) => state.theme.mode);

  const [colors, setColors] = useState({
    light: "",
    xlight: "",
    accent: "",
    dark: "",
  });

  useEffect(() => {
    if (themeRef.current) {
      setColors({
        light: getCSSVar("--light", themeRef.current),
        xlight: getCSSVar("--xlight", themeRef.current),
        accent: getCSSVar("--accent", themeRef.current),
        dark: getCSSVar("--dark", themeRef.current),
      });
    }
  }, [currentTheme, themeRef]);



  return (
    <div style={{ display: "flex", gap: 12 }}>
      <div style={{ width: 330 }}>
       
        <label className="multi-select-header" style={{ marginTop: 0 }}>
          Filter Site Visibility:
        </label>
        <BookmarksFilter
          themeRef={themeRef}
        />
        <select
          multiple
          value={filterUnitcodes}
          onChange={handleChange}
          className="multi-select"
          style={{ marginBottom: 4 }}
        >
          {[...parks]
            .sort((a, b) => a.parkname.localeCompare(b.parkname))
            .map((p) => (
              <option key={p.unitcode} value={p.unitcode}>
                {p.parkname}
              </option>
            ))}
        </select>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 4,
          }}
        >
          <span style={{ fontSize: 14, color: `rgb(${colors.light}, 0.8)` }}>
            Hold Ctrl (Windows) or Cmd (Mac) to choose multiple locations of
            interest.
          </span>
          <button
            type="button"
            onClick={() => {
              dispatch(setFilterUnitcodes([]));
              dispatch(setShowBookmarkedOnly(false));
            }}
            style={{
              fontSize: 12,
              color: `rgb(${colors.light})`,
              padding: "2px 8px",
              background: `rgba(${colors.xlight},0.1)`,
              border: `1px solid rgb(${colors.accent})`,
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Clear Filters
          </button>
        </div>

        <RankingTable
          scoredSites={scoredSites}
          selectedFeature={selectedFeature}
          setSelectedFeature={setSelectedFeature}
        />
      </div>

      <div
        style={{ flex: 1, height: 600, borderRadius: 16, overflow: "hidden" }}
      >
        {
          <DynamicMap
            scoreID={scoreID}
            selectedFeature={selectedFeature}
            setSelectedFeature={setSelectedFeature}
          />
        }
      </div>
    </div>
  );
}


