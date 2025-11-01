
import { PreviewData } from '../types';

/**
 * Attempts to extract the main article content from JSON-LD structured data
 * embedded in the page. This is often the most reliable method for well-structured sites.
 * @param doc The parsed HTML document.
 * @returns The article text as a string, or null if not found.
 */
function extractContentFromJsonLd(doc: Document): string | null {
  const scripts = doc.querySelectorAll('script[type="application/ld+json"]');
  for (const script of Array.from(scripts)) {
    try {
      if (!script.textContent) continue;
      const json = JSON.parse(script.textContent);
      
      // JSON-LD can be a single object or an array under a @graph property.
      const graph = json['@graph'] || (Array.isArray(json) ? json : [json]);

      for (const item of graph) {
        // Look for items typed as 'Article' or similar with a substantial 'articleBody'.
        if (
          item &&
          ['Article', 'NewsArticle', 'BlogPosting'].includes(item['@type']) &&
          typeof item.articleBody === 'string' &&
          item.articleBody.length > 100 // Heuristic to avoid empty or tiny bodies.
        ) {
          // Convert HTML within articleBody to plain text.
          const tempEl = doc.createElement('div');
          tempEl.innerHTML = item.articleBody;
          const cleanText = tempEl.textContent || "";
          // Normalize whitespace.
          return cleanText.replace(/\s\s+/g, '\n').trim();
        }
      }
    } catch (e) {
      console.warn("Could not parse a JSON-LD script tag:", e);
    }
  }
  return null;
}


/**
 * Removes common non-content elements from the document body to improve
 * the quality of text extraction when falling back to DOM parsing.
 * @param doc The parsed HTML document to be cleaned.
 */
function removeClutter(doc: Document): void {
  const selectorsToRemove = [
    'script', 'style', 'nav', 'footer', 'aside', 'header',
    '[role="navigation"]', '[role="banner"]', '[role="complementary"]', '[role="contentinfo"]',
    '.ad', '.ads', '.advert', '.advertisement', '.sidebar', '.comments', '#comments', '.cookie-banner'
  ];

  doc.querySelectorAll(selectorsToRemove.join(', ')).forEach(el => el.remove());
}


/**
 * Extracts the main text content from an HTML string using a multi-step process.
 * It first tries to find JSON-LD data, then falls back to cleaning the DOM and
 * looking for common article container elements.
 * @param html The HTML content of the page as a string.
 * @returns The extracted text content, or an empty string if extraction fails.
 */
function extractMainContent(html: string): string {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // First, try the most reliable method: JSON-LD.
    const jsonLdText = extractContentFromJsonLd(doc);
    if (jsonLdText) {
      return jsonLdText;
    }
    
    // If JSON-LD fails, fall back to DOM parsing. Start by removing clutter.
    removeClutter(doc);
    
    // Look for common semantic tags or class names for articles.
    const contentSelectors = [
        'article', '.article', '.article-body', '#article-body', 
        '.entry-content', '.post-body', '.post-content', 
        '#main-content', '.story-content', 'main'
    ];
    
    // Find the best candidate for the main content container, or default to the body.
    const contentElement = doc.querySelector(contentSelectors.join(', ')) || doc.body;

    // Extract text from paragraph, heading, and list item tags.
    const textBlocks = contentElement.querySelectorAll('p, h1, h2, h3, li, blockquote');
    
    // If no specific blocks are found, extract all text content from the container.
    if (textBlocks.length === 0) {
        return contentElement.textContent?.replace(/\s\s+/g, '\n').trim() || '';
    }

    // Join the text from found blocks, filtering out short/irrelevant lines.
    const text = Array.from(textBlocks)
      .map(block => block.textContent?.trim())
      .filter(text => text && text.length > 20) // Heuristic to remove short navigation links etc.
      .join('\n\n');
      
    return text.trim();
  } catch (error) {
    console.error("Error parsing HTML during content extraction:", error);
    return '';
  }
}

/**
 * Fetches the content of a URL using a CORS proxy and extracts the article text.
 * @param url The URL of the article to fetch.
 * @returns A promise that resolves to the extracted article text.
 * @throws An error if the article cannot be fetched or meaningful content cannot be extracted.
 */
export async function fetchArticleText(url: string): Promise<string> {
  // Use a CORS proxy to bypass browser's same-origin policy restrictions.
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;

  try {
    const response = await fetch(proxyUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch article. Status: ${response.status}`);
    }
    const html = await response.text();
    const articleText = extractMainContent(html);

    // Validate that the extracted text is substantial enough to be an article.
    if (!articleText || articleText.length < 100) {
      throw new Error("Could not extract meaningful article content from this URL.");
    }

    return articleText;
  } catch (error) {
    console.error("Error fetching or parsing article:", error);
    // Provide a user-friendly error message.
    throw new Error("An unexpected error occurred while processing the article. The website might be blocking requests.");
  }
}

/**
 * Fetches a URL and extracts metadata (title, description) for a preview card.
 * This is a lighter operation than fetching and parsing the full article text.
 * @param url The URL to fetch a preview for.
 * @returns A promise that resolves to the preview data.
 * @throws An error if the preview cannot be fetched or parsed.
 */
export async function fetchArticlePreview(url: string): Promise<PreviewData> {
  // Use the same CORS proxy.
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
  
  try {
    const response = await fetch(proxyUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch preview. Status: ${response.status}`);
    }
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Extract title from Open Graph meta tag, then fallback to the <title> tag.
    const title = doc.querySelector('meta[property="og:title"]')?.getAttribute('content') 
      || doc.querySelector('title')?.textContent 
      || 'No title found';
      
    // Extract description from Open Graph tag, then fallback to the meta description tag.
    const snippet = doc.querySelector('meta[property="og:description"]')?.getAttribute('content') 
      || doc.querySelector('meta[name="description"]')?.getAttribute('content') 
      || 'No description available for this article.';

    return { title: title.trim(), snippet: snippet.trim(), url };
  } catch (error) {
    console.error("Error parsing HTML for preview:", error);
    throw new Error("Could not parse the article's website to generate a preview.");
  }
}
