'use client';

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { cn } from "@/lib/utils"; // optional: utility to merge classNames

interface Option {
  value: string | number;
  label: string;
  className?: string; // <-- allow per-item class
}

interface Props {
  addClass?: string;
  placeholder?: string;
  options: Option[];
  value?: string | number | null;
  onChange?: (value: string | number) => void;
}

export function MainSelect({ addClass = "", options, placeholder = "Select", value, onChange }: Props) {
  return (
    <Select
      value={value !== null && value !== undefined ? String(value) : "all"} // default fallback
      onValueChange={(val) => {
        // convert "all" back to null for parent
        if (val === "all") onChange?.(null);
        else if (!isNaN(Number(val))) onChange?.(Number(val));
        else onChange?.(val);
      }}
    >
      <SelectTrigger
        className={cn(
          addClass,
          "focus:outline-none !ring-0 !border-transparent focus:ring-0 focus:border-transparent bg-[#F2E8E8] rounded-[8px] md:text-[14px] text-[12px] font-normal"
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>
        {options.map((option, index) => (
          <SelectItem
            key={index}
            value={String(option.value)}
            className={cn(option.className)} // <-- apply per-item class
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
