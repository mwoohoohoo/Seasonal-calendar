import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Button } from "./components//ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Languages } from "lucide-react";
import { ChartNoAxesGantt, CircleDot } from "lucide-react";

export default function Sidebar({
  MONTHS,
  selectedMonth,
  setSelectedMonth,
  setViewMode,
  language,
  setLanguage,
  chartView,
  setChartView,
  t,
  showPinwheel,
}) {
  const toggleItemClass = `
flex-1

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
    <aside
      className="
fixed
    left-0
    top-0
    h-screen
    w-84
    border-r
    bg-background
    px-6
    py-8
    flex
    flex-col
    justify-between
      "
    >
      {/* HEADER */}

      <div className="space-y-4">
        <h1 className="leading-none font-semibold">{t.title}</h1>

        <p className="text-sm text-muted-foreground leading-relaxed">
          {t.description}
        </p>
      </div>
      {/* CONTROLS */}
      <div className="mt-10 space-y-6">
        <Button
          size="lg"
          className="w-full"
          onClick={() => {
            const currentMonth = new Date().getMonth();

            setViewMode("current");
            setSelectedMonth(String(currentMonth));
          }}
        >
          {t.whatsInSeason}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>

          <div className="relative flex justify-center text-xs uppercase tracking-wider text-muted-foreground">
            <span className="bg-background px-3">{t.exploreMonth}</span>
          </div>
        </div>

        <Select
          value={selectedMonth}
          onValueChange={(value) => {
            setSelectedMonth(value);
            setViewMode("month");
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t.selectMonth} />
          </SelectTrigger>

          <SelectContent
            position="popper"
            className="w-[var(--radix-select-trigger-width)] "
          >
            {MONTHS.map((month, i) => (
              <SelectItem key={month} value={String(i)}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* VIEW TOGGLE */}
        {showPinwheel && (
          <div className="w-full">
            <ToggleGroup
              type="single"
              value={chartView}
              onValueChange={(value) => {
                if (value) {
                  setChartView(value);
                }
              }}
              className="
                  !flex
                   w-full
                  rounded-full
                  p-1
                  bg-[#2C6E49]/15
                  gap-1
                "
            >
              <ToggleGroupItem
                value="pinwheel"
                className={`${toggleItemClass} flex-1 basis-0 gap-2`}
              >
                <CircleDot className="!w-4 !h-4" />
                <p>Radial</p>
              </ToggleGroupItem>

              <ToggleGroupItem
                value="timeline"
                className={`${toggleItemClass} flex-1 basis-0 gap-2`}
              >
                <ChartNoAxesGantt className="!w-4 !h-4" />
                <p>Bar</p>
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        )}

        <button
          className="
    w-full
    text-center
    text-sm
    text-muted-foreground
    hover:text-foreground
    transition-colors
  "
          onClick={() => {
            setViewMode("reset");
            setSelectedMonth("");
          }}
        >
          {t.resetView}
        </button>
      </div>
      {/* PUSH EVERYTHING BELOW TO THE BOTTOM */}
      <div className="mt-auto space-y-6">
        {/* SOURCES */}
        <div className="flex flex-col gap-2 items-start">
          <h3 className="text-xs uppercase tracking-wider">{t.sources}</h3>

          <ul className="flex flex-col text-xs text-muted-foreground gap-2">
            <li>
              <a
                href="https://www.greenpeace.org/static/planet4-netherlands-stateless/2024/10/e7090572-seizoensgids-greenpeace.pdf"
                target="_blank"
              >
                Greenpeace
              </a>
            </li>
            <li>
              <a href="https://www.veggipedia.nl/" target="_blank">
                Veggipedia
              </a>
            </li>
            <li>
              <a href="https://www.verseoogst.nl/" target="_blank">
                Verse Oogst
              </a>
            </li>
            <li>
              <a
                href="https://www.voedingscentrum.nl/Assets/Uploads/voedingscentrum/Documents/Consumenten/Veelgestelde%20vragen/Voedingscentrum%20seizoengroente-%20en%20fruitkalender.pdf"
                target="_blank"
              >
                Voedingscentrum
              </a>
            </li>
          </ul>
        </div>

        <div className="flex w-full items-center justify-between ">
          {/* COPYRIGHT */}
          <div className="text-xs text-muted-foreground">
            © Merri Hookway {new Date().getFullYear()}
          </div>
          {/* LANGUAGE TOGGLE */}
          <div className="flex items-center gap-2 text-sm">
            <Languages size={14} className="text-muted-foreground" />

            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`
      cursor-pointer
      transition-colors
      hover:text-primary
      ${
        language === "en"
          ? "font-semibold text-primary"
          : "text-muted-foreground"
      }
    `}
              aria-label="Switch to English"
            >
              EN
            </button>

            <span className="text-muted-foreground">|</span>

            <button
              type="button"
              onClick={() => setLanguage("nl")}
              className={`
      cursor-pointer
      transition-colors
      hover:text-primary
      ${
        language === "nl"
          ? "font-semibold text-primary"
          : "text-muted-foreground"
      }
    `}
              aria-label="Wissel naar Nederlands"
            >
              NL
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
