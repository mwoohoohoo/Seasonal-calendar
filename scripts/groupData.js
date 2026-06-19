import fs from "fs";
import { produce } from "../src/data/data.js";

function createSeasonSignature(item) {
  // Availability range

  const availability = `${item.availability.start}-${item.availability.end}`;

  // Peaks

  const peaks = item.peaks.map((peak) => `${peak.start}-${peak.end}`).join("|");

  // Full signature

  return `${availability}|${peaks}`;
}

function groupProduce(data) {
  const groups = {};

  data.forEach((item) => {
    const signature = createSeasonSignature(item);

    // Create group if it doesn't exist

    if (!groups[signature]) {
      groups[signature] = {
        signature,

        availability: item.availability,

        peaks: item.peaks,

        items: [],
      };
    }

    // Add produce item

    groups[signature].items.push({
      en: item.name.en,
      nl: item.name.nl,
      type: item.type,
    });
  });

  return Object.values(groups);
}

// Generate grouped data

const groupedProduce = groupProduce(produce);

// SORT GROUPS

groupedProduce.sort((a, b) => {
  return a.availability.start.localeCompare(b.availability.start);
});

// Write output file

const fileContents = `export const groupedProduce = ${JSON.stringify(groupedProduce, null, 2)};`;

fs.writeFileSync("./src/data/groupedData.js", fileContents);
