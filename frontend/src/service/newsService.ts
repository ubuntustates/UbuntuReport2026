// src/service/newsService.ts

import axios from "axios";
import { DJANGO_API } from "@/utils/MyConstants";

/**
 * ------------------------------
 *  Interfaces
 * ------------------------------
 */

export interface NewsArticle {
  id: number;
  title: string;
  link: string;
  category: string;
  region?: string | null;
  country?: string | null;
  published: string;
  summary: string;
  source: string;
  image?: string | null;
}

export interface Region {
  id: number;
  name: string;
}

export interface Country {
  id: number;
  name: string;
  region_id?: number | null;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/**
 * ------------------------------
 *  Axios Setup
 * ------------------------------
 */

const api = axios.create({
  baseURL: DJANGO_API,
  headers: { "Content-Type": "application/json" },
});

/**
 * ------------------------------
 *  Utility Helpers
 * ------------------------------
 */

const formatTimeFrame = (value?: string): string | undefined => {
  if (!value) return undefined;
  return value.trim().toLowerCase().replace(/\s+/g, "_");
};

const buildQuery = (params: Record<string, string | number | undefined>): string => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) search.append(key, String(value));
  });
  return search.toString() ? `?${search.toString()}` : "";
};

/**
 * ------------------------------
 *  API Functions
 * ------------------------------
 */

/** Fetch all news with optional filters */
export const fetchNews = async (
  params: { timeFrame?: string; category?: string; region?: string; country?: string } = {}
): Promise<PaginatedResponse<NewsArticle>> => {
  const query = buildQuery({
    time_frame: formatTimeFrame(params.timeFrame),
    category: params.category,
    region: params.region,
    country: params.country,
  });
  const res = await api.get<PaginatedResponse<NewsArticle>>(`/news/${query}`);
  return res.data;
};

/** Fetch news by category only */
export const fetchNewsByCategory = async (
  category: string,
  timeFrame?: string
): Promise<PaginatedResponse<NewsArticle>> => fetchNews({ category, timeFrame });

/** Fetch news by time frame only */
export const fetchNewsByTimeFrame = async (
  timeFrame: string
): Promise<PaginatedResponse<NewsArticle>> => fetchNews({ timeFrame });

/** Fetch news by region */
export const fetchNewsByRegion = async (
  region: string,
  timeFrame?: string
): Promise<PaginatedResponse<NewsArticle>> => fetchNews({ region, timeFrame });

/** Fetch news by country */
export const fetchNewsByCountry = async (
  country: string,
  timeFrame?: string
): Promise<PaginatedResponse<NewsArticle>> => fetchNews({ country, timeFrame });

/** Fetch next page (absolute or relative URL) */
export const fetchNextPageFromUrl = async (
  nextUrl: string
): Promise<PaginatedResponse<NewsArticle>> => {
  const url = nextUrl.startsWith("http") ? nextUrl : `${DJANGO_API}${nextUrl}`;
  const res = await axios.get<PaginatedResponse<NewsArticle>>(url);
  return res.data;
};

/** Fetch all unique categories */
export const fetchCategories = async (): Promise<string[]> => {
  const res = await api.get<string[]>("/categories/");
  return res.data;
};

/** Fetch all regions that have news */
export const fetchRegions = async (): Promise<Region[]> => {
  const res = await api.get<Region[]>("/regions/");
  return res.data;
};

/** Fetch all countries that have news */
export const fetchCountries = async (): Promise<Country[]> => {
  const res = await api.get<Country[]>("/countries/");
  return res.data;
};

export default api;
