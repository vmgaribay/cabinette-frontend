"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const DynamicMap = dynamic(() => import("./defaultmap"), { ssr: false });

export default function MapWithFilters() {
  const [unitcodes, setUnitcodes] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetch("/api/map/unitcodes").then(r => r.json()).then(setUnitcodes);
  }, []);

  return (
    <div style={{ display: "flex", gap: 12 }}>
      <div style={{ width: 220 }}>
        <label style={{ display: "block", marginBottom: 8 }}>Filter by park unitcode</label>
        <select
          value={selected ?? ""}
          onChange={e => setSelected(e.target.value || undefined)}
          style={{ width: "100%" }}
        >
          <option value="">All parks</option>
          {unitcodes.map(u => <option key={u} value={u}>{u}</option>)}
        </select>
      </div>

      <div style={{ flex: 1, height: 600 }}>
        <DynamicMap unitcode={selected} />
      </div>
    </div>
  );
}