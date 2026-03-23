import { useState, useEffect } from 'react';

export default function MessageBubble({ sender, text, timestamp, status = 'sent', isSpeaking = false }) {
  const [isVisible, setIsVisible] = useState(false);

  // Animate message appearance
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const isUser = sender === 'user';
  const isAI = sender === 'ai';

  // Format timestamp
  const formatTime = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex mb-4 ${isUser ? 'justify-end' : 'justify-start'} ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
    } transition-all duration-300 ease-out`}>
      
      {/* AI Avatar (left side) */}
      {isAI && (
        <div className="flex-shrink-0 mr-3">
          <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center ${
            isSpeaking ? 'ring-2 ring-purple-400 ring-opacity-75 animate-pulse' : ''
          }`}>
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 21H5V3H13V9H19Z"/>
            </svg>
          </div>
        </div>
      )}

      {/* Message content */}
      <div className={`max-w-xs md:max-w-md lg:max-w-lg ${isUser ? 'order-1' : 'order-2'}`}>
        {/* Message bubble */}
        <div className={`px-4 py-3 rounded-2xl shadow-lg relative ${
          isUser 
            ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-br-md' 
            : 'bg-slate-700 text-white rounded-bl-md'
        } ${status === 'sending' ? 'opacity-70' : 'opacity-100'} ${
          isSpeaking && isAI ? 'ring-2 ring-purple-400 ring-opacity-50' : ''
        }`}>
          
          {/* Speaking indicator for AI messages */}
          {isSpeaking && isAI && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
              </svg>
            </div>
          )}
          
          {/* Message text */}
          <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
            {text}
          </p>

          {/* Status indicator for sending messages */}
          {status === 'sending' && (
            <div className="flex items-center mt-2 text-xs opacity-70">
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-current rounded-full animate-bounce"></div>
                <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="ml-2">Sending...</span>
            </div>
          )}

          {/* Error indicator */}
          {status === 'error' && (
            <div className="flex items-center mt-2 text-xs text-red-400">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              Failed to send
            </div>
          )}
        </div>

        {/* Timestamp */}
        {timestamp && (
          <div className={`text-xs text-slate-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
            {formatTime(timestamp)}
          </div>
        )}
      </div>

      {/* User Avatar (right side) */}
      {isUser && (
        <div className="flex-shrink-0 ml-3 order-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}