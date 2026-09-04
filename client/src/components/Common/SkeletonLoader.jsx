import React from 'react';

const SkeletonLoader = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Hero Skeleton */}
      <div className="rounded-3xl p-8 bg-white/5 border border-white/10 h-72 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <div className="h-8 w-48 bg-white/10 rounded-lg"></div>
            <div className="h-4 w-32 bg-white/10 rounded-lg"></div>
          </div>
          <div className="h-16 w-16 bg-white/10 rounded-full"></div>
        </div>

        <div className="space-y-2">
          <div className="h-16 w-36 bg-white/10 rounded-xl"></div>
          <div className="h-4 w-64 bg-white/10 rounded-lg"></div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <div className="h-10 bg-white/10 rounded-xl"></div>
          <div className="h-10 bg-white/10 rounded-xl"></div>
          <div className="h-10 bg-white/10 rounded-xl"></div>
          <div className="h-10 bg-white/10 rounded-xl"></div>
        </div>
      </div>

      {/* Insights Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="h-36 bg-white/5 border border-white/10 rounded-2xl"></div>
        <div className="h-36 bg-white/5 border border-white/10 rounded-2xl"></div>
        <div className="h-36 bg-white/5 border border-white/10 rounded-2xl"></div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
