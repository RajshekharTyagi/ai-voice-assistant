import React, { useState, useCallback, useRef } from 'react'
import './index.css'
import Home from './pages/Home'
import useSpeechRecognition from './hooks/useSpeechRecognition'
import useTextToSpeech from './hooks/useTextToSpeech'
import { getAIResponseWithContext } from './services/aiService'

function App() {
  // Application state
  const [messages, setMessages] = useState([])
  const [status, setStatus] = useState('idle') // idle, listening, thinking, speaking
  const [error, setError] = useState(null)
  const [currentUtterance, setCurrentUtterance] = useState(null)
  const [isSpeechPaused, setIsSpeechPaused] = useState(false)
  
  // Use ref for speechManuallyStopped to avoid closure issues
  const speechManuallyStoppedRef = useRef(false)

  // Custom hooks
  const speechRecognition = useSpeechRecognition()
  const textToSpeech = useTextToSpeech()

  // Generate unique message ID
  const generateMessageId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9)
  }

  // Add message to conversation
  const addMessage = useCallback((sender, text, status = 'sent') => {
    const newMessage = {
      id: generateMessageId(),
      sender,
      text,
      timestamp: new Date(),
      status
    }
    
    setMessages(prev => [...prev, newMessage])
    return newMessage.id
  }, [])

  // Update message status
  const updateMessageStatus = useCallback((messageId, status) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, status } : msg
      )
    )
  }, [])

  // Handle voice input process
  const handleVoiceInput = useCallback(async () => {
    try {
      if (speechRecognition.isListening) {
        // Stop listening
        speechRecognition.stopListening()
        setStatus('idle')
        return
      }

      // Clear any previous errors
      setError(null)
      
      // Stop any ongoing speech when starting to listen
      if (status === 'speaking') {
        console.log('App: Stopping speech to start listening');
        speechManuallyStoppedRef.current = true;
        window.speechSynthesis.cancel();
        setCurrentUtterance(null);
        setIsSpeechPaused(false);
      }
      
      // Start listening
      setStatus('listening')
      speechRecognition.startListening()
      
    } catch (err) {
      console.error('Voice input error:', err)
      setError('Failed to start voice input: ' + err.message)
      setStatus('idle')
    }
  }, [speechRecognition, status])

  // Handle AI response process
  const handleAIResponse = useCallback(async (userText) => {
    if (!userText || userText.trim() === '') {
      return
    }

    try {
      // Add user message
      const userMessageId = addMessage('user', userText.trim())
      
      // Set thinking status
      setStatus('thinking')
      
      // Get AI response
      const aiResponse = await getAIResponseWithContext(userText.trim())
      
      // Add AI message
      const aiMessageId = addMessage('ai', aiResponse)
      
      // Wait a moment before starting speech to ensure everything is ready
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Speak the response using a completely isolated approach
      setStatus('speaking')
      speechManuallyStoppedRef.current = false // Reset the manual stop flag
      
      try {
        console.log('App: Starting isolated TTS for AI response:', aiResponse.substring(0, 50) + '...');
        
        // Create a completely isolated speech function
        const speakIsolated = () => {
          return new Promise((resolve) => {
            if (!window.speechSynthesis) {
              console.log('App: Speech synthesis not available');
              resolve();
              return;
            }

            // Create a protected speech session
            const speechSession = {
              isActive: true,
              utterance: null
            };

            // Force cancel any existing speech
            window.speechSynthesis.cancel();
            
            // Wait for cancel to complete
            setTimeout(() => {
              if (!speechSession.isActive || speechManuallyStoppedRef.current) {
                console.log('App: Speech session inactive or manually stopped, aborting');
                return;
              }

              const utterance = new SpeechSynthesisUtterance(aiResponse);
              speechSession.utterance = utterance;
              
              // Get available voices
              const voices = window.speechSynthesis.getVoices();
              const englishVoices = voices.filter(voice => voice.lang.startsWith('en'));
              const voiceToUse = englishVoices.find(voice => voice.name.includes('Microsoft')) ||
                                englishVoices.find(voice => voice.name.includes('Google')) ||
                                englishVoices[0] ||
                                voices[0] ||
                                null;
              
              utterance.voice = voiceToUse;
              utterance.rate = 0.9;
              utterance.pitch = 1.0;
              utterance.volume = 1.0;
              utterance.lang = 'en-US';

              console.log('App: Isolated TTS - Using voice:', voiceToUse?.name || 'System default');

              let speechStarted = false;
              let speechCompleted = false;

              utterance.onstart = () => {
                if (!speechSession.isActive || speechManuallyStoppedRef.current) {
                  console.log('App: Speech started but session inactive or manually stopped');
                  return;
                }
                console.log('App: Isolated TTS - Speech started');
                speechStarted = true;
                setCurrentUtterance(utterance);
              };

              utterance.onend = () => {
                if (!speechCompleted && speechSession.isActive && !speechManuallyStoppedRef.current) {
                  console.log('App: Isolated TTS - Speech ended naturally');
                  speechCompleted = true;
                  speechSession.isActive = false;
                  setCurrentUtterance(null);
                  setIsSpeechPaused(false);
                  resolve();
                }
              };

              utterance.onerror = (event) => {
                console.log('App: Isolated TTS - Speech error:', event.error, 'Manually stopped:', speechManuallyStoppedRef.current);
                
                if (!speechCompleted && speechSession.isActive) {
                  // If manually stopped, don't retry
                  if (speechManuallyStoppedRef.current) {
                    console.log('App: Speech was manually stopped, not retrying');
                    speechCompleted = true;
                    speechSession.isActive = false;
                    setCurrentUtterance(null);
                    setIsSpeechPaused(false);
                    resolve();
                    return;
                  }
                  
                  speechCompleted = true;
                  speechSession.isActive = false;
                  setCurrentUtterance(null);
                  setIsSpeechPaused(false);
                  
                  // Only retry if it was interrupted naturally (not manually stopped)
                  if (event.error === 'interrupted' && speechStarted && !speechManuallyStoppedRef.current) {
                    console.log('App: Speech was interrupted naturally, attempting restart...');
                    setTimeout(() => {
                      // Double-check the manual stop flag before retrying
                      if (window.speechSynthesis && !window.speechSynthesis.speaking && !speechManuallyStoppedRef.current) {
                        console.log('App: Conditions met for retry, starting retry speech...');
                        const retryUtterance = new SpeechSynthesisUtterance(aiResponse);
                        retryUtterance.voice = voiceToUse;
                        retryUtterance.rate = 0.9;
                        retryUtterance.pitch = 1.0;
                        retryUtterance.volume = 1.0;
                        retryUtterance.lang = 'en-US';
                        
                        retryUtterance.onend = () => {
                          console.log('App: Retry speech completed');
                          resolve();
                        };
                        
                        retryUtterance.onerror = () => {
                          console.log('App: Retry speech failed, giving up');
                          resolve();
                        };
                        
                        window.speechSynthesis.speak(retryUtterance);
                      } else {
                        console.log('App: Retry conditions not met, resolving');
                        resolve();
                      }
                    }, 1000);
                  } else {
                    console.log('App: Not retrying, resolving');
                    resolve();
                  }
                }
              };

              utterance.onpause = () => {
                if (speechSession.isActive && !speechManuallyStoppedRef.current) {
                  setIsSpeechPaused(true);
                }
              };

              utterance.onresume = () => {
                if (speechSession.isActive && !speechManuallyStoppedRef.current) {
                  setIsSpeechPaused(false);
                }
              };

              console.log('App: Isolated TTS - Starting speech...');
              window.speechSynthesis.speak(utterance);

              // Chrome workaround - multiple attempts
              setTimeout(() => {
                if (speechSession.isActive && window.speechSynthesis.paused && !speechManuallyStoppedRef.current) {
                  console.log('App: Isolated TTS - Resuming paused speech (attempt 1)');
                  window.speechSynthesis.resume();
                }
              }, 100);

              setTimeout(() => {
                if (speechSession.isActive && window.speechSynthesis.paused && !speechManuallyStoppedRef.current) {
                  console.log('App: Isolated TTS - Resuming paused speech (attempt 2)');
                  window.speechSynthesis.resume();
                }
              }, 300);

              // Fallback timeout
              setTimeout(() => {
                if (!speechStarted && !speechCompleted && speechSession.isActive && !speechManuallyStoppedRef.current) {
                  console.log('App: Isolated TTS - Speech timeout, resolving');
                  speechCompleted = true;
                  speechSession.isActive = false;
                  setCurrentUtterance(null);
                  setIsSpeechPaused(false);
                  resolve();
                }
              }, 3000);

            }, 1000); // Increased delay for better cleanup
          });
        };
        
        await speakIsolated();
        console.log('App: Isolated TTS completed');
        setStatus('idle')
      } catch (speechError) {
        console.error('App: Text-to-speech error:', speechError)
        setStatus('idle')
      }
      
    } catch (err) {
      console.error('AI response error:', err)
      
      // Handle quota errors specifically
      if (err.message.includes('quota exceeded') || err.message.includes('insufficient_quota')) {
        setError('Groq API quota exceeded. Please check your usage limits.')
        addMessage('ai', 'Sorry, the AI service quota has been exceeded. Please check your Groq usage limits.', 'error')
      } else {
        setError('Failed to get AI response: ' + err.message)
        addMessage('ai', 'Sorry, I encountered an error processing your request. Please try again.', 'error')
      }
      
      setStatus('idle')
    }
  }, [addMessage])

  // Handle speech pause/resume
  const handleSpeechPauseResume = useCallback(() => {
    if (!currentUtterance || !window.speechSynthesis) return;

    if (isSpeechPaused) {
      console.log('App: Resuming speech');
      window.speechSynthesis.resume();
    } else {
      console.log('App: Pausing speech');
      window.speechSynthesis.pause();
    }
  }, [currentUtterance, isSpeechPaused])

  // Handle speech stop
  const handleSpeechStop = useCallback(() => {
    console.log('App: User manually stopping speech');
    speechManuallyStoppedRef.current = true;
    
    // Force cancel all speech synthesis
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      // Cancel again after a short delay to ensure it's stopped
      setTimeout(() => {
        window.speechSynthesis.cancel();
      }, 100);
    }
    
    setCurrentUtterance(null);
    setIsSpeechPaused(false);
    setStatus('idle');
  }, [])

  // Handle speech recognition results
  React.useEffect(() => {
    if (speechRecognition.transcript && !speechRecognition.isListening && status === 'listening') {
      // Speech recognition completed with transcript
      handleAIResponse(speechRecognition.transcript)
      speechRecognition.reset()
    }
  }, [speechRecognition.transcript, speechRecognition.isListening, status, handleAIResponse, speechRecognition])

  // Handle speech recognition errors
  React.useEffect(() => {
    if (speechRecognition.error) {
      setError(speechRecognition.error)
      setStatus('idle')
    }
  }, [speechRecognition.error])

  // Clear error after 5 seconds
  React.useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null)
      }, 5000)
      
      return () => clearTimeout(timer)
    }
  }, [error])

  // Stop all processes when component unmounts
  React.useEffect(() => {
    return () => {
      speechRecognition.stopListening()
      // Only cancel speech on actual unmount, not on re-renders
    }
  }, [speechRecognition]) // Removed currentUtterance dependency

  // Application props to pass down
  const appProps = {
    // State
    messages,
    status,
    error,
    
    // Speech recognition
    isListening: speechRecognition.isListening,
    transcript: speechRecognition.transcript,
    speechSupported: speechRecognition.isSupported,
    
    // Text to speech
    isSpeaking: status === 'speaking',
    isPaused: isSpeechPaused,
    currentText: currentUtterance ? 'AI is speaking...' : '',
    speechSynthesisSupported: textToSpeech.isSupported,
    
    // Actions
    onVoiceInput: handleVoiceInput,
    onClearError: () => setError(null),
    onClearMessages: () => setMessages([]),
    onTogglePlayPause: handleSpeechPauseResume,
    onStopSpeech: handleSpeechStop,
    
    // Manual text input (for fallback)
    onTextInput: handleAIResponse
  }

  return (
    <div className="min-h-screen bg-dark-bg text-text-primary">
      <Home {...appProps} />
    </div>
  )
}

export default App