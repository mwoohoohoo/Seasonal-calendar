import fs from "fs";
import { groupedProduce } from "../src/data/groupedData.js";

const MONTH_INDEX = {
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11,
};

// Normalize month ranges

function normalizeRange(range) {
  let start = range.start;
  let end = range.end;

  // Full-year special case

  if (start === "January" && end === "January") {
    end = "December";
  }

  return {
    start,
    end,

    startIndex: MONTH_INDEX[start],

    endIndex: MONTH_INDEX[end],
  };
}

// Normalize entire dataset

const normalizedGroupedProduce = groupedProduce.map((group) => {
  return {
    ...group,

    availability: normalizeRange(group.availability),

    peaks: group.peaks.map((peak) => normalizeRange(peak)),
  };
});

// Generate output file

const fileContents = `export const normalizedGroupedProduce = ${JSON.stringify(normalizedGroupedProduce, null, 2)};`;

fs.writeFileSync("./src/data/normalizedGroupedData.js", fileContents);

console.log("normalizedGroupedData.js created successfully");
