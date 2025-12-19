"use client";
import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
const DynamicMap = dynamic(() => import("./defaultmap"), { ssr: false });

type Park = { unitcode: string; parkname: string };

export default function FilteredMap() {
  const [parks, setParks] = useState<Park[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [mapUnitcodes, setMapUnitcodes] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/vc_info/unitcodes_names").then(r => r.json()).then(setParks);
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

  console.log("selected parks:", selected);
  console.log("mapUnitcodes:", mapUnitcodes);

    return (
    <div style={{ display: "flex", gap: 12 }}>
      <div style={{ width: 260 }}>
        <label style={{ display: "block", marginBottom: 8 }}>Filter sites by park name</label>
        <select
          multiple
          value={selected}
          onChange={handleChange}
          style={{ width: "100%", height: 160 }}
        >
          {parks.map(p => (
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
      </div>

      <div style={{ flex: 1, height: 600 }}>
        <DynamicMap key={unitcodesKey} unitcodes={mapUnitcodes} />

      </div>
    </div>
  );
}