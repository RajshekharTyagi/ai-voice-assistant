import { useState } from 'react';

export default function MicButton({ 
  isListening = false, 
  onClick = () => {}, 
  disabled = false 
}) {
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseLeave = () => setIsPressed(false);

  const handleClick = () => {
    if (!disabled) {
      onClick();
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Main microphone button */}
      <button
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        disabled={disabled}
        className={`
          relative w-20 h-20 md:w-24 md:h-24 rounded-full 
          transition-all duration-200 ease-out
          focus:outline-none focus:ring-4 focus:ring-accent/30
          ${disabled 
            ? 'bg-gray-600 cursor-not-allowed opacity-50' 
            : isListening
              ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30'
              : 'bg-accent hover:bg-blue-400 shadow-lg shadow-accent/30'
          }
          ${isPressed && !disabled ? 'scale-95' : 'scale-100'}
          ${isListening ? 'animate-pulse' : ''}
        `}
      >
        {/* Ripple effect for listening state */}
        {isListening && (
          <>
            <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-20"></div>
            <div className="absolute inset-2 rounded-full bg-red-300 animate-ping opacity-30" style={{ animationDelay: '0.5s' }}></div>
          </>
        )}

        {/* Microphone icon */}
        <div className="relative z-10 flex items-center justify-center h-full">
          {isListening ? (
            // Stop icon when listening
            <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h12v12H6z"/>
            </svg>
          ) : (
            // Microphone icon when not listening
            <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
            </svg>
          )}
        </div>

        {/* Glow effect */}
        <div className={`
          absolute inset-0 rounded-full transition-opacity duration-300
          ${isListening 
            ? 'bg-gradient-to-r from-red-400/20 to-red-600/20 blur-xl scale-150 opacity-100' 
            : disabled
              ? 'opacity-0'
              : 'bg-gradient-to-r from-accent/20 to-blue-500/20 blur-xl scale-150 opacity-0 group-hover:opacity-100'
          }
        `} />
      </button>

      {/* Button label */}
      <div className="mt-4 text-center">
        <p className={`text-sm font-medium transition-colors duration-200 ${
          disabled 
            ? 'text-gray-500' 
            : isListening 
              ? 'text-red-400' 
              : 'text-text-primary'
        }`}>
          {disabled 
            ? 'Microphone Disabled' 
            : isListening 
              ? 'Click to Stop' 
              : 'Click to Speak'
          }
        </p>
        
        {/* Keyboard shortcut hint */}
        {!disabled && (
          <p className="text-xs text-gray-500 mt-1">
            Press and hold Space
          </p>
        )}
      </div>

      {/* Visual feedback for different states */}
      {isListening && (
        <div className="mt-2 flex items-center space-x-1">
          <div className="w-1 h-4 bg-red-400 rounded-full animate-pulse"></div>
          <div className="w-1 h-6 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-1 h-5 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-1 h-7 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
          <div className="w-1 h-4 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      )}
    </div>
  );
}