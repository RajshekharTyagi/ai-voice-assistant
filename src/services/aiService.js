// AI Service for Groq integration
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

// Debug function
const debugLog = (message, data = null) => {
  console.log(`[AI Service Debug] ${message}`, data || '');
};

debugLog('AI Service loaded, Groq API Key present:', !!API_KEY);
debugLog('API Key starts with:', API_KEY ? API_KEY.substring(0, 10) + '...' : 'No key');

// Mock responses for development/fallback
const mockResponses = [
  "I understand what you're asking about. Could you provide more details so I can give you a more specific answer?",
  "That's an interesting topic! What particular aspect would you like me to focus on?",
  "I'd be happy to help you with that. Can you tell me more about what you're trying to accomplish?",
  "Great question! Let me share some thoughts on that subject.",
  "I can definitely assist you with that. What specific information are you looking for?",
  "That's something I can help explain. Would you like me to break it down step by step?",
  "I appreciate you bringing that up. Here's what I think about that topic.",
  "That's a good point to discuss. What's your current understanding of it?"
];

// Check if API is configured
export const isConfigured = () => {
  return !!API_KEY && API_KEY.startsWith('gsk_');
};

// Get random mock response
const getMockResponse = () => {
  const randomIndex = Math.floor(Math.random() * mockResponses.length);
  return mockResponses[randomIndex];
};

// Main AI response function
export const getAIResponse = async (text, options = {}) => {
  // Validate input
  if (!text || text.trim() === '') {
    throw new Error('No text provided for AI processing');
  }

  console.log('AI Service - Processing request:', text.substring(0, 50) + '...');
  console.log('AI Service - API configured:', isConfigured());

  // If API is not configured, use mock response
  if (!isConfigured()) {
    console.warn('Groq API key not configured, using mock response');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    return getMockResponse();
  }

  try {
    // Prepare the request
    const requestBody = {
      model: options.model || 'llama-3.1-8b-instant', // Updated to current Groq model
      messages: [
        {
          role: 'system',
          content: options.systemPrompt || 'You are a knowledgeable and helpful AI assistant. Provide detailed, accurate, and informative responses to user questions. When asked about topics like programming languages, technologies, or concepts, give comprehensive explanations that include key features, uses, and examples. Keep your responses conversational but thorough, as they will be spoken aloud to the user.'
        },
        {
          role: 'user',
          content: text
        }
      ],
      max_tokens: options.maxTokens || 1000, // Groq allows more tokens
      temperature: options.temperature || 0.7,
      top_p: options.topP || 1,
      stream: false
    };

    console.log('AI Service - Making API request to Groq...');

    // Make the API request
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });

    console.log('AI Service - API response status:', response.status);

    // Handle HTTP errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('AI Service - API error:', errorData);
      
      switch (response.status) {
        case 401:
          throw new Error('Invalid API key. Please check your Groq API key.');
        case 429:
          throw new Error('Rate limit exceeded. Please try again in a moment.');
        case 500:
          throw new Error('Groq service is temporarily unavailable. Please try again later.');
        case 503:
          throw new Error('Groq service is overloaded. Please try again later.');
        default:
          throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
      }
    }

    // Parse the response
    const data = await response.json();
    console.log('AI Service - API response received, choices:', data.choices?.length);
    
    // Validate response structure
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('AI Service - Invalid response structure:', data);
      throw new Error('Invalid response format from Groq API');
    }

    const aiResponse = data.choices[0].message.content.trim();
    
    if (!aiResponse) {
      throw new Error('Empty response from AI service');
    }

    console.log('AI Service - Response generated successfully, length:', aiResponse.length);
    return aiResponse;

  } catch (error) {
    console.error('AI Service Error:', error);
    
    // If it's a network error or API error, try to provide a fallback
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your internet connection and try again.');
    }
    
    // Re-throw the error for the caller to handle
    throw error;
  }
};

// Get AI response with retry logic
export const getAIResponseWithRetry = async (text, options = {}, maxRetries = 2) => {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await getAIResponse(text, options);
    } catch (error) {
      lastError = error;
      
      // Don't retry for certain errors
      if (error.message.includes('Invalid API key') || 
          error.message.includes('Rate limit exceeded')) {
        throw error;
      }
      
      // If this is the last attempt, throw the error
      if (attempt === maxRetries) {
        break;
      }
      
      // Wait before retrying (exponential backoff)
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  // If all retries failed, fall back to mock response
  console.warn('All API attempts failed, falling back to mock response:', lastError.message);
  return getMockResponse();
};

// Conversation context management
class ConversationContext {
  constructor(maxMessages = 10) {
    this.messages = [];
    this.maxMessages = maxMessages;
  }

  addMessage(role, content) {
    this.messages.push({ role, content });
    
    // Keep only the last N messages to avoid token limits
    if (this.messages.length > this.maxMessages) {
      this.messages = this.messages.slice(-this.maxMessages);
    }
  }

  getMessages() {
    return [...this.messages];
  }

  clear() {
    this.messages = [];
  }
}

// Create a default conversation context
export const conversationContext = new ConversationContext();

// Test function to verify API connectivity
export const testAPIConnection = async () => {
  console.log('Testing API connection...');
  console.log('API Key configured:', isConfigured());
  console.log('API Key length:', API_KEY?.length);
  console.log('API Key prefix:', API_KEY?.substring(0, 20));
  
  if (!isConfigured()) {
    return { success: false, error: 'API key not configured' };
  }
  
  try {
    const testResponse = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'user',
            content: 'Say "API test successful"'
          }
        ],
        max_tokens: 10
      })
    });
    
    console.log('Test API response status:', testResponse.status);
    
    if (!testResponse.ok) {
      const errorData = await testResponse.json().catch(() => ({}));
      console.error('Test API error:', errorData);
      return { success: false, error: errorData.error?.message || `HTTP ${testResponse.status}` };
    }
    
    const data = await testResponse.json();
    console.log('Test API response:', data);
    
    return { 
      success: true, 
      response: data.choices?.[0]?.message?.content || 'No content' 
    };
    
  } catch (error) {
    console.error('Test API connection error:', error);
    return { success: false, error: error.message };
  }
};
export const getAIResponseWithContext = async (text, options = {}) => {
  try {
    console.log('AI Service - Getting response with context for:', text.substring(0, 50) + '...');
    
    // Add user message to context
    conversationContext.addMessage('user', text);
    
    // Prepare messages with context
    const messages = [
      {
        role: 'system',
        content: options.systemPrompt || 'You are a knowledgeable and helpful AI assistant. Provide detailed, accurate, and informative responses to user questions. When asked about topics like programming languages, technologies, or concepts, give comprehensive explanations that include key features, uses, and examples. Keep your responses conversational but thorough, as they will be spoken aloud to the user. Remember our conversation history and build upon previous topics when relevant.'
      },
      ...conversationContext.getMessages()
    ];

    // Make API request with context
    const requestBody = {
      model: options.model || 'llama-3.1-8b-instant',
      messages,
      max_tokens: options.maxTokens || 1000,
      temperature: options.temperature || 0.7,
      stream: false
    };

    if (!isConfigured()) {
      console.warn('Groq API key not configured, using mock response');
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      const response = getMockResponse();
      conversationContext.addMessage('assistant', response);
      return response;
    }

    console.log('AI Service - Making context-aware API request...');
    console.log('AI Service - Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });

    console.log('AI Service - Context API response status:', response.status);
    console.log('AI Service - Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('AI Service - Context API error:', errorData);
      
      // Handle specific error types
      let errorMessage = errorData.error?.message || `API request failed with status ${response.status}`;
      
      if (response.status === 401) {
        errorMessage = 'Invalid Groq API key. Please check your API key configuration.';
      } else if (response.status === 429) {
        errorMessage = 'Rate limit exceeded. Please try again in a moment.';
      } else if (response.status === 402) {
        errorMessage = 'Groq API quota exceeded. Please check your usage limits.';
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from Groq API');
    }
    
    const aiResponse = data.choices[0].message.content.trim();
    
    // Add AI response to context
    conversationContext.addMessage('assistant', aiResponse);
    
    console.log('AI Service - Context response generated successfully, length:', aiResponse.length);
    return aiResponse;

  } catch (error) {
    console.error('AI Service Context Error:', error);
    
    // Show quota errors to user instead of falling back
    if (error.message.includes('quota exceeded') || 
        error.message.includes('insufficient_quota')) {
      conversationContext.addMessage('assistant', 'Sorry, the Groq API quota has been exceeded. Please check your usage limits.');
      throw error;
    }
    
    // Only fallback to mock for network errors
    if (error.message.includes('Invalid API key') || 
        error.message.includes('Rate limit exceeded') ||
        error.message.includes('API request failed')) {
      // Re-throw API errors instead of falling back
      conversationContext.addMessage('assistant', `Error: ${error.message}`);
      throw error;
    }
    
    // Fallback to mock response only for network errors
    const fallbackResponse = getMockResponse();
    conversationContext.addMessage('assistant', fallbackResponse);
    return fallbackResponse;
  }
};