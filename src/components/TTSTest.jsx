import { useState } from 'react';
import useTextToSpeech from '../hooks/useTextToSpeech';

export default function TTSTest() {
  const [testText, setTestText] = useState('Hello! This is a test of the text to speech functionality. If you can hear this message, the avatar speech system is working correctly.');
  const [isTestingAI, setIsTestingAI] = useState(false);
  const textToSpeech = useTextToSpeech();

  const handleTest = async () => {
    try {
      console.log('TTSTest: Starting test with text:', testText);
      await textToSpeech.speak(testText);
      console.log('TTSTest: Test completed successfully');
    } catch (error) {
      console.error('TTSTest: Error during test:', error);
      alert(`TTS Test Failed: ${error.message}`);
    }
  };

  const handleAITest = async () => {
    setIsTestingAI(true);
    try {
      console.log('TTSTest: Starting AI simulation test');
      
      // Simulate the AI response flow
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate thinking
      
      const aiResponse = "This is a simulated AI response to test if the speech synthesis works correctly when called from the AI response handler.";
      
      console.log('TTSTest: About to speak AI response:', aiResponse.substring(0, 50) + '...');
      await textToSpeech.speak(aiResponse);
      console.log('TTSTest: AI simulation test completed successfully');
    } catch (error) {
      console.error('TTSTest: Error during AI simulation test:', error);
      alert(`AI TTS Test Failed: ${error.message}`);
    } finally {
      setIsTestingAI(false);
    }
  };

  return (
    <div className="fixed top-4 left-4 bg-slate-800 p-4 rounded-lg max-w-md z-50">
      <h3 className="text-white font-bold mb-3">TTS Test Panel</h3>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Test Text:</label>
          <textarea
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            className="w-full p-2 bg-slate-700 text-white rounded text-sm"
            rows={3}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleTest}
            disabled={textToSpeech.isSpeaking || !textToSpeech.isSupported}
            className="bg-green-600 hover:bg-green-500 disabled:bg-gray-600 text-white px-3 py-2 rounded text-sm"
          >
            {textToSpeech.isSpeaking ? 'Speaking...' : 'Test TTS'}
          </button>
          
          <button
            onClick={textToSpeech.stop}
            disabled={!textToSpeech.isSpeaking}
            className="bg-red-600 hover:bg-red-500 disabled:bg-gray-600 text-white px-3 py-2 rounded text-sm"
          >
            Stop
          </button>
        </div>
        
        <button
          onClick={handleAITest}
          disabled={isTestingAI || textToSpeech.isSpeaking || !textToSpeech.isSupported}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 text-white px-3 py-2 rounded text-sm"
        >
          {isTestingAI ? 'Testing AI Flow...' : 'Test AI Flow'}
        </button>
        
        <div className="text-xs text-gray-400 space-y-1">
          <div>TTS Supported: {textToSpeech.isSupported ? '✅' : '❌'}</div>
          <div>Voices Available: {textToSpeech.voices.length}</div>
          <div>Selected Voice: {textToSpeech.selectedVoice?.name || 'None'}</div>
          <div>Currently Speaking: {textToSpeech.isSpeaking ? '✅' : '❌'}</div>
          <div>Is Paused: {textToSpeech.isPaused ? '✅' : '❌'}</div>
        </div>
        
        {textToSpeech.voices.length > 0 && (
          <div>
            <label className="block text-sm text-gray-300 mb-1">Voice:</label>
            <select
              value={textToSpeech.selectedVoice?.name || ''}
              onChange={(e) => {
                const voice = textToSpeech.voices.find(v => v.name === e.target.value);
                textToSpeech.setVoice(voice);
              }}
              className="w-full p-2 bg-slate-700 text-white rounded text-sm"
            >
              {textToSpeech.voices.map((voice) => (
                <option key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}