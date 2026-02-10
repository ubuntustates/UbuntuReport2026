// src/app/_components/home/NewsContent.tsx

"use client";
import { useEffect, useState } from "react";
import type { NewsArticle } from "@/service/newsService";
import { FALLBACK_NEWS_IMAGE } from "@/utils/MyConstants";

interface NewsContentProps {
  article: NewsArticle;
}

export default function NewsContent({ article }: NewsContentProps) {
  const [formattedTime, setFormattedTime] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [showExpand, setShowExpand] = useState(false);

  const SUMMARY_LIMIT = 180;

  // ⏱ Relative time formatting
  const getRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) return "just now";
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
    return `${years} year${years > 1 ? "s" : ""} ago`;
  };

  useEffect(() => {
    if (article.published) {
      setFormattedTime(getRelativeTime(article.published));
    }

    if (article.summary && article.summary.length > SUMMARY_LIMIT) {
      setShowExpand(true);
    }

    const interval = setInterval(() => {
      if (article.published) setFormattedTime(getRelativeTime(article.published));
    }, 60000);

    return () => clearInterval(interval);
  }, [article.published, article.summary]);

  const displayedSummary =
    article.summary && !isExpanded && showExpand
      ? article.summary.slice(0, SUMMARY_LIMIT) + "..."
      : article.summary;

  // Format category nicely: replace _ or - with spaces and capitalize each word
  const formattedCategory = article.category
    ? article.category
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase())
    : "Uncategorized";

  const handleReadMore = () => {
    window.open(article.link, "_blank", "noopener,noreferrer");
  };

  return (
    <article className="flex md:flex-row flex-col-reverse justify-between items-start gap-4 bg-white rounded-xl p-5">
      {/* Text section */}
      <div className="md:w-[60%] w-full">
        <p className="text-[#994D4D] text-[13px] mb-1">{formattedTime}</p>

        <h2 className="font-semibold text-[16px] md:text-[18px] leading-snug mb-2">
          {article.title}
        </h2>

        {article.summary && (
          <p className="text-gray-700 text-[14px] break-words leading-relaxed mb-2">
            {displayedSummary}
          </p>
        )}

        {showExpand ? (
          <button
            onClick={() => {
              if (!isExpanded) {
                setIsExpanded(true);
              } else {
                handleReadMore();
              }
            }}
            className="text-blue-600 text-[14px] underline hover:text-blue-800"
          >
            {!isExpanded ? "Read more →" : "Read full article →"}
          </button>
        ) : (
          <button
            onClick={handleReadMore}
            className="text-blue-600 text-[14px] underline hover:text-blue-800"
          >
            Read full article →
          </button>
        )}

        {/* Source & Category */}
        <div className="mt-3 text-[13px] text-gray-500 flex flex-wrap gap-2">
          <span>Source: {article.source}</span>
          <span>•</span>
          <span>Category: {formattedCategory}</span>
        </div>

        {/* Region & Country */}
        <div className="mt-1 text-[13px] text-gray-500 flex flex-wrap gap-2">
          {article.region && <span>Region: {article.region}</span>}
          {article.country && <span>Country: {article.country}</span>}
        </div>
      </div>

      {/* Image section */}
      <div className="md:w-[35%] w-full flex justify-center items-center">
        {article.image ? (
          <img
            src={article.image || FALLBACK_NEWS_IMAGE}
            alt={article.title}
            width={400}
            height={250}
            className="rounded-md object-cover w-full h-auto"
            onError={(e) => {
              const target = e.currentTarget;
              if (target.src !== FALLBACK_NEWS_IMAGE) {
                target.src = FALLBACK_NEWS_IMAGE;
              }
            }}
          />
        ) : (
          <div className="w-full h-[200px] bg-gray-200 rounded-md flex items-center justify-center text-gray-500 text-sm">
            No image available
          </div>
        )}
      </div>
    </article>
  );
}
