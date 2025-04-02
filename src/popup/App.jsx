import React, { useState, useEffect } from 'react';
import { useSpeechRecognition, useOpenAI } from '@hooks';
import './popup.css';

const App = () => {
  const [tab, setTab] = useState('record'); // 'record' or 'history'
  const [settings, setSettings] = useState({
    language: 'en-US',
    answerStyle: 'concise',
    autoDisplay: true
  });
  const [history, setHistory] = useState([]);

  const {
    transcript,
    isRecording,
    error: recordingError,
    startRecording,
    stopRecording,
    clearTranscript
  } = useSpeechRecognition(settings.language);

  const {
    response,
    isLoading,
    error: aiError,
    processQuestion,
    clearResponse
  } = useOpenAI();

  // Load answer history
  useEffect(() => {
    chrome.storage.local.get(['answerHistory'], (result) => {
      if (result.answerHistory) {
        setHistory(result.answerHistory);
      }
    });
  }, []);

  // Handle recording start
  const handleStart = async () => {
    clearTranscript();
    clearResponse();
    await startRecording();
  };

  // Handle recording stop and process the question
  const handleStop = async () => {
    await stopRecording();
    if (transcript.trim()) {
      try {
        const answer = await processQuestion(transcript, settings.answerStyle);
        
        // Store in history
        const newEntry = {
          question: transcript,
          answer: answer,
          timestamp: Date.now()
        };
        
        const updatedHistory = [newEntry, ...history].slice(0, 10);
        setHistory(updatedHistory);
        chrome.storage.local.set({ answerHistory: updatedHistory });
        
        // Display answer in the current tab's page if auto-display is enabled
        if (settings.autoDisplay) {
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
              chrome.tabs.sendMessage(tabs[0].id, {
                action: 'displayAnswer',
                answer: answer
              });
            }
          });
        }
      } catch (error) {
        console.error('Error processing question:', error);
      }
    }
  };

  // Clear history
  const clearHistory = () => {
    setHistory([]);
    chrome.storage.local.set({ answerHistory: [] });
  };

  return (
    <div className="popup-container">
      <header className="header">
        <h1>AI Interview Assistant</h1>
        <div className="tabs">
          <button 
            className={tab === 'record' ? 'active' : ''} 
            onClick={() => setTab('record')}
          >
            Record
          </button>
          <button 
            className={tab === 'history' ? 'active' : ''} 
            onClick={() => setTab('history')}
          >
            History
          </button>
          <button 
            className={tab === 'settings' ? 'active' : ''} 
            onClick={() => setTab('settings')}
          >
            Settings
          </button>
        </div>
      </header>

      {tab === 'record' && (
        <div className="record-tab">
          <div className="transcript-box">
            <div className="transcript-header">
              <h3>Question</h3>
              <span className={isRecording ? 'recording-indicator active' : 'recording-indicator'}>
                {isRecording ? 'Recording...' : 'Paused'}
              </span>
            </div>
            <div className="transcript-content">
              {transcript || 'Speak or paste your question here...'}
            </div>
          </div>

          {response && (
            <div className="answer-box">
              <h3>Answer</h3>
              <div className="answer-content">
                {response}
              </div>
            </div>
          )}

          <div className="controls">
            <button
              className="btn-primary"
              onClick={handleStart}
              disabled={isRecording || isLoading}
            >
              Start Listening
            </button>
            <button
              className="btn-danger"
              onClick={handleStop}
              disabled={!isRecording || isLoading}
            >
              Stop & Process
            </button>
          </div>

          {isLoading && (
            <div className="loading-indicator">
              Generating answer...
            </div>
          )}

          {(recordingError || aiError) && (
            <div className="error-message">
              {recordingError || aiError}
            </div>
          )}
        </div>
      )}

      {tab === 'history' && (
        <div className="history-tab">
          <div className="history-header">
            <h3>Recent Questions</h3>
            <button className="btn-small" onClick={clearHistory}>
              Clear All
            </button>
          </div>
          
          {history.length === 0 ? (
            <div className="empty-state">No questions yet</div>
          ) : (
            <div className="history-list">
              {history.map((item, index) => (
                <div key={index} className="history-item">
                  <div className="history-question">{item.question}</div>
                  <div className="history-answer">{item.answer}</div>
                  <div className="history-time">
                    {new Date(item.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'settings' && (
        <div className="settings-tab">
          <div className="setting-item">
            <label htmlFor="language">Language</label>
            <select
              id="language"
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
            >
              <option value="en-US">English (US)</option>
              <option value="en-GB">English (UK)</option>
              <option value="es-ES">Spanish</option>
              <option value="fr-FR">French</option>
              <option value="de-DE">German</option>
            </select>
          </div>

          <div className="setting-item">
            <label htmlFor="answerStyle">Answer Style</label>
            <select
              id="answerStyle"
              value={settings.answerStyle}
              onChange={(e) => setSettings({ ...settings, answerStyle: e.target.value })}
            >
              <option value="concise">Concise</option>
              <option value="detailed">Detailed</option>
            </select>
          </div>

          <div className="setting-item checkbox">
            <label htmlFor="autoDisplay">
              <input
                type="checkbox"
                id="autoDisplay"
                checked={settings.autoDisplay}
                onChange={(e) => setSettings({ ...settings, autoDisplay: e.target.checked })}
              />
              Auto-display answers in current page
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;