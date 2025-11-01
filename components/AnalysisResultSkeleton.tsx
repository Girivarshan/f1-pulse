
import React from 'react';

/**
 * A reusable, generic skeleton element with a shimmer effect.
 */
const SkeletonElement: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`bg-white/10 rounded ${className}`} />
);

/**
 * A styled card container for skeleton elements.
 */
const SkeletonCard: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
    <div className={`bg-white/5 rounded-xl p-6 border border-white/10 ${className}`}>
        {children}
    </div>
);

/**
 * A skeleton loader component that mimics the layout of the AnalysisResultDisplay.
 * It's shown to the user while the analysis is in progress to indicate that content is loading.
 */
const AnalysisResultSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Sentiment Banner Skeleton */}
      <div className="flex items-center space-x-5 p-6 rounded-xl border border-white/10 bg-white/5">
        <div className="flex-shrink-0">
          <SkeletonElement className="w-10 h-10 rounded-full" />
        </div>
        <div className="flex-1 space-y-2">
          <SkeletonElement className="h-6 w-1/2" />
          <SkeletonElement className="h-4 w-3/4" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Summary Skeleton */}
        <div className="lg:col-span-2">
            <SkeletonCard>
                <SkeletonElement className="h-7 w-1/3 mb-6" />
                <div className="space-y-3">
                    <SkeletonElement className="h-4 w-full" />
                    <SkeletonElement className="h-4 w-full" />
                    <SkeletonElement className="h-4 w-5/6" />
                    <SkeletonElement className="h-4 w-3/4" />
                </div>
            </SkeletonCard>
        </div>
        
        {/* Hot Topics Skeleton */}
        <div>
            <SkeletonCard>
                <SkeletonElement className="h-7 w-1/2 mb-6" />
                <div className="flex flex-wrap gap-2">
                    <SkeletonElement className="h-8 w-20 rounded-full" />
                    <SkeletonElement className="h-8 w-24 rounded-full" />
                    <SkeletonElement className="h-8 w-16 rounded-full" />
                    <SkeletonElement className="h-8 w-28 rounded-full" />
                    <SkeletonElement className="h-8 w-20 rounded-full" />
                </div>
            </SkeletonCard>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResultSkeleton;
