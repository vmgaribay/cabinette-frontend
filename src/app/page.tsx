"use client";
import FilteredMap from "./components/filteredmap";

export default function Home() {
  return (
    <main style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h1>Cabinette Map</h1>
      <div style={{ width: "80vw", maxWidth: 1200, height: 600 }}>
        <FilteredMap />
      </div>
    </main>
  );
}