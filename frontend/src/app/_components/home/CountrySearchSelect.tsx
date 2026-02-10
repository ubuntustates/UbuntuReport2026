"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import { DJANGO_API } from "@/utils/MyConstants";

interface Option {
  value: string;
  label: string;
}

interface Props {
  label?: string;
  value: string;
  onChange: (value: string) => void;
}

export default function CountrySearchSelect({ label, value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState<Option[]>([{ value: "all", label: "All Countries" }]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  /** Load countries from API */
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch(`${DJANGO_API}/countries/`);
        const data: { id: number; name: string }[] = await res.json();

        const formatted: Option[] = data
          .map((c) => ({
            value: c.name,
            label: c.name,
          }))
          .sort((a, b) => a.label.localeCompare(b.label));

        setOptions([{ value: "all", label: "All Countries" }, ...formatted]);
      } catch (error) {
        console.error("Failed to fetch countries:", error);
      }
    };

    fetchCountries();
  }, []);

  /** Click outside to close */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /** Filter logic */
  const filtered = useMemo(() => {
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, options]);

  return (
    <div ref={wrapperRef} className="relative md:w-[180px] w-full">
      {/* Trigger */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full px-3 py-[0.3rem] border rounded-md bg-[#F2E8E8] text-left flex justify-between"
      >
        <span>{options.find((o) => o.value === value)?.label ?? "Select Country"}</span>
        <span>▾</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-20 mt-2 w-full bg-[#F2E8E8] border rounded-md shadow-lg max-h-64 overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b">
            <input
              type="text"
              placeholder="Search country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-2 py-1 border rounded-md text-sm bg-white"
            />
          </div>

          {/* List */}
          <div className="max-h-52 overflow-y-auto">
            {filtered.length ? (
              filtered.map((opt) => (
                <div
                  key={opt.value}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                    setSearch("");
                  }}
                >
                  {opt.label}
                </div>
              ))
            ) : (
              <p className="p-3 text-sm text-gray-400 text-center">No results</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
