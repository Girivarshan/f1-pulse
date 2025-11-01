
/**
 * Defines the structure for an article link object.
 * Note: This data is not currently used in the application but is preserved for potential future features.
 */
export interface F1ComArticle {
  /** The title of the article. */
  title: string;
  /** The direct URL to the article. */
  url: string;
}

/**
 * A list of sample articles with their titles and URLs.
 * This could be used for a feature that allows users to select from a pre-populated list
 * of recent news articles to analyze.
 */
export const f1ComArticles: F1ComArticle[] = [
  {
    title: "Verstappen beats Norris in Spanish GP",
    url: "https://www.bbc.com/sport/formula1/articles/c0001prg0zno",
  },
  {
    title: "Hamilton 'back in the race' with podium",
    url: "https://www.bbc.com/sport/formula1/articles/cxxxy959wz0o",
  },
  {
    title: "Sainz criticises Ferrari team-mate Leclerc",
    url: "https://www.bbc.com/sport/formula1/articles/c299299vjv5o",
  },
  {
    title: "What happened to McLaren's strategy?",
    url: "https://www.bbc.com/sport/formula1/articles/c988p99g4vjo",
  },
  {
    title: "Alpine's Gasly on 'painful' situation",
    url: "https://www.bbc.com/sport/formula1/articles/c4nn9ggyd10o",
  },
  {
    title: "Canadian Grand Prix race report",
    url: "https://www.bbc.com/sport/formula1/articles/c0vv71415vjo",
  },
  {
    title: "Ocon to leave Alpine at end of season",
    url: "https://www.bbc.com/sport/formula1/articles/cprr9g32dpro",
  },
];
