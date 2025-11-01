
/**
 * Enum representing the possible sentiment classifications for an article.
 */
export enum Sentiment {
  Positive = 'Positive',
  Neutral = 'Neutral',
  Negative = 'Negative',
}

/**
 * Interface for the structured result of a single article analysis.
 */
export interface AnalysisResult {
  /** A concise summary of the article's main points. */
  summary: string;
  /** An array of key topics, such as drivers, teams, or technical terms. */
  keywords: string[];
  /** The overall sentiment of the article. */
  sentiment: Sentiment;
  /** A brief, one-sentence explanation for the sentiment classification. */
  sentimentReason: string;
}

/**
 * Interface for an item stored in the analysis history.
 */
export interface HistoryItem {
  /** A unique identifier for the history item, typically a timestamp. */
  id: number;
  /** The source of the analysis, either a URL or a snippet of the article text. */
  source: string;
  /** The full analysis result object for this item. */
  result: AnalysisResult;
  /** The ISO 8601 timestamp of when the analysis was performed. */
  date: string;
}

/**
 * Interface for the data used to display a preview of an article fetched from a URL.
 */
export interface PreviewData {
  /** The title of the article. */
  title: string;
  /** A short description or snippet from the article. */
  snippet: string;
  /** The original URL of the article. */
  url: string;
}
