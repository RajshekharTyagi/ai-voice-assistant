import { useState } from 'react';
import { getAIResponseWithContext, isConfigured, testAPIConnection } from '../services/aiService';
import useTextToSpeech from '../hooks/useTextToSpeech';

export default function DebugPanel() {
  const [testResult, setTestResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const textToSpeech = useTextToSpeech();

  const testAI = async () => {
    setIsLoading(true);
    setTestResult('Testing...');
    
    try {
      console.log('Debug: API Configured:', isConfigured());
      console.log('Debug: API Key present:', !!import.meta.env.VITE_GROQ_API_KEY);
      console.log('Debug: API Key prefix:', import.meta.env.VITE_GROQ_API_KEY?.substring(0, 15));
      
      // First test API connection
      const connectionTest = await testAPIConnection();
      console.log('Connection test result:', connectionTest);
      
      if (!connectionTest.success) {
        setTestResult(`Connection Failed: ${connectionTest.error}`);
        return;
      }
      
      // Then test with actual question
      const response = await getAIResponseWithContext("What is Python programming language?");
      setTestResult(`Success: ${response}`);
    } catch (error) {
      setTestResult(`Error: ${error.message}`);
      console.error('Debug test error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const testTTS = async () => {
    try {
      console.log('Debug: Testing TTS...');
      console.log('Debug: TTS Supported:', textToSpeech.isSupported);
      console.log('Debug: Available voices:', textToSpeech.voices.length);
      console.log('Debug: Selected voice:', textToSpeech.selectedVoice?.name);
      
      if (!textToSpeech.isSupported) {
        setTestResult('TTS Error: Not supported in this browser');
        return;
      }
      
      setTestResult('Testing TTS...');
      await textToSpeech.speak('Hello! This is a test of the text to speech functionality. If you can hear this, the avatar speech is working correctly.');
      setTestResult('TTS Test: Speech completed successfully!');
    } catch (error) {
      setTestResult(`TTS Error: ${error.message}`);
      console.error('TTS test error:', error);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-dark-card p-4 rounded-lg max-w-md">
      <h3 className="text-white font-bold mb-2">Debug Panel</h3>
      <div className="space-y-2">
        <p className="text-sm text-gray-300">
          API Configured: {isConfigured() ? '✅' : '❌'}
        </p>
        <p className="text-sm text-gray-300">
          API Key: {import.meta.env.VITE_GROQ_API_KEY ? '✅' : '❌'}
        </p>
        <p className="text-sm text-gray-300">
          TTS Supported: {textToSpeech.isSupported ? '✅' : '❌'}
        </p>
        <p className="text-sm text-gray-300">
          Voices Available: {textToSpeech.voices.length}
        </p>
        <p className="text-sm text-gray-300">
          Selected Voice: {textToSpeech.selectedVoice?.name || 'None'}
        </p>
        <button
          onClick={testAI}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded text-sm mb-2"
        >
          {isLoading ? 'Testing...' : 'Test AI Service'}
        </button>
        <button
          onClick={testTTS}
          disabled={textToSpeech.isSpeaking}
          className="w-full bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded text-sm"
        >
          {textToSpeech.isSpeaking ? 'Speaking...' : 'Test TTS'}
        </button>
        {textToSpeech.isSpeaking && (
          <button
            onClick={textToSpeech.stop}
            className="w-full bg-red-600 hover:bg-red-500 text-white px-3 py-2 rounded text-sm"
          >
            Stop TTS
          </button>
        )}
        {testResult && (
          <div className="mt-2 p-2 bg-gray-800 rounded text-xs text-gray-300 max-h-32 overflow-y-auto">
            {testResult}
          </div>
        )}
      </div>
    </div>
  );
}