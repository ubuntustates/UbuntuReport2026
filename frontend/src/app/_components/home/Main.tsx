"use client";
import { useEffect, useRef, useCallback, useState } from "react";
import { MainSelect } from "./MainSelect";
import NewsContent from "./NewsContent";
import { useNewsStore } from "@/store/newsStore";
import { CategorySelect } from "./CategorySelect";
import { TimeFrameSelect } from "./TimeFrameSelect";
import { fetchCountries } from "@/service/newsService";
import CountrySearchSelect from "./CountrySearchSelect";
import NewsSkeleton from "./NewsSkeleton";

export default function Main() {
  const {
    news,
    loading,
    error,
    fetchAllNews,
    fetchNextPage,
    next,
    selectedCategory,
    selectedTimeFrame,
    setTimeFrame,
    clearFilters,
  } = useNewsStore();

  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useRef<HTMLDivElement | null>(null);

  // Local state for regions/countries
  const [countries, setCountries] = useState<{ id: string; name: string; region_id: string }[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  // Load initial news + regions/countries
  useEffect(() => {
    fetchAllNews();


    const loadCountries = async () => {
      const data = await fetchCountries();
      setCountries(data.map(c => ({ id: String(c.id), name: c.name, region_id: String(c.region_id) })));
    };

    loadCountries();
  }, []);

  // Infinite scroll
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && next && !loading) {
        fetchNextPage();
      }
    },
    [next, loading, fetchNextPage]
  );

  useEffect(() => {
    if (!lastElementRef.current) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "200px",
      threshold: 0.1,
    });

    observerRef.current.observe(lastElementRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [handleObserver, news.length]);


  // Unified function to fetch news with current filters
  const fetchNewsWithFilters = (overrides: {
    category?: string | null;
    timeFrame?: string | null;
    region?: string | null;
    country?: string | null;
  } = {}) => {
    fetchAllNews({
      category: overrides.category ?? selectedCategory ?? undefined,
      timeFrame: overrides.timeFrame ?? selectedTimeFrame ?? undefined,
      region: overrides.region ?? undefined, // treat null/undefined as "All"
      country: overrides.country ?? undefined,
    });
  };

  return (
    <main className="flex-1 h-full md:px-[50px] px-[20px] md:py-[53px] rounded-[10px] ">
      {/* Header */}
      <header className="flex justify-between mb-[35px] md:flex-row flex-col gap-y-7 ">
        <p className="text-[20px] md:text-[28px] font-bold">Live News Feed</p>

        <div className="flex gap-[12.18px] self-end flex-wrap w-full md:w-fit">
          <div className="flex gap-[12.18px] w-full md:w-fit">
            {/* Category Select */}
            <CategorySelect
              onChange={(val) => {
                fetchNewsWithFilters({ category: val ?? undefined });
              }}
            />

            {/* Time Frame Select */}
            <TimeFrameSelect
              onChange={(val) => {
                fetchNewsWithFilters({ timeFrame: val ?? undefined });
              }}
            />
          </div>

          {/* Country Select */}
          <CountrySearchSelect
            label="Country"
            value={selectedCountry ?? "all"}
            onChange={(val) => {
              const countryId = val === "all" ? undefined : val;
              setSelectedCountry(val === "all" ? null : val);
              fetchNewsWithFilters({ country: countryId });
            }}
          />

        </div>
      </header>

      {/* Feed Section */}
      <section className="flex flex-col md:gap-[32px] gap-[20px]">
        {loading && news.length === 0 && (
          <>
            {Array.from({ length: 5 }).map((_, i) => (
              <NewsSkeleton key={i} />
            ))}
          </>
        )}

        {error && <p className="text-red-500">⚠️ {error}</p>}
        {!loading && !error && news.length === 0 && (
          <p className="text-gray-400">No news articles available.</p>
        )}

        {news.map((article, index) => {
          const isLast = index === news.length - 1;
          return (
            <div key={article.id} ref={isLast ? lastElementRef : null}>
              <NewsContent article={article} />
            </div>
          );
        })}

        {loading && news.length > 0 && (
          <p className="text-gray-500 text-center py-4">Loading more news...</p>
        )}
      </section>
    </main>
  );
}
