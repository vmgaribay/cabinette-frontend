import dynamic from "next/dynamic";
import { SiteInfoRow } from "../types";
import type { PlotParams } from "react-plotly.js";
const Plot = dynamic<PlotParams>(() => import("react-plotly.js"), {
  ssr: false,
});

export default function SiteGauges({
  siteRow,
  siteInfo,
  demandProxy,
}: {
  siteRow?: SiteInfoRow;
  siteInfo: SiteInfoRow[];
  demandProxy: string;
}) {
  if (!siteRow) return <h3>Select a Candidate Site for More Details.</h3>;
  let demandName = "";
  if (demandProxy === "Proximate Parks") {
    demandName = "combined";
  } else if (demandProxy === "Nearest Park") {
    demandName = "nearest_park";
  }

  const minVal = siteRow[
    (demandName + "_min_monthly_visitation") as keyof SiteInfoRow
  ] as number;
  const avgVal = siteRow[
    (demandName + "_overall_avg_monthly_visitation") as keyof SiteInfoRow
  ] as number;
  const maxVal = siteRow[
    (demandName + "_max_monthly_visitation") as keyof SiteInfoRow
  ] as number;
  const minMin = Math.min(
    ...siteInfo.map(
      (s) =>
        s[
          (demandName + "_min_monthly_visitation") as keyof SiteInfoRow
        ] as number,
    ),
  );
  const maxMin = Math.max(
    ...siteInfo.map(
      (s) =>
        s[
          (demandName + "_min_monthly_visitation") as keyof SiteInfoRow
        ] as number,
    ),
  );
  const minMax = Math.min(
    ...siteInfo.map(
      (s) =>
        s[
          (demandName + "_max_monthly_visitation") as keyof SiteInfoRow
        ] as number,
    ),
  );
  const maxMax = Math.max(
    ...siteInfo.map(
      (s) =>
        s[
          (demandName + "_max_monthly_visitation") as keyof SiteInfoRow
        ] as number,
    ),
  );
  const minAvg = Math.min(
    ...siteInfo.map(
      (s) =>
        s[
          (demandName + "_overall_avg_monthly_visitation") as keyof SiteInfoRow
        ] as number,
    ),
  );
  const maxAvg = Math.max(
    ...siteInfo.map(
      (s) =>
        s[
          (demandName + "_overall_avg_monthly_visitation") as keyof SiteInfoRow
        ] as number,
    ),
  );

  return (
    <Plot
      data={[
        {
          type: "indicator",
          mode: "gauge+number",
          value: minVal,
          title: { text: "Minimum", font: { color: "rgb(215, 218, 223)" } },
          number: { font: { color: "rgb(154, 167, 193)" } },
          gauge: {
            axis: {
              range: [minMin, maxMin],
              tickcolor: "rgb(154, 167, 193)",
              tickfont: { color: "rgb(154, 167, 193)" },
            },
            bar: {
              color: "rgb(100, 200, 140)",
              line: { color: "rgb(24, 20, 27)", width: 1 },
            },
            bgcolor: "lightgray",
            shape: "angular",
          },
          domain: { x: [0, 0.22], y: [0.45, 0.95] },
        },
        {
          type: "indicator",
          mode: "gauge+number",
          value: avgVal,
          title: { text: "Average", font: { color: "rgb(215, 218, 223)" } },
          number: { font: { color: "rgb(154, 167, 193)" } },
          gauge: {
            axis: {
              range: [minAvg, maxAvg],
              tickcolor: "rgb(154, 167, 193)",
              tickfont: { color: "rgb(154, 167, 193)" },
            },
            bar: {
              color: "rgb(100, 200, 140)",
              line: { color: "rgb(24, 20, 27)", width: 1 },
            },
            bgcolor: "lightgray",
            shape: "angular",
          },
          domain: { x: [0.27, 0.73], y: [0, 1] },
        },
        {
          type: "indicator",
          mode: "gauge+number",
          value: maxVal,
          title: { text: "Maximum", font: { color: "rgb(215, 218, 223)" } },
          number: { font: { color: "rgb(154, 167, 193)" } },
          gauge: {
            axis: {
              range: [minMax, maxMax],
              tickcolor: "rgb(154, 167, 193)",
              tickfont: { color: "rgb(154, 167, 193)" },
            },
            bar: {
              color: "rgb(100, 200, 140)",
              line: { color: "rgb(24, 20, 27)", width: 1 },
            },
            bgcolor: "lightgray",
            shape: "angular",
          },
          domain: { x: [0.78, 1], y: [0.45, 0.95] },
        },
      ]}
      layout={{
        margin: { t: 50, b: 0, l: 72, r: 75 },
        paper_bgcolor: "transparent",
      }}
      style={{ width: "100%", height: "80%" }}
      useResizeHandler
    />
  );
}
