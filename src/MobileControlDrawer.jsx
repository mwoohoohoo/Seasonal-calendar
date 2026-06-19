import { Settings2 } from "lucide-react";
import { useState } from "react";

import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";

import { Button } from "./components/ui/button";

export default function MobileControlDrawer({
  MONTHS,
  selectedMonth,
  setSelectedMonth,
  setViewMode,
  t,
}) {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="
            rounded-full
              text-[#2C6E49]
              border
              border-muted
          "
        >
          <Settings2 className="w-4 h-4" />
          Filter
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{t.filter}</DrawerTitle>
        </DrawerHeader>

        <div className="px-4 pb-8 flex flex-col gap-4">
          <Select
            value={selectedMonth}
            onValueChange={(value) => {
              setSelectedMonth(value);
              setViewMode("month");
              setOpen(false);
            }}
          >
            <SelectTrigger className="w-full text-sm ">
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
            className="w-ull text-center text-muted-foreground hover:text-foreground transition-colors text-sm h-10 px-4 "
            onClick={() => {
              setViewMode("reset");
              setSelectedMonth("");
            }}
          >
            {t.resetView}
          </button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
