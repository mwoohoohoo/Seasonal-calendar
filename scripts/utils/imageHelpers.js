export function slugifyProduceName(name) {
  return name
    .toLowerCase()
    .replace(/[']/g, "")
    .replace(/\s+/g, "-")
    .replace(/[()]/g, "");
}

export function getProduceImageByName(name) {
  return `${import.meta.env.BASE_URL}assets/${slugifyProduceName(name)}.svg`;
}

