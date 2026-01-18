/**
 * SiteGauges.tsx
 *
 * React component for displaying gauge indicators of relative site visitation.
 * - Shows minimum, average, and maximum monthly visitation for a selected site.
 * - Compares selected site stats to the range across all sites.
 * - Supports switching between demand proxies (e.g., Proximate Parks, Nearest Park).
 *
 * Props:
 * - siteRow: Currently selected site info object.
 * - siteInfo: Array of all site info objects.
 * - demandProxy: String indicating which demand proxy is active.
 */
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { SiteInfoRow } from "../types";
import type { PlotParams } from "react-plotly.js";
import type { RefObject } from "react";
import { getCSSVar } from "../utils/retrieveVar";

const Plot = dynamic<PlotParams>(() => import("react-plotly.js"), {
  ssr: false,
});

/**
 * SiteGauges component displaying relative visitation for a selected site.
 * @param {Object} props
 * @param {SiteInfoRow} [props.siteRow] - Currently selected site info object.
 * @param {SiteInfoRow[]} props.siteInfo - Array of all site info objects.
 * @param {string} props.demandProxy - Currently active demand proxy.
 * @param {RefObject<HTMLDivElement|null>} props.themeRef - Reference to themed div.
 * @returns {JSX.Element}
 */
export default function SiteGauges({
  siteRow,
  siteInfo,
  demandProxy,
  themeRef,
}: {
  siteRow?: SiteInfoRow;
  siteInfo: SiteInfoRow[];
  demandProxy: string;
  themeRef: RefObject<HTMLDivElement | null>;
}) {
  let demandName = "";
  if (demandProxy === "Proximate Parks") {
    demandName = "combined";
  } else if (demandProxy === "Nearest Park") {
    demandName = "nearest_park";
  }
  const currentTheme = useSelector((state: RootState) => state.theme.mode);

  const [colors, setColors] = useState({
    light: "",
    xlight: "",
    dark: "",
  });

  useEffect(() => {
    if (themeRef.current) {
      setColors({
        light: getCSSVar("--light", themeRef.current),
        xlight: getCSSVar("--xlight", themeRef.current),
        dark: getCSSVar("--dark", themeRef.current),
      });
    }
  }, [currentTheme, themeRef]);
  
  if (!siteRow) return <h3>Select a Candidate Site for More Details.</h3>;

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
          title: { text: "Minimum", font: { color: `rgb(${colors.xlight})` } },
          number: { font: { color: `rgb(${colors.light})` } },
          gauge: {
            axis: {
              range: [minMin, maxMin],
              tickcolor: `rgb(${colors.light})`,
              tickfont: { color: `rgb(${colors.light})` },
            },
            bar: {
              color: "rgb(100, 200, 140)",
              line: { color: `rgb(${colors.dark})`, width: 0.3 },
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
          title: { text: "Average", font: { color: `rgb(${colors.xlight})` } },
          number: { font: { color: `rgb(${colors.light})` } },
          gauge: {
            axis: {
              range: [minAvg, maxAvg],
              tickcolor: `rgb(${colors.light})`,
              tickfont: { color: `rgb(${colors.light})` },
            },
            bar: {
              color: "rgb(100, 200, 140)",
              line: { color: `rgb(${colors.dark})`, width: 0.3 },
            },
            bgcolor: "lightgray",
            shape: "angular",
          },
          domain: { x: [0.27, 0.73], y: [0.05, 1] },
        },
        {
          type: "indicator",
          mode: "gauge+number",
          value: maxVal,
          title: { text: "Maximum", font: { color: `rgb(${colors.xlight})` } },
          number: { font: { color: `rgb(${colors.light})` } },
          gauge: {
            axis: {
              range: [minMax, maxMax],
              tickcolor: `rgb(${colors.light})`,
              tickfont: { color: `rgb(${colors.light})` },
            },
            bar: {
              color: "rgb(100, 200, 140)",
              line: { color: `rgb(${colors.dark})`, width: 0.3 },
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
