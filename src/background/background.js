// Listen for messages from the content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'openPopup') {
      chrome.action.openPopup();
      sendResponse({ success: true });
    }
    
    // Store new answers in history
    if (message.type === 'NEW_ANSWER') {
      chrome.storage.local.get(['answerHistory'], (result) => {
        const history = result.answerHistory || [];
        history.unshift({
          question: message.data.question,
          answer: message.data.answer,
          timestamp: Date.now()
        });
        
        // Keep only the last 10 entries
        const trimmedHistory = history.slice(0, 10);
        
        chrome.storage.local.set({ answerHistory: trimmedHistory });
      });
    }
  });
  
  // Initialize any background processes
  console.log('Interview Assistant background script initialized');