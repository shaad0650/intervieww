import { useState, useCallback } from 'react';
import { generateAnswer } from '../services/api.js';

export const useOpenAI = () => {
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const processQuestion = useCallback(async (question, style = 'concise') => {
    setIsLoading(true);
    setError(null);
    
    try {
      const answer = await generateAnswer(question, style);
      setResponse(answer);
      return answer;
    } catch (err) {
      setError(`Failed to generate answer: ${err.message}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResponse = useCallback(() => {
    setResponse('');
  }, []);

  return {
    response,
    isLoading,
    error,
    processQuestion,
    clearResponse
  };
};