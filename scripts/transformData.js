import fs from "fs";
import csv from "csv-parser";

const rows = [];

fs.createReadStream("./data/seasonal_produce.csv")
  .pipe(csv())

  .on("data", (row) => {
    rows.push(transformRow(row));
  })

  .on("end", () => {
    const fileContents = `export const produce = ${JSON.stringify(rows, null, 2)}`;

    fs.writeFileSync("./src/data/data.js", fileContents);

    console.log("data.js created successfully");
  });

function transformRow(row) {
  const peaks = [];

  // PEAK 1

  if (row.start_peak_1 && row.end_peak_1) {
    peaks.push({
      start: row.start_peak_1,
      end: row.end_peak_1,
    });
  }

  // PEAK 2

  if (row.start_peak_2 && row.end_peak_2) {
    peaks.push({
      start: row.start_peak_2,
      end: row.end_peak_2,
    });
  }

  return {
    type: row.type,

    name: {
      en: row.name_en,
      nl: row.name_nl,
    },

    availability: {
      start: row.start_month,
      end: row.end_month,
    },

    peaks,
  };
}
