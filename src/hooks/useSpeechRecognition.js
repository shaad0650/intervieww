import { useState, useCallback, useEffect } from 'react';

export const useSpeechRecognition = (language = 'en-US') => {
  const [stream, setStream] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);

  const clearTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        throw new Error('Speech recognition not supported in this browser');
      }
      
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language;
      
      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        if (finalTranscript) {
          setTranscript((prev) => prev + ' ' + finalTranscript);
        }
      };
      
      recognition.onerror = (event) => {
        setError(`Speech recognition error: ${event.error}`);
      };
      
      recognition.start();
      
      // Get audio stream for visualization
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(audioStream);
      setIsRecording(true);
      
      return recognition;
    } catch (error) {
      setError(`Failed to start recording: ${error.message}`);
      throw error;
    }
  }, [language]);

  const stopRecording = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsRecording(false);
  }, [stream]);

  return {
    stream,
    transcript,
    isRecording,
    error,
    startRecording,
    stopRecording,
    clearTranscript
  };
};