export function groupByPeakMonth(data) {
  const filteredData = data.filter(
    (d) => d.signature !== "January-January|January-January",
  );

  const groups = Array.from({ length: 12 }, (_, monthIndex) => ({
    monthIndex,
    data: filteredData.filter((d) => d.peaks[0]?.startIndex === monthIndex),
  }));

  return groups.filter((group) => group.data.length > 0);
}
