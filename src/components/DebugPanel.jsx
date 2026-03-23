import { useState } from 'react';
import { getAIResponseWithContext, isConfigured, testAPIConnection } from '../services/aiService';

export default function DebugPanel() {
  const [testResult, setTestResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <div className="fixed bottom-4 right-4 bg-dark-card p-4 rounded-lg max-w-md">
      <h3 className="text-white font-bold mb-2">Groq AI Service Debug</h3>
      <div className="space-y-2">
        <p className="text-sm text-gray-300">
          API Configured: {isConfigured() ? '✅' : '❌'}
        </p>
        <p className="text-sm text-gray-300">
          API Key: {import.meta.env.VITE_GROQ_API_KEY ? '✅' : '❌'}
        </p>
        <button
          onClick={testAI}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded text-sm"
        >
          {isLoading ? 'Testing...' : 'Test AI Service'}
        </button>
        {testResult && (
          <div className="mt-2 p-2 bg-gray-800 rounded text-xs text-gray-300 max-h-32 overflow-y-auto">
            {testResult}
          </div>
        )}
      </div>
    </div>
  );
}