import Avatar from '../components/Avatar';
import ChatBox from '../components/ChatBox';
import MicButton from '../components/MicButton';
import StatusBar from '../components/StatusBar';
import DebugPanel from '../components/DebugPanel';

export default function Home({
  // State
  messages = [],
  status = 'idle',
  error = null,
  
  // Speech recognition
  isListening = false,
  transcript = '',
  speechSupported = false,
  
  // Text to speech
  isSpeaking = false,
  isPaused = false,
  currentText = '',
  speechSynthesisSupported = false,
  
  // Actions
  onVoiceInput = () => {},
  onClearError = () => {},
  onClearMessages = () => {},
  onTogglePlayPause = () => {},
  onStopSpeech = () => {},
  onTextInput = () => {}
}) {

  // Show browser compatibility warning
  const showCompatibilityWarning = !speechSupported || !speechSynthesisSupported;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Status Bar */}
      <StatusBar status={status} error={error} />
      
      {/* Browser Compatibility Warning */}
      {showCompatibilityWarning && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 max-w-md">
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 backdrop-blur-md">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <span className="text-yellow-400 text-lg">⚠️</span>
              </div>
              <div>
                <h4 className="text-yellow-400 font-medium text-sm">Browser Compatibility</h4>
                <p className="text-yellow-300 text-xs mt-1">
                  {!speechSupported && "Speech recognition not supported. "}
                  {!speechSynthesisSupported && "Text-to-speech not supported. "}
                  Please use Chrome, Edge, or Safari for full functionality.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content Container */}
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center space-y-8">
        
        {/* Avatar Section */}
        <Avatar 
          isSpeaking={isSpeaking} 
          status={status} 
        />
        
        {/* Current transcript display */}
        {isListening && transcript && (
          <div className="bg-dark-card/50 backdrop-blur-sm rounded-lg p-4 max-w-md">
            <p className="text-sm text-gray-300">
              <span className="text-green-400">Listening:</span> {transcript}
            </p>
          </div>
        )}
        
        {/* Current speech display */}
        {isSpeaking && currentText && (
          <div className="bg-dark-card/50 backdrop-blur-sm rounded-lg p-4 max-w-md">
            <p className="text-sm text-gray-300">
              <span className="text-blue-400">Speaking:</span> {currentText.substring(0, 100)}
              {currentText.length > 100 ? '...' : ''}
            </p>
            {isPaused && (
              <p className="text-xs text-yellow-400 mt-1">⏸️ Paused</p>
            )}
          </div>
        )}
        
        {/* Chat Section */}
        <ChatBox messages={messages} />
        
        {/* Controls Section */}
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-4">
            <MicButton 
              isListening={isListening}
              onClick={onVoiceInput}
              disabled={!speechSupported}
            />
            
            {/* Speech Control Buttons */}
            {isSpeaking && (
              <div className="flex space-x-2">
                <button
                  onClick={onTogglePlayPause}
                  className="w-12 h-12 bg-blue-600 hover:bg-blue-500 rounded-full flex items-center justify-center transition-colors"
                  title={isPaused ? "Resume" : "Pause"}
                >
                  {isPaused ? (
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                    </svg>
                  )}
                </button>
                
                <button
                  onClick={onStopSpeech}
                  className="w-12 h-12 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors"
                  title="Stop"
                >
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 6h12v12H6z"/>
                  </svg>
                </button>
              </div>
            )}
          </div>
          
          {/* Instructions */}
          <div className="text-center max-w-md">
            {speechSupported ? (
              <p className="text-sm text-gray-400 leading-relaxed">
                {isListening 
                  ? "Speak now... Click the button again to stop listening."
                  : status === 'thinking'
                    ? "Processing your request..."
                    : status === 'speaking'
                      ? "AI is speaking..."
                      : "Click the microphone to start a voice conversation with your AI assistant."
                }
              </p>
            ) : (
              <p className="text-sm text-red-400 leading-relaxed">
                Voice input is not supported in this browser. Please use Chrome, Edge, or Safari.
              </p>
            )}
          </div>
          
          {/* Additional Controls */}
          {messages.length > 0 && (
            <div className="flex space-x-4 mt-4">
              <button
                onClick={onClearMessages}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-sm transition-colors"
              >
                Clear Chat
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-12 text-center">
        <p className="text-xs text-gray-500">
          AI Voice Assistant • Built with React & Tailwind CSS
        </p>
        {speechSupported && speechSynthesisSupported && (
          <p className="text-xs text-green-400 mt-1">
            ✓ Voice features fully supported
          </p>
        )}
      </div>
      
      {/* Debug Panel - Remove in production */}
      <DebugPanel />
    </div>
  );
}