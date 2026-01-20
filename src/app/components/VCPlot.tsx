/**
 * VCPlot.tsx
 *
 * React component for displaying a line plot of monthly visitor center visitation.
 * - Plots minimum, average, and maximum recreation visits by month.
 * - Filters data for the selected visitor center by unit code.
 * - Uses Plotly for interactive data popups.
 *
 * Props:
 * - visitation: Array of visitation data objects.
 * - unitcode: Unit code for the visitor center to plot.
 */

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import type { RefObject } from "react";
import { VisitationRow } from "../types";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });
import { getCSSVar } from "../utils/retrieveVar";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * VCVisitationPlot component for plotting monthly visitation statistics.
 * @param {Object} props
 * @param {VisitationRow[]} props.visitation - Array of visitation data objects.
 * @param {string} props.unitcode - Unit code for the selected visitor center.
 * @returns {JSX.Element}
 */
export default function VCVisitationPlot({
  visitation,
  unitcode,
  themeRef,
}: {
  visitation: VisitationRow[];
  unitcode: string;
  themeRef: RefObject<HTMLDivElement | null>;
}) {
  const data = visitation
    .filter((v) => v.unitcode === unitcode)
    .sort((a, b) => Number(a.month) - Number(b.month));

  const months = data.map((d) => MONTHS[Number(d.month) - 1] || d.month);
  const minVisits = data.map((d) => d.min_recreation_visits);
  const avgVisits = data.map((d) => d.avg_recreation_visits);
  const maxVisits = data.map((d) => d.max_recreation_visits);

  const currentTheme = useSelector((state: RootState) => state.theme.mode);

  const [colors, setColors] = useState({
    light: "",
    accent: "",
  });

  useEffect(() => {
    if (themeRef.current) {
      setColors({
        light: getCSSVar("--light", themeRef.current),
        accent: getCSSVar("--accent", themeRef.current),
      });
    }
  }, [currentTheme, themeRef]);

  return (
    <Plot
      data={[
        {
          x: months,
          y: minVisits,
          type: "scatter",
          mode: "lines",
          name: "Minimum",
          line: { color: "rgb(245, 220, 100)" },
        },
        {
          x: months,
          y: avgVisits,
          type: "scatter",
          mode: "lines",
          name: "Average",
          line: { color: `rgb(${colors.accent})` },
        },
        {
          x: months,
          y: maxVisits,
          type: "scatter",
          mode: "lines",
          name: "Maximum",
          line: { color: "rgb(100, 200, 140)" },
        },
      ]}
      layout={{
        xaxis: {
          gridcolor: `rgba(${colors.light},0.25)`,
          title: {
            text: "Month",
            font: {
              family: "'Lucida Sans', 'Perpetua', serif",
              size: 16,
              color: `rgb(${colors.light})`,
            },
          },
          tickfont: {
            family: "'Lucida Sans', 'Perpetua', serif",
            color: `rgb(${colors.light})`,
          },
        },
        yaxis: {
          gridcolor: `rgba(${colors.light},0.25)`,
          title: {
            text: "Visits",
            font: {
              family: "'Lucida Sans', 'Perpetua', serif",
              size: 16,
              color: `rgb(${colors.light})`,
            },
          },
          tickfont: {
            family: "'Lucida Sans', 'Perpetua', serif",
            color: `rgb(${colors.light})`,
          },
        },
        legend: {
          orientation: "h",
          font: {
            family: "'Lucida Sans', 'Perpetua', serif",
            color: `rgb(${colors.light})`,
          },
        },
        paper_bgcolor: "transparent",
        plot_bgcolor: "transparent",
        margin: { t: 22, b: 40, l: 70, r: 40 },
      }}
      style={{ width: "100%", height: "78%" }}
    />
  );
}
