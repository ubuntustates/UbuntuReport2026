// src/store/newsStore.ts

import { create } from "zustand";
import {
  NewsArticle,
  fetchNews,
  fetchNewsByCategory,
  fetchCategories,
  fetchCountries,
  fetchNextPageFromUrl,
} from "@/service/newsService";

interface NewsState {
  news: NewsArticle[];
  next: string | null;
  previous: string | null;
  count: number;
  categories: string[];
  regions: { id: number; name: string }[];
  countries: { id: number; name: string; region_id?: number | null }[];
  selectedCategory: string | null;
  selectedRegion: string | null;
  selectedCountry: string | null;
  selectedTimeFrame: string | null;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;

  fetchAllNews: (filters?: {
    timeFrame?: string;
    category?: string;
    region?: string;
    country?: string;
  }) => Promise<void>;
  fetchNewsByCategory: (category: string, timeFrame?: string) => Promise<void>;
  fetchNextPage: () => Promise<void>;
  fetchAllCategories: () => Promise<void>;
  fetchAllCountries: () => Promise<void>;
  setTimeFrame: (timeFrame: string | null) => void;
  setRegion: (region: string | null) => void;
  setCountry: (country: string | null) => void;
  clearFilters: () => void;
}

export const useNewsStore = create<NewsState>((set, get) => ({
  news: [],
  next: null,
  previous: null,
  count: 0,
  categories: [],
  regions: [],
  countries: [],
  selectedCategory: null,
  selectedRegion: null,
  selectedCountry: null,
  selectedTimeFrame: null,
  loading: false,
  loadingMore: false,  
  error: null,

  /**
   * Fetch all news with optional filters
   */
  fetchAllNews: async (filters = {}) => {
    const { timeFrame, category, region, country } = filters;
    set({ loading: true, error: null, news: [] }); // 👈 important


    try {
      const data = await fetchNews({ timeFrame, category, region, country });
      set({
        news: data.results,
        next: data.next,
        previous: data.previous,
        count: data.count,
        selectedTimeFrame: timeFrame || null,
        selectedCategory: category || null,
        selectedRegion: region || null,
        selectedCountry: country || null,
        loading: false,
      });
    } catch (err: any) {
      set({
        error: err.message || "Failed to fetch news",
        loading: false,
      });
    }
  },

  /**
   * Fetch news by category (optional time frame)
   */
  fetchNewsByCategory: async (category, timeFrame) => {
    set({
      loading: true,
      error: null,
      selectedCategory: category,
      selectedTimeFrame: timeFrame || null,
    });
    try {
      const data = await fetchNewsByCategory(category, timeFrame);
      set({
        news: data.results,
        next: data.next,
        previous: data.previous,
        count: data.count,
        loading: false,
      });
    } catch (err: any) {
      set({
        error: err.message || "Failed to fetch category news",
        loading: false,
      });
    }
  },

  /**
   * Fetch next page (preserves all filters)
   */
  fetchNextPage: async () => {
    const { next } = get();
    if (!next) return;

    set({ loadingMore: true });
    try {
      const data = await fetchNextPageFromUrl(next);
      set((state) => ({
        news: [...state.news, ...data.results],
        next: data.next,
        previous: data.previous,
        count: data.count,
        loadingMore: false,
      }));
    } catch (err: any) {
      set({
        error: err.message || "Failed to fetch next page",
        loadingMore: false,
      });
    }
  },


  /**
   * Fetch all unique categories
   */
  fetchAllCategories: async () => {
    try {
      const data = await fetchCategories();
      set({ categories: data });
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch categories" });
    }
  },


  /**
   * Fetch all countries that have news
   */
  fetchAllCountries: async () => {
    try {
      const data = await fetchCountries();
      set({ countries: data });
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch countries" });
    }
  },

  /**
   * Update selected filters
   */
  setTimeFrame: (timeFrame) => set({ selectedTimeFrame: timeFrame }),
  setRegion: (region) => set({ selectedRegion: region }),
  setCountry: (country) => set({ selectedCountry: country }),

  /**
   * Clear all filters
   */
  clearFilters: () => {
    set({
      selectedCategory: null,
      selectedTimeFrame: null,
      selectedRegion: null,
      selectedCountry: null,
    });
  },
}));
