import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

export default function ChatBox({ messages = [], isSpeaking = false, currentText = '' }) {
  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  }, [messages]);

  return (
    <div className="h-full flex flex-col">
      {/* Chat messages container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent"
      >
        {messages.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h4 className="text-lg font-medium text-white mb-2">Start a conversation</h4>
            <p className="text-slate-400 text-sm max-w-sm">
              Click the microphone button to start talking with your AI assistant. 
              Your conversation will appear here.
            </p>
          </div>
        ) : (
          // Messages list
          <div className="space-y-4">
            {messages.map((message, index) => {
              // Check if this AI message is currently being spoken
              const isCurrentlySpeaking = isSpeaking && 
                message.sender === 'ai' && 
                currentText && 
                message.text.includes(currentText.substring(0, 50));
              
              return (
                <MessageBubble
                  key={message.id || index}
                  sender={message.sender}
                  text={message.text}
                  timestamp={message.timestamp}
                  status={message.status}
                  isSpeaking={isCurrentlySpeaking}
                />
              );
            })}
            {/* Scroll anchor */}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* Chat footer with message count */}
      {messages.length > 0 && (
        <div className="bg-slate-800/30 px-4 py-3 text-center border-t border-slate-700/50">
          <span className="text-xs text-slate-500">
            {messages.length} message{messages.length !== 1 ? 's' : ''}
          </span>
          {isSpeaking && (
            <span className="text-xs text-purple-400 ml-4">
              🔊 AI is speaking...
            </span>
          )}
        </div>
      )}
    </div>
  );
}