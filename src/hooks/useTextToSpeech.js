import { useState, useEffect, useRef, useCallback } from 'react';

export default function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [currentText, setCurrentText] = useState('');
  
  const utteranceRef = useRef(null);
  const isInitializedRef = useRef(false);

  // Check browser support and load voices
  useEffect(() => {
    const synth = window.speechSynthesis;
    console.log('TTS: Checking browser support...');
    console.log('TTS: speechSynthesis available:', !!synth);
    
    setIsSupported(!!synth);

    if (synth) {
      // Load voices
      const loadVoices = () => {
        console.log('TTS: Loading voices...');
        const availableVoices = synth.getVoices();
        console.log('TTS: Found voices:', availableVoices.length, availableVoices.map(v => v.name));
        setVoices(availableVoices);
        
        // Select a good default voice (prefer English voices)
        const englishVoices = availableVoices.filter(voice => 
          voice.lang.startsWith('en')
        );
        
        console.log('TTS: English voices:', englishVoices.length);
        
        const preferredVoice = 
          englishVoices.find(voice => voice.name.includes('Google')) ||
          englishVoices.find(voice => voice.name.includes('Microsoft')) ||
          englishVoices.find(voice => voice.name.includes('Samantha')) ||
          englishVoices.find(voice => voice.name.includes('Alex')) ||
          englishVoices.find(voice => voice.default) ||
          englishVoices[0] ||
          availableVoices[0];
          
        console.log('TTS: Selected voice:', preferredVoice?.name);
        setSelectedVoice(preferredVoice);
      };

      // Load voices immediately if available
      loadVoices();
      
      // Also listen for voices changed event (some browsers load voices asynchronously)
      if (synth.onvoiceschanged !== undefined) {
        console.log('TTS: Setting up onvoiceschanged listener');
        synth.onvoiceschanged = loadVoices;
      }
      
      // Force voice loading in some browsers
      setTimeout(() => {
        if (synth.getVoices().length === 0) {
          console.log('TTS: No voices loaded, forcing reload...');
          loadVoices();
        }
      }, 1000);

      // Initialize speech synthesis with user interaction
      const initializeSpeech = () => {
        if (!isInitializedRef.current) {
          console.log('TTS: Initializing speech synthesis with user interaction');
          // Create a silent utterance to initialize the speech synthesis
          const silentUtterance = new SpeechSynthesisUtterance('');
          silentUtterance.volume = 0;
          synth.speak(silentUtterance);
          isInitializedRef.current = true;
        }
        
        // Remove the event listener after first interaction
        document.removeEventListener('click', initializeSpeech);
        document.removeEventListener('touchstart', initializeSpeech);
      };

      // Add event listeners for user interaction
      document.addEventListener('click', initializeSpeech);
      document.addEventListener('touchstart', initializeSpeech);
    }

    return () => {
      // Cleanup - but don't cancel speech as it interferes with the main app
      console.log('TTS: Hook cleaning up - NOT cancelling speech to avoid interference');
    };
  }, []); // Removed isSpeaking dependency to prevent cleanup during speech

  const speak = useCallback((text, options = {}) => {
    return new Promise((resolve, reject) => {
      console.log('TTS Hook: speak() called but disabled to prevent interference with main app');
      console.log('TTS Hook: Use the main app speech synthesis instead');
      resolve(); // Just resolve immediately without doing anything
    });
  }, []);

  const stop = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsPaused(false);
    setCurrentText('');
    utteranceRef.current = null;
  }, []);

  const pause = useCallback(() => {
    if (window.speechSynthesis && isSpeaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, [isSpeaking, isPaused]);

  const resume = useCallback(() => {
    if (window.speechSynthesis && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  }, [isPaused]);

  // Toggle play/pause
  const togglePlayPause = useCallback(() => {
    if (isSpeaking && !isPaused) {
      pause();
    } else if (isPaused) {
      resume();
    }
  }, [isSpeaking, isPaused, pause, resume]);

  // Get available voices for the specified language
  const getVoicesForLanguage = useCallback((lang = 'en') => {
    return voices.filter(voice => voice.lang.startsWith(lang));
  }, [voices]);

  // Set voice by name or voice object
  const setVoice = useCallback((voice) => {
    if (typeof voice === 'string') {
      const foundVoice = voices.find(v => v.name === voice);
      setSelectedVoice(foundVoice || selectedVoice);
    } else if (voice && voice.name) {
      setSelectedVoice(voice);
    }
  }, [voices, selectedVoice]);

  return {
    speak,
    stop,
    pause,
    resume,
    togglePlayPause,
    isSpeaking,
    isPaused,
    isSupported,
    voices,
    selectedVoice,
    currentText,
    setVoice,
    getVoicesForLanguage
  };
}