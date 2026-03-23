import { useState, useEffect } from 'react';

export default function StatusBar({ 
  status = 'idle', 
  error = null 
}) {
  const [isVisible, setIsVisible] = useState(false);

  // Show/hide status bar based on status
  useEffect(() => {
    setIsVisible(status !== 'idle' || error !== null);
  }, [status, error]);

  // Get status configuration
  const getStatusConfig = () => {
    if (error) {
      return {
        icon: '❌',
        text: error,
        bgColor: 'bg-red-500/10',
        textColor: 'text-red-400',
        borderColor: 'border-red-500/30'
      };
    }

    switch (status) {
      case 'listening':
        return {
          icon: '🎤',
          text: 'Listening for your voice...',
          bgColor: 'bg-green-500/10',
          textColor: 'text-green-400',
          borderColor: 'border-green-500/30'
        };
      case 'thinking':
        return {
          icon: '🤔',
          text: 'Processing your request...',
          bgColor: 'bg-yellow-500/10',
          textColor: 'text-yellow-400',
          borderColor: 'border-yellow-500/30'
        };
      case 'speaking':
        return {
          icon: '🔊',
          text: 'Speaking response...',
          bgColor: 'bg-accent/10',
          textColor: 'text-accent',
          borderColor: 'border-accent/30'
        };
      default:
        return {
          icon: '💤',
          text: 'Ready to assist',
          bgColor: 'bg-gray-500/10',
          textColor: 'text-gray-400',
          borderColor: 'border-gray-500/30'
        };
    }
  };

  const config = getStatusConfig();

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`
      fixed top-4 left-1/2 transform -translate-x-1/2 z-50
      transition-all duration-300 ease-out
      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
    `}>
      <div className={`
        flex items-center space-x-3 px-4 py-3 rounded-full
        backdrop-blur-md border shadow-lg
        ${config.bgColor} ${config.borderColor}
        max-w-sm mx-auto
      `}>
        {/* Status icon with animation */}
        <div className="flex-shrink-0">
          <span className={`text-lg ${
            status === 'listening' ? 'animate-pulse' :
            status === 'thinking' ? 'animate-bounce' :
            status === 'speaking' ? 'animate-pulse' : ''
          }`}>
            {config.icon}
          </span>
        </div>

        {/* Status text */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${config.textColor} truncate`}>
            {config.text}
          </p>
        </div>

        {/* Loading dots for processing states */}
        {(status === 'thinking' || status === 'speaking') && (
          <div className="flex space-x-1">
            <div className={`w-1 h-1 ${config.textColor.replace('text-', 'bg-')} rounded-full animate-bounce`}></div>
            <div className={`w-1 h-1 ${config.textColor.replace('text-', 'bg-')} rounded-full animate-bounce`} style={{ animationDelay: '0.1s' }}></div>
            <div className={`w-1 h-1 ${config.textColor.replace('text-', 'bg-')} rounded-full animate-bounce`} style={{ animationDelay: '0.2s' }}></div>
          </div>
        )}

        {/* Close button for errors */}
        {error && (
          <button
            onClick={() => setIsVisible(false)}
            className="flex-shrink-0 ml-2 text-red-400 hover:text-red-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Progress bar for certain states */}
      {(status === 'thinking' || status === 'speaking') && (
        <div className="mt-2 w-full bg-gray-700 rounded-full h-1 overflow-hidden">
          <div className={`h-full ${config.textColor.replace('text-', 'bg-')} rounded-full animate-pulse`} 
               style={{ width: '60%', animation: 'pulse 2s ease-in-out infinite' }}>
          </div>
        </div>
      )}
    </div>
  );
}