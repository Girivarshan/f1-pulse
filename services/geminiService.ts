
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, Sentiment } from "../types";

// Retrieve the API key from environment variables.
const API_KEY = process.env.API_KEY;

// Ensure the API key is available, otherwise throw an error.
if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

// Initialize the Google GenAI client with the API key.
const ai = new GoogleGenAI({ apiKey: API_KEY });

// Define the JSON schema for the expected response from the Gemini API.
// This ensures the AI returns data in a consistent and predictable structure.
const responseSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "A concise summary of the article.",
    },
    keywords: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
        description: "A keyword or hot topic.",
      },
      description: "An array of keywords or hot topics from the article (drivers, teams, circuits, etc.).",
    },
    sentiment: {
      type: Type.STRING,
      enum: [Sentiment.Positive, Sentiment.Neutral, Sentiment.Negative],
      description: "The overall sentiment of the article.",
    },
    sentimentReason: {
      type: Type.STRING,
      description: "A brief, one-sentence explanation for the sentiment classification."
    }
  },
  required: ["summary", "keywords", "sentiment", "sentimentReason"],
};

/**
 * Analyzes the provided article text using the Google Gemini API.
 *
 * @param articleText The full text of the F1 news article to be analyzed.
 * @returns A promise that resolves to an `AnalysisResult` object containing the summary, keywords, and sentiment.
 * @throws An error if the API call fails or the response is not in the expected format.
 */
export async function analyzeArticle(articleText: string): Promise<AnalysisResult> {
  // Construct the prompt for the AI, providing clear instructions and the article text.
  const prompt = `
    Analyze the following Formula 1 news article. Your task is to extract key information and present it in a structured JSON format.

    Please provide:
    1. A concise summary of the article, capturing the main points.
    2. An array of keywords or "hot topics". These should include drivers, teams, circuits, key personnel, and significant technical terms mentioned.
    3. The overall sentiment of the article. This must be one of three values: 'Positive', 'Neutral', or 'Negative'.
    4. A brief, one-sentence explanation for why you chose that sentiment.

    Here is the article text:
    ---
    ${articleText}
    ---

    Respond ONLY with a valid JSON object that adheres to the schema provided. Do not include any explanatory text, markdown formatting, or code blocks before or after the JSON object.
  `;
  
  try {
    // Make the API call to the Gemini model.
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Use the specified model.
      contents: prompt,
      config: {
        responseMimeType: "application/json", // Instruct the model to respond in JSON.
        responseSchema: responseSchema,      // Enforce the defined schema.
        temperature: 0.4,                    // A lower temperature for more predictable, less creative responses.
      },
    });

    // Extract, trim, and parse the JSON from the response text.
    const jsonText = response.text.trim();
    const parsedResult = JSON.parse(jsonText);

    // Perform basic validation to ensure the parsed object matches the expected structure.
    if (
      !parsedResult.summary || 
      !Array.isArray(parsedResult.keywords) || 
      !Object.values(Sentiment).includes(parsedResult.sentiment) ||
      !parsedResult.sentimentReason
    ) {
      throw new Error("Invalid response structure from API.");
    }
    
    // Return the successfully parsed and validated result.
    return parsedResult as AnalysisResult;

  } catch (error) {
    console.error("Error analyzing article:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to analyze article with Gemini API: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the Gemini API.");
  }
}
