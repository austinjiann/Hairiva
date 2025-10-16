// Configuration for external services
export const CONFIG = {
  // Gemini AI API Key
  // Get your API key from: https://makersuite.google.com/app/apikey
  GEMINI_API_KEY: process.env.EXPO_PUBLIC_GEMINI_API_KEY || "",

  // Check if API key is configured
  isGeminiConfigured: () => {
    return !!process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  },
};
