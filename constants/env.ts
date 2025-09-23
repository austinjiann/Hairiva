export const Env = {
  geminiApiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? '',
};

export function assertEnv() {
  if (!Env.geminiApiKey) {
    // Intentionally not throwing to avoid crashing release builds; log a clear warning instead.
    console.warn('Missing EXPO_PUBLIC_GEMINI_API_KEY. Set it in your .env file.');
  }
}


