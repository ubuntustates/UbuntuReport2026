"use client";

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useNewsStore } from "@/store/newsStore";

const PREDEFINED_TIME_FRAMES = [
  { label: "All Time", value: "all" },
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Last Week", value: "last_week" },
  { label: "Last Month", value: "last_month" },
];

export function TimeFrameSelect() {
  const {
    selectedTimeFrame,
    setTimeFrame,
    selectedCategory,
    selectedRegion,
    selectedCountry,
    fetchAllNews,
  } = useNewsStore();

  const currentYear = new Date().getFullYear();
  const [monthOptions, setMonthOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    const months: { value: string; label: string }[] = [];
    const yearsToShow = 3;

    for (let y = currentYear - 1; y >= currentYear - yearsToShow; y--) {
      for (let m = 1; m <= 12; m++) {
        const value = `${y}-${m.toString().padStart(2, "0")}`;
        const label = `${new Date(y, m - 1).toLocaleString("default", { month: "long" })} ${y}`;
        months.push({ value, label });
      }
    }

    setMonthOptions(months);
  }, [currentYear]);

  const handleTimeFrameChange = (value: string) => {
    setTimeFrame(value);

    fetchAllNews({
      timeFrame: value === "all" ? undefined : value,
      category: selectedCategory ?? undefined,
      region: selectedRegion ?? undefined,
      country: selectedCountry ?? undefined,
    });
  };

  return (
    <Select
      value={selectedTimeFrame ?? "all"}
      onValueChange={handleTimeFrameChange}
    >
      <SelectTrigger
        className="focus:outline-none !ring-0 !border-transparent min-w-[100px]
                    focus:ring-0 focus:border-transparent bg-[#F2E8E8] rounded-[8px] md:text-[14px]"
      >
        <SelectValue placeholder="Time Frame" />
      </SelectTrigger>

      <SelectContent>
        {PREDEFINED_TIME_FRAMES.map(({ label, value }) => (
          <SelectItem
            key={value}
            value={value}
            className={value === "all" ? "font-normal" : ""}
          >
            {label}
          </SelectItem>
        ))}

        {monthOptions.map(({ value, label }) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
