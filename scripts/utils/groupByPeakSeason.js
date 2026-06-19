export function groupByPeakSeason(data) {
  const filteredData = data.filter(
    (d) => d.signature !== "January-January|January-January",
  );

  const seasonMonths = [
    [2, 3, 4], // Spring
    [5, 6, 7], // Summer
    [8, 9, 10], // Autumn
  ];

  return seasonMonths
    .map((months, seasonIndex) => ({
      seasonIndex,

      data: filteredData.filter((d) => months.includes(d.peaks[0]?.startIndex)),
    }))
    .filter((group) => group.data.length > 0);
}
