import axios from 'axios';

const API_URL = 'https://api.openai.com/v1/chat/completions';

export const generateAnswer = async (question, style = 'concise') => {
  try {
    const systemPrompt = getSystemPrompt(style);
    
    const response = await axios.post(
      API_URL,
      {
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question }
        ],
        max_tokens: 150,
        temperature: 0.7
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating answer:', error);
    throw new Error('Failed to generate answer. Please try again.');
  }
};

const getSystemPrompt = (style) => {
  const basePrompt = `
    You are an AI-powered interview assistant designed to provide real-time, professional, and well-structured answers to interview questions.
    
    Guidelines:
    - Keep responses concise, clear, and informative (max 100 words).
    - Maintain a formal and professional tone.
    - If the question is technical, provide a precise and accurate explanation.
    - If the question is behavioral, structure the response using the STAR method (Situation, Task, Action, Result).
    - If the question is ambiguous, ask for clarification.
  `;
  
  if (style === 'concise') {
    return `${basePrompt} Focus on being extremely concise while maintaining clarity.`;
  } else if (style === 'detailed') {
    return `${basePrompt} Provide more detailed explanations with examples where appropriate.`;
  }
  
  return basePrompt;
};

export const transcribeAudio = async (audioBlob, language = 'en-US') => {
  // Implement audio transcription if needed
  // For now, we're using the browser's built-in speech recognition
  return '';
};