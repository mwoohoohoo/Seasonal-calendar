import { ChartNoAxesGantt, CircleDot } from "lucide-react";
import { useRef, useEffect } from "react";
import logo from "./assets/seasons-eatings-logo.svg";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Button } from "./components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function Navbar({
  MONTHS,
  selectedMonth,
  setSelectedMonth,
  setViewMode,
  chartView,
  setChartView,
  language,
  t,
  showPinwheel,
  isMobile,
}) {
  const navbarRef = useRef(null);

  useEffect(() => {
    const updateNavbarHeight = () => {
      if (!navbarRef.current) {
        return;
      }

      document.documentElement.style.setProperty(
        "--navbar-height",
        `${navbarRef.current.offsetHeight}px`,
      );
    };

    updateNavbarHeight();

    window.addEventListener("resize", updateNavbarHeight);

    return () => {
      window.removeEventListener("resize", updateNavbarHeight);
    };
  }, []);

  const toggleItemClass = `
  rounded-full
  px-3
  py-1
  !h-7

  border
  border-transparent

  text-muted-foreground

  hover:text-[#2C6E49]

  data-[state=on]:bg-white
  data-[state=on]:border-input
  data-[state=on]:text-[#2C6E49]

  transition-all
  duration-200
`;

  return (
    <>
      <header
        ref={navbarRef}
        className="fixed top-0 left-0 w-full z-100 backdrop-blur-md bg-bg border-b"
      >
        {/* NAV CONTENT */}
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-10 flex items-center justify-between py-3 sm:py-4">
          {/* LOGO*/}
          <img
            src={logo}
            alt="Season's eatings'"
            className="h-4 sm:h-6 md:h-8 lg:h-10 w-auto"
          />

          <div className="flex md:gap-10">
            {/* CONTROLS */}
            <div className="flex items-center gap-3 md:gap-4">
              <Button
                className="w-fit h-8 px-3 text-xs md:h-10 md:px-4 md:text-sm"
                onClick={() => {
                  const currentMonth = new Date().getMonth();

                  setViewMode("current");
                  setSelectedMonth(String(currentMonth));
                }}
              >
                {t.whatsInSeason}
              </Button>
              {!isMobile && (
                <>
                  <Select
                    value={selectedMonth}
                    onValueChange={(value) => {
                      setSelectedMonth(value);
                      setViewMode("month");
                    }}
                  >
                    <SelectTrigger
                      className={
                        language === "en"
                          ? "w-34 md:w-40 bg-white !h-8 md:!h-10 !px-3 md:!px-4"
                          : "w-35 md:w-42 bg-white !h-8 md:!h-10 !px-3 md:!px-4"
                      }
                    >
                      <SelectValue placeholder={t.selectMonth} />
                    </SelectTrigger>

                    <SelectContent
                      position="popper"
                      avoidCollisions={true}
                      className="w-[var(--radix-select-trigger-width)]"
                    >
                      {MONTHS.map((month, i) => (
                        <SelectItem key={month} value={String(i)}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <button
                    className="w-fit text-center text-muted-foreground hover:text-foreground transition-colors h-8 px-3 text-xs md:h-10 md:px-4 md:text-sm"
                    onClick={() => {
                      setViewMode("reset");
                      setSelectedMonth("");
                    }}
                  >
                    {t.resetView}
                  </button>
                </>
              )}
            </div>

            {/* VIEW TOGGLE */}
            {showPinwheel && (
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <ToggleGroup
                    type="single"
                    value={chartView}
                    onValueChange={(value) => {
                      if (value) {
                        setChartView(value);
                      }
                    }}
                    className="
                  rounded-full
                  p-1
                  bg-[#2C6E49]/15
                  gap-1
                "
                  >
                    <ToggleGroupItem
                      value="pinwheel"
                      className={toggleItemClass}
                    >
                      <CircleDot className="!w-4 !h-4" />
                    </ToggleGroupItem>

                    <ToggleGroupItem
                      value="timeline"
                      className={toggleItemClass}
                    >
                      <ChartNoAxesGantt className="!w-4 !h-4" />
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
