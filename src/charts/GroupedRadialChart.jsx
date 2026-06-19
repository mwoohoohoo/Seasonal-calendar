import * as d3 from "d3";
import { getAngles, MONTHS } from "../seasonMath";

const arcGenerator = d3.arc().cornerRadius(6);

export default function GroupedRadialChart({ data, width, height }) {
  const MARGIN = {
    left: 16,
    right: 16,
    top: 16,
    bottom: 16,
  };

  const labelSpace = 50;

  const boundsWidth = width - MARGIN.left - MARGIN.right;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const centreX = MARGIN.left + boundsWidth / 2;

  const centreY = MARGIN.top + boundsHeight / 2;

  const maxRadius = Math.min(boundsWidth, boundsHeight) / 2 - labelSpace;

  const items = data.map((d) => d.signature);

  const baseRadius = 20;
  const ringGap = 20;

  const thicknessScale = d3
    .scaleBand()
    .domain(items)
    .range([baseRadius, maxRadius])
    .padding(ringGap / 100);

  const ringThickness = thicknessScale.bandwidth();

  const lastItem = items[items.length - 1];

  const outermostRingRadius = (thicknessScale(lastItem) ?? 0) + ringThickness;

  const labelOffset = 20;

  const labelRadius = outermostRingRadius + labelOffset;

  const anglePerMonth = (Math.PI * 2) / 12;

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${centreX}, ${centreY})`}>
        {MONTHS.map((month, i) => {
          const lineAngle = i * ((Math.PI * 2) / 12) - Math.PI / 2;

          const textAngle = i * anglePerMonth - Math.PI / 2 + anglePerMonth / 2;

          const x = Math.cos(textAngle) * labelRadius;

          const y = Math.sin(textAngle) * labelRadius;

          const xLine = Math.cos(lineAngle) * (outermostRingRadius + 4);

          const yLine = Math.sin(lineAngle) * (outermostRingRadius + 4);

          return (
            <g key={month}>
              <line
                x1={0}
                y1={0}
                x2={xLine}
                y2={yLine}
                stroke="#CCCCCC"
                strokeWidth={2}
                strokeDasharray={"2,10"}
              />
              <text
                key={month}
                x={x}
                y={y}
                textAnchor={"middle"}
                dominantBaseline="middle"
                fontSize={12}
              >
                {month.slice(0, 3)}
              </text>
            </g>
          );
        })}

        {/* ITEM RINGS */}

        {data.map((item, i) => {
          const innerRadius = thicknessScale(item.signature) ?? 0;

          const outerRadius = innerRadius + ringThickness;

          // AVAILABILITY ARC

          const availabilityAngles = getAngles(
            item.availability.start,
            item.availability.end,
          );

          const availabilityPath = arcGenerator({
            innerRadius,
            outerRadius,
            ...availabilityAngles,
          });

          return (
            <g key={item.signature}>
              {/* BACKGROUND AVAILABILITY */}

              <path d={availabilityPath} fill="green" opacity={0.25} />

              {/* PEAKS */}

              {item.peaks.map((peak, peakIndex) => {
                const peakAngles = getAngles(peak.start, peak.end);

                const peakPath = arcGenerator({
                  innerRadius,
                  outerRadius,
                  ...peakAngles,
                });

                return (
                  <path
                    key={`${item.signature}-${peakIndex}`}
                    d={peakPath}
                    fill="green"
                    opacity={0.9}
                  />
                );
              })}
            </g>
          );
        })}
      </g>
    </svg>
  );
}
