export const AlwaysAvailablePinwheel = ({
  innerRadius,
  t,
  alwaysAvailData,
}) => {
  return (
    <div
      className="absolute left-1/2
            top-1/2
            -translate-x-1/2
            -translate-y-1/2

            rounded-full

            flex
            flex-col
            items-center
            justify-center

            text-center
            
                      "
      style={{
        width: innerRadius * 1.7,
        height: innerRadius * 1.7,
      }}
    >
      <h3 className="text-sm font-medium">{t.availableAllYear}</h3>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
        {alwaysAvailData}
      </div>
    </div>
  );
};

export const AlwaysAvailableBar = ({ t, alwaysAvailData }) => {
  return (
    <section className="w-full max-w-[1600px] mx-auto mb-4 sm:mb-8">
      <h3 className="mb-4 text-center">{t.availableAllYear}</h3>

      <div
        className="
          flex
          flex-wrap
          justify-center
          gap-2
        "
      >
        {alwaysAvailData}
      </div>
      <div className="border-t border-border mt-5 sm:mt-8" />
    </section>
  );
};
