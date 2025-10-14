import { CONFIG } from "@/constants/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface ChatResponse {
  message: string;
  success: boolean;
  error?: string;
}

export type OnBubbleCallback = (bubble: ChatMessage) => void;

// Gemini API Configuration
const GEMINI_CONFIG = {
  maxOutputTokens: parseInt(process.env.EXPO_PUBLIC_MAX_TOKENS || "400"),
  temperature: parseFloat(process.env.EXPO_PUBLIC_TEMPERATURE || "0.4"),
  topP: parseFloat(process.env.EXPO_PUBLIC_TOP_P || "0.8"),
  topK: parseInt(process.env.EXPO_PUBLIC_TOP_K || "20"),
  maxChatHistory: parseInt(process.env.EXPO_PUBLIC_MAX_HISTORY || "10"),
  bubbleDelayMs: parseInt(process.env.EXPO_PUBLIC_BUBBLE_DELAY_MS || "1000"),
};

class GeminiService {
  private model: any;
  private chatHistory: ChatMessage[] = [];

  constructor() {
    // Use the most basic available model
    this.model = new GoogleGenerativeAI(
      CONFIG.GEMINI_API_KEY
    ).getGenerativeModel({
      model: "gemini-2.0-flash",
    });
  }

  // Limit chat history to prevent excessive memory usage
  private limitChatHistory(
    maxMessages: number = GEMINI_CONFIG.maxChatHistory
  ): void {
    if (this.chatHistory.length > maxMessages) {
      // Keep only the last N messages (preserve conversation context)
      this.chatHistory = this.chatHistory.slice(-maxMessages);
    }
  }

  // Build context-aware prompt with recent chat history
  private buildContextPrompt(currentMessage: string): string {
    const basePrompt =
      "You are a professional hair coach. Keep the tone casual and conversational, like texting a friend. Avoid bullet points or numbered lists. Do NOT use markdown or bold like **this**. Write short, complete sentences that end with punctuation. Focus on practical, friendly advice with minimal fluff.";

    // Include recent conversation context (last 6 messages for context)
    const recentHistory = this.chatHistory.slice(-6);
    if (recentHistory.length === 0) {
      return `${basePrompt}\n\nUser: ${currentMessage}\nAssistant:`;
    }

    // Build conversation context
    const contextMessages = recentHistory
      .map((msg) => `${msg.isUser ? "User" : "Assistant"}: ${msg.text}`)
      .join("\n");

    return `${basePrompt}\n\nRecent conversation context:\n${contextMessages}\n\nUser: ${currentMessage}\nAssistant:`;
  }

  // Remove markdown/bullets and normalize whitespace
  private sanitizeAiText(text: string): string {
    let cleaned = text
      // Remove markdown bold/italics and inline code fences
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/`([^`]+)`/g, "$1")
      // Remove common bullet/number prefixes at line starts
      .replace(/^\s*[-*•]\s+/gm, "")
      .replace(/^\s*\d+\.\s+/gm, "")
      // Collapse excessive whitespace
      .replace(/[ \t]+/g, " ")
      .replace(/\s*\n\s*/g, "\n")
      .trim();
    return cleaned;
  }

  // Ensure each sentence ends with terminal punctuation
  private ensureCompleteSentence(sentence: string): string {
    const s = sentence.trim();
    if (!s) return s;
    const last = s[s.length - 1];
    return /[.!?]$/.test(last) ? s : `${s}.`;
  }

  // Split a paragraph into sentences conservatively
  private splitIntoSentences(text: string): string[] {
    const sanitized = this.sanitizeAiText(text);
    // Split on sentence boundaries while keeping abbreviations simple
    const parts = sanitized
      .split(/(?<=[.!?])\s+(?=[A-Z0-9])/)
      .map((p) => this.ensureCompleteSentence(p))
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
    // Fallback: if nothing split, return the whole text as one sentence
    if (parts.length === 0 && sanitized) {
      return [this.ensureCompleteSentence(sanitized)];
    }
    return parts;
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async sendMessage(
    userMessage: string,
    onBubble?: OnBubbleCallback
  ): Promise<ChatResponse> {
    try {
      // Check if API key is configured
      if (!CONFIG.isGeminiConfigured()) {
        return {
          message:
            "Please configure your Gemini API key in the environment variables.",
          success: false,
          error: "API key not configured",
        };
      }

      // Add user message to history
      const userChatMessage: ChatMessage = {
        id: Date.now().toString(),
        text: userMessage,
        isUser: true,
        timestamp: new Date(),
      };
      this.chatHistory.push(userChatMessage);

      // Build context-aware prompt with chat history
      const contextPrompt = this.buildContextPrompt(userMessage);

      // Generate content with configuration
      const result = await this.model.generateContent({
        contents: [{ role: "user", parts: [{ text: contextPrompt }] }],
        generationConfig: {
          maxOutputTokens: GEMINI_CONFIG.maxOutputTokens,
          temperature: GEMINI_CONFIG.temperature,
          topP: GEMINI_CONFIG.topP,
          topK: GEMINI_CONFIG.topK,
        },
      });

      const response = await result.response;
      const aiMessageRaw = response.text();
      const sentences = this.splitIntoSentences(aiMessageRaw);

      // Add AI response as multiple bubbles (one per sentence) with slight delay
      for (let i = 0; i < sentences.length; i++) {
        const aiChatMessage: ChatMessage = {
          id: `${Date.now() + 1}-${i}`,
          text: sentences[i],
          isUser: false,
          timestamp: new Date(),
        };
        this.chatHistory.push(aiChatMessage);
        if (onBubble) onBubble(aiChatMessage);
        // Skip delay after final bubble
        if (i < sentences.length - 1 && GEMINI_CONFIG.bubbleDelayMs > 0) {
          await this.sleep(GEMINI_CONFIG.bubbleDelayMs);
        }
      }

      // Limit chat history to prevent excessive memory usage
      this.limitChatHistory();

      return {
        message: sentences.join(" \n"),
        success: true,
      };
    } catch (error) {
      console.error("Gemini API Error:", error);
      return {
        message: "Sorry, I encountered an error. Please try again.",
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  getChatHistory(): ChatMessage[] {
    return this.chatHistory;
  }

  clearChatHistory(): void {
    this.chatHistory = [];
  }

  // Get conversation starter suggestions
  getStarterQuestions(): string[] {
    return [
      "What products should I use for my hair type?",
      "How often should I wash my hair?",
      "What styling tips do you have for my hair length?",
    ];
  }
}

export const geminiService = new GeminiService();
