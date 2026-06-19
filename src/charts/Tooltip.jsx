import { monthsTranslations } from "../translations";

export const Tooltip = ({ interactionData, language }) => {
  if (!interactionData) {
    return null;
  }

  const { xPos, yPos, name, peaks, color } = interactionData;

  const monthIndexToName = (monthIndex) =>
    monthsTranslations[language].long[monthIndex];
  return (
    <div
      className="
    absolute
    z-50
    bg-white
    border
    rounded-md
    px-3
    py-2
    shadow-md
    text-xs
    text-left
    flex flex-col
    gap-1
  "
      style={{
        left: xPos + 12,
        top: yPos + 12,
        borderColor: color,
      }}
    >
      <b>{name}</b>
      {!peaks[1] && (
        <p>
          {monthIndexToName(peaks[0].startIndex) +
            " - " +
            monthIndexToName(peaks[0].endIndex)}
        </p>
      )}

      {peaks[1] && (
        <>
          <ul className="list-disc list-inside">
            <li>
              {monthIndexToName(peaks[0].startIndex) +
                " - " +
                monthIndexToName(peaks[0].endIndex)}
            </li>
            <li>
              {monthIndexToName(peaks[1]?.startIndex) +
                " - " +
                monthIndexToName(peaks[1]?.endIndex)}
            </li>
          </ul>
        </>
      )}
    </div>
  );
};
