import { useState, useEffect } from 'react';

export default function Avatar({ isSpeaking = false, status = 'idle', isListening = false }) {
  const [imageError, setImageError] = useState(false);

  // Handle image load error
  const handleImageError = () => {
    setImageError(true);
  };

  // Get animation classes based on current state
  const getAnimationClasses = () => {
    const baseClasses = "transition-all duration-500 ease-in-out";
    
    if (isSpeaking) {
      return `${baseClasses} animate-pulse scale-105`;
    } else if (isListening) {
      return `${baseClasses} animate-bounce scale-102`;
    } else {
      return `${baseClasses} hover:scale-105`;
    }
  };

  // Get glow effect classes
  const getGlowClasses = () => {
    if (isSpeaking) {
      return "absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/40 to-blue-500/40 blur-lg animate-pulse";
    } else if (isListening) {
      return "absolute inset-0 rounded-full bg-gradient-to-r from-green-500/30 to-blue-500/30 blur-md animate-ping";
    } else {
      return "absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-sm";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Main Avatar Container */}
      <div className="relative mb-6">
        {/* Outer glow effect */}
        <div className={getGlowClasses()}></div>
        
        {/* Avatar circle with professional styling */}
        <div className={`relative ${getAnimationClasses()}`}>
          <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl bg-gradient-to-br from-slate-800 to-slate-900">
            {/* Professional avatar image */}
            {!imageError ? (
              <img
                src="/professional-avatar.svg"
                alt="Professional AI Assistant"
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            ) : (
              // Professional fallback avatar
              <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <div className="text-6xl">👩‍💼</div>
              </div>
            )}
          </div>
          
          {/* Status ring indicator */}
          {(isSpeaking || isListening) && (
            <div className={`absolute inset-0 rounded-full border-4 ${
              isSpeaking 
                ? 'border-purple-400 animate-pulse' 
                : 'border-green-400 animate-ping'
            }`}></div>
          )}
        </div>

        {/* Floating status indicator */}
        {status !== 'idle' && (
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
            <div className={`px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md border ${
              status === 'listening' 
                ? 'bg-green-500/20 text-green-300 border-green-500/30' :
              status === 'thinking' 
                ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
              status === 'speaking' 
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
                'bg-gray-500/20 text-gray-300 border-gray-500/30'
            }`}>
              <div className="flex items-center space-x-2">
                {status === 'listening' && (
                  <>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Listening</span>
                  </>
                )}
                {status === 'thinking' && (
                  <>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
                    <span>Processing</span>
                  </>
                )}
                {status === 'speaking' && (
                  <>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    <span>Speaking</span>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Professional avatar info */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">AI Assistant</h2>
        <p className="text-slate-400 text-sm mb-3">Your Professional Voice Companion</p>
        
        {/* Status indicator dot */}
        <div className="flex items-center justify-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            status === 'idle' ? 'bg-green-400' : 
            status === 'listening' ? 'bg-blue-400 animate-pulse' :
            status === 'thinking' ? 'bg-yellow-400 animate-bounce' : 
            status === 'speaking' ? 'bg-purple-400 animate-pulse' : 'bg-gray-400'
          }`}></div>
          <span className="text-sm text-slate-300 capitalize">
            {status === 'speaking' ? 'Speaking' : 
             status === 'listening' ? 'Listening' :
             status === 'thinking' ? 'Processing' : 'Ready'}
          </span>
        </div>
      </div>
    </div>
  );
}