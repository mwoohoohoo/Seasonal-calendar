import * as d3 from "d3";
import { useState, useEffect, useRef } from "react";
import { useDimensions } from "../use-dimensions";
import { AxisHorizontal } from "./AxisHorizontal";
import { AxisTopOnly } from "./AxisTopOnly";
import { Tooltip } from "./Tooltip";
import { getProduceImageByName } from "../../scripts/utils/imageHelpers";

const getChartMargin = (language, isMobile) => ({
  top: 20,
  right: 0,
  bottom: 20,
  left: language === "en" ? (isMobile ? 168 : 228) : isMobile ? 132 : 180,
});

function getWrappedIntervals(startIndex, endIndex) {
  if (endIndex >= startIndex) {
    return [
      {
        start: startIndex,
        end: endIndex,
      },
    ];
  }

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

export const HorizontalBarChart = ({
  width,
  height,
  setInteractionData,
  seasonalProduce,
  activeMonth,
  language,
  isMobile,
  disableHover,
  IMAGE_SIZE,
  TICK_LENGTH,
}) => {
  if (width === 0 || height === 0) {
    return null;
  }

  const [hoveredItem, setHoveredItem] = useState(null);

  const MARGIN = getChartMargin(language, isMobile);

  const boundsWidth = width - MARGIN.left - MARGIN.right;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const IMAGE_RADIUS = IMAGE_SIZE / 2;

  const sortedProduce = [...seasonalProduce].sort((a, b) =>
    language === "en"
      ? a.name.en.localeCompare(b.name.en)
      : a.name.nl.localeCompare(b.name.nl),
  );

  const yScale = d3
    .scaleBand()
    .domain(
      sortedProduce.map((d) => (language === "en" ? d.name.en : d.name.nl)),
    )
    .range([0, boundsHeight])
    .padding(0.8);

  const xScale = d3.scaleLinear().domain([0, 12]).range([0, boundsWidth]);

  const barColour = (month) => {
    if ([11, 0, 1].includes(month)) {
      return "#0D3B66";
    }

    if ([2, 3, 4].includes(month)) {
      return "#5C946E";
    }

    if ([5, 6, 7].includes(month)) {
      return "#EDAE49";
    }

    if ([8, 9, 10].includes(month)) {
      return "#F28482";
    }

    return "green";
  };

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

  const monthHighlight =
    activeMonth !== null ? (
      <rect
        x={xScale(activeMonth)}
        y={0}
        width={xScale(activeMonth + 1) - xScale(activeMonth)}
        height={boundsHeight + TICK_LENGTH}
        fill={barColour(activeMonth)}
        fillOpacity={0.1}
      />
    ) : null;

  const rows = sortedProduce.map((d) => {
    const itemName = language === "en" ? d.name.en : d.name.nl;

    const y = yScale(itemName);

    if (y === undefined) {
      return null;
    }

    const rowColour = barColour(d.peaks[0]?.startIndex);

    const centreY = y + yScale.bandwidth() / 2;

    return (
      <g
        key={d.name.en}
        pointerEvents={
          disableHover
            ? "none"
            : activeMonth !== null && !isPeakActive(d, activeMonth)
              ? "none"
              : "all"
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
          setHoveredItem(null);
          setInteractionData(null);
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
        {/* HOVER AREA */}
        <rect
          x={-MARGIN.left}
          y={y - 12}
          width={boundsWidth + 340}
          height={yScale.bandwidth() + 48}
          fill="black"
          fillOpacity={0.001}
        />

        {/* IMAGE */}
        <image
          href={getProduceImageByName(d.name.en)}
          x={language === "en" ? (isMobile ? -44 : -74) : isMobile ? -44 : -72}
          y={centreY - IMAGE_RADIUS}
          width={IMAGE_SIZE}
          height={IMAGE_SIZE}
        />

        {/* LABEL */}
        <text
          x={language === "en" ? (isMobile ? -52 : -90) : isMobile ? -52 : -88}
          y={centreY}
          dominantBaseline="middle"
          textAnchor="end"
          fontSize={isMobile ? 12 : 14}
          fill="#currentColor"
        >
          {itemName}
        </text>

        {/* PEAKS */}
        {d.peaks.flatMap((peak, peakIndex) =>
          getWrappedIntervals(peak.startIndex, peak.endIndex).map(
            (interval, intervalIndex) => {
              const startX = xScale(interval.start);

              const endX = xScale(interval.end + 1);

              const width = endX - startX;

              if (Number.isNaN(width) || width <= 0) {
                return null;
              }

              const radius = isMobile ? 4 : 8;

              const startsAtZero = interval.start === 0;
              const endsAtEleven = interval.end === 11;

              // only treat as special if this peak actually wraps
              const isWrappedPeak = peak.endIndex < peak.startIndex;

              const isWrappedSegment =
                isWrappedPeak && (startsAtZero || endsAtEleven);

              if (!isWrappedSegment) {
                return (
                  <rect
                    key={`peak-${peakIndex}-${intervalIndex}`}
                    x={startX}
                    y={y}
                    width={width}
                    height={yScale.bandwidth()}
                    fill={rowColour}
                    rx={radius}
                  />
                );
              }

              const h = yScale.bandwidth();

              let path;

              if (endsAtEleven) {
                // rounded left, flat right
                path = `
    M ${startX + radius} ${y}
    H ${startX + width}
    V ${y + h}
    H ${startX + radius}
    Q ${startX} ${y + h} ${startX} ${y + h - radius}
    V ${y + radius}
    Q ${startX} ${y} ${startX + radius} ${y}
    Z
  `;
              }

              if (startsAtZero) {
                // flat left, rounded right
                path = `
    M ${startX} ${y}
    H ${startX + width - radius}
    Q ${startX + width} ${y}
      ${startX + width} ${y + radius}
    V ${y + h - radius}
    Q ${startX + width} ${y + h}
      ${startX + width - radius} ${y + h}
    H ${startX}
    Z
  `;
              }

              return (
                <path
                  key={`peak-${peakIndex}-${intervalIndex}`}
                  d={path}
                  fill={rowColour}
                />
              );
            },
          ),
        )}
      </g>
    );
  });

  return (
    <svg width={width} height={height} className="text-[var(--text-h)]">
      <g transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
        <AxisHorizontal
          xScale={xScale}
          boundsHeight={boundsHeight}
          language={language}
          isMobile={isMobile}
          activeMonth={activeMonth}
          TICK_LENGTH={TICK_LENGTH}
        />

        {monthHighlight}

        {rows}
      </g>
    </svg>
  );
};

export const ResponsiveHorizontalBarChart = (props) => {
  const chartRef = useRef(null);
  const axisTriggerRef = useRef(null);

  const chartSize = useDimensions(chartRef);

  const [interactionData, setInteractionData] = useState(null);
  const [showStickyAxis, setShowStickyAxis] = useState(false);

  const MARGIN = getChartMargin(props.language, props.isMobile);

  const boundsWidth = Math.max(0, chartSize.width - MARGIN.left);

  const xScale = d3.scaleLinear().domain([0, 12]).range([0, boundsWidth]);

  const TICK_LENGTH = props.isMobile ? 12 : 16;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyAxis(!entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0,
      },
    );

    if (axisTriggerRef.current) {
      observer.observe(axisTriggerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={chartRef} className="relative w-full h-[2600px] md:h-[3600px]">
      {/* Trigger when real axis reaches viewport top */}
      <div
        ref={axisTriggerRef}
        className={
          props.isMobile
            ? "absolute -top-14 left-0 h-px w-full"
            : "absolute -top-20 left-0 h-px w-full"
        }
      />

      {/* Fixed overlay axis */}
      <div
        className={`
          fixed
          left-0
          right-0
          z-[45]
          pointer-events-none
          transition-opacity
          duration-100
          bg-white
          
          border-b
          border-[#CFC7CA]
          ${showStickyAxis ? "opacity-100" : "opacity-0"}
        `}
        style={{
          top: "var(--navbar-height)",
        }}
      >
        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 lg:px-10">
          <svg
            width={chartSize.width}
            height={props.isMobile ? 18 : 24}
            className="overflow-visible"
          >
            <g
              transform={`translate(${MARGIN.left},  ${props.isMobile ? 18 : 24})`}
            >
              <AxisTopOnly
                xScale={xScale}
                language={props.language}
                isMobile={props.isMobile}
                activeMonth={props.activeMonth}
                TICK_TOP={TICK_LENGTH}
              />
            </g>
          </svg>
        </div>
      </div>
      {/* Chart */}
      <HorizontalBarChart
        height={chartSize.height}
        width={chartSize.width}
        setInteractionData={setInteractionData}
        TICK_LENGTH={TICK_LENGTH}
        {...props}
      />
      {/* Tooltip */}
      {!props.disableHover && (
        <div className="absolute inset-0 pointer-events-none">
          <Tooltip
            interactionData={interactionData}
            language={props.language}
          />
        </div>
      )}
    </div>
  );
};
