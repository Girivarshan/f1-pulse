
import React, { useState, useCallback } from 'react';
import { AnalysisResult, Sentiment } from '../types';
import { CheckCircleIcon, MinusCircleIcon, XCircleIcon } from './icons/SentimentIcons';
import { CopyIcon } from './icons/CopyIcon';
import { ShareIcon } from './icons/ShareIcon';

interface AnalysisResultDisplayProps {
  /** The analysis result object to display. */
  result: AnalysisResult;
  /** The source of the article (URL or text snippet), optional. */
  source?: string | null;
}

// Configuration object to map sentiment values to specific styles and icons.
const sentimentStyles: Record<Sentiment, { icon: React.ReactElement; gradient: string; borderColor: string; title: string; textColor: string; }> = {
  [Sentiment.Positive]: {
    icon: <CheckCircleIcon className="w-10 h-10" />,
    gradient: 'bg-gradient-to-br from-green-500/20 to-cyan-500/20',
    borderColor: 'border-green-400/30',
    title: 'Positive Sentiment',
    textColor: 'text-green-300'
  },
  [Sentiment.Neutral]: {
    icon: <MinusCircleIcon className="w-10 h-10" />,
    gradient: 'bg-white/5',
    borderColor: 'border-white/10',
    title: 'Neutral Sentiment',
    textColor: 'text-gray-300'
  },
  [Sentiment.Negative]: {
    icon: <XCircleIcon className="w-10 h-10" />,
    gradient: 'bg-gradient-to-br from-red-500/20 to-orange-500/20',
    borderColor: 'border-red-400/30',
    title: 'Negative Sentiment',
    textColor: 'text-red-300'
  },
};

/**
 * A reusable styled container component for displaying sections of the analysis.
 */
const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <div className={`bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 ${className}`}>
    {children}
  </div>
);

/**
 * Displays the formatted results of an article analysis, including summary,
 * sentiment, and hot topics.
 */
const AnalysisResultDisplay: React.FC<AnalysisResultDisplayProps> = ({ result, source }) => {
  const { summary, keywords, sentiment, sentimentReason } = result;
  const currentSentimentStyle = sentimentStyles[sentiment];

  // State to provide user feedback when the summary is copied.
  const [isCopied, setIsCopied] = useState(false);
  // State to provide user feedback when the share link is copied.
  const [isLinkCopied, setIsLinkCopied] = useState(false);

  /**
   * Copies the article summary to the user's clipboard.
   */
  const handleCopy = useCallback(() => {
    if (isCopied) return;
    navigator.clipboard.writeText(summary).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds.
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  }, [summary, isCopied]);

  /**
   * Handles sharing the analysis summary.
   * Uses the Web Share API if available, otherwise copies a shareable link to the clipboard.
   */
  const handleShare = useCallback(() => {
    if (isLinkCopied) return;

    // Create a URL with the summary encoded as a query parameter.
    const encodedSummary = encodeURIComponent(summary);
    const shareUrl = `${window.location.origin}${window.location.pathname}?summary=${encodedSummary}`;

    // Use the native Web Share API if supported by the browser.
    if (navigator.share) {
      navigator.share({
        title: 'F1 Pulse Analysis',
        text: 'Check out this F1 article summary:',
        url: shareUrl,
      }).catch(err => {
        // Ignore AbortError which occurs when the user cancels the share dialog.
        if (err.name !== 'AbortError') {
          console.error('Error using Web Share API:', err);
        }
      });
    } else {
      // Fallback for browsers that don't support the Web Share API.
      navigator.clipboard.writeText(shareUrl).then(() => {
        setIsLinkCopied(true);
        setTimeout(() => setIsLinkCopied(false), 2000);
      }).catch(err => {
        console.error('Failed to copy share link: ', err);
      });
    }
  }, [summary, isLinkCopied]);

  /**
   * A reusable component for action buttons like Share and Copy.
   */
  const ActionButton: React.FC<{ onClick: () => void; disabled: boolean; icon: React.ReactNode; text: string; label: string }> = ({ onClick, disabled, icon, text, label}) => (
     <button
        onClick={onClick}
        className="flex items-center space-x-2 text-sm font-medium text-gray-400 hover:text-cyan-300 bg-black/20 hover:bg-black/40 px-3 py-1.5 rounded-full transition-colors disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:text-gray-400"
        disabled={disabled}
        aria-label={label}
      >
        {icon}
        <span>{text}</span>
      </button>
  );


  return (
    <div className="space-y-6 animate-fade-in">
      {/* Source Card: Only shown if a source is provided. */}
      {source && (
        <Card>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Analysis Source</h3>
          <p className="text-gray-200 truncate" title={source}>
            {/* Make the source a clickable link if it's a URL. */}
            {source.startsWith('http') ? (
              <a href={source} target="_blank" rel="noopener noreferrer" className="hover:underline text-cyan-400">
                {source}
              </a>
            ) : (
              source
            )}
          </p>
        </Card>
      )}

      {/* Sentiment Banner */}
      <div className={`flex items-center space-x-5 p-6 rounded-xl border backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1 ${currentSentimentStyle.borderColor} ${currentSentimentStyle.gradient} ${currentSentimentStyle.textColor}`}>
        <div className="flex-shrink-0">
            {currentSentimentStyle.icon}
        </div>
        <div className="flex-1">
          <span className="text-2xl font-bold tracking-tight">{currentSentimentStyle.title}</span>
          <p className="text-sm text-gray-400 mt-1">{sentimentReason}</p>
        </div>
      </div>

      {/* Main content grid for Summary and Hot Topics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <Card>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight">Summary</h3>
                <div className="flex items-center space-x-2">
                  <ActionButton onClick={handleShare} disabled={isLinkCopied} icon={<ShareIcon className="w-4 h-4" />} text={isLinkCopied ? 'Link Copied!' : 'Share'} label="Share analysis" />
                  <ActionButton onClick={handleCopy} disabled={isCopied} icon={<CopyIcon className="w-4 h-4" />} text={isCopied ? 'Copied!' : 'Copy'} label="Copy summary" />
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">{summary}</p>
            </Card>
        </div>
        <div>
            <Card>
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight mb-4">Hot Topics</h3>
                <div className="flex flex-wrap gap-2">
                {keywords.length > 0 ? keywords.map((keyword, index) => (
                    <span key={index} className="bg-cyan-400/10 text-cyan-300 text-sm font-medium px-3 py-1.5 rounded-full border border-cyan-400/20">
                    {keyword}
                    </span>
                )) : <p className="text-sm text-gray-400">No topics available.</p>}
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResultDisplay;
