// src/app/_components/home/NewsSkeleton.tsx
"use client";

export default function NewsSkeleton() {
  return (
    <article className="flex md:flex-row flex-col-reverse justify-between items-start gap-4 bg-white rounded-xl p-5 animate-pulse">
      {/* Text section */}
      <div className="md:w-[60%] w-full space-y-3">
        <div className="h-3 w-24 bg-gray-200 rounded" />
        <div className="h-5 w-3/4 bg-gray-200 rounded" />
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-5/6 bg-gray-200 rounded" />
        <div className="h-4 w-2/3 bg-gray-200 rounded" />

        <div className="flex gap-3 mt-4">
          <div className="h-3 w-24 bg-gray-200 rounded" />
          <div className="h-3 w-32 bg-gray-200 rounded" />
        </div>
      </div>

      {/* Image section */}
      <div className="md:w-[35%] w-full">
        <div className="w-full h-[200px] bg-gray-200 rounded-md" />
      </div>
    </article>
  );
}
