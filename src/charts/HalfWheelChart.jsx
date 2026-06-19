import * as d3 from "d3";
import { getProduceImageByName } from "../scripts/utils/imageHelpers";

function getWrappedIntervals(startIndex, endIndex) {
  // Normal interval

  if (endIndex >= startIndex) {
    return [
      {
        start: startIndex,
        end: endIndex,
      },
    ];
  }

  // Wrapped interval

  return [
    {
      start: startIndex,
      end: 11,
    },
    {
      start: 0,
      end: endIndex,
    },
  ];
}

function describeSemiCircle(radius) {
  return `
    M 0 ${-radius}
    A ${radius} ${radius} 0 0 1 0 ${radius}
  `;
}

function describeClosedSemiCircle(radius) {
  return `
    M 0 ${-radius}
    A ${radius} ${radius} 0 0 1 0 ${radius}
    L 0 ${-radius}
  `;
}

export default function HalfWheelChart({ width, height, data }) {
  const MARGIN = {
    left: 80,
    right: 160,
    top: 200,
    bottom: 200,
  };

  const boundsWidth = width - MARGIN.left - MARGIN.right;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const centreX = MARGIN.left;

  const centreY = MARGIN.top + boundsHeight / 2;

  const innerRadius = 120;

  const labelRadius = 24;

  const tickLength = 16;

  const maxRadius = boundsHeight / 2 - 120;

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

  // produce available all year sorted alphabetically
  const alwaysAvailableProduce = [...data]
    .filter(
      (d) => d.peaks[0].start === "January" && d.peaks[0].end === "January",
    )
    .sort((a, b) => {
      const aLabel = a.name.en;

      const bLabel = b.name.en;

      return aLabel.localeCompare(bLabel);
    });

  const seasonalProduce = [...data]
    .filter((d) => !alwaysAvailableProduce.includes(d))
    .sort((a, b) => {
      const aLabel = a.name.en;

      const bLabel = b.name.en;

      return aLabel.localeCompare(bLabel);
    });

  const anglePerItem = Math.PI / (seasonalProduce.length - 1);

  const outermostRadius = maxRadius + labelRadius;

  const concentricRingScale = d3
    .scaleBand()
    .domain(MONTHS)
    .range([innerRadius, maxRadius])
    .padding(0);

  const concentricRingThickness = concentricRingScale.bandwidth();

  // CONCENTRIC RINGS */
  const allRings = MONTHS.map((month, i) => {
    return (
      <g key={i}>
        <path
          d={describeSemiCircle(concentricRingThickness * i + innerRadius)}
          fill="none"
          stroke="#CCCCCC"
          strokeWidth={2}
        />
        <text
          x={
            concentricRingThickness * i +
            innerRadius +
            concentricRingThickness / 2
          }
          y={4}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={8}
        >
          {month}
        </text>
      </g>
    );
  });

  // LABELS, BARS, DOTTED LINES AND IMAGES

  const allData = seasonalProduce.map((d, i) => {
    const lineAngle = i * anglePerItem - Math.PI / 2;

    const SHORT_TICK = 16;
    const LONG_TICK = 160;

    const tickLength = i % 2 === 0 ? SHORT_TICK : LONG_TICK;

    const lineLength = maxRadius + tickLength;

    const IMAGE_SIZE = 64;
    const IMAGE_RADIUS = IMAGE_SIZE / 2;
    const IMAGE_GAP = 8;

    const imageDistance = lineLength + IMAGE_GAP + IMAGE_RADIUS;

    const labelDistance = imageDistance + IMAGE_RADIUS + 8;

    const xLine = Math.cos(lineAngle) * lineLength;

    const yLine = Math.sin(lineAngle) * lineLength;

    const x = Math.cos(lineAngle) * labelDistance;

    const y = Math.sin(lineAngle) * labelDistance;

    const imageX = Math.cos(lineAngle) * imageDistance;

    const imageY = Math.sin(lineAngle) * imageDistance;

    const labelX = Math.cos(lineAngle) * labelDistance;

    const labelY = Math.sin(lineAngle) * labelDistance;
    const rotation = (lineAngle * 180) / Math.PI;

    return (
      <g key={i}>
        {/* GRID LINES */}
        <line
          x1={0}
          y1={0}
          x2={xLine}
          y2={yLine}
          stroke="#CCCCCC"
          strokeWidth={2}
          strokeDasharray={"2,6"}
        />

        {d.peaks.flatMap((peak, peakIndex) =>
          getWrappedIntervals(peak.startIndex, peak.endIndex).map(
            (interval, intervalIndex) => {
              const startX =
                Math.cos(lineAngle) *
                (innerRadius + interval.start * concentricRingThickness);

              const endX =
                Math.cos(lineAngle) *
                (innerRadius + (interval.end + 1) * concentricRingThickness);

              const startY =
                Math.sin(lineAngle) *
                (innerRadius + interval.start * concentricRingThickness);

              const endY =
                Math.sin(lineAngle) *
                (innerRadius + (interval.end + 1) * concentricRingThickness);

              return (
                <line
                  key={`peak-${peakIndex}-${intervalIndex}`}
                  x1={startX}
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  stroke="red"
                  strokeWidth={2}
                />
              );
            },
          ),
        )}

        <text
          x={labelX}
          y={labelY}
          textAnchor="middle"
          dominantBaseline="middle"
          transform={`
    rotate(
      ${rotation},
      ${labelX},
      ${labelY}
    )
  `}
          fontSize={12}
        >
          {d.name.en}
        </text>
        <image
          href={getProduceImageByName(d.name.en)}
          x={-IMAGE_RADIUS}
          y={-IMAGE_RADIUS}
          width={IMAGE_SIZE}
          height={IMAGE_SIZE}
          transform={`
    translate(
      ${imageX},
      ${imageY}
    )`}
        />
      </g>
    );
  });

  return (
    <svg width={width} height={height}>
      <rect
        width={width}
        height={height}
        fill="none"
        strokeWidth={2}
        stroke="green"
      />
      <g transform={`translate(${centreX}, ${centreY})`}>
        {allRings}

        {allData}

        {/* OUTERMOST RING */}
        <path
          d={describeSemiCircle(maxRadius)}
          fill="none"
          stroke="blue"
          strokeWidth={2}
        />

        {/* INNER CIRCLE */}

        <path
          d={describeClosedSemiCircle(innerRadius)}
          fill="white"
          stroke="green"
          strokeWidth={2}
        />
      </g>
    </svg>
  );
}
