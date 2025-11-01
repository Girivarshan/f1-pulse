
import React from 'react';

/**
 * A generic, reusable skeleton element.
 */
const SkeletonElement: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`bg-white/10 rounded ${className}`} />
);

/**
 * A skeleton loader component that mimics the layout of the UrlPreview.
 * This is displayed while the article preview is being fetched.
 */
const UrlPreviewSkeleton: React.FC = () => {
  return (
    <div className="mt-4 bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10 animate-pulse">
      {/* Skeleton for the "Article Preview" heading */}
      <SkeletonElement className="h-3 w-1/4 mb-4" />
      {/* Skeleton for the article title */}
      <SkeletonElement className="h-5 w-3/4 mb-3" />
      {/* Skeleton for the snippet text */}
      <div className="space-y-2">
        <SkeletonElement className="h-3.5 w-full" />
        <SkeletonElement className="h-3.5 w-full" />
        <SkeletonElement className="h-3.5 w-5/6" />
      </div>
    </div>
  );
};

export default UrlPreviewSkeleton;
