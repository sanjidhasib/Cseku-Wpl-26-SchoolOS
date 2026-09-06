/**
 * AI Service — Google Gemini Provider
 *
 * Modular AI provider wrapper for SchoolOS AI Tutor.
 * Swap providers by changing AI_PROVIDER, AI_API_KEY, AI_MODEL in .env
 *
 * Supported: gemini (default)
 * Planned:   openai, groq
 */

const { GoogleGenerativeAI } = require("@google/generative-ai");

const AI_PROVIDER = process.env.AI_PROVIDER || "gemini";
const AI_API_KEY = process.env.AI_API_KEY || "";
const AI_MODEL = process.env.AI_MODEL || "gemini-1.5-flash";

// Validate configuration at startup
function validateConfig() {
  if (!AI_API_KEY || AI_API_KEY === "your_gemini_api_key_here") {
    console.warn(
      "[AIService] ⚠️  AI_API_KEY is not configured. Set AI_API_KEY in .env to enable AI answers."
    );
    return false;
  }
  return true;
}

/**
 * Generates a text response from the configured AI model.
 *
 * @param {string} systemPrompt - System/instruction prompt
 * @param {string} userPrompt   - The user's actual question with context
 * @returns {Promise<string>}   - The generated text response
 * @throws {Error}              - If AI call fails (caller handles gracefully)
 */
async function generateAnswer(systemPrompt, userPrompt) {
  if (!validateConfig()) {
    throw new Error(
      "AI provider is not configured. Please set AI_API_KEY in your .env file."
    );
  }

  if (AI_PROVIDER === "gemini") {
    return generateWithGemini(systemPrompt, userPrompt);
  }

  throw new Error(`Unsupported AI provider: "${AI_PROVIDER}". Use "gemini".`);
}

/**
 * Calls the Google Gemini API.
 * Uses system instruction + user content pattern.
 */
async function generateWithGemini(systemPrompt, userPrompt) {
  const genAI = new GoogleGenerativeAI(AI_API_KEY);

  const model = genAI.getGenerativeModel({
    model: AI_MODEL,
    systemInstruction: systemPrompt,
    generationConfig: {
      temperature: 0.7,       // Balanced creativity
      maxOutputTokens: 1024,  // Enough for a thorough but not endless answer
      topP: 0.9,
    },
  });

  const result = await model.generateContent(userPrompt);
  const response = result.response;
  const text = response.text();

  if (!text || text.trim().length === 0) {
    throw new Error("AI model returned an empty response.");
  }

  return text.trim();
}

/**
 * Checks if the AI provider is configured and reachable.
 * Used by the health-check endpoint.
 */
function getProviderStatus() {
  const configured = validateConfig();
  return {
    provider: AI_PROVIDER,
    model: AI_MODEL,
    configured,
    status: configured ? "ready" : "not_configured",
  };
}

module.exports = {
  generateAnswer,
  getProviderStatus,
};
