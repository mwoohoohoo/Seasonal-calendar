export const AxisTopOnly = ({
  xScale,
  language,
  isMobile,
  activeMonth,
  TICK_TOP,
}) => {
  const range = xScale.range();
  const domain = xScale.domain();

  const width = range[1] - range[0];
  const TICK_BOTTOM = isMobile ? 2 : 4;
  const tickLabels = [...Array(domain[1] + 1).keys()];

  const formatMonth = (number) => {
    const replacements =
      language === "en"
        ? isMobile
          ? {
              0: "J",
              1: "F",
              2: "M",
              3: "A",
              4: "M",
              5: "J",
              6: "J",
              7: "A",
              8: "S",
              9: "O",
              10: "N",
              11: "D",
            }
          : {
              0: "Jan",
              1: "Feb",
              2: "Mar",
              3: "Apr",
              4: "May",
              5: "Jun",
              6: "Jul",
              7: "Aug",
              8: "Sep",
              9: "Oct",
              10: "Nov",
              11: "Dec",
            }
        : isMobile
          ? {
              0: "J",
              1: "F",
              2: "M",
              3: "A",
              4: "M",
              5: "J",
              6: "J",
              7: "A",
              8: "S",
              9: "O",
              10: "N",
              11: "D",
            }
          : {
              0: "Jan",
              1: "Feb",
              2: "Maa",
              3: "Apr",
              4: "Mei",
              5: "Jun",
              6: "Jul",
              7: "Aug",
              8: "Sep",
              9: "Okt",
              10: "Nov",
              11: "Dec",
            };

    return replacements[number] || number;
  };

  const barColour = (month) => {
    if ([11, 0, 1].includes(month)) return "#0D3B66";
    if ([2, 3, 4].includes(month)) return "#5C946E";
    if ([5, 6, 7].includes(month)) return "#EDAE49";
    if ([8, 9, 10].includes(month)) return "#F28482";

    return "green";
  };

  return (
    <>
      <line
        x1={0}
        y1={-TICK_TOP}
        x2={0}
        y2={TICK_BOTTOM}
        stroke="#CFC7CA"
        strokeWidth={1}
        strokeDasharray={isMobile ? "2,3" : "4,6"}
      />
      <line
        x1={width - 1}
        y1={-TICK_TOP}
        x2={width - 1}
        y2={TICK_BOTTOM}
        stroke="#CFC7CA"
        strokeWidth={1}
        strokeDasharray={isMobile ? "2,3" : "4,6"}
      />
      {/* Ticks and labels  */}
      {tickLabels.map((value, i) => (
        <g key={i} transform={`translate(${xScale(value)}, 0)`}>
          {i !== 0 && i !== 12 && (
            <line
              y1={-TICK_TOP}
              y2={TICK_BOTTOM}
              stroke="#CFC7CA"
              strokeWidth={1}
              strokeDasharray={isMobile ? "2,3" : "4,6"}
            />
          )}

          {i !== 12 && (
            <>
              {activeMonth === value && (
                <rect
                  x={0}
                  y={-TICK_TOP}
                  width={xScale(1)}
                  height={TICK_TOP}
                  fill={barColour(value)}
                  fillOpacity={0.1}
                />
              )}
              <text
                x={xScale(1) / 2}
                y={-4}
                style={{
                  fontSize: "10px",
                  textAnchor: "middle",
                  fontColor: "#584c4e",
                }}
              >
                {formatMonth(value)}
              </text>
            </>
          )}
        </g>
      ))}
    </>
  );
};
