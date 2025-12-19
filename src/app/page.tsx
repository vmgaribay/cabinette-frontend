"use client";
import dynamic from "next/dynamic";
const DynamicMap = dynamic(() => import("./components/map"), { ssr: false });

export default function Home() {
  return (
    <main style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h1>Cabinette Map</h1>
      <div style={{ width: "80vw", maxWidth: 1200, height: 600 }}>
        <DynamicMap />
      </div>
    </main>
  );
}
