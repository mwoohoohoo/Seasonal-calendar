export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const monthToIndex = Object.fromEntries(MONTHS.map((m, i) => [m, i]));

export const anglePerMonth = (Math.PI * 2) / 12;

export const rotationOffset = 0;

export function getAngles(startMonth, endMonth) {
  let start = monthToIndex[startMonth];
  let end = monthToIndex[endMonth];

  const isFullYear = start === 0 && end === 0;

  if (isFullYear) {
    end = 11;
  }

  if (end < start) {
    end += 12;
  }

  return {
    startAngle: start * anglePerMonth + rotationOffset,

    endAngle: (end + 1) * anglePerMonth + rotationOffset,
  };
}

export function getAnglesFromIndices(start, end) {
  let adjustedEnd = end;

  const isFullYear = start === 0 && end === 0;

  if (isFullYear) {
    adjustedEnd = 11;
  }

  if (adjustedEnd < start) {
    adjustedEnd += 12;
  }

  return {
    startAngle: start * anglePerMonth + rotationOffset,

    endAngle: (adjustedEnd + 1) * anglePerMonth + rotationOffset,
  };
}
