
import React from 'react';
import { PreviewData } from '../types';
import UrlPreviewSkeleton from './UrlPreviewSkeleton';

interface UrlPreviewProps {
  /** The preview data object, or null if no data is available. */
  data: PreviewData | null;
  /** Boolean indicating if the preview is currently being fetched. */
  isLoading: boolean;
  /** An error message string, or null if no error occurred. */
  error: string | null;
}

// Define a maximum length for the displayed snippet to keep the UI clean.
const SNIPPET_MAX_LENGTH = 280;

/**
 * A component to display a preview of an article from a URL.
 * It handles loading, error, and success states.
 */
const UrlPreview: React.FC<UrlPreviewProps> = ({ data, isLoading, error }) => {
  // Show a skeleton loader while the preview is being fetched.
  if (isLoading) {
    return <UrlPreviewSkeleton />;
  }

  // Display an error message if the fetch failed.
  if (error) {
    return (
      <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 text-red-300 rounded-lg animate-fade-in text-sm">
        <p className="font-semibold">Could Not Load Preview</p>
        <p className="text-red-300/80">{error}</p>
      </div>
    );
  }

  // Do not render anything if there is no data, loading, or error.
  if (!data) {
    return null;
  }

  // Truncate the snippet if it exceeds the maximum length.
  const isSnippetLong = data.snippet.length > SNIPPET_MAX_LENGTH;
  const displaySnippet = isSnippetLong ? `${data.snippet.substring(0, SNIPPET_MAX_LENGTH)}...` : data.snippet;

  return (
    <div className="mt-4 bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10 animate-fade-in">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Article Preview</h4>
      <h5 className="font-bold text-gray-100">{data.title}</h5>
      <p className="text-sm text-gray-400 mt-2 leading-relaxed">
        {displaySnippet}
        {/* If the snippet was truncated, add a "Read More" link. */}
        {isSnippetLong && (
          <a href={data.url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline ml-1 font-semibold whitespace-nowrap">
            Read More
          </a>
        )}
      </p>
    </div>
  );
};

export default UrlPreview;
