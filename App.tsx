
import React, { useState, useCallback, useEffect } from 'react';
import { AnalysisResult, Sentiment, HistoryItem, PreviewData } from './types';
import { analyzeArticle } from './services/geminiService';
import { fetchArticlePreview, fetchArticleText } from './services/articleFetcher';
import Spinner from './components/Spinner';
import AnalysisResultDisplay from './components/AnalysisResultDisplay';
import { exampleArticles } from './data/exampleArticles';
import { featuredArticle } from './data/featuredArticle';
import { XCircleIcon } from './components/icons/SentimentIcons';
import AboutModal from './components/AboutModal';
import HistorySidebar from './components/HistorySidebar';
import { HistoryIcon } from './components/icons/HistoryIcon';
import AnalysisResultSkeleton from './components/AnalysisResultSkeleton';
import UrlPreview from './components/UrlPreview';

// Define the maximum number of items to keep in the analysis history.
const MAX_HISTORY_ITEMS = 15;

/**
 * The main application component for F1 Pulse.
 * It manages the application's state, handles user interactions, and orchestrates
 * the analysis process by coordinating with various services and sub-components.
 */
const App: React.FC = () => {
  // State for managing the active input tab ('url' or 'text').
  const [inputType, setInputType] = useState<'text' | 'url'>('url');
  // State for the text pasted by the user.
  const [articleText, setArticleText] = useState('');
  // State for the URL entered by the user.
  const [url, setUrl] = useState('');
  // State for the full article text fetched from a URL.
  const [fetchedArticleText, setFetchedArticleText] = useState<string | null>(null);
  
  // State for the article preview data fetched from a URL.
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  // State to track if the URL preview is currently being loaded.
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  // State to store any errors that occur during the preview fetching process.
  const [previewError, setPreviewError] = useState<string | null>(null);
  
  // State for the current analysis result. Initialized with a featured article.
  const [result, setResult] = useState<AnalysisResult | null>(featuredArticle);
  // State to store the source of the current analysis (e.g., URL or text snippet).
  const [currentSource, setCurrentSource] = useState<string | null>("Featured: Leclerc's Monaco Pole");
  // State to track if an analysis is in progress.
  const [isLoading, setIsLoading] = useState(false);
  // State to store any errors from the main analysis process.
  const [error, setError] = useState<string | null>(null);
  // State to control the visibility of the "About" modal.
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  // State to store the list of past analysis results.
  const [history, setHistory] = useState<HistoryItem[]>([]);
  // State to control the visibility of the history sidebar.
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  // State to track if the app is in its initial state (showing the featured article).
  const [isInitialState, setIsInitialState] = useState(true);

  // useEffect hook to run on initial component mount.
  useEffect(() => {
    // Attempt to load analysis history from localStorage.
    try {
      const storedHistory = localStorage.getItem('f1PulseHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to load history from localStorage:", e);
      localStorage.removeItem('f1PulseHistory'); // Clear corrupted data.
    }
    
    // Check for a shared summary in the URL parameters.
    const urlParams = new URLSearchParams(window.location.search);
    const sharedSummary = urlParams.get('summary');

    if (sharedSummary) {
      try {
        // Decode and display the shared summary.
        const decodedSummary = decodeURIComponent(sharedSummary);
        
        const sharedResult: AnalysisResult = {
          summary: decodedSummary,
          keywords: [],
          sentiment: Sentiment.Neutral,
          sentimentReason: "Analysis details are not available for a shared summary.",
        };
        
        setIsInitialState(false);
        setResult(sharedResult);
        setCurrentSource("From a shared link");
        // Clean the URL to remove the summary parameter.
        window.history.replaceState({}, document.title, window.location.pathname);

      } catch (error) {
        console.error("Failed to decode shared summary from URL:", error);
        setError("The shared link is invalid or corrupted.");
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []); // The empty dependency array ensures this runs only once.

  /**
   * Handles changes to the URL input field.
   * Clears any existing preview data or errors when the URL is modified.
   */
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    // Reset preview state if the user starts typing a new URL.
    if (previewData || previewError) {
      setPreviewData(null);
      setPreviewError(null);
      setFetchedArticleText(null);
    }
  };

  /**
   * Fetches the article preview and full text from the provided URL.
   * Manages loading and error states for the preview process.
   */
  const handleFetchPreview = useCallback(async () => {
    if (!url.trim()) return;

    // Basic URL validation.
    try {
      new URL(url);
    } catch (_) {
      setPreviewError("Please enter a valid URL (e.g., https://example.com).");
      return;
    }

    // Set loading states and clear previous data.
    setIsPreviewLoading(true);
    setPreviewError(null);
    setPreviewData(null);
    setFetchedArticleText(null);

    try {
      // Fetch both preview and full text concurrently.
      const [preview, fullText] = await Promise.all([
        fetchArticlePreview(url),
        fetchArticleText(url)
      ]);
      setPreviewData(preview);
      setFetchedArticleText(fullText);
    } catch (err) {
      setPreviewError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsPreviewLoading(false);
    }
  }, [url]);

  /**
   * Initiates the article analysis process using the Gemini API.
   * It handles both pasted text and text fetched from a URL.
   */
  const handleAnalyze = useCallback(async () => {
    // Determine the source of the text to analyze.
    const textToAnalyze = inputType === 'text' ? articleText : fetchedArticleText;
    
    if (isLoading || !textToAnalyze || !textToAnalyze.trim()) return;

    // Set loading state and reset previous results/errors.
    setIsLoading(true);
    setError(null);
    setResult(null);
    setCurrentSource(null);
    setIsInitialState(false);

    try {
      // Call the Gemini service to analyze the article.
      const analysis = await analyzeArticle(textToAnalyze);
      setResult(analysis);

      // Create a new history item.
      const newHistoryItem: HistoryItem = {
        id: Date.now(),
        source: inputType === 'url' ? url : `${analysis.summary.substring(0, 50)}...`,
        result: analysis,
        date: new Date().toISOString(),
      };
      
      setCurrentSource(newHistoryItem.source);

      // Update the history state and save to localStorage.
      setHistory(prevHistory => {
        const updatedHistory = [newHistoryItem, ...prevHistory].slice(0, MAX_HISTORY_ITEMS);
        localStorage.setItem('f1PulseHistory', JSON.stringify(updatedHistory));
        return updatedHistory;
      });

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [articleText, fetchedArticleText, inputType, url, isLoading]);

  /**
   * Populates the text area with the content of a selected example article.
   */
  const handleSelectExample = useCallback((text: string) => {
    if (isLoading) return;
    setInputType('text'); // Switch to the text tab.
    setArticleText(text);
  }, [isLoading]);
  
  /**
   * Loads a selected item from the history into the main view.
   */
  const handleSelectHistoryItem = useCallback((item: HistoryItem) => {
    setResult(item.result);
    setCurrentSource(item.source);
    setError(null);
    setIsHistoryOpen(false);
    setIsInitialState(false);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top.
  }, []);

  /**
   * Clears the entire analysis history from state and localStorage.
   */
  const handleClearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem('f1PulseHistory');
  }, []);

  // Determine if the "Analyze Article" button should be disabled.
  const isAnalyzeDisabled = isLoading || (inputType === 'text' && !articleText.trim()) || (inputType === 'url' && !fetchedArticleText);

  /**
   * A reusable component for the input type tabs (Paste Text / From URL).
   */
  const TabButton: React.FC<{ title: string; active: boolean; onClick: () => void; }> = ({ title, active, onClick }) => (
    <button
      onClick={onClick}
      role="tab"
      aria-selected={active}
      className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors duration-200 ${
        active
          ? 'text-cyan-400 border-cyan-400'
          : 'text-gray-500 border-transparent hover:text-gray-300 hover:border-gray-600'
      }`}
    >
      {title}
    </button>
  );

  return (
    <div className="min-h-screen text-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">F1 Pulse</h1>
            <p className="text-lg text-gray-400 mt-1">Your Race, Summarized in Seconds.</p>
          </div>
          <button
            onClick={() => setIsHistoryOpen(true)}
            className="flex items-center space-x-2 rounded-lg bg-white/5 px-4 py-2 text-sm text-gray-300 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white border border-white/10"
            aria-label="Open analysis history"
          >
            <HistoryIcon className="w-5 h-5" />
            <span>History</span>
          </button>
        </header>

        <main>
          {/* Main input card */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/10">
            <div className="flex border-b border-white/10 mb-6">
                <TabButton title="From URL" active={inputType === 'url'} onClick={() => setInputType('url')} />
                <TabButton title="Paste Text" active={inputType === 'text'} onClick={() => setInputType('text')} />
            </div>

            {/* Conditional rendering based on the selected input type */}
            {inputType === 'url' ? (
                <div>
                  <label htmlFor="url-input" className="sr-only">Paste Article URL</label>
                  <div className="flex items-center space-x-2">
                      <input
                          id="url-input"
                          type="url"
                          value={url}
                          onChange={handleUrlChange}
                          placeholder="https://www.example.com/f1-article..."
                          className="flex-grow p-3 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300 text-gray-200 placeholder:text-gray-500"
                          disabled={isLoading || isPreviewLoading}
                      />
                      <button
                          onClick={handleFetchPreview}
                          disabled={!url.trim() || isPreviewLoading}
                          className="flex items-center justify-center px-5 py-3 bg-cyan-600/50 text-white font-bold rounded-lg transition-all duration-300 hover:bg-cyan-600/80 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:bg-gray-600/50 disabled:cursor-not-allowed"
                      >
                         {isPreviewLoading && <Spinner className="w-5 h-5 mr-2" />}
                         {isPreviewLoading ? 'Fetching...' : 'Fetch & Preview'}
                      </button>
                  </div>
                  <UrlPreview data={previewData} isLoading={isPreviewLoading} error={previewError} />
                </div>
            ) : (
                <div>
                  <label htmlFor="article-input" className="sr-only">Paste F1 News Article</label>
                  <textarea
                    id="article-input"
                    value={articleText}
                    onChange={(e) => setArticleText(e.target.value)}
                    placeholder="Paste the full text of an F1 news article here..."
                    className="w-full h-64 p-4 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300 resize-y text-gray-200 placeholder:text-gray-500"
                    disabled={isLoading}
                  />
                  <div className="mt-4">
                      <p className="text-sm text-gray-400 mb-2">Or try an example article:</p>
                      <div className="flex flex-wrap gap-2">
                          {exampleArticles.map((article) => (
                              <button 
                                  key={article.title} 
                                  onClick={() => handleSelectExample(article.text)}
                                  disabled={isLoading}
                                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-medium rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                  {article.title}
                              </button>
                          ))}
                      </div>
                  </div>
                </div>
            )}

            {/* Action button to trigger the analysis */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzeDisabled}
                className="glow-shadow flex items-center justify-center px-8 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-500/50 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none"
              >
                {isLoading && <Spinner className="w-5 h-5 mr-3" />}
                {isLoading ? 'Analyzing...' : 'Analyze Article'}
              </button>
            </div>
          </div>
          
          {/* Analysis result display area */}
          <div className="mt-12 min-h-[20rem]">
            {isLoading ? (
              <AnalysisResultSkeleton /> // Show a skeleton loader while analyzing.
            ) : error ? (
              // Show an error message if the analysis fails.
              <div className="flex items-start space-x-4 bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-lg animate-fade-in backdrop-blur-sm">
                <XCircleIcon className="w-6 h-6 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold">Analysis Failed</h3>
                  <p>{error}</p>
                </div>
              </div>
            ) : result ? (
              // Display the analysis result.
              <>
                {isInitialState && (
                   <div className="text-center mb-6 animate-fade-in">
                      <h2 className="text-lg font-semibold tracking-wider text-cyan-400 uppercase">Featured Analysis</h2>
                  </div>
                )}
                <AnalysisResultDisplay result={result} source={currentSource} />
              </>
            ) : (
              // Show a placeholder message when there is no result to display.
              <div className="text-center text-gray-600 flex flex-col items-center justify-center h-full pt-10">
                 <p className="text-lg">Your F1 analysis will appear here.</p>
              </div>
            )}
          </div>
        </main>
        
        <footer className="text-center mt-16 text-gray-600 text-sm">
          <p>Powered by Google Gemini API</p>
           <button 
            onClick={() => setIsAboutModalOpen(true)} 
            className="mt-2 text-gray-500 hover:text-cyan-400 transition-colors underline"
          >
            About F1 Pulse
          </button>
        </footer>
      </div>

      {/* Modals and Sidebars */}
      <AboutModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} />
      <HistorySidebar 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)}
        items={history}
        onSelect={handleSelectHistoryItem}
        onClear={handleClearHistory}
      />
    </div>
  );
};

export default App;
