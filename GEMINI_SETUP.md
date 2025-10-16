# 🤖 Gemini AI Setup for Hairiva Coach

This guide will help you set up the Gemini AI chatbot for your Hairiva hair coaching feature.

## 🔑 Getting Your Gemini API Key

1. **Visit Google AI Studio**: Go to [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)

2. **Sign in** with your Google account

3. **Create a new API key**:
   - Click "Create API Key"
   - Choose "Create API key in new project" (recommended)
   - Copy the generated API key

## ⚙️ Configuration

### Option 1: Environment Variable (Recommended)

Create a `.env` file in your project root:

```bash
# .env
EXPO_PUBLIC_GEMINI_API_KEY=your_actual_api_key_here

# Optional: Configure AI response behavior
EXPO_PUBLIC_MAX_TOKENS=1000        # Max response length (100-4000)
EXPO_PUBLIC_TEMPERATURE=0.7        # Creativity level (0.0-1.0)
EXPO_PUBLIC_TOP_P=0.8             # Response diversity (0.1-1.0)
EXPO_PUBLIC_TOP_K=40               # Vocabulary selection (1-100)
EXPO_PUBLIC_MAX_HISTORY=15         # Chat history depth (5-50)
```

### Option 2: Direct Configuration

Update `constants/config.ts`:

```typescript
export const CONFIG = {
  GEMINI_API_KEY: "your_actual_api_key_here",
  // ... rest of config
};
```

## 🚀 Testing the Chatbot

1. **Start your development server**:

   ```bash
   ./start-dev.sh
   ```

2. **Open the Coach tab** in your app

3. **Test the chatbot**:
   - Try asking: "What's the best haircut for my face shape?"
   - Ask about hair care: "How often should I wash my hair?"
   - Get styling tips: "How can I make my hair look thicker?"

## 🎯 Features

- **Smart Hair Coaching**: AI-powered advice for hair care, styling, and maintenance
- **Conversation Memory**: Remembers context throughout the chat (configurable depth)
- **Response Control**: Configurable response length and creativity
- **Quick Questions**: Pre-built starter questions for common hair concerns
- **Typing Indicators**: Shows when the AI is responding
- **Error Handling**: Graceful fallbacks if API is unavailable
- **Memory Management**: Automatic chat history limiting to prevent memory issues

## 🔧 Troubleshooting

### "API key not configured" Error

- Make sure your `.env` file is in the project root
- Restart your development server after adding the API key
- Check that the environment variable name is exactly `EXPO_PUBLIC_GEMINI_API_KEY`

### Chatbot Not Responding

- Check your internet connection
- Verify the API key is correct
- Check the console for error messages
- Ensure you have sufficient API quota

### Slow Responses

- Gemini API has rate limits
- Large conversations may take longer to process
- Consider implementing response caching for better performance

## 💡 Pro Tips

- **Be Specific**: Ask detailed questions for better responses
- **Context Matters**: The AI remembers your conversation history (last 15 messages by default)
- **Try Different Questions**: Experiment with various hair-related topics
- **Use Quick Questions**: Start with the pre-built questions for inspiration
- **Adjust Settings**: Modify environment variables to control response length and creativity
- **Memory Management**: Chat history is automatically limited to prevent performance issues

## ⚙️ Advanced Configuration

### Response Length Control

```bash
# Short, focused responses
EXPO_PUBLIC_MAX_TOKENS=200

# Detailed, comprehensive responses
EXPO_PUBLIC_MAX_TOKENS=2000
```

### Creativity Control

```bash
# Conservative, factual responses
EXPO_PUBLIC_TEMPERATURE=0.3

# Creative, varied responses
EXPO_PUBLIC_TEMPERATURE=0.8
```

### Memory Management

```bash
# Minimal context (faster)
EXPO_PUBLIC_MAX_HISTORY=5

# Extended context (more memory)
EXPO_PUBLIC_MAX_HISTORY=30
```

## 🔒 Security Notes

- Never commit your API key to version control
- Use environment variables for production
- Consider implementing API key rotation
- Monitor your API usage to avoid unexpected charges

---

**Need Help?** Check the [Gemini API Documentation](https://ai.google.dev/docs) for more details.
