import dynamic from "next/dynamic";
import { VisitationRow } from "../types";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

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

export default function VCVisitationPlot({
  visitation,
  unitcode,
}: {
  visitation: VisitationRow[];
  unitcode: string;
}) {
  const data = visitation
    .filter((v) => v.unitcode === unitcode)
    .sort((a, b) => Number(a.month) - Number(b.month));

  const months = data.map((d) => MONTHS[Number(d.month) - 1] || d.month);
  const minVisits = data.map((d) => d.min_recreation_visits);
  const avgVisits = data.map((d) => d.avg_recreation_visits);
  const maxVisits = data.map((d) => d.max_recreation_visits);

  return (
    <Plot
      data={[
        {
          x: months,
          y: minVisits,
          type: "scatter",
          mode: "lines",
          name: "Minimum",
          line: { color: "yellow" },
        },
        {
          x: months,
          y: avgVisits,
          type: "scatter",
          mode: "lines",
          name: "Average",
          line: { color: "blue" },
        },
        {
          x: months,
          y: maxVisits,
          type: "scatter",
          mode: "lines",
          name: "Maximum",
          line: { color: "green" },
        },
      ]}
      layout={{
        xaxis: {
          title: {
            text: "Month",
            font: {
              family: "'Lucida Sans', 'Perpetua', serif",
              size: 16,
              color: "rgb(154,167,193)",
            },
          },
          tickfont: {
            family: "'Lucida Sans', 'Perpetua', serif",
            color: "rgb(154,167,193)",
          },
        },
        yaxis: {
          title: {
            text: "Visits",
            font: {
              family: "'Lucida Sans', 'Perpetua', serif",
              size: 16,
              color: "rgb(154,167,193)",
            },
          },
          tickfont: {
            family: "'Lucida Sans', 'Perpetua', serif",
            color: "rgb(154,167,193)",
          },
        },
        legend: {
          orientation: "h",
          font: {
            family: "'Lucida Sans', 'Perpetua', serif",
            color: "rgb(154,167,193)",
          },
        },
        paper_bgcolor: "transparent",
        plot_bgcolor: "transparent",
        margin: { t: 22, b: 40, l: 70, r: 40 },
      }}
      style={{ width: "100%", height: "80%" }}
    />
  );
}
