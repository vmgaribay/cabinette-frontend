"use client";
import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import RankingTable from "./RankingTable";
import { SiteInfoRow } from "../types";
const DynamicMap = dynamic(() => import("./DefaultMap"), { ssr: false });

type Park = { unitcode: string; parkname: string };

export default function FilteredMap({ sitesVisible, selectedFeature, setSelectedFeature,  scoredSites,
  siteInfo,
  visibleSiteIds,
}: {
  sitesVisible?: (ids: string[]) => void;
  selectedFeature: string | number | null;
  setSelectedFeature: (feature: string | number | null) => void;
  scoredSites: (SiteInfoRow & { score: number })[];
  siteInfo: SiteInfoRow[];
  visibleSiteIds: string[];}) {
  const [parks, setParks] = useState<Park[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [mapUnitcodes, setMapUnitcodes] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/map/unitcodes_names").then(r => r.json()).then(setParks);
  }, []);

   useEffect(() => {
    setMapUnitcodes(selected);
  }, [selected]);

const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
  const selectedOptions = Array.from(e.target.selectedOptions).map(opt => opt.value);
  setSelected(selectedOptions);
}, []);
    const handleClear = () => setSelected([]);

    const unitcodesKey = mapUnitcodes.join(",");

    return (
    <div style={{ display: "flex", gap: 12 }}>
      <div style={{ width: 280 }}>
        <label style={{ display: "block", marginBottom: 8 }}>Filter Site Visibility by Park/Monument:</label>
        <select
          multiple
          value={selected}
          onChange={handleChange}
          className="multi-select"
        >
        {[...parks]
          .sort((a, b) => a.parkname.localeCompare(b.parkname))
          .map(p => (
            <option key={p.unitcode} value={p.unitcode}>
              {p.parkname}
            </option>
        ))}
        </select>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
          <span style={{ fontSize: 12, color: "#666" }}>
            Hold Ctrl (Windows) or Cmd (Mac) to select multiple parks. Use button to clear selection.
          </span>
          <button
            type="button"
            onClick={handleClear}
            style={{
              fontSize: 12,
              padding: "2px 8px",
              background: "#eee",
              border: "1px solid #220c0cff",
              borderRadius: 4,
              cursor: "pointer"
            }}
          >
            Clear Filters
          </button>
                  </div>

          <RankingTable
          scoredSites={scoredSites}
          selectedFeature={selectedFeature}
          setSelectedFeature={setSelectedFeature}
          siteInfo={siteInfo}
          visibleSiteIds={visibleSiteIds}
        />
      </div>

      <div style={{ flex: 1, height: 600 }}>
        <DynamicMap  
          key={unitcodesKey}
          unitcodes={mapUnitcodes}
          sitesVisible={sitesVisible}
          selectedFeature={selectedFeature}
          setSelectedFeature={setSelectedFeature}
        />
      </div>
    </div>
  );
}