# AI Voice Assistant

A modern voice-powered AI assistant built with React, featuring real-time speech recognition, AI responses via OpenAI, and text-to-speech capabilities.

## Features

- 🎤 **Voice Input**: Real-time speech recognition using Web Speech API
- 🤖 **AI Responses**: Powered by OpenAI GPT models
- 🔊 **Voice Output**: Text-to-speech synthesis for AI responses
- 👤 **Interactive Avatar**: Animated avatar that responds to conversation states
- 💬 **Chat Interface**: Beautiful chat UI with message history
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🌙 **Dark Theme**: Modern dark UI with blue accents

## Browser Compatibility

For full functionality, use:
- Chrome 25+
- Edge 79+
- Safari 14.1+
- Firefox 44+ (limited speech recognition support)

**Note**: HTTPS is required for microphone access in production.

## Setup

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up OpenAI API (optional):**
   - Create a `.env` file in the root directory
   - Add your OpenAI API key:
     ```
     VITE_OPENAI_API_KEY=your_api_key_here
     ```
   - If no API key is provided, the app will use mock responses

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## Usage

1. **Start a conversation**: Click the microphone button to begin voice input
2. **Speak naturally**: The app will transcribe your speech in real-time
3. **Get AI responses**: The AI will process your input and respond both in text and voice
4. **View conversation**: All messages are displayed in the chat interface

## Deployment

The app is ready for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your `VITE_OPENAI_API_KEY` environment variable in Vercel settings
4. Deploy!

## Project Structure

```
src/
├── components/          # React components
│   ├── Avatar.jsx      # Animated avatar component
│   ├── ChatBox.jsx     # Chat message container
│   ├── MessageBubble.jsx # Individual message bubbles
│   ├── MicButton.jsx   # Voice input button
│   └── StatusBar.jsx   # Status indicator
├── hooks/              # Custom React hooks
│   ├── useSpeechRecognition.js # Speech-to-text hook
│   └── useTextToSpeech.js      # Text-to-speech hook
├── services/           # External services
│   └── aiService.js    # OpenAI API integration
├── pages/              # Page components
│   └── Home.jsx        # Main application page
├── App.jsx             # Root component with state management
└── index.css           # Global styles and Tailwind CSS
```

## Technologies Used

- **React 18** - UI framework
- **Tailwind CSS** - Styling and animations
- **Vite** - Build tool and dev server
- **Web Speech API** - Speech recognition and synthesis
- **OpenAI API** - AI response generation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for your own applications!