import dynamic from "next/dynamic";
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });
let demandName = "";

export default function SiteGauges({ siteRow, siteInfo, demandProxy }) {
  // values for the selected site
  if (demandProxy === "Proximate Parks") {
    demandName = "combined";
  } else if (demandProxy === "Nearest Park") {
    demandName = "nearest_park";
  }

  const minVal = siteRow[demandName + "_min_monthly_visitation"];
  const avgVal = siteRow[demandName + "_overall_avg_monthly_visitation"];
  const maxVal = siteRow[demandName + "_max_monthly_visitation"];
  // min/max for all sites for each metric
  const minRange = Math.min(...siteInfo.map(s => s[demandName + "_min_monthly_visitation"]));
  const maxRange = Math.max(...siteInfo.map(s => s[demandName + "_max_monthly_visitation"]));
  const avgRange = Math.max(...siteInfo.map(s => s[demandName + "_overall_avg_monthly_visitation"]));
  return (
    <div style={{ display: "flex", gap: 24 }}>
      <Plot
        data={[{
          type: "indicator",
          mode: "gauge+number",
          value: minVal,
          gauge: {
            axis: { range: [minRange, maxRange] },
            bar: { color: "green" },
            bgcolor: "lightgray",
            shape: "semi"
          },
          title: { text: "Minimum" }
        }]}
        layout={{ width: 200, height: 150, margin: { t: 0, b: 0 } }}
      />
      <Plot
        data={[{
          type: "indicator",
          mode: "gauge+number",
          value: avgVal,
          gauge: {
            axis: { range: [minRange, avgRange] },
            bar: { color: "green" },
            bgcolor: "lightgray",
            shape: "semi"
          },
          title: { text: "Average" }
        }]}
        layout={{ width: 200, height: 150, margin: { t: 0, b: 0 } }}
      />
      <Plot
        data={[{
          type: "indicator",
          mode: "gauge+number",
          value: maxVal,
          gauge: {
            axis: { range: [minRange, maxRange] },
            bar: { color: "green" },
            bgcolor: "lightgray",
            shape: "semi"
          },
          title: { text: "Maximum" }
        }]}
        layout={{ width: 200, height: 150, margin: { t: 0, b: 0 } }}
      />
    </div>
  );
}