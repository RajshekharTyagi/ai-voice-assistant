import React, { useState, useCallback } from 'react'
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
      
      // Start listening
      setStatus('listening')
      speechRecognition.startListening()
      
    } catch (err) {
      console.error('Voice input error:', err)
      setError('Failed to start voice input: ' + err.message)
      setStatus('idle')
    }
  }, [speechRecognition])

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
      
      // Speak the response
      setStatus('speaking')
      
      try {
        await textToSpeech.speak(aiResponse)
        setStatus('idle')
      } catch (speechError) {
        console.error('Text-to-speech error:', speechError)
        // Don't show error to user, just continue without speech
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
  }, [addMessage, textToSpeech])

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
      textToSpeech.stop()
    }
  }, [speechRecognition, textToSpeech])

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
    isSpeaking: textToSpeech.isSpeaking,
    isPaused: textToSpeech.isPaused,
    currentText: textToSpeech.currentText,
    speechSynthesisSupported: textToSpeech.isSupported,
    
    // Actions
    onVoiceInput: handleVoiceInput,
    onClearError: () => setError(null),
    onClearMessages: () => setMessages([]),
    onTogglePlayPause: textToSpeech.togglePlayPause,
    onStopSpeech: textToSpeech.stop,
    
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