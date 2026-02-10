"use client";

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useEffect, useMemo } from "react";
import { useNewsStore } from "@/store/newsStore";

// 🧹 Helper to prettify category names
function formatCategoryName(category: string): string {
  if (category.toLowerCase() === "more-news") return "Others";

  return category
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// ✅ Add props interface
interface CategorySelectProps {
  onChange?: (val: string) => void;
}

export function CategorySelect({ onChange }: CategorySelectProps) {
  const {
    categories,
    selectedCategory,
    fetchAllCategories,
    fetchNewsByCategory,
    fetchAllNews,
  } = useNewsStore();

  useEffect(() => {
    fetchAllCategories();
  }, [fetchAllCategories]);

  const sortedCategories = useMemo(() => {
    const validCategories = categories.filter((c): c is string => !!c);

    const withoutMoreNews = validCategories
      .filter((c) => c.toLowerCase() !== "more-news")
      .sort((a, b) => a.localeCompare(b));

    const hasMoreNews = validCategories.some((c) => c.toLowerCase() === "more-news");
    return hasMoreNews ? [...withoutMoreNews, "more-news"] : withoutMoreNews;
  }, [categories]);

  const handleCategoryChange = (value: string) => {
    if (value === "All") {
      fetchAllNews();
    } else {
      fetchNewsByCategory(value);
    }

    // ✅ Call external onChange if provided
    if (onChange) onChange(value);
  };

  const currentValue = selectedCategory && categories.includes(selectedCategory)
    ? selectedCategory
    : "All";

  return (
    <Select value={currentValue} onValueChange={handleCategoryChange}>
      <SelectTrigger
        className="focus:outline-none !ring-0 !border-transparent w-full md:min-w-[100px]
                   focus:ring-0 focus:border-transparent bg-[#F2E8E8] rounded-[8px] md:text-[14px]"
      >
        <SelectValue placeholder="Select category" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="All">All</SelectItem>

        {sortedCategories.map((category) => (
          <SelectItem key={category} value={category}>
            {formatCategoryName(category)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
