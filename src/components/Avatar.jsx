import { useState, useEffect } from 'react';

export default function Avatar({ isSpeaking = false, status = 'idle' }) {
  const [imageError, setImageError] = useState(false);

  // Animation classes based on state
  const getAnimationClass = () => {
    if (isSpeaking) {
      return 'animate-pulse-glow';
    }
    return 'animate-float';
  };

  // Handle image load error
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="flex flex-col items-center justify-center mb-8">
      <div className={`relative ${getAnimationClass()}`}>
        {/* Avatar container with glow effect */}
        <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shadow-2xl">
          {/* Glow effect background */}
          <div 
            className={`absolute inset-0 rounded-full transition-all duration-300 ${
              isSpeaking 
                ? 'bg-gradient-to-r from-accent/30 to-blue-500/30 blur-sm scale-110' 
                : 'bg-gradient-to-r from-accent/10 to-blue-500/10'
            }`}
          />
          
          {/* Avatar image or fallback */}
          <div className="relative w-full h-full bg-dark-card rounded-full flex items-center justify-center">
            {!imageError ? (
              <img
                src="/avatar.png"
                alt="AI Assistant Avatar"
                className="w-full h-full object-cover rounded-full"
                onError={handleImageError}
              />
            ) : (
              // Fallback avatar when image fails to load
              <div className="w-full h-full bg-gradient-to-br from-accent to-blue-500 rounded-full flex items-center justify-center">
                <svg 
                  className="w-16 h-16 md:w-20 md:h-20 text-white" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 21H5V3H13V9H19Z"/>
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Status indicator */}
        {status !== 'idle' && (
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              status === 'listening' ? 'bg-green-500/20 text-green-400' :
              status === 'thinking' ? 'bg-yellow-500/20 text-yellow-400' :
              status === 'speaking' ? 'bg-accent/20 text-accent' :
              'bg-gray-500/20 text-gray-400'
            }`}>
              {status === 'listening' && '🎤 Listening...'}
              {status === 'thinking' && '🤔 Thinking...'}
              {status === 'speaking' && '🔊 Speaking...'}
            </div>
          </div>
        )}
      </div>

      {/* Avatar name/title */}
      <div className="mt-4 text-center">
        <h2 className="text-xl font-semibold text-text-primary">AI Assistant</h2>
        <p className="text-sm text-gray-400 mt-1">Your voice-powered companion</p>
      </div>
    </div>
  );
}