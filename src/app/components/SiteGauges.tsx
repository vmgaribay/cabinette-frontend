import dynamic from "next/dynamic";
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export default function SiteGauges({ siteRow, siteInfo, demandProxy }) {
  let demandName = "";
  if (demandProxy === "Proximate Parks") {
    demandName = "combined";
  } else if (demandProxy === "Nearest Park") {
    demandName = "nearest_park";
  }

  const minVal = siteRow[demandName + "_min_monthly_visitation"];
  const avgVal = siteRow[demandName + "_overall_avg_monthly_visitation"];
  const maxVal = siteRow[demandName + "_max_monthly_visitation"];
  const minRange = Math.min(...siteInfo.map(s => s[demandName + "_min_monthly_visitation"]));
  const maxRange = Math.max(...siteInfo.map(s => s[demandName + "_max_monthly_visitation"]));
  const avgRange = Math.max(...siteInfo.map(s => s[demandName + "_overall_avg_monthly_visitation"]));

  return (
    <Plot
      data={[
        {
          type: "indicator",
          mode: "gauge+number",
          value: minVal,
          title: { text: "Minimum" },
          gauge: {
            axis: { range: [minRange, maxRange] },
            bar: { color: "green" },
            bgcolor: "lightgray",
            shape: "semi"
          },
          domain: { x: [0, 0.22], y: [0.45, 0.95] }
        },
        {
          type: "indicator",
          mode: "gauge+number",
          value: avgVal,
          title: { text: "Average" },
          gauge: {
            axis: { range: [minRange, avgRange] },
            bar: { color: "green" },
            bgcolor: "lightgray",
            shape: "semi"
          },
          domain: { x: [0.27, 0.73], y: [0, 1] } 
        },
        {
          type: "indicator",
          mode: "gauge+number",
          value: maxVal,
          title: { text: "Maximum" },
          gauge: {
            axis: { range: [minRange, maxRange] },
            bar: { color: "green" },
            bgcolor: "lightgray",
            shape: "semi"
          },
          domain: { x: [0.78, 1], y: [0.45, 0.95] }
        }
      ]}
      layout={{
        margin: { t: 50, b: 0, l: 72, r: 75 },
        paper_bgcolor: "transparent"
      }}
      style={{ width: "100%", height: "80%" }}
      useResizeHandler
    />
  );
}