import "./App.css";

import "@fontsource/syne/400.css";
import "@fontsource/syne/500.css";
import "@fontsource/syne/600.css";

import "@fontsource/quicksand/400.css";
import "@fontsource/quicksand/500.css";
import "@fontsource/quicksand/600.css";

import { monthIndexData } from "./data/monthIndexData";
import { getProduceImageByName } from "../scripts/utils/imageHelpers";
import { translations, monthsTranslations } from "./translations";

import { ResponsivePinwheelChart } from "./charts/PinwheelChart";
import { ResponsiveHorizontalBarChart } from "./charts/HorizontalBarChart";
import {
  AlwaysAvailablePinwheel,
  AlwaysAvailableBar,
} from "./charts/AlwaysAvailable";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import MobileControlDrawer from "./MobileControlDrawer";
import { Button } from "./components/ui/button";
import Footer from "./Footer";

import { useEffect, useState, useMemo } from "react";

export default function App() {
  const [viewMode, setViewMode] = useState("reset");

  const [selectedMonth, setSelectedMonth] = useState("");

  const [language, setLanguage] = useState("en");

  const [chartView, setChartView] = useState("pinwheel");

  const initialWidth = typeof window !== "undefined" ? window.innerWidth : 0;

  const initialPadding =
    initialWidth >= 1024 ? 80 : initialWidth >= 768 ? 64 : 32;

  const [showSidebarLayout, setShowSidebarLayout] = useState(
    initialWidth >= 1920,
  );

  const [showPinwheel, setShowPinwheel] = useState(
    initialWidth - initialPadding >= 1400,
  );

  const effectiveChartView = showPinwheel ? chartView : "timeline";

  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth;

      // Sidebar only on very large screens
      setShowSidebarLayout(width >= 1920);

      // Account for page gutters
      const horizontalPadding =
        width >= 1024
          ? 80 // lg:px-10
          : width >= 768
            ? 64 // md:px-8
            : 32; // px-4

      // Pinwheel requires 1400px usable space
      setShowPinwheel(width - horizontalPadding >= 1400);
    };

    updateLayout();

    window.addEventListener("resize", updateLayout);

    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  // Check viewport size for isMobile

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 575;

  const disableHover =
    typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;

  // Fetch translations

  const t = translations[language];

  const MONTHS = monthsTranslations[language].long;

  const activeMonth = useMemo(() => {
    if (viewMode === "reset") {
      return null;
    }

    if (viewMode === "month" && selectedMonth === "") {
      return null;
    }

    return viewMode === "current"
      ? new Date().getMonth()
      : Number(selectedMonth);
  }, [viewMode, selectedMonth]);

  // produce available all year sorted alphabetically
  const alwaysAvailableProduce = [...monthIndexData]
    .filter(
      (d) => d.peaks[0].start === "January" && d.peaks[0].end === "January",
    )
    .sort((a, b) => {
      const aLabel = language === "en" ? a.name.en : a.name.nl;

      const bLabel = language === "en" ? b.name.en : b.name.nl;

      return aLabel.localeCompare(bLabel);
    });

  const seasonalProduce = [...monthIndexData]
    .filter(
      (d) =>
        !alwaysAvailableProduce.includes(d) && d.name.en !== "Lamb's lettuce",
    )
    .sort((a, b) => {
      const aLabel = language === "en" ? a.name.en : a.name.nl;

      const bLabel = language === "en" ? b.name.en : b.name.nl;

      return aLabel.localeCompare(bLabel);
    });

  const canReset = viewMode !== "reset" || selectedMonth !== "";

  const innerRadius = 168;

  const IMAGE_SIZE = isMobile ? 36 : 48;
  const IMAGE_SIZE_PINWHEEL = 88;

  const alwaysAvailData = alwaysAvailableProduce.map((d) =>
    effectiveChartView === "pinwheel" ? (
      <div key={d.name.en} className="flex flex-col items-center gap-1">
        <img
          src={getProduceImageByName(d.name.en)}
          alt={language === "en" ? d.name.en : d.name.nl}
          className="object-contain"
          style={{
            width: IMAGE_SIZE_PINWHEEL,
            height: IMAGE_SIZE_PINWHEEL,
          }}
        />

        <span className="text-[12px] leading-tight text-center text-[var(--text-h)]">
          {language === "en" ? d.name.en : d.name.nl}
        </span>
      </div>
    ) : (
      <div
        key={d.name.en}
        className="
      flex
      flex-col
      items-center
      gap-2
      w-16 sm:w-24
      text-center
    "
      >
        <img
          src={getProduceImageByName(d.name.en)}
          alt={language === "en" ? d.name.en : d.name.nl}
          className="object-contain"
          style={{
            width: IMAGE_SIZE,
            height: IMAGE_SIZE,
          }}
        />

        <span
          className={
            isMobile
              ? "text-[12px] leading-tight text-center text-[var(--text-h)]"
              : "text-[14px] leading-tight text-center text-[var(--text-h)]"
          }
        >
          {language === "en" ? d.name.en : d.name.nl}
        </span>
      </div>
    ),
  );

  return (
    <>
      {!showSidebarLayout && (
        <Navbar
          MONTHS={MONTHS}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          setViewMode={setViewMode}
          chartView={chartView}
          setChartView={setChartView}
          language={language}
          t={t}
          showPinwheel={showPinwheel}
          isMobile={isMobile}
        />
      )}
      {!showSidebarLayout && isMobile && (
        <div
          className="
    fixed
    bottom-4
    left-1/2
    -translate-x-1/2
    z-50
    flex
    gap-4
  "
        >
          <MobileControlDrawer
            MONTHS={MONTHS}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            setViewMode={setViewMode}
            t={t}
            language={language}
          />
          <Button
            variant="outline"
            className="rounded-full  text-[#2C6E49]
              border
              border-muted disabled:opacity-100
    disabled:bg-white
    disabled:text-[#2C6E49]/50"
            disabled={!canReset}
            onClick={() => {
              setViewMode("reset");
              setSelectedMonth("");
            }}
          >
            {t.resetView}
          </Button>
        </div>
      )}
      <div
        className=" flex
    min-h-screen"
      >
        {showSidebarLayout && (
          <Sidebar
            MONTHS={MONTHS}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            setViewMode={setViewMode}
            language={language}
            setLanguage={setLanguage}
            chartView={chartView}
            setChartView={setChartView}
            t={t}
            showPinwheel={showPinwheel}
          />
        )}

        <main
          className={
            showSidebarLayout ? "flex-1 min-w-0 ml-84" : "flex-1 min-w-0"
          }
        >
          <div
            className={
              showSidebarLayout
                ? "w-full flex justify-center pt-6"
                : chartView === "pinwheel"
                  ? language === "en"
                    ? "w-full flex justify-center pt-22"
                    : "w-full flex justify-center pt-15"
                  : "w-full flex justify-center pt-18 sm:pt-24"
            }
          >
            <div
              className={
                chartView === "pinwheel" && showPinwheel
                  ? "relative w-full max-w-[1600px] mx-auto px-4 md:px-8 lg:px-10"
                  : "relative w-full max-w-[1600px] mx-auto px-4 md:px-8 lg:px-10"
              }
            >
              {effectiveChartView === "pinwheel" ? (
                <>
                  <ResponsivePinwheelChart
                    seasonalProduce={seasonalProduce}
                    alwaysAvailableProduce={alwaysAvailableProduce}
                    activeMonth={activeMonth}
                    selectedMonth={selectedMonth}
                    innerRadius={innerRadius}
                    language={language}
                    t={t}
                    MONTHS={monthsTranslations[language].short}
                    IMAGE_SIZE={IMAGE_SIZE_PINWHEEL}
                  />
                  <AlwaysAvailablePinwheel
                    innerRadius={innerRadius}
                    t={t}
                    alwaysAvailData={alwaysAvailData}
                  />
                </>
              ) : (
                <>
                  <AlwaysAvailableBar t={t} alwaysAvailData={alwaysAvailData} />
                  <ResponsiveHorizontalBarChart
                    seasonalProduce={seasonalProduce}
                    activeMonth={activeMonth}
                    language={language}
                    t={t}
                    MONTHS={monthsTranslations[language].short}
                    isMobile={isMobile}
                    disableHover={disableHover}
                    IMAGE_SIZE={IMAGE_SIZE}
                  />
                </>
              )}
            </div>
          </div>
          {!showSidebarLayout && (
            <Footer language={language} setLanguage={setLanguage} t={t} />
          )}
        </main>
      </div>
    </>
  );
}
