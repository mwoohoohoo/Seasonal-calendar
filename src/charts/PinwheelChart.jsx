import * as d3 from "d3";
import { getProduceImageByName } from "../../scripts/utils/imageHelpers";
import { useState, useMemo, useRef } from "react";
import { useDimensions } from "../use-dimensions";
import { Tooltip } from "./Tooltip";
import innercircle from "../assets/inner-circle.svg";

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

function renderLabel(label, x, y, textAnchor) {
  const words = label.split(" ");

  if (words.length === 1) {
    return (
      <text
        x={x}
        y={y}
        textAnchor={textAnchor}
        dominantBaseline="middle"
        fontSize={12}
      >
        {label}
      </text>
    );
  }

  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize={12}
    >
      {words.map((word, i) => (
        <tspan
          key={i}
          x={x}
          dy={i === 0 ? `${-(words.length - 1) * 0.6}em` : "1.2em"}
        >
          {word}
        </tspan>
      ))}
    </text>
  );
}

export const PinwheelChart = ({
  width,
  height,
  seasonalProduce,
  activeMonth,
  selectedMonth,
  setInteractionData,
  innerRadius,
  language,
  t,
  MONTHS,
  IMAGE_SIZE,
}) => {
  if (width === 0 || height === 0) {
    return null;
  }

  const [hoveredItem, setHoveredItem] = useState(null);

  const MARGIN = {
    left: language === "en" ? 288 : 340,
    right: language === "en" ? 288 : 340,
    top: 240,
    bottom: 240,
  };

  const boundsWidth = width - MARGIN.left - MARGIN.right;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const centreX = MARGIN.left + boundsWidth / 2;

  const centreY = MARGIN.top + boundsHeight / 2;

  const maxRadius = Math.min(boundsWidth, boundsHeight) / 2;

  const SHORT_TICK = 8;
  const LONG_TICK = language === "en" ? 140 : 164;

  const MONTH_IDS = [...Array(12).keys()];

  const barColour = (month) => {
    if ([11, 0, 1].includes(month)) {
      return "#0D3B66"; // Winter
    }

    if ([2, 3, 4].includes(month)) {
      return "#5C946E"; // Spring
    }

    if ([5, 6, 7].includes(month)) {
      return "#EDAE49"; // Summer
    }

    if ([8, 9, 10].includes(month)) {
      return "#F28482"; // Autumn
    }

    return "green";
  };

  const anglePerItem = (Math.PI * 2) / seasonalProduce.length;

  const concentricRingScale = d3
    .scaleBand()
    .domain(MONTH_IDS)
    .range([innerRadius, maxRadius])
    .padding(0);

  const concentricRingThickness = concentricRingScale.bandwidth();
  const rotation =
    -Math.atan2(8, maxRadius - innerRadius) * (180 / Math.PI) - 1;

  // CONCENTRIC RINGS */
  const allRings = MONTHS.map((month, i) => {
    return (
      <g key={i}>
        {selectedMonth !== "" && Number(selectedMonth) === i && (
          <circle
            r={
              concentricRingThickness * i +
              innerRadius +
              concentricRingThickness / 2
            }
            fill="none"
            stroke={barColour(i)}
            strokeOpacity={0.15}
            strokeWidth={concentricRingThickness}
          />
        )}
        <circle
          r={concentricRingThickness * i + innerRadius}
          cx={0}
          cy={0}
          fillOpacity={0}
          stroke="#EBE9EA"
          strokeWidth={1}
        />
        <text
          x={
            concentricRingThickness * i +
            innerRadius +
            concentricRingThickness / 2
          }
          y={-2}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={8}
          fontWeight={
            selectedMonth !== "" && Number(selectedMonth) === i ? 800 : 500
          }
          fill="#584c4e"
          fillOpacity={
            hoveredItem !== null
              ? 0
              : selectedMonth === ""
                ? 1
                : Number(selectedMonth) === i
                  ? 1
                  : 0.35
          }
          transform={`
    rotate(
      ${rotation}
    )
  `}
        >
          {month}
        </text>
      </g>
    );
  });

  // GRID LINES

  const gridLines = seasonalProduce.map((d, i) => {
    const lineAngle = i * anglePerItem - Math.PI / 2;

    const tickLength = i % 2 === 0 ? SHORT_TICK : LONG_TICK;

    const lineLength = maxRadius + tickLength;

    const xLine = Math.cos(lineAngle) * lineLength;

    const yLine = Math.sin(lineAngle) * lineLength;

    return (
      <line
        key={i}
        x1={0}
        y1={0}
        x2={xLine}
        y2={yLine}
        stroke="#EBE9EA"
        strokeWidth={1}
      />
    );
  });

  // LABELS, BARS AND IMAGES

  function isPeakActive(item, monthIndex) {
    if (monthIndex === null) {
      return true;
    }

    return item.peaks.some((peak) => {
      if (peak.endIndex >= peak.startIndex) {
        return monthIndex >= peak.startIndex && monthIndex <= peak.endIndex;
      }

      return monthIndex >= peak.startIndex || monthIndex <= peak.endIndex;
    });
  }

  const allData = seasonalProduce.map((d, i) => {
    const lineAngle = i * anglePerItem - Math.PI / 2;

    const tickLength = i % 2 === 0 ? SHORT_TICK : LONG_TICK;

    const lineLength = maxRadius + tickLength;

    const IMAGE_RADIUS = IMAGE_SIZE / 2;
    const IMAGE_GAP = 8;
    const LABEL_GAP = 16;

    const imageDistance = lineLength + IMAGE_GAP + IMAGE_RADIUS;

    const imageX = Math.cos(lineAngle) * imageDistance;

    const imageY = Math.sin(lineAngle) * imageDistance;

    const itemName = language === "en" ? d.name.en : d.name.nl;

    const wordCount = itemName.split(" ").length;

    const extraLabelOffset = Math.max(0, wordCount - 1) * 16;

    const horizontalFactor = Math.abs(Math.cos(lineAngle));

    const labelLengthOffset =
      language === "nl" && itemName.length > 10 ? -12 * horizontalFactor : 0;

    const labelDistance =
      imageDistance +
      IMAGE_RADIUS +
      LABEL_GAP +
      extraLabelOffset +
      labelLengthOffset;

    const labelX = Math.cos(lineAngle) * labelDistance;

    const labelY = Math.sin(lineAngle) * labelDistance;

    const cos = Math.cos(lineAngle);

    const textAnchor =
      Math.abs(cos) < 0.65 ? "middle" : cos > 0 ? "start" : "end";

    const rowColour = barColour(d.peaks[0]?.startIndex);

    // invisble hover wedge

    const hoverArc = d3.arc();

    const startAngle = lineAngle - anglePerItem / 2 + Math.PI / 2;

    const endAngle = lineAngle + anglePerItem / 2 + Math.PI / 2;

    const hoverPath = hoverArc({
      innerRadius: innerRadius,
      outerRadius: imageDistance + 100,
      startAngle,
      endAngle,
    });

    return (
      <g
        key={`${d.name.en}-${i}`}
        pointerEvents={
          activeMonth !== null && !isPeakActive(d, activeMonth) ? "none" : "all"
        }
        onMouseEnter={() => {
          setHoveredItem(itemName);
        }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.ownerSVGElement.getBoundingClientRect();

          setInteractionData({
            xPos: e.clientX - rect.left,
            yPos: e.clientY - rect.top,
            name: itemName,
            peaks: d.peaks,
            color: rowColour,
          });
        }}
        onMouseLeave={() => {
          (setHoveredItem(null), setInteractionData(null));
        }}
        opacity={
          hoveredItem === null
            ? isPeakActive(d, activeMonth)
              ? 1
              : 0.15
            : hoveredItem === itemName
              ? 1
              : 0.15
        }
      >
        {/* HOVER WEDGE */}
        <path d={hoverPath} fill="black" fillOpacity={0.001} />

        {/* DATA LINES */}
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
                  stroke={rowColour}
                  strokeWidth={2}
                />
              );
            },
          ),
        )}

        {/* LINE START-END POINTS */}
        {d.peaks.map((peak, peakIndex) => {
          const startRadius =
            innerRadius + peak.startIndex * concentricRingThickness;

          const endRadius =
            innerRadius + (peak.endIndex + 1) * concentricRingThickness;

          const startX = Math.cos(lineAngle) * startRadius;

          const startY = Math.sin(lineAngle) * startRadius;

          const endX = Math.cos(lineAngle) * endRadius;

          const endY = Math.sin(lineAngle) * endRadius;

          const isOuterRing = endRadius >= maxRadius - 1;

          const endLabelX = isOuterRing ? endX : endX > 0 ? endX + 8 : endX - 8;

          const endLabelY = isOuterRing
            ? endY > 0
              ? endY - 12
              : endY + 12
            : endY > 0
              ? endY - 8
              : endY + 8;

          const itemName = language === "en" ? d.name.en : d.name.nl;

          return (
            <g key={`markers-${peakIndex}`}>
              <circle cx={startX} cy={startY} r={3} fill={rowColour} />
              <text
                x={startX > 0 ? startX + 8 : startX - 8}
                y={startY > 0 ? startY - 8 : startY + 8}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={8}
                opacity={hoveredItem === itemName ? 1 : 0}
              >
                {t.start}
              </text>
              <circle cx={endX} cy={endY} r={3} fill={rowColour} />
              <text
                x={endLabelX}
                y={endLabelY}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={8}
                opacity={hoveredItem === itemName ? 1 : 0}
              >
                {t.end}
              </text>
            </g>
          );
        })}

        <g>
          {/* LABELS */}
          {renderLabel(itemName, labelX, labelY, textAnchor)}

          {/* IMAGES */}
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
      </g>
    );
  });

  return (
    <svg width={width} height={height} className="text-[var(--text-h)]">
      <g transform={`translate(${centreX}, ${centreY})`} className="container">
        {/* OUTERMOST RING */}
        <circle
          r={maxRadius}
          cx={0}
          cy={0}
          fillOpacity={0}
          stroke="#CFC7CA"
          strokeWidth={1}
        />
        {allRings}
        {gridLines}
        {allData}

        {/* INNER CIRCLE
        <circle r={innerRadius} cx={0} cy={0} fill="#E2E8EC" /> */}
        <image
          href={innercircle}
          x={0}
          y={0}
          width={innerRadius * 2}
          height={innerRadius * 2}
          transform={`
    translate(
      ${-innerRadius},
      ${-innerRadius}
    )`}
        />
      </g>
    </svg>
  );
};

export const ResponsivePinwheelChart = (props) => {
  const chartRef = useRef(null);
  const chartSize = useDimensions(chartRef);

  const [interactionData, setInteractionData] = useState(null);

  return (
    <div ref={chartRef} className="relative w-full aspect-square">
      <PinwheelChart
        height={chartSize.height}
        width={chartSize.width}
        setInteractionData={setInteractionData}
        {...props}
      />
      {/* TOOLTIP LAYER */}
      <div className="absolute inset-0 pointer-events-none">
        <Tooltip interactionData={interactionData} language={props.language} />
      </div>
    </div>
  );
};
