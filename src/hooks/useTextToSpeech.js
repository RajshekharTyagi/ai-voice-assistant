import { useState, useEffect, useRef, useCallback } from 'react';

export default function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [currentText, setCurrentText] = useState('');
  
  const utteranceRef = useRef(null);

  // Check browser support and load voices
  useEffect(() => {
    const synth = window.speechSynthesis;
    setIsSupported(!!synth);

    if (synth) {
      // Load voices
      const loadVoices = () => {
        const availableVoices = synth.getVoices();
        setVoices(availableVoices);
        
        // Select a good default voice (prefer English voices)
        const englishVoices = availableVoices.filter(voice => 
          voice.lang.startsWith('en')
        );
        
        const preferredVoice = 
          englishVoices.find(voice => voice.name.includes('Google')) ||
          englishVoices.find(voice => voice.name.includes('Microsoft')) ||
          englishVoices.find(voice => voice.default) ||
          englishVoices[0] ||
          availableVoices[0];
          
        setSelectedVoice(preferredVoice);
      };

      // Load voices immediately if available
      loadVoices();
      
      // Also listen for voices changed event (some browsers load voices asynchronously)
      if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = loadVoices;
      }
    }

    return () => {
      // Cleanup
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = useCallback((text, options = {}) => {
    return new Promise((resolve, reject) => {
      if (!isSupported) {
        reject(new Error('Text-to-speech is not supported in this browser'));
        return;
      }

      if (!text || text.trim() === '') {
        reject(new Error('No text provided to speak'));
        return;
      }

      // Stop any current speech
      window.speechSynthesis.cancel();

      // Create new utterance
      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;

      // Configure utterance
      utterance.voice = options.voice || selectedVoice;
      utterance.rate = options.rate || 0.9; // Slightly slower for better clarity
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume || 1.0;
      utterance.lang = options.lang || 'en-US';

      // Event handlers
      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
        setCurrentText(text);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        setCurrentText('');
        utteranceRef.current = null;
        resolve();
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        setIsSpeaking(false);
        setIsPaused(false);
        setCurrentText('');
        utteranceRef.current = null;
        
        let errorMessage = 'Text-to-speech failed';
        switch (event.error) {
          case 'network':
            errorMessage = 'Network error occurred during speech synthesis';
            break;
          case 'synthesis-failed':
            errorMessage = 'Speech synthesis failed';
            break;
          case 'synthesis-unavailable':
            errorMessage = 'Speech synthesis is not available';
            break;
          case 'text-too-long':
            errorMessage = 'Text is too long for speech synthesis';
            break;
          case 'invalid-argument':
            errorMessage = 'Invalid argument provided to speech synthesis';
            break;
          default:
            errorMessage = `Speech synthesis error: ${event.error}`;
        }
        
        reject(new Error(errorMessage));
      };

      utterance.onpause = () => {
        setIsPaused(true);
        console.log('Speech paused');
      };

      utterance.onresume = () => {
        setIsPaused(false);
        console.log('Speech resumed');
      };

      // Start speaking
      try {
        window.speechSynthesis.speak(utterance);
        
        // Set a timeout to ensure the speech starts properly
        setTimeout(() => {
          if (!isSpeaking && utteranceRef.current) {
            console.log('Speech may have failed to start, retrying...');
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utterance);
          }
        }, 100);
      } catch (error) {
        setIsSpeaking(false);
        setIsPaused(false);
        setCurrentText('');
        utteranceRef.current = null;
        reject(error);
      }
    });
  }, [isSupported, selectedVoice]);

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