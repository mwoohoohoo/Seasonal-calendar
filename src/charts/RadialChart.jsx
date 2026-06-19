import * as d3 from "d3";
import { getAngles, MONTHS, getAnglesFromIndices } from "./seasonMath";

export default function RadialChart({ data, width, height }) {
  const arcGenerator = d3.arc().cornerRadius(6);
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

  const MAX_RINGS = 11;

  const baseRadius = 20;
  const ringGap = 10;

  const thicknessScale = d3
    .scaleBand()
    .domain(Array.from({ length: MAX_RINGS }, (_, i) => i))
    .range([baseRadius, maxRadius])
    .padding(ringGap / 100);

  const ringThickness = thicknessScale.bandwidth();

  const outermostRingRadius =
    (thicknessScale(MAX_RINGS - 1) ?? 0) + ringThickness;

  const labelOffset = 20;

  const labelRadius = outermostRingRadius + labelOffset;

  const anglePerMonth = (Math.PI * 2) / 12;

  const seasonColour = (monthIndex) => {
    if ([11, 0, 1].includes(monthIndex)) {
      return "#0D3B66";
    }

    if ([2, 3, 4].includes(monthIndex)) {
      return "#5C946E";
    }

    if ([5, 6, 7].includes(monthIndex)) {
      return "#EDAE49";
    }

    return "#F28482";
  };

  const highlightedMonth = data[0]?.peaks[0]?.startIndex;

  return (
    <svg width={width} height={height}>
      {/* LABELS AND DOTTED LINES */}
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
                fontWeight={i === highlightedMonth ? 700 : 500}
                opacity={i === highlightedMonth ? 1 : 0.4}
              >
                {month.slice(0, 3)}
              </text>
            </g>
          );
        })}

        {/* ITEM RINGS */}
        {data.map((item, i) => {
          const label = item.items.map((d) => d.en).join(", ");

          const innerRadius = thicknessScale(i) ?? 0;

          const outerRadius = innerRadius + ringThickness;

          // AVAILABILITY ARC

          const availabilityAngles = getAnglesFromIndices(
            item.availability.startIndex,
            item.availability.endIndex,
          );

          // BAR LABELS

          const centreAngle =
            (availabilityAngles.startAngle + availabilityAngles.endAngle) / 2;

          const textRadius = innerRadius + ringThickness / 2;

          const textX = Math.cos(centreAngle) * textRadius;

          const textY = Math.sin(centreAngle) * textRadius;

          const availabilityPath = arcGenerator({
            innerRadius,
            outerRadius,
            ...availabilityAngles,
          });

          const rowColour = seasonColour(item.peaks[0].startIndex);

          return (
            <g key={item.signature}>
              {/* BACKGROUND AVAILABILITY */}

              <path d={availabilityPath} fill={rowColour} opacity={0.25} />

              {/* PEAKS */}

              {item.peaks.map((peak, peakIndex) => {
                const peakAngles = getAnglesFromIndices(
                  peak.startIndex,
                  peak.endIndex,
                );

                const span = peakAngles.endAngle - peakAngles.startAngle;

                if (Math.abs(span - Math.PI) < 0.0001) {
                  peakAngles.endAngle -= 0.001;
                }

                const peakPath = arcGenerator({
                  innerRadius,
                  outerRadius,
                  ...peakAngles,
                });

                return (
                  <path
                    key={`${item.signature}-${peakIndex}`}
                    d={peakPath}
                    fill={rowColour}
                  />
                );
              })}

              <text
                x={textX}
                y={textY}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={10}
                fill="black"
              >
                {label}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
