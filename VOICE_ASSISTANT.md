# Voice & Text Assistant - DevTools.site

## Overview

DevTools.site includes a **free, browser-native voice and text assistant** called **DevBot** that helps users find tools, get help, and navigate the site using natural language.

## Features

### ✅ Text Input
- Type questions and commands
- Suggestion chips for quick interactions
- Keyboard navigation support

### 🎤 Voice Input (Browser Native)
- **Speech Recognition API** - Converts speech to text
- Works in Chrome, Edge, Safari (iOS 14.5+)
- No API keys or external services required
- Completely free and private

### 🔊 Voice Output
- **Speech Synthesis API** - Converts text to speech
- Natural-sounding voices
- Can be muted/unmuted
- Works in all modern browsers

### 🤖 Smart Assistant
- Understands natural language
- Finds tools based on keywords
- Explains how tools work
- Can navigate to specific tools
- Responds with appropriate mood/emotions

## How It Works

### Architecture

```
User Input (Text/Voice)
    ↓
Speech Recognition (if voice)
    ↓
Intent Matching (brain.ts)
    ↓
Response Generation
    ↓
Speech Synthesis (if enabled)
    ↓
User sees/hears response
```

### Components

1. **Assistant.tsx** - Main wrapper component
2. **AssistantButton.tsx** - Floating action button
3. **AssistantPanel.tsx** - Chat interface
4. **AssistantAvatar.tsx** - Animated robot avatar
5. **MessageBubble.tsx** - Chat message display
6. **SuggestionChips.tsx** - Quick action suggestions

### Hooks

1. **useSpeechRecognition** - Handles voice input
2. **useSpeechSynthesis** - Handles voice output
3. **useAssistant** - Manages conversation state

### Brain Logic

1. **brain.ts** - Main response logic
2. **intents.ts** - Intent pattern matching
3. **responses.ts** - Response templates

## Supported Commands

### Greetings
- "Hi", "Hello", "Hey"

### Finding Tools
- "What tools do you have?"
- "Find me a JSON formatter"
- "I need a password generator"
- "Show me base64 tools"

### Navigation
- "Go to JSON formatter"
- "Take me to JWT decoder"
- "Open password generator"

### Help
- "How do I use JSON formatter?"
- "Explain JWT decoder"
- "What is base64?"

### Other
- "Thanks", "Thank you"
- "Bye", "Goodbye"

## Browser Support

### Speech Recognition
- ✅ Chrome/Edge (Desktop & Mobile)
- ✅ Safari (iOS 14.5+, macOS 11+)
- ❌ Firefox (not supported)
- ❌ Safari (iOS < 14.5)

### Speech Synthesis
- ✅ All modern browsers

## Privacy

- **100% Client-Side** - All processing happens in the browser
- **No Data Collection** - No voice data is sent to servers
- **No API Keys** - Uses browser-native APIs only
- **No External Services** - Completely self-contained

## Customization

### Adding New Intents

Edit `src/lib/assistant/intents.ts`:

```typescript
{
  type: 'your_intent',
  patterns: [/your pattern/i]
}
```

### Adding New Responses

Edit `src/lib/assistant/responses.ts`:

```typescript
const templates: Record<string, string[]> = {
  your_key: [
    "Response 1",
    "Response 2"
  ]
};
```

### Customizing Avatar

Edit `src/components/assistant/AssistantAvatar.tsx` to change:
- Colors
- Animations
- Mood expressions

## Testing

### Desktop
1. Open DevTools.site
2. Click the assistant button (bottom right)
3. Click microphone icon
4. Speak a command
5. Verify response (text + voice)

### Mobile
1. Open DevTools.site on mobile
2. Tap assistant button
3. Grant microphone permission (first time)
4. Tap microphone icon
5. Speak a command
6. Verify response

## Troubleshooting

### Voice Input Not Working

1. **Check browser support** - Use Chrome/Edge/Safari
2. **Check permissions** - Grant microphone access
3. **Check HTTPS** - Speech Recognition requires HTTPS
4. **Check console** - Look for errors

### Voice Output Not Working

1. **Check volume** - Ensure device volume is up
2. **Check mute button** - Voice can be muted
3. **Check browser** - All modern browsers support synthesis

### Assistant Not Understanding

1. **Be specific** - "Find JSON formatter" vs "JSON"
2. **Use keywords** - Mention tool names or categories
3. **Check intents** - Add patterns in `intents.ts`

## Future Enhancements

- [ ] Multi-language support
- [ ] Context-aware responses
- [ ] Tool-specific help
- [ ] Voice commands for tool actions
- [ ] Conversation history
- [ ] Custom voice selection

## License

Same as main project - MIT

