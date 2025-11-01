
import { AnalysisResult, Sentiment } from "../types";

/**
 * A pre-defined analysis result that is displayed when the application first loads.
 * This serves as an example of the app's functionality and provides a welcoming
 * initial state instead of an empty screen.
 */
export const featuredArticle: AnalysisResult = {
  summary: "Charles Leclerc secured pole position for his home race, the Monaco Grand Prix, with Ferrari teammate Carlos Sainz qualifying third. McLaren's Oscar Piastri will start second, while championship leader Max Verstappen struggled to sixth place, putting Ferrari in a strong position for the race.",
  keywords: [
    "Charles Leclerc",
    "Ferrari",
    "Monaco Grand Prix",
    "Pole Position",
    "Oscar Piastri",
    "McLaren",
    "Max Verstappen",
    "Red Bull",
    "Carlos Sainz"
  ],
  sentiment: Sentiment.Positive,
  sentimentReason: "The article focuses on Leclerc's successful pole position at his home race, highlighting Ferrari's strong qualifying performance.",
};
