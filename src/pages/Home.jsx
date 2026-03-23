import { useState } from 'react';
import Avatar from '../components/Avatar';
import ChatBox from '../components/ChatBox';
import MicButton from '../components/MicButton';
import StatusBar from '../components/StatusBar';
import VoiceVisualizer from '../components/VoiceVisualizer';

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
  voices = [],
  selectedVoice = null,
  
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Enhanced Status Bar */}
      <StatusBar status={status} error={error} />
      
      {/* Browser Compatibility Warning */}
      {showCompatibilityWarning && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 max-w-md">
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 backdrop-blur-xl shadow-2xl">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="text-yellow-400 font-semibold text-sm">Browser Compatibility</h4>
                <p className="text-yellow-300 text-xs mt-1 leading-relaxed">
                  {!speechSupported && "Speech recognition not supported. "}
                  {!speechSynthesisSupported && "Text-to-speech not supported. "}
                  Please use Chrome, Edge, or Safari for full functionality.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Layout Container - Professional Interview Style */}
      <div className="flex h-screen pt-16">
        
        {/* Left Side - Professional Avatar Section */}
        <div className="w-2/5 flex flex-col items-center justify-center p-12 border-r border-slate-700/30 bg-gradient-to-b from-slate-800/50 to-slate-900/50">
          
          {/* Enhanced Avatar */}
          <Avatar 
            isSpeaking={isSpeaking}
            isListening={isListening}
            status={status}
          />
          
        </div>
        
        {/* Right Side - Interview Chat Section */}
        <div className="flex-1 flex flex-col bg-slate-900/30">
          
          {/* Professional Chat Header */}
          <div className="bg-slate-800/40 backdrop-blur-xl border-b border-slate-700/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-white font-bold text-2xl mb-1">Interview Chat</h1>
                <p className="text-slate-400 text-sm">Chat with your AI assistant</p>
              </div>
              <div className="flex items-center space-x-4">
                {/* Mic Status Indicator */}
                <div className="flex items-center space-x-2 px-4 py-2 bg-slate-700/50 rounded-full">
                  <div className={`w-3 h-3 rounded-full ${
                    status === 'idle' ? 'bg-green-400' : 
                    status === 'listening' ? 'bg-blue-400 animate-pulse' :
                    status === 'thinking' ? 'bg-yellow-400 animate-bounce' : 
                    status === 'speaking' ? 'bg-purple-400 animate-pulse' : 'bg-gray-400'
                  }`}></div>
                  <span className="text-xs text-slate-300 font-medium">
                    {status === 'speaking' ? 'AI Active' : 
                     status === 'listening' ? 'Mic Active' :
                     status === 'thinking' ? 'Processing' : 'Ready'}
                  </span>
                </div>
                
                {messages.length > 0 && (
                  <button
                    onClick={onClearMessages}
                    className="px-4 py-2 bg-slate-600/50 hover:bg-slate-500/50 rounded-lg text-sm text-white transition-all duration-200 backdrop-blur-sm border border-slate-600/30"
                  >
                    Clear Chat
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Chat Messages Area */}
          <div className="flex-1 overflow-hidden relative">
            <ChatBox 
              messages={messages} 
              isSpeaking={isSpeaking}
              currentText={currentText}
            />
          </div>
          
          {/* Voice Control Panel */}
          <div className="bg-slate-800/40 backdrop-blur-xl border-t border-slate-700/30 p-6">
            <div className="max-w-4xl mx-auto">
              
              {/* Voice Status Display */}
              <div className="bg-slate-700/30 rounded-2xl p-6 mb-6 border border-slate-600/20">
                <div className="flex items-center justify-center min-h-[100px] relative">
                  
                  {/* Voice Visualizer Background */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-30">
                    <VoiceVisualizer
                      isActive={isListening || isSpeaking}
                      type={isListening ? 'listening' : 'speaking'}
                    />
                  </div>
                  
                  {/* Status Content */}
                  <div className="text-center z-10">
                    {isListening && transcript ? (
                      <div>
                        <div className="flex items-center justify-center mb-3">
                          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-3"></div>
                          <span className="text-green-400 font-semibold">Listening...</span>
                        </div>
                        <p className="text-slate-300 text-lg italic">"{transcript}"</p>
                      </div>
                    ) : isSpeaking && currentText ? (
                      <div>
                        <div className="flex items-center justify-center mb-3">
                          <div className={`w-3 h-3 rounded-full animate-pulse mr-3 ${isPaused ? 'bg-yellow-400' : 'bg-purple-400'}`}></div>
                          <span className={`font-semibold ${isPaused ? 'text-yellow-400' : 'text-purple-400'}`}>
                            {isPaused ? 'Speech Paused' : 'AI Speaking...'}
                          </span>
                        </div>
                        <p className="text-slate-300 text-lg">
                          "The AI is currently speaking. Use the controls below to pause or stop."
                        </p>
                        {/* Enhanced voice wave animation */}
                        {!isPaused && (
                          <div className="flex items-center justify-center mt-4 space-x-2">
                            {[...Array(7)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-1 bg-purple-400 rounded-full animate-pulse ${
                                  i === 0 || i === 6 ? 'h-2' : 
                                  i === 1 || i === 5 ? 'h-4' : 
                                  i === 2 || i === 4 ? 'h-6' : 'h-8'
                                }`}
                                style={{ animationDelay: `${i * 0.1}s` }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ) : status === 'thinking' ? (
                      <div>
                        <div className="flex items-center justify-center mb-3">
                          <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce mr-3"></div>
                          <span className="text-blue-400 font-semibold">Processing...</span>
                        </div>
                        <p className="text-slate-400">AI is analyzing your request</p>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center justify-center mb-3">
                          <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                          <span className="text-green-400 font-semibold">Ready</span>
                        </div>
                        <p className="text-slate-400">Click the microphone to start talking</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Control Buttons */}
              <div className="flex items-center justify-center space-x-6">
                
                {/* Main Mic Button */}
                <div className="relative">
                  <MicButton 
                    isListening={isListening}
                    onClick={onVoiceInput}
                    disabled={!speechSupported}
                  />
                  {/* Enhanced animation rings */}
                  {isListening && (
                    <div className="absolute inset-0 rounded-full border-4 border-green-400 animate-ping opacity-75"></div>
                  )}
                  {isSpeaking && (
                    <div className="absolute inset-0 rounded-full border-4 border-purple-400 animate-pulse opacity-75"></div>
                  )}
                </div>
                
                {/* Speech Control Buttons */}
                {isSpeaking && (
                  <>
                    <button
                      onClick={onTogglePlayPause}
                      className="w-14 h-14 bg-blue-600/90 hover:bg-blue-500/90 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg backdrop-blur-sm border border-blue-500/30 hover:scale-105"
                      title={isPaused ? "Resume Speech" : "Pause Speech"}
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
                      className="w-14 h-14 bg-red-600/90 hover:bg-red-500/90 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg backdrop-blur-sm border border-red-500/30 hover:scale-105"
                      title="Stop Speech"
                    >
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 6h12v12H6z"/>
                      </svg>
                    </button>
                  </>
                )}
              </div>
              
              {/* Instructions */}
              <div className="text-center mt-6">
                {speechSupported ? (
                  <p className="text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto">
                    {isListening 
                      ? "🎤 Speak clearly into your microphone. Click the button again to stop listening."
                      : status === 'thinking'
                        ? "🤔 Processing your request with AI..."
                        : status === 'speaking'
                          ? isPaused 
                            ? "⏸️ Speech is paused. Click the play button to resume or stop to end."
                            : "🔊 AI is speaking. Use the pause button to pause or stop button to end the speech."
                          : "🎯 Click the microphone button to start your voice conversation with the AI assistant."
                    }
                  </p>
                ) : (
                  <p className="text-sm text-red-400 leading-relaxed max-w-2xl mx-auto">
                    ⚠️ Voice input is not supported in this browser. Please use Chrome, Edge, or Safari for the full experience.
                  </p>
                )}
                
                {/* Enhanced feature indicators */}
                <div className="flex items-center justify-center mt-4 space-x-6 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${speechSupported ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    <span className="text-slate-500">Voice Input</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${speechSynthesisSupported ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    <span className="text-slate-500">Voice Output</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                    <span className="text-slate-500">AI Powered</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}