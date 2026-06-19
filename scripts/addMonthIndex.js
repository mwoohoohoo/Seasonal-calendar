import fs from "fs";
import { produce } from "../src/data/data.js";

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

  return {
    start,
    end,

    startIndex: MONTH_INDEX[start],

    endIndex: MONTH_INDEX[end],
  };
}

// Normalize entire dataset

const monthIndexData = produce.map((p) => {
  return {
    ...p,
    availability: normalizeRange(p.availability),
    peaks: p.peaks.map((peak) => normalizeRange(peak)),
  };
});

// Generate output file

const fileContents = `export const monthIndexData = ${JSON.stringify(monthIndexData, null, 2)};`;

fs.writeFileSync("./src/data/monthIndexData.js", fileContents);

console.log("monthIndexData.js created successfully");
