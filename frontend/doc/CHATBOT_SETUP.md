# Chatbot Setup Instructions

## Current Status
✅ Chatbot components integrated
✅ Dependencies installed (@google/genai, marked, highlight.js, lucide-react)
✅ Dev server running at http://localhost:3002/

## To Get the Chatbot Working:

### 1. Set up Gemini API Key
Create a `.env.local` file in the `/Users/aibyml.com.hk/AIServicePlatform/frontend` directory:

```bash
VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
```

Get your API key from: https://ai.google.dev/

### 2. Restart the Dev Server
After adding the API key, restart the dev server:
```bash
# Kill current server (Ctrl+C) then:
npm run dev
```

### 3. Test the Chatbot
1. Open http://localhost:3002/ in your browser
2. Look for the floating chat button in the bottom-right corner (using chaticon_1.JPG)
3. Click it to open the chatbot
4. If API key is configured, you should see: "Welcome to AIbyML AI Service Platform..."
5. If not configured, you'll see an error about the API key

### 4. Troubleshooting

**If you don't see the landing page:**
- Check browser console (F12) for errors
- Make sure you're at http://localhost:3002/
- Try clearing browser cache (Ctrl+Shift+R or Cmd+Shift+R)

**If the chat button doesn't appear:**
- Check if /public/chaticon_1.JPG exists
- Look for console errors
- Verify the dev server is running without errors

**If chat shows API error:**
- Verify VITE_GEMINI_API_KEY is set in .env.local
- Restart dev server after adding .env.local
- Check API key is valid at https://ai.google.dev/

### 5. Customize Service URLs
Edit `/Users/aibyml.com.hk/AIServicePlatform/frontend/src/components/AIChatBot.tsx`:

```typescript
const AI_SERVICE_URLS = [
  "https://www.aibyml.com",
  "https://www.aibyml.com/services",
  "https://www.aibyml.com/documentation",
  // Add more URLs about your services
];
```

## File Locations
- Chatbot Component: `src/components/AIChatBot.tsx`
- Chat Interface: `src/components/chatbot/ChatInterface.tsx`
- Message Display: `src/components/chatbot/MessageItem.tsx`
- Types: `src/types/chatbot.ts`
- Gemini Service: `src/services/geminiService.ts`
- Chat Icon: `public/chaticon_1.JPG`
