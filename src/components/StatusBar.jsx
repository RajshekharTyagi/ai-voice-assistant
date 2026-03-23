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

  // Get status configuration with professional styling
  const getStatusConfig = () => {
    if (error) {
      return {
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        ),
        text: error,
        bgColor: 'bg-red-500/10',
        textColor: 'text-red-400',
        borderColor: 'border-red-500/30',
        glowColor: 'shadow-red-500/20'
      };
    }

    switch (status) {
      case 'listening':
        return {
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
          ),
          text: 'Listening for your voice...',
          bgColor: 'bg-green-500/10',
          textColor: 'text-green-400',
          borderColor: 'border-green-500/30',
          glowColor: 'shadow-green-500/20'
        };
      case 'thinking':
        return {
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          ),
          text: 'Processing your request...',
          bgColor: 'bg-blue-500/10',
          textColor: 'text-blue-400',
          borderColor: 'border-blue-500/30',
          glowColor: 'shadow-blue-500/20'
        };
      case 'speaking':
        return {
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.816L4.846 14H2a1 1 0 01-1-1V7a1 1 0 011-1h2.846l3.537-2.816a1 1 0 011.617.816zM16 7a1 1 0 011 1v4a1 1 0 11-2 0V8a1 1 0 011-1z" clipRule="evenodd" />
              <path d="M14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" />
            </svg>
          ),
          text: 'Speaking response...',
          bgColor: 'bg-purple-500/10',
          textColor: 'text-purple-400',
          borderColor: 'border-purple-500/30',
          glowColor: 'shadow-purple-500/20'
        };
      default:
        return {
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ),
          text: 'Ready to assist',
          bgColor: 'bg-slate-500/10',
          textColor: 'text-slate-400',
          borderColor: 'border-slate-500/30',
          glowColor: 'shadow-slate-500/20'
        };
    }
  };

  const config = getStatusConfig();

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`
      fixed top-6 left-1/2 transform -translate-x-1/2 z-50
      transition-all duration-500 ease-out
      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
    `}>
      <div className={`
        flex items-center space-x-4 px-6 py-4 rounded-2xl
        backdrop-blur-xl border shadow-2xl
        ${config.bgColor} ${config.borderColor} ${config.glowColor}
        max-w-md mx-auto
        transform transition-all duration-300 hover:scale-105
      `}>
        {/* Status icon with enhanced animation */}
        <div className="flex-shrink-0">
          <div className={`${config.textColor} ${
            status === 'listening' ? 'animate-pulse' :
            status === 'thinking' ? 'animate-spin' :
            status === 'speaking' ? 'animate-bounce' : ''
          }`}>
            {config.icon}
          </div>
        </div>

        {/* Status text with better typography */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold ${config.textColor} truncate`}>
            {config.text}
          </p>
        </div>

        {/* Enhanced loading animation */}
        {(status === 'thinking' || status === 'speaking') && (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div 
                key={i}
                className={`w-2 h-2 ${config.textColor.replace('text-', 'bg-')} rounded-full animate-bounce`}
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        )}

        {/* Close button for errors with better styling */}
        {error && (
          <button
            onClick={() => setIsVisible(false)}
            className="flex-shrink-0 ml-2 p-1 rounded-full hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-200"
            title="Dismiss error"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Enhanced progress indicator */}
      {(status === 'thinking' || status === 'speaking') && (
        <div className="mt-3 w-full max-w-md mx-auto">
          <div className="w-full bg-slate-700/50 rounded-full h-1 overflow-hidden backdrop-blur-sm">
            <div 
              className={`h-full ${config.textColor.replace('text-', 'bg-')} rounded-full transition-all duration-1000`}
              style={{ 
                width: status === 'thinking' ? '45%' : '75%',
                animation: 'pulse 2s ease-in-out infinite'
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}