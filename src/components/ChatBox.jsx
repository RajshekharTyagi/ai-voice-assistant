import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

export default function ChatBox({ messages = [] }) {
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
    <div className="w-full max-w-4xl mx-auto mb-8">
      {/* Chat header */}
      <div className="bg-dark-card rounded-t-lg px-4 py-3 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">Conversation</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-400">Online</span>
          </div>
        </div>
      </div>

      {/* Chat messages container */}
      <div 
        ref={chatContainerRef}
        className="bg-dark-card/50 backdrop-blur-sm rounded-b-lg p-4 h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
      >
        {messages.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h4 className="text-lg font-medium text-text-primary mb-2">Start a conversation</h4>
            <p className="text-gray-400 text-sm max-w-sm">
              Click the microphone button below to start talking with your AI assistant. 
              Your conversation will appear here.
            </p>
          </div>
        ) : (
          // Messages list
          <div className="space-y-1">
            {messages.map((message, index) => (
              <MessageBubble
                key={message.id || index}
                sender={message.sender}
                text={message.text}
                timestamp={message.timestamp}
                status={message.status}
              />
            ))}
            {/* Scroll anchor */}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* Chat footer with message count */}
      {messages.length > 0 && (
        <div className="bg-dark-card/30 px-4 py-2 text-center">
          <span className="text-xs text-gray-500">
            {messages.length} message{messages.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  );
}